/**
 * Everyday calculator clusters for internal linking
 * Defines logical groups of related calculators for better navigation and SEO
 */

export type EverydayCluster = 'time' | 'numbers' | 'home' | 'fun'

/**
 * Everyday calculator clusters mapping
 * Maps calculator IDs to their logical clusters
 */
export const everydayClusters: Record<EverydayCluster, string[]> = {
	time: [
		'age-calculator',
		'days-between-dates-calculator',
		'date-calculator',
		// 'countdown-calculator', // If exists
	],
	numbers: [
		'numbers-to-words-calculator',
		'roman-numerals-converter',
		'random-number-generator',
		// 'percentage-calculator', // Simple version if exists
	],
	home: [
		'room-area-calculator',
		'paint-calculator',
		'cooking-measurement-converter',
		// 'wallpaper-calculator', // If exists
	],
	fun: [
		'random-number-generator',
		// 'lucky-number-calculator', // If exists
		// 'love-compatibility-calculator', // If exists
	],
}

/**
 * Get cluster for a calculator ID
 * 
 * @param calculatorId - Calculator ID
 * @returns Cluster name or null if not found
 */
export function getClusterForEverydayCalculator(calculatorId: string): EverydayCluster | null {
	for (const [cluster, ids] of Object.entries(everydayClusters)) {
		if (ids.includes(calculatorId)) {
			return cluster as EverydayCluster
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
export function getCalculatorsInEverydayCluster(cluster: EverydayCluster): string[] {
	return everydayClusters[cluster] || []
}

/**
 * Get all clusters
 * 
 * @returns Array of cluster names
 */
export function getAllEverydayClusters(): EverydayCluster[] {
	return Object.keys(everydayClusters) as EverydayCluster[]
}


