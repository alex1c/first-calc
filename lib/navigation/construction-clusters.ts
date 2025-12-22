/**
 * Construction calculator clusters
 * Defines logical groups of related calculators for better navigation and SEO
 */

/**
 * Construction cluster types
 */
export type ConstructionCluster =
	| 'materials'
	| 'foundation'
	| 'walls'
	| 'finishing'
	| 'reinforcement'
	| 'electrical'
	| 'plumbing'
	| 'stairs'

/**
 * Cluster definitions with calculator IDs
 */
export const constructionClusters: Record<ConstructionCluster, string[]> = {
	materials: [
		'concrete-volume-calculator',
		'cement-calculator',
		'sand-calculator',
		'gravel-calculator',
		'concrete-mix-ratio-calculator',
	],
	foundation: [
		'foundation-volume-calculator',
		'strip-foundation-calculator',
		'slab-foundation-calculator',
		'pile-foundation-calculator',
	],
	walls: [
		'wall-area-calculator',
		'brick-calculator',
	],
	finishing: [
		'paint-calculator',
		'primer-calculator',
		'putty-calculator',
		'tile-calculator',
		'laminate-calculator',
	],
	reinforcement: [
		'rebar-calculator',
		'rebar-weight-calculator',
	],
	electrical: [
		'electrical-load-calculator',
		'cable-size-calculator',
	],
	plumbing: [
		'pipe-volume-calculator',
	],
	stairs: [
		'stair-calculator',
	],
}

/**
 * Get cluster for a calculator
 * @param calculatorId - Calculator ID
 * @returns Cluster name or null if not found
 */
export function getClusterForCalculator(
	calculatorId: string,
): ConstructionCluster | null {
	for (const [cluster, ids] of Object.entries(constructionClusters)) {
		if (ids.includes(calculatorId)) {
			return cluster as ConstructionCluster
		}
	}
	return null
}

/**
 * Get all clusters
 * @returns Array of cluster names
 */
export function getAllClusters(): ConstructionCluster[] {
	return Object.keys(constructionClusters) as ConstructionCluster[]
}

/**
 * Get calculators for a cluster
 * @param cluster - Cluster name
 * @returns Array of calculator IDs in the cluster
 */
export function getCalculatorsForCluster(
	cluster: ConstructionCluster,
): string[] {
	return constructionClusters[cluster] || []
}

