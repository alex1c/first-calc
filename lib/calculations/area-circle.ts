/**
 * Circle area and circumference with overflow protection.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

export const calculateAreaCircle: CalculationFunction = (inputs) => {
	const radius = Number(inputs.radius)

	if (!Number.isFinite(radius)) {
		throw new Error('Radius must be a finite number')
	}
	if (radius < 0) {
		throw new Error('Radius must be non-negative')
	}

	const area = Math.PI * radius * radius
	const circumference = 2 * Math.PI * radius

	if (!Number.isFinite(area) || !Number.isFinite(circumference)) {
		throw new Error('Circle area or circumference overflowed')
	}

	return { area, circumference }
}

registerCalculation('calculateAreaCircle', calculateAreaCircle)
