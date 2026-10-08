/**
 * Greatest Common Divisor (Euclidean algorithm).
 * Preserves the historical gcd calculator formula semantics.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

function euclideanGcd(a: number, b: number): number {
	let x = Math.abs(Math.round(a))
	let y = Math.abs(Math.round(b))
	while (y !== 0) {
		const remainder = x % y
		x = y
		y = remainder
	}
	return x
}

export const calculateGcd: CalculationFunction = (inputs) => {
	const a = Number(inputs.a)
	const b = Number(inputs.b)

	if (!Number.isFinite(a) || !Number.isFinite(b) || a < 1 || b < 1) {
		return { result: null }
	}

	return { result: euclideanGcd(a, b) }
}

registerCalculation('calculateGcd', calculateGcd)
