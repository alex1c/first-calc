/**
 * Equation solver calculation functions
 * Supports linear and quadratic equations with step-by-step solutions
 */

import type { CalculationFunction } from './registry'

/**
 * Parsed equation coefficients
 */
interface ParsedCoefficients {
	a: number
	b: number
	c?: number // Only for quadratic
}

/**
 * Step in the solution process
 */
export interface SolutionStep {
	title: string
	math: string
	explanation: string
}

/**
 * Solution result structure
 */
interface SolutionResult {
	equationType: 'linear' | 'quadratic'
	normalizedForm: string
	steps: SolutionStep[]
	result: string | number | number[]
	discriminant?: number
	roots?: number[] | string
}

/**
 * Parse linear equation from text
 * Supports formats: ax + b = c, ax + b = dx + e
 */
function parseLinearEquation(text: string): ParsedCoefficients {
	// Normalize input: remove spaces, convert x² to x^2, handle x²
	let normalized = text.replace(/\s+/g, '').replace(/x²/g, 'x^2').replace(/x\^2/g, '')
	
	// Split by =
	const parts = normalized.split('=')
	if (parts.length !== 2) {
		throw new Error('Equation must contain exactly one "=" sign')
	}
	
	const left = parts[0]
	const right = parts[1]
	
	// Parse left side: find coefficient of x and constant
	let leftX = 0
	let leftConst = 0
	
	// Match patterns like: 2x, -3x, x, -x
	const xPattern = /([+-]?\d*)x(?!\^)/g
	let match
	while ((match = xPattern.exec(left)) !== null) {
		const coeff = match[1]
		if (coeff === '' || coeff === '+') {
			leftX += 1
		} else if (coeff === '-') {
			leftX -= 1
		} else {
			leftX += parseFloat(coeff)
		}
	}
	
	// Match constants (numbers without x)
	// Strategy: remove all x terms from the string, then parse remaining numbers
	let leftForConstants = left
	leftForConstants = leftForConstants.replace(/([+-]?\d*)x(?!\^)/g, '')
	
	// Now parse remaining numbers as constants
	const constPattern = /([+-]?\d+)/g
	let constMatch
	while ((constMatch = constPattern.exec(leftForConstants)) !== null) {
		leftConst += parseFloat(constMatch[0])
	}
	
	// Parse right side
	let rightX = 0
	let rightConst = 0
	
	while ((match = xPattern.exec(right)) !== null) {
		const coeff = match[1]
		if (coeff === '' || coeff === '+') {
			rightX += 1
		} else if (coeff === '-') {
			rightX -= 1
		} else {
			rightX += parseFloat(coeff)
		}
	}
	
	while ((match = constPattern.exec(right)) !== null) {
		if (!right.substring(Math.max(0, match.index - 1), match.index).endsWith('x')) {
			rightConst += parseFloat(match[1])
		}
	}
	
	// Bring to form Ax + B = 0
	const a = leftX - rightX
	const b = leftConst - rightConst
	
	return { a, b }
}

/**
 * Parse quadratic equation from text
 * Supports formats: ax^2 + bx + c = 0, x^2 + 5x = 0, x^2 - 4 = 0
 */
