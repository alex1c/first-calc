/**
 * Roman numeral conversion functions for legacy routes
 * Wrapper around main romanNumerals module
 */

import {
	arabicToRoman as toRomanBase,
	romanToArabic as fromRomanBase,
	isValidRoman,
	isValidArabic,
} from '@/lib/romanNumerals'

/**
 * Convert Arabic number to Roman numeral
 * @param num - Arabic number (1-3999)
 * @returns Roman numeral string
 */
export function toRoman(num: number): string {
	if (!isValidArabic(num)) {
		throw new Error(`Number ${num} is out of range (1-3999)`)
	}
	return toRomanBase(num)
}

/**
 * Convert Roman numeral to Arabic number
 * @param str - Roman numeral string
 * @returns Arabic number
 */
export function fromRoman(str: string): number {
	const normalized = str.trim().toUpperCase()
	if (!isValidRoman(normalized)) {
		throw new Error(`Invalid Roman numeral: ${str}`)
	}
	return fromRomanBase(normalized)
}
