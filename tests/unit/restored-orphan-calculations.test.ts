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
		expect(() => calculateGcd({ a: 0, b: 10 })).toThrow(/positive integer/)
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

	it('supports restored single-output formulas and function engines', async () => {
		expect(executeFormula('Math.cbrt(number)', { number: 27 })).toBe(3)
		const { calculateExponent } = await import('@/lib/calculations/exponent')
		const { calculateLogarithm } = await import('@/lib/calculations/logarithm')
		const { calculateAreaRectangle } = await import(
			'@/lib/calculations/area-rectangle'
		)
		expect(calculateExponent({ base: 2, exponent: 8 }).result).toBe(256)
		expect(calculateLogarithm({ number: 100, base: 10 }).result).toBeCloseTo(2, 10)
		expect(calculateAreaRectangle({ length: 4, width: 3 }).result).toBe(12)
	})
})
