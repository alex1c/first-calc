/**
 * Final release blockers: limited-locale SEO containment, RU percentages,
 * and EN informational self-canonicals.
 */
import { describe, expect, it } from 'vitest'
import { formatOutputValue } from '@/lib/calculators/format'
import { primaryLocalePageMetadata } from '@/lib/seo/limited-locale-metadata'
import { PRIMARY_CONTENT_LOCALES } from '@/lib/i18n/content-availability'
import { localeUrl } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'

const LIMITED: Locale[] = ['es', 'tr', 'hi']
const ROUTE_GROUPS = [
	'/chislo-propisyu',
	'/percentage-of-a-number',
	'/add-subtract-percentage',
	'/learn',
	'/standards',
] as const

describe('limited locale indexation containment (5 routes × 3 locales)', () => {
	it.each(
		LIMITED.flatMap((locale) =>
			ROUTE_GROUPS.map((pathname) => [locale, pathname] as const),
		),
	)('%s %s → noindex + EN canonical + en/ru hreflang only', (locale, pathname) => {
		const meta = primaryLocalePageMetadata(locale, pathname)
		expect(meta.robots).toEqual({ index: false, follow: true })
		expect(meta.alternates?.canonical).toBe(localeUrl('en', pathname))
		const languages = meta.alternates?.languages || {}
		expect(Object.keys(languages).sort()).toEqual(
			['en', 'ru', 'x-default'].sort(),
		)
		expect(languages).not.toHaveProperty('es')
		expect(languages).not.toHaveProperty('tr')
		expect(languages).not.toHaveProperty('hi')
	})

	it('keeps EN/RU indexable with self-canonical on primary routes', () => {
		for (const locale of PRIMARY_CONTENT_LOCALES) {
			for (const pathname of ROUTE_GROUPS) {
				const meta = primaryLocalePageMetadata(locale, pathname)
				expect(meta.robots).toBeUndefined()
				expect(meta.alternates?.canonical).toBe(localeUrl(locale, pathname))
			}
		}
	})
})

describe('RU percentage formatting', () => {
	it('uses decimal comma for ru and point for en', () => {
		const ru = formatOutputValue(5.73, 'percentage', undefined, 'ru')
		const en = formatOutputValue(5.73, 'percentage', undefined, 'en')
		expect(ru).toBe('5,73%')
		expect(en).toBe('5.73%')
		expect(ru).not.toMatch(/\./)
	})
})

describe('EN informational self-canonical', () => {
	it.each(['/about', '/privacy', '/terms', '/disclaimer', '/contact'] as const)(
		'%s EN is indexable with self-canonical',
		(pathname) => {
			const meta = primaryLocalePageMetadata('en', pathname, ['en'])
			expect(meta.robots).toBeUndefined()
			expect(meta.alternates?.canonical).toBe(localeUrl('en', pathname))
			expect(meta.alternates?.languages).toEqual({
				en: localeUrl('en', pathname),
				'x-default': localeUrl('en', pathname),
			})
		},
	)
})
