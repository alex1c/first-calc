/**
 * Formats a number in Indian numbering system
 * Indian system uses lakhs (100,000) and crores (10,000,000)
 * Format: 1,00,000 (lakh), 1,00,00,000 (crore)
 *
 * @param n - Number to format
 * @returns Formatted string in Indian numbering system
 */
export function formatIndianNumber(n: number): string {
	if (!Number.isFinite(n)) {
		throw new Error('Invalid number')
	}

	// Convert to string and split by decimal point if present
	const parts = n.toString().split('.')
	const integerPart = parts[0]
	const decimalPart = parts[1]

	// Handle negative sign
	const isNegative = integerPart.startsWith('-')
	const digits = isNegative ? integerPart.slice(1) : integerPart

	// Format integer part in Indian system
	// First 3 digits from right, then groups of 2
	let formatted = ''
	const len = digits.length

	if (len <= 3) {
		formatted = digits
	} else {
		// Last 3 digits
		formatted = digits.slice(-3)

		// Remaining digits in groups of 2
		for (let i = len - 3; i > 0; i -= 2) {
			const start = Math.max(0, i - 2)
			const group = digits.slice(start, i)
			formatted = group + ',' + formatted
		}
	}

	// Add negative sign if needed
	if (isNegative) {
		formatted = '-' + formatted
	}

	// Add decimal part if present
	if (decimalPart) {
		formatted += '.' + decimalPart
	}

	return formatted
}

