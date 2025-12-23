/**
 * Volume calculation functions
 * Calculates volume for different 3D geometric shapes
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate volume based on selected shape
 * 
 * Supported shapes:
 * - cube: requires side
 * - sphere: requires radius
 * - cylinder: requires radius and height
 * - cone: requires radius and height
 * 
 * @param inputs - Input values including shape type and shape-specific dimensions
 * @returns Calculated volume and shape information
 */
export function calculateVolume(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const shape = String(inputs.shape || 'cube').toLowerCase()
	
	let volume = 0
	let formula = ''
	let shapeName = ''
	
	switch (shape) {
		case 'cube': {
			const side = Number(inputs.side)
			if (isNaN(side) || side <= 0) {
				throw new Error('Side must be a positive number')
			}
			volume = side * side * side
			formula = `V = a³ = ${side}³ = ${volume}`
			shapeName = 'Cube'
			break
		}
		
		case 'sphere': {
			const radius = Number(inputs.radius)
			if (isNaN(radius) || radius <= 0) {
				throw new Error('Radius must be a positive number')
			}
			volume = (4 / 3) * Math.PI * radius * radius * radius
			formula = `V = (4/3) × π × r³ = (4/3) × π × ${radius}³ ≈ ${volume.toFixed(4)}`
			shapeName = 'Sphere'
			break
		}
		
		case 'cylinder': {
			const radius = Number(inputs.radius)
			const height = Number(inputs.height)
			if (isNaN(radius) || radius <= 0) {
				throw new Error('Radius must be a positive number')
			}
			if (isNaN(height) || height <= 0) {
				throw new Error('Height must be a positive number')
			}
			volume = Math.PI * radius * radius * height
			formula = `V = π × r² × h = π × ${radius}² × ${height} ≈ ${volume.toFixed(4)}`
			shapeName = 'Cylinder'
			break
		}
		
		case 'cone': {
			const radius = Number(inputs.radius)
			const height = Number(inputs.height)
			if (isNaN(radius) || radius <= 0) {
				throw new Error('Radius must be a positive number')
			}
			if (isNaN(height) || height <= 0) {
				throw new Error('Height must be a positive number')
			}
			volume = (1 / 3) * Math.PI * radius * radius * height
			formula = `V = (1/3) × π × r² × h = (1/3) × π × ${radius}² × ${height} ≈ ${volume.toFixed(4)}`
			shapeName = 'Cone'
			break
		}
		
		default:
			throw new Error(`Unknown shape: ${shape}`)
	}
	
	return {
		volume: Number(volume.toFixed(6)),
		formula,
		shapeName,
		shape,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateVolume', calculateVolume)




