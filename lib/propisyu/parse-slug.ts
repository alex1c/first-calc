/**
 * Explicit typed slug parser for /chislo-propisyu/{slug} routes.
 *
 * Does NOT use parseFloat for route classification — that incorrectly treated
 * "0-9999" as the number 0. Money is detected only when kopecks are exactly
 * two digits (historical `{N}-{KK}` URLs).
 */

import { findDecadeHub, isDecadeHubRange, PROPISYU_MAX_INTEGER } from './decades'

export type PropisyuSlugKind =
	| 'plain-number'
	| 'money'
	| 'decade-hub'
	| 'small-range'
	| 'legacy-money-currency'
	| 'invalid'

export interface PropisyuPlainNumber {
	kind: 'plain-number'
	/** Non-negative integer amount (no currency). */
	value: number
	/** Optional language suffix from historical URLs (`-en` / `-ru`). */
	language?: 'ru' | 'en'
}

export interface PropisyuMoney {
	kind: 'money'
	/** Whole rubles (integer). */
	rubles: number
	/** Kopecks 0…99 (exactly two digits in the URL). */
	kopecks: number
	/** Total amount in integer kopecks (avoids float money math). */
	totalKopecks: number
	/** Canonical slug without trailing slash, e.g. "420-00". */
	canonicalSlug: string
}

export interface PropisyuDecadeHub {
	kind: 'decade-hub'
	start: number
	end: number
	slug: string
}

export interface PropisyuSmallRange {
	kind: 'small-range'
	start: number
	end: number
}

/** Existing Next money format: `555.23-money-usd` (kept for compatibility). */
export interface PropisyuLegacyMoneyCurrency {
	kind: 'legacy-money-currency'
	/** Original segment for downstream legacy converters. */
	segment: string
	numberLabel: string
	currency: 'rub' | 'usd' | 'eur'
}

export interface PropisyuInvalid {
	kind: 'invalid'
	reason: string
}

export type PropisyuSlugParseResult =
	| PropisyuPlainNumber
	| PropisyuMoney
	| PropisyuDecadeHub
	| PropisyuSmallRange
	| PropisyuLegacyMoneyCurrency
	| PropisyuInvalid

function decodeSegment(raw: string): string {
	try {
		return decodeURIComponent(raw)
	} catch {
		return raw
	}
}

/**
 * Parse a digits-only unsigned integer string (no leading sign, no decimals).
 */
function parseUnsignedInt(raw: string): number | null {
	if (!/^\d+$/.test(raw)) return null
	// Reject absurd leading zeros except a lone "0"
	if (raw.length > 1 && raw.startsWith('0')) return null
	const value = Number(raw)
	if (!Number.isSafeInteger(value)) return null
	return value
}

/**
 * Classify a single /chislo-propisyu catch-all slug segment list.
 */
export function parsePropisyuSlug(slug: string[]): PropisyuSlugParseResult {
	if (!slug || slug.length === 0) {
		return { kind: 'invalid', reason: 'empty-slug' }
	}

	// Nested paths are reserved for E3 chunks under root ranges — not under chislo.
	if (slug.length > 1) {
		return { kind: 'invalid', reason: 'nested-slug-not-supported-in-e2' }
	}

	const segment = decodeSegment(slug[0]).trim()
	if (!segment) {
		return { kind: 'invalid', reason: 'empty-segment' }
	}

	// Legacy Next format: 555.23-money-usd (keep working, separate from historical money)
	if (segment.includes('-money')) {
		const numberPart = segment.split('-money')[0]
		const after = segment.split('-money')[1]?.replace(/^-/, '').toLowerCase()
		let currency: 'rub' | 'usd' | 'eur' = 'rub'
		if (after === 'usd' || after === 'eur' || after === 'rub') {
			currency = after
		}
		return {
			kind: 'legacy-money-currency',
			segment,
			numberLabel: numberPart,
			currency,
		}
	}

	// Language suffix on a plain integer: 123-en / 123-ru
	const languageMatch = segment.match(/^(\d+)-(en|ru)$/i)
	if (languageMatch) {
		const value = parseUnsignedInt(languageMatch[1])
		if (value === null || value > PROPISYU_MAX_INTEGER) {
			return { kind: 'invalid', reason: 'plain-number-out-of-range' }
		}
		return {
			kind: 'plain-number',
			value,
			language: languageMatch[2].toLowerCase() as 'ru' | 'en',
		}
	}

	// Historical money: {N}-{KK} where KK is exactly two digits (00–99)
	const moneyMatch = segment.match(/^(\d+)-(\d{2})$/)
	if (moneyMatch) {
		const rubles = parseUnsignedInt(moneyMatch[1])
		const kopecks = Number(moneyMatch[2])
		if (rubles === null) {
			return { kind: 'invalid', reason: 'money-rubles-invalid' }
		}
		if (rubles > PROPISYU_MAX_INTEGER) {
			return { kind: 'invalid', reason: 'money-rubles-out-of-range' }
		}
		if (!Number.isInteger(kopecks) || kopecks < 0 || kopecks > 99) {
			return { kind: 'invalid', reason: 'money-kopecks-invalid' }
		}
		const canonicalSlug = `${rubles}-${String(kopecks).padStart(2, '0')}`
		return {
			kind: 'money',
			rubles,
			kopecks,
			totalKopecks: rubles * 100 + kopecks,
			canonicalSlug,
		}
	}

	// Decade hub or other a-b range (kopecks already handled above)
	const rangeMatch = segment.match(/^(\d+)-(\d+)$/)
	if (rangeMatch) {
		const start = parseUnsignedInt(rangeMatch[1])
		const end = parseUnsignedInt(rangeMatch[2])
		if (start === null || end === null) {
			return { kind: 'invalid', reason: 'range-bounds-invalid' }
		}
		if (start > end) {
			return { kind: 'invalid', reason: 'range-start-after-end' }
		}
		if (start < 0 || end > PROPISYU_MAX_INTEGER) {
			return { kind: 'invalid', reason: 'range-out-of-bounds' }
		}
		if (isDecadeHubRange(start, end)) {
			const hub = findDecadeHub(start, end)!
			return {
				kind: 'decade-hub',
				start,
				end,
				slug: hub.slug,
			}
		}
		// Non-decade dash pairs with a 3+ digit end (e.g. 100-199) stay small ranges.
		return { kind: 'small-range', start, end }
	}

	// Plain integer
	const plain = parseUnsignedInt(segment)
	if (plain !== null) {
		if (plain > PROPISYU_MAX_INTEGER) {
			return { kind: 'invalid', reason: 'plain-number-out-of-range' }
		}
		return { kind: 'plain-number', value: plain }
	}

	return { kind: 'invalid', reason: 'unrecognized-slug' }
}
