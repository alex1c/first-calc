/**
 * Personal loan with annuity or differentiated payment types.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import {
	MAX_SIMULATION_MONTHS,
	assertBoundedIterations,
} from '@/lib/calculations/computation-bounds'
import {
	calculateAnnuityPeriodicPayment,
	calculateAnnuitySchedule,
	calculateDifferentiatedPayment,
} from '@/lib/calculations/payment-types'

function getPaymentsPerYear(frequency: string | number | boolean): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	if (typeof frequency === 'boolean') {
		return frequency ? 12 : 1
	}
	const frequencyMap: Record<string, number> = {
		monthly: 12,
		'bi-weekly': 26,
		biweekly: 26,
	}
	return frequencyMap[String(frequency).toLowerCase()] || 12
}

function round2(value: number): number {
	return Math.round(value * 100) / 100
}

export const calculatePersonalLoan: CalculationFunction = (inputs) => {
	const loanAmount = Number(inputs.loanAmount || 0)
	const annualInterestRate = Number(
		inputs.annualInterestRate || inputs.interestRate || 0,
	)
	const loanTerm = Math.floor(Number(inputs.loanTerm || inputs.years || 0))
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const originationFee = Number(inputs.originationFee || 0)
	const feeType = String(inputs.feeType || 'percentage').toLowerCase()
	const extraMonthlyPayment = Number(
		inputs.extraMonthlyPayment || inputs.extraPayment || 0,
	)
	const paymentType = String(inputs.paymentType || 'annuity').toLowerCase()

	let feeAmount = 0
	if (feeType === 'percentage') {
		feeAmount = (loanAmount * originationFee) / 100
	} else {
		feeAmount = originationFee
	}

	if (
		isNaN(loanAmount) ||
		isNaN(annualInterestRate) ||
		isNaN(loanTerm) ||
		isNaN(feeAmount) ||
		isNaN(extraMonthlyPayment) ||
		loanAmount <= 0 ||
		annualInterestRate < 0 ||
		annualInterestRate > 100 ||
		loanTerm < 1 ||
		loanTerm > 10 ||
		feeAmount < 0 ||
		feeAmount >= loanAmount ||
		extraMonthlyPayment < 0
	) {
		throw new CalculationDomainError(
			'Personal loan inputs are out of valid range',
		)
	}

	const netLoanAmount = loanAmount - feeAmount
	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const numberOfPayments = assertBoundedIterations(
		loanTerm * paymentsPerYear,
		MAX_SIMULATION_MONTHS,
		'Personal loan payments',
	)
	const periodicRate = annualInterestRate / 100 / paymentsPerYear

	let monthlyPayment = 0
	let totalPayment = 0
	let totalInterest = 0

	if (paymentType === 'differentiated') {
		const diff = calculateDifferentiatedPayment(
			netLoanAmount,
			annualInterestRate,
			numberOfPayments,
			paymentsPerYear,
		)
		monthlyPayment = diff.firstPayment
		totalPayment = diff.totalPayment
		totalInterest = diff.totalInterest
	} else {
		const annuity = calculateAnnuitySchedule(
			netLoanAmount,
			annualInterestRate,
			numberOfPayments,
			paymentsPerYear,
		)
		monthlyPayment = annuity.periodicPayment
		totalPayment = annuity.totalPayment
		totalInterest = annuity.totalInterest
	}

	if (extraMonthlyPayment > 0 && paymentType === 'annuity') {
		let remainingBalance = netLoanAmount
		let periodsPaid = 0
		let totalInterestPaid = 0
		const regularPayment = calculateAnnuityPeriodicPayment(
			netLoanAmount,
			annualInterestRate,
			numberOfPayments,
			paymentsPerYear,
		)
		const paymentWithExtra = regularPayment + extraMonthlyPayment
		const maxPeriods = assertBoundedIterations(
			numberOfPayments * 2,
			MAX_SIMULATION_MONTHS,
			'Extra payment simulation',
		)

		while (remainingBalance > 0.01 && periodsPaid < maxPeriods) {
			const periodInterest = remainingBalance * periodicRate
			totalInterestPaid += periodInterest
			const principalPayment = paymentWithExtra - periodInterest
			remainingBalance = Math.max(0, remainingBalance - principalPayment)
			periodsPaid++
		}

		totalInterest = round2(totalInterestPaid)
		totalPayment = netLoanAmount + totalInterest
	}

	let effectiveAPR = annualInterestRate
	if (feeAmount > 0) {
		const totalCost = totalInterest + feeAmount
		effectiveAPR = ((totalCost / netLoanAmount) / loanTerm) * 100
	}

	const overpayment = totalInterest + feeAmount
	const steps = `Net loan ${round2(netLoanAmount)}; ${paymentType} payment ${round2(monthlyPayment)}`

	return {
		monthlyPayment: round2(monthlyPayment),
		totalPayment: round2(totalPayment),
		totalInterest: round2(totalInterest),
		overpayment: round2(overpayment),
		// Without fees, effective APR equals the stated annual rate
		effectiveAPR: round2(effectiveAPR),
		apr: round2(effectiveAPR),
		totalFees: round2(feeAmount),
		formulaExplanation: steps,
		steps,
	}
}

registerCalculation('calculatePersonalLoan', calculatePersonalLoan)
