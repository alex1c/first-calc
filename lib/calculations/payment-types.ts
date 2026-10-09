/**
 * Payment type calculation utilities (annuity and differentiated schedules).
 * Supports arbitrary payments-per-year; schedule payloads are capped for API safety.
 */

import {
	MAX_SCHEDULE_ROWS,
	capScheduleRows,
} from '@/lib/calculations/computation-bounds'

export interface PaymentScheduleRow {
	month: number
	principalPayment: number
	interestPayment: number
	totalPayment: number
	remainingBalance: number
}

export interface AmortizationTotals {
	periodicPayment: number
	totalPayment: number
	totalInterest: number
	schedule: PaymentScheduleRow[]
}

/**
 * Fixed (annuity) payment amount for a fully amortizing loan.
 */
export function calculateAnnuityPeriodicPayment(
	principal: number,
	annualRatePercent: number,
	numberOfPayments: number,
	paymentsPerYear: number,
): number {
	if (numberOfPayments <= 0) {
		return 0
	}
	const periodicRate = annualRatePercent / 100 / paymentsPerYear
	if (periodicRate === 0) {
		return principal / numberOfPayments
	}
	const rateFactor = Math.pow(1 + periodicRate, numberOfPayments)
	return (principal * periodicRate * rateFactor) / (rateFactor - 1)
}

/**
 * Build a full annuity amortization schedule; only the first MAX_SCHEDULE_ROWS are returned.
 */
export function calculateAnnuitySchedule(
	principal: number,
	annualRatePercent: number,
	numberOfPayments: number,
	paymentsPerYear: number,
): AmortizationTotals {
	const periodicRate = annualRatePercent / 100 / paymentsPerYear
	const periodicPayment = calculateAnnuityPeriodicPayment(
		principal,
		annualRatePercent,
		numberOfPayments,
		paymentsPerYear,
	)

	const fullSchedule: PaymentScheduleRow[] = []
	let remainingBalance = principal
	let totalPayment = 0
	let totalInterest = 0

	for (let period = 1; period <= numberOfPayments; period++) {
		const interestPayment = remainingBalance * periodicRate
		const principalPayment = periodicPayment - interestPayment
		remainingBalance = Math.max(0, remainingBalance - principalPayment)

		totalPayment += periodicPayment
		totalInterest += interestPayment

		fullSchedule.push({
			month: period,
			principalPayment: Math.round(principalPayment * 100) / 100,
			interestPayment: Math.round(interestPayment * 100) / 100,
			totalPayment: Math.round(periodicPayment * 100) / 100,
			remainingBalance: Math.round(remainingBalance * 100) / 100,
		})
	}

	return {
		periodicPayment: Math.round(periodicPayment * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		schedule: capScheduleRows(fullSchedule, MAX_SCHEDULE_ROWS),
	}
}

/**
 * Differentiated (declining) payments: constant principal slice each period.
 */
export function calculateDifferentiatedPayment(
	principal: number,
	annualRatePercent: number,
	numberOfPayments: number,
	paymentsPerYear: number = 12,
): {
	firstPayment: number
	lastPayment: number
	averagePayment: number
	totalPayment: number
	totalInterest: number
	paymentSchedule: PaymentScheduleRow[]
} {
	const periodicRate = annualRatePercent / 100 / paymentsPerYear
	const principalPayment = principal / numberOfPayments

	const fullSchedule: PaymentScheduleRow[] = []
	let remainingBalance = principal
	let totalPayment = 0
	let totalInterest = 0

	for (let period = 1; period <= numberOfPayments; period++) {
		const interestPayment = remainingBalance * periodicRate
		const totalMonthlyPayment = principalPayment + interestPayment

		fullSchedule.push({
			month: period,
			principalPayment: Math.round(principalPayment * 100) / 100,
			interestPayment: Math.round(interestPayment * 100) / 100,
			totalPayment: Math.round(totalMonthlyPayment * 100) / 100,
			remainingBalance: Math.round(remainingBalance * 100) / 100,
		})

		totalPayment += totalMonthlyPayment
		totalInterest += interestPayment
		remainingBalance -= principalPayment
	}

	const capped = capScheduleRows(fullSchedule, MAX_SCHEDULE_ROWS)
	const firstPayment = fullSchedule[0]?.totalPayment || 0
	const lastPayment =
		fullSchedule[fullSchedule.length - 1]?.totalPayment || 0
	const averagePayment = totalPayment / numberOfPayments

	return {
		firstPayment: Math.round(firstPayment * 100) / 100,
		lastPayment: Math.round(lastPayment * 100) / 100,
		averagePayment: Math.round(averagePayment * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		paymentSchedule: capped,
	}
}
