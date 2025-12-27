import { describe, it, expect } from 'vitest'
import { executeFormula } from '@/lib/calculators/schema'

describe('executeFormula', () => {
	it('should execute simple addition', () => {
		const result = executeFormula('a + b', { a: 5, b: 3 })
		expect(result).toBe(8)
	})

	it('should execute multiplication', () => {
		const result = executeFormula('width * height', { width: 10, height: 5 })
		expect(result).toBe(50)
	})

	it('should execute division', () => {
		const result = executeFormula('total / count', { total: 100, count: 4 })
		expect(result).toBe(25)
	})

	it('should execute subtraction', () => {
		const result = executeFormula('max - min', { max: 100, min: 30 })
		expect(result).toBe(70)
	})

	it('should handle Math functions', () => {
		const result = executeFormula('Math.round(value)', { value: 3.7 })
		expect(result).toBe(4)
	})

	it('should handle Math.PI', () => {
		// Use Math.PI directly since eval doesn't have access to context
		const result = executeFormula('radius * 2 * Math.PI', { radius: 5 })
		expect(result).toBeCloseTo(31.416, 2)
	})

	it('should handle exponentiation', () => {
		const result = executeFormula('base ** power', { base: 2, power: 3 })
		expect(result).toBe(8)
	})

	it('should handle complex expressions', () => {
		const result = executeFormula('(a + b) * c', { a: 2, b: 3, c: 4 })
		expect(result).toBe(20)
	})

	it('should throw error for invalid result', () => {
		expect(() => {
			executeFormula('1 / 0', {})
		}).toThrow('Formula result is not a valid number')
	})

	it('should throw error for invalid expression', () => {
		expect(() => {
			executeFormula('invalid syntax {', {})
		}).toThrow('Formula evaluation failed')
	})
})

