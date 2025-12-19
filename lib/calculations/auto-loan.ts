/**
 * Calculate auto loan payment and details with step-by-step explanation
 * Inputs: carPrice, downPayment, interestRate, loanTerm, tradeInValue
 * Outputs: loanAmount, monthlyPayment, totalPayment, totalInterest, steps
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { calculateDifferentiatedPayment } from './payment-types'

/**
 * Step interface for auto loan calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

export const calculateAutoLoan: CalculationFunction = (inputs) => {
	const carPrice = Number(inputs.carPrice) || 0
	const downPayment = Number(inputs.downPayment) || 0
	const tradeInValue = Number(inputs.tradeInValue) || 0
	const interestRate = Number(inputs.interestRate) || 0
	const loanTerm = Number(inputs.loanTerm) || 1
	const paymentType = String(inputs.paymentType || 'annuity').toLowerCase()
	const salesTax = Number(inputs.salesTax || 0)
	const registrationFees = Number(inputs.registrationFees || 0)
	const extendedWarranty = Number(inputs.extendedWarranty || 0)
	const gapInsurance = Number(inputs.gapInsurance || 0)

	// Validation
	if (
		carPrice <= 0 ||
		downPayment < 0 ||
		tradeInValue < 0 ||
		interestRate < 0 ||
		loanTerm <= 0 ||
		downPayment + tradeInValue > carPrice
	) {
		return {
			loanAmount: null,
			monthlyPayment: null,
			totalPayment: null,
			totalInterest: null,
			steps: null,
		}
	}

	// Calculate loan amount
	const loanAmount = carPrice - downPayment - tradeInValue

	if (loanAmount <= 0) {
		return {
			loanAmount: 0,
			monthlyPayment: 0,
			totalPayment: 0,
			totalInterest: 0,
			steps: null,
		}
	}

	// Convert annual rate to monthly rate
	const monthlyRate = interestRate / 100 / 12

	// Number of monthly payments
	const numberOfPayments = loanTerm * 12

	// Calculate monthly payment using standard loan formula
	let monthlyPayment: number

	if (monthlyRate === 0) {
		// If interest rate is 0, payment is simply loan amount divided by months
		monthlyPayment = loanAmount / numberOfPayments
	} else {
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		monthlyPayment = (loanAmount * monthlyRate * rateFactor) / (rateFactor - 1)
	}

	// Round to 2 decimal places
	monthlyPayment = Math.round(monthlyPayment * 100) / 100

	// Calculate total payment and interest
	const totalPayment = monthlyPayment * numberOfPayments
	const totalInterest = totalPayment - loanAmount

	// Build step-by-step calculation
	const steps: CalculationStep[] = []

	// Calculate additional costs
	const salesTaxAmount = (carPrice * salesTax) / 100
	const totalFees = salesTaxAmount + registrationFees + extendedWarranty + gapInsurance
	const totalCost = carPrice + totalFees

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Car Price = $${carPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nDown Payment = $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTrade-in Value = $${tradeInValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${interestRate}%\nLoan Term = ${loanTerm} years${salesTax > 0 ? `\nSales Tax = ${salesTax}%` : ''}${registrationFees > 0 ? `\nRegistration Fees = $${registrationFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${extendedWarranty > 0 ? `\nExtended Warranty = $${extendedWarranty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${gapInsurance > 0 ? `\nGap Insurance = $${gapInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}`,
		explanation: 'These are the values you entered for the auto loan calculation.',
	})

	if (totalFees > 0) {
		steps.push({
			title: 'Step 1.5: Calculate Additional Costs',
			math: `Sales Tax = Car Price × Sales Tax Rate\nSales Tax = $${carPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${salesTax}% = $${salesTaxAmount.toFixed(2)}\n\nTotal Additional Fees = Sales Tax + Registration + Warranty + Gap Insurance\nTotal Additional Fees = $${salesTaxAmount.toFixed(2)} + $${registrationFees.toFixed(2)} + $${extendedWarranty.toFixed(2)} + $${gapInsurance.toFixed(2)} = $${totalFees.toFixed(2)}\n\nTotal Cost = Car Price + Additional Fees\nTotal Cost = $${carPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${totalFees.toFixed(2)} = $${totalCost.toFixed(2)}`,
			explanation: 'Calculate all additional costs including sales tax, registration fees, extended warranty, and gap insurance.',
		})
	}

	// Step 2: Calculate loan amount
	steps.push({
		title: 'Step 2: Calculate Loan Amount',
		math: `Loan Amount = Car Price - Down Payment - Trade-in Value\nLoan Amount = $${carPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${tradeInValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nLoan Amount = $${Math.round(loanAmount * 100) / 100}`,
		explanation: 'Subtract the down payment and trade-in value from the car price to determine how much you need to finance.',
	})

	// Step 3: Convert annual rate to monthly rate
	steps.push({
		title: 'Step 3: Convert Annual Rate to Monthly Rate',
		math: `Monthly Rate (r) = Annual Rate / 100 / 12\nr = ${interestRate}% / 100 / 12 = ${interestRate / 100} / 12 = ${monthlyRate.toFixed(6)}`,
		explanation: 'Divide the annual interest rate by 100 to convert to decimal, then divide by 12 to get the monthly rate.',
	})

	// Step 4: Calculate number of payments
	steps.push({
		title: 'Step 4: Calculate Number of Monthly Payments',
		math: `Number of Payments (n) = Loan Term × 12\nn = ${loanTerm} × 12 = ${numberOfPayments}`,
		explanation: 'Multiply the loan term in years by 12 to get the total number of monthly payments.',
	})

	if (monthlyRate === 0) {
		// Special case: zero interest
		steps.push({
			title: 'Step 5: Calculate Monthly Payment (Zero Interest)',
			math: `M = Loan Amount / n\nM = $${Math.round(loanAmount * 100) / 100} / ${numberOfPayments}\nM = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Since the interest rate is 0%, the monthly payment is simply the loan amount divided by the number of payments.',
		})
	} else {
		// Step 5: Calculate rate factor
		const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
		steps.push({
			title: 'Step 5: Calculate Rate Factor',
			math: `(1 + r)^n = (1 + ${monthlyRate.toFixed(6)})^${numberOfPayments} = ${rateFactor.toFixed(6)}`,
			explanation: 'This factor represents the compound growth of interest over the loan term.',
		})

		// Step 6: Calculate numerator
		const numerator = loanAmount * monthlyRate * rateFactor
		steps.push({
			title: 'Step 6: Calculate Numerator',
			math: `Loan Amount × r × (1 + r)^n = $${Math.round(loanAmount * 100) / 100} × ${monthlyRate.toFixed(6)} × ${rateFactor.toFixed(6)}\n= $${numerator.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Multiply the loan amount by the monthly rate and the rate factor.',
		})

		// Step 7: Calculate denominator
		const denominator = rateFactor - 1
		steps.push({
			title: 'Step 7: Calculate Denominator',
			math: `(1 + r)^n - 1 = ${rateFactor.toFixed(6)} - 1 = ${denominator.toFixed(6)}`,
			explanation: 'Subtract 1 from the rate factor to get the denominator.',
		})

		// Step 8: Calculate monthly payment
		steps.push({
			title: 'Step 8: Calculate Monthly Payment',
			math: `M = [Loan Amount × r × (1 + r)^n] / [(1 + r)^n - 1]\nM = $${numerator.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${denominator.toFixed(6)}\nM = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Divide the numerator by the denominator to get the monthly payment amount.',
		})
	}

	// Step 9: Calculate total payment
	const stepNumber = monthlyRate === 0 ? 6 : 9
	steps.push({
		title: `Step ${stepNumber}: Calculate Total Payment`,
		math: `Total Payment = Monthly Payment × Number of Payments\nTotal Payment = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${numberOfPayments}\nTotal Payment = $${Math.round(totalPayment * 100) / 100}`,
		explanation: 'Multiply the monthly payment by the total number of payments to get the total amount paid over the life of the loan.',
	})

	// Step 10: Calculate total interest
	steps.push({
		title: `Step ${stepNumber + 1}: Calculate Total Interest`,
		math: `Total Interest = Total Payment - Loan Amount\nTotal Interest = $${Math.round(totalPayment * 100) / 100} - $${Math.round(loanAmount * 100) / 100}\nTotal Interest = $${Math.round(totalInterest * 100) / 100}`,
		explanation: 'Subtract the original loan amount from the total payment to find how much interest you will pay over the life of the loan.',
	})

	return {
		loanAmount: Math.round(loanAmount * 100) / 100,
		monthlyPayment,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		totalCost: Math.round(totalCost * 100) / 100,
		totalFees: Math.round(totalFees * 100) / 100,
		steps,
	}
}

// Register the calculation function
registerCalculation('calculateAutoLoan', calculateAutoLoan)

