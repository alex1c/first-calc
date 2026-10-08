/**
 * Least Common Multiple via GCD.
 * Preserves the historical lcm calculator formula semantics.
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

export const calculateLcm: CalculationFunction = (inputs) => {
	const a = Number(inputs.a)
	const b = Number(inputs.b)

	if (!Number.isFinite(a) || !Number.isFinite(b) || a < 1 || b < 1) {
		return { result: null }
	}

	const absA = Math.abs(Math.round(a))
	const absB = Math.abs(Math.round(b))
	const gcd = euclideanGcd(absA, absB)
	return { result: Math.abs(absA * absB) / gcd }
}

registerCalculation('calculateLcm', calculateLcm)
