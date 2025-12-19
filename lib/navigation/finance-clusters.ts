/**
 * Finance calculator clusters for internal linking
 * Groups calculators by financial topics for better navigation and SEO
 */

export type FinanceCluster = 'loans' | 'investments' | 'savings' | 'business' | 'taxes' | 'retirement'

export const financeClusters: Record<FinanceCluster, string[]> = {
	loans: [
		'loan-payment',
		'mortgage-calculator',
		'auto-loan-calculator',
		'personal-loan-calculator',
		'loan-interest-calculator',
		'loan-overpayment-calculator',
		'loan-comparison-calculator',
	],
	investments: [
		'investment-calculator',
		'compound-interest-calculator',
		'future-value-calculator',
		'present-value-calculator',
	],
	savings: [
		'savings-calculator',
		'compound-interest-calculator',
	],
	business: [
		'roi-calculator',
		'margin-calculator',
		'break-even-point-calculator',
	],
	taxes: [
		'tax-calculator',
		'income-tax-calculator',
		'vat-calculator',
	],
	retirement: [
		'retirement-calculator',
		'pension-savings-calculator',
	],
}

/**
 * Get cluster for a given calculator ID
 */
export function getClusterForCalculator(calculatorId: string): FinanceCluster | null {
	for (const [cluster, ids] of Object.entries(financeClusters)) {
		if (ids.includes(calculatorId)) {
			return cluster as FinanceCluster
		}
	}
	return null
}

/**
 * Get all calculators in a cluster
 */
export function getCalculatorsInCluster(cluster: FinanceCluster): string[] {
	return financeClusters[cluster] || []
}

/**
 * Get all clusters
 */
export function getAllClusters(): FinanceCluster[] {
	return Object.keys(financeClusters) as FinanceCluster[]
}

