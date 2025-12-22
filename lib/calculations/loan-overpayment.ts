/**
 * Calculate loan overpayment and interest savings from extra payments
 * Inputs: loanAmount, annualInterestRate, loanTerm, paymentFrequency, extraMonthlyPayment, loanType
 * Outputs: overpayment, totalInterest, totalPayment, regularPayment, interestSaved, loanDurationReduced, formulaExplanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Map payment frequency string to payments per year
 */
function getPaymentsPerYear(frequency: string | number): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	const frequencyMap: Record<string, number> = {
		'monthly': 12,
		'bi-weekly': 26,
	}
	return frequencyMap[frequency.toLowerCase()] || 12
}

/**
 * Calculate loan overpayment with extra payment support
 */
export const calculateLoanOverpayment: CalculatorFunction = (inputs) => {
	const loanAmount = Number(inputs.loanAmount || 0)
	const annualInterestRate = Number(inputs.annualInterestRate || inputs.interestRate || 0)
	const loanTerm = Math.floor(Number(inputs.loanTerm || inputs.years || 0)) // Must be integer >= 1
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const extraMonthlyPayment = Number(inputs.extraMonthlyPayment || inputs.extraPayment || 0)
	const loanType = (inputs.loanType || 'annuity').toLowerCase()

	// Validation
	if (
		isNaN(loanAmount) ||
		isNaN(annualInterestRate) ||
		isNaN(loanTerm) ||
		isNaN(extraMonthlyPayment) ||
		loanAmount <= 0 ||
		annualInterestRate <= 0 ||
		loanTerm < 1 ||
		loanTerm > 50 ||
		extraMonthlyPayment < 0
	) {
		return {
			overpayment: null,
			totalInterest: null,
			totalPayment: null,
			regularPayment: null,
			interestSaved: null,
			loanDurationReduced: null,
			formulaExplanation: null,
		}
	}

	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const periodicRate = annualInterestRate / 100 / paymentsPerYear
	const numberOfPayments = loanTerm * paymentsPerYear

	// Calculate regular payment
	let regularPayment: number
	if (loanType === 'interest-only') {
		regularPayment = loanAmount * periodicRate
	} else {
		if (periodicRate === 0) {
			regularPayment = loanAmount / numberOfPayments
		} else {
			const rateFactor = Math.pow(1 + periodicRate, numberOfPayments)
			regularPayment = (loanAmount * periodicRate * rateFactor) / (rateFactor - 1)
		}
	}

	regularPayment = Math.round(regularPayment * 100) / 100

	// Calculate standard loan totals
	const totalPayment = regularPayment * numberOfPayments
	const totalInterest = totalPayment - loanAmount
	const overpayment = totalInterest // Overpayment is the total interest paid

	// Calculate with extra payments if provided
	let interestSaved = 0
	let loanDurationReduced = 0
	let totalPaymentWithExtra = totalPayment
	let totalInterestWithExtra = totalInterest

	if (extraMonthlyPayment > 0 && loanType === 'annuity') {
		// Simulate loan payments with extra payments
		let remainingBalance = loanAmount
		let monthsPaid = 0
		let totalInterestPaid = 0
		const paymentWithExtra = regularPayment + extraMonthlyPayment

		// Safety limit to prevent infinite loops
		const maxMonths = numberOfPayments * 2

		while (remainingBalance > 0.01 && monthsPaid < maxMonths) {
			// Calculate interest for this period
			const periodInterest = remainingBalance * periodicRate
			totalInterestPaid += periodInterest

			// Calculate principal payment
			const principalPayment = paymentWithExtra - periodInterest

			// Reduce balance
			remainingBalance = remainingBalance - principalPayment

			monthsPaid++

			// Safety check
			if (remainingBalance < 0) {
				remainingBalance = 0
			}
		}

		totalInterestWithExtra = Math.round(totalInterestPaid * 100) / 100
		totalPaymentWithExtra = loanAmount + totalInterestWithExtra
		interestSaved = totalInterest - totalInterestWithExtra
		loanDurationReduced = numberOfPayments - monthsPaid
	}

	// Build formula explanation
	const frequencyLabel = paymentFrequencyStr === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'
	
	let formulaExplanation = ''
	
	formulaExplanation = `Loan Overpayment Calculation:\n\n1. Calculate Regular Payment:\n   P = L × [r(1+r)^n] / [(1+r)^n - 1]\n\n   Where:\n   - P = ${frequencyLabel.toLowerCase()} payment\n   - L = Loan amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r = Periodic interest rate = Annual rate / Payments per year = ${annualInterestRate}% / ${paymentsPerYear} = ${(periodicRate * 100).toFixed(6)}%\n   - n = Number of payments = ${loanTerm} years × ${paymentsPerYear} = ${numberOfPayments}\n\n   Substituting:\n   (1 + r)^n = (1 + ${periodicRate.toFixed(6)})^${numberOfPayments} = ${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)}\n\n   P = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${(periodicRate * 100).toFixed(6)}% × ${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)}] / [${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)} - 1]\n   P = $${regularPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Calculate Total Payment and Overpayment:\n   Total Payment = Regular Payment × Number of Payments\n   Total Payment = $${regularPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${numberOfPayments}\n   Total Payment = $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   Overpayment = Total Payment - Loan Amount\n   Overpayment = $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Overpayment = $${overpayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n${extraMonthlyPayment > 0 ? `3. Calculate Impact of Extra Payments:\n   Payment with Extra = Regular Payment + Extra Payment\n   Payment with Extra = $${regularPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${extraMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Payment with Extra = $${(regularPayment + extraMonthlyPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   By making extra payments, the loan is paid off in ${Math.round((numberOfPayments - loanDurationReduced) / paymentsPerYear * 10) / 10} years instead of ${loanTerm} years.\n\n   Interest Saved = Total Interest (Standard) - Total Interest (With Extra)\n   Interest Saved = $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${totalInterestWithExtra.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Interest Saved = $${interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n` : ''}Overpayment represents the total interest you pay over the life of the loan - the extra cost beyond the principal amount. Longer loan terms result in significantly higher overpayment because interest accumulates over more periods. ${extraMonthlyPayment > 0 ? `Making extra payments of $${extraMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month reduces your overpayment by $${interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and shortens your loan term by ${Math.round(loanDurationReduced / paymentsPerYear * 10) / 10} years.` : 'Making extra payments can significantly reduce overpayment by paying down principal faster and reducing the time interest accumulates.'}`

	return {
		overpayment: Math.round(overpayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		regularPayment,
		interestSaved: extraMonthlyPayment > 0 ? Math.round(interestSaved * 100) / 100 : null,
		loanDurationReduced: extraMonthlyPayment > 0 ? Math.round(loanDurationReduced / paymentsPerYear * 10) / 10 : null, // In years
		formulaExplanation,
	}
}
