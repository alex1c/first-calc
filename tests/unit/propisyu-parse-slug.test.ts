import { describe, expect, it } from 'vitest'
import { parsePropisyuSlug } from '@/lib/propisyu/parse-slug'
import {
	DECADE_HUBS,
	PROPISYU_DECADE_COUNT,
	PROPISYU_DECADE_MAX,
} from '@/lib/propisyu/decades'

describe('parsePropisyuSlug', () => {
	it('parses plain integers without parseFloat range confusion', () => {
		expect(parsePropisyuSlug(['0'])).toEqual({
			kind: 'plain-number',
			value: 0,
			isInteger: true,
			canonicalSlug: '0',
		})
		expect(parsePropisyuSlug(['101'])).toEqual({
			kind: 'plain-number',
			value: 101,
			isInteger: true,
			canonicalSlug: '101',
		})
		expect(parsePropisyuSlug(['999999'])).toEqual({
			kind: 'plain-number',
			value: 999999,
			isInteger: true,
			canonicalSlug: '999999',
		})
	})

	it('parses converter-range RU integers and decimals', () => {
		expect(parsePropisyuSlug(['1000000'])).toMatchObject({
			kind: 'plain-number',
			value: 1_000_000,
			canonicalSlug: '1000000',
		})
		expect(parsePropisyuSlug(['999999999'])).toMatchObject({
			kind: 'plain-number',
			value: 999_999_999,
		})
		expect(parsePropisyuSlug(['1000000000']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['123.45'])).toMatchObject({
			kind: 'plain-number',
			value: 123.45,
			canonicalSlug: '123.45',
			isInteger: false,
		})
		expect(parsePropisyuSlug(['0.01'])).toMatchObject({
			kind: 'plain-number',
			value: 0.01,
		})
	})

	it('parses EN language suffixes with EN converter ceiling', () => {
		expect(parsePropisyuSlug(['123.45-en'])).toMatchObject({
			kind: 'plain-number',
			value: 123.45,
			language: 'en',
			canonicalSlug: '123.45-en',
		})
		expect(parsePropisyuSlug(['1000000000-en'])).toMatchObject({
			kind: 'plain-number',
			value: 1_000_000_000,
			language: 'en',
		})
		expect(parsePropisyuSlug(['999999999999-en'])).toMatchObject({
			kind: 'plain-number',
			value: 999_999_999_999,
			language: 'en',
		})
		expect(parsePropisyuSlug(['1000000000000-en']).kind).toBe('invalid')
	})

	it('rejects exponent and trailing garbage on plain URLs', () => {
		expect(parsePropisyuSlug(['1e3']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['12abc']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['1.2.3']).kind).toBe('invalid')
	})

	it('parses historical money and keeps decade hubs distinct', () => {
		expect(parsePropisyuSlug(['420-00'])).toMatchObject({
			kind: 'money',
			rubles: 420,
			kopecks: 0,
		})
		expect(parsePropisyuSlug(['21-21'])).toMatchObject({
			kind: 'money',
			rubles: 21,
			kopecks: 21,
		})
		expect(parsePropisyuSlug(['0-9999'])).toMatchObject({
			kind: 'decade-hub',
			start: 0,
			end: 9999,
		})
		expect(PROPISYU_DECADE_MAX).toBe(999_999)
		expect(DECADE_HUBS).toHaveLength(PROPISYU_DECADE_COUNT)
		for (const hub of DECADE_HUBS) {
			expect(parsePropisyuSlug([hub.slug]).kind).toBe('decade-hub')
		}
	})

	it('rejects malformed legacy money instead of partial parse', () => {
		expect(parsePropisyuSlug(['12abc-money-rub']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['1.2.3-money-rub']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['1e309-money-rub']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['1000000000-money-rub']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['555.23-money-usd'])).toMatchObject({
			kind: 'legacy-money-currency',
			value: 555.23,
			currency: 'usd',
		})
	})

	it('classifies non-decade ranges and rejects inverted ones', () => {
		expect(parsePropisyuSlug(['100-199'])).toEqual({
			kind: 'small-range',
			start: 100,
			end: 199,
		})
		expect(parsePropisyuSlug(['199-100']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['12-5']).kind).toBe('invalid')
	})
})
