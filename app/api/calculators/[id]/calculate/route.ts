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

		// Validate inputs
		const errors: Record<string, string> = {}
		calculator.inputs.forEach((input) => {
			const value = inputs[input.name]
			if (input.validation?.required && (value === undefined || value === '')) {
				errors[input.name] = `${input.label} is required`
				return
			}

			if (value !== undefined && value !== '') {
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
			return NextResponse.json({ errors }, { status: 400 })
		}

		// Convert inputs to appropriate types
		const processedInputs: Record<string, number | string> = {}
		calculator.inputs.forEach((input) => {
			let value = inputs[input.name]
			if (input.type === 'number') {
				value = value === '' ? 0 : Number(value)
			}
			processedInputs[input.name] = value
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
				formattedResults[output.name] = formatOutputValue(
					value,
					output.formatType,
					output.unitLabel,
				)
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




