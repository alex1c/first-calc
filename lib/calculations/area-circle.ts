/**
 * Circle area and circumference.
 * Preserves historical area-circle multi-output semantics.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

export const calculateAreaCircle: CalculationFunction = (inputs) => {
	const radius = Number(inputs.radius)

	if (!Number.isFinite(radius) || radius < 0) {
		return { area: null, circumference: null }
	}

	const area = Math.PI * radius * radius
	const circumference = 2 * Math.PI * radius
	return { area, circumference }
}

registerCalculation('calculateAreaCircle', calculateAreaCircle)
