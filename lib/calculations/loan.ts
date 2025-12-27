import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Step interface for loan payment calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Map payment frequency string to payments per year
 */
function getPaymentsPerYear(frequency: string | number | boolean): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	if (typeof frequency === 'boolean') {
		return frequency ? 12 : 1 // Default to monthly if true, annually if false
	}
	const frequencyMap: Record<string, number> = {
		'monthly': 12,
		'bi-weekly': 26,
		'weekly': 52,
	}
	return frequencyMap[frequency.toLowerCase()] || 12
}

/**
 * Calculate loan payment with support for different payment frequencies and loan types
 * Inputs: loanAmount, annualInterestRate, loanTerm, paymentFrequency, loanType
 * Outputs: periodicPayment, totalPayment, totalInterest, overpayment, formulaExplanation
 */
export const calculateLoanPayment: CalculationFunction = (inputs) => {
	const loanAmount = Number(inputs.loanAmount || inputs.principal || 0)
	const annualInterestRate = Number(inputs.annualInterestRate || inputs.annualRate || 0)
	const loanTerm = Math.floor(Number(inputs.loanTerm || inputs.years || 0)) // Must be integer >= 1
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const loanType = String(inputs.loanType || 'annuity').toLowerCase()

	// Validation
	if (
		isNaN(loanAmount) ||
		isNaN(annualInterestRate) ||
		isNaN(loanTerm) ||
		loanAmount <= 0 ||
		annualInterestRate <= 0 ||
		loanTerm < 1 ||
		loanTerm > 50
	) {
		return {
			periodicPayment: null,
			totalPayment: null,
			totalInterest: null,
			overpayment: null,
			formulaExplanation: null,
		}
	}

	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const periodicRate = annualInterestRate / 100 / paymentsPerYear
	const numberOfPayments = loanTerm * paymentsPerYear

	// Calculate periodic payment based on loan type
	let periodicPayment: number
	let totalPayment: number
	let totalInterest: number
	let overpayment: number

	if (loanType === 'interest-only') {
		// Interest-only loan: payment is just the interest
		periodicPayment = loanAmount * periodicRate
		totalPayment = periodicPayment * numberOfPayments
		totalInterest = totalPayment
		overpayment = totalInterest // For interest-only, overpayment equals total interest
	} else {
		// Annuity loan (standard amortizing loan)
		if (periodicRate === 0) {
			// Zero interest: payment is simply loan amount divided by number of payments
			periodicPayment = loanAmount / numberOfPayments
		} else {
			// Standard loan formula: P = L * [r(1+r)^n] / [(1+r)^n - 1]
			const rateFactor = Math.pow(1 + periodicRate, numberOfPayments)
			periodicPayment = (loanAmount * periodicRate * rateFactor) / (rateFactor - 1)
		}
		
		// Round to 2 decimal places
		periodicPayment = Math.round(periodicPayment * 100) / 100
		
		// Calculate totals
		totalPayment = periodicPayment * numberOfPayments
		totalInterest = totalPayment - loanAmount
		overpayment = totalInterest // Overpayment is the total interest paid
	}

	// Round all values
	totalPayment = Math.round(totalPayment * 100) / 100
	totalInterest = Math.round(totalInterest * 100) / 100
	overpayment = Math.round(overpayment * 100) / 100

	// Build formula explanation
	const frequencyLabel = paymentFrequencyStr === 'bi-weekly' ? 'Bi-weekly' : 
		paymentFrequencyStr === 'weekly' ? 'Weekly' : 'Monthly'
	
	let formulaExplanation = ''
	if (loanType === 'interest-only') {
		formulaExplanation = `Interest-Only Loan Payment Formula:\n\nPayment = Loan Amount × Periodic Interest Rate\n\nWhere:\n- Loan Amount (L) = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- Annual Interest Rate = ${annualInterestRate}%\n- Periodic Rate (r) = Annual Rate / Payments Per Year = ${annualInterestRate}% / ${paymentsPerYear} = ${(periodicRate * 100).toFixed(6)}%\n\nSubstituting your values:\nPayment = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${(periodicRate * 100).toFixed(6)}%\nPayment = $${periodicPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nWith interest-only loans, you only pay the interest each period. The principal remains unchanged, and you must pay it in full at the end of the loan term.`
	} else {
		formulaExplanation = `Annuity Loan Payment Formula:\n\nP = L × [r(1+r)^n] / [(1+r)^n - 1]\n\nWhere:\n- P = ${frequencyLabel.toLowerCase()} payment\n- L = Loan amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- r = Periodic interest rate = Annual rate / Payments per year = ${annualInterestRate}% / ${paymentsPerYear} = ${(periodicRate * 100).toFixed(6)}%\n- n = Number of payments = ${loanTerm} years × ${paymentsPerYear} payments/year = ${numberOfPayments}\n\nSubstituting your values:\nP = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${(periodicRate * 100).toFixed(6)}% × (1 + ${(periodicRate * 100).toFixed(6)}%)^${numberOfPayments}] / [(1 + ${(periodicRate * 100).toFixed(6)}%)^${numberOfPayments} - 1]\n\nCalculating:\n(1 + r)^n = (1 + ${periodicRate.toFixed(6)})^${numberOfPayments} = ${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)}\n\nP = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${(periodicRate * 100).toFixed(6)}% × ${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)}] / [${Math.pow(1 + periodicRate, numberOfPayments).toFixed(6)} - 1]\nP = $${periodicPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nThis formula calculates a fixed payment amount that includes both principal and interest. Each payment reduces the principal balance, and the interest portion decreases over time while the principal portion increases.`
	}

	return {
		periodicPayment,
		totalPayment,
		totalInterest,
		overpayment,
		formulaExplanation,
	}
}

