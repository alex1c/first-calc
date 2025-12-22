/**
 * Concrete mix ratio calculation function
 * Calculates material quantities (cement, sand, gravel) based on concrete mix ratio
 */

import type { CalculationFunction } from './registry'

/**
 * Material densities in kg/m³ (standard values)
 */
const CEMENT_DENSITY = 1440 // kg/m³
const SAND_DENSITY = 1600 // kg/m³
const GRAVEL_DENSITY = 1500 // kg/m³

/**
 * Calculate material quantities based on concrete mix ratio
 * 
 * Mix ratios are in format cement:sand:gravel (e.g., 1:2:4)
 * 
 * @param inputs - Input values including volume, mix ratio, bag weight, and waste margin
 * @returns Calculated quantities for cement, sand, and gravel
 */
export function calculateConcreteMixRatio(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get total concrete volume
	const totalConcreteVolume = Number(inputs.totalConcreteVolume)
	if (isNaN(totalConcreteVolume) || totalConcreteVolume <= 0) {
		throw new Error('Total concrete volume must be a positive number')
	}
	
	// Convert to cubic meters if needed (for calculations)
	let volumeM3 = totalConcreteVolume
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		volumeM3 = totalConcreteVolume * 0.0283168
	}
	
	// Get mix ratio
	const mixRatio = String(inputs.mixRatio || '1:2:4')
	
	// Parse mix ratio
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
	} else if (mixRatioToParse === '1:1.5:3') {
		cementPart = 1
		sandPart = 1.5
		gravelPart = 3
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
	
	// Calculate material volumes in m³
	const cementVolumeM3 = volumeM3 * (cementPart / totalParts)
	const sandVolumeM3 = volumeM3 * (sandPart / totalParts)
	const gravelVolumeM3 = volumeM3 * (gravelPart / totalParts)
	
	// Convert volumes to weights (kg)
	const cementWeightKg = cementVolumeM3 * CEMENT_DENSITY
	const sandWeightKg = sandVolumeM3 * SAND_DENSITY
	const gravelWeightKg = gravelVolumeM3 * GRAVEL_DENSITY
	
	// Get bag weight
	const bagWeight = Number(inputs.cementBagWeight) || 50 // Default 50 kg
	if (isNaN(bagWeight) || bagWeight <= 0) {
		throw new Error('Bag weight must be a positive number')
	}
	
	// Calculate number of cement bags (before waste)
	const cementBagsBeforeWaste = cementWeightKg / bagWeight
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let cementWeightWithWaste = cementWeightKg
	let sandWeightWithWaste = sandWeightKg
	let gravelWeightWithWaste = gravelWeightKg
	let cementVolumeWithWaste = cementVolumeM3
	let sandVolumeWithWaste = sandVolumeM3
	let gravelVolumeWithWaste = gravelVolumeM3
	let cementBagsWithWaste = cementBagsBeforeWaste
	
	if (includeWaste) {
		cementWeightWithWaste = cementWeightKg * (1 + wastePercent / 100)
		sandWeightWithWaste = sandWeightKg * (1 + wastePercent / 100)
		gravelWeightWithWaste = gravelWeightKg * (1 + wastePercent / 100)
		cementVolumeWithWaste = cementVolumeM3 * (1 + wastePercent / 100)
		sandVolumeWithWaste = sandVolumeM3 * (1 + wastePercent / 100)
		gravelVolumeWithWaste = gravelVolumeM3 * (1 + wastePercent / 100)
		cementBagsWithWaste = cementWeightWithWaste / bagWeight
	}
	
	// Round up bags (always round up to ensure enough material)
	const cementBagsRounded = Math.ceil(cementBagsBeforeWaste)
	const cementBagsRoundedWithWaste = Math.ceil(cementBagsWithWaste)
	
	// Convert volumes to display unit
	const volumeDisplay = isMetric ? volumeM3 : volumeM3 * 35.3147
	const cementVolumeDisplay = isMetric ? cementVolumeM3 : cementVolumeM3 * 35.3147
	const sandVolumeDisplay = isMetric ? sandVolumeM3 : sandVolumeM3 * 35.3147
	const gravelVolumeDisplay = isMetric ? gravelVolumeM3 : gravelVolumeM3 * 35.3147
	
	// Calculate total material weight
	const totalWeightKg = cementWeightKg + sandWeightKg + gravelWeightKg
	const totalWeightKgWithWaste = cementWeightWithWaste + sandWeightWithWaste + gravelWeightWithWaste
	
	// Create mix ratio display
	const mixRatioDisplay = `${cementPart}:${sandPart}:${gravelPart}`
	
	// Create explanation
	let explanation = `For ${totalConcreteVolume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'} of concrete with a ${mixRatioDisplay} mix ratio:\n\n`
	explanation += `Cement: ${cementWeightKg.toFixed(2)} kg (${cementVolumeM3.toFixed(4)} m³) = ${cementBagsRounded} bags of ${bagWeight} kg\n`
	explanation += `Sand: ${sandWeightKg.toFixed(2)} kg (${sandVolumeM3.toFixed(4)} m³)\n`
	explanation += `Gravel: ${gravelWeightKg.toFixed(2)} kg (${gravelVolumeM3.toFixed(4)} m³)\n`
	explanation += `Total Materials: ${totalWeightKg.toFixed(2)} kg`
	
	if (includeWaste) {
		explanation += `\n\nWith ${wastePercent}% waste margin:\n`
		explanation += `Cement: ${cementWeightWithWaste.toFixed(2)} kg = ${cementBagsRoundedWithWaste} bags\n`
		explanation += `Sand: ${sandWeightWithWaste.toFixed(2)} kg (${sandVolumeWithWaste.toFixed(4)} m³)\n`
		explanation += `Gravel: ${gravelWeightWithWaste.toFixed(2)} kg (${gravelVolumeWithWaste.toFixed(4)} m³)\n`
		explanation += `Total Materials: ${totalWeightKgWithWaste.toFixed(2)} kg`
	} else {
		explanation += `\n\nConsider adding 10% extra for waste, spillage, and handling losses.`
	}
	
	// Create formula explanation
	let formula = `Total Parts = ${cementPart} + ${sandPart} + ${gravelPart} = ${totalParts}\n\n`
	formula += `Cement Volume = ${volumeM3.toFixed(4)} × (${cementPart} / ${totalParts}) = ${cementVolumeM3.toFixed(4)} m³\n`
	formula += `Cement Weight = ${cementVolumeM3.toFixed(4)} × ${CEMENT_DENSITY} = ${cementWeightKg.toFixed(2)} kg\n\n`
	formula += `Sand Volume = ${volumeM3.toFixed(4)} × (${sandPart} / ${totalParts}) = ${sandVolumeM3.toFixed(4)} m³\n`
	formula += `Sand Weight = ${sandVolumeM3.toFixed(4)} × ${SAND_DENSITY} = ${sandWeightKg.toFixed(2)} kg\n\n`
	formula += `Gravel Volume = ${volumeM3.toFixed(4)} × (${gravelPart} / ${totalParts}) = ${gravelVolumeM3.toFixed(4)} m³\n`
	formula += `Gravel Weight = ${gravelVolumeM3.toFixed(4)} × ${GRAVEL_DENSITY} = ${gravelWeightKg.toFixed(2)} kg`
	
	return {
		cementWeight: Number(cementWeightKg.toFixed(2)),
		cementWeightWithWaste: includeWaste ? Number(cementWeightWithWaste.toFixed(2)) : cementWeightKg,
		cementVolume: Number(cementVolumeM3.toFixed(4)),
		cementVolumeWithWaste: includeWaste ? Number(cementVolumeWithWaste.toFixed(4)) : cementVolumeM3,
		cementVolumeDisplay: Number(cementVolumeDisplay.toFixed(4)),
		cementBags: cementBagsRounded,
		cementBagsWithWaste: cementBagsRoundedWithWaste,
		sandWeight: Number(sandWeightKg.toFixed(2)),
		sandWeightWithWaste: includeWaste ? Number(sandWeightWithWaste.toFixed(2)) : sandWeightKg,
		sandVolume: Number(sandVolumeM3.toFixed(4)),
		sandVolumeWithWaste: includeWaste ? Number(sandVolumeWithWaste.toFixed(4)) : sandVolumeM3,
		sandVolumeDisplay: Number(sandVolumeDisplay.toFixed(4)),
		gravelWeight: Number(gravelWeightKg.toFixed(2)),
		gravelWeightWithWaste: includeWaste ? Number(gravelWeightWithWaste.toFixed(2)) : gravelWeightKg,
		gravelVolume: Number(gravelVolumeM3.toFixed(4)),
		gravelVolumeWithWaste: includeWaste ? Number(gravelVolumeWithWaste.toFixed(4)) : gravelVolumeM3,
		gravelVolumeDisplay: Number(gravelVolumeDisplay.toFixed(4)),
		totalWeight: Number(totalWeightKg.toFixed(2)),
		totalWeightWithWaste: includeWaste ? Number(totalWeightKgWithWaste.toFixed(2)) : totalWeightKg,
		mixRatio: mixRatioDisplay,
		cementPart,
		sandPart,
		gravelPart,
		totalParts,
		volume: volumeM3,
		volumeDisplay: totalConcreteVolume,
		unit: isMetric ? 'meters' : 'feet',
		volumeUnit: isMetric ? 'm³' : 'ft³',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
		formula,
		bagWeight,
		cementDensity: CEMENT_DENSITY,
		sandDensity: SAND_DENSITY,
		gravelDensity: GRAVEL_DENSITY,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateConcreteMixRatio', calculateConcreteMixRatio)

