import { NextResponse } from 'next/server'
import { calculatorRegistry } from '@/lib/registry/loader'

/**
 * GET /api/calculators
 * Get all calculators for a locale
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const locale = searchParams.get('locale') || 'en'
		const category = searchParams.get('category')

		let calculators

		if (category) {
			calculators = await calculatorRegistry.getByCategory(category, locale)
		} else {
			calculators = await calculatorRegistry.getAll(locale)
		}

		// Return simplified calculator info (without calculate function)
		const simplified = calculators.map((calc) => ({
			id: calc.id,
			slug: calc.slug,
			category: calc.category,
			title: calc.title,
			shortDescription: calc.shortDescription,
			locale: calc.locale,
			inputs: calc.inputs.map((inp) => ({
				name: inp.name,
				label: inp.label,
				type: inp.type,
				unitLabel: inp.unitLabel,
				min: inp.min,
				max: inp.max,
				step: inp.step,
			})),
			outputs: calc.outputs.map((out) => ({
				name: out.name,
				label: out.label,
				unitLabel: out.unitLabel,
			})),
		}))

		return NextResponse.json({
			calculators: simplified,
			count: simplified.length,
		})
	} catch (error) {
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}






