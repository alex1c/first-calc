import { describe, expect, it } from 'vitest'
import {
	parseStrictLegacyMoneySegment,
	parseStrictLanguageSuffixedNumber,
	parseStrictMoneyAmount,
	parseStrictNonNegativeNumber,
	PROPISYU_EN_MAX,
	PROPISYU_RU_MAX,
} from '@/lib/propisyu/strict-number'

describe('parseStrictNonNegativeNumber', () => {
	it('accepts integers, decimals, and comma decimals with normalization', () => {
		expect(parseStrictNonNegativeNumber('123')).toMatchObject({
			ok: true,
			value: 123,
			normalized: '123',
			isInteger: true,
		})
		expect(parseStrictNonNegativeNumber('123.45')).toMatchObject({
			ok: true,
			value: 123.45,
			normalized: '123.45',
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

	it('rejects garbage, exponents, signs, and multi-separators', () => {
		expect(parseStrictNonNegativeNumber('1e3').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('1E309').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('12abc').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('1.2.3').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('-1').ok).toBe(false)
		expect(parseStrictNonNegativeNumber('').ok).toBe(false)
	})

	it('enforces language ceilings without inventing success', () => {
		expect(
			parseStrictNonNegativeNumber('999999999', { max: PROPISYU_RU_MAX }).ok,
		).toBe(true)
		expect(
			parseStrictNonNegativeNumber('1000000000', { max: PROPISYU_RU_MAX }).ok,
		).toBe(false)
		expect(
			parseStrictNonNegativeNumber('1000000000', { max: PROPISYU_EN_MAX }).ok,
		).toBe(true)
		expect(
			parseStrictNonNegativeNumber('999999999999', { max: PROPISYU_EN_MAX }).ok,
		).toBe(true)
		expect(
			parseStrictNonNegativeNumber('1000000000000', { max: PROPISYU_EN_MAX }).ok,
		).toBe(false)
	})

	it('rejects money amounts with more than two fractional digits', () => {
		const tooMany = parseStrictMoneyAmount('123.456')
		expect(tooMany.ok).toBe(false)
		if (!tooMany.ok) {
			expect(tooMany.reason).toBe('too-many-fraction-digits')
		}
		expect(parseStrictMoneyAmount('1,50').ok).toBe(true)
	})
})

describe('language suffix and legacy money', () => {
	it('parses 123.45-en and large EN integers within the EN engine ceiling', () => {
		expect(parseStrictLanguageSuffixedNumber('123.45-en')).toMatchObject({
			ok: true,
			value: 123.45,
			language: 'en',
			canonicalSlug: '123.45-en',
		})
		expect(parseStrictLanguageSuffixedNumber('1000000000-en')).toMatchObject({
			ok: true,
			value: 1_000_000_000,
			language: 'en',
		})
		expect(parseStrictLanguageSuffixedNumber('999999999999-en')).toMatchObject({
			ok: true,
			value: PROPISYU_EN_MAX,
			language: 'en',
		})
		expect(parseStrictLanguageSuffixedNumber('1000000000000-en').ok).toBe(false)
	})

	it('rejects legacy money garbage and oversize amounts', () => {
		expect(parseStrictLegacyMoneySegment('555.23-money-rub')).toMatchObject({
			ok: true,
			value: 555.23,
			currency: 'rub',
		})
		expect(parseStrictLegacyMoneySegment('12abc-money-rub').ok).toBe(false)
		expect(parseStrictLegacyMoneySegment('1.2.3-money-rub').ok).toBe(false)
		expect(parseStrictLegacyMoneySegment('1e309-money-rub').ok).toBe(false)
		expect(parseStrictLegacyMoneySegment('1000000000-money-rub').ok).toBe(false)
		expect(parseStrictLegacyMoneySegment('1.234-money-rub').ok).toBe(false)
	})
})
