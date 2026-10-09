/**
 * @vitest-environment node
 *
 * B3.3: legacy dynamic routes must not advertise empty es/tr/hi hreflang,
 * and the sitemap must omit noindex-only historical example URLs.
 */
import { describe, expect, it } from 'vitest'
import { languageAlternates, localeUrl } from '@/lib/site-url'
import { legacyTools } from '@/lib/tools/registry'
import { buildSitemapEntries } from '@/app/sitemap'

const LEGACY_EN_RU_ONLY = [
	'roman-numerals-converter',
	'numbers-to-words',
	'percentage-of-a-number',
	'add-subtract-percentage',
	'root-calculator',
	'chislo-propisyu',
] as const

describe('B3.3 legacy hreflang availability', () => {
	it('limits legacy dynamic alternates to en/ru with absolute canonical URLs', () => {
		for (const slug of LEGACY_EN_RU_ONLY) {
			const pathname = `/${slug}/123`
			const alternates = languageAlternates(pathname, ['en', 'ru'])
			expect(Object.keys(alternates).sort()).toEqual(
				['en', 'ru', 'x-default'].sort(),
			)
			expect(alternates.en).toBe(localeUrl('en', pathname))
			expect(alternates.ru).toBe(localeUrl('ru', pathname))
			expect(alternates['x-default']).toBe(localeUrl('en', pathname))
			expect(alternates).not.toHaveProperty('es')
			expect(alternates).not.toHaveProperty('tr')
			expect(alternates).not.toHaveProperty('hi')
		}
	})

	it('keeps English canonical without /en prefix', () => {
		expect(localeUrl('en', '/roman-numerals-converter/IV')).toBe(
			'https://first-calc.com/roman-numerals-converter/IV',
		)
		expect(localeUrl('ru', '/roman-numerals-converter/IV')).toBe(
			'https://first-calc.com/ru/roman-numerals-converter/IV',
		)
	})
})

describe('B3.3 sitemap excludes noindex-only historical routes', () => {
	it('registers only slug-backed legacy landings (not range/factors examples)', () => {
		const slugTools = legacyTools.filter((tool) => tool.slug)
		const exampleOnly = legacyTools.filter((tool) => !tool.slug)

		expect(slugTools.map((t) => t.path)).toEqual(
			expect.arrayContaining([
				'/numbers-to-words',
				'/chislo-propisyu',
				'/roman-numerals-converter',
				'/percentage-of-a-number',
				'/add-subtract-percentage',
				'/root-calculator',
			]),
		)
		expect(exampleOnly.map((t) => t.path)).toEqual(
			expect.arrayContaining([
				'/range/1-100',
				'/factors/360',
				'/number-format/in/1234567',
			]),
		)
	})

	it('does not include noindex historical example URLs in sitemap entries', async () => {
		const previousEnv = process.env.NEXT_PUBLIC_ENV
		const previousBase = process.env.NEXT_PUBLIC_BASE_URL
		process.env.NEXT_PUBLIC_ENV = 'production'
		process.env.NEXT_PUBLIC_BASE_URL = 'https://first-calc.com'

		try {
			const entries = await buildSitemapEntries()
			const urls = entries.map((entry) => entry.url)

			expect(urls).toContain('https://first-calc.com/chislo-propisyu')
			expect(urls).toContain('https://first-calc.com/ru/chislo-propisyu')
			expect(urls).toContain('https://first-calc.com/numbers-to-words')
			expect(urls).toContain('https://first-calc.com/roman-numerals-converter')

			// Dynamic noindex-only historical routes must stay out of the sitemap.
			expect(urls.some((url) => url.includes('/range/'))).toBe(false)
			expect(urls.some((url) => /\/factors\/\d+/.test(url))).toBe(false)
			expect(urls.some((url) => url.includes('/number-format/in/'))).toBe(
				false,
			)
		} finally {
			if (previousEnv === undefined) delete process.env.NEXT_PUBLIC_ENV
			else process.env.NEXT_PUBLIC_ENV = previousEnv
			if (previousBase === undefined) delete process.env.NEXT_PUBLIC_BASE_URL
			else process.env.NEXT_PUBLIC_BASE_URL = previousBase
		}
	})
})
