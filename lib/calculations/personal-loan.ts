/**
 * Calculate personal loan payment with comprehensive breakdown
 * Inputs: loanAmount, annualInterestRate, loanTerm, paymentFrequency, originationFee, feeType, extraMonthlyPayment
 * Outputs: monthlyPayment, totalPayment, totalInterest, overpayment, effectiveAPR, formulaExplanation
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
 * Calculate personal loan payment with comprehensive breakdown
 */
export const calculatePersonalLoan: CalculatorFunction = (inputs) => {
	const loanAmount = Number(inputs.loanAmount || 0)
	const annualInterestRate = Number(inputs.annualInterestRate || inputs.interestRate || 0)
	const loanTerm = Math.floor(Number(inputs.loanTerm || inputs.years || 0)) // Must be integer >= 1
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const originationFee = Number(inputs.originationFee || 0)
	const feeType = String(inputs.feeType || 'percentage').toLowerCase()
	const extraMonthlyPayment = Number(inputs.extraMonthlyPayment || inputs.extraPayment || 0)

	// Calculate fee amount
	let feeAmount = 0
	if (feeType === 'percentage') {
		feeAmount = (loanAmount * originationFee) / 100
	} else {
		feeAmount = originationFee
	}

	// Validation
	if (
		isNaN(loanAmount) ||
		isNaN(annualInterestRate) ||
		isNaN(loanTerm) ||
		isNaN(feeAmount) ||
		isNaN(extraMonthlyPayment) ||
		loanAmount <= 0 ||
		annualInterestRate <= 0 ||
		loanTerm < 1 ||
		loanTerm > 10 ||
		feeAmount < 0 ||
		feeAmount >= loanAmount ||
		extraMonthlyPayment < 0
	) {
		return {
			monthlyPayment: null,
			totalPayment: null,
			totalInterest: null,
			overpayment: null,
			effectiveAPR: null,
			formulaExplanation: null,
		}
	}

	const netLoanAmount = loanAmount - feeAmount
	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const periodicRate = annualInterestRate / 100 / paymentsPerYear
	const numberOfPayments = loanTerm * paymentsPerYear

	// Calculate monthly payment
	let monthlyPayment: number
	if (periodicRate === 0) {
		monthlyPayment = netLoanAmount / numberOfPayments
	} else {
		const rateFactor = Math.pow(1 + periodicRate, numberOfPayments)
		monthlyPayment = (netLoanAmount * periodicRate * rateFactor) / (rateFactor - 1)
	}

	monthlyPayment = Math.round(monthlyPayment * 100) / 100

	// Calculate with extra payments if provided
	let totalPayment = monthlyPayment * numberOfPayments
	let totalInterest = totalPayment - netLoanAmount
	let effectiveAPR = annualInterestRate

	if (extraMonthlyPayment > 0) {
		// Simulate loan payments with extra payments
		let remainingBalance = netLoanAmount
		let monthsPaid = 0
		let totalInterestPaid = 0
		const paymentWithExtra = monthlyPayment + extraMonthlyPayment

		const maxMonths = numberOfPayments * 2

		while (remainingBalance > 0.01 && monthsPaid < maxMonths) {
			const periodInterest = remainingBalance * periodicRate
			totalInterestPaid += periodInterest
			const principalPayment = paymentWithExtra - periodInterest
			remainingBalance = remainingBalance - principalPayment
			monthsPaid++

			if (remainingBalance < 0) {
				remainingBalance = 0
			}
		}

		totalInterest = Math.round(totalInterestPaid * 100) / 100
		totalPayment = netLoanAmount + totalInterest
	}

	// Calculate effective APR (includes fees)
	// Effective APR accounts for the fee reducing the net loan amount
	if (feeAmount > 0) {
		// Approximate effective APR: (Total Cost / Net Loan Amount) / Years * 100
		const totalCost = totalInterest + feeAmount
		effectiveAPR = ((totalCost / netLoanAmount) / loanTerm) * 100
	}

	const overpayment = totalInterest + feeAmount

	// Build formula explanation
	const frequencyLabel = paymentFrequencyStr === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'
	const feeLabel = feeType === 'percentage' 
		? `${originationFee}% ($${feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
		: `$${feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
	
	let formulaExplanation = ''
	
	formulaExplanation = `Personal Loan Payment Calculation:\n\n1. Calculate Origination Fee:\n   ${feeType === 'percentage' ? `Fee = Loan Amount × ${originationFee}%\n   Fee = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${originationFee}%\n   Fee = $${feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   ` : ''}Net Loan Amount = Loan Amount - Fee\n   Net Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Net Loan Amount = $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Calculate Monthly Payment (Principal + Interest):\n   M = L × [r(1+r)^n] / [(1+r)^n - 1]\n\n   Where:\n   - M = ${frequencyLabel.toLowerCase()} payment\n   - L = Net loan amount = $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r = Periodic interest rate = Annual rate / Payments per year = ${annualInterestRate}% / ${paymentsPerYear} = ${(periodicRate * 100).toFixed(6)}%\n   - n = Number of payments = ${loanTerm} years × ${paymentsPerYear} = ${numberOfPayments}\n\n   Substituting:\n   (1 + r)^n = (1 + ${periodicRate.toFixed(6)})^${numberOfPayments} = ${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)}\n\n   M = $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${(periodicRate * 100).toFixed(6)}% × ${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)}] / [${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)} - 1]\n   M = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Calculate Total Costs:\n   Total Payment: $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Interest: $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Origination Fee: $${feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Overpayment: $${overpayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n${feeAmount > 0 ? `4. Effective APR (includes fees):\n   Effective APR = ((Total Interest + Fee) / Net Loan Amount) / Years × 100\n   Effective APR = (($${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) / $${netLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) / ${loanTerm} × 100\n   Effective APR = ${effectiveAPR.toFixed(2)}%\n\n   The effective APR is higher than the nominal APR (${annualInterestRate}%) because the origination fee reduces the net loan amount you receive, effectively increasing your borrowing cost.\n\n` : ''}${extraMonthlyPayment > 0 ? `5. Impact of Extra Payments:\n   Payment with Extra = Regular Payment + Extra Payment\n   Payment with Extra = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${extraMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Payment with Extra = $${(monthlyPayment + extraMonthlyPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   By making extra payments, you reduce the loan term and total interest paid.\n\n` : ''}Personal loans are unsecured loans, meaning they don't require collateral. This makes them riskier for lenders, resulting in higher interest rates than secured loans (like mortgages or auto loans). The origination fee is deducted upfront, reducing the amount you actually receive. ${feeAmount > 0 ? `The effective APR accounts for this fee and shows the true annual cost of borrowing. ` : ''}Shorter loan terms result in higher monthly payments but significantly less total interest paid.`

	return {
		monthlyPayment: Math.round(monthlyPayment * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		overpayment: Math.round(overpayment * 100) / 100,
		effectiveAPR: feeAmount > 0 ? Math.round(effectiveAPR * 10000) / 100 : null,
		formulaExplanation,
	}
}
