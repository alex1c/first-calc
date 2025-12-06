import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate compound interest
 * Inputs: principal, annualRate, years, compoundFrequency
 * Outputs: finalAmount, totalInterest
 */
export const calculateCompoundInterest: CalculatorFunction = (inputs) => {
	const principal = Number(inputs.principal)
	const annualRate = Number(inputs.annualRate)
	const years = Number(inputs.years)
	const compoundFrequency = Number(inputs.compoundFrequency || 12) // Default monthly

	if (
		isNaN(principal) ||
		isNaN(annualRate) ||
		isNaN(years) ||
		isNaN(compoundFrequency) ||
		principal <= 0 ||
		annualRate < 0 ||
		years <= 0 ||
		compoundFrequency <= 0
	) {
		return {
			finalAmount: null,
			totalInterest: null,
		}
	}

	// Convert annual rate to decimal
	const rate = annualRate / 100

	// Calculate compound interest: A = P(1 + r/n)^(nt)
	// where A = final amount, P = principal, r = annual rate, n = compounding frequency, t = years
	const finalAmount =
		principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * years)

	// Round to 2 decimal places
	const roundedFinalAmount = Math.round(finalAmount * 100) / 100

	// Calculate total interest earned
	const totalInterest = roundedFinalAmount - principal

	return {
		finalAmount: roundedFinalAmount,
		totalInterest: Math.round(totalInterest * 100) / 100,
	}
}

