import { describe, expect, it } from 'vitest'
import { parsePropisyuSlug } from '@/lib/propisyu/parse-slug'
import { DECADE_HUBS, PROPISYU_DECADE_COUNT } from '@/lib/propisyu/decades'

describe('parsePropisyuSlug', () => {
	it('parses plain integers without parseFloat range confusion', () => {
		expect(parsePropisyuSlug(['0'])).toEqual({
			kind: 'plain-number',
			value: 0,
		})
		expect(parsePropisyuSlug(['101'])).toEqual({
			kind: 'plain-number',
			value: 101,
		})
		expect(parsePropisyuSlug(['999999'])).toEqual({
			kind: 'plain-number',
			value: 999999,
		})
	})

	it('parses language suffixes on plain numbers', () => {
		expect(parsePropisyuSlug(['21-en'])).toEqual({
			kind: 'plain-number',
			value: 21,
			language: 'en',
		})
	})

	it('parses historical money N-KK with exactly two kopeck digits', () => {
		expect(parsePropisyuSlug(['0-00'])).toMatchObject({
			kind: 'money',
			rubles: 0,
			kopecks: 0,
			totalKopecks: 0,
			canonicalSlug: '0-00',
		})
		expect(parsePropisyuSlug(['1-01'])).toMatchObject({
			kind: 'money',
			rubles: 1,
			kopecks: 1,
			canonicalSlug: '1-01',
		})
		expect(parsePropisyuSlug(['199-00'])).toMatchObject({
			kind: 'money',
			rubles: 199,
			kopecks: 0,
		})
		expect(parsePropisyuSlug(['420-00'])).toMatchObject({
			kind: 'money',
			rubles: 420,
			kopecks: 0,
		})
		expect(parsePropisyuSlug(['7500-00'])).toMatchObject({
			kind: 'money',
			rubles: 7500,
			kopecks: 0,
		})
		expect(parsePropisyuSlug(['34482-00'])).toMatchObject({
			kind: 'money',
			rubles: 34482,
			kopecks: 0,
		})
		expect(parsePropisyuSlug(['27093-00'])).toMatchObject({
			kind: 'money',
			rubles: 27093,
			kopecks: 0,
		})
		expect(parsePropisyuSlug(['11-11'])).toMatchObject({
			kind: 'money',
			rubles: 11,
			kopecks: 11,
		})
	})

	it('treats 0-9999 as a decade hub, never as number 0', () => {
		const parsed = parsePropisyuSlug(['0-9999'])
		expect(parsed.kind).toBe('decade-hub')
		if (parsed.kind === 'decade-hub') {
			expect(parsed.start).toBe(0)
			expect(parsed.end).toBe(9999)
		}
	})

	it('recognizes all 100 historical decade hubs', () => {
		expect(DECADE_HUBS).toHaveLength(PROPISYU_DECADE_COUNT)
		for (const hub of DECADE_HUBS) {
			const parsed = parsePropisyuSlug([hub.slug])
			expect(parsed.kind).toBe('decade-hub')
		}
		const last = parsePropisyuSlug(['990000-999999'])
		expect(last).toMatchObject({
			kind: 'decade-hub',
			start: 990000,
			end: 999999,
		})
	})

	it('classifies non-decade multi-digit ranges as small-range', () => {
		expect(parsePropisyuSlug(['100-199'])).toEqual({
			kind: 'small-range',
			start: 100,
			end: 199,
		})
	})

	it('rejects inverted ranges and bad kopeck shapes', () => {
		expect(parsePropisyuSlug(['199-100']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['12-5']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['12-005']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['-5']).kind).toBe('invalid')
		expect(parsePropisyuSlug(['abc']).kind).toBe('invalid')
	})

	it('keeps legacy -money-currency segments distinct', () => {
		expect(parsePropisyuSlug(['555.23-money-usd']).kind).toBe(
			'legacy-money-currency',
		)
	})
})
