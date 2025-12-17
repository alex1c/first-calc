/**
 * Converts a number to its English word representation
 * Supports numbers from 0 to 999,999,999,999 (trillion)
 *
 * @param n - Number to convert (0 to 999,999,999,999)
 * @returns English word representation of the number
 */
export function numberToWordsEn(n: number): string {
	// Validate input range
	if (n < 0 || n > 999_999_999_999) {
		throw new Error(
			`Number ${n} is out of range. Supported range: 0 to 999,999,999,999`,
		)
	}

	// Handle zero
	if (n === 0) {
		return 'zero'
	}

	// Split number into groups of three digits (thousands, millions, billions, etc.)
	const groups: number[] = []
	let remaining = n

	while (remaining > 0) {
		groups.push(remaining % 1000)
		remaining = Math.floor(remaining / 1000)
	}

	// Convert each group to words
	const groupWords = groups.map((group, index) => {
		if (group === 0) return null

		const groupWord = convertHundreds(group)
		const groupName = getGroupName(index)

		return groupWord + (groupName ? ' ' + groupName : '')
	})

	// Filter out null values and reverse (most significant first)
	return groupWords
		.filter((word): word is string => word !== null)
		.reverse()
		.join(' ')
		.trim()
}

/**
 * Converts a three-digit number (0-999) to English words
 */
function convertHundreds(n: number): string {
	if (n === 0) return ''

	const hundreds = Math.floor(n / 100)
	const remainder = n % 100
	const tens = Math.floor(remainder / 10)
	const ones = remainder % 10

	const parts: string[] = []

	// Hundreds
	if (hundreds > 0) {
		parts.push(ONES[hundreds] + ' hundred')
	}

	// Tens and ones
	if (remainder >= 10 && remainder < 20) {
		// Special case for 10-19
		parts.push(TEENS[remainder - 10])
	} else {
		// Tens (20, 30, 40, etc.)
		if (tens > 0) {
			parts.push(TENS[tens])
		}

		// Ones (1-9)
		if (ones > 0) {
			parts.push(ONES[ones])
		}
	}

	return parts.join(' ')
}

/**
 * Gets the group name (thousand, million, billion) based on group index
 */
function getGroupName(groupIndex: number): string {
	if (groupIndex === 0) return '' // Units

	const groupNames: Record<number, string> = {
		1: 'thousand',
		2: 'million',
		3: 'billion',
	}

	return groupNames[groupIndex] || ''
}

// Number words in English
const ONES: Record<number, string> = {
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

const TEENS: Record<number, string> = {
	0: 'ten',
	1: 'eleven',
	2: 'twelve',
	3: 'thirteen',
	4: 'fourteen',
	5: 'fifteen',
	6: 'sixteen',
	7: 'seventeen',
	8: 'eighteen',
	9: 'nineteen',
}

const TENS: Record<number, string> = {
	2: 'twenty',
	3: 'thirty',
	4: 'forty',
	5: 'fifty',
	6: 'sixty',
	7: 'seventy',
	8: 'eighty',
	9: 'ninety',
}