function parseQuadraticEquation(text: string): ParsedCoefficients {
	// Normalize input: remove spaces, convert x² to x^2
	let normalized = text.replace(/\s+/g, '').replace(/x²/g, 'x^2')
	
	// Split by =
	const parts = normalized.split('=')
	if (parts.length !== 2) {
		throw new Error('Equation must contain exactly one "=" sign')
	}
	
	const left = parts[0]
	const right = parts[1]
	
	// Parse left side
	let a = 0
	let b = 0
	let c = 0
	
	// Match x^2 terms: ax^2, x^2, -3x^2
	const x2Pattern = /([+-]?\d*)x\^2/g
	let x2Match
	while ((x2Match = x2Pattern.exec(left)) !== null) {
		const coeff = x2Match[1]
		if (coeff === '' || coeff === '+') {
			a += 1
		} else if (coeff === '-') {
			a -= 1
		} else {
			a += parseFloat(coeff)
		}
	}
	
	// Match x terms (not x^2): bx, x, -3x
	const xPattern = /([+-]?\d*)x(?!\^)/g
	let xMatch
	while ((xMatch = xPattern.exec(left)) !== null) {
		const coeff = xMatch[1]
		if (coeff === '' || coeff === '+') {
			b += 1
		} else if (coeff === '-') {
			b -= 1
		} else {
			b += parseFloat(coeff)
		}
	}
	
	// Match constants (standalone numbers, not coefficients)
	// Strategy: remove all x^2 and x terms from the string, then parse remaining numbers
	// This ensures we don't double-count coefficients as constants
	let leftForConstants = left
	
	// Remove all x^2 terms (e.g., "3x^2" -> "")
	leftForConstants = leftForConstants.replace(/([+-]?\d*)x\^2/g, '')
	
	// Remove all x terms (e.g., "5x" -> "")
	leftForConstants = leftForConstants.replace(/([+-]?\d*)x(?!\^)/g, '')
	
	// Now parse remaining numbers as constants
	const constPattern = /([+-]?\d+)/g
	let constMatch
	while ((constMatch = constPattern.exec(leftForConstants)) !== null) {
		c += parseFloat(constMatch[0])
	}
	
	// Parse right side (should be 0 or constant)
	// Right side should only contain constants (no x terms)
	let rightConst = 0
	const rightConstPattern = /([+-]?\d+)/g
	let rightMatch
	while ((rightMatch = rightConstPattern.exec(right)) !== null) {
		rightConst += parseFloat(rightMatch[0])
	}
	
	// Bring to form ax^2 + bx + c = 0
	c -= rightConst
	
	return { a, b, c: c || 0 }
}

/**
 * Solve linear equation ax + b = 0
 */
function solveLinear(a: number, b: number): SolutionResult {
	const steps: SolutionStep[] = []
	
	// Normalized form
	const normalizedForm = `${a === 1 ? '' : a === -1 ? '-' : a}x ${b >= 0 ? '+' : ''}${b} = 0`
	steps.push({
		title: 'Normalized form',
		math: normalizedForm,
		explanation: 'Bringing the equation to standard form Ax + B = 0',
	})
	
	// Special cases
	if (a === 0) {
		if (b === 0) {
			steps.push({
				title: 'Special case',
				math: '0 = 0',
				explanation: 'The equation is always true, so there are infinite solutions',
			})
			return {
				equationType: 'linear',
				normalizedForm,
				steps,
				result: 'infinite solutions',
			}
		} else {
			steps.push({
				title: 'No solutions',
				math: `${b} = 0`,
				explanation: `Since ${b} ≠ 0, the equation has no solutions`,
			})
			return {
				equationType: 'linear',
				normalizedForm,
				steps,
				result: 'no solutions',
			}
		}
	}
	
	// Solve: x = -b/a
	const solution = -b / a
	
	steps.push({
		title: 'Isolate x',
		math: `x = -${b} / ${a}`,
		explanation: `Dividing both sides by ${a} to isolate x`,
	})
	
	steps.push({
		title: 'Solution',
		math: `x = ${solution.toFixed(6)}`,
		explanation: 'The equation has exactly one solution',
	})
	
	return {
		equationType: 'linear',
		normalizedForm,
		steps,
		result: solution,
	}
}

/**
 * Solve quadratic equation ax² + bx + c = 0
 */
