/**
 * Independent financial-model regressions for mixed contribution/compounding.
 * Expected values are derived inline (no import of finance-cashflow helpers).
 */
import { describe, it, expect } from 'vitest'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateSavings } from '@/lib/calculations/savings'
import { formatMoney, formatYearsCount } from '@/lib/calculators/format'

/**
 * Independent reference: monthly principal accrual r/12, capitalize only on
 * boundary months, then end-of-month contribution (ordinary).
 */
function independentProject(options: {
	initial: number
	contribution: number
	contribPerYear: number
	compoundsPerYear: number
	annualRate: number
	years: number
}): number {
	const compoundMonths =
		options.compoundsPerYear <= 1
			? new Set([12])
			: options.compoundsPerYear === 4
				? new Set([3, 6, 9, 12])
				: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
	const contribMonths =
		options.contribPerYear <= 1
			? new Set([12])
			: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
	const monthlyShare = options.annualRate / 12
	let principal = options.initial
	let accrued = 0
	for (let year = 1; year <= options.years; year++) {
		for (let month = 1; month <= 12; month++) {
			accrued += principal * monthlyShare
			if (compoundMonths.has(month)) {
				principal += accrued
				accrued = 0
			}
			if (contribMonths.has(month)) {
				principal += options.contribution
			}
		}
	}
	return Math.round((principal + accrued) * 100) / 100
}

describe('mixed frequency: annual compound + monthly contributions', () => {
	it('0 start, 100/mo, 12%, annual compound, 1y → 1266 (not 1332)', () => {
		// Each deposit sits only for remaining months: interest =
		// sum_{k=0}^{11} 100*(0.12/12)*k = 66; total = 1200+66 = 1266
		let interest = 0
		for (let monthsHeld = 0; monthsHeld <= 11; monthsHeld++) {
			interest += 100 * (0.12 / 12) * monthsHeld
		}
		expect(Math.round((1200 + interest) * 100) / 100).toBe(1266)

		const expected = independentProject({
			initial: 0,
			contribution: 100,
			contribPerYear: 12,
			compoundsPerYear: 1,
			annualRate: 0.12,
			years: 1,
		})
		expect(expected).toBe(1266)

		for (const calc of [
			() =>
				calculateInvestment({
					initialInvestment: 0,
					periodicContribution: 100,
					contributionFrequency: 'monthly',
					expectedAnnualReturn: 12,
					investmentPeriod: 1,
					compoundingFrequency: 'annually',
					inflationRate: 0,
				}).finalValue,
			() =>
				calculateSavings({
					initialSavings: 0,
					regularContribution: 100,
					contributionFrequency: 'monthly',
					annualInterestRate: 12,
					savingsPeriod: 1,
					compoundingFrequency: 'annually',
					targetAmount: 0,
					inflationRate: 0,
				}).finalSavings,
		]) {
			const value = calc()
			expect(value).toBe(1266)
			expect(value).not.toBe(1332)
		}
	})
})

describe('compounding without contributions (preserved controls)', () => {
	it.each([
		['annually', 1, 11200],
		['quarterly', 4, 11255.09],
		['monthly', 12, 11268.25],
	] as const)('%s → %s', (freq, n, expected) => {
		const closed =
			Math.round(10000 * Math.pow(1 + 0.12 / n, n) * 100) / 100
		expect(closed).toBeCloseTo(expected, 2)
		expect(
			independentProject({
				initial: 10000,
				contribution: 0,
				contribPerYear: 12,
				compoundsPerYear: n,
				annualRate: 0.12,
				years: 1,
			}),
		).toBeCloseTo(expected, 2)

		const inv = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 0,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 12,
			investmentPeriod: 1,
			compoundingFrequency: freq,
			inflationRate: 0,
		})
		expect(inv.finalValue).toBeCloseTo(expected, 2)
		expect(
			(inv.yearlyBreakdown as Array<{ endingValue: number }>).at(-1)!
				.endingValue,
		).toBe(inv.finalValue)

		const sav = calculateSavings({
			initialSavings: 10000,
			regularContribution: 0,
			contributionFrequency: 'monthly',
			annualInterestRate: 12,
			savingsPeriod: 1,
			compoundingFrequency: freq,
			targetAmount: 0,
			inflationRate: 0,
		})
		expect(sav.finalSavings).toBeCloseTo(expected, 2)
	})
})

