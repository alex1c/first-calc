// Supported locales configuration
export const locales = ['en', 'ru', 'es', 'tr', 'hi'] as const

export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = 'en'

// Locale names for display
export const localeNames: Record<Locale, string> = {
	en: 'English',
	ru: 'Русский',
	es: 'Español',
	tr: 'Türkçe',
	hi: 'हिन्दी',
}


