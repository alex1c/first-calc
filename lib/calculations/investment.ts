/**
 * Investment growth — delegates cash-flow math to finance-cashflow.ts
 * so investment and savings share one financial model.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { MAX_HORIZON_YEARS, assertBoundedIterations } from '@/lib/calculations/computation-bounds'
import {
	getCompoundingFrequency,
	getContributionsPerYear,
	round2,
	simulateFinanceCashflow,
} from '@/lib/calculations/finance-cashflow'

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

	const simulated = simulateFinanceCashflow({
		initialPrincipal: initialInvestment,
		contributionAmount: periodicContribution,
		contributionsPerYear,
		compoundingFrequency,
		annualRatePercent: expectedAnnualReturn,
		years: investmentPeriod,
		interestType,
		monthlyWithdrawal,
	})

	const finalValue = simulated.finalBalance
	const totalContributions = simulated.totalContributions
	const totalWithdrawals = simulated.totalWithdrawals
	const yearlyBreakdown = simulated.yearlyBreakdown.map((row) => ({
		year: row.year,
		startingValue: row.startingBalance,
		contribution: row.contribution,
		returnEarned: row.interestEarned,
		endingValue: row.endingBalance,
	}))

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

	const steps = [
		`Final value: ${finalValue}`,
		`Total contributions: ${round2(totalContributions)}`,
		`Profit: ${totalReturn}`,
		`After tax (${taxRate}%): ${afterTaxValue}`,
		`Compounding: ${compoundingFrequency}/year; contributions: ${contributionsPerYear}/year`,
		'Model: nominal rate, monthly accrual on principal, capitalize on compound boundaries only',
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