describe('other frequency mixes', () => {
	it('quarterly compound + monthly contributions, 1y', () => {
		const expected = independentProject({
			initial: 0,
			contribution: 100,
			contribPerYear: 12,
			compoundsPerYear: 4,
			annualRate: 0.12,
			years: 1,
		})
		const inv = calculateInvestment({
			initialInvestment: 0,
			periodicContribution: 100,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 12,
			investmentPeriod: 1,
			compoundingFrequency: 'quarterly',
			inflationRate: 0,
		})
		expect(inv.finalValue).toBe(expected)
		expect(
			(inv.yearlyBreakdown as Array<{ endingValue: number }>).at(-1)!
				.endingValue,
		).toBe(inv.finalValue)
	})

	it('monthly compound + annual contribution 1200 × 2y → 15249.54', () => {
		const expected = independentProject({
			initial: 10000,
			contribution: 1200,
			contribPerYear: 1,
			compoundsPerYear: 12,
			annualRate: 0.12,
			years: 2,
		})
		expect(expected).toBeCloseTo(15249.54, 2)
		const inv = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 1200,
			contributionFrequency: 'yearly',
			expectedAnnualReturn: 12,
			investmentPeriod: 2,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
		})
		expect(inv.finalValue).toBeCloseTo(15249.54, 2)
	})

	it('annual compound + annual contribution', () => {
		// Year1: accrue 1200 on 10000 → capitalize → +1200 = 12400
		// Year2: accrue 1488 on 12400 → capitalize → +1200 = 15088
		const expected = independentProject({
			initial: 10000,
			contribution: 1200,
			contribPerYear: 1,
			compoundsPerYear: 1,
			annualRate: 0.12,
			years: 2,
		})
		expect(expected).toBe(15088)
		expect(
			calculateInvestment({
				initialInvestment: 10000,
				periodicContribution: 1200,
				contributionFrequency: 'yearly',
				expectedAnnualReturn: 12,
				investmentPeriod: 2,
				compoundingFrequency: 'annually',
				inflationRate: 0,
			}).finalValue,
		).toBe(expected)
	})

	it('zero interest: contributions sum only', () => {
		const inv = calculateInvestment({
			initialInvestment: 1000,
			periodicContribution: 100,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 0,
			investmentPeriod: 1,
			compoundingFrequency: 'annually',
			inflationRate: 0,
		})
		expect(inv.finalValue).toBe(2200)
	})

	it('monthly 10y path preserved (94111.23)', () => {
		const inv = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 500,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 5,
			investmentPeriod: 10,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
		})
		expect(inv.finalValue).toBeCloseTo(94111.23, 2)
	})
})

describe('RU money and years formatting', () => {
	it('formatMoney(ru) uses spaced thousands / decimal comma, not 94,111.23', () => {
		const s = formatMoney(94111.23, 'ru')
		expect(s).toMatch(/94[\s\u00a0]111/)
		expect(s).not.toMatch(/94,111\.23/)
		expect(s).toMatch(/₽|RUB/)
	})

	it('formatYearsCount(ru) declines год/года/лет', () => {
		expect(formatYearsCount(1, 'ru')).toBe('1 год')
		expect(formatYearsCount(2, 'ru')).toBe('2 года')
		expect(formatYearsCount(5, 'ru')).toBe('5 лет')
		expect(formatYearsCount(30, 'ru')).toBe('30 лет')
		expect(formatYearsCount(5, 'en')).toBe('5 years')
	})
})
