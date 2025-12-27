/**
 * Unified slug parser for all legacy route types
 * Provides stable parsing functions with error handling
 */

import { isValidRoman } from '@/lib/romanNumerals'

/**
 * Parse single number from slug (supports decimals and language suffix)
 * @param slug - Array of slug segments
 * @returns Parsed number or null if invalid
 */
export function parseSingleNumber(slug: string[]): number | null {
	if (slug.length === 0) {
		return null
	}

	// Decode URL-encoded values (handles dots in decimals)
	// Use try-catch to handle malformed URLs
	let firstSegment: string
	try {
		firstSegment = decodeURIComponent(slug[0])
	} catch {
		// If decode fails, use original segment
		firstSegment = slug[0]
	}

	// Handle money format: "number-money-currency" or "number-money"
	// Extract number part before "-money"
	let numberPart = firstSegment.split('-money')[0]
	
	// Handle language suffix: "number-en" or "number-ru" (for chislo-propisyu)
	// Remove language suffix if present
	if (numberPart.endsWith('-en') || numberPart.endsWith('-ru')) {
		numberPart = numberPart.slice(0, -3)
	}

	// Parse as float to support decimals
	const number = parseFloat(numberPart)

	if (isNaN(number) || !Number.isFinite(number)) {
		return null
	}

	return number
}

/**
 * Parse language from slug (for chislo-propisyu numeric format)
 * @param slug - Array of slug segments
 * @returns 'en' if English suffix found, 'ru' otherwise (default)
 */
export function parseLanguage(slug: string[]): 'ru' | 'en' {
	if (slug.length === 0) {
		return 'ru'
	}

	// Decode URL-encoded values
	let firstSegment: string
	try {
		firstSegment = decodeURIComponent(slug[0])
	} catch {
		firstSegment = slug[0]
	}

	// Check if it's money format (language is determined by currency)
	if (firstSegment.includes('-money')) {
		const currencyPart = firstSegment.split('-money')[1]?.replace(/^-/, '').toLowerCase()
		if (currencyPart === 'usd' || currencyPart === 'eur') {
			return 'en'
		}
		return 'ru'
	}

	// Check for language suffix
	if (firstSegment.endsWith('-en')) {
		return 'en'
	}
	if (firstSegment.endsWith('-ru')) {
		return 'ru'
	}

	// Default to Russian
	return 'ru'
}

/**
 * Parse money format from slug
 * Format: "number-money-currency" or "number-money"
 * Supports decimals: "555.23-money-usd"
 * @param slug - Array of slug segments
 * @returns Object with number, format, and currency or null if invalid
 */
export function parseMoneyFormat(slug: string[]): {
	number: number
	format: 'money'
	currency: 'rub' | 'usd' | 'eur'
} | null {
	if (slug.length === 0) {
		return null
	}

	// Decode URL-encoded values (handles dots in decimals)
	// Use try-catch to handle malformed URLs
	let firstSegment: string
	try {
		firstSegment = decodeURIComponent(slug[0])
	} catch {
		// If decode fails, use original segment
		firstSegment = slug[0]
	}

	// Check if it's a money format
	if (!firstSegment.includes('-money')) {
		return null
	}

	// Extract number part (handle decimals properly)
	// Split by '-money' and take the first part
	const numberPart = firstSegment.split('-money')[0]
	const number = parseFloat(numberPart)

	if (isNaN(number) || !Number.isFinite(number)) {
		return null
	}

	// Extract currency from the rest of the segment
	// Format: "number-money-currency" or "number-money"
	let currency: 'rub' | 'usd' | 'eur' = 'rub'
	
	// Get the part after '-money'
	const afterMoney = firstSegment.split('-money')[1]
	if (afterMoney) {
		// Remove leading dash if present
		const currencyPart = afterMoney.replace(/^-/, '').toLowerCase()
		if (currencyPart === 'usd' || currencyPart === 'eur' || currencyPart === 'rub') {
			currency = currencyPart
		}
	}

	return { number, format: 'money', currency }
}

/**
 * Parse range from slug (format: "from-to")
 * @param slug - Array of slug segments
 * @returns Object with start and end numbers or null if invalid
 */
export function parseRange(slug: string[]): { start: number; end: number } | null {
	if (slug.length === 0) {
		return null
	}

	const firstSegment = slug[0]

	// Check if it contains a dash (range indicator)
	if (!firstSegment.includes('-')) {
		return null
	}

	const parts = firstSegment.split('-')

	// Must have exactly 2 parts
	if (parts.length !== 2) {
		return null
	}

	const start = parseInt(parts[0], 10)
	const end = parseInt(parts[1], 10)

	if (isNaN(start) || isNaN(end)) {
		return null
	}

	if (start > end) {
		return null
	}

	return { start, end }
}

