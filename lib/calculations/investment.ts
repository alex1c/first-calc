/**
 * Calculate investment growth with compound returns and regular contributions
 * Inputs: initialInvestment, periodicContribution, contributionFrequency, expectedAnnualReturn, investmentPeriod, compoundingFrequency, inflationRate
 * Outputs: finalValue, totalContributions, totalReturn, returnPercentage, inflationAdjustedValue, yearlyBreakdown, formulaExplanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Year-by-year breakdown interface
 */
interface YearBreakdown {
	year: number
	startingValue: number
	contribution: number
	returnEarned: number
	endingValue: number
}

/**
 * Map compounding frequency string to number
 */
function getCompoundingFrequency(frequency: string | number): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	const frequencyMap: Record<string, number> = {
		'annually': 1,
		'quarterly': 4,
		'monthly': 12,
	}
	return frequencyMap[frequency.toLowerCase()] || 12
}

/**
 * Map contribution frequency string to contributions per year
 */
function getContributionsPerYear(frequency: string): number {
	const frequencyMap: Record<string, number> = {
		'monthly': 12,
		'yearly': 1,
	}
	return frequencyMap[frequency.toLowerCase()] || 12
}

/**
 * Calculate investment growth with comprehensive breakdown
 */
export const calculateInvestment: CalculatorFunction = (inputs) => {
	const initialInvestment = Number(inputs.initialInvestment || 0)
	const periodicContribution = Number(inputs.periodicContribution || inputs.monthlyContribution || 0)
	const contributionFrequencyStr = inputs.contributionFrequency || inputs.monthlyContribution ? 'monthly' : 'yearly'
	const expectedAnnualReturn = Number(inputs.expectedAnnualReturn || inputs.interestRate || 0)
	const investmentPeriod = Math.floor(Number(inputs.investmentPeriod || inputs.years || 0)) // Must be integer >= 1
	const compoundingFrequencyStr = inputs.compoundingFrequency || 'monthly'
	const inflationRate = Number(inputs.inflationRate || 0)

	// Validation
	if (
		isNaN(initialInvestment) ||
		isNaN(periodicContribution) ||
		isNaN(expectedAnnualReturn) ||
		isNaN(investmentPeriod) ||
		isNaN(inflationRate) ||
		initialInvestment < 0 ||
		periodicContribution < 0 ||
		expectedAnnualReturn <= 0 ||
		investmentPeriod < 1 ||
		investmentPeriod > 50 ||
		inflationRate < 0
	) {
		return {
			finalValue: null,
			totalContributions: null,
			totalReturn: null,
			returnPercentage: null,
			inflationAdjustedValue: null,
			yearlyBreakdown: null,
			formulaExplanation: null,
		}
	}

	const compoundingFrequency = getCompoundingFrequency(compoundingFrequencyStr)
	const contributionsPerYear = getContributionsPerYear(contributionFrequencyStr)
	const annualRate = expectedAnnualReturn / 100
	const periodicRate = annualRate / compoundingFrequency
	const totalPeriods = investmentPeriod * compoundingFrequency
	const totalContributionsCount = investmentPeriod * contributionsPerYear

	// Calculate future value of initial investment
	let futureValueInitial = 0
	if (initialInvestment > 0) {
		if (periodicRate === 0) {
			futureValueInitial = initialInvestment
		} else {
			futureValueInitial = initialInvestment * Math.pow(1 + periodicRate, totalPeriods)
		}
	}

	// Calculate future value of periodic contributions
	let futureValueContributions = 0
	if (periodicContribution > 0) {
		// Convert periodic contribution to match compounding frequency
		// If contributions are monthly but compounding is quarterly, adjust
		const contributionPerPeriod = periodicContribution * (contributionsPerYear / compoundingFrequency)
		
		if (periodicRate === 0) {
			futureValueContributions = contributionPerPeriod * totalPeriods
		} else {
			// Future value of annuity: FV = PMT * [((1 + r)^n - 1) / r]
			const rateFactor = Math.pow(1 + periodicRate, totalPeriods)
			futureValueContributions = contributionPerPeriod * ((rateFactor - 1) / periodicRate)
		}
	}

	// Total final value
	const finalValue = futureValueInitial + futureValueContributions
	const roundedFinalValue = Math.round(finalValue * 100) / 100

	// Calculate totals
	const totalContributions = initialInvestment + (periodicContribution * totalContributionsCount)
	const totalReturn = roundedFinalValue - totalContributions
	const returnPercentage = totalContributions > 0 
		? (totalReturn / totalContributions) * 100 
		: 0

	// Calculate inflation-adjusted value
	let inflationAdjustedValue = roundedFinalValue
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, investmentPeriod)
		inflationAdjustedValue = roundedFinalValue / inflationFactor
	}

	// Generate year-by-year breakdown
	// For simplicity and accuracy, we'll use monthly compounding for the breakdown
	// when contributions are monthly, as this is the most common scenario
	const yearlyBreakdown: YearBreakdown[] = []
	let currentValue = initialInvestment
	const monthlyRate = annualRate / 12

	for (let year = 1; year <= investmentPeriod; year++) {
		const startingValue = currentValue
		const yearContributions = periodicContribution * contributionsPerYear
		
		// Calculate growth for this year
		let yearValue = startingValue
		
		if (contributionsPerYear === 12) {
			// Monthly contributions: add contribution each month and compound monthly
			for (let month = 1; month <= 12; month++) {
				yearValue += periodicContribution
				yearValue = yearValue * (1 + monthlyRate)
			}
		} else {
			// Yearly contributions: add contribution at start of year, compound monthly for the year
			yearValue += periodicContribution
			// Compound monthly for the entire year
			for (let month = 1; month <= 12; month++) {
				yearValue = yearValue * (1 + monthlyRate)
			}
		}
		
		const endingValue = Math.round(yearValue * 100) / 100
		const returnEarned = endingValue - startingValue - yearContributions
		
		yearlyBreakdown.push({
			year,
			startingValue: Math.round(startingValue * 100) / 100,
			contribution: yearContributions,
			returnEarned: Math.round(returnEarned * 100) / 100,
			endingValue,
		})
		
		currentValue = endingValue
	}

	// Build formula explanation
	const contributionLabel = contributionFrequencyStr === 'yearly' ? 'yearly' : 'monthly'
	const compoundingLabel = compoundingFrequencyStr === 'annually' ? 'annually' : 
		compoundingFrequencyStr === 'quarterly' ? 'quarterly' : 'monthly'
	
	let formulaExplanation = ''
	
	formulaExplanation = `Investment Growth Calculation:\n\n1. Future Value of Initial Investment:\n   FV₁ = P × (1 + r/n)^(nt)\n\n   Where:\n   - P = Initial investment = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r = Annual return rate = ${expectedAnnualReturn}% = ${annualRate}\n   - n = Compounding frequency = ${compoundingFrequency} times per year (${compoundingLabel})\n   - t = Investment period = ${investmentPeriod} years\n\n   Substituting:\n   FV₁ = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${periodicRate.toFixed(6)})^(${totalPeriods})\n   FV₁ = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${Math.pow(1 + periodicRate, totalPeriods).toFixed(6)}\n   FV₁ = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Future Value of ${contributionLabel.charAt(0).toUpperCase() + contributionLabel.slice(1)} Contributions:\n   FV₂ = PMT × [((1 + r/n)^(nt) - 1) / (r/n)]\n\n   Where:\n   - PMT = ${contributionLabel} contribution = $${periodicContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r, n, t = Same as above\n\n   Substituting:\n   FV₂ = $${periodicContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [((1 + ${periodicRate.toFixed(6)})^(${totalPeriods}) - 1) / (${periodicRate.toFixed(6)})]\n   FV₂ = $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Total Final Value:\n   FV = FV₁ + FV₂\n   FV = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   FV = $${roundedFinalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n4. Investment Returns:\n   Total Contributions: $${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Return (Profit): $${totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Return Percentage: ${returnPercentage.toFixed(2)}%\n\n${inflationRate > 0 ? `5. Inflation Adjustment:\n   Inflation Factor = (1 + ${inflationRate}%)^${investmentPeriod} = ${Math.pow(1 + inflationRate / 100, investmentPeriod).toFixed(6)}\n   Real Value (Today's Dollars) = $${roundedFinalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${Math.pow(1 + inflationRate / 100, investmentPeriod).toFixed(6)}\n   Real Value = $${inflationAdjustedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n` : ''}Your investment grows through compound returns - each period's returns earn returns in future periods. The difference between your total contributions and final value represents your profit. ${inflationRate > 0 ? 'The inflation-adjusted value shows your purchasing power in today\'s dollars, accounting for the eroding effect of inflation over time. ' : ''}Regular contributions combined with compound returns create exponential growth over long investment periods.`

	return {
		finalValue: roundedFinalValue,
		totalContributions: Math.round(totalContributions * 100) / 100,
		totalReturn: Math.round(totalReturn * 100) / 100,
		returnPercentage: Math.round(returnPercentage * 10000) / 100, // Round to 2 decimal places
		inflationAdjustedValue: inflationRate > 0 ? Math.round(inflationAdjustedValue * 100) / 100 : null,
		yearlyBreakdown,
		formulaExplanation,
	}
}
