/**
 * Perimeter calculation functions
 * Calculates perimeter for different geometric shapes
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate perimeter based on selected shape
 * 
 * Supported shapes:
 * - circle: requires radius → P = 2πr
 * - square: requires side → P = 4a
 * - rectangle: requires length and width → P = 2(l+w)
 * - triangle: requires three sides (a, b, c) → P = a+b+c
 * 
 * @param inputs - Input values including shape type and shape-specific dimensions
 * @returns Calculated perimeter and shape information
 */
export function calculatePerimeter(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const shape = String(inputs.shape || 'circle').toLowerCase()
	
	let perimeter = 0
	let formula = ''
	let shapeName = ''
	
	switch (shape) {
		case 'circle': {
			const radius = Number(inputs.radius)
			if (isNaN(radius) || radius <= 0) {
				throw new Error('Radius must be a positive number')
			}
			perimeter = 2 * Math.PI * radius
			formula = `P = 2πr = 2 × π × ${radius} ≈ ${perimeter.toFixed(4)}`
			shapeName = 'Circle'
			break
		}
		
		case 'square': {
			const side = Number(inputs.side)
			if (isNaN(side) || side <= 0) {
				throw new Error('Side must be a positive number')
			}
			perimeter = 4 * side
			formula = `P = 4a = 4 × ${side} = ${perimeter}`
			shapeName = 'Square'
			break
		}
		
		case 'rectangle': {
			const length = Number(inputs.length)
			const width = Number(inputs.width)
			if (isNaN(length) || length <= 0) {
				throw new Error('Length must be a positive number')
			}
			if (isNaN(width) || width <= 0) {
				throw new Error('Width must be a positive number')
			}
			perimeter = 2 * (length + width)
			formula = `P = 2(l+w) = 2 × (${length} + ${width}) = ${perimeter}`
			shapeName = 'Rectangle'
			break
		}
		
		case 'triangle': {
			const sideA = Number(inputs.sideA)
			const sideB = Number(inputs.sideB)
			const sideC = Number(inputs.sideC)
			if (isNaN(sideA) || sideA <= 0) {
				throw new Error('Side A must be a positive number')
			}
			if (isNaN(sideB) || sideB <= 0) {
				throw new Error('Side B must be a positive number')
			}
			if (isNaN(sideC) || sideC <= 0) {
				throw new Error('Side C must be a positive number')
			}
			// Triangle inequality check
			if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
				throw new Error('Invalid triangle: the sum of any two sides must be greater than the third side')
			}
			perimeter = sideA + sideB + sideC
			formula = `P = a+b+c = ${sideA} + ${sideB} + ${sideC} = ${perimeter}`
			shapeName = 'Triangle'
			break
		}
		
		default:
			throw new Error(`Unknown shape: ${shape}`)
	}
	
	return {
		perimeter: Number(perimeter.toFixed(6)),
		formula,
		shapeName,
		shape,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculatePerimeter', calculatePerimeter)

