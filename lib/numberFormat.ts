/**
 * Formats a number in Indian numbering system
 * Indian system uses lakhs (100,000) and crores (10,000,000)
 * Format: 1,00,000 (lakh), 1,00,00,000 (crore)
 *
 * @param n - Number to format
 * @returns Formatted string in Indian numbering system
 */
export function formatIndianNumber(n: number): string {
	if (!Number.isFinite(n)) {
		throw new Error('Invalid number')
	}

	// Convert to string and split by decimal point if present
	const parts = n.toString().split('.')
	const integerPart = parts[0]
	const decimalPart = parts[1]

	// Handle negative sign
	const isNegative = integerPart.startsWith('-')
	const digits = isNegative ? integerPart.slice(1) : integerPart

	// Format integer part in Indian system
	// First 3 digits from right, then groups of 2
	let formatted = ''
	const len = digits.length

	if (len <= 3) {
		formatted = digits
	} else {
		// Last 3 digits
		formatted = digits.slice(-3)

		// Remaining digits in groups of 2
		for (let i = len - 3; i > 0; i -= 2) {
			const start = Math.max(0, i - 2)
			const group = digits.slice(start, i)
			formatted = group + ',' + formatted
		}
	}

	// Add negative sign if needed
	if (isNegative) {
		formatted = '-' + formatted
	}

	// Add decimal part if present
	if (decimalPart) {
		formatted += '.' + decimalPart
	}

	return formatted
}









import type { Locale } from '@/lib/i18n'

export function formatLocalizedNumber(
	value: number,
	locale: Locale,
	options: Intl.NumberFormatOptions = {},
): string {
	if (!Number.isFinite(value)) throw new Error('Invalid number')
	return new Intl.NumberFormat(locale, { maximumFractionDigits: 12, ...options }).format(value)
}

/**
 * Parse a user-entered decimal without guessing ambiguous thousands grouping.
 * Both `1.5` and `1,5` are accepted; grouped values must follow the locale.
 */
export function parseLocalizedNumber(input: string, locale: Locale): number | null {
	const value = input.trim().replace(/\u00a0|\u202f|\s/g, '')
	if (!value) return null

	const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
	const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
	const group = parts.find((part) => part.type === 'group')?.value ?? ','
	let normalized = value

	if (decimal === ',') {
		if (normalized.includes(',') && normalized.includes('.')) {
			normalized = normalized.split('.').join('').replace(',', '.')
		} else {
			normalized = normalized.replace(',', '.')
		}
	} else if (normalized.includes('.') && normalized.includes(',')) {
		normalized = normalized.split(group).join('')
	} else if (!normalized.includes('.') && normalized.includes(',')) {
		// Accept decimal comma paste in every supported locale.
		normalized = normalized.replace(',', '.')
	}

	if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null
	const parsed = Number(normalized)
	return Number.isFinite(parsed) ? parsed : null
}
