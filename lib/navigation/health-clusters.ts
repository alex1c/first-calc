/**
 * Health calculator clusters for internal linking
 * Defines logical groups of related calculators for better navigation and SEO
 */

export type HealthCluster = 'body' | 'nutrition' | 'fitness' | 'lifestyle'

/**
 * Health calculator clusters mapping
 * Maps calculator IDs to their logical clusters
 */
export const healthClusters: Record<HealthCluster, string[]> = {
	body: [
		'bmi-calculator',
		'bmr-calculator',
		'daily-calorie-needs-calculator',
		'ideal-weight-calculator',
		'body-fat-percentage-calculator',
	],
	nutrition: [
		'macronutrient-calculator',
		'water-intake-calculator',
	],
	fitness: [
		'calories-burned-calculator',
		'heart-rate-zones-calculator',
		'steps-to-calories-calculator',
	],
	lifestyle: [
		// Future calculators: BAC, Smoking Cost, Sleep
	],
}

/**
 * Get cluster for a calculator ID
 * 
 * @param calculatorId - Calculator ID
 * @returns Cluster name or null if not found
 */
export function getClusterForCalculator(calculatorId: string): HealthCluster | null {
	for (const [cluster, ids] of Object.entries(healthClusters)) {
		if (ids.includes(calculatorId)) {
			return cluster as HealthCluster
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
export function getCalculatorsInCluster(cluster: HealthCluster): string[] {
	return healthClusters[cluster] || []
}

/**
 * Get all clusters
 * 
 * @returns Array of cluster names
 */
export function getAllClusters(): HealthCluster[] {
	return Object.keys(healthClusters) as HealthCluster[]
}


