import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Add percentage to a number
 * Inputs: value, percent
 * Outputs: result
 */
export const calculateAddPercentage: CalculationFunction = (inputs) => {
	const value = Number(inputs.value)
	const percent = Number(inputs.percent)

	if (isNaN(value) || isNaN(percent)) {
		return { result: null }
	}

	const result = value * (1 + percent / 100)

	return {
		result: Math.round(result * 100) / 100, // Round to 2 decimal places
	}
}









