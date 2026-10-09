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

/**
 * Format a monetary amount for the active site locale.
 * Used by specialized result renderers that previously hard-coded `$` + en-US.
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
		case 'currency':
			// Prefer explicit unitLabel (e.g. ₽) when provided by the schema/item
			if (unitLabel && unitLabel.trim() && unitLabel !== '$') {
				return `${new Intl.NumberFormat(currencyCfg.locale, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(value)} ${unitLabel}`
			}
			return new Intl.NumberFormat(currencyCfg.locale, {
				style: 'currency',
				currency: currencyCfg.currency,
			}).format(value)
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






