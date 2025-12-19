/**
 * Math calculator clusters for internal linking
 * Defines logical groups of related calculators for better navigation and SEO
 */

export type MathCluster = 'geometry' | 'algebra' | 'statistics' | 'percentages'

/**
 * Math calculator clusters mapping
 * Maps calculator IDs to their logical clusters
 */
export const mathClusters: Record<MathCluster, string[]> = {
	geometry: [
		'area',
		'perimeter-of-shapes',
		'volume-of-shapes',
		'pythagorean-theorem-calculator',
	],
	algebra: [
		'equation-solver',
		'quadratic-equation-calculator',
		'square-root',
	],
	statistics: [
		'descriptive-statistics-calculator',
		'average-calculator',
		'standard-deviation-calculator',
	],
	percentages: [
		'percentage-of-a-number',
		'percentage-change-calculator',
	],
}

/**
 * Get cluster for a calculator ID
 * 
 * @param calculatorId - Calculator ID
 * @returns Cluster name or null if not found
 */
export function getClusterForCalculator(calculatorId: string): MathCluster | null {
	for (const [cluster, ids] of Object.entries(mathClusters)) {
		if (ids.includes(calculatorId)) {
			return cluster as MathCluster
		}
	}
	return null
}

/**
 * Get all calculator IDs in a cluster
 * 
 * @param cluster - Cluster name
 * @returns Array of calculator IDs
 */
export function getCalculatorsInCluster(cluster: MathCluster): string[] {
	return mathClusters[cluster] || []
}

/**
 * Get all clusters
 * 
 * @returns Array of cluster names
 */
export function getAllClusters(): MathCluster[] {
	return Object.keys(mathClusters) as MathCluster[]
}

