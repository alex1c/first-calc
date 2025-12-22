/**
 * Calculate retirement savings and required funds
 * Two modes:
 * - future_balance: How much will I have at retirement?
 * - required_savings: How much do I need to save?
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate retirement based on selected mode
 */
export const calculateRetirement: CalculatorFunction = (inputs) => {
	const calculationMode = String(inputs.calculationMode || 'future_balance').toLowerCase()

	if (calculationMode === 'future_balance') {
		return calculateFutureBalance(inputs)
	} else if (calculationMode === 'required_savings') {
		return calculateRequiredSavings(inputs)
	}

	return {
		calculationMode: 'future_balance',
		finalBalance: null,
		totalContributed: null,
		totalEarnings: null,
		inflationAdjustedBalance: null,
		monthlyRetirementIncome: null,
		requiredRetirementFund: null,
		monthlyIncomeAchievable: null,
		savingsGap: null,
		requiredMonthlyContribution: null,
		formulaExplanation: null,
	}
}

/**
 * MODE A: Calculate future balance at retirement
 */
function calculateFutureBalance(inputs: Record<string, any>) {
	const currentAge = Math.floor(Number(inputs.currentAge || 0))
	const retirementAge = Math.floor(Number(inputs.retirementAge || 0))
	const currentSavings = Number(inputs.currentSavings || 0)
	const monthlyContribution = Number(inputs.monthlyContribution || 0)
	const annualReturnRate = Number(inputs.annualReturnRate || 0)
	const contributionGrowthRate = Number(inputs.contributionGrowthRate || 0)
	const inflationRate = Number(inputs.inflationRate || 0)
	const compoundFrequency = String(inputs.compoundFrequency || 'monthly').toLowerCase()

	// Validation
	if (
		isNaN(currentAge) ||
		isNaN(retirementAge) ||
		isNaN(currentSavings) ||
		isNaN(monthlyContribution) ||
		isNaN(annualReturnRate) ||
		isNaN(contributionGrowthRate) ||
		isNaN(inflationRate) ||
		currentAge < 18 ||
		currentAge >= retirementAge ||
		retirementAge > 75 ||
		currentSavings < 0 ||
		monthlyContribution < 0 ||
		annualReturnRate < 0 ||
		annualReturnRate > 50 ||
		contributionGrowthRate < 0 ||
		contributionGrowthRate > 10 ||
		inflationRate < 0 ||
		inflationRate > 20
	) {
		return {
			finalBalance: null,
			totalContributed: null,
			totalEarnings: null,
			inflationAdjustedBalance: null,
			monthlyRetirementIncome: null,
			formulaExplanation: null,
		}
	}

	const yearsToRetirement = retirementAge - currentAge
	const monthsToRetirement = yearsToRetirement * 12

	// Calculate compounding periods per year
	const periodsPerYear = compoundFrequency === 'monthly' ? 12 : 1
	const periodicRate = annualReturnRate / 100 / periodsPerYear
	const totalPeriods = yearsToRetirement * periodsPerYear

	// Simulate year-by-year growth with contributions
	let balance = currentSavings
	let totalContributed = currentSavings
	let currentMonthlyContribution = monthlyContribution

	// Year-by-year breakdown
	const yearlyBreakdown: Array<{
		year: number
		age: number
		startingBalance: number
		contributions: number
		earnings: number
		endingBalance: number
	}> = []

	for (let year = 1; year <= yearsToRetirement; year++) {
		const yearStartingBalance = balance
		let yearContributions = 0
		let yearEarnings = 0

		// Monthly contributions and compounding
		for (let month = 1; month <= 12; month++) {
			// Apply contribution growth rate annually
			if (month === 1 && year > 1) {
				currentMonthlyContribution = currentMonthlyContribution * (1 + contributionGrowthRate / 100)
			}

			// Add contribution
			balance += currentMonthlyContribution
			yearContributions += currentMonthlyContribution

			// Apply interest
			if (periodsPerYear === 12) {
				const monthEarnings = balance * periodicRate
				balance += monthEarnings
				yearEarnings += monthEarnings
			}
		}

		// Annual compounding if selected
		if (periodsPerYear === 1) {
			yearEarnings = balance * periodicRate
			balance += yearEarnings
		}

		totalContributed += yearContributions

		yearlyBreakdown.push({
			year,
			age: currentAge + year,
			startingBalance: Math.round(yearStartingBalance * 100) / 100,
			contributions: Math.round(yearContributions * 100) / 100,
			earnings: Math.round(yearEarnings * 100) / 100,
			endingBalance: Math.round(balance * 100) / 100,
		})
	}

	const finalBalance = Math.round(balance * 100) / 100
	const totalEarnings = finalBalance - totalContributed

	// Calculate inflation-adjusted balance
	let inflationAdjustedBalance: number | null = null
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetirement)
		inflationAdjustedBalance = Math.round((finalBalance / inflationFactor) * 100) / 100
	}

	// Estimate monthly retirement income (using 4% withdrawal rule)
	const monthlyRetirementIncome = inflationRate > 0 && inflationAdjustedBalance
		? Math.round((inflationAdjustedBalance * 0.04 / 12) * 100) / 100
		: Math.round((finalBalance * 0.04 / 12) * 100) / 100

	// Build formula explanation
	let formulaExplanation = ''
	formulaExplanation = `Future Balance Calculation:\n\n1. Starting Balance: $${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Monthly Contributions:\n   - Initial monthly contribution: $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${contributionGrowthRate > 0 ? `- Annual growth rate: ${contributionGrowthRate}%\n   - Contributions increase each year to account for salary growth\n` : ''}3. Investment Growth:\n   - Annual return rate: ${annualReturnRate}%\n   - Compounding frequency: ${compoundFrequency === 'monthly' ? 'Monthly' : 'Annual'}\n   - Periodic rate: ${(periodicRate * 100).toFixed(4)}%\n   - Years to retirement: ${yearsToRetirement}\n\n4. Calculation Method:\n   ${compoundFrequency === 'monthly' ? 'Each month, contributions are added and interest is applied to the total balance.' : 'Each year, contributions are added and interest is applied to the total balance.'}\n\n5. Final Results:\n   - Final Balance: $${finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - Total Contributed: $${totalContributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - Total Earnings: $${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${inflationAdjustedBalance ? `- Inflation-Adjusted Balance (${inflationRate}% inflation): $${inflationAdjustedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - Estimated Monthly Income (4% withdrawal): $${monthlyRetirementIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `- Estimated Monthly Income (4% withdrawal): $${monthlyRetirementIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}\n\n${inflationRate > 0 ? `Note: Inflation of ${inflationRate}% per year reduces the purchasing power of your savings. The inflation-adjusted balance shows what your savings would be worth in today's dollars.` : ''}`

	return {
		calculationMode: 'future_balance',
		finalBalance,
		totalContributed: Math.round(totalContributed * 100) / 100,
		totalEarnings: Math.round(totalEarnings * 100) / 100,
		inflationAdjustedBalance,
		monthlyRetirementIncome,
		yearlyBreakdown,
		formulaExplanation,
	}
}

/**
 * MODE B: Calculate required savings for desired retirement income
 */
function calculateRequiredSavings(inputs: Record<string, any>) {
	const currentAge = Math.floor(Number(inputs.currentAge || 0))
	const retirementAge = Math.floor(Number(inputs.retirementAge || 0))
	const lifeExpectancy = Math.floor(Number(inputs.lifeExpectancy || 85))
	const desiredMonthlyIncome = Number(inputs.desiredMonthlyIncome || 0)
	const expectedReturnRate = Number(inputs.expectedReturnRate || 0)
	const inflationRate = Number(inputs.inflationRate || 0)
	const withdrawalRate = Number(inputs.withdrawalRate || 0)
	const currentSavings = Number(inputs.currentSavings || 0)
	const annualReturnRate = Number(inputs.annualReturnRate || inputs.expectedReturnRate || 0)

	// Validation
	if (
		isNaN(currentAge) ||
		isNaN(retirementAge) ||
		isNaN(lifeExpectancy) ||
		isNaN(desiredMonthlyIncome) ||
		isNaN(expectedReturnRate) ||
		isNaN(inflationRate) ||
		isNaN(withdrawalRate) ||
		isNaN(currentSavings) ||
		isNaN(annualReturnRate) ||
		currentAge < 18 ||
		currentAge >= retirementAge ||
		retirementAge > 75 ||
		lifeExpectancy <= retirementAge ||
		desiredMonthlyIncome < 0 ||
		expectedReturnRate < 0 ||
		expectedReturnRate > 50 ||
		inflationRate < 0 ||
		inflationRate > 20 ||
		withdrawalRate < 0 ||
		withdrawalRate > 10 ||
		currentSavings < 0 ||
		annualReturnRate < 0 ||
		annualReturnRate > 50
	) {
	return {
		calculationMode: 'required_savings',
		requiredRetirementFund: null,
		monthlyIncomeAchievable: null,
		savingsGap: null,
		requiredMonthlyContribution: null,
		formulaExplanation: null,
	}
	}

	const yearsToRetirement = retirementAge - currentAge
	const yearsInRetirement = lifeExpectancy - retirementAge

	// Calculate inflation-adjusted annual income needed at retirement
	const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetirement)
	const targetAnnualIncome = desiredMonthlyIncome * 12 * inflationFactor

	// Calculate required retirement fund
	// Use withdrawal rate if provided, otherwise use annuity formula
	let requiredRetirementFund: number

	if (withdrawalRate > 0) {
		// Safe withdrawal rate approach
		requiredRetirementFund = (targetAnnualIncome / (withdrawalRate / 100))
	} else {
		// Annuity approach: calculate present value of annuity
		const monthlyRate = expectedReturnRate / 100 / 12
		const monthsInRetirement = yearsInRetirement * 12
		const monthlyIncome = targetAnnualIncome / 12

		if (monthlyRate === 0) {
			requiredRetirementFund = monthlyIncome * monthsInRetirement
		} else {
			const annuityFactor = (1 - Math.pow(1 + monthlyRate, -monthsInRetirement)) / monthlyRate
			requiredRetirementFund = monthlyIncome * annuityFactor
		}
	}

	requiredRetirementFund = Math.round(requiredRetirementFund * 100) / 100

	// Calculate savings gap
	const savingsGap = requiredRetirementFund - currentSavings

	// Calculate required monthly contribution to reach goal
	let requiredMonthlyContribution: number | null = null
	if (savingsGap > 0) {
		const monthlyRate = annualReturnRate / 100 / 12
		const monthsToRetirement = yearsToRetirement * 12

		if (monthlyRate === 0) {
			requiredMonthlyContribution = savingsGap / monthsToRetirement
		} else {
			const futureValueFactor = Math.pow(1 + monthlyRate, monthsToRetirement) - 1
			requiredMonthlyContribution = (savingsGap * monthlyRate) / futureValueFactor
		}

		requiredMonthlyContribution = Math.round(requiredMonthlyContribution * 100) / 100
	}

	// Calculate monthly income achievable with current savings
	let monthlyIncomeAchievable: number | null = null
	if (currentSavings > 0) {
		// Project current savings to retirement
		const monthlyRate = annualReturnRate / 100 / 12
		const monthsToRetirement = yearsToRetirement * 12
		const projectedSavings = currentSavings * Math.pow(1 + monthlyRate, monthsToRetirement)

		// Calculate income from projected savings
		if (withdrawalRate > 0) {
			monthlyIncomeAchievable = (projectedSavings * withdrawalRate / 100) / 12
		} else {
			const monthsInRetirement = yearsInRetirement * 12
			if (monthlyRate === 0) {
				monthlyIncomeAchievable = projectedSavings / monthsInRetirement
			} else {
				const annuityFactor = (1 - Math.pow(1 + monthlyRate, -monthsInRetirement)) / monthlyRate
				monthlyIncomeAchievable = projectedSavings / annuityFactor
			}
		}

		// Adjust for inflation
		monthlyIncomeAchievable = monthlyIncomeAchievable / inflationFactor
		monthlyIncomeAchievable = Math.round(monthlyIncomeAchievable * 100) / 100
	}

	// Build formula explanation
	let formulaExplanation = ''
	formulaExplanation = `Required Savings Calculation:\n\n1. Retirement Income Goal:\n   - Desired monthly income: $${desiredMonthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - Annual income: $${(desiredMonthlyIncome * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${inflationRate > 0 ? `- Inflation rate: ${inflationRate}%\n   - Years to retirement: ${yearsToRetirement}\n   - Inflation factor: ${inflationFactor.toFixed(4)}\n   - Target annual income at retirement: $${targetAnnualIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` : ''}2. Required Retirement Fund:\n   ${withdrawalRate > 0 ? `- Using safe withdrawal rate: ${withdrawalRate}%\n   - Required fund = Annual income / Withdrawal rate\n   - Required fund = $${targetAnnualIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${withdrawalRate}% = $${requiredRetirementFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` : `- Using annuity approach (${expectedReturnRate}% return, ${yearsInRetirement} years in retirement)\n   - Required fund = $${requiredRetirementFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`}3. Current Savings:\n   - Current savings: $${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - Savings gap: $${savingsGap.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n${requiredMonthlyContribution ? `4. Required Monthly Contribution:\n   - To reach goal: $${requiredMonthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month\n   - Assumed return rate: ${annualReturnRate}%\n   - Years to retirement: ${yearsToRetirement}\n` : '4. You have enough savings to meet your goal!\n'}${monthlyIncomeAchievable ? `5. Monthly Income Achievable:\n   - With current savings: $${monthlyIncomeAchievable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month\n` : ''}\nNote: These calculations assume consistent returns and contributions. Actual results may vary based on market conditions and personal circumstances.`

	return {
		calculationMode: 'required_savings',
		requiredRetirementFund,
		monthlyIncomeAchievable,
		savingsGap: Math.round(savingsGap * 100) / 100,
		requiredMonthlyContribution,
		formulaExplanation,
	}
}

