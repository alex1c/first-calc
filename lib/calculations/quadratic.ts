/**
 * Quadratic equation calculation functions
 * Solves quadratic equations of the form ax² + bx + c = 0
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate roots of quadratic equation ax² + bx + c = 0
 * 
 * Formula: D = b² - 4ac
 * 
 * Cases:
 * - D > 0: two real roots: x₁ = (-b + √D) / 2a, x₂ = (-b - √D) / 2a
 * - D = 0: one real root: x = -b / 2a
 * - D < 0: no real roots (complex roots exist)
 * 
 * @param inputs - Input values: a, b, c
 * @returns Discriminant, roots, explanation, and formula
 */
export function calculateQuadratic(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const a = Number(inputs.a)
	const b = Number(inputs.b)
	const c = Number(inputs.c)
	
	if (isNaN(a)) {
		throw new Error('Coefficient a must be a number')
	}
	if (isNaN(b)) {
		throw new Error('Coefficient b must be a number')
	}
	if (isNaN(c)) {
		throw new Error('Coefficient c must be a number')
	}
	if (a === 0) {
		throw new Error('Coefficient a cannot be zero (not a quadratic equation)')
	}
	
	// Calculate discriminant
	const discriminant = b * b - 4 * a * c
	
	// Build formula string
	const aStr = a === 1 ? '' : a === -1 ? '-' : String(a)
	const bStr = b === 0 ? '' : b === 1 ? '+' : b === -1 ? '-' : b > 0 ? `+${b}` : String(b)
	const cStr = c === 0 ? '' : c > 0 ? `+${c}` : String(c)
	const equationStr = `${aStr}x² ${bStr ? bStr + 'x' : ''} ${cStr || ''} = 0`.replace(/\s+/g, ' ').trim()
	
	let roots: number[] | string = []
	let explanation = ''
	let formula = ''
	
	if (discriminant > 0) {
		// Two real roots
		const sqrtD = Math.sqrt(discriminant)
		const root1 = (-b + sqrtD) / (2 * a)
		const root2 = (-b - sqrtD) / (2 * a)
		roots = [root1, root2].sort((x, y) => x - y) // Sort ascending
		
		formula = `x₁ = (-b + √D) / 2a = (-${b} + √${discriminant}) / (2 × ${a}) = (-${b} + ${sqrtD.toFixed(6)}) / ${2 * a} ≈ ${root1.toFixed(6)}\n` +
			`x₂ = (-b - √D) / 2a = (-${b} - √${discriminant}) / (2 × ${a}) = (-${b} - ${sqrtD.toFixed(6)}) / ${2 * a} ≈ ${root2.toFixed(6)}`
		
		explanation = `The discriminant D = ${discriminant} > 0, so the equation has two distinct real roots: x₁ ≈ ${root1.toFixed(6)} and x₂ ≈ ${root2.toFixed(6)}.`
	} else if (discriminant === 0) {
		// One real root (repeated)
		const root = -b / (2 * a)
		roots = [root]
		
		formula = `x = -b / 2a = -${b} / (2 × ${a}) = ${root.toFixed(6)}`
		
		explanation = `The discriminant D = ${discriminant} = 0, so the equation has one real root (repeated): x = ${root.toFixed(6)}.`
	} else {
		// No real roots (complex roots)
		const sqrtAbsD = Math.sqrt(-discriminant)
		const realPart = -b / (2 * a)
		const imagPart = sqrtAbsD / (2 * a)
		
		roots = 'No real roots'
		
		formula = `D = ${discriminant} < 0, so there are no real roots.\n` +
			`Complex roots: x₁ = ${realPart.toFixed(6)} + ${imagPart.toFixed(6)}i, x₂ = ${realPart.toFixed(6)} - ${imagPart.toFixed(6)}i`
		
		explanation = `The discriminant D = ${discriminant} < 0, so the equation has no real roots. The roots are complex numbers: x₁ = ${realPart.toFixed(6)} + ${imagPart.toFixed(6)}i and x₂ = ${realPart.toFixed(6)} - ${imagPart.toFixed(6)}i.`
	}
	
	return {
		discriminant: Number(discriminant.toFixed(6)),
		roots: Array.isArray(roots) ? roots.map(r => Number(r.toFixed(6))) : roots,
		explanation,
		formula,
		equation: equationStr,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateQuadratic', calculateQuadratic)




