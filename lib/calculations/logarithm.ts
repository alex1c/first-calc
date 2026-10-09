/**
 * Logarithm with explicit domain checks (base ≠ 1, positive args).
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

export const calculateLogarithm: CalculationFunction = (inputs) => {
	const number = Number(inputs.number)
	const base = Number(inputs.base)

	if (!Number.isFinite(number) || !Number.isFinite(base)) {
		throw new Error('Logarithm inputs must be finite numbers')
	}
	if (number <= 0) {
		throw new Error('Logarithm argument must be greater than 0')
	}
	if (base <= 0 || base === 1) {
		throw new Error('Logarithm base must be greater than 0 and not equal to 1')
	}

	const result = Math.log(number) / Math.log(base)
	if (!Number.isFinite(result)) {
		throw new Error('Logarithm result is not a finite number')
	}

	return { result }
}

registerCalculation('calculateLogarithm', calculateLogarithm)
