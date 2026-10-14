import { describe, expect, it } from 'vitest'
import { parsePropisyuSlug } from '@/lib/propisyu/parse-slug'
import { resolvePropisyuSeo } from '@/lib/propisyu/seo-policy'

describe('resolvePropisyuSeo', () => {
	it('indexes Russian money on /ru with self-canonical and ru hreflang only', () => {
		const parsed = parsePropisyuSlug(['420-00'])
		const seo = resolvePropisyuSeo(parsed, 'ru', '/chislo-propisyu/420-00')
		expect(seo.indexable).toBe(true)
		expect(seo.robots).toBe('index, follow')
		expect(seo.contentLanguage).toBe('ru')
		expect(seo.canonicalUrl).toContain('/ru/chislo-propisyu/420-00')
		expect(seo.hreflangLocales).toEqual(['ru'])
	})

	it('keeps unprefixed money reachable but noindex with self-canonical', () => {
		const parsed = parsePropisyuSlug(['420-00'])
		const seo = resolvePropisyuSeo(parsed, 'en', '/chislo-propisyu/420-00')
		expect(seo.indexable).toBe(false)
		expect(seo.robots).toBe('noindex, follow')
		expect(seo.contentLanguage).toBe('ru')
		expect(seo.canonicalUrl).toMatch(/\/chislo-propisyu\/420-00$/)
		expect(seo.canonicalUrl).not.toContain('/ru/')
	})

	it('indexes Russian decade hubs on /ru only', () => {
		const parsed = parsePropisyuSlug(['0-9999'])
		const ru = resolvePropisyuSeo(parsed, 'ru', '/chislo-propisyu/0-9999')
		const en = resolvePropisyuSeo(parsed, 'en', '/chislo-propisyu/0-9999')
		expect(ru.indexable).toBe(true)
		expect(ru.canonicalUrl).toContain('/ru/chislo-propisyu/0-9999')
		expect(en.indexable).toBe(false)
		expect(en.canonicalUrl).not.toContain('/ru/')
	})

	it('noindexes incomplete locales for money and hubs', () => {
		const money = parsePropisyuSlug(['420-00'])
		const hub = parsePropisyuSlug(['0-9999'])
		for (const locale of ['es', 'tr', 'hi'] as const) {
			expect(resolvePropisyuSeo(money, locale, '/chislo-propisyu/420-00').robots).toBe(
				'noindex, follow',
			)
			expect(resolvePropisyuSeo(hub, locale, '/chislo-propisyu/0-9999').robots).toBe(
				'noindex, follow',
			)
		}
	})

	it('keeps plain -en self-canonical without claiming Russian money SEO', () => {
		const parsed = parsePropisyuSlug(['123-en'])
		const seo = resolvePropisyuSeo(parsed, 'en', '/chislo-propisyu/123-en')
		expect(seo.contentLanguage).toBe('en')
		expect(seo.canonicalUrl).toMatch(/\/chislo-propisyu\/123-en$/)
		expect(seo.robots).toBe('noindex, follow')
	})
})
