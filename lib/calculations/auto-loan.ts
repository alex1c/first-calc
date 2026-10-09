/**
 * Auto loan payment with annuity or differentiated schedules.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import {
	MAX_SIMULATION_MONTHS,
	assertBoundedIterations,
} from '@/lib/calculations/computation-bounds'
import {
	calculateAnnuitySchedule,
	calculateDifferentiatedPayment,
} from '@/lib/calculations/payment-types'

function round2(value: number): number {
	return Math.round(value * 100) / 100
}

export const calculateAutoLoan: CalculationFunction = (inputs) => {
	const vehiclePrice = Number(inputs.vehiclePrice || inputs.carPrice || 0)
	const downPayment = Number(inputs.downPayment || 0)
	const tradeInValue = Number(inputs.tradeInValue || 0)
	const salesTaxRate = Number(inputs.salesTaxRate || inputs.salesTax || 0)
	const annualInterestRate = Number(
		inputs.annualInterestRate || inputs.interestRate || 0,
	)
	const loanTerm = Math.floor(Number(inputs.loanTerm || 1))
	const fees = Number(inputs.fees || 0)
	const registrationFees = Number(inputs.registrationFees || 0)
	const extendedWarranty = Number(inputs.extendedWarranty || 0)
	const gapInsurance = Number(inputs.gapInsurance || 0)
	const totalFees =
		fees > 0 ? fees : registrationFees + extendedWarranty + gapInsurance
	const paymentType = String(inputs.paymentType || 'annuity').toLowerCase()

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
		annualInterestRate < 0 ||
		annualInterestRate > 100 ||
		loanTerm < 1 ||
		loanTerm > 10 ||
		downPayment + tradeInValue > vehiclePrice
	) {
		throw new CalculationDomainError('Auto loan inputs are out of valid range')
	}

	const taxableAmount = vehiclePrice - tradeInValue
	const salesTaxAmount = (taxableAmount * salesTaxRate) / 100
	const totalVehicleCost = vehiclePrice + salesTaxAmount + totalFees
	const loanAmount = totalVehicleCost - downPayment - tradeInValue

	if (loanAmount <= 0) {
		return {
			loanAmount: 0,
			monthlyPayment: 0,
			totalPayment: 0,
			totalInterest: 0,
			overpayment: 0,
			totalCostOfVehicle: downPayment + tradeInValue,
			totalCost: downPayment + tradeInValue,
			totalFees: round2(totalFees),
			formulaExplanation: 'No financing required.',
			steps: 'No loan balance.',
		}
	}

	const numberOfPayments = assertBoundedIterations(
		loanTerm * 12,
		MAX_SIMULATION_MONTHS,
		'Auto loan payments',
	)

	let monthlyPayment = 0
	let totalPayment = 0
	let totalInterest = 0

	if (paymentType === 'differentiated') {
		const diff = calculateDifferentiatedPayment(
			loanAmount,
			annualInterestRate,
			numberOfPayments,
			12,
		)
		monthlyPayment = diff.firstPayment
		totalPayment = diff.totalPayment
		totalInterest = diff.totalInterest
	} else {
		const annuity = calculateAnnuitySchedule(
			loanAmount,
			annualInterestRate,
			numberOfPayments,
			12,
		)
		monthlyPayment = annuity.periodicPayment
		totalPayment = annuity.totalPayment
		totalInterest = annuity.totalInterest
	}

	const overpayment = totalInterest
	const totalCostOfVehicle = downPayment + tradeInValue + totalPayment
	const steps = `Loan ${round2(loanAmount)}; payment ${round2(monthlyPayment)} (${paymentType})`

	return {
		loanAmount: round2(loanAmount),
		monthlyPayment: round2(monthlyPayment),
		totalPayment: round2(totalPayment),
		totalInterest: round2(totalInterest),
		overpayment: round2(overpayment),
		totalCostOfVehicle: round2(totalCostOfVehicle),
		totalCost: round2(totalCostOfVehicle),
		totalFees: round2(totalFees),
		formulaExplanation: steps,
		steps,
	}
}

registerCalculation('calculateAutoLoan', calculateAutoLoan)
