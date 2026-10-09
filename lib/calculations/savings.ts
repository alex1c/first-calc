/**
 * Savings growth with compound/simple interest, tax on gains, and optional withdrawals.
 *
 * Same month-calendar model as investment.ts: compounding and contribution
 * schedules are independent; yearly deposits are not smeared monthly;
 * finalSavings === last yearlyBreakdown.endingBalance.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { MAX_HORIZON_YEARS, assertBoundedIterations } from '@/lib/calculations/computation-bounds'

interface YearBreakdown {
	year: number
	startingBalance: number
	contribution: number
	interestEarned: number
	endingBalance: number
}

function getCompoundingFrequency(frequency: string | number | boolean): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	if (typeof frequency === 'boolean') {
		return frequency ? 12 : 1
	}
	const frequencyMap: Record<string, number> = {
		annually: 1,
		quarterly: 4,
		monthly: 12,
	}
	return frequencyMap[String(frequency).toLowerCase()] || 12
}

function getContributionsPerYear(frequency: string | number | boolean): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	if (typeof frequency === 'boolean') {
		return frequency ? 12 : 1
	}
	const frequencyMap: Record<string, number> = {
		monthly: 12,
		yearly: 1,
	}
	return frequencyMap[String(frequency).toLowerCase()] || 12
}

function round2(value: number): number {
	return Math.round(value * 100) / 100
}

function compoundingMonths(periodsPerYear: number): Set<number> {
	if (periodsPerYear <= 1) return new Set([12])
	if (periodsPerYear === 4) return new Set([3, 6, 9, 12])
	return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

function contributionMonths(contributionsPerYear: number): Set<number> {
	if (contributionsPerYear <= 1) return new Set([12])
	return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

function simulateSavingsProjection(options: {
	initialSavings: number
	contributionAmount: number
	contributionsPerYear: number
	compoundingFrequency: number
	annualRatePercent: number
	years: number
	interestType: string
	monthlyWithdrawal: number
}): {
	finalSavings: number
	totalContributions: number
	totalWithdrawals: number
	yearlyBreakdown: YearBreakdown[]
} {
	assertBoundedIterations(
		options.years * 12,
		MAX_HORIZON_YEARS * 12,
		'Savings horizon (months)',
	)

	const compoundSet = compoundingMonths(options.compoundingFrequency)
	const contribSet = contributionMonths(options.contributionsPerYear)
	const periodicRate =
		options.annualRatePercent / 100 / options.compoundingFrequency
	const simpleMonthlyRate = options.annualRatePercent / 100 / 12

	let balance = options.initialSavings
	let simpleInterestPool = 0
	let totalWithdrawals = 0
	const yearlyBreakdown: YearBreakdown[] = []

	for (let year = 1; year <= options.years; year++) {
		const startingBalance =
			options.interestType === 'simple'
				? balance + simpleInterestPool
				: balance
		let yearContributions = 0
		let yearWithdrawals = 0

		for (let month = 1; month <= 12; month++) {
			if (options.interestType === 'simple') {
				simpleInterestPool += balance * simpleMonthlyRate
			} else if (compoundSet.has(month)) {
				balance *= 1 + periodicRate
			}

			if (contribSet.has(month) && options.contributionAmount !== 0) {
				balance += options.contributionAmount
				yearContributions += options.contributionAmount
			}

			const gross =
				options.interestType === 'simple'
					? balance + simpleInterestPool
					: balance
			const withdrawal = Math.min(options.monthlyWithdrawal, gross)
			yearWithdrawals += withdrawal
			totalWithdrawals += withdrawal
			if (options.interestType === 'simple') {
				let remaining = withdrawal
				const fromBalance = Math.min(balance, remaining)
				balance -= fromBalance
				remaining -= fromBalance
				simpleInterestPool = Math.max(0, simpleInterestPool - remaining)
			} else {
				balance = Math.max(0, balance - withdrawal)
			}
		}

		const endingBalance =
			options.interestType === 'simple'
				? round2(balance + simpleInterestPool)
				: round2(balance)
		const interestEarned = round2(
			endingBalance - startingBalance - yearContributions + yearWithdrawals,
		)
		yearlyBreakdown.push({
			year,
			startingBalance: round2(startingBalance),
			contribution: round2(yearContributions),
			interestEarned,
			endingBalance,
		})
	}

	const finalSavings =
		options.interestType === 'simple'
			? balance + simpleInterestPool
			: balance
	const totalContributions =
		options.initialSavings +
		options.contributionAmount * options.contributionsPerYear * options.years

	return {
		finalSavings: round2(finalSavings),
		totalContributions: round2(totalContributions),
		totalWithdrawals: round2(totalWithdrawals),
		yearlyBreakdown,
	}
}

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

	const simulated = simulateSavingsProjection({
		initialSavings,
		contributionAmount: regularContribution,
		contributionsPerYear,
		compoundingFrequency:
			interestType === 'simple' ? 12 : compoundingFrequency,
		annualRatePercent: annualInterestRate,
		years: savingsPeriod,
		interestType,
		monthlyWithdrawal,
	})

	const finalSavings = simulated.finalSavings
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
		// Search with the same calendar rules as the main projection
		const compoundSet = compoundingMonths(
			interestType === 'simple' ? 12 : compoundingFrequency,
		)
		const contribSet = contributionMonths(contributionsPerYear)
		const periodicRate =
			annualInterestRate /
			100 /
			(interestType === 'simple' ? 12 : compoundingFrequency)
		const simpleMonthlyRate = annualInterestRate / 100 / 12
		let currentBalance = initialSavings
		let simplePool = 0
		let months = 0
		const maxMonths = assertBoundedIterations(
			savingsPeriod * 12 * 2,
			MAX_HORIZON_YEARS * 12 * 2,
			'Target search months',
		)

		while (
			(interestType === 'simple'
				? currentBalance + simplePool
				: currentBalance) < targetAmount &&
			months < maxMonths
		) {
			months++
			const month = ((months - 1) % 12) + 1
			if (interestType === 'simple') {
				simplePool += currentBalance * simpleMonthlyRate
			} else if (compoundSet.has(month)) {
				currentBalance *= 1 + periodicRate
			}
			if (contribSet.has(month)) {
				currentBalance += regularContribution
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
