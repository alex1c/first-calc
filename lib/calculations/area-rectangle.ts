/**
 * Rectangle area with overflow protection on the product.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

export const calculateAreaRectangle: CalculationFunction = (inputs) => {
	const length = Number(inputs.length)
	const width = Number(inputs.width)

	if (!Number.isFinite(length) || !Number.isFinite(width)) {
		throw new Error('Rectangle dimensions must be finite numbers')
	}
	if (length < 0 || width < 0) {
		throw new Error('Rectangle dimensions must be non-negative')
	}

	const result = length * width
	if (!Number.isFinite(result)) {
		throw new Error('Rectangle area overflowed')
	}

	return { result }
}

registerCalculation('calculateAreaRectangle', calculateAreaRectangle)