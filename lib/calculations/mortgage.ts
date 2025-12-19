/**
 * Mortgage calculation functions
 * Calculates mortgage payments, total interest, and overpayment
 */

import type { CalculationFunction } from './registry'
import { calculateDifferentiatedPayment } from './payment-types'

/**
 * Step interface for mortgage calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Calculate mortgage payment and related metrics
 * 
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 * - M = monthly payment
 * - P = principal (loan amount - down payment)
 * - r = monthly interest rate
 * - n = number of payments
 * 
 * @param inputs - Input values including loan amount, interest rate, term, down payment, payment frequency
 * @returns Calculated mortgage metrics with step-by-step explanation
 */
export function calculateMortgage(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const loanAmount = Number(inputs.loanAmount || inputs.principal || 0)
	const interestRate = Number(inputs.interestRate || inputs.annualRate || 0)
	const loanTerm = Number(inputs.loanTerm || inputs.years || 0)
	const downPayment = Number(inputs.downPayment || 0)
	const paymentFrequency = String(inputs.paymentFrequency || 'monthly').toLowerCase()
	const paymentType = String(inputs.paymentType || 'annuity').toLowerCase()
	const propertyTax = Number(inputs.propertyTax || 0)
	const homeInsurance = Number(inputs.homeInsurance || 0)
	const pmiRate = Number(inputs.pmiRate || 0)
	const pmiThreshold = Number(inputs.pmiThreshold || 20)
	const hoaFees = Number(inputs.hoaFees || 0)

	// Validation
	if (
		isNaN(loanAmount) ||
		isNaN(interestRate) ||
		isNaN(loanTerm) ||
		isNaN(downPayment) ||
		loanAmount <= 0 ||
		interestRate < 0 ||
		loanTerm <= 0 ||
		downPayment < 0 ||
		downPayment >= loanAmount
	) {
		return {
			monthlyPayment: null,
			periodicPayment: null,
			totalPayment: null,
			totalInterest: null,
			overpayment: null,
			principal: null,
			steps: null,
		}
	}

	const steps: CalculationStep[] = []

	// Step 1: Input values
	const additionalCosts = propertyTax > 0 || homeInsurance > 0 || pmiRate > 0 || hoaFees > 0
	steps.push({
		title: 'Step 1: Input Values',
		math: `Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nDown Payment = $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${interestRate}%\nLoan Term = ${loanTerm} years\nPayment Frequency = ${paymentFrequency}\nPayment Type = ${paymentType === 'annuity' ? 'Annuity (Fixed Payment)' : 'Differentiated (Declining Payment)'}${propertyTax > 0 ? `\nAnnual Property Tax = $${propertyTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${homeInsurance > 0 ? `\nAnnual Home Insurance = $${homeInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${pmiRate > 0 ? `\nPMI Rate = ${pmiRate}%\nPMI Threshold = ${pmiThreshold}%` : ''}${hoaFees > 0 ? `\nMonthly HOA Fees = $${hoaFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}`,
		explanation: 'These are the values you entered for the mortgage calculation.',
	})

	// Calculate principal (loan amount minus down payment)
	const principal = loanAmount - downPayment

	steps.push({
		title: 'Step 2: Calculate Principal (Loan Amount - Down Payment)',
		math: `Principal (P) = Loan Amount - Down Payment\nP = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nP = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		explanation: 'The principal is the actual amount you need to finance after your down payment.',
	})

	// Determine payments per year based on frequency
	let paymentsPerYear = 12 // monthly
	if (paymentFrequency === 'biweekly') {
		paymentsPerYear = 26
	} else if (paymentFrequency === 'weekly') {
		paymentsPerYear = 52
	}

	steps.push({
		title: 'Step 3: Determine Payments Per Year',
		math: `Payment Frequency = ${paymentFrequency}\nPayments Per Year = ${paymentsPerYear}${paymentFrequency === 'biweekly' ? ' (26 bi-weekly payments = 13 monthly payments)' : paymentFrequency === 'weekly' ? ' (52 weekly payments = 12 monthly payments)' : ''}`,
		explanation: `Based on your payment frequency, you will make ${paymentsPerYear} payments per year.`,
	})

	// Convert annual rate to periodic rate
	const periodicRate = interestRate / 100 / paymentsPerYear

	steps.push({
		title: 'Step 4: Convert Annual Rate to Periodic Rate',
		math: `Periodic Rate (r) = Annual Rate / 100 / Payments Per Year\nr = ${interestRate}% / 100 / ${paymentsPerYear} = ${(interestRate / 100).toFixed(6)} / ${paymentsPerYear} = ${periodicRate.toFixed(6)}`,
		explanation: 'Convert the annual interest rate to the rate per payment period.',
	})

	// Number of payments
	const numberOfPayments = loanTerm * paymentsPerYear

	steps.push({
		title: 'Step 5: Calculate Total Number of Payments',
		math: `Number of Payments (n) = Loan Term × Payments Per Year\nn = ${loanTerm} × ${paymentsPerYear} = ${numberOfPayments}`,
		explanation: 'Calculate the total number of payments you will make over the loan term.',
	})

	// Calculate payment based on type
	let periodicPayment: number
	let totalPayment: number
	let totalInterest: number
	let firstPayment: number | undefined
	let lastPayment: number | undefined
	let averagePayment: number | undefined

	if (paymentType === 'differentiated') {
		// Differentiated payment calculation
		const diffResult = calculateDifferentiatedPayment(principal, interestRate, numberOfPayments)
		
		firstPayment = diffResult.firstPayment
		lastPayment = diffResult.lastPayment
		averagePayment = diffResult.averagePayment
		totalPayment = diffResult.totalPayment
		totalInterest = diffResult.totalInterest
		periodicPayment = averagePayment // Use average for display

		steps.push({
			title: 'Step 6: Calculate Differentiated Payment Structure',
			math: `Principal Payment Per Period = Principal / Number of Payments\nPrincipal Payment = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${numberOfPayments} = $${(principal / numberOfPayments).toFixed(2)}\n\nFirst Payment = Principal Payment + (Principal × Monthly Rate)\nFirst Payment = $${(principal / numberOfPayments).toFixed(2)} + ($${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${periodicRate.toFixed(6)}) = $${firstPayment.toFixed(2)}\n\nLast Payment = Principal Payment + (Remaining Balance × Monthly Rate)\nLast Payment = $${lastPayment.toFixed(2)}`,
			explanation: 'In differentiated payments, the principal is paid in equal parts, while interest decreases as the balance decreases. The first payment is highest, and payments decline over time.',
		})

		steps.push({
			title: 'Step 7: Calculate Average Payment',
			math: `Average Payment = Total Payment / Number of Payments\nAverage Payment = $${totalPayment.toFixed(2)} / ${numberOfPayments} = $${averagePayment.toFixed(2)}`,
			explanation: 'The average payment represents the typical monthly payment amount for differentiated payments.',
		})
	} else {
		// Annuity (fixed) payment calculation
		if (periodicRate === 0) {
			// If interest rate is 0, payment is simply principal divided by number of payments
			periodicPayment = principal / numberOfPayments
			steps.push({
				title: 'Step 6: Calculate Periodic Payment (Zero Interest)',
				math: `Periodic Payment = Principal / Number of Payments\nPeriodic Payment = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${numberOfPayments} = $${periodicPayment.toFixed(2)}`,
				explanation: 'Since the interest rate is 0%, the periodic payment is simply the principal divided by the number of payments.',
			})
		} else {
			const rateFactor = Math.pow(1 + periodicRate, numberOfPayments)
			steps.push({
				title: 'Step 6: Calculate Rate Factor (1 + r)^n',
				math: `Rate Factor = (1 + Periodic Rate)^Number of Payments\nRate Factor = (1 + ${periodicRate.toFixed(6)})^${numberOfPayments} = ${rateFactor.toFixed(6)}`,
				explanation: 'Calculate the rate factor used in the annuity payment formula.',
			})

			periodicPayment = (principal * periodicRate * rateFactor) / (rateFactor - 1)
			steps.push({
				title: 'Step 7: Calculate Periodic Payment (Annuity)',
				math: `Periodic Payment (M) = (P × r × (1 + r)^n) / ((1 + r)^n - 1)\nM = ($${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${periodicRate.toFixed(6)} × ${rateFactor.toFixed(6)}) / (${rateFactor.toFixed(6)} - 1)\nM = $${periodicPayment.toFixed(2)}`,
				explanation: 'Calculate the fixed periodic payment using the annuity formula. This payment amount remains constant throughout the loan term.',
			})
		}

		// Round to 2 decimal places
		periodicPayment = Math.round(periodicPayment * 100) / 100

		// Calculate total payment and interest
		totalPayment = periodicPayment * numberOfPayments
		totalInterest = totalPayment - principal
	}

	steps.push({
		title: 'Step 8: Calculate Total Payment',
		math: `Total Payment = Periodic Payment × Number of Payments\nTotal Payment = $${periodicPayment.toFixed(2)} × ${numberOfPayments} = $${totalPayment.toFixed(2)}`,
		explanation: 'Calculate the total amount you will pay over the entire loan term.',
	})

	if (paymentType === 'differentiated') {
		steps.push({
			title: 'Step 8: Calculate Total Interest (Differentiated)',
			math: `Total Interest = Total Payment - Principal\nTotal Interest = $${totalPayment.toFixed(2)} - $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest = $${totalInterest.toFixed(2)}`,
			explanation: 'Calculate the total amount of interest you will pay over the life of the mortgage with differentiated payments.',
		})
	} else {
		steps.push({
			title: 'Step 8: Calculate Total Payment',
			math: `Total Payment = Periodic Payment × Number of Payments\nTotal Payment = $${periodicPayment.toFixed(2)} × ${numberOfPayments} = $${totalPayment.toFixed(2)}`,
			explanation: 'Calculate the total amount you will pay over the entire loan term.',
		})

		steps.push({
			title: 'Step 9: Calculate Total Interest',
			math: `Total Interest = Total Payment - Principal\nTotal Interest = $${totalPayment.toFixed(2)} - $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest = $${totalInterest.toFixed(2)}`,
			explanation: 'Calculate the total amount of interest you will pay over the life of the mortgage.',
		})
	}

	// Calculate overpayment (total interest as percentage of principal)
	const overpayment = (totalInterest / principal) * 100

	steps.push({
		title: paymentType === 'differentiated' ? 'Step 9: Calculate Overpayment Percentage' : 'Step 10: Calculate Overpayment Percentage',
		math: `Overpayment = (Total Interest / Principal) × 100%\nOverpayment = ($${totalInterest.toFixed(2)} / $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100%\nOverpayment = ${overpayment.toFixed(2)}%`,
		explanation: 'Calculate the total interest as a percentage of the principal amount.',
	})

	// Calculate additional monthly costs
	const monthlyPropertyTax = propertyTax / 12
	const monthlyInsurance = homeInsurance / 12
	const monthlyHOA = hoaFees

	// Calculate PMI
	let pmiPayment = 0
	let pmiMonths = 0
	const downPaymentPercent = (downPayment / loanAmount) * 100
	
	if (pmiRate > 0 && downPaymentPercent < pmiThreshold) {
		// PMI is required
		const pmiAnnual = (principal * pmiRate) / 100
		pmiPayment = pmiAnnual / 12
		
		// Calculate when PMI can be removed (when equity reaches threshold)
		const equityNeeded = loanAmount * (pmiThreshold / 100)
		const principalNeeded = loanAmount - equityNeeded
		
		// Estimate months to reach equity threshold (simplified calculation)
		if (paymentType === 'annuity') {
			const monthlyPrincipalPayment = periodicPayment - (principal * periodicRate)
			if (monthlyPrincipalPayment > 0) {
				pmiMonths = Math.ceil(principalNeeded / monthlyPrincipalPayment)
			}
		} else {
			const principalPerMonth = principal / numberOfPayments
			pmiMonths = Math.ceil(principalNeeded / principalPerMonth)
		}
		
		// PMI typically can't exceed loan term
		if (pmiMonths > numberOfPayments) {
			pmiMonths = numberOfPayments
		}

		steps.push({
			title: paymentType === 'differentiated' ? 'Step 10: Calculate PMI (Private Mortgage Insurance)' : 'Step 11: Calculate PMI (Private Mortgage Insurance)',
			math: `Down Payment % = (Down Payment / Loan Amount) × 100%\nDown Payment % = ($${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100% = ${downPaymentPercent.toFixed(2)}%\n\nPMI Required: ${downPaymentPercent.toFixed(2)}% < ${pmiThreshold}%\n\nAnnual PMI = Principal × PMI Rate\nAnnual PMI = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${pmiRate}% = $${pmiAnnual.toFixed(2)}\nMonthly PMI = Annual PMI / 12\nMonthly PMI = $${pmiAnnual.toFixed(2)} / 12 = $${pmiPayment.toFixed(2)}\n\nEstimated PMI Duration: ${pmiMonths} months (until ${pmiThreshold}% equity)`,
			explanation: `PMI is required when your down payment is less than ${pmiThreshold}% of the home value. It protects the lender if you default. PMI can typically be removed once you reach ${pmiThreshold}% equity.`,
		})
	} else if (pmiRate > 0) {
		steps.push({
			title: paymentType === 'differentiated' ? 'Step 10: PMI Not Required' : 'Step 11: PMI Not Required',
			math: `Down Payment % = ${downPaymentPercent.toFixed(2)}%\nPMI Threshold = ${pmiThreshold}%\n\n${downPaymentPercent.toFixed(2)}% ≥ ${pmiThreshold}% → PMI not required`,
			explanation: `Since your down payment is ${downPaymentPercent.toFixed(2)}%, which is at least ${pmiThreshold}%, PMI is not required.`,
		})
	}

	// Calculate PITI (Principal, Interest, Taxes, Insurance)
	const monthlyPITI = periodicPayment + monthlyPropertyTax + monthlyInsurance
	const totalMonthlyPayment = monthlyPITI + pmiPayment + monthlyHOA

	if (additionalCosts) {
		steps.push({
			title: paymentType === 'differentiated' ? (pmiRate > 0 ? 'Step 11: Calculate Monthly Costs' : 'Step 10: Calculate Monthly Costs') : (pmiRate > 0 ? 'Step 12: Calculate Monthly Costs' : 'Step 11: Calculate Monthly Costs'),
			math: `Monthly Principal & Interest = $${periodicPayment.toFixed(2)}\nMonthly Property Tax = $${monthlyPropertyTax.toFixed(2)}\nMonthly Insurance = $${monthlyInsurance.toFixed(2)}\nMonthly PMI = $${pmiPayment.toFixed(2)}\nMonthly HOA = $${monthlyHOA.toFixed(2)}\n\nPITI (Principal, Interest, Taxes, Insurance) = $${monthlyPITI.toFixed(2)}\nTotal Monthly Payment = PITI + PMI + HOA = $${totalMonthlyPayment.toFixed(2)}`,
			explanation: 'PITI represents your core monthly housing costs. The total monthly payment includes all additional fees.',
		})
	}

	// Calculate total cost of ownership
	const totalPropertyTax = propertyTax * loanTerm
	const totalInsurance = homeInsurance * loanTerm
	const totalPMI = pmiPayment * pmiMonths
	const totalHOA = hoaFees * 12 * loanTerm
	const totalCostOfOwnership = totalPayment + totalPropertyTax + totalInsurance + totalPMI + totalHOA

	if (additionalCosts) {
		steps.push({
			title: paymentType === 'differentiated' ? (pmiRate > 0 ? 'Step 12: Calculate Total Cost of Ownership' : 'Step 11: Calculate Total Cost of Ownership') : (pmiRate > 0 ? 'Step 13: Calculate Total Cost of Ownership' : 'Step 12: Calculate Total Cost of Ownership'),
			math: `Total Mortgage Payment = $${totalPayment.toFixed(2)}\nTotal Property Tax (${loanTerm} years) = $${totalPropertyTax.toFixed(2)}\nTotal Insurance (${loanTerm} years) = $${totalInsurance.toFixed(2)}\nTotal PMI (${pmiMonths} months) = $${totalPMI.toFixed(2)}\nTotal HOA (${loanTerm} years) = $${totalHOA.toFixed(2)}\n\nTotal Cost of Ownership = $${totalCostOfOwnership.toFixed(2)}`,
			explanation: 'The total cost of ownership includes all mortgage payments, taxes, insurance, PMI, and HOA fees over the loan term.',
		})
	}

	// For monthly frequency, return monthlyPayment; otherwise return the periodic payment
	const monthlyPayment = paymentFrequency === 'monthly' 
		? periodicPayment 
		: periodicPayment * (paymentsPerYear / 12)

	const result: Record<string, number | string> = {
		monthlyPayment: Math.round(monthlyPayment * 100) / 100,
		periodicPayment: Math.round(periodicPayment * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		overpayment: Math.round(overpayment * 100) / 100,
		principal: Math.round(principal * 100) / 100,
		monthlyPITI: Math.round(monthlyPITI * 100) / 100,
		totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
		pmiPayment: Math.round(pmiPayment * 100) / 100,
		pmiMonths: pmiMonths,
		totalCostOfOwnership: Math.round(totalCostOfOwnership * 100) / 100,
		steps,
	}

	// Add differentiated payment specific outputs
	if (paymentType === 'differentiated' && firstPayment !== undefined && lastPayment !== undefined && averagePayment !== undefined) {
		result.firstPayment = Math.round(firstPayment * 100) / 100
		result.lastPayment = Math.round(lastPayment * 100) / 100
		result.averagePayment = Math.round(averagePayment * 100) / 100
	}

	return result
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateMortgage', calculateMortgage)

