/**
 * Everyday Clusters Block component
 * Displays everyday calculator clusters on the category page
 */

import Link from 'next/link'
import { calculatorRegistry } from '@/lib/registry/loader'
import { everydayClusters, type EverydayCluster } from '@/lib/navigation/everyday-clusters'
import type { Locale } from '@/lib/i18n'

interface EverydayClustersBlockProps {
	locale: Locale
}

/**
 * Cluster configuration with display names and descriptions
 */
const clusterConfig: Record<EverydayCluster, { name: string; description: string; icon: string }> = {
	time: {
		name: 'Time & Dates',
		description: 'Calculate age, date differences, and time-related calculations',
		icon: '📅',
	},
	numbers: {
		name: 'Numbers & Converters',
		description: 'Convert numbers to words, Roman numerals, and generate random numbers',
		icon: '🔢',
	},
	home: {
		name: 'Home & Household',
		description: 'Calculate room area, paint needs, and convert cooking measurements',
		icon: '🏠',
	},
	fun: {
		name: 'Fun & Curiosity',
		description: 'Generate random numbers and explore number conversions',
		icon: '🎲',
	},
}

export async function EverydayClustersBlock({ locale }: EverydayClustersBlockProps) {
	// Fetch calculators for each cluster
	const clusterData = await Promise.all(
		(Object.entries(everydayClusters) as [EverydayCluster, string[]][]).map(
			async ([cluster, calculatorIds]) => {
				const calculators = await Promise.all(
					calculatorIds.map((id) => calculatorRegistry.getById(id, locale)),
				)
				const validCalculators = calculators.filter(
					(c): c is NonNullable<typeof c> => c !== undefined && c.isEnabled !== false,
				)
				return {
					cluster,
					calculators: validCalculators.slice(0, 4), // Show up to 4 key calculators
				}
			},
		),
	)

	return (
		<div className="mt-12 space-y-8">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-3">
					Everyday Calculators by Category
				</h2>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					Organized by purpose: time calculations, number converters, home tools, and fun utilities
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{clusterData.map(({ cluster, calculators }) => {
					const config = clusterConfig[cluster]
					if (calculators.length === 0) return null

					return (
						<div
							key={cluster}
							className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-start gap-4 mb-4">
								<div className="text-4xl">{config.icon}</div>
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										{config.name}
									</h3>
									<p className="text-sm text-gray-600 mb-4">
										{config.description}
									</p>
								</div>
							</div>

							<ul className="space-y-2">
								{calculators.map((calc) => (
									<li key={calc.id}>
										<Link
											href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
											className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm flex items-center gap-2"
										>
											<span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
											{calc.title}
										</Link>
									</li>
								))}
							</ul>

							{calculators.length < everydayClusters[cluster].length && (
								<div className="mt-4 pt-4 border-t border-gray-200">
									<Link
										href={`/${locale}/calculators/everyday`}
										className="text-sm text-gray-600 hover:text-blue-600 font-medium"
									>
										View all {config.name.toLowerCase()} calculators →
									</Link>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}


