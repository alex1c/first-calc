/**
 * Get related calculators by cluster
 * Used for internal linking within math category
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'
import { getClusterForCalculator, getCalculatorsInCluster, type MathCluster } from './math-clusters'

/**
 * Get related calculators from the same cluster
 * 
 * @param calculatorId - Current calculator ID
 * @param locale - Locale
 * @param limit - Maximum number of calculators to return
 * @returns Array of related calculators
 */
export async function getRelatedByCluster(
	calculatorId: string,
	locale: string,
	limit: number = 8,
): Promise<CalculatorDefinition[]> {
	const cluster = getClusterForCalculator(calculatorId)
	
	if (!cluster) {
		return []
	}

	const clusterCalculatorIds = getCalculatorsInCluster(cluster)
	
	// Get all calculators in the cluster, excluding current
	const relatedIds = clusterCalculatorIds.filter((id) => id !== calculatorId)
	
	// Load calculators
	const calculators = await Promise.all(
		relatedIds.map((id) => calculatorRegistry.getById(id, locale)),
	)
	
	// Filter out undefined and disabled calculators
	const validCalculators = calculators
		.filter((calc): calc is CalculatorDefinition => 
			calc !== undefined && calc.isEnabled !== false
		)
		.slice(0, limit)
	
	return validCalculators
}

/**
 * Get calculators for a cluster
 * 
 * @param cluster - Cluster name
 * @param locale - Locale
 * @returns Array of calculators in the cluster
 */
export async function getCalculatorsForCluster(
	cluster: MathCluster,
	locale: string,
): Promise<CalculatorDefinition[]> {
	const clusterCalculatorIds = getCalculatorsInCluster(cluster)
	
	// Load calculators
	const calculators = await Promise.all(
		clusterCalculatorIds.map((id) => calculatorRegistry.getById(id, locale)),
	)
	
	// Filter out undefined and disabled calculators
	const validCalculators = calculators
		.filter((calc): calc is CalculatorDefinition => 
			calc !== undefined && calc.isEnabled !== false
		)
	
	return validCalculators
}



