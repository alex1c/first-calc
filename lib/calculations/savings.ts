/**
 * Calculate savings growth with compound interest and regular contributions
 * Inputs: initialSavings, regularContribution, contributionFrequency, annualInterestRate, savingsPeriod, compoundingFrequency, targetAmount, inflationRate
 * Outputs: finalSavings, totalContributions, totalInterestEarned, timeToTarget, inflationAdjustedSavings, yearlyBreakdown, formulaExplanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Year-by-year breakdown interface
 */
interface YearBreakdown {
	year: number
	startingBalance: number
	contribution: number
	interestEarned: number
	endingBalance: number
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
 * Calculate savings growth with comprehensive breakdown
 */
export const calculateSavings: CalculatorFunction = (inputs) => {
	const initialSavings = Number(inputs.initialSavings || 0)
	const regularContribution = Number(inputs.regularContribution || inputs.monthlyContribution || 0)
	const contributionFrequencyStr = inputs.contributionFrequency || (inputs.monthlyContribution ? 'monthly' : 'yearly')
	const annualInterestRate = Number(inputs.annualInterestRate || inputs.interestRate || 0)
	const savingsPeriod = Math.floor(Number(inputs.savingsPeriod || inputs.years || 0)) // Must be integer >= 1
	const compoundingFrequencyStr = inputs.compoundingFrequency || 'monthly'
	const targetAmount = Number(inputs.targetAmount || 0)
	const inflationRate = Number(inputs.inflationRate || 0)

	// Validation
	if (
		isNaN(initialSavings) ||
		isNaN(regularContribution) ||
		isNaN(annualInterestRate) ||
		isNaN(savingsPeriod) ||
		isNaN(targetAmount) ||
		isNaN(inflationRate) ||
		initialSavings < 0 ||
		regularContribution < 0 ||
		annualInterestRate < 0 ||
		savingsPeriod < 1 ||
		savingsPeriod > 50 ||
		targetAmount < 0 ||
		inflationRate < 0
	) {
		return {
			finalSavings: null,
			totalContributions: null,
			totalInterestEarned: null,
			timeToTarget: null,
			inflationAdjustedSavings: null,
			yearlyBreakdown: null,
			formulaExplanation: null,
		}
	}

	const compoundingFrequency = getCompoundingFrequency(compoundingFrequencyStr)
	const contributionsPerYear = getContributionsPerYear(contributionFrequencyStr)
	const annualRate = annualInterestRate / 100
	const periodicRate = annualRate / compoundingFrequency
	const totalPeriods = savingsPeriod * compoundingFrequency
	const totalContributionsCount = savingsPeriod * contributionsPerYear

	// Calculate future value of initial savings
	let futureValueInitial = 0
	if (initialSavings > 0) {
		if (periodicRate === 0) {
			futureValueInitial = initialSavings
		} else {
			futureValueInitial = initialSavings * Math.pow(1 + periodicRate, totalPeriods)
		}
	}

	// Calculate future value of regular contributions
	let futureValueContributions = 0
	if (regularContribution > 0) {
		// Convert regular contribution to match compounding frequency
		const contributionPerPeriod = regularContribution * (contributionsPerYear / compoundingFrequency)
		
		if (periodicRate === 0) {
			futureValueContributions = contributionPerPeriod * totalPeriods
		} else {
			// Future value of annuity: FV = PMT * [((1 + r)^n - 1) / r]
			const rateFactor = Math.pow(1 + periodicRate, totalPeriods)
			futureValueContributions = contributionPerPeriod * ((rateFactor - 1) / periodicRate)
		}
	}

	// Total final savings
	const finalSavings = futureValueInitial + futureValueContributions
	const roundedFinalSavings = Math.round(finalSavings * 100) / 100

	// Calculate totals
	const totalContributions = initialSavings + (regularContribution * totalContributionsCount)
	const totalInterestEarned = roundedFinalSavings - totalContributions

	// Calculate inflation-adjusted savings
	let inflationAdjustedSavings = roundedFinalSavings
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, savingsPeriod)
		inflationAdjustedSavings = roundedFinalSavings / inflationFactor
	}

	// Calculate time to target if target amount is provided
	let timeToTarget = null
	if (targetAmount > 0 && roundedFinalSavings < targetAmount) {
		// Estimate time needed to reach target (simplified calculation)
		// This is an approximation - for exact calculation, we'd need to solve iteratively
		const monthlyRate = annualRate / 12
		let currentBalance = initialSavings
		let months = 0
		const monthlyContribution = contributionsPerYear === 12 ? regularContribution : regularContribution / 12
		const maxMonths = savingsPeriod * 12 * 2 // Safety limit

		while (currentBalance < targetAmount && months < maxMonths) {
			currentBalance += monthlyContribution
			if (monthlyRate > 0) {
				currentBalance = currentBalance * (1 + monthlyRate)
			}
			months++
		}

		if (months < maxMonths) {
			timeToTarget = Math.round((months / 12) * 10) / 10 // In years, rounded to 1 decimal
		}
	}

	// Generate year-by-year breakdown
	const yearlyBreakdown: YearBreakdown[] = []
	let currentValue = initialSavings
	const monthlyRate = annualRate / 12

	for (let year = 1; year <= savingsPeriod; year++) {
		const startingBalance = currentValue
		const yearContributions = regularContribution * contributionsPerYear
		
		// Calculate growth for this year
		let yearValue = startingBalance
		
		if (contributionsPerYear === 12) {
			// Monthly contributions: add contribution each month and compound monthly
			for (let month = 1; month <= 12; month++) {
				yearValue += regularContribution
				yearValue = yearValue * (1 + monthlyRate)
			}
		} else {
			// Yearly contributions: add contribution at start of year, compound monthly for the year
			yearValue += regularContribution
			// Compound monthly for the entire year
			for (let month = 1; month <= 12; month++) {
				yearValue = yearValue * (1 + monthlyRate)
			}
		}
		
		const endingBalance = Math.round(yearValue * 100) / 100
		const interestEarned = endingBalance - startingBalance - yearContributions
		
		yearlyBreakdown.push({
			year,
			startingBalance: Math.round(startingBalance * 100) / 100,
			contribution: yearContributions,
			interestEarned: Math.round(interestEarned * 100) / 100,
			endingBalance,
		})
		
		currentValue = endingBalance
	}

	// Build formula explanation
	const contributionLabel = contributionFrequencyStr === 'yearly' ? 'yearly' : 'monthly'
	const compoundingLabel = compoundingFrequencyStr === 'annually' ? 'annually' : 
		compoundingFrequencyStr === 'quarterly' ? 'quarterly' : 'monthly'
	
	let formulaExplanation = ''
	
	formulaExplanation = `Savings Growth Calculation:\n\n1. Future Value of Initial Savings:\n   FV₁ = P × (1 + r/n)^(nt)\n\n   Where:\n   - P = Initial savings = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r = Annual interest rate = ${annualInterestRate}% = ${annualRate}\n   - n = Compounding frequency = ${compoundingFrequency} times per year (${compoundingLabel})\n   - t = Savings period = ${savingsPeriod} years\n\n   Substituting:\n   FV₁ = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${periodicRate.toFixed(6)})^(${totalPeriods})\n   FV₁ = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${Math.pow(1 + periodicRate, totalPeriods).toFixed(6)}\n   FV₁ = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Future Value of ${contributionLabel.charAt(0).toUpperCase() + contributionLabel.slice(1)} Contributions:\n   FV₂ = PMT × [((1 + r/n)^(nt) - 1) / (r/n)]\n\n   Where:\n   - PMT = ${contributionLabel} contribution = $${regularContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r, n, t = Same as above\n\n   Substituting:\n   FV₂ = $${regularContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [((1 + ${periodicRate.toFixed(6)})^(${totalPeriods}) - 1) / (${periodicRate.toFixed(6)})]\n   FV₂ = $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Total Final Savings:\n   FV = FV₁ + FV₂\n   FV = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   FV = $${roundedFinalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n4. Savings Breakdown:\n   Total Contributions: $${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Interest Earned: $${totalInterestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n${inflationRate > 0 ? `5. Inflation Adjustment:\n   Inflation Factor = (1 + ${inflationRate}%)^${savingsPeriod} = ${Math.pow(1 + inflationRate / 100, savingsPeriod).toFixed(6)}\n   Real Value (Today's Dollars) = $${roundedFinalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${Math.pow(1 + inflationRate / 100, savingsPeriod).toFixed(6)}\n   Real Value = $${inflationAdjustedSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n` : ''}${targetAmount > 0 ? `6. Target Amount Analysis:\n   Target Amount: $${targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${roundedFinalSavings >= targetAmount ? `Final Savings: $${roundedFinalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Target reached!)\n   ` : timeToTarget ? `Estimated Time to Reach Target: ${timeToTarget} years\n   ` : `Final Savings: $${roundedFinalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Target not reached in ${savingsPeriod} years)\n   `}\n\n` : ''}Your savings grow through compound interest - each period's interest earns interest in future periods. The difference between your total contributions and final savings represents the interest you earned. ${inflationRate > 0 ? 'The inflation-adjusted value shows your purchasing power in today\'s dollars, accounting for the eroding effect of inflation over time. ' : ''}Regular contributions combined with compound interest create steady growth over long savings periods.`

	return {
		finalSavings: roundedFinalSavings,
		totalContributions: Math.round(totalContributions * 100) / 100,
		totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
		timeToTarget: timeToTarget,
		inflationAdjustedSavings: inflationRate > 0 ? Math.round(inflationAdjustedSavings * 100) / 100 : null,
		yearlyBreakdown,
		formulaExplanation,
	}
}
