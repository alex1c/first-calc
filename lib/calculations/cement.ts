/**
 * Cement calculation function
 * Calculates required cement amount based on concrete volume and mix ratio
 */

import type { CalculationFunction } from './registry'

/**
 * Cement density in kg/m³ (standard value)
 */
const CEMENT_DENSITY = 1440 // kg/m³

/**
 * Calculate cement required based on concrete volume and mix ratio
 * 
 * Mix ratios are in format cement:sand:gravel (e.g., 1:2:4)
 * 
 * @param inputs - Input values including concrete volume, mix ratio, bag weight, and waste margin
 * @returns Calculated cement weight, volume, bags, and explanation
 */
export function calculateCement(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get concrete volume
	const concreteVolume = Number(inputs.concreteVolume)
	if (isNaN(concreteVolume) || concreteVolume <= 0) {
		throw new Error('Concrete volume must be a positive number')
	}
	
	// Convert to cubic meters if needed (for calculations)
	let concreteVolumeM3 = concreteVolume
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		concreteVolumeM3 = concreteVolume * 0.0283168
	}
	
	// Get mix ratio
	const mixRatio = String(inputs.mixRatio || '1:2:4')
	
	// Parse mix ratio (format: "1:2:4" or "1:3:6" or custom)
	let cementPart = 1
	let sandPart = 2
	let gravelPart = 4
	let mixRatioToParse = mixRatio
	
	// If custom mix ratio is selected, use the customMixRatio input
	if (mixRatio === 'custom') {
		mixRatioToParse = String(inputs.customMixRatio || '1:2:4')
	}
	
	if (mixRatioToParse === '1:2:4') {
		cementPart = 1
		sandPart = 2
		gravelPart = 4
	} else if (mixRatioToParse === '1:3:6') {
		cementPart = 1
		sandPart = 3
		gravelPart = 6
	} else if (mixRatioToParse.includes(':')) {
		// Custom mix ratio
		const parts = mixRatioToParse.split(':').map((p) => Number(p.trim()))
		if (parts.length !== 3 || parts.some((p) => isNaN(p) || p <= 0)) {
			throw new Error('Invalid mix ratio format. Use format like 1:2:4')
		}
		cementPart = parts[0]
		sandPart = parts[1]
		gravelPart = parts[2]
	} else {
		throw new Error('Invalid mix ratio. Use format like 1:2:4')
	}
	
	// Calculate total parts
	const totalParts = cementPart + sandPart + gravelPart
	
	// Calculate cement volume in m³
	const cementVolumeM3 = concreteVolumeM3 * (cementPart / totalParts)
	
	// Convert volume to weight (kg)
	const cementWeightKg = cementVolumeM3 * CEMENT_DENSITY
	
	// Get bag weight
	const bagWeight = Number(inputs.cementBagWeight) || 50 // Default 50 kg
	if (isNaN(bagWeight) || bagWeight <= 0) {
		throw new Error('Bag weight must be a positive number')
	}
	
	// Calculate number of bags (before waste)
	const bagsBeforeWaste = cementWeightKg / bagWeight
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let cementWeightWithWaste = cementWeightKg
	let bagsWithWaste = bagsBeforeWaste
	
	if (includeWaste) {
		cementWeightWithWaste = cementWeightKg * (1 + wastePercent / 100)
		bagsWithWaste = cementWeightWithWaste / bagWeight
	}
	
	// Round up bags (always round up to ensure enough material)
	const bagsRounded = Math.ceil(bagsWithWaste)
	
	// Convert cement volume to display unit
	const cementVolumeDisplay = isMetric ? cementVolumeM3 : cementVolumeM3 * 35.3147 // m³ to ft³
	
	// Create explanation
	const mixRatioDisplay = `${cementPart}:${sandPart}:${gravelPart}`
	let explanation = `For ${concreteVolume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'} of concrete with a ${mixRatioDisplay} mix ratio, you need approximately ${cementWeightKg.toFixed(2)} kg of cement (${cementVolumeM3.toFixed(4)} m³).`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${cementWeightWithWaste.toFixed(2)} kg, which is approximately ${bagsRounded} bags of ${bagWeight} kg each.`
	} else {
		explanation += ` This equals approximately ${Math.ceil(bagsBeforeWaste)} bags of ${bagWeight} kg each. Consider adding 10% extra for waste and spillage.`
	}
	
	// Create formula explanation
	const formula = `Cement Volume = Concrete Volume × (Cement Part / Total Parts) = ${concreteVolumeM3.toFixed(4)} × (${cementPart} / ${totalParts}) = ${cementVolumeM3.toFixed(4)} m³\nCement Weight = Cement Volume × Density = ${cementVolumeM3.toFixed(4)} × ${CEMENT_DENSITY} = ${cementWeightKg.toFixed(2)} kg\nBags = ${cementWeightKg.toFixed(2)} / ${bagWeight} = ${bagsBeforeWaste.toFixed(2)} bags`
	
		return {
		cementWeight: Number(cementWeightKg.toFixed(2)),
		cementWeightWithWaste: includeWaste ? Number(cementWeightWithWaste.toFixed(2)) : cementWeightKg,
		cementVolume: Number(cementVolumeM3.toFixed(4)),
		cementVolumeDisplay: Number(cementVolumeDisplay.toFixed(4)),
		cementBags: Math.ceil(bagsBeforeWaste),
		cementBagsWithWaste: bagsRounded,
		bagWeight,
		mixRatio: `${cementPart}:${sandPart}:${gravelPart}`,
		mixRatioDisplay,
		cementPart,
		sandPart,
		gravelPart,
		totalParts,
		concreteVolume: concreteVolumeM3,
		concreteVolumeDisplay: concreteVolume,
		unit: isMetric ? 'meters' : 'feet',
		volumeUnit: isMetric ? 'm³' : 'ft³',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
		formula,
		cementDensity: CEMENT_DENSITY,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCement', calculateCement)

