import type { Locale } from '@/lib/i18n'

const DIACRITIC_REGEX = /[\u0300-\u036f]/g

/**
 * Normalize text for search matching.
 *
 * Lowercases, strips diacritics, removes punctuation except spaces/dashes, and
 * collapses whitespace to support forgiving matching across locales.
 */
export function normalizeText(value: string = ''): string {
        return value
                .toLowerCase()
                .normalize('NFD')
		.replace(DIACRITIC_REGEX, '')
		.replace(/[^a-z0-9\u0400-\u04FF\s-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

/**
 * Split text into normalized tokens, removing empty entries.
 */
export function tokenize(text: string): string[] {
        return normalizeText(text)
                .split(/\s+/)
                .filter((token) => token.length > 0)
}

/**
 * Prefix a path with locale (except for default English) to build links in search results.
 */
export function buildLocalizedPath(locale: Locale, path: string): string {
        if (!path.startsWith('/')) {
                path = `/${path}`
        }
	if (locale === 'en') {
		return path
	}
	return `/${locale}${path}`
}



