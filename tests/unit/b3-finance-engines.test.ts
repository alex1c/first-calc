import { describe, expect, it } from 'vitest'
import { calculateMortgage } from '@/lib/calculations/mortgage'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateROI } from '@/lib/calculations/roi'
import { calculateDifferentiatedPayment } from '@/lib/calculations/payment-types'
import { CalculationDomainError } from '@/lib/calculations/domain-error'

describe('B3.1 finance engine scenarios', () => {
	it('mortgage: loanAmount is principal (down payment not subtracted)', () => {
		const result = calculateMortgage({
			loanAmount: 300000,
			downPayment: 60000,
			interestRate: 4.5,
			loanTerm: 30,
			paymentFrequency: 'monthly',
		})
		expect(result.loanAmount).toBe(300000)
		expect(result.monthlyPayment).toBeCloseTo(1520.06, 2)
	})

	it('mortgage: homePrice path subtracts down payment', () => {
		const result = calculateMortgage({
			homePrice: 300000,
			downPayment: 60000,
			interestRate: 4.5,
			loanTerm: 30,
		})
		expect(result.loanAmount).toBe(240000)
		expect(result.monthlyPayment).toBeCloseTo(1216.04, 2)
	})

	it('mortgage PMI when equity is below threshold', () => {
		const result = calculateMortgage({
			loanAmount: 300000,
			downPayment: 30000,
			interestRate: 4.5,
			loanTerm: 30,
			pmiRate: 1,
			pmiThreshold: 20,
		})
		expect(result.pmiPayment).toBeGreaterThan(0)
		expect(result.pmiMonths).toBeGreaterThan(0)
	})

	it('investment simple vs compound produce different final values', () => {
		const base = {
			initialInvestment: 10000,
			monthlyContribution: 100,
			interestRate: 7,
			investmentPeriod: 10,
		}
		const compound = calculateInvestment({
			...base,
			interestType: 'compound',
		})
		const simple = calculateInvestment({
			...base,
			interestType: 'simple',
		})
		expect(compound.finalValue).toBeGreaterThan(simple.finalValue as number)
	})

	it('ROI CAGR for 10000 → 15000 over 2 years', () => {
		const result = calculateROI({
			investmentCost: 10000,
			returnValue: 15000,
			timePeriod: 2,
			timeUnit: 'years',
		})
		expect(result.cagr).toBeCloseTo(22.47, 1)
		expect(result.annualizedROI).toBeCloseTo(result.cagr as number, 2)
	})

	it('differentiated first payment exceeds last payment', () => {
		const schedule = calculateDifferentiatedPayment(200000, 6, 60, 12)
		expect(schedule.firstPayment).toBeGreaterThan(schedule.lastPayment)
	})

	it('mortgage rejects invalid home price via domain error', () => {
		expect(() =>
			calculateMortgage({ homePrice: 0, loanTerm: 30, interestRate: 4.5 }),
		).toThrow(CalculationDomainError)
	})
})
