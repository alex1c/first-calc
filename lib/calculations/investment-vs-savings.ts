/**
 * Compare savings vs investment strategies
 * Shows side-by-side comparison of two strategies over time
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate savings vs investment comparison
 */
export const calculateInvestmentVsSavings: CalculatorFunction = (inputs) => {
	const initialAmount = Number(inputs.initialAmount || 0)
	const monthlyContribution = Number(inputs.monthlyContribution || 0)
	const timeHorizonYears = Math.floor(Number(inputs.timeHorizonYears || 0))
	const inflationRate = Number(inputs.inflationRate || 0)

	// Savings strategy inputs
	const savingsInterestRate = Number(inputs.savingsInterestRate || 0)
	const savingsCompoundingFrequency = String(inputs.savingsCompoundingFrequency || 'monthly').toLowerCase()

	// Investment strategy inputs
	const expectedInvestmentReturn = Number(inputs.expectedInvestmentReturn || 0)
	const investmentCompoundingFrequency = String(inputs.investmentCompoundingFrequency || 'monthly').toLowerCase()

	// Validation
	if (
		isNaN(initialAmount) ||
		isNaN(monthlyContribution) ||
		isNaN(timeHorizonYears) ||
		isNaN(inflationRate) ||
		isNaN(savingsInterestRate) ||
		isNaN(expectedInvestmentReturn) ||
		initialAmount < 0 ||
		monthlyContribution < 0 ||
		timeHorizonYears < 1 ||
		timeHorizonYears > 50 ||
		inflationRate < 0 ||
		inflationRate > 20 ||
		savingsInterestRate < 0 ||
		savingsInterestRate > 50 ||
		expectedInvestmentReturn < 0 ||
		expectedInvestmentReturn > 50
	) {
		return {
			savingsFinalBalance: null,
			savingsTotalContributions: null,
			savingsTotalEarnings: null,
			savingsInflationAdjustedBalance: null,
			investmentFinalBalance: null,
			investmentTotalContributions: null,
			investmentTotalEarnings: null,
			investmentInflationAdjustedBalance: null,
			differenceInFinalBalance: null,
			percentageAdvantage: null,
			breakevenYear: null,
			formulaExplanation: null,
		}
	}

	// Calculate savings strategy
	const savingsResult = calculateStrategy(
		initialAmount,
		monthlyContribution,
		timeHorizonYears,
		savingsInterestRate,
		savingsCompoundingFrequency,
		inflationRate,
	)

	// Calculate investment strategy
	const investmentResult = calculateStrategy(
		initialAmount,
		monthlyContribution,
		timeHorizonYears,
		expectedInvestmentReturn,
		investmentCompoundingFrequency,
		inflationRate,
	)

	// Calculate comparison metrics
	const differenceInFinalBalance = investmentResult.finalBalance - savingsResult.finalBalance
	const percentageAdvantage = savingsResult.finalBalance > 0
		? ((differenceInFinalBalance / savingsResult.finalBalance) * 100)
		: 0

	// Find breakeven year (when investment surpasses savings)
	let breakevenYear: number | null = null
	if (expectedInvestmentReturn > savingsInterestRate) {
		// Investment will eventually surpass savings
		for (let year = 1; year <= timeHorizonYears; year++) {
			const savingsAtYear = calculateStrategy(
				initialAmount,
				monthlyContribution,
				year,
				savingsInterestRate,
				savingsCompoundingFrequency,
				0, // No inflation for breakeven calculation
			).finalBalance

			const investmentAtYear = calculateStrategy(
				initialAmount,
				monthlyContribution,
				year,
				expectedInvestmentReturn,
				investmentCompoundingFrequency,
				0, // No inflation for breakeven calculation
			).finalBalance

			if (investmentAtYear > savingsAtYear) {
				breakevenYear = year
				break
			}
		}
	}

	// Build formula explanation
	let formulaExplanation = ''
	formulaExplanation = `Savings vs Investment Comparison:\n\n1. Initial Amount: $${initialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n2. Monthly Contribution: $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n3. Time Horizon: ${timeHorizonYears} years\n${inflationRate > 0 ? `4. Inflation Rate: ${inflationRate}%\n` : ''}\nSAVINGS STRATEGY:\n- Interest Rate: ${savingsInterestRate}%\n- Compounding: ${savingsCompoundingFrequency === 'monthly' ? 'Monthly' : 'Annual'}\n- Final Balance: $${savingsResult.finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- Total Contributed: $${savingsResult.totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- Total Earnings: $${savingsResult.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n${savingsResult.inflationAdjustedBalance ? `- Inflation-Adjusted Balance: $${savingsResult.inflationAdjustedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}\n\nINVESTMENT STRATEGY:\n- Expected Return: ${expectedInvestmentReturn}%\n- Compounding: ${investmentCompoundingFrequency === 'monthly' ? 'Monthly' : 'Annual'}\n- Final Balance: $${investmentResult.finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- Total Contributed: $${investmentResult.totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- Total Earnings: $${investmentResult.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n${investmentResult.inflationAdjustedBalance ? `- Inflation-Adjusted Balance: $${investmentResult.inflationAdjustedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}\n\nCOMPARISON:\n- Difference: $${differenceInFinalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${differenceInFinalBalance >= 0 ? '(Investment advantage)' : '(Savings advantage)'}\n- Percentage Advantage: ${Math.abs(percentageAdvantage).toFixed(2)}%\n${breakevenYear ? `- Breakeven Year: Year ${breakevenYear} (when investment surpasses savings)` : ''}\n\n${differenceInFinalBalance > 0 ? `Investment strategy yields $${differenceInFinalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more over ${timeHorizonYears} years, representing a ${percentageAdvantage.toFixed(2)}% advantage. However, investments carry higher risk and volatility compared to savings.` : `Savings strategy yields $${Math.abs(differenceInFinalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more over ${timeHorizonYears} years. Savings provide stability and lower risk, making them suitable for short-term goals and emergency funds.`}\n\n${breakevenYear ? `Investment strategy surpasses savings after ${breakevenYear} years, demonstrating the power of higher returns over longer time horizons.` : ''}\n\nNote: Investment returns are not guaranteed and can vary significantly. Past performance does not predict future results. Consider your risk tolerance, time horizon, and financial goals when choosing between savings and investments.`

	return {
		savingsFinalBalance: Math.round(savingsResult.finalBalance * 100) / 100,
		savingsTotalContributions: Math.round(savingsResult.totalContributions * 100) / 100,
		savingsTotalEarnings: Math.round(savingsResult.totalEarnings * 100) / 100,
		savingsInflationAdjustedBalance: savingsResult.inflationAdjustedBalance ? Math.round(savingsResult.inflationAdjustedBalance * 100) / 100 : null,
		investmentFinalBalance: Math.round(investmentResult.finalBalance * 100) / 100,
		investmentTotalContributions: Math.round(investmentResult.totalContributions * 100) / 100,
		investmentTotalEarnings: Math.round(investmentResult.totalEarnings * 100) / 100,
		investmentInflationAdjustedBalance: investmentResult.inflationAdjustedBalance ? Math.round(investmentResult.inflationAdjustedBalance * 100) / 100 : null,
		differenceInFinalBalance: Math.round(differenceInFinalBalance * 100) / 100,
		percentageAdvantage: Math.round(percentageAdvantage * 100) / 100,
		breakevenYear,
		formulaExplanation,
	}
}

/**
 * Calculate strategy results (savings or investment)
 */
function calculateStrategy(
	initialAmount: number,
	monthlyContribution: number,
	years: number,
	annualRate: number,
	compoundingFrequency: string,
	inflationRate: number,
): {
	finalBalance: number
	totalContributions: number
	totalEarnings: number
	inflationAdjustedBalance: number | null
} {
	const periodsPerYear = compoundingFrequency === 'monthly' ? 12 : 1
	const periodicRate = annualRate / 100 / periodsPerYear
	const totalPeriods = years * periodsPerYear

	let balance = initialAmount
	let totalContributions = initialAmount

	// Simulate month-by-month or year-by-year
	if (periodsPerYear === 12) {
		// Monthly compounding
		for (let month = 1; month <= totalPeriods; month++) {
			// Add contribution
			balance += monthlyContribution
			totalContributions += monthlyContribution

			// Apply interest
			const periodEarnings = balance * periodicRate
			balance += periodEarnings
		}
	} else {
		// Annual compounding
		for (let year = 1; year <= years; year++) {
			// Add monthly contributions for the year
			for (let month = 1; month <= 12; month++) {
				balance += monthlyContribution
				totalContributions += monthlyContribution
			}

			// Apply annual interest
			const yearEarnings = balance * periodicRate
			balance += yearEarnings
		}
	}

	const totalEarnings = balance - totalContributions

	// Calculate inflation-adjusted balance
	let inflationAdjustedBalance: number | null = null
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, years)
		inflationAdjustedBalance = balance / inflationFactor
	}

	return {
		finalBalance: balance,
		totalContributions,
		totalEarnings,
		inflationAdjustedBalance,
	}
}


