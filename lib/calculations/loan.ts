import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Step interface for loan payment calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Calculate loan payment (monthly payment using standard formula) with step-by-step explanation
 * Inputs: principal, annualRate, years
 * Outputs: monthlyPayment, totalPayment, totalInterest, steps
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
			steps: null,
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

	// Build step-by-step calculation
	const steps: CalculationStep[] = []

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Principal (P) = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${annualRate}%\nLoan Term = ${years} years`,
		explanation: 'These are the values you entered for the loan calculation.',
	})

	// Step 2: Convert annual rate to monthly rate
	steps.push({
		title: 'Step 2: Convert Annual Rate to Monthly Rate',
		math: `Monthly Rate (r) = Annual Rate / 100 / 12\nr = ${annualRate}% / 100 / 12 = ${annualRate / 100} / 12 = ${monthlyRate.toFixed(6)}`,
		explanation: 'Divide the annual interest rate by 100 to convert to decimal, then divide by 12 to get the monthly rate.',
	})

	// Step 3: Calculate number of payments
	steps.push({
		title: 'Step 3: Calculate Number of Monthly Payments',
		math: `Number of Payments (n) = Years × 12\nn = ${years} × 12 = ${numberOfPayments}`,
		explanation: 'Multiply the loan term in years by 12 to get the total number of monthly payments.',
	})

	if (monthlyRate === 0) {
		// Special case: zero interest
		steps.push({
			title: 'Step 4: Calculate Monthly Payment (Zero Interest)',
			math: `M = P / n\nM = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${numberOfPayments}\nM = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Since the interest rate is 0%, the monthly payment is simply the principal divided by the number of payments.',
		})
	} else {
		// Step 4: Calculate rate factor
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		steps.push({
			title: 'Step 4: Calculate Rate Factor',
			math: `(1 + r)^n = (1 + ${monthlyRate.toFixed(6)})^${numberOfPayments} = ${rateFactor.toFixed(6)}`,
			explanation: 'This factor represents the compound growth of interest over the loan term.',
		})

		// Step 5: Calculate numerator
		const numerator = principal * monthlyRate * rateFactor
		steps.push({
			title: 'Step 5: Calculate Numerator',
			math: `P × r × (1 + r)^n = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${monthlyRate.toFixed(6)} × ${rateFactor.toFixed(6)}\n= $${numerator.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Multiply the principal by the monthly rate and the rate factor.',
		})

		// Step 6: Calculate denominator
		const denominator = rateFactor - 1
		steps.push({
			title: 'Step 6: Calculate Denominator',
			math: `(1 + r)^n - 1 = ${rateFactor.toFixed(6)} - 1 = ${denominator.toFixed(6)}`,
			explanation: 'Subtract 1 from the rate factor to get the denominator.',
		})

		// Step 7: Calculate monthly payment
		steps.push({
			title: 'Step 7: Calculate Monthly Payment',
			math: `M = [P × r × (1 + r)^n] / [(1 + r)^n - 1]\nM = $${numerator.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${denominator.toFixed(6)}\nM = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Divide the numerator by the denominator to get the monthly payment amount.',
		})
	}

	// Step 8: Calculate total payment
	steps.push({
		title: 'Step 8: Calculate Total Payment',
		math: `Total Payment = Monthly Payment × Number of Payments\nTotal Payment = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${numberOfPayments}\nTotal Payment = $${Math.round(totalPayment * 100) / 100}`,
		explanation: 'Multiply the monthly payment by the total number of payments to get the total amount paid over the life of the loan.',
	})

	// Step 9: Calculate total interest
	steps.push({
		title: 'Step 9: Calculate Total Interest',
		math: `Total Interest = Total Payment - Principal\nTotal Interest = $${Math.round(totalPayment * 100) / 100} - $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest = $${Math.round(totalInterest * 100) / 100}`,
		explanation: 'Subtract the original principal from the total payment to find how much interest you will pay over the life of the loan.',
	})

	return {
		monthlyPayment,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		steps,
	}
}

