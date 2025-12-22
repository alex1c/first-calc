/**
 * Finance clusters block component
 * Displays calculator clusters for the finance category page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getAllClusters, type FinanceCluster } from '@/lib/navigation/finance-clusters'
import { getCalculatorsForFinanceCluster } from '@/lib/navigation/related-by-finance-cluster'

interface FinanceClustersBlockProps {
	locale: Locale
}

/**
 * Cluster display names
 */
const clusterNames: Record<FinanceCluster, string> = {
	loans: 'Loan Calculators',
	investments: 'Investment Calculators',
	savings: 'Savings Calculators',
	business: 'Business Calculators',
	taxes: 'Tax Calculators',
	retirement: 'Retirement Calculators',
}

/**
 * Finance clusters block
 * Shows calculator clusters for better navigation
 */
export async function FinanceClustersBlock({ locale }: FinanceClustersBlockProps) {
	const clusters = getAllClusters()
	
	// Load calculators for each cluster
	const clusterData = await Promise.all(
		clusters.map(async (cluster) => {
			const calculators = await getCalculatorsForFinanceCluster(cluster, locale)
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
				Explore Finance Topics
			</h2>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{nonEmptyClusters.map(({ cluster, calculators, totalCount }) => (
					<div key={cluster} className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							{clusterNames[cluster]}
						</h3>
						
						<ul className="space-y-2 mb-4">
							{calculators.map((calc) => (
								<li key={calc.id}>
									<Link
										href={`/${locale === 'en' ? '' : locale}/calculators/${calc.category}/${calc.slug}`}
										className="text-blue-600 hover:text-blue-800 underline"
									>
										{calc.title}
									</Link>
								</li>
							))}
						</ul>
						
						{totalCount > calculators.length && (
							<Link
								href={`/${locale === 'en' ? '' : locale}/calculators/finance?tag=${cluster}`}
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



