/**
 * Concrete volume calculation function
 * Calculates concrete volume for different construction shapes
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate concrete volume based on selected shape
 * 
 * Supported shapes:
 * - slab: requires length, width, thickness
 * - footing: requires length, width, height
 * - column: requires radius, height
 * 
 * @param inputs - Input values including shape type, dimensions, unit, and waste margin
 * @returns Calculated volume, volume with waste, unit, and explanation
 */
export function calculateConcreteVolume(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string | null | undefined> {
	const shape = String(inputs.shape || 'slab').toLowerCase()
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const includeWaste = 
		inputs.includeWaste === true || (typeof inputs.includeWaste === 'string' && inputs.includeWaste.toLowerCase() === 'true') || 
		inputs.includeWaste === 'true' || 
		(typeof inputs.includeWaste === 'string' && inputs.includeWaste.toLowerCase() === 'true')
	const wastePercent = Number(inputs.wastePercent) || 10
	
	let volume = 0
	let formula = ''
	let shapeName = ''
	
	// Conversion factors for unit conversion
	const isMetric = unit === 'meters' || unit === 'm'
	
	switch (shape) {
		case 'slab': {
			const length = Number(inputs.length)
			const width = Number(inputs.width)
			const thickness = Number(inputs.thickness)
			
			if (isNaN(length) || length <= 0) {
				throw new Error('Length must be a positive number')
			}
			if (isNaN(width) || width <= 0) {
				throw new Error('Width must be a positive number')
			}
			if (isNaN(thickness) || thickness <= 0) {
				throw new Error('Thickness must be a positive number')
			}
			
			volume = length * width * thickness
			formula = `V = length × width × thickness = ${length} × ${width} × ${thickness} = ${volume.toFixed(2)}`
			shapeName = 'Concrete Slab'
			break
		}
		
		case 'footing': {
			const length = Number(inputs.length)
			const width = Number(inputs.width)
			const height = Number(inputs.height)
			
			if (isNaN(length) || length <= 0) {
				throw new Error('Length must be a positive number')
			}
			if (isNaN(width) || width <= 0) {
				throw new Error('Width must be a positive number')
			}
			if (isNaN(height) || height <= 0) {
				throw new Error('Height must be a positive number')
			}
			
			volume = length * width * height
			formula = `V = length × width × height = ${length} × ${width} × ${height} = ${volume.toFixed(2)}`
			shapeName = 'Rectangular Footing'
			break
		}
		
		case 'column': {
			const radius = Number(inputs.radius)
			const height = Number(inputs.height)
			
			if (isNaN(radius) || radius <= 0) {
				throw new Error('Radius must be a positive number')
			}
			if (isNaN(height) || height <= 0) {
				throw new Error('Height must be a positive number')
			}
			
			volume = Math.PI * radius * radius * height
			formula = `V = π × r² × height = π × ${radius}² × ${height} ≈ ${volume.toFixed(2)}`
			shapeName = 'Cylindrical Column'
			break
		}
		
		default:
			throw new Error(`Unknown shape: ${shape}`)
	}
	
	// Calculate volume with waste if requested
	let volumeWithWaste = volume
	if (includeWaste) {
		volumeWithWaste = volume * (1 + wastePercent / 100)
	}
	
	// Determine unit labels
	const volumeUnit = isMetric ? 'm³' : 'ft³'
	const volumeUnitFull = isMetric ? 'cubic meters' : 'cubic feet'
	
	// Create explanation
	let explanation = `The ${shapeName.toLowerCase()} requires ${volume.toFixed(2)} ${volumeUnitFull} of concrete.`
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${volumeWithWaste.toFixed(2)} ${volumeUnitFull}.`
	} else {
		explanation += ` Consider adding 5-10% extra for waste, spillage, and formwork variations.`
	}
	
	return {
		volume: Number(volume.toFixed(4)),
		volumeWithWaste: includeWaste ? Number(volumeWithWaste.toFixed(4)) : volume,
		volumeUnit,
		volumeUnitFull,
		formula,
		shapeName,
		shape,
		unit,
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateConcreteVolume', calculateConcreteVolume)

