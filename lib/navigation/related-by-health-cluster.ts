/**
 * Get calculators related by health cluster
 * Similar to related-by-cluster but for health calculators
 */

import type { Locale } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'
import {
	getClusterForCalculator,
	getCalculatorsInCluster,
	type HealthCluster,
} from '@/lib/navigation/health-clusters'

/**
 * Get calculators in the same health cluster as the given calculator
 */
export async function getRelatedByHealthCluster(
	calculatorId: string,
	locale: Locale,
): Promise<Awaited<ReturnType<typeof calculatorRegistry.getById>>[]> {
	const cluster = getClusterForCalculator(calculatorId)
	if (!cluster) {
		return []
	}

	const clusterCalculatorIds = getCalculatorsInCluster(cluster)
	const relatedIds = clusterCalculatorIds.filter((id) => id !== calculatorId)

	const calculators = await Promise.all(
		relatedIds.map((id) => calculatorRegistry.getById(id, locale)),
	)

	return calculators.filter(
		(calc): calc is NonNullable<typeof calc> => calc !== undefined,
	)
}

/**
 * Get calculators for a specific health cluster
 */
export async function getCalculatorsForHealthCluster(
	cluster: HealthCluster,
	locale: Locale,
): Promise<Awaited<ReturnType<typeof calculatorRegistry.getById>>[]> {
	const clusterCalculatorIds = getCalculatorsInCluster(cluster)

	const calculators = await Promise.all(
		clusterCalculatorIds.map((id) => calculatorRegistry.getById(id, locale)),
	)

	return calculators.filter(
		(calc): calc is NonNullable<typeof calc> => calc !== undefined,
	)
}

