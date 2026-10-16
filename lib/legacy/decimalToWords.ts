/**
 * Convert decimal numbers to words
 * Supports both Russian and English with proper declension
 */

import { numberToWordsRu } from '@/lib/numberToWordsRu'
import { numberToWordsEn } from '@/lib/legacy/numberToWordsEn'

/**
 * Convert decimal part to words (Russian)
 * @param decimalStr - The decimal part as string (e.g., "55" for 0.55)
 * @param precision - Number of decimal places
 */
function decimalToWordsRu(decimalStr: string, precision: number): string {
	// Ensure we have the right length
	const paddedStr = decimalStr.padEnd(precision, '0').slice(0, precision)
	const parts: string[] = []

	// Convert each digit individually
	for (let i = 0; i < paddedStr.length; i++) {
		const digit = parseInt(paddedStr[i], 10)
		if (!isNaN(digit) && DIGITS_RU[digit] !== undefined) {
			parts.push(DIGITS_RU[digit])
		}
	}

	return parts.join(' ')
}

/**
 * Convert decimal part to words (English)
 * @param decimalStr - The decimal part as string (e.g., "55" for 0.55)
 * @param precision - Number of decimal places
 */
function decimalToWordsEn(decimalStr: string, precision: number): string {
	// Ensure we have the right length
	const paddedStr = decimalStr.padEnd(precision, '0').slice(0, precision)
	const parts: string[] = []

	// Read each digit individually
	for (let i = 0; i < paddedStr.length; i++) {
		const digit = parseInt(paddedStr[i], 10)
		if (!isNaN(digit) && DIGITS_EN[digit] !== undefined) {
			parts.push(DIGITS_EN[digit])
		}
	}

	return parts.join(' ')
}

/**
 * Get currency word with proper declension (Russian)
 */
function getCurrencyRu(amount: number, currency: 'rub' | 'usd' | 'eur'): string {
	const lastDigit = Math.floor(amount) % 10
	const lastTwoDigits = Math.floor(amount) % 100

	if (currency === 'rub') {
		if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
			return 'рублей'
		}
		if (lastDigit === 1) {
			return 'рубль'
		}
		if (lastDigit >= 2 && lastDigit <= 4) {
			return 'рубля'
		}
		return 'рублей'
	} else if (currency === 'usd') {
		if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
			return 'долларов'
		}
		if (lastDigit === 1) {
			return 'доллар'
		}
		if (lastDigit >= 2 && lastDigit <= 4) {
			return 'доллара'
		}
		return 'долларов'
	} else {
		// eur
		if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
			return 'евро'
		}
		if (lastDigit === 1) {
			return 'евро'
		}
		if (lastDigit >= 2 && lastDigit <= 4) {
			return 'евро'
		}
		return 'евро'
	}
}

/**
 * Get currency word (English)
 */
function getCurrencyEn(amount: number, currency: 'rub' | 'usd' | 'eur'): string {
	const amountInt = Math.floor(amount)
	if (amountInt === 1) {
		if (currency === 'usd') return 'dollar'
		if (currency === 'eur') return 'euro'
		return 'ruble'
	}
	if (currency === 'usd') return 'dollars'
	if (currency === 'eur') return 'euros'
	return 'rubles'
}

/**
 * Get kopecks/cents word with proper declension (Russian)
 */
function getKopecksRu(kopecks: number): string {
	const lastDigit = kopecks % 10
	const lastTwoDigits = kopecks % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return 'копеек'
	}
	if (lastDigit === 1) {
		return 'копейка'
	}
	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'копейки'
	}
	return 'копеек'
}

/**
 * Get cents word (English)
 */
function getCentsEn(cents: number): string {
	return cents === 1 ? 'cent' : 'cents'
}

/**
 * Russian plural form for fraction nouns agreeing with the numerator.
 */
function fractionPluralForm(n: number): 'one' | 'few' | 'many' {
	const abs = Math.abs(Math.trunc(n))
	const mod100 = abs % 100
	const mod10 = abs % 10
	if (mod100 >= 11 && mod100 <= 19) return 'many'
	if (mod10 === 1) return 'one'
	if (mod10 >= 2 && mod10 <= 4) return 'few'
	return 'many'
}

