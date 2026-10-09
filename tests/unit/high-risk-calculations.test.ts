import { describe, expect, it } from 'vitest'
import { calculateMortgage } from '@/lib/calculations/mortgage'
import { calculateAutoLoan } from '@/lib/calculations/auto-loan'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { calculateBMI } from '@/lib/calculations/bmi'
import { calculateBodyFatPercentage } from '@/lib/calculations/body-fat-percentage'
import { calculateElectricalLoad } from '@/lib/calculations/electrical-load'
import { calculateRebar } from '@/lib/calculations/rebar'
import { calculateCement } from '@/lib/calculations/cement'
import { calculateDateCalculator } from '@/lib/calculations/date-calculator'

describe('risk-prioritized calculator behavior', () => {
	it('mortgage-calculator uses the canonical amortization example and rejects zero principal', () => {
		const result = calculateMortgage({ homePrice: 300000, downPayment: 60000, loanTerm: 30, interestRate: 4.5, paymentFrequency: 'monthly' })
		expect(result.loanAmount).toBe(240000)
		expect(result.monthlyMortgagePayment).toBeCloseTo(1216.04, 2)
		expect(() =>
			calculateMortgage({ homePrice: 0, loanTerm: 30, interestRate: 4.5 }),
		).toThrow(CalculationDomainError)
	})

	it('auto-loan-calculator rounds a known loan and rejects negative values', () => {
		const result = calculateAutoLoan({ vehiclePrice: 30000, downPayment: 5000, tradeInValue: 0, salesTaxRate: 0, annualInterestRate: 6, loanTerm: 5 })
		expect(result.loanAmount).toBe(25000)
		expect(result.monthlyPayment).toBeCloseTo(483.32, 2)
		expect(() =>
			calculateAutoLoan({ vehiclePrice: -1, annualInterestRate: 6, loanTerm: 5 }),
		).toThrow(CalculationDomainError)
	})

	it('bmi-calculator handles metric/imperial units and zero height', () => {
		expect(calculateBMI({ weight: 70, weightUnit: 'kg', height: 175, heightUnit: 'cm' }).bmi).toBe(22.9)
		expect(calculateBMI({ weight: 154.324, weightUnit: 'lb', height: 68.8976, heightUnit: 'in' }).bmi).toBeCloseTo(22.9, 1)
		expect(calculateBMI({ weight: 70, height: 0 }).bmi).toBeNull()
	})

	it('body-fat-percentage-calculator returns finite estimates and rejects invalid geometry', () => {
		const result = calculateBodyFatPercentage({ sex: 'male', age: 35, weight: 80, weightUnit: 'kg', height: 180, heightUnit: 'cm', waistCircumference: 85, waistUnit: 'cm', neckCircumference: 40, neckUnit: 'cm' })
		expect(Number.isFinite(result.bodyFatPercentage as number)).toBe(true)
		expect(() => calculateBodyFatPercentage({ sex: 'male', age: 35, weight: 80, height: 0, waistCircumference: 0 })).toThrow(/height/i)
	})

	it('electrical-load-calculator applies demand factor and validates boundaries', () => {
		const result = calculateElectricalLoad({ appliances: 'heater:2000:2,light:100:5', demandFactor: 80 })
		expect(result.totalRawPower).toBe(4.5)
		expect(result.adjustedPower).toBe(3.6)
		expect(() => calculateElectricalLoad({ appliances: 'heater:2000:1', demandFactor: 101 })).toThrow(/between 0 and 100/)
	})

	it('rebar-calculator preserves units, waste rounding and invalid-input errors', () => {
		const result = calculateRebar({ slabLength: 5, slabWidth: 4, spacing: 200, barDiameter: 12, layers: 1, edgeAllowance: 50, includeWaste: true, wasteMargin: 5 })
		expect(result.totalLength).toBeGreaterThan(0)
		expect(result.totalWeightWithWaste as number).toBeGreaterThan(result.totalWeight as number)
		expect(() => calculateRebar({ slabLength: 0, slabWidth: 4 })).toThrow(/length/i)
	})

	it('cement-calculator calculates canonical 1:2:4 mix and rejects empty volume', () => {
		const result = calculateCement({ concreteVolume: 1, mixRatio: '1:2:4', cementBagWeight: 50, unit: 'meters', includeWaste: false })
		expect(result.cementWeight).toBeCloseTo(205.71, 2)
		expect(result.cementBags).toBe(5)
		expect(() => calculateCement({ concreteVolume: 0, mixRatio: '1:2:4' })).toThrow(/volume/i)
	})

	it('date-calculator crosses leap day and rejects malformed dates', () => {
		const result = calculateDateCalculator({ startDate: '2024-02-28', numberOfDays: 1, operation: 'add' })
		expect(result.resultDate).toBe('2024-02-29')
		expect(() => calculateDateCalculator({ startDate: 'not-a-date', numberOfDays: 1, operation: 'add' })).toThrow()
	})
})
