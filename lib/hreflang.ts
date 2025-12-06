import { locales, type Locale } from './i18n'

/**
 * Generate hreflang links for a given path
 * Returns array of alternate language links
 */
export function generateHreflangLinks(path: string): Array<{
	href: string
	hreflang: string
}> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calculator-portal.com'

	// Remove leading locale from path if present
	const pathWithoutLocale = path.replace(/^\/(en|ru|es|tr|hi)/, '')

	return locales.map((locale) => ({
		href: `${baseUrl}/${locale}${pathWithoutLocale}`,
		hreflang: locale,
	}))
}

/**
 * Generate hreflang metadata for Next.js Metadata API
 */
export function generateHreflangMetadata(path: string): {
	alternates: {
		languages: Record<Locale, string>
	}
} {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calculator-portal.com'

	// Remove leading locale from path if present
	const pathWithoutLocale = path.replace(/^\/(en|ru|es|tr|hi)/, '')

	const languages: Record<Locale, string> = {} as Record<Locale, string>

	locales.forEach((locale) => {
		languages[locale] = `${baseUrl}/${locale}${pathWithoutLocale}`
	})

	return {
		alternates: {
			languages,
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

