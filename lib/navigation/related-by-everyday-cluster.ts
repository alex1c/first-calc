/**
 * Get related calculators based on everyday clusters
 * Prioritizes calculators from the same cluster, then logical next steps
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'
import { getClusterForEverydayCalculator, getCalculatorsInEverydayCluster, type EverydayCluster } from './everyday-clusters'

/**
 * Get related calculators for an everyday calculator based on cluster logic
 * 
 * @param calculatorId - Calculator ID
 * @param locale - Locale
 * @param limit - Maximum number of calculators to return (default: 6)
 * @returns Array of related calculator definitions
 */
export async function getRelatedByEverydayCluster(
	calculatorId: string,
	locale: string,
	limit: number = 6,
): Promise<CalculatorDefinition[]> {
	const cluster = getClusterForEverydayCalculator(calculatorId)
	
	if (!cluster) {
		return []
	}

	// Get calculators in the same cluster
	const sameClusterIds = getCalculatorsInEverydayCluster(cluster)
		.filter((id) => id !== calculatorId) // Exclude current calculator

	// Get calculators from same cluster first (2-3 items)
	const sameClusterCalculators: CalculatorDefinition[] = []
	for (const id of sameClusterIds.slice(0, 3)) {
		const calc = await calculatorRegistry.getById(id, locale)
		if (calc) {
			sameClusterCalculators.push(calc)
		}
	}

	// Get logical next-step calculators (1-2 items)
	// Based on user flows defined in the task
	const nextStepIds = getNextStepCalculators(calculatorId, cluster)
	const nextStepCalculators: CalculatorDefinition[] = []
	for (const id of nextStepIds.slice(0, 2)) {
		// Skip if already in same cluster results
		if (sameClusterCalculators.some((c) => c.id === id)) {
			continue
		}
		const calc = await calculatorRegistry.getById(id, locale)
		if (calc) {
			nextStepCalculators.push(calc)
		}
	}

	// Combine and limit
	const allRelated = [...sameClusterCalculators, ...nextStepCalculators]
	return allRelated.slice(0, limit)
}

/**
 * Get logical next-step calculators based on user flows
 * 
 * @param calculatorId - Current calculator ID
 * @param cluster - Current cluster
 * @returns Array of next-step calculator IDs
 */
function getNextStepCalculators(calculatorId: string, cluster: EverydayCluster): string[] {
	// Flow A — Time & life events: Age → Days Between Dates → Date Calculator → Countdown
	if (calculatorId === 'age-calculator') {
		return ['days-between-dates-calculator', 'date-calculator']
	}
	if (calculatorId === 'days-between-dates-calculator') {
		return ['age-calculator', 'date-calculator']
	}
	if (calculatorId === 'date-calculator') {
		return ['days-between-dates-calculator', 'age-calculator']
	}

	// Flow B — Numbers & text: Numbers to Words → Roman Numerals → Percentage Calculator
	if (calculatorId === 'numbers-to-words-calculator') {
		return ['roman-numerals-converter', 'random-number-generator']
	}
	if (calculatorId === 'roman-numerals-converter') {
		return ['numbers-to-words-calculator', 'random-number-generator']
	}

	// Flow C — Home tasks: Room Area → Paint → Wallpaper
	if (calculatorId === 'room-area-calculator') {
		return ['paint-calculator', 'cooking-measurement-converter']
	}
	if (calculatorId === 'paint-calculator') {
		return ['room-area-calculator', 'cooking-measurement-converter']
	}
	if (calculatorId === 'cooking-measurement-converter') {
		return ['room-area-calculator', 'paint-calculator']
	}

	// Flow D — Light interaction: Random Number → Lucky Number → Numbers to Words
	if (calculatorId === 'random-number-generator') {
		return ['numbers-to-words-calculator', 'roman-numerals-converter']
	}

	return []
}

