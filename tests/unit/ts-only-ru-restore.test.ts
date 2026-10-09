/**
 * @vitest-environment node
 *
 * Ten TS-only RU calculators must resolve via the shared registry engines.
 */
import { describe, expect, it } from 'vitest'
import { getCalculatorBySlug } from '@/lib/calculators/loader'
import { hasLocalizedCalculatorContent } from '@/lib/i18n/content-availability'
import { calculateAddPercentage } from '@/lib/calculations/add-percentage'
import { calculateSubtractPercentage } from '@/lib/calculations/subtract-percentage'

const TEN_TS_ONLY_RU: Array<{ category: string; slug: string }> = [
	{ category: 'math', slug: 'percentage-of-a-number' },
	{ category: 'math', slug: 'add-percentage' },
	{ category: 'math', slug: 'subtract-percentage' },
	{ category: 'finance', slug: 'loan-payment' },
	{ category: 'compatibility', slug: 'love-compatibility' },
	{ category: 'compatibility', slug: 'zodiac-compatibility' },
	{ category: 'compatibility', slug: 'numerology-compatibility' },
	{ category: 'compatibility', slug: 'friendship-compatibility' },
	{ category: 'compatibility', slug: 'work-compatibility' },
	{ category: 'compatibility', slug: 'birth-date-compatibility' },
]

describe('TS-only RU calculator restore', () => {
	it('marks all ten as localized RU content', () => {
		for (const { slug } of TEN_TS_ONLY_RU) {
			expect(hasLocalizedCalculatorContent('ru', slug), slug).toBe(true)
		}
	})

	it('resolves all ten via getCalculatorBySlug with RU titles', async () => {
		for (const { category, slug } of TEN_TS_ONLY_RU) {
			const calc = await getCalculatorBySlug(category, slug, 'ru')
			expect(calc, `${category}/${slug}`).toBeDefined()
			expect(calc!.locale).toBe('ru')
			expect(calc!.contentLocale).toBe('ru')
			expect(/[А-Яа-яЁё]/.test(calc!.title), `${slug} title`).toBe(true)
			expect(typeof calc!.calculate).toBe('function')
		}
	})

	it('reuses shared percentage engines without formula drift', () => {
		expect(calculateAddPercentage({ value: 100, percent: 20 }).result).toBe(120)
		expect(calculateSubtractPercentage({ value: 100, percent: 20 }).result).toBe(80)
	})

	it('resolves numbers-to-words schema by slug for EN and RU', async () => {
		const en = await getCalculatorBySlug('everyday', 'numbers-to-words', 'en')
		const ru = await getCalculatorBySlug('everyday', 'numbers-to-words', 'ru')
		expect(en?.id).toBe('numbers-to-words')
		expect(ru?.id).toBe('numbers-to-words')
		expect(ru?.locale).toBe('ru')
	})
})
