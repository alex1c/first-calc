/**
 * Health clusters block component
 * Displays calculator clusters for the health category page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getAllClusters, type HealthCluster } from '@/lib/navigation/health-clusters'
import { getCalculatorsForHealthCluster } from '@/lib/navigation/related-by-health-cluster'

interface HealthClustersBlockProps {
	locale: Locale
}

/**
 * Cluster display names and descriptions
 */
const clusterInfo: Record<HealthCluster, { name: string; description: string }> = {
	body: {
		name: 'Body & Weight',
		description: 'Calculate BMI, BMR, ideal weight, body fat percentage, and daily calorie needs.',
	},
	nutrition: {
		name: 'Nutrition',
		description: 'Plan your macronutrients and track daily water intake for optimal nutrition.',
	},
	fitness: {
		name: 'Fitness',
		description: 'Track calories burned, heart rate zones, and convert steps to calories.',
	},
	lifestyle: {
		name: 'Lifestyle',
		description: 'Health and wellness calculators for daily lifestyle decisions.',
	},
}

/**
 * Health clusters block
 * Shows calculator clusters for better navigation
 */
export async function HealthClustersBlock({ locale }: HealthClustersBlockProps) {
	const clusters = getAllClusters()
	
	// Load calculators for each cluster
	const clusterData = await Promise.all(
		clusters.map(async (cluster) => {
			const calculators = await getCalculatorsForHealthCluster(cluster, locale)
			return {
				cluster,
				calculators: calculators.slice(0, 6), // Limit to 6 per cluster
				totalCount: calculators.length,
			}
		}),
	)
	
	// Filter out empty clusters
	const nonEmptyClusters = clusterData.filter((data) => data.calculators.length > 0)
	
	if (nonEmptyClusters.length === 0) {
		return null
	}
	
	return (
		<div className="mt-12 pt-12 border-t border-gray-200">
			<h2 className="text-3xl font-bold text-gray-900 mb-2">
				Health Calculator Topics
			</h2>
			<p className="text-lg text-gray-600 mb-8">
				Explore calculators organized by health and wellness topics
			</p>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{nonEmptyClusters.map(({ cluster, calculators, totalCount }) => {
					const info = clusterInfo[cluster]
					return (
						<div key={cluster} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{info.name}
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								{info.description}
							</p>
							
							<ul className="space-y-2 mb-4">
								{calculators.map((calc) => {
									if (!calc) return null
									return (
										<li key={calc.id}>
										<Link
											href={`/${locale === 'en' ? '' : locale}/calculators/${calc.category}/${calc.slug}`}
											className="text-blue-600 hover:text-blue-800 underline text-sm"
										>
											{calc.title}
										</Link>
									</li>
									)
								})}
							</ul>
							
							{totalCount > calculators.length && (
								<Link
									href={`/${locale === 'en' ? '' : locale}/calculators/health`}
									className="text-sm text-blue-600 hover:text-blue-800 font-medium"
								>
									View all {totalCount} calculators →
								</Link>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}


