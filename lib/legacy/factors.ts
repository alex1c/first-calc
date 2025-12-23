/**
 * Factor calculation functions for legacy routes
 * Wrapper around main factors module
 */

import {
	getFactors as getFactorsBase,
	isPrime,
	getPrimeFactors,
} from '@/lib/factors'

/**
 * Calculate all factors of a number
 * @param n - Number to factorize
 * @returns Array of factors
 */
export function calculateFactors(n: number): number[] {
	return getFactorsBase(n)
}

/**
 * Get number classification (prime or composite)
 */
export function getNumberClassification(n: number): {
	type: 'prime' | 'composite'
	divisorCount: number
	sumOfDivisors: number
} {
	const factors = calculateFactors(n)
	const divisorCount = factors.length
	const sumOfDivisors = factors.reduce((sum, factor) => sum + factor, 0)

	return {
		type: isPrime(n) ? 'prime' : 'composite',
		divisorCount,
		sumOfDivisors,
	}
}









