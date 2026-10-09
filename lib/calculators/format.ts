/**
 * Formatting utilities for calculator outputs
 * Client-side formatting functions
 */

const LOCALE_CURRENCY: Record<string, { locale: string; currency: string }> = {
	en: { locale: 'en-US', currency: 'USD' },
	ru: { locale: 'ru-RU', currency: 'RUB' },
	es: { locale: 'es-ES', currency: 'EUR' },
	tr: { locale: 'tr-TR', currency: 'TRY' },
	hi: { locale: 'en-IN', currency: 'INR' },
}

/** Bare currency symbols / codes — never append these after en-US number text. */
const CURRENCY_UNIT_LABELS = new Set([
	'$',
	'₽',
	'€',
	'£',
	'₹',
	'₺',
	'USD',
	'RUB',
	'EUR',
	'TRY',
	'INR',
])

/**
 * Format a monetary amount for the active site locale.
 * Uses Intl currency style so RU gets spaced thousands and decimal comma.
 */
export function formatMoney(
	value: number | null | undefined,
	locale: string = 'en',
): string {
	if (value === null || value === undefined || Number.isNaN(Number(value))) {
		return '—'
	}
	return formatOutputValue(Number(value), 'currency', undefined, locale)
}

/**
 * Localized year count with Russian plural forms (1 год / 2 года / 5 лет).
 */
export function formatYearsCount(
	years: number,
	locale: string = 'en',
): string {
	const n = Math.abs(Number(years))
	if (!Number.isFinite(n)) return String(years)
	const rounded = Math.round(n * 10) / 10
	if (locale === 'ru') {
		const whole = Math.floor(Math.abs(rounded))
		const mod10 = whole % 10
		const mod100 = whole % 100
		let word = 'лет'
		if (mod10 === 1 && mod100 !== 11) word = 'год'
		else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
			word = 'года'
		}
		const num = Number.isInteger(rounded)
			? String(whole)
			: new Intl.NumberFormat('ru-RU', {
					maximumFractionDigits: 1,
				}).format(rounded)
		return `${num} ${word}`
	}
	const label = Math.abs(rounded) === 1 ? 'year' : 'years'
	return `${rounded} ${label}`
}

/**
 * Format a calendar date using the active site locale.
 */
export function formatLocaleDate(
	value: string | Date,
	locale: string = 'en',
): string {
	const date = value instanceof Date ? value : new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	const currencyCfg = LOCALE_CURRENCY[locale] || LOCALE_CURRENCY.en
	return date.toLocaleDateString(currencyCfg.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

/**
 * Format a value based on format type.
 * Optional `locale` selects currency/number Intl locale (defaults to en).
 */
export function formatOutputValue(
	value: number | string | null | undefined,
	formatType?: 'number' | 'currency' | 'percentage' | 'date' | 'text' | 'default',
	unitLabel?: string,
	locale: string = 'en',
): string {
	if (value === null || value === undefined) {
		return '—'
	}

	if (typeof value === 'string') {
		return value
	}

	const currencyCfg = LOCALE_CURRENCY[locale] || LOCALE_CURRENCY.en

	switch (formatType) {
		case 'currency': {
			const label = (unitLabel || '').trim()
			// Currency symbols/codes must not force en-style digits + "₽".
			// Locale map selects the real currency; non-currency units (e.g. $/year
			// as a rate label) still append after locale number formatting.
			if (label && !CURRENCY_UNIT_LABELS.has(label) && label !== '$') {
				return `${new Intl.NumberFormat(currencyCfg.locale, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(value)} ${label}`
			}
			return new Intl.NumberFormat(currencyCfg.locale, {
				style: 'currency',
				currency: currencyCfg.currency,
			}).format(value)
		}
		case 'percentage':
			return `${value.toFixed(2)}%`
		case 'number':
			return new Intl.NumberFormat(currencyCfg.locale, {
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}).format(value)
		default:
			return String(value)
	}
}






