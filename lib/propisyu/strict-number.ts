/**
 * Shared strict number parsing for chislo-propisyu.
 *
 * Rules (apply to the FULL string — never accept a numeric prefix of garbage):
 * - No exponent notation (`1e3`, `1E309`) — rejected unless explicitly enabled
 *   (money / URL paths never enable it).
 * - Decimal separator: a single `.` or a single `,` (not both, not repeated).
 * - Leading zeros are accepted on input and normalized away in `normalized`
 *   (e.g. `00021.05` → value 21.05, normalized `21.05`).
 * - Money amounts: at most two fractional digits; never silently truncate.
 * - Limits are language-aware: RU ≤ 999_999_999, EN ≤ 999_999_999_999.
 */

export type PropisyuWordLanguage = 'ru' | 'en'
export type PropisyuMoneyCurrency = 'rub' | 'usd' | 'eur'

/** Matches `numberToWordsRu` hard ceiling. */
export const PROPISYU_RU_MAX = 999_999_999
/** Matches `numberToWordsEn` hard ceiling (within Number.isSafeInteger). */
export const PROPISYU_EN_MAX = 999_999_999_999
export const PROPISYU_MONEY_MAX_FRACTION_DIGITS = 2

export interface StrictNumberOk {
	ok: true
	value: number
	isInteger: boolean
	/** Canonical decimal form with a dot, no leading zeros (except `0`). */
	normalized: string
	wholeDigits: string
	fractionDigits: string | null
}

export interface StrictNumberErr {
	ok: false
	reason: string
}

export type StrictNumberResult = StrictNumberOk | StrictNumberErr

export interface StrictNumberOptions {
	/** Inclusive maximum absolute value. */
	max?: number
	/** When set, more fractional digits → error (no silent truncate). */
	maxFractionDigits?: number
	/** Reject scientific notation (default true). */
	rejectExponent?: boolean
}

/**
 * Language converter ceiling — must match the real word engines, not the decade hub.
 */
export function converterMaxForLanguage(language: PropisyuWordLanguage): number {
	return language === 'en' ? PROPISYU_EN_MAX : PROPISYU_RU_MAX
}

/**
 * Strip a single outer layer of percent-encoding safely.
 */
export function decodeSlugSegment(raw: string): string {
	try {
		return decodeURIComponent(raw)
	} catch {
		return raw
	}
}

/**
 * Parse a full-string non-negative decimal. Does not use parseFloat as the
 * sole validator — the pattern must consume the entire trimmed input.
 */
export function parseStrictNonNegativeNumber(
	raw: string,
	options: StrictNumberOptions = {},
): StrictNumberResult {
	const {
		max = PROPISYU_RU_MAX,
		maxFractionDigits,
		rejectExponent = true,
	} = options

	const input = raw.trim()
	if (!input) {
		return { ok: false, reason: 'empty' }
	}

	// Reject signs and exponent forms early (full-string policy).
	if (input.startsWith('-') || input.startsWith('+')) {
		return { ok: false, reason: 'signed-not-allowed' }
	}
	if (rejectExponent && /[eE]/.test(input)) {
		return { ok: false, reason: 'exponent-not-allowed' }
	}

	// Exactly one decimal separator kind, at most one occurrence.
	const hasDot = input.includes('.')
	const hasComma = input.includes(',')
	if (hasDot && hasComma) {
		return { ok: false, reason: 'mixed-decimal-separators' }
	}
	if ((hasDot && (input.match(/\./g) || []).length > 1) ||
		(hasComma && (input.match(/,/g) || []).length > 1)) {
		return { ok: false, reason: 'multiple-decimal-separators' }
	}

	const separator = hasDot ? '.' : hasComma ? ',' : null
	let wholeRaw: string
	let fracRaw: string | null = null

	if (separator) {
		const parts = input.split(separator)
		if (parts.length !== 2) {
			return { ok: false, reason: 'malformed-decimal' }
		}
		wholeRaw = parts[0]
		fracRaw = parts[1]
		if (!wholeRaw || !fracRaw) {
			return { ok: false, reason: 'malformed-decimal' }
		}
	} else {
		wholeRaw = input
	}

	if (!/^\d+$/.test(wholeRaw)) {
		return { ok: false, reason: 'non-digit-characters' }
	}
	if (fracRaw !== null && !/^\d+$/.test(fracRaw)) {
		return { ok: false, reason: 'non-digit-fraction' }
	}

	if (
		maxFractionDigits !== undefined &&
		fracRaw !== null &&
		fracRaw.length > maxFractionDigits
	) {
		return { ok: false, reason: 'too-many-fraction-digits' }
	}

	// Normalize leading zeros on the whole part (keep a lone "0").
	const wholeNormalized = wholeRaw.replace(/^0+(?=\d)/, '') || '0'
	const fractionDigits = fracRaw
	const isInteger = fractionDigits === null

	// Build a finite Number without accepting garbage prefixes.
	const numericLiteral = isInteger
		? wholeNormalized
		: `${wholeNormalized}.${fractionDigits}`
	const value = Number(numericLiteral)
	if (!Number.isFinite(value) || value < 0) {
		return { ok: false, reason: 'not-finite' }
	}
	// Guard against values that lose integer identity beyond the safe range.
	if (isInteger && !Number.isSafeInteger(value)) {
		return { ok: false, reason: 'not-safe-integer' }
	}
	if (value > max) {
		return { ok: false, reason: 'out-of-range' }
	}

	return {
		ok: true,
		value,
		isInteger,
		normalized: numericLiteral,
		wholeDigits: wholeNormalized,
		fractionDigits,
	}
}

