import { NextResponse } from 'next/server'
import { calculatorRegistry } from '@/lib/registry/loader'

interface RouteParams {
	params: {
		id: string
	}
}

/**
 * GET /api/calculators/[id]
 * Get calculator by ID
 */
export async function GET(
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

		// Return simplified calculator info (without calculate function)
		const simplified = {
			id: calculator.id,
			slug: calculator.slug,
			category: calculator.category,
			title: calculator.title,
			shortDescription: calculator.shortDescription,
			longDescription: calculator.longDescription,
			locale: calculator.locale,
			inputs: calculator.inputs.map((inp) => ({
				name: inp.name,
				label: inp.label,
				type: inp.type,
				unitLabel: inp.unitLabel,
				placeholder: inp.placeholder,
				options: inp.options,
				min: inp.min,
				max: inp.max,
				step: inp.step,
				defaultValue: inp.defaultValue,
				helpText: inp.helpText,
			})),
			outputs: calculator.outputs.map((out) => ({
				name: out.name,
				label: out.label,
				unitLabel: out.unitLabel,
			})),
			howToBullets: calculator.howToBullets,
			examples: calculator.examples,
			faq: calculator.faq,
			relatedIds: calculator.relatedIds,
			standardIds: calculator.standardIds,
		}

		return NextResponse.json(simplified)
	} catch (error) {
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}








