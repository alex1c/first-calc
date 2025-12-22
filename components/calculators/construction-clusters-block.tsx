/**
 * Construction clusters block component
 * Displays calculator clusters for the construction category page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import {
	getAllClusters,
	type ConstructionCluster,
	getCalculatorsForCluster,
} from '@/lib/navigation/construction-clusters'
import { calculatorRegistry } from '@/lib/registry/loader'

interface ConstructionClustersBlockProps {
	locale: Locale
}

/**
 * Cluster display names and descriptions
 * Organized by construction workflow: Materials → Foundations → Walls → Finishing → Engineering
 */
const clusterInfo: Record<
	ConstructionCluster,
	{ name: string; description: string }
> = {
	materials: {
		name: 'Materials',
		description: 'Calculate concrete volume, cement, sand, gravel, and mix ratios for construction projects',
	},
	foundation: {
		name: 'Foundations',
		description: 'Foundation volume and design calculators for strip, slab, and pile foundations',
	},
	walls: {
		name: 'Walls & Masonry',
		description: 'Wall area calculations and brick quantity estimators for masonry work',
	},
	finishing: {
		name: 'Finishing',
		description: 'Paint, primer, putty, tile, and laminate calculators for interior and exterior finishing',
	},
	reinforcement: {
		name: 'Reinforcement',
		description: 'Rebar quantity and weight calculations for concrete reinforcement',
	},
	electrical: {
		name: 'Electrical',
		description: 'Electrical load and cable size calculators for wiring and electrical systems',
	},
	plumbing: {
		name: 'Plumbing',
		description: 'Pipe volume and capacity calculators for plumbing and heating systems',
	},
	stairs: {
		name: 'Stairs',
		description: 'Stair design and dimension calculators for comfortable and safe staircases',
	},
}

/**
 * Construction clusters block
 * Shows calculator clusters for better navigation
 */
export async function ConstructionClustersBlock({
	locale,
}: ConstructionClustersBlockProps) {
	const clusters = getAllClusters()

	// Load calculators for each cluster
	const clusterData = await Promise.all(
		clusters.map(async (cluster) => {
			const calculatorIds = getCalculatorsForCluster(cluster)
			const calculators = await Promise.all(
				calculatorIds.map((id) => calculatorRegistry.getById(id, locale)),
			)
			const validCalculators = calculators.filter(
				(calc): calc is NonNullable<typeof calc> => calc !== null,
			)
			return {
				cluster,
				calculators: validCalculators.slice(0, 6), // Limit to 6 per cluster
				totalCount: validCalculators.length,
			}
		}),
	)

	// Filter out empty clusters
	const nonEmptyClusters = clusterData.filter(
		(data) => data.calculators.length > 0,
	)

	if (nonEmptyClusters.length === 0) {
		return null
	}

	return (
		<div className="mt-12 pt-12 border-t border-gray-200">
			<h2 className="text-3xl font-bold text-gray-900 mb-4">
				Construction Calculator Clusters
			</h2>
			<p className="text-gray-600 mb-8">
				Browse calculators organized by construction workflow: from materials and foundations to finishing and engineering utilities.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{nonEmptyClusters.map(({ cluster, calculators, totalCount }) => {
					const info = clusterInfo[cluster]
					return (
						<div
							key={cluster}
							className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
						>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{info.name}
							</h3>
							<p className="text-sm text-gray-600 mb-4">{info.description}</p>

							<ul className="space-y-2 mb-4">
								{calculators.map((calc) => (
									<li key={calc.id}>
										<Link
											href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
											className="text-blue-600 hover:text-blue-800 underline text-sm"
										>
											{calc.title}
										</Link>
									</li>
								))}
							</ul>

							{totalCount > calculators.length && (
								<Link
									href={`/${locale}/calculators/construction`}
									className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-block mt-2"
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

