/**
 * Shared strict number parsing for chislo-propisyu.
 *
 * PRECISION POLICY (documented, shared by form + routes + conversion):
 * - Full-string validation only (no parseFloat prefix tricks, no exponents).
 * - Decimal separator: one `.` or one `,` (not both).
 * - Leading zeros normalize in `normalized` (e.g. `00021.05` → `21.05`).
 * - Money: at most 2 fractional digits (kopecks/cents). Never truncate.
 * - Numeric decimals: at most PROPISYU_MAX_FRACTION_DIGITS_NUMERIC (6) digits —
 *   matches named RU fraction forms and keeps Number↔string fidelity for the
 *   existing decimalToWords engines (which call `n.toString()`).
 * - Magnitude limits compared with exact decimal-string semantics (BigInt),
 *   not after IEEE rounding.
 * - Numeric: whole > max, or whole == max with any non-zero fraction →
 *   out-of-range (value exceeds the integer ceiling).
 * - Money: whole ≤ max inclusive with up to 2 fractional digits allowed at
 *   the ceiling (RU: 999_999_999 rubles + 99 kopecks). whole > max → reject.
 * - After parsing, Number(literal) must faithfully represent the literal
 *   (no exponent toString, no rounding to a different scaled integer).
 * - RU integer/money ceiling: 999_999_999; EN: 999_999_999_999.
 */

export type PropisyuWordLanguage = 'ru' | 'en'
export type PropisyuMoneyCurrency = 'rub' | 'usd' | 'eur'

/** Matches `numberToWordsRu` hard ceiling. */
export const PROPISYU_RU_MAX = 999_999_999
/** Matches `numberToWordsEn` hard ceiling (within Number.isSafeInteger). */
export const PROPISYU_EN_MAX = 999_999_999_999
export const PROPISYU_MONEY_MAX_FRACTION_DIGITS = 2
/**
 * Max fractional digits for numeric (non-money) conversion.
 * Named RU fraction labels exist through 6 places; beyond that Number↔engine
 * round-trips are unreliable — reject rather than silently change the value.
 */
export const PROPISYU_MAX_FRACTION_DIGITS_NUMERIC = 6

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
	/** Inclusive maximum for the integer (whole) part. */
	maxWhole?: number
	/** When set, more fractional digits → error (no silent truncate). */
	maxFractionDigits?: number
	/** Reject scientific notation (default true). */
	rejectExponent?: boolean
	/**
	 * Money mode: allow a non-zero fraction when whole === maxWhole
	 * (e.g. 999999999.99 rubles). Numeric mode keeps this false.
	 */
	allowFractionAtMax?: boolean
}

export function converterMaxForLanguage(language: PropisyuWordLanguage): number {
	return language === 'en' ? PROPISYU_EN_MAX : PROPISYU_RU_MAX
}

export function decodeSlugSegment(raw: string): string {
	try {
		return decodeURIComponent(raw)
	} catch {
		return raw
	}
}

/**
 * Exact string compare of a non-negative decimal against an integer ceiling.
 * When allowFractionAtMax is false (numeric), whole == max with any non-zero
 * fraction is out of range. When true (money), only whole > max is rejected.
 */
export function isWithinExactWholeMax(
	wholeDigits: string,
	fractionDigits: string | null,
	maxWhole: number,
	allowFractionAtMax = false,
): boolean {
	const whole = BigInt(wholeDigits)
	const max = BigInt(maxWhole)
	if (whole > max) return false
	if (
		!allowFractionAtMax &&
		whole === max &&
		fractionDigits !== null &&
		/[1-9]/.test(fractionDigits)
	) {
		return false
	}
	return true
}

/**
 * True when Number(literal) still denotes the same finite decimal as the
 * exact digit strings (rejects exponent forms and IEEE rounding).
 * Compares the full decimal expansion — extra digits on either side fail.
 */
export function isFaithfulNumberRepresentation(
	wholeDigits: string,
	fractionDigits: string | null,
	value: number,
): boolean {
	if (!Number.isFinite(value) || value < 0) return false
	const fromNumber = value.toString()
	if (/[eE]/.test(fromNumber)) return false

	const expectedFrac = fractionDigits || ''
	const [nwRaw, nfRaw = ''] = fromNumber.split('.')
	const nw = nwRaw.replace(/^0+(?=\d)/, '') || '0'
	const expectedWhole = wholeDigits.replace(/^0+(?=\d)/, '') || '0'
	if (nw !== expectedWhole) return false

	// Compare at the longer fractional length so truncated extras are visible.
	const scale = Math.max(expectedFrac.length, nfRaw.length)
	const scaleFactor = BigInt(10) ** BigInt(scale)
	const expectedPadded = (expectedFrac + '0'.repeat(scale)).slice(0, scale)
	const actualPadded = (nfRaw + '0'.repeat(scale)).slice(0, scale)
	const expectedScaled =
		BigInt(expectedWhole) * scaleFactor +
		BigInt(scale > 0 ? expectedPadded : '0')
	const actualScaled =
		BigInt(nw) * scaleFactor + BigInt(scale > 0 ? actualPadded : '0')

	return expectedScaled === actualScaled
}

/**
 * Parse a full-string non-negative decimal with exact magnitude + fidelity checks.
 */
