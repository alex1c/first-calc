/**
 * Calculate net worth (assets minus liabilities)
 * Helps users understand their financial position
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate net worth
 */
export const calculateNetWorth: CalculatorFunction = (inputs) => {
	// Assets
	const cashSavings = Number(inputs.cashSavings || 0)
	const investments = Number(inputs.investments || 0)
	const retirementAccounts = Number(inputs.retirementAccounts || 0)
	const realEstate = Number(inputs.realEstate || 0)
	const vehicles = Number(inputs.vehicles || 0)
	const otherAssets = Number(inputs.otherAssets || 0)

	// Liabilities
	const mortgage = Number(inputs.mortgage || 0)
	const personalLoans = Number(inputs.personalLoans || 0)
	const autoLoans = Number(inputs.autoLoans || 0)
	const creditCardDebt = Number(inputs.creditCardDebt || 0)
	const studentLoans = Number(inputs.studentLoans || 0)
	const otherDebts = Number(inputs.otherDebts || 0)

	// Validation - all values should be >= 0
	if (
		isNaN(cashSavings) ||
		isNaN(investments) ||
		isNaN(retirementAccounts) ||
		isNaN(realEstate) ||
		isNaN(vehicles) ||
		isNaN(otherAssets) ||
		isNaN(mortgage) ||
		isNaN(personalLoans) ||
		isNaN(autoLoans) ||
		isNaN(creditCardDebt) ||
		isNaN(studentLoans) ||
		isNaN(otherDebts) ||
		cashSavings < 0 ||
		investments < 0 ||
		retirementAccounts < 0 ||
		realEstate < 0 ||
		vehicles < 0 ||
		otherAssets < 0 ||
		mortgage < 0 ||
		personalLoans < 0 ||
		autoLoans < 0 ||
		creditCardDebt < 0 ||
		studentLoans < 0 ||
		otherDebts < 0
	) {
		return {
			totalAssets: null,
			totalLiabilities: null,
			netWorth: null,
			debtToAssetRatio: null,
			netWorthStatus: null,
			formulaExplanation: null,
		}
	}

	// Calculate totals
	const totalAssets =
		cashSavings +
		investments +
		retirementAccounts +
		realEstate +
		vehicles +
		otherAssets

	const totalLiabilities =
		mortgage +
		personalLoans +
		autoLoans +
		creditCardDebt +
		studentLoans +
		otherDebts

	// Calculate net worth
	const netWorth = totalAssets - totalLiabilities

	// Calculate debt-to-asset ratio
	let debtToAssetRatio = 0
	if (totalAssets > 0) {
		debtToAssetRatio = (totalLiabilities / totalAssets) * 100
	} else if (totalLiabilities > 0) {
		// If assets are zero but liabilities exist, ratio is undefined/infinite
		// We'll show a high percentage to indicate this
		debtToAssetRatio = 999 // Indicates liabilities exist with no assets
	}

	// Classify net worth status
	let netWorthStatus: 'negative' | 'neutral' | 'positive'
	if (netWorth < 0) {
		netWorthStatus = 'negative'
	} else if (netWorth === 0) {
		netWorthStatus = 'neutral'
	} else {
		netWorthStatus = 'positive'
	}

	// Build formula explanation
	let formulaExplanation = ''
	
	formulaExplanation = `Net Worth Calculation:\n\n1. Total Assets:\n   Assets = Cash Savings + Investments + Retirement Accounts + Real Estate + Vehicles + Other Assets\n   Assets = $${cashSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${investments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${retirementAccounts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${realEstate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${vehicles.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${otherAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Assets = $${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Total Liabilities:\n   Liabilities = Mortgage + Personal Loans + Auto Loans + Credit Card Debt + Student Loans + Other Debts\n   Liabilities = $${mortgage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${personalLoans.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${autoLoans.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${creditCardDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${studentLoans.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${otherDebts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Liabilities = $${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Net Worth:\n   Net Worth = Total Assets - Total Liabilities\n   Net Worth = $${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Net Worth = $${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n4. Debt-to-Asset Ratio:\n   ${totalAssets > 0 ? `Debt-to-Asset Ratio = (Total Liabilities / Total Assets) × 100%\n   Debt-to-Asset Ratio = ($${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100%\n   Debt-to-Asset Ratio = ${debtToAssetRatio.toFixed(1)}%` : totalLiabilities > 0 ? `Debt-to-Asset Ratio: Not applicable (assets are zero)\n   When assets are zero but liabilities exist, the debt-to-asset ratio cannot be calculated normally. This indicates a need to build assets.` : `Debt-to-Asset Ratio: Not applicable (no assets or liabilities)`}\n\n${netWorthStatus === 'negative' ? 'Your net worth is negative, meaning your liabilities exceed your assets. This is common for young adults, recent graduates, or those with significant debt. Focus on reducing high-interest debt and building assets over time.' : netWorthStatus === 'neutral' ? 'Your net worth is neutral (zero), meaning your assets equal your liabilities. This is a starting point for building wealth. Focus on increasing assets and reducing liabilities to achieve positive net worth.' : 'Your net worth is positive, meaning your assets exceed your liabilities. This indicates a healthy financial position. Continue building assets and managing debt to grow your net worth over time.'}\n\nNet worth is a snapshot of your financial position at a point in time. It can change as asset values fluctuate, debts are paid off, or new assets are acquired. Regularly tracking your net worth helps you understand your financial progress and make informed decisions.`

	return {
		totalAssets: Math.round(totalAssets * 100) / 100,
		totalLiabilities: Math.round(totalLiabilities * 100) / 100,
		netWorth: Math.round(netWorth * 100) / 100,
		debtToAssetRatio: Math.round(debtToAssetRatio * 100) / 100,
		netWorthStatus,
		formulaExplanation,
	}
}

