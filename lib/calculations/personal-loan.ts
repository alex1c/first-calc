/**
 * Calculate personal loan payment and details
 * Inputs: loanAmount, interestRate, loanTerm, originationFee
 * Outputs: monthlyPayment, totalPayment, totalInterest, totalFees, apr, steps
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Step interface for personal loan calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

export const calculatePersonalLoan: CalculationFunction = (inputs) => {
	const loanAmount = Number(inputs.loanAmount) || 0
	const interestRate = Number(inputs.interestRate) || 0
	const loanTerm = Number(inputs.loanTerm) || 1
	const originationFeePercent = Number(inputs.originationFee) || 0
	const paymentType = String(inputs.paymentType || 'annuity').toLowerCase()
	const prepaymentPenalty = Number(inputs.prepaymentPenalty || 0)
	const latePaymentFee = Number(inputs.latePaymentFee || 0)

	// Validation
	if (loanAmount <= 0 || interestRate < 0 || loanTerm <= 0 || originationFeePercent < 0) {
		return {
			monthlyPayment: null,
			totalPayment: null,
			totalInterest: null,
			totalFees: null,
			apr: null,
			steps: null,
		}
	}

	const steps: CalculationStep[] = []

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${interestRate}%\nLoan Term = ${loanTerm} years\nOrigination Fee = ${originationFeePercent}%${prepaymentPenalty > 0 ? `\nPrepayment Penalty = ${prepaymentPenalty}%` : ''}${latePaymentFee > 0 ? `\nLate Payment Fee = $${latePaymentFee.toFixed(2)}` : ''}`,
		explanation: 'These are the values you entered for the personal loan calculation.',
	})

	// Calculate origination fee
	const originationFee = (loanAmount * originationFeePercent) / 100
	const netLoanAmount = loanAmount - originationFee

	steps.push({
		title: 'Step 2: Calculate Origination Fee',
		math: `Origination Fee = Loan Amount × Origination Fee % / 100\nOrigination Fee = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${originationFeePercent}% / 100\nOrigination Fee = $${originationFee.toFixed(2)}`,
		explanation: 'The origination fee is a one-time fee deducted from the loan amount.',
	})

	if (netLoanAmount <= 0) {
		steps.push({
			title: 'Error: Invalid Net Loan Amount',
			math: `Net Loan Amount = Loan Amount - Origination Fee\nNet Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${originationFee.toFixed(2)} = $${netLoanAmount.toFixed(2)}`,
			explanation: 'The origination fee cannot exceed the loan amount. Please adjust your inputs.',
		})
		return {
			monthlyPayment: null,
			totalPayment: null,
			totalInterest: null,
			totalFees: originationFee,
			apr: null,
			steps,
		}
	}

	steps.push({
		title: 'Step 3: Calculate Net Loan Amount',
		math: `Net Loan Amount (Principal) = Loan Amount - Origination Fee\nNet Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${originationFee.toFixed(2)}\nNet Loan Amount = $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		explanation: 'This is the actual amount you receive after the origination fee is deducted.',
	})

	// Convert annual rate to monthly rate
	const monthlyRate = interestRate / 100 / 12

	steps.push({
		title: 'Step 4: Convert Annual Rate to Monthly Rate',
		math: `Monthly Rate (r) = Annual Rate / 100 / 12\nr = ${interestRate}% / 100 / 12 = ${(interestRate / 100).toFixed(6)} / 12 = ${monthlyRate.toFixed(6)}`,
		explanation: 'Convert the annual interest rate to a monthly rate for the payment calculation.',
	})

	// Number of monthly payments
	const numberOfPayments = loanTerm * 12

	steps.push({
		title: 'Step 5: Calculate Total Number of Payments',
		math: `Number of Payments (n) = Loan Term × 12\nn = ${loanTerm} × 12 = ${numberOfPayments}`,
		explanation: 'Calculate the total number of monthly payments over the loan term.',
	})

	// Calculate monthly payment using standard loan formula
	let monthlyPayment: number

	if (monthlyRate === 0) {
		// If interest rate is 0, payment is simply net loan amount divided by months
		monthlyPayment = netLoanAmount / numberOfPayments
		steps.push({
			title: 'Step 6: Calculate Monthly Payment (Zero Interest)',
			math: `Monthly Payment = Net Loan Amount / Number of Payments\nMonthly Payment = $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${numberOfPayments} = $${monthlyPayment.toFixed(2)}`,
			explanation: 'Since the interest rate is 0%, the monthly payment is simply the net loan amount divided by the number of payments.',
		})
	} else {
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		steps.push({
			title: 'Step 6: Calculate Rate Factor (1 + r)^n',
			math: `Rate Factor = (1 + Monthly Rate)^Number of Payments\nRate Factor = (1 + ${monthlyRate.toFixed(6)})^${numberOfPayments} = ${rateFactor.toFixed(6)}`,
			explanation: 'Calculate the rate factor used in the loan payment formula.',
		})

		monthlyPayment = (netLoanAmount * monthlyRate * rateFactor) / (rateFactor - 1)
		steps.push({
			title: 'Step 7: Calculate Monthly Payment (M)',
			math: `Monthly Payment (M) = (P × r × (1 + r)^n) / ((1 + r)^n - 1)\nM = ($${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${monthlyRate.toFixed(6)} × ${rateFactor.toFixed(6)}) / (${rateFactor.toFixed(6)} - 1)\nM = $${monthlyPayment.toFixed(2)}`,
			explanation: 'Calculate the monthly payment using the standard loan payment formula.',
		})
	}

	// Round to 2 decimal places
	monthlyPayment = Math.round(monthlyPayment * 100) / 100

	// Calculate total payment and interest
	const totalPayment = monthlyPayment * numberOfPayments
	const totalInterest = totalPayment - netLoanAmount

	steps.push({
		title: 'Step 8: Calculate Total Payment',
		math: `Total Payment = Monthly Payment × Number of Payments\nTotal Payment = $${monthlyPayment.toFixed(2)} × ${numberOfPayments} = $${totalPayment.toFixed(2)}`,
		explanation: 'Calculate the total amount you will pay over the entire loan term.',
	})

	steps.push({
		title: 'Step 9: Calculate Total Interest',
		math: `Total Interest = Total Payment - Net Loan Amount\nTotal Interest = $${totalPayment.toFixed(2)} - $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest = $${totalInterest.toFixed(2)}`,
		explanation: 'Calculate the total amount of interest you will pay on the loan.',
	})

	// Calculate APR (approximate, includes origination fee)
	// APR = ((Total Interest + Fees) / Loan Amount) / (Loan Term in years) * 100
	const totalCost = totalInterest + originationFee
	const apr = (totalCost / loanAmount) / loanTerm * 100

	steps.push({
		title: 'Step 10: Calculate APR (Annual Percentage Rate)',
		math: `Total Cost = Total Interest + Origination Fee\nTotal Cost = $${totalInterest.toFixed(2)} + $${originationFee.toFixed(2)} = $${totalCost.toFixed(2)}\n\nAPR = (Total Cost / Loan Amount) / Loan Term × 100%\nAPR = ($${totalCost.toFixed(2)} / $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) / ${loanTerm} × 100%\nAPR = ${apr.toFixed(2)}%`,
		explanation: 'APR includes both interest and fees, giving you the true annual cost of borrowing.',
	})

	// Add information about penalties if applicable
	if (prepaymentPenalty > 0 || latePaymentFee > 0) {
		steps.push({
			title: 'Step 11: Additional Fees Information',
			math: `${prepaymentPenalty > 0 ? `Prepayment Penalty: ${prepaymentPenalty}% of remaining balance if paid early\n` : ''}${latePaymentFee > 0 ? `Late Payment Fee: $${latePaymentFee.toFixed(2)} per late payment\n` : ''}${prepaymentPenalty > 0 && latePaymentFee > 0 ? '\nNote: These fees are not included in the base calculation but may apply in certain scenarios.' : ''}`,
			explanation: 'Additional fees that may apply: prepayment penalties for early payoff and late payment fees for missed payments.',
		})
	}

	return {
		monthlyPayment,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		totalFees: Math.round(originationFee * 100) / 100,
		apr: Math.round(apr * 100) / 100,
		steps,
	}
}

// Register the calculation function
registerCalculation('calculatePersonalLoan', calculatePersonalLoan)

