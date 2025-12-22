/**
 * Math clusters block component
 * Displays calculator clusters for the math category page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getAllClusters, type MathCluster } from '@/lib/navigation/math-clusters'
import { getCalculatorsForCluster } from '@/lib/navigation/related-by-cluster'

interface MathClustersBlockProps {
	locale: Locale
}

/**
 * Cluster display names
 */
const clusterNames: Record<MathCluster, string> = {
	geometry: 'Geometry Calculators',
	algebra: 'Algebra Calculators',
	statistics: 'Statistics Calculators',
	percentages: 'Percentage Calculators',
}

/**
 * Math clusters block
 * Shows calculator clusters for better navigation
 */
export async function MathClustersBlock({ locale }: MathClustersBlockProps) {
	const clusters = getAllClusters()
	
	// Load calculators for each cluster
	const clusterData = await Promise.all(
		clusters.map(async (cluster) => {
			const calculators = await getCalculatorsForCluster(cluster, locale)
			return {
				cluster,
				calculators: calculators.slice(0, 5), // Limit to 5 per cluster
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
			<h2 className="text-3xl font-bold text-gray-900 mb-8">
				Explore Related Math Topics
			</h2>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{nonEmptyClusters.map(({ cluster, calculators, totalCount }) => (
					<div key={cluster} className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							{clusterNames[cluster]}
						</h3>
						
						<ul className="space-y-2 mb-4">
							{calculators.map((calc) => (
								<li key={calc.id}>
									<Link
										href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
										className="text-blue-600 hover:text-blue-800 underline"
									>
										{calc.title}
									</Link>
								</li>
							))}
						</ul>
						
						{totalCount > calculators.length && (
							<Link
								href={`/${locale}/calculators/math?section=${cluster}`}
								className="text-sm text-blue-600 hover:text-blue-800 font-medium"
							>
								View all {totalCount} calculators →
							</Link>
						)}
					</div>
				))}
			</div>
		</div>
	)
}



