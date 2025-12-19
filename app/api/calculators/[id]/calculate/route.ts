import { NextResponse } from 'next/server'
import { calculatorRegistry } from '@/lib/registry/loader'

interface RouteParams {
	params: {
		id: string
	}
}

/**
 * POST /api/calculators/[id]/calculate
 * Perform calculation on the server
 */
export async function POST(
	request: Request,
	{ params }: RouteParams,
): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url)
		const locale = searchParams.get('locale') || 'en'

		const calculator = await calculatorRegistry.getById(params.id, locale)

		if (!calculator) {
			return NextResponse.json(
				{ error: 'Calculator not found' },
				{ status: 404 },
			)
		}

		// Parse request body
		const body = await request.json()
		const inputs = body.inputs || {}

		// Determine which inputs should be visible based on visibleIf conditions
		const shouldShowInput = (input: typeof calculator.inputs[0]): boolean => {
			if (!input.visibleIf) return true
			const { field, value } = input.visibleIf
			const fieldValue = inputs[field]
			return String(fieldValue) === String(value)
		}

		// Validate only visible inputs
		const errors: Record<string, string> = {}
		const visibleInputs = calculator.inputs.filter(shouldShowInput)
		
		visibleInputs.forEach((input) => {
			const value = inputs[input.name]
			
			if (input.validation?.required && (value === undefined || value === '')) {
				errors[input.name] = `${input.label} is required`
				return
			}

			// Only validate as number if input type is 'number'
			if (input.type === 'number' && value !== undefined && value !== '') {
				const numValue = Number(value)
				if (isNaN(numValue)) {
					errors[input.name] = `${input.label} must be a number`
					return
				}

				if (input.validation?.min !== undefined && numValue < input.validation.min) {
					errors[input.name] = `${input.label} must be at least ${input.validation.min}`
					return
				}

				if (input.validation?.max !== undefined && numValue > input.validation.max) {
					errors[input.name] = `${input.label} must be at most ${input.validation.max}`
					return
				}
			}
		})

		if (Object.keys(errors).length > 0) {
			return NextResponse.json({ errors, error: 'Validation failed' }, { status: 400 })
		}

		// Convert inputs to appropriate types (only for visible inputs)
		const processedInputs: Record<string, number | string> = {}
		calculator.inputs
			.filter(shouldShowInput)
			.forEach((input) => {
				let value = inputs[input.name]
				if (input.type === 'number') {
					value = value === '' ? 0 : Number(value)
				}
				processedInputs[input.name] = value
			})

		// Always include shape/select fields (they control visibility)
		calculator.inputs
			.filter((input) => input.type === 'select')
			.forEach((input) => {
				if (inputs[input.name] !== undefined) {
					processedInputs[input.name] = inputs[input.name]
				}
			})

		// Perform calculation
		try {
			// Check if calculator is disabled
			if (calculator.isEnabled === false) {
				return NextResponse.json(
					{
						error: 'This calculator is being migrated and is temporarily unavailable',
					},
					{ status: 503 },
				)
			}

			const results = calculator.calculate(processedInputs)

			// Format results
			const { formatOutputValue } = await import('@/lib/calculators/format')
			const formattedResults: Record<string, string> = {}
			calculator.outputs.forEach((output) => {
				const value = results[output.name]
				// Skip formatting for arrays (like roots, mode, sortedData) - they will be formatted in the UI component
				// Arrays are passed as-is in results, not in formattedResults
				if (Array.isArray(value)) {
					// Don't format arrays, they will be handled in the UI component
					formattedResults[output.name] = ''
				} else if (output.name === 'mode' && typeof value === 'string') {
					// Mode can be "No mode" string
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
				calculator: {
					id: calculator.id,
					title: calculator.title,
				},
			})
		} catch (error) {
			return NextResponse.json(
				{
					error:
						error instanceof Error
							? error.message
							: 'Calculation failed',
				},
				{ status: 500 },
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}




