/**
 * Loan overpayment impact (annuity or differentiated baseline schedules).
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

export const calculateLoanOverpayment: CalculationFunction = (inputs) => {
	const loanAmount = Number(inputs.loanAmount || 0)
	const annualInterestRate = Number(
		inputs.annualInterestRate || inputs.interestRate || 0,
	)
	const loanTerm = Math.floor(Number(inputs.loanTerm || inputs.years || 0))
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const extraMonthlyPayment = Number(
		inputs.extraMonthlyPayment || inputs.extraPayment || 0,
	)
	const loanType = String(
		inputs.loanType || inputs.paymentType || 'annuity',
	).toLowerCase()

	if (
		isNaN(loanAmount) ||
		isNaN(annualInterestRate) ||
		isNaN(loanTerm) ||
		isNaN(extraMonthlyPayment) ||
		loanAmount <= 0 ||
		annualInterestRate < 0 ||
		annualInterestRate > 100 ||
		loanTerm < 1 ||
		loanTerm > 50 ||
		extraMonthlyPayment < 0
	) {
		throw new CalculationDomainError(
			'Loan overpayment inputs are out of valid range',
		)
	}

	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const numberOfPayments = assertBoundedIterations(
		loanTerm * paymentsPerYear,
		MAX_SIMULATION_MONTHS,
		'Loan payments',
	)
	const periodicRate = annualInterestRate / 100 / paymentsPerYear

	let regularPayment = 0
	let totalPayment = 0
	let totalInterest = 0

	if (loanType === 'differentiated') {
		const diff = calculateDifferentiatedPayment(
			loanAmount,
			annualInterestRate,
			numberOfPayments,
			paymentsPerYear,
		)
		regularPayment = diff.firstPayment
		totalPayment = diff.totalPayment
		totalInterest = diff.totalInterest
	} else if (loanType === 'interest-only') {
		regularPayment = loanAmount * periodicRate
		totalPayment = regularPayment * numberOfPayments + loanAmount
		totalInterest = regularPayment * numberOfPayments
	} else {
		const annuity = calculateAnnuitySchedule(
			loanAmount,
			annualInterestRate,
			numberOfPayments,
			paymentsPerYear,
		)
		regularPayment = annuity.periodicPayment
		totalPayment = annuity.totalPayment
		totalInterest = annuity.totalInterest
	}

	regularPayment = round2(regularPayment)
	const overpayment = totalInterest

	let interestSaved = 0
	let loanDurationReduced = 0
	let totalInterestWithExtra = totalInterest
	let timeSaved = 0

	if (extraMonthlyPayment > 0 && loanType === 'annuity') {
		let remainingBalance = loanAmount
		let periodsPaid = 0
		let totalInterestPaid = 0
		const baselinePayment = calculateAnnuityPeriodicPayment(
			loanAmount,
			annualInterestRate,
			numberOfPayments,
			paymentsPerYear,
		)
		const paymentWithExtra = baselinePayment + extraMonthlyPayment
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

		totalInterestWithExtra = round2(totalInterestPaid)
		interestSaved = round2(totalInterest - totalInterestWithExtra)
		loanDurationReduced = numberOfPayments - periodsPaid
		timeSaved = round2(loanDurationReduced / paymentsPerYear)
	}

	const steps = [
		`Regular payment: ${regularPayment}`,
		`Total interest: ${round2(totalInterest)}`,
		extraMonthlyPayment > 0
			? `Interest saved: ${interestSaved}; time saved: ${timeSaved} years`
			: '',
	]
		.filter(Boolean)
		.join('; ')

	return {
		overpayment: round2(overpayment),
		totalInterest: round2(totalInterest),
		totalPayment: round2(totalPayment),
		regularPayment,
		monthlyPayment: regularPayment,
		// Zero extra payment → zero savings (never null for required outputs)
		interestSaved: extraMonthlyPayment > 0 ? interestSaved : 0,
		loanDurationReduced:
			extraMonthlyPayment > 0
				? round2(loanDurationReduced / paymentsPerYear)
				: 0,
		totalInterestWithExtra:
			extraMonthlyPayment > 0 ? totalInterestWithExtra : round2(totalInterest),
		timeSaved: extraMonthlyPayment > 0 ? timeSaved : 0,
		formulaExplanation: steps,
		steps,
	}
}

registerCalculation('calculateLoanOverpayment', calculateLoanOverpayment)
