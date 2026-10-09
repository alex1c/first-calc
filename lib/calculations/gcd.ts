/**
 * Greatest Common Divisor (Euclidean algorithm).
 * Rejects fractional inputs instead of silently rounding.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

function euclideanGcd(a: number, b: number): number {
	let x = Math.abs(a)
	let y = Math.abs(b)
	while (y !== 0) {
		const remainder = x % y
		x = y
		y = remainder
	}
	return x
}

function assertPositiveInteger(name: string, value: number): void {
	if (!Number.isFinite(value)) {
		throw new Error(`${name} must be a finite number`)
	}
	if (!Number.isInteger(value)) {
		throw new Error(`${name} must be an integer (fractional values are not allowed)`)
	}
	if (value < 1) {
		throw new Error(`${name} must be a positive integer (≥ 1)`)
	}
}

export const calculateGcd: CalculationFunction = (inputs) => {
	const a = Number(inputs.a)
	const b = Number(inputs.b)

	assertPositiveInteger('a', a)
	assertPositiveInteger('b', b)

	return { result: euclideanGcd(a, b) }
}

registerCalculation('calculateGcd', calculateGcd)
