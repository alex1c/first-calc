/**
 * Investment growth with compound/simple interest, tax on gains, and optional withdrawals.
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

/**
 * Month-by-month projection (compound or simple interest, optional withdrawal).
 *
 * Uses ordinary annuity (end-of-period) cash-flow order so the year table
 * matches the closed-form FV of an ordinary annuity:
 *   1) accrue interest on the opening balance
 *   2) add the period contribution
 *   3) take any withdrawal
 * Annuity-due (contribute then interest) would overstate ending values
 * relative to the standard FV formula used in the closed-form path.
 */
function simulateInvestmentMonths(options: {
	initialInvestment: number
	monthlyContribution: number
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
	const months = assertBoundedIterations(
		options.years * 12,
		MAX_HORIZON_YEARS * 12,
		'Investment horizon (months)',
	)
	const monthlyRate = options.annualRatePercent / 100 / 12
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
			// Ordinary annuity: interest on existing balance first, then deposit.
			if (options.interestType === 'simple') {
				// Simple interest accrues only on principal balance (not on
				// the contribution that lands at period end).
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
				// Withdraw from cash balance first, then accrued simple interest
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
		// Profit includes withdrawn cash that left the account during the year
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
		options.initialInvestment + options.monthlyContribution * months

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
	const monthlyContribution =
		contributionsPerYear === 12
			? periodicContribution
			: periodicContribution / 12

	const useMonthlySimulation =
		interestType === 'simple' ||
		monthlyWithdrawal > 0 ||
		contributionsPerYear !== 12

	let finalValue = 0
	let totalContributions = 0
	let totalWithdrawals = 0
	let yearlyBreakdown: YearBreakdown[] = []

	if (useMonthlySimulation) {
		const simulated = simulateInvestmentMonths({
			initialInvestment,
			monthlyContribution,
			annualRatePercent: expectedAnnualReturn,
			years: investmentPeriod,
			interestType,
			monthlyWithdrawal,
		})
		finalValue = simulated.finalValue
		totalContributions = simulated.totalContributions
		totalWithdrawals = simulated.totalWithdrawals
		yearlyBreakdown = simulated.yearlyBreakdown
	} else {
		const compoundingFrequency = getCompoundingFrequency(
			compoundingFrequencyStr,
		)
		const annualRate = expectedAnnualReturn / 100
		const periodicRate = annualRate / compoundingFrequency
		const totalPeriods = investmentPeriod * compoundingFrequency
		const totalContributionsCount = investmentPeriod * contributionsPerYear

		let futureValueInitial = 0
		if (initialInvestment > 0) {
			futureValueInitial =
				periodicRate === 0
					? initialInvestment
					: initialInvestment * Math.pow(1 + periodicRate, totalPeriods)
		}

		let futureValueContributions = 0
		if (periodicContribution > 0) {
			const contributionPerPeriod =
				periodicContribution *
				(contributionsPerYear / compoundingFrequency)
			if (periodicRate === 0) {
				futureValueContributions = contributionPerPeriod * totalPeriods
			} else {
				const rateFactor = Math.pow(1 + periodicRate, totalPeriods)
				futureValueContributions =
					contributionPerPeriod * ((rateFactor - 1) / periodicRate)
			}
		}

		// Closed-form ordinary annuity (same convention as the month loop).
		// Assigned then overwritten by simulation so the year table and
		// headline finalValue share one source of truth.
		finalValue = round2(futureValueInitial + futureValueContributions)
		totalContributions =
			initialInvestment + periodicContribution * totalContributionsCount

		const simulated = simulateInvestmentMonths({
			initialInvestment,
			monthlyContribution,
			annualRatePercent: expectedAnnualReturn,
			years: investmentPeriod,
			interestType: 'compound',
			monthlyWithdrawal: 0,
		})
		yearlyBreakdown = simulated.yearlyBreakdown
		finalValue = simulated.finalValue
		totalContributions = simulated.totalContributions
		totalWithdrawals = simulated.totalWithdrawals
	}

	// Economic profit = ending balance + cash withdrawn − net contributions
	const totalReturn = round2(finalValue + totalWithdrawals - totalContributions)
	const returnPercentage =
		totalContributions > 0
			? round2((totalReturn / totalContributions) * 100)
			: 0

	// When inflation is 0, real value equals nominal final value (never null)
	let inflationAdjustedValue = finalValue
	if (inflationRate > 0) {
		const inflationFactor = Math.pow(
			1 + inflationRate / 100,
			investmentPeriod,
		)
		inflationAdjustedValue = round2(finalValue / inflationFactor)
	}

	const taxableGain = Math.max(0, totalReturn)
	// Tax is paid on economic gain; after-tax wealth = end balance − tax
	const afterTaxValue = round2(finalValue - (taxableGain * taxRate) / 100)

	const steps = [
		`Final value: ${finalValue}`,
		`Total contributions: ${round2(totalContributions)}`,
		`Profit: ${totalReturn}`,
		`After tax (${taxRate}%): ${afterTaxValue}`,
	].join('; ')

	const formulaExplanation = steps

	return {
		finalValue,
		totalContributions: round2(totalContributions),
		totalReturn,
		returnPercentage,
		inflationAdjustedValue,
		yearlyBreakdown,
		formulaExplanation,
		totalProfit: totalReturn,
		profitPercentage: returnPercentage,
		realValue: inflationAdjustedValue,
		afterTaxValue,
		steps,
	}
}

registerCalculation('calculateInvestment', calculateInvestment)
