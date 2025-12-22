/**
 * Compare multiple loan offers side-by-side
 * Inputs: loans (array), paymentFrequency, comparisonMetric
 * Outputs: comparisonTable, winner, bestLoanByMetric, formulaExplanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Loan comparison result interface
 */
interface LoanComparisonResult {
	loanName: string
	loanAmount: number
	annualInterestRate: number
	loanTermYears: number
	fees: number
	extraMonthlyPayment: number
	monthlyPayment: number
	totalPayment: number
	totalInterest: number
	totalCost: number
	payoffMonths?: number
	interestSaved?: number
}

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
 * Calculate loan comparison with multiple loans
 */
export const calculateLoanComparison: CalculatorFunction = (inputs) => {
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const comparisonMetric = String(inputs.comparisonMetric || 'lowest-monthly-payment').toLowerCase()

	// Parse loans array - can be passed as JSON string or object
	let loans: any[] = []
	if (typeof inputs.loans === 'string') {
		try {
			loans = JSON.parse(inputs.loans)
		} catch {
			loans = []
		}
	} else if (Array.isArray(inputs.loans)) {
		loans = inputs.loans
	} else {
		// Try to parse individual loan inputs (loan1, loan2, etc.)
		for (let i = 1; i <= 5; i++) {
			const loanName = inputs[`loan${i}Name`] || `Loan ${String.fromCharCode(64 + i)}`
			const loanAmount = Number(inputs[`loan${i}Amount`] || 0)
			const annualInterestRate = Number(inputs[`loan${i}AnnualInterestRate`] || inputs[`loan${i}APR`] || 0)
			const loanTermYears = Math.floor(Number(inputs[`loan${i}TermYears`] || inputs[`loan${i}Term`] || 0))
			const fees = Number(inputs[`loan${i}Fees`] || 0)
			const extraMonthlyPayment = Number(inputs[`loan${i}ExtraMonthlyPayment`] || 0)

			if (loanAmount > 0 && annualInterestRate > 0 && loanTermYears > 0) {
				loans.push({
					loanName,
					loanAmount,
					annualInterestRate,
					loanTermYears,
					fees,
					extraMonthlyPayment,
				})
			}
		}
	}

	// Validation
	if (!Array.isArray(loans) || loans.length < 2 || loans.length > 5) {
		return {
			comparisonTable: null,
			winner: null,
			bestLoanByMetric: null,
			formulaExplanation: null,
		}
	}

	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)

	// Calculate each loan
	const comparisonResults: LoanComparisonResult[] = []

	for (const loan of loans) {
		const loanName = String(loan.loanName || 'Loan')
		const loanAmount = Number(loan.loanAmount || 0)
		const annualInterestRate = Number(loan.annualInterestRate || loan.APR || 0)
		const loanTermYears = Math.floor(Number(loan.loanTermYears || loan.term || 0))
		const fees = Number(loan.fees || 0)
		const extraMonthlyPayment = Number(loan.extraMonthlyPayment || 0)

		// Validate individual loan
		if (
			isNaN(loanAmount) ||
			isNaN(annualInterestRate) ||
			isNaN(loanTermYears) ||
			isNaN(fees) ||
			isNaN(extraMonthlyPayment) ||
			loanAmount <= 0 ||
			annualInterestRate <= 0 ||
			annualInterestRate > 100 ||
			loanTermYears < 1 ||
			loanTermYears > 50 ||
			fees < 0 ||
			extraMonthlyPayment < 0
		) {
			continue
		}

		const periodicRate = annualInterestRate / 100 / paymentsPerYear
		const numberOfPayments = loanTermYears * paymentsPerYear

		// Calculate monthly payment
		let monthlyPayment: number
		if (periodicRate === 0) {
			monthlyPayment = loanAmount / numberOfPayments
		} else {
			const rateFactor = Math.pow(1 + periodicRate, numberOfPayments)
			monthlyPayment = (loanAmount * periodicRate * rateFactor) / (rateFactor - 1)
		}

		monthlyPayment = Math.round(monthlyPayment * 100) / 100

		// Calculate with extra payments if provided
		let totalPayment = monthlyPayment * numberOfPayments
		let totalInterest = totalPayment - loanAmount
		let payoffMonths: number | undefined
		let interestSaved: number | undefined

		if (extraMonthlyPayment > 0) {
			// Simulate loan payments with extra payments
			let remainingBalance = loanAmount
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
			totalPayment = loanAmount + totalInterest
			payoffMonths = monthsPaid
			interestSaved = (monthlyPayment * numberOfPayments - loanAmount) - totalInterest
		}

		const totalCost = totalPayment + fees

		comparisonResults.push({
			loanName,
			loanAmount: Math.round(loanAmount * 100) / 100,
			annualInterestRate: Math.round(annualInterestRate * 10000) / 100,
			loanTermYears,
			fees: Math.round(fees * 100) / 100,
			extraMonthlyPayment: Math.round(extraMonthlyPayment * 100) / 100,
			monthlyPayment,
			totalPayment: Math.round(totalPayment * 100) / 100,
			totalInterest: Math.round(totalInterest * 100) / 100,
			totalCost: Math.round(totalCost * 100) / 100,
			payoffMonths,
			interestSaved: interestSaved !== undefined ? Math.round(interestSaved * 100) / 100 : undefined,
		})
	}

	if (comparisonResults.length < 2) {
		return {
			comparisonTable: null,
			winner: null,
			bestLoanByMetric: null,
			formulaExplanation: null,
		}
	}

	// Find winner by selected metric
	let winnerIndex = 0
	let winnerValue = comparisonResults[0].monthlyPayment
	const metricLabel = comparisonMetric === 'lowest-monthly-payment' ? 'Lowest Monthly Payment' :
		comparisonMetric === 'lowest-total-interest' ? 'Lowest Total Interest' :
		'Lowest Total Cost'

	if (comparisonMetric === 'lowest-monthly-payment') {
		winnerValue = comparisonResults[0].monthlyPayment
		for (let i = 1; i < comparisonResults.length; i++) {
			if (comparisonResults[i].monthlyPayment < winnerValue) {
				winnerValue = comparisonResults[i].monthlyPayment
				winnerIndex = i
			}
		}
	} else if (comparisonMetric === 'lowest-total-interest') {
		winnerValue = comparisonResults[0].totalInterest
		for (let i = 1; i < comparisonResults.length; i++) {
			if (comparisonResults[i].totalInterest < winnerValue) {
				winnerValue = comparisonResults[i].totalInterest
				winnerIndex = i
			}
		}
	} else {
		// lowest-total-cost
		winnerValue = comparisonResults[0].totalCost
		for (let i = 1; i < comparisonResults.length; i++) {
			if (comparisonResults[i].totalCost < winnerValue) {
				winnerValue = comparisonResults[i].totalCost
				winnerIndex = i
			}
		}
	}

	const winner = comparisonResults[winnerIndex]

	// Build formula explanation
	let formulaExplanation = ''
	
	formulaExplanation = `Loan Comparison Analysis:\n\nComparison Metric: ${metricLabel}\n\nFor each loan, the calculation uses the standard loan payment formula:\nM = L × [r(1+r)^n] / [(1+r)^n - 1]\n\nWhere:\n- M = Monthly payment\n- L = Loan amount\n- r = Monthly interest rate (Annual rate / 12)\n- n = Number of payments (Years × 12)\n\nTotal Cost = Total Payment + Fees\nTotal Interest = Total Payment - Loan Amount\n\n${comparisonResults.map((loan, idx) => {
		const isWinner = idx === winnerIndex
		return `${isWinner ? '★ ' : ''}${loan.loanName}:\n  Loan Amount: $${loan.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  APR: ${loan.annualInterestRate}%\n  Term: ${loan.loanTermYears} years\n  Monthly Payment: $${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Total Interest: $${loan.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Fees: $${loan.fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Total Cost: $${loan.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${loan.payoffMonths ? `\n  Payoff Time (with extra payments): ${loan.payoffMonths} months` : ''}${loan.interestSaved ? `\n  Interest Saved (with extra payments): $${loan.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${isWinner ? `\n  → Winner by ${metricLabel}` : ''}`
	}).join('\n\n')}\n\n${metricLabel === 'Lowest Monthly Payment' ? 'The loan with the lowest monthly payment may not have the lowest total cost. Longer terms reduce monthly payments but increase total interest. Consider your budget and long-term financial goals.' : metricLabel === 'Lowest Total Interest' ? 'The loan with the lowest total interest saves you money over the life of the loan. This is often the best choice if you can afford the monthly payment.' : 'The loan with the lowest total cost (payment + fees) is the most economical overall. This considers both interest and fees to show the true cost of borrowing.'}`

	return {
		comparisonTable: comparisonResults,
		winner: winner,
		bestLoanByMetric: {
			metric: comparisonMetric,
			loanIndex: winnerIndex,
			loanName: winner.loanName,
			value: winnerValue,
		},
		formulaExplanation,
	}
}

