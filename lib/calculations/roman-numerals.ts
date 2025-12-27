/**
 * Convert between numbers and Roman numerals
 * Inputs: mode, value
 * Outputs: result, breakdown, explanation, symbolsUsed
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert number to Roman numeral
 */
function numberToRoman(num: number): string {
	if (num <= 0 || num > 3999) {
		throw new Error('Number must be between 1 and 3999 for Roman numeral conversion.')
	}

	const values = [
		{ value: 1000, numeral: 'M' },
		{ value: 900, numeral: 'CM' },
		{ value: 500, numeral: 'D' },
		{ value: 400, numeral: 'CD' },
		{ value: 100, numeral: 'C' },
		{ value: 90, numeral: 'XC' },
		{ value: 50, numeral: 'L' },
		{ value: 40, numeral: 'XL' },
		{ value: 10, numeral: 'X' },
		{ value: 9, numeral: 'IX' },
		{ value: 5, numeral: 'V' },
		{ value: 4, numeral: 'IV' },
		{ value: 1, numeral: 'I' },
	]

	let result = ''
	let remaining = num
	const breakdown: Array<{ value: number; numeral: string; count: number }> = []

	for (const { value, numeral } of values) {
		const count = Math.floor(remaining / value)
		if (count > 0) {
			result += numeral.repeat(count)
			breakdown.push({ value, numeral, count })
			remaining -= value * count
		}
	}

	return result
}

/**
 * Convert Roman numeral to number
 */
function romanToNumber(roman: string): number {
	// Normalize input (uppercase, remove spaces)
	const normalized = roman.toUpperCase().trim().replace(/\s+/g, '')

	// Validate Roman numeral characters
	if (!/^[IVXLCDM]+$/.test(normalized)) {
		throw new Error('Invalid Roman numeral. Only I, V, X, L, C, D, M are allowed.')
	}

	const romanMap: Record<string, number> = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1000,
	}

	// Validate subtractive pairs
	const subtractivePairs = ['IV', 'IX', 'XL', 'XC', 'CD', 'CM']
	const invalidPatterns = [
		/IIII/, /VV/, /XXXX/, /LL/, /CCCC/, /DD/, /MMMM/, // Invalid repetitions
		/IL/, /IC/, /ID/, /IM/, // Invalid subtractive
		/XD/, /XM/, /VX/, /VL/, /VC/, /VD/, /VM/, // Invalid subtractive
		/LC/, /LD/, /LM/, // Invalid subtractive
	]

	for (const pattern of invalidPatterns) {
		if (pattern.test(normalized)) {
			throw new Error('Invalid Roman numeral format. Check for invalid symbol combinations.')
		}
	}

	let result = 0
	const breakdown: Array<{ symbol: string; value: number; operation: string }> = []

	for (let i = 0; i < normalized.length; i++) {
		const current = romanMap[normalized[i]]
		const next = i + 1 < normalized.length ? romanMap[normalized[i + 1]] : 0

		if (current < next) {
			// Subtractive notation (e.g., IV = 4, IX = 9)
			const pair = normalized[i] + normalized[i + 1]
			const subtractiveValue = next - current
			result += subtractiveValue
			breakdown.push({
				symbol: pair,
				value: subtractiveValue,
				operation: `${next} - ${current} = ${subtractiveValue}`,
			})
			i++ // Skip next character as it's part of the pair
		} else {
			// Additive notation
			result += current
			breakdown.push({
				symbol: normalized[i],
				value: current,
				operation: `+${current}`,
			})
		}
	}

	// Validate result is in valid range
	if (result < 1 || result > 3999) {
		throw new Error('Roman numeral must represent a number between 1 and 3999.')
	}

	return result
}

/**
 * Get symbols used in Roman numeral
 */
