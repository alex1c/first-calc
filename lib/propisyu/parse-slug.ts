/**
 * Explicit typed slug parser for /chislo-propisyu/{slug} routes.
 *
 * Uses shared strict-number helpers so UI validation, URL building, and
 * server conversion share one full-string policy (no parseFloat prefix tricks).
 */

import {
	findDecadeHub,
	isDecadeHubRange,
	PROPISYU_DECADE_MAX,
} from './decades'
import {
	converterMaxForLanguage,
	decodeSlugSegment,
	parseStrictLanguageSuffixedNumber,
	parseStrictLegacyMoneySegment,
	parseStrictNonNegativeNumber,
	PROPISYU_RU_MAX,
	type PropisyuMoneyCurrency,
	type PropisyuWordLanguage,
} from './strict-number'

export type PropisyuSlugKind =
	| 'plain-number'
	| 'money'
	| 'decade-hub'
	| 'small-range'
	| 'legacy-money-currency'
	| 'invalid'

export interface PropisyuPlainNumber {
	kind: 'plain-number'
	value: number
	isInteger: boolean
	canonicalSlug: string
	language?: PropisyuWordLanguage
}

export interface PropisyuMoney {
	kind: 'money'
	rubles: number
	kopecks: number
	totalKopecks: number
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

export interface PropisyuLegacyMoneyCurrency {
	kind: 'legacy-money-currency'
	segment: string
	/** Strict-normalized amount label (dot decimal). */
	numberLabel: string
	value: number
	isInteger: boolean
	currency: PropisyuMoneyCurrency
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

/**
 * Digits-only unsigned integer for range / money-ruble fields.
 * Leading zeros other than a lone "0" are rejected for URL stability.
 */
function parseUnsignedIntStrict(raw: string): number | null {
	if (!/^\d+$/.test(raw)) return null
	if (raw.length > 1 && raw.startsWith('0')) return null
	const value = Number(raw)
	if (!Number.isSafeInteger(value) || value < 0) return null
	return value
}

/**
 * Classify a single /chislo-propisyu catch-all slug segment list.
 */
export function parsePropisyuSlug(slug: string[]): PropisyuSlugParseResult {
	if (!slug || slug.length === 0) {
		return { kind: 'invalid', reason: 'empty-slug' }
	}

	if (slug.length > 1) {
		return { kind: 'invalid', reason: 'nested-slug-not-supported' }
	}

	const segment = decodeSlugSegment(slug[0]).trim()
	if (!segment) {
		return { kind: 'invalid', reason: 'empty-segment' }
	}

	// Legacy Next format: 555.23-money-usd (strict amount + currency-aware ceiling).
	if (/-money/i.test(segment)) {
		const legacy = parseStrictLegacyMoneySegment(segment)
		if (!legacy.ok) {
			return { kind: 'invalid', reason: legacy.reason }
		}
		return {
			kind: 'legacy-money-currency',
			segment: legacy.segment,
			numberLabel: legacy.normalized,
			value: legacy.value,
			isInteger: legacy.isInteger,
			currency: legacy.currency,
		}
	}

	// Language suffix: 123-en / 123.45-en / 1000000000-en (EN ceiling).
	const withLang = parseStrictLanguageSuffixedNumber(segment)
	if (withLang.ok) {
		return {
			kind: 'plain-number',
			value: withLang.value,
			isInteger: withLang.isInteger,
			canonicalSlug: withLang.canonicalSlug,
			language: withLang.language,
		}
	}
	// Distinguish "looks like suffix but invalid amount" from "not a suffix".
	if (segment.match(/-(en|ru)$/i) && !withLang.ok) {
		return { kind: 'invalid', reason: withLang.reason }
	}

	// Historical money: {N}-{KK} with exactly two kopeck digits.
	const moneyMatch = segment.match(/^(\d+)-(\d{2})$/)
	if (moneyMatch) {
		const rubles = parseUnsignedIntStrict(moneyMatch[1])
		const kopecks = Number(moneyMatch[2])
		if (rubles === null) {
			return { kind: 'invalid', reason: 'money-rubles-invalid' }
		}
		if (rubles > PROPISYU_RU_MAX) {
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

	// Decade hub or other a-b range.
	const rangeMatch = segment.match(/^(\d+)-(\d+)$/)
	if (rangeMatch) {
		const start = parseUnsignedIntStrict(rangeMatch[1])
		const end = parseUnsignedIntStrict(rangeMatch[2])
		if (start === null || end === null) {
			return { kind: 'invalid', reason: 'range-bounds-invalid' }
		}
		if (start > end) {
			return { kind: 'invalid', reason: 'range-start-after-end' }
		}
		if (start < 0 || end > PROPISYU_DECADE_MAX) {
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
		return { kind: 'small-range', start, end }
	}

	// Plain number (default language = Russian ceiling unless -en was used).
	const plain = parseStrictNonNegativeNumber(segment, {
		maxWhole: converterMaxForLanguage('ru'),
		rejectExponent: true,
	})
	if (plain.ok) {
		return {
			kind: 'plain-number',
			value: plain.value,
			isInteger: plain.isInteger,
			canonicalSlug: plain.normalized,
		}
	}

	return { kind: 'invalid', reason: plain.reason || 'unrecognized-slug' }
}
