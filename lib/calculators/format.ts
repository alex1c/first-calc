/**
 * Formatting utilities for calculator outputs
 * Client-side formatting functions
 */

/**
 * Format a value based on format type
 */
export function formatOutputValue(
	value: number | string | null,
	formatType?: 'number' | 'currency' | 'percentage' | 'default',
	unitLabel?: string,
): string {
	if (value === null || value === undefined) {
		return '—'
	}

	if (typeof value === 'string') {
		return value
	}

	switch (formatType) {
		case 'currency':
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(value)
		case 'percentage':
			return `${value.toFixed(2)}%`
		case 'number':
			return new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}).format(value)
		default:
			return String(value)
	}
}






