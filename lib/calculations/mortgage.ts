/**
 * Calculate mortgage payment with comprehensive breakdown and amortization
 * Inputs: homePrice, downPayment, downPaymentType, loanTermYears, interestRateAPR, paymentFrequency, propertyTax, homeInsurance, HOA, extraMonthlyPayment, startDate
 * Outputs: monthlyMortgagePayment, totalMonthlyPayment, loanAmount, totalInterest, totalCost, payoffDate, paymentBreakdown, extraPaymentImpact, amortizationSchedule, formulaExplanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Amortization schedule entry
 */
interface AmortizationEntry {
	month: number
	payment: number
	principal: number
	interest: number
	remainingBalance: number
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
 * Calculate mortgage payment with comprehensive breakdown
 */
export const calculateMortgage: CalculatorFunction = (inputs) => {
	const homePrice = Number(inputs.homePrice || 0)
	const downPayment = Number(inputs.downPayment || 0)
	const downPaymentType = String(inputs.downPaymentType || 'amount').toLowerCase()
	const loanTermYears = Math.floor(Number(inputs.loanTermYears || inputs.loanTerm || 30))
	const interestRateAPR = Number(inputs.interestRateAPR || inputs.annualInterestRate || inputs.interestRate || 0)
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	
	// Property tax can be percentage or annual amount
	const propertyTax = Number(inputs.propertyTax || inputs.propertyTaxRate || 0)
	const propertyTaxType = String(inputs.propertyTaxType || 'percentage').toLowerCase()
	
	// Home insurance (annual amount)
	const homeInsurance = Number(inputs.homeInsurance || 0)
	
	// HOA (monthly amount)
	const HOA = Number(inputs.HOA || inputs.hoa || 0)
	
	// Extra monthly payment
	const extraMonthlyPayment = Number(inputs.extraMonthlyPayment || inputs.extraPayment || 0)
	
	// Start date (optional, for payoff date calculation)
	const startDate = inputs.startDate ? new Date(inputs.startDate) : new Date()

	// Calculate down payment amount
	let downPaymentAmount = 0
	if (downPaymentType === 'percentage') {
		downPaymentAmount = (homePrice * downPayment) / 100
	} else {
		downPaymentAmount = downPayment
	}

	// Validation
	if (
		isNaN(homePrice) ||
		isNaN(downPaymentAmount) ||
		isNaN(loanTermYears) ||
		isNaN(interestRateAPR) ||
		isNaN(propertyTax) ||
		isNaN(homeInsurance) ||
		isNaN(HOA) ||
		isNaN(extraMonthlyPayment) ||
		homePrice <= 0 ||
		downPaymentAmount < 0 ||
		downPaymentAmount >= homePrice ||
		loanTermYears < 1 ||
		loanTermYears > 40 ||
		interestRateAPR <= 0 ||
		interestRateAPR > 30 ||
		propertyTax < 0 ||
		homeInsurance < 0 ||
		HOA < 0 ||
		extraMonthlyPayment < 0
	) {
		return {
			monthlyMortgagePayment: null,
			totalMonthlyPayment: null,
			loanAmount: null,
			totalInterest: null,
			totalCost: null,
			payoffDate: null,
			paymentBreakdown: null,
			extraPaymentImpact: null,
			amortizationSchedule: null,
			formulaExplanation: null,
		}
	}

	const loanAmount = homePrice - downPaymentAmount
	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const monthlyRate = interestRateAPR / 100 / 12
	const numberOfPayments = loanTermYears * 12

	// Calculate monthly mortgage payment (principal + interest)
	let monthlyMortgagePayment: number
	if (monthlyRate === 0) {
		monthlyMortgagePayment = loanAmount / numberOfPayments
	} else {
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		monthlyMortgagePayment = (loanAmount * monthlyRate * rateFactor) / (rateFactor - 1)
	}

	monthlyMortgagePayment = Math.round(monthlyMortgagePayment * 100) / 100

	// Calculate property tax (monthly)
	let monthlyPropertyTax = 0
	if (propertyTax > 0) {
		if (propertyTaxType === 'percentage') {
			const annualPropertyTax = (homePrice * propertyTax) / 100
			monthlyPropertyTax = annualPropertyTax / 12
		} else {
			// Annual amount
			monthlyPropertyTax = propertyTax / 12
		}
		monthlyPropertyTax = Math.round(monthlyPropertyTax * 100) / 100
	}

	// Calculate monthly insurance
	const monthlyInsurance = homeInsurance > 0 ? Math.round((homeInsurance / 12) * 100) / 100 : 0

	// Calculate total monthly payment (PITI + HOA)
	const totalMonthlyPayment = monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + HOA

	// Calculate standard totals (without extra payments)
	const totalPayment = monthlyMortgagePayment * numberOfPayments
	const totalInterest = totalPayment - loanAmount
	const totalCost = totalPayment + (monthlyPropertyTax * numberOfPayments) + (monthlyInsurance * numberOfPayments) + (HOA * numberOfPayments)

	// Payment breakdown
	const paymentBreakdown = {
		principal: monthlyMortgagePayment,
		interest: 0, // Will be calculated in amortization
		taxes: monthlyPropertyTax,
		insurance: monthlyInsurance,
		hoa: HOA,
		total: totalMonthlyPayment,
	}

	// Calculate amortization schedule and extra payment impact
	let amortizationSchedule: AmortizationEntry[] = []
	let interestSaved = 0
	let monthsReduced = 0
	let payoffDate: Date | null = null
	let totalInterestWithExtra = 0

	let remainingBalance = loanAmount
	let month = 0
	const paymentWithExtra = monthlyMortgagePayment + extraMonthlyPayment
	const maxMonths = numberOfPayments * 2 // Safety limit

	// First payment breakdown (for display)
	if (monthlyRate > 0) {
		const firstInterest = remainingBalance * monthlyRate
		paymentBreakdown.interest = Math.round(firstInterest * 100) / 100
	}

	if (extraMonthlyPayment > 0) {
		// With extra payments - simulate early payoff
		while (remainingBalance > 0.01 && month < maxMonths) {
			month++
			const interestPayment = remainingBalance * monthlyRate
			const principalPayment = paymentWithExtra - interestPayment
			
			remainingBalance = remainingBalance - principalPayment
			
			if (remainingBalance < 0) {
				remainingBalance = 0
			}

			// Store amortization entry (limit to first 360 months for performance)
			if (month <= 360) {
				amortizationSchedule.push({
					month,
					payment: Math.round(paymentWithExtra * 100) / 100,
					principal: Math.round(principalPayment * 100) / 100,
					interest: Math.round(interestPayment * 100) / 100,
					remainingBalance: Math.round(remainingBalance * 100) / 100,
				})
			}

			totalInterestWithExtra += interestPayment

			if (remainingBalance <= 0.01) {
				// Calculate payoff date
				payoffDate = new Date(startDate)
				payoffDate.setMonth(payoffDate.getMonth() + month)
				break
			}
		}

		// Calculate extra payment impact
		interestSaved = totalInterest - totalInterestWithExtra
		monthsReduced = numberOfPayments - month
	} else {
		// Without extra payments, calculate standard amortization
		remainingBalance = loanAmount
		amortizationSchedule = []
		for (let m = 1; m <= numberOfPayments && m <= 360; m++) {
			const interestPayment = remainingBalance * monthlyRate
			const principalPayment = monthlyMortgagePayment - interestPayment
			remainingBalance = remainingBalance - principalPayment
			
			if (remainingBalance < 0) {
				remainingBalance = 0
			}

			amortizationSchedule.push({
				month: m,
				payment: monthlyMortgagePayment,
				principal: Math.round(principalPayment * 100) / 100,
				interest: Math.round(interestPayment * 100) / 100,
				remainingBalance: Math.round(remainingBalance * 100) / 100,
			})
		}

		// Calculate payoff date without extra payments
		payoffDate = new Date(startDate)
		payoffDate.setMonth(payoffDate.getMonth() + numberOfPayments)
	}

	// Extra payment impact summary
	const extraPaymentImpact = extraMonthlyPayment > 0 ? {
		interestSaved: Math.round(interestSaved * 100) / 100,
		monthsReduced: monthsReduced,
		yearsReduced: Math.round((monthsReduced / 12) * 10) / 10,
	} : null

	// Build formula explanation
	const downPaymentLabel = downPaymentType === 'percentage' 
		? `${downPayment}% ($${downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
		: `$${downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
	
	let formulaExplanation = ''
	
	formulaExplanation = `Mortgage Payment Calculation:\n\n1. Calculate Down Payment and Loan Amount:\n   ${downPaymentType === 'percentage' ? `Down Payment = Home Price × ${downPayment}%\n   Down Payment = $${homePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${downPayment}% = $${downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   ` : ''}Loan Amount = Home Price - Down Payment\n   Loan Amount = $${homePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Calculate Monthly Mortgage Payment (Principal + Interest):\n   M = L × [r(1+r)^n] / [(1+r)^n - 1]\n\n   Where:\n   - M = Monthly mortgage payment\n   - L = Loan amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r = Monthly interest rate = Annual rate / 12 = ${interestRateAPR}% / 12 = ${(monthlyRate * 100).toFixed(6)}%\n   - n = Number of payments = ${loanTermYears} years × 12 = ${numberOfPayments}\n\n   Substituting:\n   (1 + r)^n = (1 + ${monthlyRate.toFixed(6)})^${numberOfPayments} = ${Math.pow(1 + monthlyRate, numberOfPayments).toFixed(6)}\n\n   M = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${(monthlyRate * 100).toFixed(6)}% × ${Math.pow(1 + monthlyRate, numberOfPayments).toFixed(6)}] / [${Math.pow(1 + monthlyRate, numberOfPayments).toFixed(6)} - 1]\n   M = $${monthlyMortgagePayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Calculate Additional Monthly Costs:\n   ${monthlyPropertyTax > 0 ? `Monthly Property Tax = ${propertyTaxType === 'percentage' ? `Home Price × ${propertyTax}% / 12` : `$${propertyTax} / 12`}\n   Monthly Property Tax = $${monthlyPropertyTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   ` : ''}${monthlyInsurance > 0 ? `Monthly Insurance = Annual Insurance / 12\n   Monthly Insurance = $${homeInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / 12 = $${monthlyInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   ` : ''}${HOA > 0 ? `Monthly HOA = $${HOA.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n   ` : ''}4. Calculate Total Monthly Payment (PITI + HOA):\n   Total Monthly Payment = Mortgage Payment + Property Tax + Insurance + HOA\n   Total Monthly Payment = $${monthlyMortgagePayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${monthlyPropertyTax > 0 ? ` + $${monthlyPropertyTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${monthlyInsurance > 0 ? ` + $${monthlyInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${HOA > 0 ? ` + $${HOA.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}\n   Total Monthly Payment = $${totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n5. Calculate Total Costs:\n   Total Payment (loan + interest): $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Interest Paid: $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Cost (including taxes, insurance, HOA): $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n${extraMonthlyPayment > 0 ? `6. Extra Payment Impact:\n   Extra Monthly Payment: $${extraMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Interest Saved: $${interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Loan Term Reduced: ${monthsReduced} months (${(monthsReduced / 12).toFixed(1)} years)\n   New Payoff Date: ${payoffDate ? payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}\n\n` : ''}Your mortgage payment includes principal and interest. The down payment reduces your loan amount, which lowers your monthly payment and total interest. ${monthlyPropertyTax > 0 || monthlyInsurance > 0 || HOA > 0 ? 'Property taxes, insurance, and HOA fees are additional monthly costs that increase your total payment but don\'t reduce your loan balance. ' : ''}Longer loan terms result in lower monthly payments but significantly higher total interest paid over the life of the loan. ${extraMonthlyPayment > 0 ? 'Making extra payments reduces your loan term and total interest, saving you money over time.' : ''}`

	return {
		monthlyMortgagePayment: Math.round(monthlyMortgagePayment * 100) / 100,
		totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
		loanAmount: Math.round(loanAmount * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		totalCost: Math.round(totalCost * 100) / 100,
		payoffDate: payoffDate ? payoffDate.toISOString().split('T')[0] : null,
		paymentBreakdown,
		extraPaymentImpact,
		amortizationSchedule: amortizationSchedule, // Already limited to 360 months
		formulaExplanation,
	}
}
