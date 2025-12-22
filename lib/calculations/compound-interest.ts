import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Step interface for compound interest calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Year-by-year breakdown interface
 */
interface YearBreakdown {
	year: number
	startingBalance: number
	contributions: number
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
		'daily': 365,
	}
	return frequencyMap[frequency.toLowerCase()] || 12
}

/**
 * Calculate compound interest with monthly contributions and year-by-year breakdown
 * Inputs: initialAmount, monthlyContribution, annualInterestRate, investmentPeriod, compoundingFrequency
 * Outputs: finalAmount, totalContributions, totalInterestEarned, effectiveAnnualRate, yearBreakdown, formulaExplanation
 */
export const calculateCompoundInterest: CalculatorFunction = (inputs) => {
	const initialAmount = Number(inputs.initialAmount || 0)
	const monthlyContribution = Number(inputs.monthlyContribution || 0)
	const annualInterestRate = Number(inputs.annualInterestRate)
	const investmentPeriod = Math.floor(Number(inputs.investmentPeriod)) // Must be integer >= 1
	const compoundingFrequencyStr = inputs.compoundingFrequency || 'monthly'
	const compoundingFrequency = getCompoundingFrequency(compoundingFrequencyStr)

	// Validation
	if (
		isNaN(initialAmount) ||
		isNaN(monthlyContribution) ||
		isNaN(annualInterestRate) ||
		isNaN(investmentPeriod) ||
		initialAmount < 0 ||
		monthlyContribution < 0 ||
		annualInterestRate <= 0 ||
		investmentPeriod < 1 ||
		investmentPeriod > 50 ||
		compoundingFrequency <= 0
	) {
		return {
			finalAmount: null,
			totalContributions: null,
			totalInterestEarned: null,
			effectiveAnnualRate: null,
			yearBreakdown: null,
			formulaExplanation: null,
		}
	}

	// Convert annual rate to decimal
	const rate = annualInterestRate / 100
	const periodicRate = rate / compoundingFrequency
	const periodsPerYear = compoundingFrequency
	const totalPeriods = investmentPeriod * periodsPerYear
	const monthlyRate = rate / 12
	const totalMonths = investmentPeriod * 12

	// Calculate future value of initial amount
	// If no monthly contributions, use selected compounding frequency
	// If monthly contributions exist, always compound monthly (standard practice)
	let futureValueOfPrincipal = 0
	if (monthlyContribution === 0) {
		// Use selected compounding frequency
		futureValueOfPrincipal = initialAmount * Math.pow(1 + periodicRate, totalPeriods)
	} else {
		// For calculations with monthly contributions, always compound monthly
		futureValueOfPrincipal = initialAmount * Math.pow(1 + monthlyRate, totalMonths)
	}

	// Calculate future value of monthly contributions using annuity formula
	// FV of annuity: PMT * [((1 + r/12)^(12t) - 1) / (r/12)]
	let futureValueOfContributions = 0
	if (monthlyContribution > 0) {
		if (monthlyRate > 0) {
			futureValueOfContributions = monthlyContribution * 
				((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
		} else {
			futureValueOfContributions = monthlyContribution * totalMonths
		}
	}

	// Total final amount
	const finalAmount = futureValueOfPrincipal + futureValueOfContributions
	const roundedFinalAmount = Math.round(finalAmount * 100) / 100

	// Calculate totals
	const totalContributions = initialAmount + (monthlyContribution * investmentPeriod * 12)
	const totalInterestEarned = roundedFinalAmount - totalContributions

	// Calculate effective annual rate (EAR) with monthly compounding
	// EAR = (1 + r/12)^12 - 1
	const effectiveAnnualRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100

	// Generate year-by-year breakdown
	const yearBreakdown: YearBreakdown[] = []
	let currentBalance = initialAmount

	for (let year = 1; year <= investmentPeriod; year++) {
		const startingBalance = currentBalance
		const yearContributions = monthlyContribution * 12
		
		let endingBalance = 0
		
		if (monthlyContribution > 0) {
			// With monthly contributions, compound monthly
			let yearBalance = startingBalance
			for (let month = 1; month <= 12; month++) {
				// Add monthly contribution at the start of the month
				yearBalance += monthlyContribution
				// Compound for the month (using monthly rate)
				yearBalance = yearBalance * (1 + monthlyRate)
			}
			endingBalance = Math.round(yearBalance * 100) / 100
		} else {
			// No monthly contributions, use selected compounding frequency
			// Compound for the year using the periodic rate
			const periodsThisYear = periodsPerYear
			endingBalance = Math.round(startingBalance * Math.pow(1 + periodicRate, periodsThisYear) * 100) / 100
		}
		
		const interestEarned = endingBalance - startingBalance - yearContributions
		
		yearBreakdown.push({
			year,
			startingBalance: Math.round(startingBalance * 100) / 100,
			contributions: yearContributions,
			interestEarned: Math.round(interestEarned * 100) / 100,
			endingBalance,
		})
		
		currentBalance = endingBalance
	}

	// Build formula explanation
	let formulaExplanation = ''
	if (monthlyContribution === 0) {
		// For initial amount only, use the selected compounding frequency
		const compoundingLabel = compoundingFrequencyStr === 'annually' ? 'annually' : 
			compoundingFrequencyStr === 'quarterly' ? 'quarterly' :
			compoundingFrequencyStr === 'daily' ? 'daily' : 'monthly'
		formulaExplanation = `The compound interest formula is: A = P(1 + r/n)^(nt)\n\nWhere:\n- A = Final amount\n- P = Initial amount ($${initialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n- r = Annual interest rate (${annualInterestRate}% = ${rate})\n- n = Compounding frequency (${compoundingFrequency} times per year, ${compoundingLabel})\n- t = Investment period (${investmentPeriod} years)\n\nSubstituting your values:\nA = $${initialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${rate.toFixed(6)}/${compoundingFrequency})^(${compoundingFrequency} × ${investmentPeriod})\nA = $${initialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${Math.pow(1 + periodicRate, totalPeriods).toFixed(6)}\nA = $${roundedFinalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nYour investment grows because interest is added not only to the initial amount, but also to previously earned interest. This creates exponential growth over time.`
	} else {
		// For calculations with monthly contributions, we always compound monthly
		formulaExplanation = `The calculation combines two formulas:\n\n1. Future Value of Initial Amount (compounded monthly):\n   FV₁ = P(1 + r/12)^(12t)\n   FV₁ = $${initialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${(rate/12).toFixed(6)})^(${investmentPeriod * 12})\n   FV₁ = $${futureValueOfPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Future Value of Monthly Contributions:\n   FV₂ = PMT × [((1 + r/12)^(12t) - 1) / (r/12)]\n   FV₂ = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [((1 + ${(rate/12).toFixed(6)})^(${investmentPeriod * 12}) - 1) / (${(rate/12).toFixed(6)})]\n   FV₂ = $${futureValueOfContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Total Final Amount:\n   A = FV₁ + FV₂\n   A = $${futureValueOfPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${futureValueOfContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   A = $${roundedFinalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nYour investment grows through compound interest on the initial amount plus the future value of all monthly contributions. Each contribution compounds over the remaining investment period. When monthly contributions are present, interest compounds monthly to match the contribution schedule.`
	}

	return {
		finalAmount: roundedFinalAmount,
		totalContributions: Math.round(totalContributions * 100) / 100,
		totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
		effectiveAnnualRate: Math.round(effectiveAnnualRate * 10000) / 100, // Round to 2 decimal places
		yearBreakdown,
		formulaExplanation,
	}
}

