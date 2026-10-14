/**
 * Shared money-input checks for the chislo-propisyu converter form.
 * Rejects more than two fractional digits instead of silently truncating.
 */

/**
 * Return fractional digit count for a user-typed amount, or null if the
 * string is not a finite non-negative number.
 */
export function moneyFractionalDigitCount(raw: string): number | null {
	const normalized = raw.trim().replace(',', '.')
	if (!normalized) return null
	const num = Number.parseFloat(normalized)
	if (Number.isNaN(num) || !Number.isFinite(num) || num < 0) {
		return null
	}
	const fracMatch = normalized.match(/\.(\d+)$/)
	return fracMatch ? fracMatch[1].length : 0
}

/**
 * True when a money amount is acceptable for {N}-{KK} routing
 * (at most two fractional digits).
 */
export function isValidMoneyFractionalInput(raw: string): boolean {
	const count = moneyFractionalDigitCount(raw)
	return count !== null && count <= 2
}
