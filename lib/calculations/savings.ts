/**
 * Savings growth — same cash-flow model as investment (finance-cashflow.ts).
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { MAX_HORIZON_YEARS, assertBoundedIterations } from '@/lib/calculations/computation-bounds'
import {
	compoundingMonths,
	contributionMonths,
	getCompoundingFrequency,
	getContributionsPerYear,
	round2,
	simulateFinanceCashflow,
} from '@/lib/calculations/finance-cashflow'

export const calculateSavings: CalculationFunction = (inputs) => {
	const initialSavings = Number(inputs.initialSavings || 0)
	const regularContribution = Number(
		inputs.regularContribution || inputs.monthlyContribution || 0,
	)
	const contributionFrequencyStr =
		inputs.contributionFrequency ||
		(inputs.monthlyContribution ? 'monthly' : 'yearly')
	const annualInterestRate = Number(
		inputs.annualInterestRate || inputs.interestRate || 0,
	)
	const savingsPeriod = Math.floor(
		Number(inputs.savingsPeriod || inputs.years || 0),
	)
	const compoundingFrequencyStr = inputs.compoundingFrequency || 'monthly'
	const targetAmount = Number(inputs.targetAmount || 0)
	const inflationRate = Number(inputs.inflationRate || 0)
	const interestType = String(inputs.interestType || 'compound').toLowerCase()
	const taxRate = Number(inputs.taxRate || 0)
	const monthlyWithdrawal = Number(inputs.monthlyWithdrawal || 0)

	if (
		isNaN(initialSavings) ||
		isNaN(regularContribution) ||
		isNaN(annualInterestRate) ||
		isNaN(savingsPeriod) ||
		isNaN(targetAmount) ||
		isNaN(inflationRate) ||
		isNaN(taxRate) ||
		isNaN(monthlyWithdrawal) ||
		initialSavings < 0 ||
		regularContribution < 0 ||
		annualInterestRate < 0 ||
		annualInterestRate > 100 ||
		savingsPeriod < 1 ||
		targetAmount < 0 ||
		inflationRate < 0 ||
		taxRate < 0 ||
		taxRate > 100 ||
		monthlyWithdrawal < 0
	) {
		throw new CalculationDomainError('Savings inputs are out of valid range')
	}

	assertBoundedIterations(
		savingsPeriod,
		MAX_HORIZON_YEARS,
		'Savings period (years)',
	)

	const contributionsPerYear = getContributionsPerYear(contributionFrequencyStr)
	const compoundingFrequency = getCompoundingFrequency(
		compoundingFrequencyStr,
	)

	const simulated = simulateFinanceCashflow({
		initialPrincipal: initialSavings,
		contributionAmount: regularContribution,
		contributionsPerYear,
		compoundingFrequency,
		annualRatePercent: annualInterestRate,
		years: savingsPeriod,
		interestType,
		monthlyWithdrawal,
	})

	const finalSavings = simulated.finalBalance
	const totalContributions = simulated.totalContributions
	const totalWithdrawals = simulated.totalWithdrawals
	const yearlyBreakdown = simulated.yearlyBreakdown

	const totalInterestEarned = round2(
		finalSavings + totalWithdrawals - totalContributions,
	)

	let inflationAdjustedSavings = finalSavings
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, savingsPeriod)
		inflationAdjustedSavings = round2(finalSavings / inflationFactor)
	}

	let timeToTarget: number | null = null
	if (targetAmount > 0 && finalSavings < targetAmount) {
		const compoundSet = compoundingMonths(
			interestType === 'simple' ? 12 : compoundingFrequency,
		)
		const contribSet = contributionMonths(contributionsPerYear)
		const monthlyAccrualRate = annualInterestRate / 100 / 12
		let principal = initialSavings
		let accrued = 0
		let months = 0
		const maxMonths = assertBoundedIterations(
			savingsPeriod * 12 * 2,
			MAX_HORIZON_YEARS * 12 * 2,
			'Target search months',
		)

		while (principal + accrued < targetAmount && months < maxMonths) {
			months++
			const month = ((months - 1) % 12) + 1
			accrued += principal * monthlyAccrualRate
			if (interestType !== 'simple' && compoundSet.has(month)) {
				principal += accrued
				accrued = 0
			}
			if (contribSet.has(month)) {
				principal += regularContribution
			}
		}

		if (months < maxMonths) {
			timeToTarget = round2(months / 12)
		}
	}

	const taxableGain = Math.max(0, totalInterestEarned)
	const afterTaxValue = round2(finalSavings - (taxableGain * taxRate) / 100)

	const growthPercentage =
		totalContributions > 0
			? round2((totalInterestEarned / totalContributions) * 100)
			: 0

	const steps = [
		`Final savings: ${finalSavings}`,
		`Interest earned: ${totalInterestEarned}`,
		`After tax: ${afterTaxValue}`,
		`Compounding: ${compoundingFrequency}/year; contributions: ${contributionsPerYear}/year`,
		'Model: nominal rate, monthly accrual on principal, capitalize on compound boundaries only',
	].join('; ')

	return {
		finalSavings,
		totalContributions: round2(totalContributions),
		totalInterestEarned,
		timeToTarget,
		inflationAdjustedSavings,
		yearlyBreakdown,
		formulaExplanation: steps,
		finalValue: finalSavings,
		totalInterest: totalInterestEarned,
		realValue: inflationAdjustedSavings,
		growthPercentage,
		afterTaxValue,
		steps,
	}
}

registerCalculation('calculateSavings', calculateSavings)
