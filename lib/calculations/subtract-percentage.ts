import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Subtract percentage from a number
 * Inputs: value, percent
 * Outputs: result
 */
export const calculateSubtractPercentage: CalculationFunction = (inputs) => {
	const value = Number(inputs.value)
	const percent = Number(inputs.percent)

	if (isNaN(value) || isNaN(percent)) {
		return { result: null }
	}

	const result = value * (1 - percent / 100)

	return {
		result: Math.round(result * 100) / 100, // Round to 2 decimal places
	}
}









