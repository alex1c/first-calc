import { describe, expect, it } from 'vitest'
import {
	isValidMoneyFractionalInput,
	validatePropisyuFormInput,
} from '@/lib/propisyu/money-input'

describe('propisyu form/URL parity', () => {
	it('routes RU money to historical N-KK and EN money to USD legacy', () => {
		expect(
			validatePropisyuFormInput('1,50', {
				format: 'money',
				language: 'ru',
				tool: 'chislo-propisyu',
			}),
		).toEqual({
			ok: true,
			normalized: '1.50',
			urlSegment: '1-50',
		})
		expect(
			validatePropisyuFormInput('1.50', {
				format: 'money',
				language: 'en',
				tool: 'chislo-propisyu',
			}),
		).toEqual({
			ok: true,
			normalized: '1.50',
			urlSegment: '1.50-money-usd',
		})
	})

	it('applies language-specific money ceilings', () => {
		expect(
			validatePropisyuFormInput('999999999', {
				format: 'money',
				language: 'ru',
				tool: 'chislo-propisyu',
			}).ok,
		).toBe(true)
		expect(
			validatePropisyuFormInput('999999999.99', {
				format: 'money',
				language: 'ru',
				tool: 'chislo-propisyu',
			}),
		).toEqual({
			ok: true,
			normalized: '999999999.99',
			urlSegment: '999999999-99',
		})
		expect(
			validatePropisyuFormInput('1000000000', {
				format: 'money',
				language: 'ru',
				tool: 'chislo-propisyu',
			}).ok,
		).toBe(false)
		expect(
			validatePropisyuFormInput('1000000000.00', {
				format: 'money',
				language: 'ru',
				tool: 'chislo-propisyu',
			}).ok,
		).toBe(false)
		expect(
			validatePropisyuFormInput('1000000000', {
				format: 'money',
				language: 'en',
				tool: 'chislo-propisyu',
			}).ok,
		).toBe(true)
		expect(
			validatePropisyuFormInput('999999999999', {
				format: 'money',
				language: 'en',
				tool: 'chislo-propisyu',
			}).ok,
		).toBe(true)
		expect(
			validatePropisyuFormInput('1000000000000', {
				format: 'money',
				language: 'en',
				tool: 'chislo-propisyu',
			}).ok,
		).toBe(false)
	})

	it('rejects money/numeric precision violations without silent change', () => {
		expect(isValidMoneyFractionalInput('123.456')).toBe(false)
		expect(
			validatePropisyuFormInput('0.12345678912345678', {
				format: 'numeric',
				language: 'ru',
			}).ok,
		).toBe(false)
		expect(
			validatePropisyuFormInput('0.0000001', {
				format: 'numeric',
				language: 'en',
			}).ok,
		).toBe(false)
		expect(
			validatePropisyuFormInput('00021.05', {
				format: 'numeric',
				language: 'en',
				tool: 'chislo-propisyu',
			}),
		).toEqual({
			ok: true,
			normalized: '21.05',
			urlSegment: '21.05-en',
		})
	})
})