/**
 * Parse historical money input for the converter form (≤2 fractional digits).
 */
export function parseStrictMoneyAmount(
	raw: string,
	maxRubles: number = PROPISYU_RU_MAX,
): StrictNumberResult {
	return parseStrictNonNegativeNumber(raw, {
		max: maxRubles + 0.99,
		maxFractionDigits: PROPISYU_MONEY_MAX_FRACTION_DIGITS,
		rejectExponent: true,
	})
}

/**
 * Split a validated money amount into integer rubles + 0…99 kopecks.
 * Requires ≤2 fractional digits (already enforced by parseStrictMoneyAmount).
 */
export function moneyPartsFromStrictNumber(parsed: StrictNumberOk): {
	rubles: number
	kopecks: number
} {
	const rubles = Number(parsed.wholeDigits)
	const frac = parsed.fractionDigits || ''
	const kopecks = Number((frac + '00').slice(0, 2))
	return { rubles, kopecks }
}

export interface LegacyMoneyParseOk {
	ok: true
	value: number
	normalized: string
	isInteger: boolean
	currency: PropisyuMoneyCurrency
	segment: string
}

export type LegacyMoneyParseResult = LegacyMoneyParseOk | StrictNumberErr

/**
 * Parse `{amount}-money-{rub|usd|eur}` with a strict amount and exact currency.
 * Rejects trailing junk after the currency and garbage inside the amount.
 */
export function parseStrictLegacyMoneySegment(
	segment: string,
	options: { max?: number } = {},
): LegacyMoneyParseResult {
	const match = segment.match(
		/^(.+)-money-(rub|usd|eur)$/i,
	)
	if (!match) {
		// Tolerate only the exact historical shape — anything else is invalid.
		if (/-money/i.test(segment)) {
			return { ok: false, reason: 'legacy-money-malformed' }
		}
		return { ok: false, reason: 'not-legacy-money' }
	}

	const amountRaw = match[1]
	const currency = match[2].toLowerCase() as PropisyuMoneyCurrency
	const amount = parseStrictNonNegativeNumber(amountRaw, {
		max: options.max ?? PROPISYU_RU_MAX,
		maxFractionDigits: PROPISYU_MONEY_MAX_FRACTION_DIGITS,
		rejectExponent: true,
	})
	if (!amount.ok) {
		return amount
	}

	return {
		ok: true,
		value: amount.value,
		normalized: amount.normalized,
		isInteger: amount.isInteger,
		currency,
		segment: `${amount.normalized}-money-${currency}`,
	}
}

/**
 * Parse optional `-en` / `-ru` language suffix on a plain number (int or decimal).
 */
export function parseStrictLanguageSuffixedNumber(
	segment: string,
): (StrictNumberOk & { language: PropisyuWordLanguage; canonicalSlug: string }) | StrictNumberErr {
	const match = segment.match(/^(.+)-(en|ru)$/i)
	if (!match) {
		return { ok: false, reason: 'not-language-suffix' }
	}
	const language = match[2].toLowerCase() as PropisyuWordLanguage
	const amount = parseStrictNonNegativeNumber(match[1], {
		max: converterMaxForLanguage(language),
		rejectExponent: true,
	})
	if (!amount.ok) {
		return amount
	}
	return {
		...amount,
		language,
		canonicalSlug: `${amount.normalized}-${language}`,
	}
}