/**
 * Feminine fraction noun for the given decimal precision and numerator form.
 *
 * Russian «N целых M <fraction>» uses genitive plural for 2–4 (and 5+),
 * not nominative plural: «две десятых», not «две десятые».
 * Singular feminine remains for 1 (and 21, 31, …): «одна миллионная».
 */
function getFractionNameRu(
	precision: number,
	form: 'one' | 'few' | 'many',
): string {
	const table: Record<
		number,
		Record<'one' | 'few' | 'many', string>
	> = {
		1: { one: 'десятая', few: 'десятых', many: 'десятых' },
		2: { one: 'сотая', few: 'сотых', many: 'сотых' },
		3: { one: 'тысячная', few: 'тысячных', many: 'тысячных' },
		4: {
			one: 'десятитысячная',
			few: 'десятитысячных',
			many: 'десятитысячных',
		},
		5: {
			one: 'стотысячная',
			few: 'стотысячных',
			many: 'стотысячных',
		},
		6: { one: 'миллионная', few: 'миллионных', many: 'миллионных' },
	}
	const row = table[precision]
	if (!row) {
		return form === 'one' ? 'десятичная' : 'десятичных'
	}
	return row[form]
}

/**
 * Whole-part noun for «N целая/целых M <fraction>».
 * Singular feminine «целая» only when the integer agrees with 1 (not 11–14);
 * otherwise genitive plural «целых» (including 2–4).
 */
function wholePartNounRu(integerPart: number): string {
	return fractionPluralForm(integerPart) === 'one' ? 'целая' : 'целых'
}

/**
 * Build the Russian «целая/целых … <fraction>» suffix when a non-zero
 * fractional construction is required. Returns null when no fraction words
 * should be emitted (including .00 / trailing-zero Number values).
 */
function buildRuNumericFractionSuffix(
	n: number,
	integerPart: number,
): string | null {
	const decimalPart = Math.abs(n) - integerPart
	if (decimalPart <= 0) return null

	// Preserve precision via the engine's Number→string round-trip.
	const nStr = n.toString()
	const parts = nStr.split('.')
	if (parts.length <= 1) return null

	const decimalStr = parts[1] || ''
	const precision = decimalStr.length
	if (precision <= 0) return null

	const decimalNum = parseInt(decimalStr, 10)
	if (isNaN(decimalNum) || decimalNum <= 0) return null

	// Feminine numerator (одна/две) agrees with feminine fraction nouns.
	const decimalWords = numberToWordsRu(decimalNum, {
		feminineOnes: true,
	})
	const form = fractionPluralForm(decimalNum)
	const fractionName = getFractionNameRu(precision, form)
	const wholeNoun = wholePartNounRu(integerPart)
	return ` ${wholeNoun} ${decimalWords} ${fractionName}`
}

/**
 * Convert number with decimals to words (Russian)
 */
