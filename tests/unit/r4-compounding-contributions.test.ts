/**
 * Independent R4 math regressions: compounding frequency and contribution schedule.
 * Expected values come from discrete compound formulas / calendar simulation,
 * not from re-importing the engine's private helpers.
 */
import { describe, it, expect } from 'vitest'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateSavings } from '@/lib/calculations/savings'

/** Independent FV of principal with n compounds/year, no contributions. */
function fvPrincipal(
	principal: number,
	annualRate: number,
	years: number,
	compoundsPerYear: number,
): number {
	const r = annualRate / compoundsPerYear
	return (
		Math.round(principal * Math.pow(1 + r, years * compoundsPerYear) * 100) /
		100
	)
}

describe('R4 compounding frequency (no contributions)', () => {
	const baseInv = {
		initialInvestment: 10000,
		periodicContribution: 0,
		contributionFrequency: 'monthly',
		expectedAnnualReturn: 12,
		investmentPeriod: 1,
		inflationRate: 0,
	}
	const baseSav = {
		initialSavings: 10000,
		regularContribution: 0,
		contributionFrequency: 'monthly',
		annualInterestRate: 12,
		savingsPeriod: 1,
		targetAmount: 0,
		inflationRate: 0,
	}

	it.each([
		['annually', 1, 11200.0],
		['quarterly', 4, 11255.09],
		['monthly', 12, 11268.25],
	] as const)(
		'investment %s → %s',
		(freq, n, expected) => {
			expect(fvPrincipal(10000, 0.12, 1, n)).toBeCloseTo(expected, 2)
			const result = calculateInvestment({
				...baseInv,
				compoundingFrequency: freq,
			})
			expect(result.finalValue).toBeCloseTo(expected, 2)
			const last = (result.yearlyBreakdown as Array<{ endingValue: number }>)
				.at(-1)!
			expect(last.endingValue).toBe(result.finalValue)
		},
	)

	it.each([
		['annually', 11200.0],
		['quarterly', 11255.09],
		['monthly', 11268.25],
	] as const)('savings %s → %s', (freq, expected) => {
		const result = calculateSavings({
			...baseSav,
			compoundingFrequency: freq,
		})
		expect(result.finalSavings).toBeCloseTo(expected, 2)
		const last = (
			result.yearlyBreakdown as Array<{ endingBalance: number }>
		).at(-1)!
		expect(last.endingBalance).toBe(result.finalSavings)
	})
})

describe('R4 yearly contribution schedule (not smeared monthly)', () => {
	it('10000 @12% monthly compound, 1200 yearly × 2y → 15249.54', () => {
		// Independent calendar: monthly compound, deposit only in month 12
		let balance = 10000
		for (let month = 1; month <= 24; month++) {
			balance *= 1.01
			if (month % 12 === 0) balance += 1200
		}
		const independent = Math.round(balance * 100) / 100
		expect(independent).toBeCloseTo(15249.54, 2)

		const result = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 1200,
			contributionFrequency: 'yearly',
			expectedAnnualReturn: 12,
			investmentPeriod: 2,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
		})
		expect(result.finalValue).toBeCloseTo(15249.54, 2)
		expect(
			(result.yearlyBreakdown as Array<{ endingValue: number }>).at(-1)!
				.endingValue,
		).toBe(result.finalValue)
		// Each year should show exactly one 1200 contribution, not 100/mo smear
		for (const row of result.yearlyBreakdown as Array<{
			contribution: number
		}>) {
			expect(row.contribution).toBeCloseTo(1200, 2)
		}
	})

	it('savings matches the same yearly-contribution calendar', () => {
		const result = calculateSavings({
			initialSavings: 10000,
			regularContribution: 1200,
			contributionFrequency: 'yearly',
			annualInterestRate: 12,
			savingsPeriod: 2,
			compoundingFrequency: 'monthly',
			targetAmount: 0,
			inflationRate: 0,
		})
		expect(result.finalSavings).toBeCloseTo(15249.54, 2)
		expect(
			(result.yearlyBreakdown as Array<{ endingBalance: number }>).at(-1)!
				.endingBalance,
		).toBe(result.finalSavings)
	})
})

describe('R4 monthly contribution regression (prior High fix)', () => {
	it('investment 10k+500/mo @5% ×10y monthly → 94111.23', () => {
		const result = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 500,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 5,
			investmentPeriod: 10,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
		})
		expect(result.finalValue).toBeCloseTo(94111.23, 2)
		expect(
			(result.yearlyBreakdown as Array<{ endingValue: number }>).at(-1)!
				.endingValue,
		).toBe(result.finalValue)
	})
})
