import { describe, expect, it } from 'vitest'
import { parsePropisyuSlug } from '@/lib/propisyu/parse-slug'
import {
	resolvePropisyuSeo,
	shouldForceHtmlLangRuForUnprefixedPropisyu,
} from '@/lib/propisyu/seo-policy'

describe('resolvePropisyuSeo (historical unprefixed primary)', () => {
	it('indexes unprefixed allowlisted money with self-canonical and ru hreflang', () => {
		const parsed = parsePropisyuSlug(['420-00'])
		const seo = resolvePropisyuSeo(parsed, 'en', '/chislo-propisyu/420-00')
		expect(seo.indexable).toBe(true)
		expect(seo.robots).toBe('index, follow')
		expect(seo.contentLanguage).toBe('ru')
		expect(seo.canonicalUrl).toMatch(/\/chislo-propisyu\/420-00$/)
		expect(seo.canonicalUrl).not.toContain('/ru/')
		expect(seo.languages).toMatchObject({
			ru: seo.canonicalUrl,
			'x-default': seo.canonicalUrl,
		})
	})

	it('keeps /ru money reachable but noindex with canonical → unprefixed', () => {
		const parsed = parsePropisyuSlug(['420-00'])
		const seo = resolvePropisyuSeo(parsed, 'ru', '/chislo-propisyu/420-00')
		expect(seo.indexable).toBe(false)
		expect(seo.robots).toBe('noindex, follow')
		expect(seo.canonicalUrl).toMatch(/\/chislo-propisyu\/420-00$/)
		expect(seo.canonicalUrl).not.toContain('/ru/')
	})

	it('indexes unprefixed decade hubs; /ru hubs noindex → unprefixed canonical', () => {
		const parsed = parsePropisyuSlug(['0-9999'])
		const en = resolvePropisyuSeo(parsed, 'en', '/chislo-propisyu/0-9999')
		const ru = resolvePropisyuSeo(parsed, 'ru', '/chislo-propisyu/0-9999')
		expect(en.indexable).toBe(true)
		expect(en.canonicalUrl).toMatch(/\/chislo-propisyu\/0-9999$/)
		expect(ru.indexable).toBe(false)
		expect(ru.canonicalUrl).toBe(en.canonicalUrl)
	})

	it('noindexes incomplete locales', () => {
		const money = parsePropisyuSlug(['420-00'])
		for (const locale of ['es', 'tr', 'hi'] as const) {
			expect(
				resolvePropisyuSeo(money, locale, '/chislo-propisyu/420-00').robots,
			).toBe('noindex, follow')
		}
	})

	it('forces html lang ru for unprefixed money/hubs only', () => {
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('420-00')).toBe(true)
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('0-9999')).toBe(true)
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('123-en')).toBe(false)
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('123.45')).toBe(false)
	})
})
