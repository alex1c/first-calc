/**
 * Pile foundation calculation function
 * Calculates concrete volume for cylindrical piles with optional pile caps
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate pile foundation concrete volume
 * 
 * Calculates volume for cylindrical piles and optionally includes pile caps
 * for load distribution at the top of piles.
 * 
 * @param inputs - Input values including pile dimensions, cap dimensions, and waste margin
 * @returns Calculated pile volume, cap volume, total volume, and breakdown
 */
export function calculatePileFoundation(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get pile dimensions
	const pilesCount = Number(inputs.pilesCount)
	const pileDiameter = Number(inputs.pileDiameter)
	const pileDepth = Number(inputs.pileDepth)
	
	if (isNaN(pilesCount) || pilesCount <= 0 || !Number.isInteger(pilesCount)) {
		throw new Error('Number of piles must be a positive integer')
	}
	if (isNaN(pileDiameter) || pileDiameter <= 0) {
		throw new Error('Pile diameter must be a positive number')
	}
	if (isNaN(pileDepth) || pileDepth <= 0) {
		throw new Error('Pile depth must be a positive number')
	}
	
	// Calculate single pile volume
	const pileRadius = pileDiameter / 2
	const singlePileVolume = Math.PI * pileRadius * pileRadius * pileDepth
	
	// Calculate total pile volume
	const totalPileVolume = pilesCount * singlePileVolume
	
	// Check if pile caps are included
	const pileCapCount = Number(inputs.pileCapCount || 0)
	let capVolume = 0
	let totalCapVolume = 0
	
	if (pileCapCount > 0) {
		const pileCapLength = Number(inputs.pileCapLength)
		const pileCapWidth = Number(inputs.pileCapWidth)
		const pileCapHeight = Number(inputs.pileCapHeight)
		
		if (isNaN(pileCapLength) || pileCapLength <= 0) {
			throw new Error('Pile cap length must be a positive number')
		}
		if (isNaN(pileCapWidth) || pileCapWidth <= 0) {
			throw new Error('Pile cap width must be a positive number')
		}
		if (isNaN(pileCapHeight) || pileCapHeight <= 0) {
			throw new Error('Pile cap height must be a positive number')
		}
		
		// Calculate single cap volume
		capVolume = pileCapLength * pileCapWidth * pileCapHeight
		
		// Calculate total cap volume
		totalCapVolume = pileCapCount * capVolume
	}
	
	// Calculate total volume
	const totalVolume = totalPileVolume + totalCapVolume
	
	// Convert to cubic meters if needed (for calculations)
	let totalVolumeM3 = totalVolume
	let totalPileVolumeM3 = totalPileVolume
	let totalCapVolumeM3 = totalCapVolume
	let singlePileVolumeM3 = singlePileVolume
	
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		totalVolumeM3 = totalVolume * 0.0283168
		totalPileVolumeM3 = totalPileVolume * 0.0283168
		totalCapVolumeM3 = totalCapVolume * 0.0283168
		singlePileVolumeM3 = singlePileVolume * 0.0283168
	}
	
	// Apply waste margin if enabled
	const includeWaste =
		(typeof inputs.includeWaste === 'boolean' && inputs.includeWaste) ||
		(typeof inputs.includeWaste === 'string' && inputs.includeWaste.toLowerCase() === 'true') ||
		(typeof inputs.includeWaste === 'number' && inputs.includeWaste > 0)
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let totalVolumeWithWaste = totalVolumeM3
	if (includeWaste) {
		totalVolumeWithWaste = totalVolumeM3 * (1 + wastePercent / 100)
	}
	
	// Convert to display units
	const totalVolumeDisplay = isMetric ? totalVolumeM3 : totalVolumeM3 * 35.3147 // m³ to ft³
	const totalVolumeDisplayWithWaste = isMetric ? totalVolumeWithWaste : totalVolumeWithWaste * 35.3147
	const totalPileVolumeDisplay = isMetric ? totalPileVolumeM3 : totalPileVolumeM3 * 35.3147
	const totalCapVolumeDisplay = isMetric ? totalCapVolumeM3 : totalCapVolumeM3 * 35.3147
	const singlePileVolumeDisplay = isMetric ? singlePileVolumeM3 : singlePileVolumeM3 * 35.3147
	
	// Convert to cubic yards for imperial users
	const totalVolumeCubicYards = !isMetric ? totalVolume / 27 : 0
	const totalVolumeCubicYardsWithWaste = !isMetric && includeWaste ? totalVolumeDisplayWithWaste / 27 : 0
	
	// Determine unit labels
	const volumeUnit = isMetric ? 'm³' : 'ft³'
	const volumeUnitFull = isMetric ? 'cubic meters' : 'cubic feet'
	const lengthUnit = isMetric ? 'm' : 'ft'
	
	// Create formula explanation
	let formula = `Single Pile Volume = π × (Diameter/2)² × Depth = π × (${pileDiameter}/2)² × ${pileDepth} ≈ ${singlePileVolume.toFixed(2)} ${volumeUnit}\n\n`
	formula += `Total Pile Volume = ${pilesCount} piles × ${singlePileVolume.toFixed(2)} ${volumeUnit} = ${totalPileVolume.toFixed(2)} ${volumeUnit}\n\n`
	
	if (pileCapCount > 0) {
		formula += `Single Cap Volume = Length × Width × Height = ${inputs.pileCapLength} × ${inputs.pileCapWidth} × ${inputs.pileCapHeight} = ${capVolume.toFixed(2)} ${volumeUnit}\n`
		formula += `Total Cap Volume = ${pileCapCount} caps × ${capVolume.toFixed(2)} ${volumeUnit} = ${totalCapVolume.toFixed(2)} ${volumeUnit}\n\n`
	}
	
	formula += `Total Concrete Volume = Pile Volume + Cap Volume = ${totalPileVolume.toFixed(2)} + ${totalCapVolume.toFixed(2)} = ${totalVolume.toFixed(2)} ${volumeUnit}`
	
	// Create breakdown
	let breakdown = `Piles:\n`
	breakdown += `  Number of Piles: ${pilesCount}\n`
	breakdown += `  Pile Diameter: ${pileDiameter} ${lengthUnit}\n`
	breakdown += `  Pile Depth: ${pileDepth} ${lengthUnit}\n`
	breakdown += `  Volume per Pile: ${singlePileVolume.toFixed(2)} ${volumeUnit} (${singlePileVolumeM3.toFixed(4)} m³)\n`
	breakdown += `  Total Pile Volume: ${totalPileVolume.toFixed(2)} ${volumeUnit} (${totalPileVolumeM3.toFixed(4)} m³)\n`
	
	if (pileCapCount > 0) {
		breakdown += `\nPile Caps:\n`
		breakdown += `  Number of Caps: ${pileCapCount}\n`
		breakdown += `  Cap Dimensions: ${inputs.pileCapLength} × ${inputs.pileCapWidth} × ${inputs.pileCapHeight} ${lengthUnit}\n`
		breakdown += `  Volume per Cap: ${capVolume.toFixed(2)} ${volumeUnit}\n`
		breakdown += `  Total Cap Volume: ${totalCapVolume.toFixed(2)} ${volumeUnit} (${totalCapVolumeM3.toFixed(4)} m³)\n`
	}
	
	breakdown += `\nTotal Concrete Volume: ${totalVolume.toFixed(2)} ${volumeUnit} (${totalVolumeM3.toFixed(4)} m³)`
	
	// Create explanation
	let explanation = `For ${pilesCount} cylindrical piles with diameter ${pileDiameter} ${lengthUnit} and depth ${pileDepth} ${lengthUnit}, each pile requires approximately ${singlePileVolume.toFixed(2)} ${volumeUnitFull} (${singlePileVolumeM3.toFixed(4)} m³) of concrete.`
	
	explanation += `\n\nTotal pile volume: ${totalPileVolume.toFixed(2)} ${volumeUnitFull} (${totalPileVolumeM3.toFixed(4)} m³).`
	
	if (pileCapCount > 0) {
		explanation += `\n\nWith ${pileCapCount} pile caps (${inputs.pileCapLength} × ${inputs.pileCapWidth} × ${inputs.pileCapHeight} ${lengthUnit} each), an additional ${totalCapVolume.toFixed(2)} ${volumeUnitFull} (${totalCapVolumeM3.toFixed(4)} m³) is needed.`
	}
	
	explanation += `\n\nTotal concrete required: ${totalVolume.toFixed(2)} ${volumeUnitFull} (${totalVolumeM3.toFixed(4)} m³).`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${totalVolumeDisplayWithWaste.toFixed(2)} ${volumeUnitFull} (${totalVolumeWithWaste.toFixed(4)} m³).`
		if (!isMetric) {
			explanation += ` This is approximately ${totalVolumeCubicYardsWithWaste.toFixed(2)} cubic yards.`
		}
	} else {
		explanation += ` Consider adding 10-15% extra for waste, overspill, and drilling losses.`
		if (!isMetric) {
			explanation += ` This is approximately ${totalVolumeCubicYards.toFixed(2)} cubic yards.`
		}
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Pile foundations require careful consideration of bore diameter vs pile diameter. The bore hole is typically slightly larger than the pile diameter to allow for installation. Drilling losses and overspill can occur, so adding a waste margin (10-15%) is especially important for pile foundations. The waste margin accounts for these losses and ensures sufficient material.`
	
	return {
		singlePileVolume: Number(singlePileVolumeM3.toFixed(4)),
		singlePileVolumeDisplay: Number(singlePileVolumeDisplay.toFixed(2)),
		totalPileVolume: Number(totalPileVolumeM3.toFixed(4)),
		totalPileVolumeDisplay: Number(totalPileVolumeDisplay.toFixed(2)),
		capVolume: pileCapCount > 0 ? Number(capVolume.toFixed(4)) : 0,
		capVolumeDisplay: pileCapCount > 0 ? Number((isMetric ? capVolume : capVolume * 35.3147).toFixed(2)) : 0,
		totalCapVolume: Number(totalCapVolumeM3.toFixed(4)),
		totalCapVolumeDisplay: Number(totalCapVolumeDisplay.toFixed(2)),
		totalVolume: Number(totalVolumeM3.toFixed(4)),
		totalVolumeWithWaste: includeWaste ? Number(totalVolumeWithWaste.toFixed(4)) : totalVolumeM3,
		totalVolumeDisplay: Number(totalVolumeDisplay.toFixed(2)),
		totalVolumeDisplayWithWaste: includeWaste ? Number(totalVolumeDisplayWithWaste.toFixed(2)) : totalVolumeDisplay,
		totalVolumeCubicYards: !isMetric ? Number(totalVolumeCubicYards.toFixed(2)) : 0,
		totalVolumeCubicYardsWithWaste: !isMetric && includeWaste ? Number(totalVolumeCubicYardsWithWaste.toFixed(2)) : 0,
		pilesCount,
		pileDiameter,
		pileDepth,
		pileCapCount: pileCapCount || 0,
		volumeUnit,
		volumeUnitFull,
		lengthUnit,
		formula,
		breakdown,
		unit: isMetric ? 'meters' : 'feet',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculatePileFoundation', calculatePileFoundation)


