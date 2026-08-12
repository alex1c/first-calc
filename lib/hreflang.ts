import { locales, type Locale } from './i18n'
import { languageAlternates, localeUrl, stripLocalePrefix } from './site-url'

/**
 * Generate hreflang links for a given path
 * Returns array of alternate language links
 */
export function generateHreflangLinks(path: string): Array<{
	href: string
	hreflang: string
}> {
	const pathWithoutLocale = stripLocalePrefix(path)

	return [...locales.map((locale) => ({
		href: localeUrl(locale, pathWithoutLocale),
		hreflang: locale,
	})), { href: localeUrl('en', pathWithoutLocale), hreflang: 'x-default' }]
}

/**
 * Generate hreflang metadata for Next.js Metadata API
 */
export function generateHreflangMetadata(path: string): {
	alternates: {
		languages: Record<string, string>
	}
} {
	return {
		alternates: {
			languages: languageAlternates(path),
		},
	}
}

/**
 * Language codes mapping for hreflang
 * ISO 639-1 codes
 */
export const hreflangCodes: Record<Locale, string> = {
	en: 'en',
	ru: 'ru',
	es: 'es',
	tr: 'tr',
	hi: 'hi',
}









