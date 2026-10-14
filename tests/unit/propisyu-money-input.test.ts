import { describe, expect, it } from 'vitest'
import {
	isValidMoneyFractionalInput,
	moneyFractionalDigitCount,
	validatePropisyuFormInput,
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

	it('rejects empty, negative, exponent, and non-numeric input', () => {
		expect(isValidMoneyFractionalInput('')).toBe(false)
		expect(isValidMoneyFractionalInput('-1')).toBe(false)
		expect(isValidMoneyFractionalInput('1e3')).toBe(false)
		expect(isValidMoneyFractionalInput('abc')).toBe(false)
		expect(moneyFractionalDigitCount('')).toBe(null)
	})

	it('builds normalized URL segments shared with the router', () => {
		expect(
			validatePropisyuFormInput('1,50', { format: 'money', language: 'ru' }),
		).toEqual({
			ok: true,
			normalized: '1.50',
			urlSegment: '1-50',
		})
		expect(
			validatePropisyuFormInput('00021.05', {
				format: 'numeric',
				language: 'en',
			}),
		).toEqual({
			ok: true,
			normalized: '21.05',
			urlSegment: '21.05-en',
		})
		expect(
			validatePropisyuFormInput('123.456', {
				format: 'money',
				language: 'ru',
			}).ok,
		).toBe(false)
		expect(
			validatePropisyuFormInput('1e3', {
				format: 'numeric',
				language: 'ru',
			}).ok,
		).toBe(false)
	})
})
