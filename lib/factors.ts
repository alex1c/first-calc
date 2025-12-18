/**
 * Finds all factors (divisors) of a number
 *
 * @param n - Number to factorize
 * @returns Array of factors in ascending order
 */
export function getFactors(n: number): number[] {
	if (!Number.isInteger(n) || n < 1) {
		throw new Error('Number must be a positive integer')
	}

	if (n === 1) {
		return [1]
	}

	const factors: number[] = []
	const sqrt = Math.sqrt(n)

	// Find factors up to square root
	for (let i = 1; i <= sqrt; i++) {
		if (n % i === 0) {
			factors.push(i)
			// Add corresponding factor (n / i) if it's different
			if (i !== n / i) {
				factors.push(n / i)
			}
		}
	}

	// Sort factors in ascending order
	return factors.sort((a, b) => a - b)
}

/**
 * Checks if a number is prime
 *
 * @param n - Number to check
 * @returns True if the number is prime
 */
export function isPrime(n: number): boolean {
	if (n < 2) return false
	if (n === 2) return true
	if (n % 2 === 0) return false

	const sqrt = Math.sqrt(n)
	for (let i = 3; i <= sqrt; i += 2) {
		if (n % i === 0) return false
	}

	return true
}

/**
 * Gets prime factors of a number
 *
 * @param n - Number to factorize
 * @returns Array of prime factors with their exponents
 */
export function getPrimeFactors(n: number): Array<{ factor: number; exponent: number }> {
	if (!Number.isInteger(n) || n < 2) {
		return []
	}

	const factors: Array<{ factor: number; exponent: number }> = []
	let remaining = n
	let divisor = 2

	while (remaining > 1) {
		if (remaining % divisor === 0) {
			let exponent = 0
			while (remaining % divisor === 0) {
				remaining /= divisor
				exponent++
			}
			factors.push({ factor: divisor, exponent })
		}
		divisor++
	}

	return factors
}






