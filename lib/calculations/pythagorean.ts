/**
 * Pythagorean theorem calculation functions
 * Calculates sides of right triangles using a² + b² = c²
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate using Pythagorean theorem
 * 
 * Modes:
 * - hypotenuse: find c from a and b → c = √(a² + b²)
 * - leg: find b from c and a → b = √(c² − a²)
 * 
 * @param inputs - Input values including mode and side lengths
 * @returns Calculated side, formula, and explanation
 */
export function calculatePythagorean(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string> {
	const mode = String(inputs.mode || 'hypotenuse').toLowerCase()
	
	let result = 0
	let formula = ''
	let explanation = ''
	
	if (mode === 'hypotenuse') {
		// Find hypotenuse: c = √(a² + b²)
		const a = Number(inputs.a)
		const b = Number(inputs.b)
		
		if (isNaN(a) || a <= 0) {
			throw new Error('Side a must be a positive number')
		}
		if (isNaN(b) || b <= 0) {
			throw new Error('Side b must be a positive number')
		}
		
		result = Math.sqrt(a * a + b * b)
		formula = `c = √(a² + b²) = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${a * a + b * b} ≈ ${result.toFixed(6)}`
		explanation = `The hypotenuse (c) of a right triangle with legs a=${a} and b=${b} is approximately ${result.toFixed(6)} units.`
	} else if (mode === 'leg') {
		// Find missing leg: b = √(c² − a²)
		const c = Number(inputs.c)
		const a = Number(inputs.a)
		
		if (isNaN(c) || c <= 0) {
			throw new Error('Hypotenuse c must be a positive number')
		}
		if (isNaN(a) || a <= 0) {
			throw new Error('Side a must be a positive number')
		}
		if (c <= a) {
			throw new Error('Hypotenuse c must be greater than side a')
		}
		
		const cSquared = c * c
		const aSquared = a * a
		const difference = cSquared - aSquared
		
		if (difference < 0) {
			throw new Error('Invalid triangle: c² must be greater than a²')
		}
		
		result = Math.sqrt(difference)
		formula = `b = √(c² − a²) = √(${c}² − ${a}²) = √(${cSquared} − ${aSquared}) = √${difference} ≈ ${result.toFixed(6)}`
		explanation = `The missing leg (b) of a right triangle with hypotenuse c=${c} and leg a=${a} is approximately ${result.toFixed(6)} units.`
	} else {
		throw new Error(`Unknown mode: ${mode}`)
	}
	
	return {
		result: Number(result.toFixed(6)),
		formula,
		explanation,
		mode,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculatePythagorean', calculatePythagorean)




