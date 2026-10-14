import { describe, expect, it } from 'vitest'
import {
	isValidMoneyFractionalInput,
	moneyFractionalDigitCount,
} from '@/lib/propisyu/money-input'

describe('propisyu money input validation', () => {
	it('accepts up to two fractional digits (dot or comma)', () => {
		expect(isValidMoneyFractionalInput('1')).toBe(true)
		expect(isValidMoneyFractionalInput('1.5')).toBe(true)
		expect(isValidMoneyFractionalInput('1.50')).toBe(true)
		expect(isValidMoneyFractionalInput('1,50')).toBe(true)
		expect(isValidMoneyFractionalInput('00021.05')).toBe(true)
		expect(moneyFractionalDigitCount('1,50')).toBe(2)
		expect(moneyFractionalDigitCount('21')).toBe(0)
	})

	it('rejects more than two fractional digits instead of truncating', () => {
		expect(isValidMoneyFractionalInput('123.456')).toBe(false)
		expect(moneyFractionalDigitCount('123.456')).toBe(3)
	})

	it('rejects empty, negative, and non-numeric input', () => {
		expect(isValidMoneyFractionalInput('')).toBe(false)
		expect(isValidMoneyFractionalInput('-1')).toBe(false)
		expect(isValidMoneyFractionalInput('abc')).toBe(false)
		expect(moneyFractionalDigitCount('')).toBe(null)
	})
})
