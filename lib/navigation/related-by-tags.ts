/**
 * Get related calculators by tag overlap
 * Finds calculators with maximum tag intersection
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'

/**
 * Get related calculators by tag overlap
 * 
 * @param calculatorId - ID of the current calculator
 * @param locale - Locale code
 * @param limit - Maximum number of related calculators to return (default: 8)
 * @returns Array of related calculators sorted by tag overlap
 */
export async function getRelatedByTags(
	calculatorId: string,
	locale: string,
	limit: number = 8,
): Promise<CalculatorDefinition[]> {
	// Get current calculator
	const currentCalculator = await calculatorRegistry.getById(calculatorId, locale)
	
	if (!currentCalculator || !currentCalculator.tags || currentCalculator.tags.length === 0) {
		// Fallback to category if no tags
		if (currentCalculator) {
			const categoryCalcs = await calculatorRegistry.getByCategory(
				currentCalculator.category,
				locale,
			)
			return categoryCalcs
				.filter((calc) => calc.id !== calculatorId)
				.slice(0, limit)
		}
		return []
	}
	
	// Get all calculators
	const allCalculators = await calculatorRegistry.getAll(locale)
	
	// Calculate tag overlap for each calculator
	const calculatorsWithScore = allCalculators
		.filter((calc) => calc.id !== calculatorId && calc.tags && calc.tags.length > 0)
		.map((calc) => {
			// Count overlapping tags
			const currentTags = new Set(currentCalculator.tags || [])
			const calcTags = new Set(calc.tags || [])
			let overlap = 0
			
			for (const tag of calcTags) {
				if (currentTags.has(tag)) {
					overlap++
				}
			}
			
			return {
				calculator: calc,
				overlap,
				totalTags: calcTags.size,
			}
		})
		.filter((item) => item.overlap > 0) // Only calculators with at least one common tag
		.sort((a, b) => {
			// Sort by overlap (descending), then by total tags (ascending) for tie-breaking
			if (b.overlap !== a.overlap) {
				return b.overlap - a.overlap
			}
			return a.totalTags - b.totalTags
		})
		.slice(0, limit)
		.map((item) => item.calculator)
	
	return calculatorsWithScore
}

