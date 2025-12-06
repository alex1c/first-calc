/**
 * Converts an Arabic number to Roman numeral
 * Supports numbers from 1 to 3999
 *
 * @param n - Arabic number to convert (1 to 3999)
 * @returns Roman numeral representation
 */
export function arabicToRoman(n: number): string {
	if (n < 1 || n > 3999) {
		throw new Error(
			`Number ${n} is out of range. Supported range: 1 to 3999`,
		)
	}

	let result = ''
	let remaining = n

	// Process each value from largest to smallest
	for (const [value, numeral] of ROMAN_VALUES) {
		const count = Math.floor(remaining / value)
		if (count > 0) {
			result += numeral.repeat(count)
			remaining -= value * count
		}
	}

	return result
}

/**
 * Converts a Roman numeral to Arabic number
 * Supports valid Roman numerals from I to MMMCMXCIX (1 to 3999)
 *
 * @param roman - Roman numeral string
 * @returns Arabic number representation
 */
export function romanToArabic(roman: string): number {
	if (!roman || roman.trim().length === 0) {
		throw new Error('Empty Roman numeral string')
	}

	const normalized = roman.trim().toUpperCase()
	let result = 0
	let i = 0

	while (i < normalized.length) {
		const current = ROMAN_MAP[normalized[i]]

		if (current === undefined) {
			throw new Error(`Invalid Roman numeral character: ${normalized[i]}`)
		}

		// Check for subtractive notation (IV, IX, XL, XC, CD, CM)
		if (i + 1 < normalized.length) {
			const next = ROMAN_MAP[normalized[i + 1]]
			if (next && next > current) {
				result += next - current
				i += 2
				continue
			}
		}

		result += current
		i++
	}

	// Validate the result by converting back to Roman
	// This ensures the input was a valid Roman numeral
	try {
		const convertedBack = arabicToRoman(result)
		if (convertedBack !== normalized) {
			throw new Error(`Invalid Roman numeral: ${roman}`)
		}
	} catch (error) {
		throw new Error(`Invalid Roman numeral: ${roman}`)
	}

	return result
}

/**
 * Checks if a string is a valid Roman numeral
 */
export function isValidRoman(roman: string): boolean {
	try {
		romanToArabic(roman)
		return true
	} catch {
		return false
	}
}

/**
 * Checks if a string is a valid Arabic number
 */
export function isValidArabic(n: number): boolean {
	return n >= 1 && n <= 3999 && Number.isInteger(n)
}

// Roman numeral values in descending order
const ROMAN_VALUES: [number, string][] = [
	[1000, 'M'],
	[900, 'CM'],
	[500, 'D'],
	[400, 'CD'],
	[100, 'C'],
	[90, 'XC'],
	[50, 'L'],
	[40, 'XL'],
	[10, 'X'],
	[9, 'IX'],
	[5, 'V'],
	[4, 'IV'],
	[1, 'I'],
]

// Map of Roman characters to their values
const ROMAN_MAP: Record<string, number> = {
	I: 1,
	V: 5,
	X: 10,
	L: 50,
	C: 100,
	D: 500,
	M: 1000,
}

