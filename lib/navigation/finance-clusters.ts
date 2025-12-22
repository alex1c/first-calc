/**
 * Finance calculator clusters for internal linking
 * Groups calculators by financial topics for better navigation and SEO
 */

export type FinanceCluster = 'loans' | 'investments' | 'savings' | 'business' | 'taxes' | 'retirement' | 'long-term-planning'

export const financeClusters: Record<FinanceCluster, string[]> = {
	loans: [
		'loan-payment',
		'loan-comparison-calculator',
		'loan-overpayment-calculator',
		'mortgage-calculator',
		'mortgage-comparison-calculator',
		'auto-loan-calculator',
		'personal-loan-calculator',
	],
	investments: [
		'investment-calculator',
		'compound-interest-calculator',
		'roi-calculator',
		'investment-vs-savings-calculator',
	],
	savings: [
		'savings-calculator',
		'emergency-fund-calculator',
		'take-home-pay-calculator',
	],
	'long-term-planning': [
		'retirement-calculator',
		'net-worth-calculator',
	],
	business: [
		'roi-calculator',
		'margin-calculator',
		'break-even-point-calculator',
	],
	taxes: [
		'take-home-pay-calculator',
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


