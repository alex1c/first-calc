/**
 * Calculate auto loan payment with comprehensive breakdown
 * Inputs: vehiclePrice, downPayment, tradeInValue, salesTaxRate, annualInterestRate, loanTerm, fees
 * Outputs: loanAmount, monthlyPayment, totalPayment, totalInterest, overpayment, formulaExplanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate auto loan payment with comprehensive breakdown
 */
export const calculateAutoLoan: CalculatorFunction = (inputs) => {
	// Support both old and new input names for backward compatibility
	const vehiclePrice = Number(inputs.vehiclePrice || inputs.carPrice || 0)
	const downPayment = Number(inputs.downPayment || 0)
	const tradeInValue = Number(inputs.tradeInValue || 0)
	const salesTaxRate = Number(inputs.salesTaxRate || inputs.salesTax || 0)
	const annualInterestRate = Number(inputs.annualInterestRate || inputs.interestRate || 0)
	const loanTerm = Math.floor(Number(inputs.loanTerm || 1)) // Must be integer >= 1
	const fees = Number(inputs.fees || 0)
	// Also support individual fee components for backward compatibility
	const registrationFees = Number(inputs.registrationFees || 0)
	const extendedWarranty = Number(inputs.extendedWarranty || 0)
	const gapInsurance = Number(inputs.gapInsurance || 0)
	const totalFees = fees > 0 ? fees : (registrationFees + extendedWarranty + gapInsurance)

	// Validation
	if (
		isNaN(vehiclePrice) ||
		isNaN(downPayment) ||
		isNaN(tradeInValue) ||
		isNaN(salesTaxRate) ||
		isNaN(annualInterestRate) ||
		isNaN(loanTerm) ||
		vehiclePrice <= 0 ||
		downPayment < 0 ||
		tradeInValue < 0 ||
		salesTaxRate < 0 ||
		annualInterestRate <= 0 ||
		loanTerm < 1 ||
		loanTerm > 10 ||
		downPayment + tradeInValue > vehiclePrice
	) {
		return {
			loanAmount: null,
			monthlyPayment: null,
			totalPayment: null,
			totalInterest: null,
			overpayment: null,
			formulaExplanation: null,
		}
	}

	// Calculate taxable amount (vehicle price - trade-in, as trade-in is typically not taxed)
	const taxableAmount = vehiclePrice - tradeInValue
	
	// Calculate sales tax
	const salesTaxAmount = (taxableAmount * salesTaxRate) / 100
	
	// Calculate total vehicle cost (price + tax + fees)
	const totalVehicleCost = vehiclePrice + salesTaxAmount + totalFees
	
	// Calculate loan amount (total cost - down payment - trade-in)
	const loanAmount = totalVehicleCost - downPayment - tradeInValue

	if (loanAmount <= 0) {
		return {
			loanAmount: 0,
			monthlyPayment: 0,
			totalPayment: 0,
			totalInterest: 0,
			overpayment: 0,
			formulaExplanation: null,
		}
	}

	// Convert annual rate to monthly rate
	const monthlyRate = annualInterestRate / 100 / 12

	// Number of monthly payments
	const numberOfPayments = loanTerm * 12

	// Calculate monthly payment using standard loan formula
	// M = P * [r(1+r)^n] / [(1+r)^n - 1]
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
	const overpayment = totalInterest // Overpayment is the total interest paid

	// Calculate total cost of vehicle (what you actually pay)
	const totalCostOfVehicle = downPayment + tradeInValue + totalPayment

	// Build formula explanation
	let formulaExplanation = ''
	
	formulaExplanation = `Auto Loan Payment Calculation:\n\n1. Calculate Vehicle Cost Breakdown:\n   Vehicle Price: $${vehiclePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${tradeInValue > 0 ? `Trade-in Value: -$${tradeInValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Taxable Amount: $${taxableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ` : ''}Sales Tax (${salesTaxRate}%): +$${salesTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${totalFees > 0 ? `Fees: +$${totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ` : ''}Total Vehicle Cost: $${totalVehicleCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Calculate Loan Amount:\n   Loan Amount = Total Vehicle Cost - Down Payment - Trade-in\n   Loan Amount = $${totalVehicleCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${tradeInValue > 0 ? ` - $${tradeInValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}\n   Loan Amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Calculate Monthly Payment (Annuity Formula):\n   P = L × [r(1+r)^n] / [(1+r)^n - 1]\n\n   Where:\n   - P = Monthly payment\n   - L = Loan amount = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   - r = Monthly interest rate = Annual rate / 12 = ${annualInterestRate}% / 12 = ${(monthlyRate * 100).toFixed(6)}%\n   - n = Number of payments = ${loanTerm} years × 12 = ${numberOfPayments}\n\n   Substituting:\n   (1 + r)^n = (1 + ${monthlyRate.toFixed(6)})^${numberOfPayments} = ${Math.pow(1 + monthlyRate, numberOfPayments).toFixed(6)}\n\n   P = $${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${(monthlyRate * 100).toFixed(6)}% × ${Math.pow(1 + monthlyRate, numberOfPayments).toFixed(6)}] / [${Math.pow(1 + monthlyRate, numberOfPayments).toFixed(6)} - 1]\n   P = $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n4. Total Costs:\n   Total Payment (loan + interest): $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Interest Paid: $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Cost of Vehicle: $${totalCostOfVehicle.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nYour monthly payment includes both principal and interest. The interest portion is higher at the beginning of the loan and decreases over time as you pay down the principal. The APR (Annual Percentage Rate) directly affects your monthly payment - a higher APR means higher payments and more total interest paid over the life of the loan.`

	return {
		loanAmount: Math.round(loanAmount * 100) / 100,
		monthlyPayment,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		overpayment: Math.round(overpayment * 100) / 100,
		totalCostOfVehicle: Math.round(totalCostOfVehicle * 100) / 100,
		formulaExplanation,
	}
}
