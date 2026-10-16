import { describe, expect, it } from 'vitest'
import {
	isFaithfulNumberRepresentation,
	isWithinExactWholeMax,
	parseStrictLegacyMoneySegment,
	parseStrictLanguageSuffixedNumber,
	parseStrictMoneyAmount,
	parseStrictNonNegativeNumber,
	PROPISYU_EN_MAX,
	PROPISYU_MAX_FRACTION_DIGITS_NUMERIC,
	PROPISYU_RU_MAX,
} from '@/lib/propisyu/strict-number'

describe('exact decimal-string precision policy', () => {
	it('rejects sub-Number and rounded-away fractions instead of changing them', () => {
		// 7 fractional digits exceeds the documented numeric cap (6) and would
		// otherwise collapse to 0 under Number — reject, never rewrite.
		const tiny = parseStrictNonNegativeNumber('0.0000001')
		expect(tiny.ok).toBe(false)
		if (!tiny.ok) {
			expect(['too-many-fraction-digits', 'not-faithful-precision']).toContain(
				tiny.reason,
			)
		}

		const almostOne = parseStrictLanguageSuffixedNumber(
			'0.99999999999999999999-en',
		)
		expect(almostOne.ok).toBe(false)

		// Whole at RU max with any non-zero fraction → out-of-range (exact
		// string compare). Also reject over-long fractions without accepting.
		const overRu = parseStrictNonNegativeNumber('999999999.01', {
			maxWhole: PROPISYU_RU_MAX,
		})
		expect(overRu.ok).toBe(false)
		if (!overRu.ok) expect(overRu.reason).toBe('out-of-range')

		const overRuLongFrac = parseStrictNonNegativeNumber(
			'999999999.00000001',
			{ maxWhole: PROPISYU_RU_MAX },
		)
		expect(overRuLongFrac.ok).toBe(false)

		const longFrac = parseStrictNonNegativeNumber('0.12345678912345678')
		expect(longFrac.ok).toBe(false)
		if (!longFrac.ok) expect(longFrac.reason).toBe('too-many-fraction-digits')
	})

	it('accepts exact values within documented limits', () => {
		expect(PROPISYU_MAX_FRACTION_DIGITS_NUMERIC).toBe(6)
		expect(parseStrictNonNegativeNumber('0.000001')).toMatchObject({
			ok: true,
			normalized: '0.000001',
		})
		expect(parseStrictNonNegativeNumber('123.456789')).toMatchObject({
			ok: true,
			normalized: '123.456789',
		})
		expect(
			parseStrictNonNegativeNumber('999999999', { maxWhole: PROPISYU_RU_MAX })
				.ok,
		).toBe(true)
		expect(
			parseStrictNonNegativeNumber('1000000000', { maxWhole: PROPISYU_RU_MAX })
				.ok,
		).toBe(false)
	})

	it('compares magnitude with exact string semantics', () => {
		expect(isWithinExactWholeMax('999999999', null, PROPISYU_RU_MAX)).toBe(true)
		expect(
			isWithinExactWholeMax('999999999', '00000001', PROPISYU_RU_MAX),
		).toBe(false)
		expect(
			isWithinExactWholeMax('999999999', '99', PROPISYU_RU_MAX, true),
		).toBe(true)
		expect(isWithinExactWholeMax('1000000000', null, PROPISYU_RU_MAX)).toBe(
			false,
		)
		expect(
			isFaithfulNumberRepresentation('0', '0000001', Number('0.0000001')),
		).toBe(false)
		// Must not discard extra digits from Number when comparing.
		expect(isFaithfulNumberRepresentation('1', '23', 1.234)).toBe(false)
	})

	it('accepts RU money ceiling with kopecks (999999999.99)', () => {
		expect(
			parseStrictMoneyAmount('999999999.99', PROPISYU_RU_MAX),
		).toMatchObject({ ok: true, normalized: '999999999.99' })
		expect(
			parseStrictMoneyAmount('1000000000.00', PROPISYU_RU_MAX).ok,
		).toBe(false)
		expect(
			parseStrictMoneyAmount('1000000000', PROPISYU_RU_MAX).ok,
		).toBe(false)
	})
})

describe('parseStrictNonNegativeNumber basics', () => {
	it('accepts integers, decimals, and comma decimals with normalization', () => {
		expect(parseStrictNonNegativeNumber('123')).toMatchObject({
			ok: true,
			value: 123,
			normalized: '123',
			isInteger: true,
		})
		expect(parseStrictNonNegativeNumber('1,50')).toMatchObject({
			ok: true,
			value: 1.5,
			normalized: '1.50',
		})
		expect(parseStrictNonNegativeNumber('00021.05')).toMatchObject({
			ok: true,
			value: 21.05,
			normalized: '21.05',
		})
	})

	it('rejects garbage and exponents', () => {
		expect(parseStrictNonNegativeNumber('1e3').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('12abc').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('1.2.3').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('-1').ok).toBe(false)
	})
})

describe('language suffix and legacy money ceilings', () => {
	it('uses EN ceiling for -en and USD legacy money', () => {
		expect(parseStrictLanguageSuffixedNumber('1000000000-en')).toMatchObject({
			ok: true,
			value: 1_000_000_000,
		})
		expect(parseStrictLanguageSuffixedNumber('999999999999-en')).toMatchObject({
			ok: true,
			value: PROPISYU_EN_MAX,
		})
		expect(parseStrictLegacyMoneySegment('1000000000-money-usd')).toMatchObject({
			ok: true,
			currency: 'usd',
		})
		expect(parseStrictLegacyMoneySegment('1000000000-money-rub').ok).toBe(false)
		expect(parseStrictMoneyAmount('1,50', PROPISYU_RU_MAX).ok).toBe(true)
	})
})
