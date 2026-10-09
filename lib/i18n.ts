// Supported locales configuration
export const locales = ['en', 'ru', 'es', 'tr', 'hi'] as const

export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = 'en'

/**
 * Type guard for supported calculator/UI locales.
 * Rejects unknown strings so callers cannot silently treat them as English.
 */
export function isLocale(value: unknown): value is Locale {
	return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/**
 * Resolve locale for calculate API requests.
 * Prefer an explicit body.locale (what the calculator form sends), then ?locale=,
 * then the site default. Never coerce an invalid locale to another language.
 */
export function resolveRequestLocale(
	bodyLocale: unknown,
	queryLocale: string | null | undefined,
): Locale {
	if (isLocale(bodyLocale)) {
		return bodyLocale
	}
	if (isLocale(queryLocale)) {
		return queryLocale
	}
	return defaultLocale
}

// Locale names for display
export const localeNames: Record<Locale, string> = {
	en: 'English',
	ru: 'Русский',
	es: 'Español',
	tr: 'Türkçe',
	hi: 'हिन्दी',
}

// Re-export i18n utilities
export { loadNamespaces, clearCache } from './i18n/loadNamespaces'
export { createT } from './i18n/t'
export type {
	Namespace,
	Dictionary,
	MergedDictionary,
	TranslationFunction,
	LoadNamespacesOptions,
} from './i18n/types'





