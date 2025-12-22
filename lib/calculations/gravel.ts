/**
 * Gravel calculation function
 * Calculates required gravel (aggregate) amount for concrete, base layers, or general construction use
 */

import type { CalculationFunction } from './registry'

/**
 * Gravel density in kg/m³ (standard value for dry gravel)
 */
const GRAVEL_DENSITY = 1500 // kg/m³

/**
 * Calculate gravel required based on volume
 * 
 * Gravel is typically ordered by volume, but weight calculation helps with
 * transportation and cost estimation.
 * 
 * @param inputs - Input values including volume, density, application, and waste margin
 * @returns Calculated gravel weight, volume, and explanation
 */
export function calculateGravel(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get required volume
	const requiredVolume = Number(inputs.requiredVolume)
	if (isNaN(requiredVolume) || requiredVolume <= 0) {
		throw new Error('Required volume must be a positive number')
	}
	
	// Convert to cubic meters if needed (for calculations)
	let volumeM3 = requiredVolume
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		volumeM3 = requiredVolume * 0.0283168
	}
	
	// Get gravel density (user can override default)
	const gravelDensity = Number(inputs.gravelDensity) || GRAVEL_DENSITY
	if (isNaN(gravelDensity) || gravelDensity <= 0) {
		throw new Error('Gravel density must be a positive number')
	}
	
	// Get application (informational only)
	const application = String(inputs.application || 'concrete mix')
	
	// Convert volume to weight (kg)
	const gravelWeightKg = volumeM3 * gravelDensity
	
	// Calculate tons (for large volumes)
	const gravelWeightTons = gravelWeightKg / 1000
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let gravelWeightWithWaste = gravelWeightKg
	let gravelVolumeWithWaste = volumeM3
	let gravelWeightTonsWithWaste = gravelWeightTons
	
	if (includeWaste) {
		gravelWeightWithWaste = gravelWeightKg * (1 + wastePercent / 100)
		gravelVolumeWithWaste = volumeM3 * (1 + wastePercent / 100)
		gravelWeightTonsWithWaste = gravelWeightWithWaste / 1000
	}
	
	// Convert volume to display unit
	const volumeDisplay = isMetric ? volumeM3 : volumeM3 * 35.3147 // m³ to ft³
	const volumeDisplayWithWaste = isMetric ? gravelVolumeWithWaste : gravelVolumeWithWaste * 35.3147
	
	// Create application description
	const applicationDescriptions: Record<string, string> = {
		'concrete mix': 'concrete mix',
		'road base': 'road base layer',
		'drainage': 'drainage layer',
		'general fill': 'general fill',
	}
	const applicationDesc = applicationDescriptions[application.toLowerCase()] || application
	
	// Create explanation
	let explanation = `For ${requiredVolume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'} of gravel for ${applicationDesc}, you need approximately ${volumeM3.toFixed(4)} m³ (${gravelWeightKg.toFixed(2)} kg) of gravel.`
	
	if (gravelWeightKg >= 1000) {
		explanation += ` This is approximately ${gravelWeightTons.toFixed(2)} tons.`
	}
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${gravelVolumeWithWaste.toFixed(4)} m³ (${gravelWeightWithWaste.toFixed(2)} kg) of gravel.`
		if (gravelWeightWithWaste >= 1000) {
			explanation += ` This is approximately ${gravelWeightTonsWithWaste.toFixed(2)} tons.`
		}
	} else {
		explanation += ` Consider adding 10% extra for compaction, handling losses, and to ensure sufficient material.`
	}
	
	// Add note about density and ordering
	explanation += ` Note: Gravel is typically ordered by volume (m³ or cubic yards). Density (${gravelDensity} kg/m³) is used for weight estimation and transportation planning.`
	
	// Create formula explanation
	const formula = `Gravel Weight = Gravel Volume × Density = ${volumeM3.toFixed(4)} × ${gravelDensity} = ${gravelWeightKg.toFixed(2)} kg`
	
	return {
		gravelWeight: Number(gravelWeightKg.toFixed(2)),
		gravelWeightWithWaste: includeWaste ? Number(gravelWeightWithWaste.toFixed(2)) : gravelWeightKg,
		gravelVolume: Number(volumeM3.toFixed(4)),
		gravelVolumeWithWaste: includeWaste ? Number(gravelVolumeWithWaste.toFixed(4)) : volumeM3,
		gravelVolumeDisplay: Number(volumeDisplay.toFixed(4)),
		gravelVolumeDisplayWithWaste: includeWaste ? Number(volumeDisplayWithWaste.toFixed(4)) : volumeDisplay,
		gravelWeightTons: Number(gravelWeightTons.toFixed(2)),
		gravelWeightTonsWithWaste: includeWaste ? Number(gravelWeightTonsWithWaste.toFixed(2)) : gravelWeightTons,
		application: applicationDesc,
		volume: volumeM3,
		volumeDisplay: requiredVolume,
		unit: isMetric ? 'meters' : 'feet',
		volumeUnit: isMetric ? 'm³' : 'ft³',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
		formula,
		gravelDensity,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateGravel', calculateGravel)