export function numberToWordsRuDecimal(
	n: number,
	options?: { format?: 'numeric' | 'money'; currency?: 'rub' | 'usd' | 'eur' },
): string {
	const { format = 'numeric', currency = 'rub' } = options || {}

	const integerPart = Math.floor(Math.abs(n))
	const decimalPart = Math.abs(n) - integerPart

	// Numeric fractions: feminine whole-part words only when we actually emit
	// «целая/целых …». Zero fractions (.00) stay masculine (один/два/…).
	const numericFractionSuffix =
		format === 'numeric'
			? buildRuNumericFractionSuffix(n, integerPart)
			: null
	const useFeminineWhole =
		format === 'numeric' && numericFractionSuffix !== null

	let result = ''
	if (integerPart === 0) {
		result = 'ноль'
	} else if (useFeminineWhole) {
		result = numberToWordsRu(integerPart, { feminineOnes: true })
	} else {
		result = numberToWordsRu(integerPart)
	}

	// Add currency if money format
	if (format === 'money') {
		result += ' ' + getCurrencyRu(integerPart, currency)
	}

	// Add decimal part if exists
	if (decimalPart > 0) {
		// For money, treat decimals as kopecks/cents
		if (format === 'money') {
			// Calculate kopecks from decimal part (e.g., 0.8 -> 80 kopecks, 0.55 -> 55 kopecks)
			// Use the original number to preserve precision
			const nStr = n.toString()
			const parts = nStr.split('.')
			if (parts.length > 1) {
				const decimalStr = parts[1] || ''
				// Handle up to 2 decimal places for money
				const decimalDigits = decimalStr.slice(0, 2).padEnd(2, '0')
				const kopecks = parseInt(decimalDigits, 10)
				if (kopecks > 0 && kopecks < 100) {
					const kopecksWords = numberToWordsRu(kopecks)
					result += ' ' + kopecksWords + ' ' + getKopecksRu(kopecks)
				}
			} else {
				// Fallback: calculate from decimalPart
				const kopecks = Math.round(decimalPart * 100)
				if (kopecks > 0 && kopecks < 100) {
					const kopecksWords = numberToWordsRu(kopecks)
					result += ' ' + kopecksWords + ' ' + getKopecksRu(kopecks)
				}
			}
		} else if (numericFractionSuffix) {
			result += numericFractionSuffix
		}
	}

	return result
}

/**
 * Convert number with decimals to words (English)
 */
export function numberToWordsEnDecimal(
	n: number,
	options?: { format?: 'numeric' | 'money'; currency?: 'rub' | 'usd' | 'eur' },
): string {
	const { format = 'numeric', currency = 'usd' } = options || {}

	const integerPart = Math.floor(Math.abs(n))
	const decimalPart = Math.abs(n) - integerPart

	// Convert integer part
	let result = ''
	if (integerPart === 0) {
		result = 'zero'
	} else {
		result = numberToWordsEn(integerPart)
	}

	// Add currency if money format
	if (format === 'money') {
		result += ' ' + getCurrencyEn(integerPart, currency)
	}

	// Add decimal part if exists
	if (decimalPart > 0) {
		// For money, treat decimals as cents
		if (format === 'money') {
			// Calculate cents from decimal part (e.g., 0.8 -> 80 cents, 0.55 -> 55 cents)
			// Use the original number to preserve precision
			const nStr = n.toString()
			const parts = nStr.split('.')
			if (parts.length > 1) {
				const decimalStr = parts[1] || ''
				// Handle up to 2 decimal places for money
				const decimalDigits = decimalStr.slice(0, 2).padEnd(2, '0')
				const cents = parseInt(decimalDigits, 10)
				if (cents > 0 && cents < 100) {
					const centsWords = numberToWordsEn(cents)
					result += ' and ' + centsWords + ' ' + getCentsEn(cents)
				}
			} else {
				// Fallback: calculate from decimalPart
				const cents = Math.round(decimalPart * 100)
				if (cents > 0 && cents < 100) {
					const centsWords = numberToWordsEn(cents)
					result += ' and ' + centsWords + ' ' + getCentsEn(cents)
				}
			}
		} else {
			// For numeric, convert decimal digits
			// Get decimal part as string with proper precision
			const nStr = n.toString()
			const parts = nStr.split('.')
			if (parts.length > 1) {
				const decimalStr = parts[1] || ''
				const precision = decimalStr.length
				if (precision > 0 && decimalStr.length > 0) {
					// Convert each digit individually
					const decimalWords = decimalToWordsEn(decimalStr, precision)
					result += ' point ' + decimalWords
				}
			}
		}
	}

	return result
}

// Digit words
const DIGITS_RU: Record<number, string> = {
	0: 'ноль',
	1: 'один',
	2: 'два',
	3: 'три',
	4: 'четыре',
	5: 'пять',
	6: 'шесть',
	7: 'семь',
	8: 'восемь',
	9: 'девять',
}

const DIGITS_EN: Record<number, string> = {
	0: 'zero',
	1: 'one',
	2: 'two',
	3: 'three',
	4: 'four',
	5: 'five',
	6: 'six',
	7: 'seven',
	8: 'eight',
	9: 'nine',
}

