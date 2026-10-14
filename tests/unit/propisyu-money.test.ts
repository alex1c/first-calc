import { describe, expect, it } from 'vitest'
import {
	buildMoneyCopyVariants,
	buildMoneySeoH1,
	buildMoneySeoTitle,
	calculateIncludedVat,
	kopeckNoun,
	moneyAmountFromParts,
	numberToWordsRuKopecks,
	rubleNoun,
} from '@/lib/propisyu/money'
import { isMoneySlugIndexable } from '@/lib/propisyu/seo-allowlist'

describe('propisyu money grammar and VAT', () => {
	it('declines рубль / копейка correctly', () => {
		expect(rubleNoun(0)).toBe('рублей')
		expect(rubleNoun(1)).toBe('рубль')
		expect(rubleNoun(2)).toBe('рубля')
		expect(rubleNoun(5)).toBe('рублей')
		expect(rubleNoun(11)).toBe('рублей')
		expect(rubleNoun(21)).toBe('рубль')
		expect(kopeckNoun(0)).toBe('копеек')
		expect(kopeckNoun(1)).toBe('копейка')
		expect(kopeckNoun(2)).toBe('копейки')
		expect(kopeckNoun(5)).toBe('копеек')
		expect(numberToWordsRuKopecks(1)).toBe('одна')
		expect(numberToWordsRuKopecks(2)).toBe('две')
	})

	it('matches archived VAT for 5788-00 (964.67)', () => {
		const amount = moneyAmountFromParts(5788, 0)
		const vat = calculateIncludedVat(amount.totalKopecks)
		expect(vat.vatDisplay).toBe('964.67')
	})

	it('matches archived VAT for 199-00 (33.17)', () => {
		const amount = moneyAmountFromParts(199, 0)
		const vat = calculateIncludedVat(amount.totalKopecks)
		expect(vat.vatDisplay).toBe('33.17')
	})

	it('builds archive-style SEO title and seven copy variants', () => {
		const amount = moneyAmountFromParts(199, 0)
		expect(buildMoneySeoTitle(amount)).toBe(
			'199 прописью, сто девяносто девять рублей ноль копеек',
		)
		expect(buildMoneySeoH1(amount)).toContain('199')
		const variants = buildMoneyCopyVariants(amount)
		expect(variants).toHaveLength(7)
		expect(variants[0].text).toBe(
			'сто девяносто девять рублей ноль копеек',
		)
		expect(variants[1].text.startsWith('Сто')).toBe(true)
		expect(variants[2].text).toContain('00 копеек')
		expect(variants[3].text).toContain('НДС (20%)')
		expect(variants[4].text).toContain('тридцать три рубля')
		expect(variants[5].text.startsWith('199 руб.')).toBe(true)
		expect(variants[6].text).toContain('НДС (20%)')
	})

	it('handles zero and fractional kopecks in variants', () => {
		const zero = buildMoneyCopyVariants(moneyAmountFromParts(0, 0))
		expect(zero[0].text).toContain('ноль рублей ноль копеек')
		const withKop = buildMoneyCopyVariants(moneyAmountFromParts(1, 1))
		expect(withKop[0].text).toContain('один рубль одна копейка')
		expect(withKop[2].text).toContain('01 копейка')
	})

	it('indexes only allowlisted money slugs', () => {
		expect(isMoneySlugIndexable('420-00')).toBe(true)
		expect(isMoneySlugIndexable('7500-00')).toBe(true)
		expect(isMoneySlugIndexable('123-00')).toBe(false)
	})
})
