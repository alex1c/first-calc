/**
 * Independent regression coverage for Release Recheck High blockers R1–R4
 * (plus interest-only rounding and formatMoney locale currency).
 */
import { describe, it, expect } from 'vitest'
import { calculateRetirement } from '@/lib/calculations/retirement'
import { calculateMortgage } from '@/lib/calculations/mortgage'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateSavings } from '@/lib/calculations/savings'
import { calculateLoanPayment } from '@/lib/calculations/loan'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { formatMoney } from '@/lib/calculators/format'
import { calculators } from '@/data/calculators'

describe('R1 — retirement rejects invalid age window (no false 200/null)', () => {
	it('throws when currentAge >= retirementAge', () => {
		expect(() =>
			calculateRetirement({
				calculationMode: 'future_balance',
				currentAge: 65,
				retirementAge: 60,
				currentSavings: 10000,
				monthlyContribution: 0,
				annualReturnRate: 5,
				contributionGrowthRate: 0,
				inflationRate: 2.5,
				compoundFrequency: 'monthly',
			}),
		).toThrow(CalculationDomainError)
	})

	it('throws on unknown calculationMode', () => {
		expect(() =>
			calculateRetirement({
				calculationMode: 'not_a_real_mode',
				currentAge: 30,
				retirementAge: 65,
				currentSavings: 10000,
				monthlyContribution: 100,
				annualReturnRate: 5,
				contributionGrowthRate: 0,
				inflationRate: 0,
				compoundFrequency: 'monthly',
			}),
		).toThrow(CalculationDomainError)
	})

	it('returns numeric results for a valid future_balance scenario', () => {
		const result = calculateRetirement({
			calculationMode: 'future_balance',
			currentAge: 30,
			retirementAge: 65,
			currentSavings: 10000,
			monthlyContribution: 100,
			annualReturnRate: 5,
			contributionGrowthRate: 0,
			inflationRate: 0,
			compoundFrequency: 'monthly',
		})
		expect(result.finalBalance).toEqual(expect.any(Number))
		expect(result.finalBalance).toBeGreaterThan(0)
		expect(result.totalContributed).toEqual(expect.any(Number))
		expect(result.totalEarnings).toEqual(expect.any(Number))
	})
})

describe('R2 — formatMoney uses locale currency (not hard-coded $)', () => {
	it('formats RUB for ru and USD for en', () => {
		const ru = formatMoney(1610.46, 'ru')
		const en = formatMoney(1610.46, 'en')
		expect(ru).toMatch(/₽|RUB/)
		expect(ru).not.toMatch(/\$/)
		expect(en).toMatch(/\$|USD/)
	})
})

describe('R3 — mortgage property tax percentage vs amount', () => {
	const base = {
		homePrice: 300000,
		downPayment: 0,
		downPaymentType: 'amount',
		loanTerm: 30,
		interestRate: 5,
		paymentFrequency: 'monthly',
		homeInsurance: 0,
		hoaFees: 0,
		pmiRate: 0,
		extraPayment: 0,
	}

	it('percentage 1% of 300000 → 250/month tax', () => {
		const result = calculateMortgage({
			...base,
			propertyTax: 1,
			propertyTaxType: 'percentage',
		})
		const breakdown = result.paymentBreakdown as {
			taxes: number
			total: number
			principal: number
		}
		expect(breakdown.taxes).toBeCloseTo(250, 2)
		expect(breakdown.total).toBeCloseTo(breakdown.principal + 250, 2)
	})

	it('amount 3600 → 300/month tax', () => {
		const result = calculateMortgage({
			...base,
			propertyTax: 3600,
			propertyTaxType: 'amount',
		})
		const breakdown = result.paymentBreakdown as { taxes: number }
		expect(breakdown.taxes).toBeCloseTo(300, 2)
	})
})

describe('R4 — investment/savings final equals last year-table row', () => {
	it('investment finalValue matches last endingValue (ordinary annuity)', () => {
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
		const breakdown = result.yearlyBreakdown as Array<{ endingValue: number }>
		expect(breakdown).toHaveLength(10)
		expect(breakdown[breakdown.length - 1].endingValue).toBe(result.finalValue)
	})

	it('savings finalSavings matches last endingBalance', () => {
		const result = calculateSavings({
			initialSavings: 5000,
			regularContribution: 200,
			contributionFrequency: 'monthly',
			annualInterestRate: 5,
			savingsPeriod: 10,
			compoundingFrequency: 'monthly',
			targetAmount: 0,
			inflationRate: 0,
		})
		expect(result.finalSavings).toBeCloseTo(39291.5, 2)
		const breakdown = result.yearlyBreakdown as Array<{
			endingBalance: number
		}>
		expect(breakdown).toHaveLength(10)
		expect(breakdown[breakdown.length - 1].endingBalance).toBe(
			result.finalSavings,
		)
	})
})

describe('Interest-only — lifetime interest uses principal × rate × years', () => {
	it('10000 @ 10% × 1y monthly → totalPayment 11000', () => {
		const result = calculateLoanPayment({
			loanAmount: 10000,
			annualInterestRate: 10,
			loanTerm: 1,
			paymentFrequency: 'monthly',
			loanType: 'interest-only',
		})
		expect(result.periodicPayment).toBeCloseTo(83.33, 2)
		expect(result.totalInterest).toBe(1000)
		expect(result.totalPayment).toBe(11000)
	})
})

describe('Advanced finance fields stay off public TS schemas', () => {
	it('investment and savings public inputs omit taxRate/monthlyWithdrawal/interestType', () => {
		for (const id of ['investment-calculator', 'savings-calculator']) {
			const calc = calculators.find((c) => c.id === id)
			expect(calc).toBeTruthy()
			const names = new Set(calc!.inputs.map((i) => i.name))
			expect(names.has('taxRate')).toBe(false)
			expect(names.has('monthlyWithdrawal')).toBe(false)
			expect(names.has('interestType')).toBe(false)
		}
	})
})
