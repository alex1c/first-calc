/**
 * Least Common Multiple via GCD.
 * Rejects fractional inputs and unsafe integer overflow.
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
	if (!Number.isSafeInteger(value)) {
		throw new Error(`${name} exceeds the safe integer range`)
	}
}

export const calculateLcm: CalculationFunction = (inputs) => {
	const a = Number(inputs.a)
	const b = Number(inputs.b)

	assertPositiveInteger('a', a)
	assertPositiveInteger('b', b)

	const absA = Math.abs(a)
	const absB = Math.abs(b)
	const gcd = euclideanGcd(absA, absB)

	// Compute |a*b|/gcd with overflow checks using division-first ordering
	const reducedA = absA / gcd
	if (!Number.isSafeInteger(reducedA * absB)) {
		throw new Error('LCM result exceeds the safe integer range')
	}

	const result = reducedA * absB
	if (!Number.isFinite(result) || !Number.isSafeInteger(result)) {
		throw new Error('LCM result exceeds the safe integer range')
	}

	return { result }
}

registerCalculation('calculateLcm', calculateLcm)
