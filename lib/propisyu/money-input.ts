/**
 * Shared money / numeric input checks for the chislo-propisyu converter form.
 * Delegates to strict-number so UI and URL parsing stay aligned.
 */

import {
	converterMaxForLanguage,
	moneyPartsFromStrictNumber,
	parseStrictMoneyAmount,
	parseStrictNonNegativeNumber,
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
 */
export function validatePropisyuFormInput(
	raw: string,
	options: {
		format: 'numeric' | 'money'
		language: PropisyuWordLanguage
	},
): { ok: true; normalized: string; urlSegment: string } | { ok: false; reason: string } {
	const trimmed = raw.trim()
	if (!trimmed) {
		return { ok: false, reason: 'empty' }
	}

	if (options.format === 'money') {
		// Historical RU money URLs always use the RU ruble ceiling.
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

	const max = converterMaxForLanguage(options.language)
	const parsed = parseStrictNonNegativeNumber(trimmed, {
		max,
		rejectExponent: true,
	})
	if (!parsed.ok) {
		return { ok: false, reason: parsed.reason }
	}

	const urlSegment =
		options.language === 'en'
			? `${parsed.normalized}-en`
			: parsed.normalized

	return {
		ok: true,
		normalized: parsed.normalized,
		urlSegment,
	}
}
