import type { Locale } from '@/lib/i18n'

const DIACRITIC_REGEX = /[\u0300-\u036f]/g

export function normalizeText(value: string = ''): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(DIACRITIC_REGEX, '')
		.replace(/[^a-z0-9\u0400-\u04FF\s-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

export function tokenize(text: string): string[] {
	return normalizeText(text)
		.split(/\s+/)
		.filter((token) => token.length > 0)
}

export function buildLocalizedPath(locale: Locale, path: string): string {
	if (!path.startsWith('/')) {
		path = `/${path}`
	}
	if (locale === 'en') {
		return path
	}
	return `/${locale}${path}`
}

