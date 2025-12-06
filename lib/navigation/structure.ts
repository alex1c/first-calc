/**
 * Navigation structure and content strategy
 * Provides functions for popular, new, and recommended calculators
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'

/**
 * Popular calculator IDs (static for now, can be made dynamic via analytics)
 */
const POPULAR_CALCULATOR_IDS: Record<string, string[]> = {
	en: [
		'percentage-of-a-number',
		'loan-payment',
		'add-percentage',
		'subtract-percentage',
		'compound-interest',
	],
	ru: ['percentage-of-a-number', 'loan-payment'],
	es: ['percentage-of-a-number', 'loan-payment'],
	tr: ['percentage-of-a-number'],
	hi: ['percentage-of-a-number'],
}

/**
 * Get popular calculators for a locale
 */
export async function getPopularCalculators(
	locale: string = 'en',
): Promise<CalculatorDefinition[]> {
	const popularIds = POPULAR_CALCULATOR_IDS[locale] || POPULAR_CALCULATOR_IDS['en']
	const allCalculators = await calculatorRegistry.getAll(locale)

	return popularIds
		.map((id) => allCalculators.find((calc) => calc.id === id))
		.filter((calc): calc is CalculatorDefinition => calc !== undefined)
}

/**
 * Get new calculators (recently added)
 * For now, returns calculators sorted by ID (newest first)
 * In future, can use a "createdAt" field
 */
export async function getNewCalculators(
	locale: string = 'en',
	limit: number = 5,
): Promise<CalculatorDefinition[]> {
	const allCalculators = await calculatorRegistry.getAll(locale)

	// Sort by ID (assuming newer calculators have later IDs)
	// In production, use createdAt timestamp
	return allCalculators
		.sort((a, b) => b.id.localeCompare(a.id))
		.slice(0, limit)
}

/**
 * Get recommended calculators based on category and locale
 * Uses simple heuristics: same category, related calculators
 */
export async function getRecommendedCalculators(
	locale: string = 'en',
	options?: {
		category?: string
		excludeIds?: string[]
		limit?: number
	},
): Promise<CalculatorDefinition[]> {
	const { category, excludeIds = [], limit = 5 } = options || {}
	const allCalculators = await calculatorRegistry.getAll(locale)

	let recommended = allCalculators.filter(
		(calc) => !excludeIds.includes(calc.id),
	)

	// Filter by category if provided
	if (category) {
		recommended = recommended.filter((calc) => calc.category === category)
	}

	// If we have related calculators, prioritize them
	if (excludeIds.length > 0) {
		const related: CalculatorDefinition[] = []
		const others: CalculatorDefinition[] = []

		recommended.forEach((calc) => {
			if (
				calc.relatedIds?.some((id) => excludeIds.includes(id)) ||
				excludeIds.some((id) => calc.relatedIds?.includes(id))
			) {
				related.push(calc)
			} else {
				others.push(calc)
			}
		})

		recommended = [...related, ...others]
	}

	return recommended.slice(0, limit)
}

/**
 * Get calculators by category with popularity boost
 */
export async function getCalculatorsByCategoryWithPopularity(
	category: string,
	locale: string = 'en',
): Promise<CalculatorDefinition[]> {
	const calculators = await calculatorRegistry.getByCategory(category, locale)
	const popularIds = POPULAR_CALCULATOR_IDS[locale] || []

	// Sort: popular first, then alphabetically
	return calculators.sort((a, b) => {
		const aPopular = popularIds.includes(a.id)
		const bPopular = popularIds.includes(b.id)

		if (aPopular && !bPopular) return -1
		if (!aPopular && bPopular) return 1
		return a.title.localeCompare(b.title)
	})
}

