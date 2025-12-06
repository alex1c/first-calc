/**
 * Unified slug parser for all legacy route types
 * Provides stable parsing functions with error handling
 */

/**
 * Parse single number from slug
 * @param slug - Array of slug segments
 * @returns Parsed number or null if invalid
 */
export function parseSingleNumber(slug: string[]): number | null {
	if (slug.length === 0) {
		return null
	}

	const firstSegment = slug[0]

	// Remove any non-numeric characters except minus sign at start
	const cleaned = firstSegment.replace(/[^\d-]/g, '')
	const number = parseInt(cleaned, 10)

	if (isNaN(number)) {
		return null
	}

	return number
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
 * - "value-percent" (percentage of)
 * - "value-percent-add" (add percentage)
 * - "value-percent-subtract" (subtract percentage)
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

	const value = parseFloat(slug[0])
	const secondSegment = slug[1].toLowerCase()

	// Check for operation type in second segment
	let type: 'of' | 'add' | 'subtract' = 'of'
	let percentStr = secondSegment

	if (secondSegment.includes('-add')) {
		type = 'add'
		percentStr = secondSegment.replace('-add', '')
	} else if (secondSegment.includes('-subtract')) {
		type = 'subtract'
		percentStr = secondSegment.replace('-subtract', '')
	} else if (secondSegment.includes('add')) {
		type = 'add'
		percentStr = secondSegment.replace('add', '')
	} else if (secondSegment.includes('subtract')) {
		type = 'subtract'
		percentStr = secondSegment.replace('subtract', '')
	}

	const percent = parseFloat(percentStr)

	if (isNaN(value) || isNaN(percent)) {
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

	const firstSegment = slug[0].toUpperCase().trim()

	// Check if it's a Roman numeral (only contains I, V, X, L, C, D, M)
	const isRoman = /^[IVXLCDM]+$/.test(firstSegment)

	if (isRoman) {
		return { roman: firstSegment }
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