export function parseStrictNonNegativeNumber(
	raw: string,
	options: StrictNumberOptions = {},
): StrictNumberResult {
	const {
		maxWhole = PROPISYU_RU_MAX,
		maxFractionDigits = PROPISYU_MAX_FRACTION_DIGITS_NUMERIC,
		rejectExponent = true,
		allowFractionAtMax = false,
	} = options

	const input = raw.trim()
	if (!input) {
		return { ok: false, reason: 'empty' }
	}

	if (input.startsWith('-') || input.startsWith('+')) {
		return { ok: false, reason: 'signed-not-allowed' }
	}
	if (rejectExponent && /[eE]/.test(input)) {
		return { ok: false, reason: 'exponent-not-allowed' }
	}

	const hasDot = input.includes('.')
	const hasComma = input.includes(',')
	if (hasDot && hasComma) {
		return { ok: false, reason: 'mixed-decimal-separators' }
	}
	if (
		(hasDot && (input.match(/\./g) || []).length > 1) ||
		(hasComma && (input.match(/,/g) || []).length > 1)
	) {
		return { ok: false, reason: 'multiple-decimal-separators' }
	}

	const separator = hasDot ? '.' : hasComma ? ',' : null
	let wholeRaw: string
	let fracRaw: string | null = null

	if (separator) {
		const parts = input.split(separator)
		if (parts.length !== 2 || !parts[0] || !parts[1]) {
			return { ok: false, reason: 'malformed-decimal' }
		}
		wholeRaw = parts[0]
		fracRaw = parts[1]
	} else {
		wholeRaw = input
	}

	if (!/^\d+$/.test(wholeRaw)) {
		return { ok: false, reason: 'non-digit-characters' }
	}
	if (fracRaw !== null && !/^\d+$/.test(fracRaw)) {
		return { ok: false, reason: 'non-digit-fraction' }
	}

	if (fracRaw !== null && fracRaw.length > maxFractionDigits) {
		return { ok: false, reason: 'too-many-fraction-digits' }
	}

	const wholeNormalized = wholeRaw.replace(/^0+(?=\d)/, '') || '0'
	const fractionDigits = fracRaw
	const isInteger = fractionDigits === null
	const numericLiteral = isInteger
		? wholeNormalized
		: `${wholeNormalized}.${fractionDigits}`

	if (
		!isWithinExactWholeMax(
			wholeNormalized,
			fractionDigits,
			maxWhole,
			allowFractionAtMax,
		)
	) {
		return { ok: false, reason: 'out-of-range' }
	}

	const value = Number(numericLiteral)
	if (!Number.isFinite(value) || value < 0) {
		return { ok: false, reason: 'not-finite' }
	}
	if (isInteger && !Number.isSafeInteger(value)) {
		return { ok: false, reason: 'not-safe-integer' }
	}
	if (!isFaithfulNumberRepresentation(wholeNormalized, fractionDigits, value)) {
		return { ok: false, reason: 'not-faithful-precision' }
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
 * Parse money amount (≤2 fractional digits) against a whole-unit ceiling.
 */
export function parseStrictMoneyAmount(
	raw: string,
	maxWhole: number = PROPISYU_RU_MAX,
): StrictNumberResult {
	return parseStrictNonNegativeNumber(raw, {
		maxWhole,
		maxFractionDigits: PROPISYU_MONEY_MAX_FRACTION_DIGITS,
		rejectExponent: true,
		// RU money: 999_999_999.99 (rubles + kopecks) is valid.
		allowFractionAtMax: true,
	})
}

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
 * Parse `{amount}-money-{rub|usd|eur}` with strict amount and exact currency.
 * Integer ceiling follows currency language: RUB → RU max, USD/EUR → EN max.
 */
export function parseStrictLegacyMoneySegment(
	segment: string,
	options: { maxWhole?: number; currencyHint?: PropisyuMoneyCurrency } = {},
): LegacyMoneyParseResult {
	const match = segment.match(/^(.+)-money-(rub|usd|eur)$/i)
	if (!match) {
		if (/-money/i.test(segment)) {
			return { ok: false, reason: 'legacy-money-malformed' }
		}
		return { ok: false, reason: 'not-legacy-money' }
	}

	const amountRaw = match[1]
	const currency = match[2].toLowerCase() as PropisyuMoneyCurrency
	const maxWhole =
		options.maxWhole ??
		(currency === 'rub' ? PROPISYU_RU_MAX : PROPISYU_EN_MAX)
	const amount = parseStrictNonNegativeNumber(amountRaw, {
		maxWhole,
		maxFractionDigits: PROPISYU_MONEY_MAX_FRACTION_DIGITS,
		rejectExponent: true,
		allowFractionAtMax: true,
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
 * Parse optional `-en` / `-ru` language suffix on a plain number.
 */
export function parseStrictLanguageSuffixedNumber(
	segment: string,
):
	| (StrictNumberOk & { language: PropisyuWordLanguage; canonicalSlug: string })
	| StrictNumberErr {
	const match = segment.match(/^(.+)-(en|ru)$/i)
	if (!match) {
		return { ok: false, reason: 'not-language-suffix' }
	}
	const language = match[2].toLowerCase() as PropisyuWordLanguage
	const amount = parseStrictNonNegativeNumber(match[1], {
		maxWhole: converterMaxForLanguage(language),
		maxFractionDigits: PROPISYU_MAX_FRACTION_DIGITS_NUMERIC,
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