function solveQuadratic(a: number, b: number, c: number): SolutionResult {
	const steps: SolutionStep[] = []
	
	// If a = 0, fallback to linear
	if (a === 0) {
		return solveLinear(b, c)
	}
	
	// Normalized form
	const normalizedForm = `${a === 1 ? '' : a === -1 ? '-' : a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`
	steps.push({
		title: 'Normalized form',
		math: normalizedForm,
		explanation: 'The equation is in standard quadratic form ax² + bx + c = 0',
	})
	
	// Calculate discriminant
	const discriminant = b * b - 4 * a * c
	steps.push({
		title: 'Calculate discriminant',
		math: `D = b² - 4ac = ${b}² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}`,
		explanation: 'The discriminant determines the nature of the roots',
	})
	
	if (discriminant > 0) {
		// Two real roots
		const sqrtD = Math.sqrt(discriminant)
		const root1 = (-b + sqrtD) / (2 * a)
		const root2 = (-b - sqrtD) / (2 * a)
		
		steps.push({
			title: 'Two real roots',
			math: `D = ${discriminant} > 0`,
			explanation: 'Since the discriminant is positive, there are two distinct real roots',
		})
		
		steps.push({
			title: 'Calculate roots',
			math: `x₁ = (-b + √D) / 2a = (-${b} + ${sqrtD.toFixed(6)}) / ${2 * a} ≈ ${root1.toFixed(6)}\nx₂ = (-b - √D) / 2a = (-${b} - ${sqrtD.toFixed(6)}) / ${2 * a} ≈ ${root2.toFixed(6)}`,
			explanation: 'Using the quadratic formula to find both roots',
		})
		
		return {
			equationType: 'quadratic',
			normalizedForm,
			steps,
			result: 'two real roots',
			discriminant,
			roots: [root1, root2].sort((x, y) => x - y),
		}
	} else if (discriminant === 0) {
		// One real root
		const root = -b / (2 * a)
		
		steps.push({
			title: 'One real root',
			math: `D = ${discriminant} = 0`,
			explanation: 'Since the discriminant is zero, there is exactly one real root (repeated)',
		})
		
		steps.push({
			title: 'Calculate root',
			math: `x = -b / 2a = -${b} / ${2 * a} = ${root.toFixed(6)}`,
			explanation: 'The root is found using the simplified quadratic formula',
		})
		
		return {
			equationType: 'quadratic',
			normalizedForm,
			steps,
			result: 'one real root',
			discriminant: 0,
			roots: [root],
		}
	} else {
		// No real roots
		steps.push({
			title: 'No real roots',
			math: `D = ${discriminant} < 0`,
			explanation: 'Since the discriminant is negative, there are no real roots. The roots are complex numbers.',
		})
		
		return {
			equationType: 'quadratic',
			normalizedForm,
			steps,
			result: 'no real roots',
			discriminant,
			roots: 'no real roots',
		}
	}
}

/**
 * Main equation solver function
 */
export function solveEquation(
	inputs: Record<string, number | string>,
): Record<string, number | string | SolutionStep[] | number[]> {
	const inputMode = String(inputs.inputMode || 'equation')
	const equationType = String(inputs.equationType || 'linear')
	
	let a: number, b: number, c: number | undefined
	let parsedEquation: string | undefined
	
	if (inputMode === 'coefficients') {
		// Direct coefficients input
		a = Number(inputs.a)
		b = Number(inputs.b)
		c = equationType === 'quadratic' ? Number(inputs.c || 0) : undefined
		
		if (isNaN(a) || isNaN(b)) {
			throw new Error('Coefficients a and b must be numbers')
		}
		if (equationType === 'quadratic' && c !== undefined && isNaN(c)) {
			throw new Error('Coefficient c must be a number')
		}
	} else {
		// Parse from equation text
		const equationText = String(inputs.equationText || '').trim()
		if (!equationText) {
			throw new Error('Please enter an equation')
		}
		
		parsedEquation = equationText
		
		try {
			if (equationType === 'linear') {
				const parsed = parseLinearEquation(equationText)
				a = parsed.a
				b = parsed.b
			} else {
				const parsed = parseQuadraticEquation(equationText)
				a = parsed.a
				b = parsed.b
				c = parsed.c
			}
		} catch (error) {
			throw new Error(
				`Failed to parse equation: ${error instanceof Error ? error.message : 'Invalid format'}. Examples: 2x + 5 = 15 (linear), x^2 + 5x + 6 = 0 (quadratic)`,
			)
		}
	}
	
	// Validate
	if (equationType === 'quadratic' && a === 0) {
		// Fallback to linear
		const result = solveLinear(b, c || 0)
		return {
			equationType: 'linear',
			normalizedForm: result.normalizedForm,
			steps: result.steps,
			result: result.result,
		}
	}
	
	// Solve
	let solution: SolutionResult
	if (equationType === 'linear') {
		solution = solveLinear(a, b)
	} else {
		solution = solveQuadratic(a, b, c || 0)
	}
	
	// Add parsed equation info if available
	if (parsedEquation) {
		solution.steps.unshift({
			title: 'Input equation',
			math: parsedEquation,
			explanation: 'Original equation entered by user',
		})
	}
	
	return {
		equationType: solution.equationType,
		normalizedForm: solution.normalizedForm,
		steps: solution.steps,
		result: typeof solution.result === 'string' ? solution.result : solution.result,
		discriminant: solution.discriminant,
		roots: Array.isArray(solution.roots) ? solution.roots : solution.roots || '',
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

registerCalculation('solveEquation', solveEquation)

