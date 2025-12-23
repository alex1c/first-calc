/**
 * Sand calculation function
 * Calculates required sand amount for concrete or masonry work based on volume and mix ratio
 */

import type { CalculationFunction } from './registry'

/**
 * Sand density in kg/m³ (standard value for dry sand)
 */
const SAND_DENSITY = 1600 // kg/m³

/**
 * Calculate sand required based on concrete/mortar volume and mix ratio
 * 
 * Mix ratios:
 * - Concrete: cement:sand:gravel (e.g., 1:2:4)
 * - Masonry mortar: cement:sand (e.g., 1:3)
 * 
 * @param inputs - Input values including volume, mix ratio, density, and waste margin
 * @returns Calculated sand weight, volume, and explanation
 */
export function calculateSand(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get concrete/mortar volume
	const volume = Number(inputs.concreteVolume)
	if (isNaN(volume) || volume <= 0) {
		throw new Error('Volume must be a positive number')
	}
	
	// Convert to cubic meters if needed (for calculations)
	let volumeM3 = volume
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		volumeM3 = volume * 0.0283168
	}
	
	// Get mix ratio
	const mixRatio = String(inputs.mixRatio || '1:2:4')
	
	// Parse mix ratio
	let cementPart = 1
	let sandPart = 2
	let gravelPart = 4
	let isMasonry = false
	let mixRatioToParse = mixRatio
	
	// If custom mix ratio is selected, use the customMixRatio input
	if (mixRatio === 'custom') {
		mixRatioToParse = String(inputs.customMixRatio || '1:2:4')
	}
	
	if (mixRatioToParse === '1:2:4') {
		cementPart = 1
		sandPart = 2
		gravelPart = 4
		isMasonry = false
	} else if (mixRatioToParse === '1:3:6') {
		cementPart = 1
		sandPart = 3
		gravelPart = 6
		isMasonry = false
	} else if (mixRatioToParse === '1:3') {
		// Masonry mortar
		cementPart = 1
		sandPart = 3
		gravelPart = 0
		isMasonry = true
	} else if (mixRatioToParse.includes(':')) {
		// Custom mix ratio
		const parts = mixRatioToParse.split(':').map((p) => Number(p.trim()))
		if (parts.length === 2) {
			// Masonry mortar format (cement:sand)
			cementPart = parts[0]
			sandPart = parts[1]
			gravelPart = 0
			isMasonry = true
		} else if (parts.length === 3) {
			// Concrete format (cement:sand:gravel)
			if (parts.some((p) => isNaN(p) || p <= 0)) {
				throw new Error('Invalid mix ratio format. Use format like 1:2:4 or 1:3')
			}
			cementPart = parts[0]
			sandPart = parts[1]
			gravelPart = parts[2]
			isMasonry = false
		} else {
			throw new Error('Invalid mix ratio format. Use format like 1:2:4 or 1:3')
		}
	} else {
		throw new Error('Invalid mix ratio. Use format like 1:2:4 or 1:3')
	}
	
	// Calculate total parts
	const totalParts = cementPart + sandPart + (gravelPart || 0)
	
	// Calculate sand volume in m³
	const sandVolumeM3 = volumeM3 * (sandPart / totalParts)
	
	// Get sand density (user can override default)
	const sandDensity = Number(inputs.sandDensity) || SAND_DENSITY
	if (isNaN(sandDensity) || sandDensity <= 0) {
		throw new Error('Sand density must be a positive number')
	}
	
	// Convert volume to weight (kg)
	const sandWeightKg = sandVolumeM3 * sandDensity
	
	// Calculate tons (for large volumes)
	const sandWeightTons = sandWeightKg / 1000
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let sandWeightWithWaste = sandWeightKg
	let sandVolumeWithWaste = sandVolumeM3
	let sandWeightTonsWithWaste = sandWeightTons
	
	if (includeWaste) {
		sandWeightWithWaste = sandWeightKg * (1 + wastePercent / 100)
		sandVolumeWithWaste = sandVolumeM3 * (1 + wastePercent / 100)
		sandWeightTonsWithWaste = sandWeightWithWaste / 1000
	}
	
	// Convert sand volume to display unit
	const sandVolumeDisplay = isMetric ? sandVolumeM3 : sandVolumeM3 * 35.3147 // m³ to ft³
	const sandVolumeDisplayWithWaste = isMetric ? sandVolumeWithWaste : sandVolumeWithWaste * 35.3147
	
	// Create explanation
	const mixRatioDisplay = isMasonry 
		? `${cementPart}:${sandPart}` 
		: `${cementPart}:${sandPart}:${gravelPart}`
	const mixType = isMasonry ? 'mortar' : 'concrete'
	
	let explanation = `For ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'} of ${mixType} with a ${mixRatioDisplay} mix ratio, you need approximately ${sandWeightKg.toFixed(2)} kg (${sandVolumeM3.toFixed(4)} m³) of sand.`
	
	if (sandWeightKg >= 1000) {
		explanation += ` This is approximately ${sandWeightTons.toFixed(2)} tons.`
	}
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${sandWeightWithWaste.toFixed(2)} kg (${sandVolumeWithWaste.toFixed(4)} m³) of sand.`
		if (sandWeightWithWaste >= 1000) {
			explanation += ` This is approximately ${sandWeightTonsWithWaste.toFixed(2)} tons.`
		}
	} else {
		explanation += ` Consider adding 10% extra for waste, compaction, and handling losses.`
	}
	
	// Add note about dry vs wet sand
	explanation += ` Note: This calculation uses dry sand density (${sandDensity} kg/m³). Wet sand has higher density and may require adjustment.`
	
	// Create formula explanation
	const formula = `Sand Volume = ${mixType === 'mortar' ? 'Mortar' : 'Concrete'} Volume × (Sand Part / Total Parts) = ${volumeM3.toFixed(4)} × (${sandPart} / ${totalParts}) = ${sandVolumeM3.toFixed(4)} m³\nSand Weight = Sand Volume × Density = ${sandVolumeM3.toFixed(4)} × ${sandDensity} = ${sandWeightKg.toFixed(2)} kg`
	
	return {
		sandWeight: Number(sandWeightKg.toFixed(2)),
		sandWeightWithWaste: includeWaste ? Number(sandWeightWithWaste.toFixed(2)) : sandWeightKg,
		sandVolume: Number(sandVolumeM3.toFixed(4)),
		sandVolumeWithWaste: includeWaste ? Number(sandVolumeWithWaste.toFixed(4)) : sandVolumeM3,
		sandVolumeDisplay: Number(sandVolumeDisplay.toFixed(4)),
		sandVolumeDisplayWithWaste: includeWaste ? Number(sandVolumeDisplayWithWaste.toFixed(4)) : sandVolumeDisplay,
		sandWeightTons: Number(sandWeightTons.toFixed(2)),
		sandWeightTonsWithWaste: includeWaste ? Number(sandWeightTonsWithWaste.toFixed(2)) : sandWeightTons,
		mixRatio: mixRatioDisplay,
		mixType,
		isMasonry: isMasonry ? 'true' : 'false',
		cementPart,
		sandPart,
		gravelPart: gravelPart || 0,
		totalParts,
		volume: volumeM3,
		volumeDisplay: volume,
		unit: isMetric ? 'meters' : 'feet',
		volumeUnit: isMetric ? 'm³' : 'ft³',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
		formula,
		sandDensity,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateSand', calculateSand)


