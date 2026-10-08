import { describe, expect, it } from 'vitest'
import { calculateGcd } from '@/lib/calculations/gcd'
import { calculateLcm } from '@/lib/calculations/lcm'
import { calculateAreaCircle } from '@/lib/calculations/area-circle'
import { calculateInflationAdjustment } from '@/lib/calculations/inflation-adjustment'
import { executeFormula } from '@/lib/calculators/schema'

describe('restored orphan calculator engines', () => {
	it('computes GCD with Euclidean algorithm', () => {
		expect(calculateGcd({ a: 48, b: 18 }).result).toBe(6)
		expect(calculateGcd({ a: 100, b: 25 }).result).toBe(25)
		expect(calculateGcd({ a: 0, b: 10 }).result).toBeNull()
	})

	it('computes LCM from GCD', () => {
		expect(calculateLcm({ a: 12, b: 18 }).result).toBe(36)
		expect(calculateLcm({ a: 7, b: 3 }).result).toBe(21)
	})

	it('computes circle area and circumference', () => {
		const result = calculateAreaCircle({ radius: 5 })
		expect(result.area).toBeCloseTo(Math.PI * 25, 8)
		expect(result.circumference).toBeCloseTo(10 * Math.PI, 8)
	})

	it('adjusts amounts for inflation across years', () => {
		const result = calculateInflationAdjustment({
			amount: 1000,
			startYear: 2000,
			endYear: 2001,
			inflationRate: 10,
		})
		expect(result.adjustedAmount).toBeCloseTo(1100, 8)
		expect(result.totalInflation).toBeCloseTo(10, 8)
	})

	it('supports restored single-output formulas', () => {
		expect(executeFormula('Math.cbrt(number)', { number: 27 })).toBe(3)
		expect(executeFormula('Math.pow(base, exponent)', { base: 2, exponent: 8 })).toBe(256)
		expect(
			executeFormula('Math.log(number) / Math.log(base)', {
				number: 100,
				base: 10,
			}),
		).toBeCloseTo(2, 10)
		expect(executeFormula('length * width', { length: 4, width: 3 })).toBe(12)
	})
})
