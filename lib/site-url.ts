import { defaultLocale, locales, type Locale } from '@/lib/i18n'

export const PRODUCTION_ORIGIN = 'https://first-calc.com'

function normalizeOrigin(value: string): string {
	try {
		const url = new URL(value)
		if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
			throw new Error('Site URL must use HTTPS')
		}
		return url.origin
	} catch {
		return PRODUCTION_ORIGIN
	}
}

export function getSiteOrigin(): string {
	return normalizeOrigin(process.env.NEXT_PUBLIC_BASE_URL || PRODUCTION_ORIGIN)
}

export function isIndexingDisabled(): boolean {
	return process.env.NEXT_PUBLIC_ENV === 'test' || process.env.NEXT_PUBLIC_ENV === 'staging'
}

export function stripLocalePrefix(pathname: string): string {
	const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
	const segments = normalized.split('/').filter(Boolean)
	if (segments[0] && locales.includes(segments[0] as Locale)) {
		segments.shift()
	}
	return segments.length ? `/${segments.join('/')}` : '/'
}

export function localePath(locale: Locale, pathname = '/'): string {
	const path = stripLocalePrefix(pathname)
	if (locale === defaultLocale) return path
	return path === '/' ? `/${locale}` : `/${locale}${path}`
}

export function localeUrl(locale: Locale, pathname = '/'): string {
	return new URL(localePath(locale, pathname), `${getSiteOrigin()}/`).toString()
}

export function languageAlternates(
	pathname: string,
	availableLocales: readonly Locale[] = locales,
): Record<string, string> {
	const languages: Record<string, string> = {}
	for (const locale of availableLocales) {
		languages[locale] = localeUrl(locale, pathname)
	}
	// x-default must resolve to an existing language alternate — never point at
	// a missing English URL when the page is only published for other locales.
	const xDefaultLocale = availableLocales.includes(defaultLocale)
		? defaultLocale
		: availableLocales[0] || defaultLocale
	languages['x-default'] = localeUrl(xDefaultLocale, pathname)
	return languages
}

export function localizedContentMetadata(
	locale: Locale,
	pathname: string,
	availableLocales: readonly Locale[],
) {
	const hasLocalizedContent = availableLocales.includes(locale)
	return {
		alternates: {
			canonical: localeUrl(hasLocalizedContent ? locale : defaultLocale, pathname),
			languages: languageAlternates(pathname, availableLocales),
		},
		...(!hasLocalizedContent && { robots: { index: false, follow: true } }),
	}
}
