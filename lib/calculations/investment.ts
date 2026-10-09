/**
 * Investment growth with compound/simple interest, tax on gains, and optional withdrawals.
 *
 * Single cash-flow model (month calendar):
 * - Compounding applies only on months that match compoundingFrequency.
 * - Contributions apply only on months that match contributionFrequency
 *   (yearly deposits are NOT smeared across months).
 * - Ordinary annuity order within a month: interest → contribution → withdrawal.
 * Headline finalValue and yearlyBreakdown always come from this same simulation.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { MAX_HORIZON_YEARS, assertBoundedIterations } from '@/lib/calculations/computation-bounds'

interface YearBreakdown {
	year: number
	startingValue: number
	contribution: number
	returnEarned: number
	endingValue: number
}

function getCompoundingFrequency(frequency: string | number | boolean): number {
	if (typeof frequency === 'number') {
		return frequency
	}
	if (typeof frequency === 'boolean') {
		return 12
	}
	const frequencyMap: Record<string, number> = {
		annually: 1,
		quarterly: 4,
		monthly: 12,
	}
	return frequencyMap[String(frequency).toLowerCase()] || 12
}

function getContributionsPerYear(frequency: string | boolean): number {
	if (typeof frequency === 'boolean') {
		return 12
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

/** Months (1–12) when discrete compound interest is applied. */
function compoundingMonths(periodsPerYear: number): Set<number> {
	if (periodsPerYear <= 1) return new Set([12])
	if (periodsPerYear === 4) return new Set([3, 6, 9, 12])
	return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

/** Months (1–12) when a contribution event occurs. */
function contributionMonths(contributionsPerYear: number): Set<number> {
	if (contributionsPerYear <= 1) return new Set([12])
	return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

/**
 * Month-calendar projection. One source of truth for finals and the year table.
 */
function simulateInvestmentProjection(options: {
	initialInvestment: number
	contributionAmount: number
	contributionsPerYear: number
	compoundingFrequency: number
	annualRatePercent: number
	years: number
	interestType: string
	monthlyWithdrawal: number
}): {
	finalValue: number
	totalContributions: number
	totalWithdrawals: number
	yearlyBreakdown: YearBreakdown[]
} {
	assertBoundedIterations(
		options.years * 12,
		MAX_HORIZON_YEARS * 12,
		'Investment horizon (months)',
	)

	const compoundSet = compoundingMonths(options.compoundingFrequency)
	const contribSet = contributionMonths(options.contributionsPerYear)
	const periodicRate =
		options.annualRatePercent / 100 / options.compoundingFrequency
	// Simple interest accrues monthly on principal (legacy advanced path)
	const simpleMonthlyRate = options.annualRatePercent / 100 / 12

	let balance = options.initialInvestment
	let simpleInterestPool = 0
	let totalWithdrawals = 0
	const yearlyBreakdown: YearBreakdown[] = []

	for (let year = 1; year <= options.years; year++) {
		const startingValue =
			options.interestType === 'simple'
				? balance + simpleInterestPool
				: balance
		let yearContributions = 0
		let yearWithdrawals = 0

		for (let month = 1; month <= 12; month++) {
			// 1) Accrue interest only on compounding months (compound path)
			if (options.interestType === 'simple') {
				simpleInterestPool += balance * simpleMonthlyRate
			} else if (compoundSet.has(month)) {
				balance *= 1 + periodicRate
			}

			// 2) Contribution only on contribution-schedule months
			if (contribSet.has(month) && options.contributionAmount !== 0) {
				balance += options.contributionAmount
				yearContributions += options.contributionAmount
			}

			// 3) Optional monthly withdrawal
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

		const endingValue =
			options.interestType === 'simple'
				? round2(balance + simpleInterestPool)
				: round2(balance)
		const returnEarned = round2(
			endingValue - startingValue - yearContributions + yearWithdrawals,
		)
		yearlyBreakdown.push({
			year,
			startingValue: round2(startingValue),
			contribution: round2(yearContributions),
			returnEarned,
			endingValue,
		})
	}

	const finalValue =
		options.interestType === 'simple'
			? balance + simpleInterestPool
			: balance
	const totalContributions =
		options.initialInvestment +
		options.contributionAmount * options.contributionsPerYear * options.years

	return {
		finalValue: round2(finalValue),
		totalContributions: round2(totalContributions),
		totalWithdrawals: round2(totalWithdrawals),
		yearlyBreakdown,
	}
}

export const calculateInvestment: CalculationFunction = (inputs) => {
	const initialInvestment = Number(inputs.initialInvestment || 0)
	const periodicContribution = Number(
		inputs.periodicContribution || inputs.monthlyContribution || 0,
	)
	const contributionFrequencyStr =
		inputs.contributionFrequency ||
		(inputs.monthlyContribution ? 'monthly' : 'yearly')
	const expectedAnnualReturn = Number(
		inputs.expectedAnnualReturn || inputs.interestRate || 0,
	)
	const investmentPeriod = Math.floor(
		Number(inputs.investmentPeriod || inputs.years || 0),
	)
	const compoundingFrequencyStr = inputs.compoundingFrequency || 'monthly'
	const inflationRate = Number(inputs.inflationRate || 0)
	const interestType = String(inputs.interestType || 'compound').toLowerCase()
	const taxRate = Number(inputs.taxRate || 0)
	const monthlyWithdrawal = Number(inputs.monthlyWithdrawal || 0)

	if (
		isNaN(initialInvestment) ||
		isNaN(periodicContribution) ||
		isNaN(expectedAnnualReturn) ||
		isNaN(investmentPeriod) ||
		isNaN(inflationRate) ||
		isNaN(taxRate) ||
		isNaN(monthlyWithdrawal) ||
		initialInvestment < 0 ||
		periodicContribution < 0 ||
		expectedAnnualReturn < 0 ||
		expectedAnnualReturn > 100 ||
		investmentPeriod < 1 ||
		inflationRate < 0 ||
		taxRate < 0 ||
		taxRate > 100 ||
		monthlyWithdrawal < 0
	) {
		throw new CalculationDomainError('Investment inputs are out of valid range')
	}

	assertBoundedIterations(
		investmentPeriod,
		MAX_HORIZON_YEARS,
		'Investment period (years)',
	)

	const contributionsPerYear = getContributionsPerYear(
		contributionFrequencyStr as string,
	)
	const compoundingFrequency = getCompoundingFrequency(
		compoundingFrequencyStr,
	)

	// Always simulate — never overwrite a closed-form with a monthly-only path
	const simulated = simulateInvestmentProjection({
		initialInvestment,
		contributionAmount: periodicContribution,
		contributionsPerYear,
		compoundingFrequency:
			interestType === 'simple' ? 12 : compoundingFrequency,
		annualRatePercent: expectedAnnualReturn,
		years: investmentPeriod,
		interestType,
		monthlyWithdrawal,
	})

	const finalValue = simulated.finalValue
	const totalContributions = simulated.totalContributions
	const totalWithdrawals = simulated.totalWithdrawals
	const yearlyBreakdown = simulated.yearlyBreakdown

	const totalReturn = round2(finalValue + totalWithdrawals - totalContributions)
	const returnPercentage =
		totalContributions > 0
			? round2((totalReturn / totalContributions) * 100)
			: 0

	let inflationAdjustedValue = finalValue
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(
			1 + inflationRate / 100,
			investmentPeriod,
		)
		inflationAdjustedValue = round2(finalValue / inflationFactor)
	}

	const taxableGain = Math.max(0, totalReturn)
	const afterTaxValue = round2(finalValue - (taxableGain * taxRate) / 100)

	// Currency-agnostic machine summary (UI localizes presentation)
	const steps = [
		`Final value: ${finalValue}`,
		`Total contributions: ${round2(totalContributions)}`,
		`Profit: ${totalReturn}`,
		`After tax (${taxRate}%): ${afterTaxValue}`,
	].join('; ')

	return {
		finalValue,
		totalContributions: round2(totalContributions),
		totalReturn,
		returnPercentage,
		inflationAdjustedValue,
		yearlyBreakdown,
		formulaExplanation: steps,
		totalProfit: totalReturn,
		profitPercentage: returnPercentage,
		realValue: inflationAdjustedValue,
		afterTaxValue,
		steps,
	}
}

registerCalculation('calculateInvestment', calculateInvestment)
