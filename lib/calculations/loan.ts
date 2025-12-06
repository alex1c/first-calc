import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate loan payment (monthly payment using standard formula)
 * Inputs: principal, annualRate, years
 * Outputs: monthlyPayment, totalPayment, totalInterest
 */
export const calculateLoanPayment: CalculatorFunction = (inputs) => {
	const principal = Number(inputs.principal)
	const annualRate = Number(inputs.annualRate)
	const years = Number(inputs.years)

	if (
		isNaN(principal) ||
		isNaN(annualRate) ||
		isNaN(years) ||
		principal <= 0 ||
		annualRate < 0 ||
		years <= 0
	) {
		return {
			monthlyPayment: null,
			totalPayment: null,
			totalInterest: null,
		}
	}

	// Convert annual rate to monthly rate
	const monthlyRate = annualRate / 100 / 12

	// Number of monthly payments
	const numberOfPayments = years * 12

	// Calculate monthly payment using standard loan formula
	// M = P * [r(1+r)^n] / [(1+r)^n - 1]
	let monthlyPayment: number

	if (monthlyRate === 0) {
		// If interest rate is 0, payment is simply principal divided by months
		monthlyPayment = principal / numberOfPayments
	} else {
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		monthlyPayment = (principal * monthlyRate * rateFactor) / (rateFactor - 1)
	}

	// Round to 2 decimal places
	monthlyPayment = Math.round(monthlyPayment * 100) / 100

	// Calculate total payment and interest
	const totalPayment = monthlyPayment * numberOfPayments
	const totalInterest = totalPayment - principal

	return {
		monthlyPayment,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
	}
}