function getSymbolsUsed(roman: string): string[] {
	const symbols = new Set<string>()
	const normalized = roman.toUpperCase().trim()
	
	for (const char of normalized) {
		if (['I', 'V', 'X', 'L', 'C', 'D', 'M'].includes(char)) {
			symbols.add(char)
		}
	}
	
	return Array.from(symbols).sort()
}

/**
 * Calculate Roman numerals conversion
 */
export const calculateRomanNumerals: CalculationFunction = (inputs) => {
	// Extract inputs
	const mode = String(inputs.mode || 'number-to-roman').toLowerCase()
	const value = String(inputs.value || '').trim()

	// Validation
	if (!value || value.trim() === '') {
		throw new Error('Value is required.')
	}

	let result: string | number
	let breakdown: any
	let explanation = ''
	let symbolsUsed: string[] = []
	let originalValue = value

	if (mode === 'number-to-roman' || mode === 'numbertoroman') {
		// Convert number to Roman
		const number = parseInt(value, 10)
		if (isNaN(number) || !Number.isInteger(number)) {
			throw new Error('Please enter a valid integer.')
		}
		if (number < 1 || number > 3999) {
			throw new Error('Number must be between 1 and 3999 for Roman numeral conversion.')
		}

		result = numberToRoman(number)
		symbolsUsed = getSymbolsUsed(result)

		// Create breakdown
		const breakdownParts: string[] = []
		let remaining = number
		const values = [
			{ value: 1000, numeral: 'M' },
			{ value: 900, numeral: 'CM' },
			{ value: 500, numeral: 'D' },
			{ value: 400, numeral: 'CD' },
			{ value: 100, numeral: 'C' },
			{ value: 90, numeral: 'XC' },
			{ value: 50, numeral: 'L' },
			{ value: 40, numeral: 'XL' },
			{ value: 10, numeral: 'X' },
			{ value: 9, numeral: 'IX' },
			{ value: 5, numeral: 'V' },
			{ value: 4, numeral: 'IV' },
			{ value: 1, numeral: 'I' },
		]

		for (const { value: val, numeral } of values) {
			const count = Math.floor(remaining / val)
			if (count > 0) {
				breakdownParts.push(`${numeral} = ${val} × ${count}`)
				remaining -= val * count
			}
		}

		breakdown = breakdownParts.join(', ')
		explanation = `The number ${number.toLocaleString()} is written as "${result}" in Roman numerals.`
	} else if (mode === 'roman-to-number' || mode === 'romantonumber') {
		// Convert Roman to number
		result = romanToNumber(value)
		symbolsUsed = getSymbolsUsed(value)

		// Create breakdown (simplified - show the conversion process)
		const normalized = value.toUpperCase().trim()
		const breakdownParts: string[] = []
		const romanMap: Record<string, number> = {
			I: 1,
			V: 5,
			X: 10,
			L: 50,
			C: 100,
			D: 500,
			M: 1000,
		}

		let tempResult = 0
		for (let i = 0; i < normalized.length; i++) {
			const current = romanMap[normalized[i]]
			const next = i + 1 < normalized.length ? romanMap[normalized[i + 1]] : 0

			if (current < next) {
				const pair = normalized[i] + normalized[i + 1]
				const subtractiveValue = next - current
				tempResult += subtractiveValue
				breakdownParts.push(`${pair} = ${next} - ${current} = ${subtractiveValue}`)
				i++
			} else {
				tempResult += current
				breakdownParts.push(`${normalized[i]} = ${current}`)
			}
		}

		breakdown = breakdownParts.join(', ')
		explanation = `The Roman numeral "${value.toUpperCase()}" equals ${result.toLocaleString()} in decimal numbers.`
	} else {
		throw new Error('Invalid mode. Use "number-to-roman" or "roman-to-number".')
	}

	return {
		result: String(result),
		breakdown,
		explanation,
		symbolsUsed: symbolsUsed.join(', '),
		originalValue,
		mode,
	}
}

// Register the calculation function
registerCalculation('calculateRomanNumerals', calculateRomanNumerals)


