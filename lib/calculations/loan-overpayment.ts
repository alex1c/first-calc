/**
 * Loan overpayment calculation functions
 * Calculates interest savings from making extra payments on a loan
 */

import type { CalculationFunction } from './registry'

/**
 * Step interface for loan overpayment calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Calculate loan overpayment savings
 * 
 * Compares standard loan payment with extra payments to show:
 * - Interest saved
 * - Time saved (reduced loan term)
 * 
 * @param inputs - Input values including loan amount, interest rate, term, extra payment amount and frequency
 * @returns Calculated overpayment metrics with step-by-step explanation
 */
export function calculateLoanOverpayment(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const loanAmount = Number(inputs.loanAmount || inputs.principal || 0)
	const interestRate = Number(inputs.interestRate || inputs.annualRate || 0)
	const loanTerm = Number(inputs.loanTerm || inputs.years || 0)
	const extraPayment = Number(inputs.extraPayment || 0)
	const paymentFrequency = String(inputs.paymentFrequency || 'monthly').toLowerCase()

	// Validation (extraPayment can be 0 or undefined)
	if (
		isNaN(loanAmount) ||
		isNaN(interestRate) ||
		isNaN(loanTerm) ||
		loanAmount <= 0 ||
		interestRate < 0 ||
		loanTerm <= 0 ||
		(isNaN(extraPayment) && extraPayment !== 0) ||
		extraPayment < 0
	) {
		return {
			monthlyPayment: null,
			totalInterest: null,
			totalInterestWithExtra: null,
			interestSaved: null,
			timeSaved: null,
			steps: null,
		}
	}

	// Ensure extraPayment is 0 if not provided or invalid
	const validExtraPayment = isNaN(extraPayment) ? 0 : Math.max(0, extraPayment)
	const steps: CalculationStep[] = []

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Loan Amount (P) = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${interestRate}%\nLoan Term = ${loanTerm} years\nExtra Payment = $${validExtraPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nPayment Frequency = ${paymentFrequency}`,
		explanation: 'These are the values you entered for the loan overpayment calculation.',
	})

	// Calculate standard monthly payment
	const monthlyRate = interestRate / 100 / 12
	const numberOfPayments = loanTerm * 12

	steps.push({
		title: 'Step 2: Convert Annual Rate to Monthly Rate',
		math: `Monthly Rate (r) = Annual Rate / 100 / 12\nr = ${interestRate}% / 100 / 12 = ${(interestRate / 100).toFixed(6)} / 12 = ${monthlyRate.toFixed(6)}`,
		explanation: 'Convert the annual interest rate to a monthly rate for the payment calculation.',
	})

	steps.push({
		title: 'Step 3: Calculate Total Number of Payments',
		math: `Number of Payments (n) = Loan Term × 12\nn = ${loanTerm} × 12 = ${numberOfPayments}`,
		explanation: 'Calculate the total number of monthly payments over the loan term.',
	})

	let monthlyPayment: number
	if (monthlyRate === 0) {
		monthlyPayment = loanAmount / numberOfPayments
		steps.push({
			title: 'Step 4: Calculate Standard Monthly Payment (Zero Interest)',
			math: `Monthly Payment = Loan Amount / Number of Payments\nMonthly Payment = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${numberOfPayments} = $${monthlyPayment.toFixed(2)}`,
			explanation: 'Since the interest rate is 0%, the monthly payment is simply the loan amount divided by the number of payments.',
		})
	} else {
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		steps.push({
			title: 'Step 4: Calculate Rate Factor (1 + r)^n',
			math: `Rate Factor = (1 + Monthly Rate)^Number of Payments\nRate Factor = (1 + ${monthlyRate.toFixed(6)})^${numberOfPayments} = ${rateFactor.toFixed(6)}`,
			explanation: 'Calculate the rate factor used in the loan payment formula.',
		})

		monthlyPayment = (loanAmount * monthlyRate * rateFactor) / (rateFactor - 1)
		steps.push({
			title: 'Step 5: Calculate Standard Monthly Payment',
			math: `Monthly Payment (M) = (P × r × (1 + r)^n) / ((1 + r)^n - 1)\nM = ($${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${monthlyRate.toFixed(6)} × ${rateFactor.toFixed(6)}) / (${rateFactor.toFixed(6)} - 1)\nM = $${monthlyPayment.toFixed(2)}`,
			explanation: 'Calculate the standard monthly payment using the loan payment formula.',
		})
	}

	// Calculate total interest for standard loan
	const totalPayment = monthlyPayment * numberOfPayments
	const totalInterest = totalPayment - loanAmount

	steps.push({
		title: 'Step 6: Calculate Total Interest (Standard Loan)',
		math: `Total Payment = Monthly Payment × Number of Payments\nTotal Payment = $${monthlyPayment.toFixed(2)} × ${numberOfPayments} = $${totalPayment.toFixed(2)}\n\nTotal Interest = Total Payment - Loan Amount\nTotal Interest = $${totalPayment.toFixed(2)} - $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = $${totalInterest.toFixed(2)}`,
		explanation: 'Calculate the total interest paid over the life of the loan without extra payments.',
	})

	// Calculate with extra payments
	let remainingBalance = loanAmount
	let totalInterestWithExtra = 0
	let monthsWithExtra = 0
	const paymentWithExtra = monthlyPayment + (paymentFrequency === 'monthly' ? validExtraPayment : 0)

	// Step 7: Calculate with extra payments
	if (validExtraPayment > 0) {
		steps.push({
			title: `Step 7: Calculate Loan with Extra Payments (${paymentFrequency === 'monthly' ? 'Monthly' : 'One-time'})`,
			math: `Payment with Extra = Standard Monthly Payment + Extra Payment\nPayment with Extra = $${monthlyPayment.toFixed(2)} + $${validExtraPayment.toFixed(2)} = $${paymentWithExtra.toFixed(2)}${paymentFrequency === 'one-time' ? '\n\nOne-time extra payment of $' + validExtraPayment.toFixed(2) + ' applied at month 1' : ''}`,
			explanation: `Calculate the payment amount including extra payments. ${paymentFrequency === 'monthly' ? 'Extra payment is added to each monthly payment.' : 'One-time extra payment is applied at the beginning.'}`,
		})

		// Simulate loan payments with extra payments
		while (remainingBalance > 0.01 && monthsWithExtra < numberOfPayments * 2) {
			// Interest for this month
			const monthlyInterest = remainingBalance * monthlyRate
			totalInterestWithExtra += monthlyInterest

			// Principal payment
			const principalPayment = paymentWithExtra - monthlyInterest

			// Apply one-time extra payment if specified
			if (paymentFrequency === 'one-time' && monthsWithExtra === 0 && validExtraPayment > 0) {
				remainingBalance -= validExtraPayment
			}

			// Reduce balance
			remainingBalance = remainingBalance - principalPayment

			monthsWithExtra++

			// Safety check to prevent infinite loop
			if (remainingBalance < 0) {
				remainingBalance = 0
			}
		}

		steps.push({
			title: 'Step 8: Calculate Total Interest with Extra Payments',
			math: `Total Interest (With Extra) = $${totalInterestWithExtra.toFixed(2)}\nNew Loan Term = ${monthsWithExtra} months (${(monthsWithExtra / 12).toFixed(1)} years)`,
			explanation: 'Calculate the total interest paid when making extra payments. The loan is paid off faster, reducing total interest.',
		})

		// Calculate savings
		const interestSaved = totalInterest - totalInterestWithExtra
		const timeSaved = numberOfPayments - monthsWithExtra

		steps.push({
			title: 'Step 9: Calculate Interest Saved',
			math: `Interest Saved = Total Interest (Standard) - Total Interest (With Extra)\nInterest Saved = $${totalInterest.toFixed(2)} - $${totalInterestWithExtra.toFixed(2)} = $${interestSaved.toFixed(2)}`,
			explanation: 'Calculate how much interest you save by making extra payments.',
		})

		steps.push({
			title: 'Step 10: Calculate Time Saved',
			math: `Time Saved = Original Term - New Term\nTime Saved = ${numberOfPayments} months - ${monthsWithExtra} months = ${timeSaved} months (${(timeSaved / 12).toFixed(1)} years)`,
			explanation: 'Calculate how much time you save by making extra payments.',
		})

		return {
			monthlyPayment: Math.round(monthlyPayment * 100) / 100,
			totalInterest: Math.round(totalInterest * 100) / 100,
			totalInterestWithExtra: Math.round(totalInterestWithExtra * 100) / 100,
			interestSaved: Math.round(interestSaved * 100) / 100,
			timeSaved: Math.max(0, Math.round(timeSaved)),
			newTerm: Math.max(0, Math.round(monthsWithExtra / 12 * 10) / 10),
			steps,
		}
	} else {
		// No extra payments
		steps.push({
			title: 'Step 7: No Extra Payments',
			math: `Extra Payment = $0\nNo extra payments were made.`,
			explanation: 'No extra payments were specified. The calculation shows standard loan terms only.',
		})

		return {
			monthlyPayment: Math.round(monthlyPayment * 100) / 100,
			totalInterest: Math.round(totalInterest * 100) / 100,
			totalInterestWithExtra: Math.round(totalInterest * 100) / 100,
			interestSaved: 0,
			timeSaved: 0,
			newTerm: loanTerm,
			steps,
		}
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateLoanOverpayment', calculateLoanOverpayment)

