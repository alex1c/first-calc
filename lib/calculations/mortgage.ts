/**
 * Mortgage payment engine (EN homePrice path + JSON/RU loanAmount-as-principal path).
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import {
	MAX_HORIZON_YEARS,
	MAX_SCHEDULE_ROWS,
	MAX_SIMULATION_MONTHS,
	assertBoundedIterations,
	capScheduleRows,
} from '@/lib/calculations/computation-bounds'
import {
	calculateAnnuitySchedule,
	calculateDifferentiatedPayment,
} from '@/lib/calculations/payment-types'

interface AmortizationEntry {
	month: number
	payment: number
	principal: number
	interest: number
	remainingBalance: number
}

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
		weekly: 52,
	}
	return frequencyMap[String(frequency).toLowerCase()] || 12
}

function round2(value: number): number {
	return Math.round(value * 100) / 100
}

function resolveDownPaymentAmount(
	baseForPercent: number,
	downPayment: number,
	downPaymentType: string,
): number {
	if (downPaymentType === 'percentage') {
		return (baseForPercent * downPayment) / 100
	}
	return downPayment
}

/**
 * Whether PMI applies at a given remaining balance (equity below threshold).
 */
function requiresPmi(
	remainingBalance: number,
	propertyValue: number,
	pmiThresholdEquityPercent: number,
): boolean {
	if (propertyValue <= 0) {
		return false
	}
	const equityPercent =
		((propertyValue - remainingBalance) / propertyValue) * 100
	return equityPercent < pmiThresholdEquityPercent
}

