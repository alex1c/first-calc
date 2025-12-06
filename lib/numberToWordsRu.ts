/**
 * Converts a number to its Russian word representation (пропись)
 * Supports numbers from 0 to 999,999,999
 *
 * @param n - Number to convert (0 to 999,999,999)
 * @returns Russian word representation of the number
 */
export function numberToWordsRu(n: number): string {
	// Validate input range
	if (n < 0 || n > 999_999_999) {
		throw new Error(
			`Number ${n} is out of range. Supported range: 0 to 999,999,999`,
		)
	}

	// Handle zero
	if (n === 0) {
		return 'ноль'
	}

	// Split number into groups of three digits (thousands, millions, etc.)
	const groups: number[] = []
	let remaining = n

	while (remaining > 0) {
		groups.push(remaining % 1000)
		remaining = Math.floor(remaining / 1000)
	}

	// Convert each group to words
	const groupWords = groups.map((group, index) => {
		if (group === 0) return null

		// For thousands (index 1), use special forms: одна, две
		const groupWord = convertHundreds(group, index === 1)
		const groupName = getGroupName(index, group)

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
 * Converts a three-digit number (0-999) to Russian words
 * @param n - Number to convert
 * @param isThousands - If true, use special forms for thousands (одна, две instead of один, два)
 */
function convertHundreds(n: number, isThousands = false): string {
	if (n === 0) return ''

	const hundreds = Math.floor(n / 100)
	const remainder = n % 100
	const tens = Math.floor(remainder / 10)
	const ones = remainder % 10

	const parts: string[] = []

	// Hundreds
	if (hundreds > 0) {
		if (hundreds === 1) {
			parts.push('сто')
		} else if (hundreds === 2) {
			parts.push('двести')
		} else if (hundreds === 3) {
			parts.push('триста')
		} else if (hundreds === 4) {
			parts.push('четыреста')
		} else {
			parts.push(ONES[hundreds] + 'сот')
		}
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

		// Ones (1-9) - use special forms for thousands
		if (ones > 0) {
			if (isThousands && ones === 1) {
				parts.push('одна')
			} else if (isThousands && ones === 2) {
				parts.push('две')
			} else {
				parts.push(ONES[ones])
			}
		}
	}

	return parts.join(' ')
}

/**
 * Gets the group name (thousand, million) based on group index and value
 */
function getGroupName(groupIndex: number, value: number): string {
	if (groupIndex === 0) return '' // Units

	const lastDigit = value % 10
	const lastTwoDigits = value % 100

	// Determine the correct form based on Russian grammar rules
	let form: 'one' | 'few' | 'many'

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		form = 'many'
	} else if (lastDigit === 1) {
		form = 'one'
	} else if (lastDigit >= 2 && lastDigit <= 4) {
		form = 'few'
	} else {
		form = 'many'
	}

	if (groupIndex === 1) {
		// Thousands
		return THOUSANDS[form]
	} else if (groupIndex === 2) {
		// Millions
		return MILLIONS[form]
	}

	return ''
}

// Number words in Russian
const ONES: Record<number, string> = {
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

const TEENS: Record<number, string> = {
	0: 'десять',
	1: 'одиннадцать',
	2: 'двенадцать',
	3: 'тринадцать',
	4: 'четырнадцать',
	5: 'пятнадцать',
	6: 'шестнадцать',
	7: 'семнадцать',
	8: 'восемнадцать',
	9: 'девятнадцать',
}

const TENS: Record<number, string> = {
	2: 'двадцать',
	3: 'тридцать',
	4: 'сорок',
	5: 'пятьдесят',
	6: 'шестьдесят',
	7: 'семьдесят',
	8: 'восемьдесят',
	9: 'девяносто',
}

const THOUSANDS: Record<'one' | 'few' | 'many', string> = {
	one: 'тысяча',
	few: 'тысячи',
	many: 'тысяч',
}

const MILLIONS: Record<'one' | 'few' | 'many', string> = {
	one: 'миллион',
	few: 'миллиона',
	many: 'миллионов',
}

