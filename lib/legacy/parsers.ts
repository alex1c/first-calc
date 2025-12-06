/**
 * Helper functions for parsing and validating ranges
 */

export interface RangeValidation {
	valid: boolean
	error?: string
}

/**
 * Generate array of numbers in a range
 * @param start - Start of range
 * @param end - End of range
 * @param maxCount - Maximum number of values to generate
 * @returns Array of numbers
 */
export function generateRange(
	start: number,
	end: number,
	maxCount: number,
): number[] {
	const range = end - start + 1
	const count = Math.min(range, maxCount)

	// If range is too large, sample evenly
	if (range > maxCount) {
		const step = Math.ceil(range / maxCount)
		const numbers: number[] = []
		for (let i = 0; i < count; i++) {
			numbers.push(start + i * step)
		}
		return numbers
	}

	// Generate all numbers in range
	return Array.from({ length: count }, (_, i) => start + i)
}

/**
 * Validate a number range
 * @param start - Start of range
 * @param end - End of range
 * @param minValue - Minimum allowed value
 * @param maxValue - Maximum allowed value
 * @param maxRangeSize - Maximum allowed range size
 * @returns Validation result
 */
export function validateRange(
	start: number,
	end: number,
	minValue: number,
	maxValue: number,
	maxRangeSize: number,
): RangeValidation {
	if (isNaN(start) || isNaN(end)) {
		return { valid: false, error: 'Invalid number format' }
	}

	if (start < minValue || end > maxValue) {
		return {
			valid: false,
			error: `Range must be between ${minValue} and ${maxValue}`,
		}
	}

	if (start > end) {
		return { valid: false, error: 'Start must be less than or equal to end' }
	}

	const rangeSize = end - start + 1
	if (rangeSize > maxRangeSize) {
		return {
			valid: false,
			error: `Range size (${rangeSize}) exceeds maximum (${maxRangeSize})`,
		}
	}

	return { valid: true }
}
