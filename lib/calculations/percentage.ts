import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate percentage of a number
 * Inputs: value, percent
 * Outputs: result
 */
export const calculatePercentageOfNumber: CalculatorFunction = (inputs) => {
	const value = Number(inputs.value)
	const percent = Number(inputs.percent)

	if (isNaN(value) || isNaN(percent)) {
		return { result: null }
	}

	const result = (value * percent) / 100

	return {
		result: Math.round(result * 100) / 100, // Round to 2 decimal places
	}
}

/**
 * Calculate what percentage one number is of another
 * Inputs: part, total
 * Outputs: percentage
 */
export const calculatePercentageFromPart: CalculatorFunction = (inputs) => {
	const part = Number(inputs.part)
	const total = Number(inputs.total)

	if (isNaN(part) || isNaN(total) || total === 0) {
		return { percentage: null }
	}

	const percentage = (part / total) * 100

	return {
		percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
	}
}
