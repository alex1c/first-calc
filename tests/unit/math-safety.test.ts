/**
 * @vitest-environment node
 *
 * Codex B2.2 math-safety cases: no fake fallbacks, domain errors, overflow.
 */
import { describe, expect, it } from 'vitest'
import { executeFormula } from '@/lib/calculators/schema'
import { assertFiniteResults } from '@/lib/calculations/result-safety'
import { calculateLogarithm } from '@/lib/calculations/logarithm'
import { calculateExponent } from '@/lib/calculations/exponent'
import { calculateAreaRectangle } from '@/lib/calculations/area-rectangle'
import { calculateAreaCircle } from '@/lib/calculations/area-circle'
import { calculateGcd } from '@/lib/calculations/gcd'
import { calculateLcm } from '@/lib/calculations/lcm'
import { calculateInflationAdjustment } from '@/lib/calculations/inflation-adjustment'
import { POST } from '@/app/api/calculators/[id]/calculate/route'

describe('assertFiniteResults', () => {
	it('accepts nested finite numbers and rejects Infinity/NaN leaves', () => {
		expect(() =>
			assertFiniteResults({ a: 1, nested: { b: [2, 3] } }),
		).not.toThrow()
		expect(() => assertFiniteResults({ value: Infinity })).toThrow(/non-finite/)
		expect(() => assertFiniteResults({ rows: [{ x: NaN }] })).toThrow(/non-finite/)
	})
})

describe('executeFormula — no silent fake results', () => {
	it('throws on division by zero instead of returning Infinity', () => {
		expect(() => executeFormula('1 / 0', {})).toThrow(/not a valid number/)
	})

	it('throws on overflow products', () => {
		expect(() =>
			executeFormula('length * width', { length: 1e308, width: 10 }),
		).toThrow(/not a valid number/)
	})
})

describe('logarithm domain', () => {
	it('computes log10(100)', () => {
		expect(calculateLogarithm({ number: 100, base: 10 }).result).toBeCloseTo(2, 10)
	})

	it('rejects base 1', () => {
		expect(() => calculateLogarithm({ number: 100, base: 1 })).toThrow(/base/)
	})

	it('rejects non-positive argument', () => {
		expect(() => calculateLogarithm({ number: 0, base: 10 })).toThrow(/argument/)
	})
})

describe('exponent domain', () => {
	it('computes 2^8', () => {
		expect(calculateExponent({ base: 2, exponent: 8 }).result).toBe(256)
	})

	it('rejects negative base with fractional exponent', () => {
		expect(() => calculateExponent({ base: -2, exponent: 0.5 })).toThrow(/fractional/)
	})

	it('rejects 0^-1', () => {
		expect(() => calculateExponent({ base: 0, exponent: -1 })).toThrow(/zero/i)
	})

	it('rejects overflow', () => {
		expect(() => calculateExponent({ base: 10, exponent: 1000 })).toThrow(/overflow/i)
	})
})

describe('area overflow', () => {
	it('rejects rectangle product overflow', () => {
		expect(() =>
			calculateAreaRectangle({ length: 1e308, width: 10 }),
		).toThrow(/overflow/i)
	})

	it('rejects circle area overflow', () => {
		expect(() => calculateAreaCircle({ radius: 1e308 })).toThrow(/overflow/i)
	})

	it('computes finite rectangle and circle areas', () => {
		expect(calculateAreaRectangle({ length: 4, width: 3 }).result).toBe(12)
		expect(calculateAreaCircle({ radius: 5 }).area).toBeCloseTo(Math.PI * 25, 8)
	})
})

describe('gcd and lcm integers', () => {
	it('computes known pairs', () => {
		expect(calculateGcd({ a: 48, b: 18 }).result).toBe(6)
		expect(calculateLcm({ a: 12, b: 18 }).result).toBe(36)
	})

	it('rejects fractional inputs', () => {
		expect(() => calculateGcd({ a: 4.5, b: 3 })).toThrow(/integer/)
		expect(() => calculateLcm({ a: 12, b: 3.2 })).toThrow(/integer/)
	})

	it('rejects LCM overflow of large integers', () => {
		expect(() =>
			calculateLcm({ a: Number.MAX_SAFE_INTEGER, b: Number.MAX_SAFE_INTEGER - 1 }),
		).toThrow(/safe integer/i)
	})
})

describe('inflation-adjustment direction and overflow', () => {
	it('inflates forward and deflates backward', () => {
		const forward = calculateInflationAdjustment({
			amount: 1000,
			startYear: 2000,
			endYear: 2001,
			inflationRate: 10,
		})
		expect(forward.adjustedAmount).toBeCloseTo(1100, 8)

		const backward = calculateInflationAdjustment({
			amount: 1100,
			startYear: 2001,
			endYear: 2000,
			inflationRate: 10,
		})
		expect(backward.adjustedAmount).toBeCloseTo(1000, 8)
	})

	it('rejects overflow from extreme rates/years', () => {
		expect(() =>
			calculateInflationAdjustment({
				amount: 1e300,
				startYear: 1900,
				endYear: 2100,
				inflationRate: 100,
			}),
		).toThrow(/overflow/i)
	})
})

describe('POST calculate API — no false numeric success', () => {
	it('returns an error status for logarithm base 1 (not 200 with a fake number)', async () => {
		const request = new Request(
			'http://localhost:3000/api/calculators/logarithm/calculate?locale=en',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					locale: 'en',
					inputs: { number: 100, base: 1 },
				}),
			},
		)
		const response = await POST(request, { params: { id: 'logarithm' } })
		const data = await response.json()
		expect(response.status).not.toBe(200)
		expect(data.results?.result).not.toBe(100)
		expect(String(data.error || '')).toMatch(/base/i)
	})

	it('applies schema defaultValues server-side when inputs are omitted', async () => {
		const request = new Request(
			'http://localhost:3000/api/calculators/area-rectangle/calculate?locale=en',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					locale: 'en',
					inputs: {},
				}),
			},
		)
		const response = await POST(request, { params: { id: 'area-rectangle' } })
		const data = await response.json()
		// B3.1: server merges defaultValue (length=4, width=3) before calculate
		expect(response.status).toBe(200)
		expect(data.results.result).toBe(12)
	})
})
