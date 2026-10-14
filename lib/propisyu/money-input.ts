/**
 * Shared money / numeric input checks for the chislo-propisyu converter form.
 * Delegates to strict-number so UI and URL parsing stay aligned.
 */

import {
	converterMaxForLanguage,
	moneyPartsFromStrictNumber,
	parseStrictMoneyAmount,
	parseStrictNonNegativeNumber,
	PROPISYU_EN_MAX,
	PROPISYU_MAX_FRACTION_DIGITS_NUMERIC,
	PROPISYU_RU_MAX,
	type PropisyuWordLanguage,
} from '@/lib/propisyu/strict-number'

export function moneyFractionalDigitCount(raw: string): number | null {
	const parsed = parseStrictMoneyAmount(raw)
	if (!parsed.ok) {
		if (parsed.reason === 'too-many-fraction-digits') {
			const normalized = raw.trim().replace(',', '.')
			const frac = normalized.match(/\.(\d+)$/)
			return frac ? frac[1].length : null
		}
		return null
	}
	return parsed.fractionDigits ? parsed.fractionDigits.length : 0
}

export function isValidMoneyFractionalInput(raw: string): boolean {
	return parseStrictMoneyAmount(raw).ok
}

/**
 * Validate form input for numeric or money mode against language ceilings.
 *
 * chislo-propisyu money:
 * - RU → historical `{N}-{KK}` RUB URLs (RU ceiling).
 * - EN → legacy `{amount}-money-usd` (EN ceiling; not Russian RUB pages).
 */
export function validatePropisyuFormInput(
	raw: string,
	options: {
		format: 'numeric' | 'money'
		language: PropisyuWordLanguage
		tool?: 'chislo-propisyu' | 'numbers-to-words'
	},
): { ok: true; normalized: string; urlSegment: string } | { ok: false; reason: string } {
	const trimmed = raw.trim()
	if (!trimmed) {
		return { ok: false, reason: 'empty' }
	}

	const tool = options.tool ?? 'chislo-propisyu'

	if (options.format === 'money') {
		if (tool === 'chislo-propisyu' && options.language === 'ru') {
			const parsed = parseStrictMoneyAmount(trimmed, PROPISYU_RU_MAX)
			if (!parsed.ok) {
				return { ok: false, reason: parsed.reason }
			}
			const parts = moneyPartsFromStrictNumber(parsed)
			if (parts.rubles > PROPISYU_RU_MAX) {
				return { ok: false, reason: 'out-of-range' }
			}
			return {
				ok: true,
				normalized: parsed.normalized,
				urlSegment: `${parts.rubles}-${String(parts.kopecks).padStart(2, '0')}`,
			}
		}

		// EN money (chislo) or any money on numbers-to-words → legacy currency route.
		const currency =
			options.language === 'ru' ? 'rub' : 'usd'
		const maxWhole =
			currency === 'rub' ? PROPISYU_RU_MAX : PROPISYU_EN_MAX
		const parsed = parseStrictMoneyAmount(trimmed, maxWhole)
		if (!parsed.ok) {
			return { ok: false, reason: parsed.reason }
		}
		return {
			ok: true,
			normalized: parsed.normalized,
			urlSegment: `${parsed.normalized}-money-${currency}`,
		}
	}

	const maxWhole = converterMaxForLanguage(options.language)
	const parsed = parseStrictNonNegativeNumber(trimmed, {
		maxWhole,
		maxFractionDigits: PROPISYU_MAX_FRACTION_DIGITS_NUMERIC,
		rejectExponent: true,
	})
	if (!parsed.ok) {
		return { ok: false, reason: parsed.reason }
	}

	const urlSegment =
		tool === 'chislo-propisyu' && options.language === 'en'
			? `${parsed.normalized}-en`
			: parsed.normalized

	return {
		ok: true,
		normalized: parsed.normalized,
		urlSegment,
	}
}
