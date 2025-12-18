/**
 * Area calculation functions
 * Calculates area for different geometric shapes
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate area based on selected shape
 * 
 * Supported shapes:
 * - circle: requires radius
 * - square: requires side
 * - rectangle: requires length and width
 * - triangle: requires base and height
 * 
 * @param inputs - Input values including shape type and shape-specific dimensions
 * @returns Calculated area and shape information
 */
export function calculateArea(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const shape = String(inputs.shape || inputs.figureType || 'circle').toLowerCase()
	
	let area = 0
	let formula = ''
	let shapeName = ''
	
	switch (shape) {
		case 'circle': {
			const radius = Number(inputs.radius)
			if (isNaN(radius) || radius <= 0) {
				throw new Error('Radius must be a positive number')
			}
			area = Math.PI * radius * radius
			formula = `π × r² = π × ${radius}² ≈ ${area.toFixed(4)}`
			shapeName = 'Circle'
			break
		}
		
		case 'square': {
			const side = Number(inputs.side)
			if (isNaN(side) || side <= 0) {
				throw new Error('Side must be a positive number')
			}
			area = side * side
			formula = `a² = ${side}² = ${area}`
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
			area = length * width
			formula = `l × w = ${length} × ${width} = ${area}`
			shapeName = 'Rectangle'
			break
		}
		
		case 'triangle': {
			const base = Number(inputs.base)
			const height = Number(inputs.height)
			if (isNaN(base) || base <= 0) {
				throw new Error('Base must be a positive number')
			}
			if (isNaN(height) || height <= 0) {
				throw new Error('Height must be a positive number')
			}
			area = (base * height) / 2
			formula = `(b × h) / 2 = (${base} × ${height}) / 2 = ${area}`
			shapeName = 'Triangle'
			break
		}
		
		default:
			throw new Error(`Unknown shape: ${shape}`)
	}
	
	return {
		area: Number(area.toFixed(6)),
		formula,
		shapeName,
		shape,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateArea', calculateArea)