/**
 * Parse percentage operation from slug
 * Supports formats:
 * - "value/percent" (percentage of) - supports decimals
 * - "value/percent-add" (add percentage) - supports decimals
 * - "value/percent-subtract" (subtract percentage) - supports decimals
 * @param slug - Array of slug segments
 * @returns Object with type, percent, and value or null if invalid
 */
export function parsePercentage(slug: string[]): {
	type: 'of' | 'add' | 'subtract'
	percent: number
	value: number
} | null {
	if (slug.length < 2) {
		return null
	}

	// Decode URL-encoded values (handles dots in decimals)
	// Next.js may encode dots, so we need to decode them
	let firstSegment = slug[0]
	let secondSegment = slug[1]
	
	// Try to decode, but if it fails, use original
	try {
		firstSegment = decodeURIComponent(firstSegment)
	} catch {
		// Keep original if decode fails
	}
	
	try {
		secondSegment = decodeURIComponent(secondSegment)
	} catch {
		// Keep original if decode fails
	}
	
	secondSegment = secondSegment.toLowerCase()

	// Parse value (supports decimals)
	const value = parseFloat(firstSegment)
	if (isNaN(value) || !Number.isFinite(value)) {
		return null
	}

	// Check for operation type in second segment
	let type: 'of' | 'add' | 'subtract' = 'of'
	let percentStr = secondSegment

	// Handle operation suffixes (check for -add or -subtract first to avoid partial matches)
	// Handle cases like "2.3-add" or "2.3-subtract"
	if (secondSegment.endsWith('-add')) {
		type = 'add'
		percentStr = secondSegment.slice(0, -4) // Remove '-add'
	} else if (secondSegment.endsWith('-subtract')) {
		type = 'subtract'
		percentStr = secondSegment.slice(0, -9) // Remove '-subtract'
	} else if (secondSegment.includes('-add')) {
		// Handle case where -add is in the middle (shouldn't happen, but just in case)
		type = 'add'
		percentStr = secondSegment.replace('-add', '')
	} else if (secondSegment.includes('-subtract')) {
		type = 'subtract'
		percentStr = secondSegment.replace('-subtract', '')
	}

	// Parse percent (supports decimals)
	// Trim any whitespace that might have been introduced
	percentStr = percentStr.trim()
	const percent = parseFloat(percentStr)
	if (isNaN(percent) || !Number.isFinite(percent)) {
		return null
	}

	return { type, percent, value }
}

/**
 * Parse Roman numeral from slug
 * @param slug - Array of slug segments
 * @returns Object with roman string or number, or null if invalid
 */
export function parseRoman(slug: string[]): { roman?: string; number?: number } | null {
	if (slug.length === 0) {
		return null
	}

	// Decode URL-encoded values and normalize to uppercase
	let firstSegment: string
	try {
		firstSegment = decodeURIComponent(slug[0]).toUpperCase().trim()
	} catch {
		// If decode fails, use original segment and normalize to uppercase
		firstSegment = slug[0].toUpperCase().trim()
	}

	// Check if it's a Roman numeral (only contains I, V, X, L, C, D, M)
	const isRomanPattern = /^[IVXLCDM]+$/.test(firstSegment)

	if (isRomanPattern) {
		// Validate that it's a valid Roman numeral (not just valid characters)
		if (isValidRoman(firstSegment)) {
			return { roman: firstSegment }
		}
		// If pattern matches but not valid Roman, continue to check if it's a number
	}

	// Check if it's an Arabic number
	const number = parseInt(firstSegment, 10)

	if (!isNaN(number)) {
		return { number }
	}

	return null
}

/**
 * Parse range from single segment (format: "from-to")
 * Used for [range] route
 */
export function parseRangeFromString(range: string): {
	start: number
	end: number
} | null {
	if (!range.includes('-')) {
		return null
	}

	const parts = range.split('-')
	if (parts.length < 2) {
		return null
	}

	// Handle nested ranges: "210000-219999/213500-213549"
	// Take the first range
	const startStr = parts[0]
	const endStr = parts.slice(1).join('-').split('/')[0] // Take first part before /

	const start = parseInt(startStr, 10)
	const end = parseInt(endStr, 10)

	if (isNaN(start) || isNaN(end)) {
		return null
	}

	if (start > end) {
		return null
	}

	return { start, end }
}

/**
 * Parse nested ranges from slug
 * Format: "range1/range2/range3"
 */
export function parseNestedRanges(slug: string[]): Array<{ start: number; end: number }> {
	const ranges: Array<{ start: number; end: number }> = []

	for (const segment of slug) {
		const range = parseRangeFromString(segment)
		if (range) {
			ranges.push(range)
		}
	}

	return ranges
}






