/**
 * Savings growth with compound/simple interest, tax on gains, and optional withdrawals.
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

/**
 * Month-by-month projection matching ordinary annuity (end-of-period deposits).
 * Interest accrues on the opening balance first; the contribution is added
 * afterward so the year table agrees with the closed-form FV formula.
 */
function simulateSavingsMonths(options: {
	initialSavings: number
	monthlyContribution: number
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
	const months = assertBoundedIterations(
		options.years * 12,
		MAX_HORIZON_YEARS * 12,
		'Savings horizon (months)',
	)
	const monthlyRate = options.annualRatePercent / 100 / 12
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
			// Ordinary annuity: interest first, then end-of-period contribution.
			if (options.interestType === 'simple') {
				// Accrue simple interest on principal before the new deposit.
				simpleInterestPool += balance * monthlyRate
			} else {
				balance *= 1 + monthlyRate
			}

			balance += options.monthlyContribution
			yearContributions += options.monthlyContribution

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
		options.initialSavings + options.monthlyContribution * months

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
	const monthlyContribution =
		contributionsPerYear === 12
			? regularContribution
			: regularContribution / 12

	const useMonthlySimulation =
		interestType === 'simple' ||
		monthlyWithdrawal > 0 ||
		contributionsPerYear !== 12

	let finalSavings = 0
	let totalContributions = 0
	let totalWithdrawals = 0
	let yearlyBreakdown: YearBreakdown[] = []

	if (useMonthlySimulation) {
		const simulated = simulateSavingsMonths({
			initialSavings,
			monthlyContribution,
			annualRatePercent: annualInterestRate,
			years: savingsPeriod,
			interestType,
			monthlyWithdrawal,
		})
		finalSavings = simulated.finalSavings
		totalContributions = simulated.totalContributions
		totalWithdrawals = simulated.totalWithdrawals
		yearlyBreakdown = simulated.yearlyBreakdown
	} else {
		const compoundingFrequency = getCompoundingFrequency(
			compoundingFrequencyStr,
		)
		const annualRate = annualInterestRate / 100
		const periodicRate = annualRate / compoundingFrequency
		const totalPeriods = savingsPeriod * compoundingFrequency
		const totalContributionsCount = savingsPeriod * contributionsPerYear

		let futureValueInitial = 0
		if (initialSavings > 0) {
			futureValueInitial =
				periodicRate === 0
					? initialSavings
					: initialSavings * Math.pow(1 + periodicRate, totalPeriods)
		}

		let futureValueContributions = 0
		if (regularContribution > 0) {
			const contributionPerPeriod =
				regularContribution *
				(contributionsPerYear / compoundingFrequency)
			if (periodicRate === 0) {
				futureValueContributions = contributionPerPeriod * totalPeriods
			} else {
				const rateFactor = Math.pow(1 + periodicRate, totalPeriods)
				futureValueContributions =
					contributionPerPeriod * ((rateFactor - 1) / periodicRate)
			}
		}

		// Closed-form ordinary annuity, then overwrite from monthly simulation
		// so finalSavings === last yearlyBreakdown.endingBalance.
		finalSavings = round2(futureValueInitial + futureValueContributions)
		totalContributions =
			initialSavings + regularContribution * totalContributionsCount

		const simulated = simulateSavingsMonths({
			initialSavings,
			monthlyContribution,
			annualRatePercent: annualInterestRate,
			years: savingsPeriod,
			interestType: 'compound',
			monthlyWithdrawal: 0,
		})
		yearlyBreakdown = simulated.yearlyBreakdown
		finalSavings = simulated.finalSavings
		totalContributions = simulated.totalContributions
		totalWithdrawals = simulated.totalWithdrawals
	}

	// Economic interest includes cash withdrawn during the period
	const totalInterestEarned = round2(
		finalSavings + totalWithdrawals - totalContributions,
	)

	// When inflation is 0, real value equals nominal savings (never null)
	let inflationAdjustedSavings = finalSavings
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, savingsPeriod)
		inflationAdjustedSavings = round2(finalSavings / inflationFactor)
	}

	let timeToTarget: number | null = null
	if (targetAmount > 0 && finalSavings < targetAmount) {
		const monthlyRate = annualInterestRate / 100 / 12
		let currentBalance = initialSavings
		let months = 0
		const maxMonths = assertBoundedIterations(
			savingsPeriod * 12 * 2,
			MAX_HORIZON_YEARS * 12 * 2,
			'Target search months',
		)

		// Same ordinary-annuity order as simulateSavingsMonths (interest, then deposit).
		while (currentBalance < targetAmount && months < maxMonths) {
			if (monthlyRate > 0 && interestType === 'compound') {
				currentBalance *= 1 + monthlyRate
			}
			currentBalance += monthlyContribution
			months++
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
