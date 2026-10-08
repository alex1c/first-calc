import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import {
	calculatorContentLocales,
	diagnoseCalculatorContentAvailability,
	filterLocalizedCalculators,
	hasLocalizedCalculatorContent,
} from '@/lib/i18n/content-availability'
import { legacyTools } from '@/lib/tools/registry'
import { localeUrl } from '@/lib/site-url'

const root = process.cwd()

function loadEnabledSchemas() {
	const dir = path.join(root, 'data', 'calculators')
	return readdirSync(dir)
		.filter((file) => file.endsWith('.json') && !file.includes('.ru.json'))
		.map((file) =>
			JSON.parse(readFileSync(path.join(dir, file), 'utf8')),
		)
		.filter((schema) => schema.isEnabled !== false)
}

function hasCyrillic(value: string): boolean {
	return /[А-Яа-яЁё]/.test(value)
}

describe('Russian catalog recovery', () => {
	const enabled = loadEnabledSchemas()

	it('has a Russian item file for every enabled calculator slug', () => {
		const missing = enabled
			.map((schema) => schema.slug)
			.filter(
				(slug) =>
					!existsSync(
						path.join(
							root,
							'locales',
							'ru',
							'calculators',
							'items',
							`${slug}.json`,
						),
					),
			)
		expect(missing, `Missing RU items: ${missing.join(', ')}`).toEqual([])
	})

	it('exposes restored orphans and TS-backed RU pages as localized', () => {
		for (const slug of [
			'gcd',
			'lcm',
			'logarithm',
			'exponent',
			'cube-root',
			'area-circle',
			'area-rectangle',
			'inflation-adjustment',
			'percentage-of-a-number',
			'loan-payment',
		]) {
			expect(hasLocalizedCalculatorContent('ru', slug)).toBe(true)
			expect(calculatorContentLocales(slug)).toContain('ru')
			const diagnostic = diagnoseCalculatorContentAvailability('ru', slug)
			expect(diagnostic.isAvailable).toBe(true)
			expect(diagnostic.source).not.toBe('none')
		}
	})

	it('keeps English fallback pages out of the RU catalog filter', () => {
		const filtered = filterLocalizedCalculators(
			[{ slug: 'mortgage-calculator' }, { slug: 'nonexistent-slug-xyz' }],
			'ru',
		)
		// mortgage must have a RU item after recovery; nonexistent stays out
		expect(filtered.map((item) => item.slug)).toEqual(['mortgage-calculator'])
	})

	it('uses Russian titles/H1 source strings without English UI leftovers', () => {
		const englishUi = /\b(Click Calculate|Enter values|Result:)\b/
		for (const schema of enabled) {
			const itemPath = path.join(
				root,
				'locales',
				'ru',
				'calculators',
				'items',
				`${schema.slug}.json`,
			)
			const item = JSON.parse(readFileSync(itemPath, 'utf8'))
			expect(hasCyrillic(item.title), schema.slug).toBe(true)
			expect(hasCyrillic(item.shortDescription), schema.slug).toBe(true)
			expect(englishUi.test(JSON.stringify(item)), schema.slug).toBe(false)
		}
	})

	it('builds indexable RU sitemap URLs for every enabled localized calculator', () => {
		const previous = process.env.NEXT_PUBLIC_SITE_URL
		process.env.NEXT_PUBLIC_SITE_URL = 'https://first-calc.com'
		try {
			const ruCalculatorUrls = enabled
				.filter((schema) =>
					hasLocalizedCalculatorContent('ru', schema.slug),
				)
				.map((schema) =>
					localeUrl(
						'ru',
						`/calculators/${schema.category}/${schema.slug}`,
					),
				)

			expect(ruCalculatorUrls).toHaveLength(enabled.length)
			expect(ruCalculatorUrls).toContain(
				'https://first-calc.com/ru/calculators/math/gcd',
			)
			expect(ruCalculatorUrls).toContain(
				'https://first-calc.com/ru/calculators/geometry/area-circle',
			)
			expect(ruCalculatorUrls).toContain(
				'https://first-calc.com/ru/calculators/finance/mortgage-calculator',
			)

			// Legacy tools remain registered with stable paths.
			const legacyPaths = legacyTools.map((tool) => tool.path)
			expect(legacyPaths).toContain('/chislo-propisyu')
			expect(legacyPaths).toContain('/numbers-to-words')
			expect(legacyPaths).toContain('/roman-numerals-converter')
			expect(localeUrl('en', '/chislo-propisyu')).toBe(
				'https://first-calc.com/chislo-propisyu',
			)
			expect(localeUrl('ru', '/chislo-propisyu')).toBe(
				'https://first-calc.com/ru/chislo-propisyu',
			)
		} finally {
			if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
			else process.env.NEXT_PUBLIC_SITE_URL = previous
		}
	})
})
