/**
 * Exponentiation with domain checks for negative bases, zero powers, overflow.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

export const calculateExponent: CalculationFunction = (inputs) => {
	const base = Number(inputs.base)
	const exponent = Number(inputs.exponent)

	if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
		throw new Error('Exponent inputs must be finite numbers')
	}

	// 0 raised to a non-positive power is undefined or infinite
	if (base === 0 && exponent <= 0) {
		throw new Error('Zero cannot be raised to a non-positive power')
	}

	// Negative base with a non-integer exponent is not real-valued
	if (base < 0 && !Number.isInteger(exponent)) {
		throw new Error(
			'Negative base with a fractional exponent is not supported',
		)
	}

	const result = Math.pow(base, exponent)
	if (!Number.isFinite(result)) {
		throw new Error('Exponent result overflowed or is not finite')
	}

	return { result }
}

registerCalculation('calculateExponent', calculateExponent)
