/**
 * Auto clusters block component
 * Displays calculator clusters for the auto category page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'

interface AutoClustersBlockProps {
	locale: Locale
}

/**
 * Auto calculator clusters structure
 */
type AutoCluster = 'ownership' | 'fuel' | 'buying' | 'maintenance'

interface AutoClusterConfig {
	id: AutoCluster
	name: string
	description: string
	calculatorIds: string[]
}

const autoClusters: AutoClusterConfig[] = [
	{
		id: 'ownership',
		name: 'Ownership',
		description: 'Calculate total cost of car ownership, monthly expenses, depreciation, and lease vs buy comparisons',
		calculatorIds: [
			'car-cost-of-ownership-calculator',
			'monthly-car-expenses-calculator',
			'car-depreciation-calculator',
			'lease-vs-buy-calculator',
		],
	},
	{
		id: 'fuel',
		name: 'Fuel',
		description: 'Calculate fuel costs, consumption rates, and trip expenses',
		calculatorIds: [
			'fuel-cost-calculator',
			'fuel-consumption-calculator',
			'trip-cost-calculator',
		],
	},
	{
		id: 'buying',
		name: 'Buying',
		description: 'Determine car affordability, loan payments, and resale value',
		calculatorIds: [
			'car-affordability-calculator',
			'auto-loan-calculator',
			'car-resale-value-calculator',
		],
	},
	{
		id: 'maintenance',
		name: 'Maintenance',
		description: 'Estimate maintenance costs and tire expenses',
		calculatorIds: [
			'car-maintenance-cost-calculator',
			'tire-cost-calculator',
		],
	},
]

/**
 * Auto clusters block
 * Shows calculator clusters for better navigation
 */
export async function AutoClustersBlock({ locale }: AutoClustersBlockProps) {
	// Load all auto calculators
	const allCalculators = await calculatorRegistry.getAll(locale)
	const autoCalculators = allCalculators.filter((calc) => calc.category === 'auto')
	
	// Create a map for quick lookup
	const calculatorMap = new Map(autoCalculators.map((calc) => [calc.id, calc]))
	
	// Build cluster data
	const clusterData = autoClusters.map((cluster) => {
		const calculators = cluster.calculatorIds
			.map((id) => calculatorMap.get(id))
			.filter((calc): calc is NonNullable<typeof calc> => calc !== undefined)
		
		return {
			...cluster,
			calculators,
		}
	})
	
	// Filter out empty clusters
	const nonEmptyClusters = clusterData.filter((data) => data.calculators.length > 0)
	
	if (nonEmptyClusters.length === 0) {
		return null
	}
	
	return (
		<div className="mt-12 pt-12 border-t border-gray-200">
			<h2 className="text-3xl font-bold text-gray-900 mb-4">
				Explore Auto Calculator Topics
			</h2>
			<p className="text-lg text-gray-600 mb-8">
				Find the right calculator for your car-related calculations
			</p>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{nonEmptyClusters.map((cluster) => (
					<div
						key={cluster.id}
						className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
					>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							{cluster.name}
						</h3>
						<p className="text-sm text-gray-600 mb-4">
							{cluster.description}
						</p>
						
						<ul className="space-y-2">
							{cluster.calculators.map((calc) => (
								<li key={calc.id}>
									<Link
										href={`/${locale === 'en' ? '' : locale}/calculators/${calc.category}/${calc.slug}`}
										className="text-blue-600 hover:text-blue-800 underline flex items-center"
									>
										<span>{calc.title}</span>
										{cluster.calculatorIds[0] === calc.id && (
											<span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
												Anchor
											</span>
										)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	)
}

