import { NextResponse } from 'next/server'
import { calculatorRegistry } from '@/lib/registry/loader'
import { isLocale, resolveRequestLocale } from '@/lib/i18n'
import { assertFiniteResults } from '@/lib/calculations/result-safety'
import { isCalculationDomainError } from '@/lib/calculations/domain-error'
import {
	assertRequiredOutputsPresent,
	mergeCalculatorInputDefaults,
} from '@/lib/calculators/apply-defaults'

interface RouteParams {
	params: {
		id: string
	}
}

/**
 * Public API must never leak stack traces or internal Error messages.
 */
function publicServerError(): NextResponse {
	return NextResponse.json(
		{ error: 'An unexpected error occurred' },
		{ status: 500 },
	)
}

/**
 * POST /api/calculators/[id]/calculate
 * Perform calculation on the server.
 *
 * Locale contract (must stay in sync with calculator-page.tsx):
 * - Preferred: JSON body `{ locale, inputs }`
 * - Also accepted: `?locale=` query (defense in depth / non-UI clients)
 * - Body wins when both are present and valid
 * - Invalid locale values are rejected (400), never silently remapped
 */
export async function POST(
	request: Request,
	{ params }: RouteParams,
): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url)
		const queryLocale = searchParams.get('locale')

		// Parse body once so locale and inputs share the same payload
		const body = await request.json().catch(() => ({}))
		const bodyLocale = body?.locale

		// Reject explicitly invalid locale strings (do not fall through to "en")
		if (bodyLocale !== undefined && bodyLocale !== null && bodyLocale !== '' && !isLocale(bodyLocale)) {
			return NextResponse.json(
				{ error: `Unsupported locale: ${String(bodyLocale)}` },
				{ status: 400 },
			)
		}
		if (queryLocale !== null && queryLocale !== '' && !isLocale(queryLocale)) {
			return NextResponse.json(
				{ error: `Unsupported locale: ${queryLocale}` },
				{ status: 400 },
			)
		}

		const locale = resolveRequestLocale(bodyLocale, queryLocale)

		const calculator = await calculatorRegistry.getById(params.id, locale)

		if (!calculator) {
			return NextResponse.json(
				{ error: 'Calculator not found' },
				{ status: 404 },
			)
		}

		const rawInputs = (body.inputs || {}) as Record<string, unknown>

		// Seed select defaults first so visibleIf conditions resolve correctly
		const inputsForVisibility: Record<string, unknown> = { ...rawInputs }
		for (const input of calculator.inputs) {
			if (input.type !== 'select') continue
			const current = inputsForVisibility[input.name]
			if (
				(current === undefined || current === null || current === '') &&
				input.defaultValue !== undefined
			) {
				inputsForVisibility[input.name] = input.defaultValue
			}
		}

		const shouldShowInput = (input: typeof calculator.inputs[0]): boolean => {
			if (!input.visibleIf) return true
			const { field, value } = input.visibleIf
			const fieldValue = inputsForVisibility[field]
			return String(fieldValue) === String(value)
		}

		// Server-side defaults before validation / calculation (clients can omit UI defaults)
		const processedInputs = mergeCalculatorInputDefaults(
			calculator,
			inputsForVisibility,
			shouldShowInput,
		)

		// Validate visible inputs against the merged payload
		const errors: Record<string, string> = {}
		const visibleInputs = calculator.inputs.filter(shouldShowInput)

		visibleInputs.forEach((input) => {
			const value = processedInputs[input.name]

			if (
				input.validation?.required &&
				(value === undefined || value === '')
			) {
				errors[input.name] = `${input.label} is required`
				return
			}

			if (input.type === 'number' && value !== undefined && value !== '') {
				const numValue = Number(value)
				if (isNaN(numValue) || !Number.isFinite(numValue)) {
					errors[input.name] = `${input.label} must be a valid number`
					return
				}

				const min =
					input.validation?.min !== undefined
						? input.validation.min
						: input.min
				const max =
					input.validation?.max !== undefined
						? input.validation.max
						: input.max

				if (typeof min === 'number' && numValue < min) {
					errors[input.name] = `${input.label} must be at least ${min}`
					return
				}

				if (typeof max === 'number' && numValue > max) {
					errors[input.name] = `${input.label} must be at most ${max}`
					return
				}
			}
		})

		if (Object.keys(errors).length > 0) {
			return NextResponse.json({ errors, error: 'Validation failed' }, { status: 400 })
		}

		// Always include shape/select fields (they control visibility)
		calculator.inputs
			.filter((input) => input.type === 'select')
			.forEach((input) => {
				if (processedInputs[input.name] === undefined && inputsForVisibility[input.name] !== undefined) {
					const selectValue = inputsForVisibility[input.name]
					if (
						typeof selectValue === 'string' ||
						typeof selectValue === 'number' ||
						typeof selectValue === 'boolean'
					) {
						processedInputs[input.name] = selectValue
					}
				}
			})

		// Perform calculation
		try {
			if (calculator.isEnabled === false) {
				return NextResponse.json(
					{
						error: 'This calculator is being migrated and is temporarily unavailable',
					},
					{ status: 503 },
				)
			}

			// Inject request locale only for engines that need it (avoid polluting
			// formula variable scopes with an unused `locale` key).
			const localeAwareIds = new Set(['numbers-to-words'])
			const calcInputs = localeAwareIds.has(calculator.id) || localeAwareIds.has(calculator.slug)
				? { ...processedInputs, locale }
				: processedInputs
			const results = calculator.calculate(calcInputs)

			// Reject Infinity/NaN before JSON serialization (which would coerce them to null)
			assertFiniteResults(results, 'results')
			assertRequiredOutputsPresent(calculator, results)

			// Format results
			const { formatOutputValue } = await import('@/lib/calculators/format')
			const formattedResults: Record<string, string> = {}
			calculator.outputs.forEach((output) => {
				const value = results[output.name]
				// Skip formatting for arrays — they are handled in the UI component
				if (Array.isArray(value)) {
					formattedResults[output.name] = ''
				} else if (output.name === 'mode' && typeof value === 'string') {
					formattedResults[output.name] = value
				} else {
					formattedResults[output.name] = formatOutputValue(
						value,
						output.formatType,
						output.unitLabel,
					)
				}
			})

			return NextResponse.json({
				results,
				formattedResults,
				locale,
				calculator: {
					id: calculator.id,
					title: calculator.title,
				},
			})
		} catch (error) {
			if (isCalculationDomainError(error)) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode },
				)
			}
			// Legacy engines still throw plain Error for user/domain validation.
			// Map those to 400 without treating unexpected failures as client errors.
			if (error instanceof Error) {
				const message = error.message || ''
				const looksLikeDomain =
					/required|invalid|must be|must not|out of range|cannot|unsupported|too large|too small|не |обязательн|некоррект|недопустим/i.test(
						message,
					) && !/ENOENT|ECONN|Cannot find module|Unexpected token/i.test(message)
				if (looksLikeDomain) {
					return NextResponse.json({ error: message }, { status: 400 })
				}
			}
			return publicServerError()
		}
	} catch {
		return publicServerError()
	}
}
