/**
 * Strip foundation calculation function
 * Calculates concrete volume for strip/continuous footings based on building dimensions
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate strip foundation concrete volume
 * 
 * Calculates the perimeter of the building and optionally includes internal walls
 * to determine total strip length, then calculates concrete volume.
 * 
 * @param inputs - Input values including building dimensions, strip dimensions, and waste margin
 * @returns Calculated strip length, concrete volume, and breakdown
 */
export function calculateStripFoundation(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get building dimensions
	const buildingLength = Number(inputs.buildingLength)
	const buildingWidth = Number(inputs.buildingWidth)
	
	if (isNaN(buildingLength) || buildingLength <= 0) {
		throw new Error('Building length must be a positive number')
	}
	if (isNaN(buildingWidth) || buildingWidth <= 0) {
		throw new Error('Building width must be a positive number')
	}
	
	// Get strip dimensions
	const stripWidth = Number(inputs.stripWidth)
	const stripHeight = Number(inputs.stripHeight)
	
	if (isNaN(stripWidth) || stripWidth <= 0) {
		throw new Error('Strip width must be a positive number')
	}
	if (isNaN(stripHeight) || stripHeight <= 0) {
		throw new Error('Strip height must be a positive number')
	}
	
	// Get perimeter option
	const perimeterOnly = 
		inputs.perimeterOnly === true || 
		inputs.perimeterOnly === 'true' || 
		String(inputs.perimeterOnly).toLowerCase() === 'true' ||
		inputs.perimeterOnly === undefined // Default to true
	
	// Get internal walls option
	const includeInternalWalls = 
		inputs.includeInternalWalls === true || 
		inputs.includeInternalWalls === 'true' || 
		String(inputs.includeInternalWalls).toLowerCase() === 'true'
	
	// Get internal strip length (optional)
	const internalStripLength = includeInternalWalls 
		? Number(inputs.internalStripLength || 0)
		: 0
	
	if (includeInternalWalls && (isNaN(internalStripLength) || internalStripLength < 0)) {
		throw new Error('Internal strip length must be a non-negative number')
	}
	
	// Calculate perimeter
	const perimeter = 2 * (buildingLength + buildingWidth)
	
	// Calculate total strip length
	let totalStripLength = perimeter
	if (!perimeterOnly && includeInternalWalls) {
		totalStripLength = perimeter + internalStripLength
	}
	
	// Calculate volume
	const volume = totalStripLength * stripWidth * stripHeight
	
	// Convert to cubic meters if needed (for calculations)
	let volumeM3 = volume
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		volumeM3 = volume * 0.0283168
	}
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let volumeWithWaste = volumeM3
	if (includeWaste) {
		volumeWithWaste = volumeM3 * (1 + wastePercent / 100)
	}
	
	// Convert to display units
	const volumeDisplay = isMetric ? volumeM3 : volumeM3 * 35.3147 // m³ to ft³
	const volumeDisplayWithWaste = isMetric ? volumeWithWaste : volumeWithWaste * 35.3147
	
	// Convert to cubic yards for imperial users
	const volumeCubicYards = !isMetric ? volume / 27 : 0
	const volumeCubicYardsWithWaste = !isMetric && includeWaste ? volumeDisplayWithWaste / 27 : 0
	
	// Determine unit labels
	const volumeUnit = isMetric ? 'm³' : 'ft³'
	const volumeUnitFull = isMetric ? 'cubic meters' : 'cubic feet'
	const lengthUnit = isMetric ? 'm' : 'ft'
	
	// Create formula explanation
	let formula = `Perimeter = 2 × (Length + Width) = 2 × (${buildingLength} + ${buildingWidth}) = ${perimeter.toFixed(2)} ${lengthUnit}\n\n`
	
	if (!perimeterOnly && includeInternalWalls && internalStripLength > 0) {
		formula += `Total Strip Length = Perimeter + Internal Walls = ${perimeter.toFixed(2)} + ${internalStripLength.toFixed(2)} = ${totalStripLength.toFixed(2)} ${lengthUnit}\n\n`
	} else {
		formula += `Total Strip Length = Perimeter = ${perimeter.toFixed(2)} ${lengthUnit}\n\n`
	}
	
	formula += `Concrete Volume = Total Length × Width × Height = ${totalStripLength.toFixed(2)} × ${stripWidth} × ${stripHeight} = ${volume.toFixed(2)} ${volumeUnit}`
	
	// Create breakdown
	let breakdown = `Building Dimensions: ${buildingLength} × ${buildingWidth} ${lengthUnit}\n`
	breakdown += `Perimeter: ${perimeter.toFixed(2)} ${lengthUnit}\n`
	
	if (!perimeterOnly && includeInternalWalls && internalStripLength > 0) {
		breakdown += `Internal Walls: ${internalStripLength.toFixed(2)} ${lengthUnit}\n`
	}
	
	breakdown += `Total Strip Length: ${totalStripLength.toFixed(2)} ${lengthUnit}\n`
	breakdown += `Strip Dimensions: ${stripWidth} × ${stripHeight} ${lengthUnit}\n`
	breakdown += `Concrete Volume: ${volume.toFixed(2)} ${volumeUnit} (${volumeM3.toFixed(4)} m³)`
	
	// Create explanation
	let explanation = `For a strip foundation with building dimensions ${buildingLength} × ${buildingWidth} ${lengthUnit}, the perimeter is ${perimeter.toFixed(2)} ${lengthUnit}.`
	
	if (!perimeterOnly && includeInternalWalls && internalStripLength > 0) {
		explanation += ` Including ${internalStripLength.toFixed(2)} ${lengthUnit} of internal load-bearing walls, the total strip length is ${totalStripLength.toFixed(2)} ${lengthUnit}.`
	}
	
	explanation += `\n\nWith strip dimensions ${stripWidth} × ${stripHeight} ${lengthUnit}, you need ${volume.toFixed(2)} ${volumeUnitFull} (${volumeM3.toFixed(4)} m³) of concrete.`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${volumeDisplayWithWaste.toFixed(2)} ${volumeUnitFull} (${volumeWithWaste.toFixed(4)} m³).`
		if (!isMetric) {
			explanation += ` This is approximately ${volumeCubicYardsWithWaste.toFixed(2)} cubic yards.`
		}
	} else {
		explanation += ` Consider adding 5-10% extra for waste, spillage, and formwork variations.`
		if (!isMetric) {
			explanation += ` This is approximately ${volumeCubicYards.toFixed(2)} cubic yards.`
		}
	}
	
	// Add measurement tips
	explanation += `\n\nMeasurement Tips: Measure strip width and height from your foundation drawings or specifications. The strip width is typically 30-60 cm (12-24 inches) depending on load and soil conditions. Strip height (depth) depends on frost line depth and soil bearing capacity - typically 30-100 cm (12-40 inches).`
	
	if (includeInternalWalls) {
		explanation += ` Include internal walls only if they are load-bearing and require strip foundations.`
	}
	
	return {
		perimeter: Number(perimeter.toFixed(2)),
		stripLength: Number(totalStripLength.toFixed(2)),
		internalStripLength: includeInternalWalls ? Number(internalStripLength.toFixed(2)) : 0,
		concreteVolume: Number(volumeM3.toFixed(4)),
		concreteVolumeWithWaste: includeWaste ? Number(volumeWithWaste.toFixed(4)) : volumeM3,
		concreteVolumeDisplay: Number(volumeDisplay.toFixed(2)),
		concreteVolumeDisplayWithWaste: includeWaste ? Number(volumeDisplayWithWaste.toFixed(2)) : volumeDisplay,
		concreteVolumeCubicYards: !isMetric ? Number(volumeCubicYards.toFixed(2)) : 0,
		concreteVolumeCubicYardsWithWaste: !isMetric && includeWaste ? Number(volumeCubicYardsWithWaste.toFixed(2)) : 0,
		volumeUnit,
		volumeUnitFull,
		lengthUnit,
		formula,
		breakdown,
		unit: isMetric ? 'meters' : 'feet',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		perimeterOnly: perimeterOnly ? 'true' : 'false',
		includeInternalWalls: includeInternalWalls ? 'true' : 'false',
		explanation,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateStripFoundation', calculateStripFoundation)