export const calculateMortgage: CalculationFunction = (inputs) => {
	const usesHomePrice =
		inputs.homePrice !== undefined &&
		inputs.homePrice !== '' &&
		Number.isFinite(Number(inputs.homePrice))

	const homePrice = usesHomePrice ? Number(inputs.homePrice) : 0
	const loanAmountInput = Number(inputs.loanAmount || 0)
	const downPayment = Number(inputs.downPayment || 0)
	const downPaymentType = String(
		inputs.downPaymentType || 'amount',
	).toLowerCase()
	const loanTermYears = Math.floor(
		Number(inputs.loanTermYears || inputs.loanTerm || 30),
	)
	const interestRateAPR = Number(
		inputs.interestRateAPR ||
			inputs.annualInterestRate ||
			inputs.interestRate ||
			0,
	)
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'
	const paymentType = String(
		inputs.paymentType || 'annuity',
	).toLowerCase()

	const propertyTax = Number(inputs.propertyTax || inputs.propertyTaxRate || 0)
	// RU JSON treats propertyTax as annual currency when type is omitted
	const propertyTaxType = String(
		inputs.propertyTaxType || 'amount',
	).toLowerCase()

	const homeInsurance = Number(inputs.homeInsurance || 0)
	const HOA = Number(inputs.HOA || inputs.hoa || inputs.hoaFees || 0)
	const extraMonthlyPayment = Number(
		inputs.extraMonthlyPayment || inputs.extraPayment || 0,
	)
	const pmiRate = Number(inputs.pmiRate || 0)
	const pmiThreshold = Number(inputs.pmiThreshold ?? 20)

	const startDateValue = inputs.startDate
	const startDate =
		startDateValue && typeof startDateValue !== 'boolean'
			? new Date(startDateValue)
			: new Date()

	let downPaymentAmount = 0
	let loanAmount = 0
	let propertyValue = 0

	if (usesHomePrice) {
		if (
			!Number.isFinite(homePrice) ||
			homePrice <= 0 ||
			!Number.isFinite(downPayment) ||
			downPayment < 0
		) {
			throw new CalculationDomainError('Home price must be a positive number')
		}
		downPaymentAmount = resolveDownPaymentAmount(
			homePrice,
			downPayment,
			downPaymentType,
		)
		if (downPaymentAmount >= homePrice) {
			throw new CalculationDomainError(
				'Down payment must be less than home price',
			)
		}
		loanAmount = homePrice - downPaymentAmount
		propertyValue = homePrice
	} else {
		if (!Number.isFinite(loanAmountInput) || loanAmountInput <= 0) {
			throw new CalculationDomainError('Loan amount must be a positive number')
		}
		loanAmount = loanAmountInput
		downPaymentAmount = resolveDownPaymentAmount(
			loanAmount + downPayment,
			downPayment,
			downPaymentType,
		)
		propertyValue =
			downPaymentAmount > 0 ? loanAmount + downPaymentAmount : loanAmount
	}

	if (
		!Number.isFinite(loanTermYears) ||
		loanTermYears < 1 ||
		loanTermYears > MAX_HORIZON_YEARS ||
		!Number.isFinite(interestRateAPR) ||
		interestRateAPR < 0 ||
		interestRateAPR > 30 ||
		propertyTax < 0 ||
		homeInsurance < 0 ||
		HOA < 0 ||
		extraMonthlyPayment < 0 ||
		pmiRate < 0 ||
		pmiRate > 100 ||
		pmiThreshold < 0 ||
		pmiThreshold > 100
	) {
		throw new CalculationDomainError('Mortgage inputs are out of valid range')
	}

	const paymentsPerYear = getPaymentsPerYear(paymentFrequencyStr)
	const numberOfPayments = assertBoundedIterations(
		loanTermYears * paymentsPerYear,
		MAX_SIMULATION_MONTHS,
		'Number of payments',
	)
	const periodicRate = interestRateAPR / 100 / paymentsPerYear

	let periodicMortgagePayment = 0
	let totalPayment = 0
	let totalInterest = 0
	let amortizationSchedule: AmortizationEntry[] = []

	if (paymentType === 'differentiated') {
		const diff = calculateDifferentiatedPayment(
			loanAmount,
			interestRateAPR,
			numberOfPayments,
			paymentsPerYear,
		)
		periodicMortgagePayment = diff.firstPayment
		totalPayment = diff.totalPayment
		totalInterest = diff.totalInterest
		amortizationSchedule = diff.paymentSchedule.map((row) => ({
			month: row.month,
			payment: row.totalPayment,
			principal: row.principalPayment,
			interest: row.interestPayment,
			remainingBalance: row.remainingBalance,
		}))
	} else {
		const annuity = calculateAnnuitySchedule(
			loanAmount,
			interestRateAPR,
			numberOfPayments,
			paymentsPerYear,
		)
		periodicMortgagePayment = annuity.periodicPayment
		totalPayment = annuity.totalPayment
		totalInterest = annuity.totalInterest
		amortizationSchedule = annuity.schedule.map((row) => ({
			month: row.month,
			payment: row.totalPayment,
			principal: row.principalPayment,
			interest: row.interestPayment,
			remainingBalance: row.remainingBalance,
		}))
	}

	amortizationSchedule = capScheduleRows(amortizationSchedule, MAX_SCHEDULE_ROWS)

	// Property tax: monthly share of annual amount or percentage of property value
	let monthlyPropertyTax = 0
	if (propertyTax > 0) {
		if (propertyTaxType === 'percentage') {
			monthlyPropertyTax = (propertyValue * propertyTax) / 100 / 12
		} else {
			monthlyPropertyTax = propertyTax / 12
		}
		monthlyPropertyTax = round2(monthlyPropertyTax)
	}

	const monthlyInsurance =
		homeInsurance > 0 ? round2(homeInsurance / 12) : 0

	// PMI: walk full payment schedule (not capped) for totals and pmiMonths
	let pmiMonths = 0
	let totalPmiPaid = 0
	let currentPmiMonthly = 0
	{
		let remainingBalance = loanAmount
		const principalSlice =
			paymentType === 'differentiated'
				? loanAmount / numberOfPayments
				: 0

		for (let period = 1; period <= numberOfPayments; period++) {
			const interestPayment = remainingBalance * periodicRate
			let principalPayment = 0
			let periodPayment = periodicMortgagePayment

			if (paymentType === 'differentiated') {
				principalPayment = principalSlice
				periodPayment = principalPayment + interestPayment
			} else {
				principalPayment = periodicMortgagePayment - interestPayment
			}

			if (
				pmiRate > 0 &&
				requiresPmi(remainingBalance, propertyValue, pmiThreshold)
			) {
				const pmiThisPeriod = (remainingBalance * pmiRate) / 100 / 12
				totalPmiPaid += pmiThisPeriod
				pmiMonths++
				if (period === 1) {
					currentPmiMonthly = pmiThisPeriod
				}
			}

			remainingBalance = Math.max(0, remainingBalance - principalPayment)
		}
	}

	const pmiPayment = round2(currentPmiMonthly)
	const monthlyMortgagePayment = round2(periodicMortgagePayment)
	const totalMonthlyPayment = round2(
		monthlyMortgagePayment +
			monthlyPropertyTax +
			monthlyInsurance +
			HOA +
			pmiPayment,
	)

	const totalCost =
		totalPayment +
		totalPmiPaid +
		monthlyPropertyTax * numberOfPayments +
		monthlyInsurance * numberOfPayments +
		HOA * numberOfPayments

	// Extra payment simulation (annuity only; differentiated uses average extra path)
	let interestSaved = 0
	let monthsReduced = 0
	let payoffDate: Date | null = null
	let totalInterestWithExtra = totalInterest

	if (extraMonthlyPayment > 0 && paymentType === 'annuity') {
		let remainingBalance = loanAmount
		let periodsPaid = 0
		let interestAccum = 0
		const paymentWithExtra = periodicMortgagePayment + extraMonthlyPayment
		const maxPeriods = assertBoundedIterations(
			numberOfPayments * 2,
			MAX_SIMULATION_MONTHS,
			'Extra payment simulation periods',
		)

		while (remainingBalance > 0.01 && periodsPaid < maxPeriods) {
			periodsPaid++
			const interestPayment = remainingBalance * periodicRate
			interestAccum += interestPayment
			const principalPayment = paymentWithExtra - interestPayment
			remainingBalance = Math.max(0, remainingBalance - principalPayment)
		}

		totalInterestWithExtra = round2(interestAccum)
		interestSaved = round2(totalInterest - totalInterestWithExtra)
		monthsReduced = numberOfPayments - periodsPaid
		payoffDate = new Date(startDate)
		payoffDate.setMonth(payoffDate.getMonth() + periodsPaid)
	} else {
		payoffDate = new Date(startDate)
		payoffDate.setMonth(payoffDate.getMonth() + numberOfPayments)
	}

	const paymentBreakdown = {
		principal: monthlyMortgagePayment,
		interest: round2(loanAmount * periodicRate),
		taxes: monthlyPropertyTax,
		insurance: monthlyInsurance,
		hoa: HOA,
		pmi: pmiPayment,
		total: totalMonthlyPayment,
	}

	const extraPaymentImpact =
		extraMonthlyPayment > 0 && paymentType === 'annuity'
			? {
					interestSaved,
					monthsReduced,
					yearsReduced: round2(monthsReduced / 12),
				}
			: null

	const steps = [
		`Principal: ${round2(loanAmount)}`,
		`Periodic payment (${paymentType}): ${monthlyMortgagePayment}`,
		`Total interest: ${round2(totalInterest)}`,
		`PMI months: ${pmiMonths}`,
	].join('; ')

	const formulaExplanation = steps

	return {
		monthlyMortgagePayment,
		totalMonthlyPayment,
		loanAmount: round2(loanAmount),
		totalInterest: round2(totalInterest),
		totalCost: round2(totalCost),
		payoffDate: payoffDate ? payoffDate.toISOString().split('T')[0] : null,
		paymentBreakdown,
		extraPaymentImpact,
		amortizationSchedule,
		formulaExplanation,
		monthlyPayment: monthlyMortgagePayment,
		totalPayment: round2(totalPayment),
		overpayment: round2(totalInterest),
		monthlyPITI: totalMonthlyPayment,
		totalCostOfOwnership: round2(totalCost),
		pmiPayment,
		pmiMonths,
		steps,
	}
}

registerCalculation('calculateMortgage', calculateMortgage)
