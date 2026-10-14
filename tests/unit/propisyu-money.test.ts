import { describe, expect, it } from 'vitest'
import {
	buildMoneyCopyVariants,
	buildMoneySeoH1,
	buildMoneySeoTitle,
	calculateIncludedVat,
	formatMoneyAmountComma,
	kopeckNoun,
	moneyAmountFromParts,
	numberToWordsRuKopecks,
	numberToWordsRuRubles,
	rubleNoun,
} from '@/lib/propisyu/money'
import {
	isMoneySlugIndexable,
} from '@/lib/propisyu/seo-allowlist'
import { isPropisyuIndexableLocale } from '@/lib/propisyu/decades'

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

	it('uses feminine forms for kopecks 21/22 and related endings', () => {
		const cases: Array<[number, string]> = [
			[1, 'одна'],
			[2, 'две'],
			[11, 'одиннадцать'],
			[12, 'двенадцать'],
			[21, 'двадцать одна'],
			[22, 'двадцать две'],
			[31, 'тридцать одна'],
			[32, 'тридцать две'],
			[41, 'сорок одна'],
			[42, 'сорок две'],
			[51, 'пятьдесят одна'],
			[52, 'пятьдесят две'],
			[71, 'семьдесят одна'],
			[72, 'семьдесят две'],
			[91, 'девяносто одна'],
			[92, 'девяносто две'],
		]
		for (const [n, words] of cases) {
			expect(numberToWordsRuKopecks(n)).toBe(words)
		}
		// Masculine ruble forms must stay intact.
		expect(numberToWordsRuRubles(21)).toBe('двадцать один')
		expect(numberToWordsRuRubles(22)).toBe('двадцать два')
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
		expect(variants[5].text.startsWith('199,00 руб.')).toBe(true)
		expect(variants[6].text).toContain('НДС (20%)')
	})

	it('keeps numeric and verbal amounts aligned when copying kopecks', () => {
		const samples: Array<[number, number, string]> = [
			[0, 1, '0,01'],
			[1, 0, '1,00'],
			[1, 50, '1,50'],
			[21, 21, '21,21'],
			[199, 99, '199,99'],
			[5788, 0, '5788,00'],
		]
		for (const [rubles, kopecks, display] of samples) {
			const amount = moneyAmountFromParts(rubles, kopecks)
			expect(formatMoneyAmountComma(amount)).toBe(display)
			const variants = buildMoneyCopyVariants(amount)
			expect(variants[5].text.startsWith(`${display} руб.`)).toBe(true)
			expect(variants[6].text.startsWith(`${display} руб.`)).toBe(true)
			expect(variants[5].text).toContain(variants[0].text)
		}
		const oneFifty = buildMoneyCopyVariants(moneyAmountFromParts(1, 50))
		expect(oneFifty[0].text).toBe('один рубль пятьдесят копеек')
		expect(oneFifty[5].text.startsWith('1,50 руб. (один рубль пятьдесят копеек)')).toBe(
			true,
		)
	})

	it('handles zero and fractional kopecks in variants', () => {
		const zero = buildMoneyCopyVariants(moneyAmountFromParts(0, 0))
		expect(zero[0].text).toContain('ноль рублей ноль копеек')
		const withKop = buildMoneyCopyVariants(moneyAmountFromParts(1, 1))
		expect(withKop[0].text).toContain('один рубль одна копейка')
		expect(withKop[2].text).toContain('01 копейка')
	})

	it('indexes only allowlisted money slugs on supported locales', () => {
		expect(isMoneySlugIndexable('420-00')).toBe(true)
		expect(isMoneySlugIndexable('7500-00')).toBe(true)
		expect(isMoneySlugIndexable('123-00')).toBe(false)
		expect(isPropisyuIndexableLocale('en')).toBe(true)
		expect(isPropisyuIndexableLocale('ru')).toBe(true)
		expect(isPropisyuIndexableLocale('es')).toBe(false)
		expect(isPropisyuIndexableLocale('tr')).toBe(false)
		expect(isPropisyuIndexableLocale('hi')).toBe(false)
	})
})
