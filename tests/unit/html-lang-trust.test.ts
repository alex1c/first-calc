import { describe, expect, it } from 'vitest'
import {
	HEADER_HTML_LANG,
	HEADER_ROUTING_LOCALE,
	HEADER_UI_LOCALE,
	parseLocaleHeader,
	stripUntrustedInternalHeaders,
} from '@/lib/request-headers'
import { shouldForceHtmlLangRuForUnprefixedPropisyu } from '@/lib/propisyu/seo-policy'

describe('internal locale/html-lang trust boundary', () => {
	it('strips client-forged internal headers', () => {
		const headers = new Headers()
		headers.set(HEADER_HTML_LANG, 'ru')
		headers.set(HEADER_ROUTING_LOCALE, 'ru')
		headers.set(HEADER_UI_LOCALE, 'ru')
		headers.set('accept-language', 'ru')
		stripUntrustedInternalHeaders(headers)
		expect(headers.get(HEADER_HTML_LANG)).toBeNull()
		expect(headers.get(HEADER_ROUTING_LOCALE)).toBeNull()
		expect(headers.get(HEADER_UI_LOCALE)).toBeNull()
		expect(headers.get('accept-language')).toBe('ru')
	})

	it('only forces html/UI ru for historical unprefixed money/hub shapes', () => {
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('420-00')).toBe(true)
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('0-9999')).toBe(true)
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('bmi-calculator')).toBe(
			false,
		)
		expect(shouldForceHtmlLangRuForUnprefixedPropisyu('123-en')).toBe(false)
	})

	it('parseLocaleHeader falls back safely', () => {
		expect(parseLocaleHeader('ru')).toBe('ru')
		expect(parseLocaleHeader('evil')).toBe('en')
		expect(parseLocaleHeader(null, 'ru')).toBe('ru')
	})
})
