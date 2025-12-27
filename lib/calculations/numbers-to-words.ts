/**
 * Convert numbers to words
 * Inputs: number, language (optional), currencyMode (optional)
 * Outputs: words, breakdown, currencyWords, explanation
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert a number less than 1000 to words
 */
function convertHundreds(num: number): string {
	const ones = [
		'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
		'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
	]
	const tens = [
		'', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
	]

	if (num === 0) return ''
	if (num < 20) return ones[num]
	if (num < 100) {
		const ten = Math.floor(num / 10)
		const one = num % 10
		return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`
	}
	if (num < 1000) {
		const hundred = Math.floor(num / 100)
		const remainder = num % 100
		if (remainder === 0) {
			return `${ones[hundred]} hundred`
		}
		return `${ones[hundred]} hundred ${convertHundreds(remainder)}`
	}
	return ''
}

/**
 * Convert number to words
 */
function numberToWords(num: number): string {
	if (num === 0) return 'zero'

	const isNegative = num < 0
	const absNum = Math.abs(num)
	const integerPart = Math.floor(absNum)
	const decimalPart = absNum - integerPart

	// Handle very large numbers (limit to reasonable size)
	if (integerPart > 999999999999999) {
		throw new Error('Number is too large. Maximum supported: 999,999,999,999,999')
	}

	const scales = ['', 'thousand', 'million', 'billion', 'trillion']
	const parts: string[] = []

	let remaining = integerPart
	let scaleIndex = 0

	if (remaining === 0) {
		parts.push('zero')
	} else {
		while (remaining > 0) {
			const chunk = remaining % 1000
			if (chunk !== 0) {
				const chunkWords = convertHundreds(chunk)
				if (scaleIndex > 0) {
					parts.unshift(`${chunkWords} ${scales[scaleIndex]}`)
				} else {
					parts.unshift(chunkWords)
				}
			}
			remaining = Math.floor(remaining / 1000)
			scaleIndex++
		}
	}

	let result = parts.join(' ')

	// Handle negative
	if (isNegative) {
		result = `negative ${result}`
	}

	// Handle decimal part
	if (decimalPart > 0) {
		const decimalStr = decimalPart.toString().substring(2) // Remove "0."
		const decimalWords = decimalStr.split('').map(digit => {
			const d = parseInt(digit, 10)
			return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][d]
		}).join(' ')
		result = `${result} point ${decimalWords}`
	}

	return result
}

/**
 * Convert number to currency words
 */
function numberToCurrencyWords(num: number): string {
	const integerPart = Math.floor(Math.abs(num))
	const decimalPart = Math.abs(num) - integerPart
	const cents = Math.round(decimalPart * 100)

	const dollars = numberToWords(integerPart)
	const dollarsText = integerPart === 1 ? 'dollar' : 'dollars'

	if (cents === 0) {
		return `${dollars} ${dollarsText}`
	}

	const centsWords = numberToWords(cents)
	const centsText = cents === 1 ? 'cent' : 'cents'

	return `${dollars} ${dollarsText} and ${centsWords} ${centsText}`
}

/**
 * Get breakdown by scale
 */
function getBreakdown(num: number): {
	millions: number
	thousands: number
	hundreds: number
} {
	const absNum = Math.abs(Math.floor(num))
	return {
		millions: Math.floor(absNum / 1000000) % 1000,
		thousands: Math.floor(absNum / 1000) % 1000,
		hundreds: absNum % 1000,
	}
}

/**
 * Calculate numbers to words
 */
export const calculateNumbersToWords: CalculationFunction = (inputs) => {
	// Extract inputs
	const numberStr = String(inputs.number || '')
	const currencyMode = inputs.currencyMode === true || (typeof inputs.currencyMode === 'string' && inputs.currencyMode.toLowerCase() === 'true') || inputs.currencyMode === 'true' || String(inputs.currencyMode).toLowerCase() === 'true'
	const language = String(inputs.language || 'en').toLowerCase()

	// Validation
	if (!numberStr || numberStr.trim() === '') {
		throw new Error('Number is required.')
	}

	// Parse number
	const number = parseFloat(numberStr)
	if (isNaN(number) || !Number.isFinite(number)) {
		throw new Error('Invalid number. Please enter a valid number.')
	}

	// Reasonable length limit (prevent extremely long conversions)
	if (Math.abs(number) > 999999999999999) {
		throw new Error('Number is too large. Maximum supported: 999,999,999,999,999')
	}

	// Convert to words
	let words = ''
	let currencyWords = ''
	
	if (currencyMode) {
		currencyWords = numberToCurrencyWords(number)
		words = numberToWords(number) // Also provide non-currency version
	} else {
		words = numberToWords(number)
	}

	// Get breakdown
	const breakdown = getBreakdown(number)

	// Create explanation
	let explanation = ''
	if (currencyMode) {
		explanation = `The number ${number.toLocaleString()} is written as "${currencyWords}" in currency format.`
	} else {
		explanation = `The number ${number.toLocaleString()} is written as "${words}" in words.`
	}

	// Format breakdown text
	const breakdownParts: string[] = []
	if (breakdown.millions > 0) {
		breakdownParts.push(`${breakdown.millions.toLocaleString()} million${breakdown.millions !== 1 ? 's' : ''}`)
	}
	if (breakdown.thousands > 0) {
		breakdownParts.push(`${breakdown.thousands.toLocaleString()} thousand${breakdown.thousands !== 1 ? 's' : ''}`)
	}
	if (breakdown.hundreds > 0) {
		breakdownParts.push(`${breakdown.hundreds.toLocaleString()} hundred${breakdown.hundreds !== 1 ? 's' : ''}`)
	}
	const breakdownText = breakdownParts.length > 0 ? breakdownParts.join(', ') : (Math.abs(number) < 1 ? 'Less than 1' : '0')

	return {
		words,
		currencyWords: currencyMode ? currencyWords : '',
		breakdown: breakdownText,
		millions: breakdown.millions,
		thousands: breakdown.thousands,
		hundreds: breakdown.hundreds,
		explanation,
		originalNumber: number.toLocaleString(),
		language: language,
	}
}

// Register the calculation function
registerCalculation('calculateNumbersToWords', calculateNumbersToWords)

