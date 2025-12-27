/**
 * Slab foundation calculation function
 * Calculates concrete volume for slab foundations with optional thickened edges/beams
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate slab foundation concrete volume
 * 
 * Calculates base slab volume and optionally includes thickened edge/beam volume
 * for load distribution around the perimeter.
 * 
 * @param inputs - Input values including slab dimensions, edge options, and waste margin
 * @returns Calculated slab volume, edge volume, total volume, and breakdown
 */
export function calculateSlabFoundation(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get slab dimensions
	const slabLength = Number(inputs.slabLength)
	const slabWidth = Number(inputs.slabWidth)
	const slabThickness = Number(inputs.slabThickness)
	
	if (isNaN(slabLength) || slabLength <= 0) {
		throw new Error('Slab length must be a positive number')
	}
	if (isNaN(slabWidth) || slabWidth <= 0) {
		throw new Error('Slab width must be a positive number')
	}
	if (isNaN(slabThickness) || slabThickness <= 0) {
		throw new Error('Slab thickness must be a positive number')
	}
	
	// Calculate base slab volume
	const slabVolume = slabLength * slabWidth * slabThickness
	
	// Check if thickened edge is enabled
	const includeThickenedEdge =
		(typeof inputs.includeThickenedEdge === 'boolean' && inputs.includeThickenedEdge) ||
		(typeof inputs.includeThickenedEdge === 'string' && inputs.includeThickenedEdge.toLowerCase() === 'true') ||
		(typeof inputs.includeThickenedEdge === 'number' && inputs.includeThickenedEdge > 0)
	
	let edgeVolume = 0
	let edgeLength = 0
	let edgeWidth = 0
	let edgeDepth = 0
	
	if (includeThickenedEdge) {
		edgeWidth = Number(inputs.edgeWidth)
		edgeDepth = Number(inputs.edgeDepth)
		
		if (isNaN(edgeWidth) || edgeWidth <= 0) {
			throw new Error('Edge width must be a positive number')
		}
		if (isNaN(edgeDepth) || edgeDepth <= 0) {
			throw new Error('Edge depth must be a positive number')
		}
		
		// Determine edge length
		const edgeRunsOption = String(inputs.edgeRuns || 'perimeter')
		
		if (edgeRunsOption === 'perimeter' || edgeRunsOption === 'perimeter only') {
			// Calculate perimeter
			edgeLength = 2 * (slabLength + slabWidth)
		} else if (edgeRunsOption === 'custom') {
			// Use custom edge length
			edgeLength = Number(inputs.customEdgeLength || 0)
			if (isNaN(edgeLength) || edgeLength <= 0) {
				throw new Error('Custom edge length must be a positive number')
			}
		} else {
			throw new Error('Invalid edge runs option. Use "perimeter" or "custom"')
		}
		
		// Calculate edge volume
		// Edge volume is the additional volume beyond the base slab
		// Edge extends below the slab, so we calculate the full edge volume
		edgeVolume = edgeLength * edgeWidth * edgeDepth
	}
	
	// Calculate total volume
	const totalVolume = slabVolume + edgeVolume
	
	// Convert to cubic meters if needed (for calculations)
	let totalVolumeM3 = totalVolume
	let slabVolumeM3 = slabVolume
	let edgeVolumeM3 = edgeVolume
	
	if (!isMetric) {
		// Convert cubic feet to cubic meters: 1 ft³ = 0.0283168 m³
		totalVolumeM3 = totalVolume * 0.0283168
		slabVolumeM3 = slabVolume * 0.0283168
		edgeVolumeM3 = edgeVolume * 0.0283168
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
	const slabVolumeDisplay = isMetric ? slabVolumeM3 : slabVolumeM3 * 35.3147
	const edgeVolumeDisplay = isMetric ? edgeVolumeM3 : edgeVolumeM3 * 35.3147
	
	// Convert to cubic yards for imperial users
	const totalVolumeCubicYards = !isMetric ? totalVolume / 27 : 0
	const totalVolumeCubicYardsWithWaste = !isMetric && includeWaste ? totalVolumeDisplayWithWaste / 27 : 0
	
	// Determine unit labels
	const volumeUnit = isMetric ? 'm³' : 'ft³'
	const volumeUnitFull = isMetric ? 'cubic meters' : 'cubic feet'
	const lengthUnit = isMetric ? 'm' : 'ft'
	
	// Create formula explanation
	let formula = `Base Slab Volume = Length × Width × Thickness = ${slabLength} × ${slabWidth} × ${slabThickness} = ${slabVolume.toFixed(2)} ${volumeUnit}\n\n`
	
	if (includeThickenedEdge) {
		const edgeRunsOption = String(inputs.edgeRuns || 'perimeter')
		if (edgeRunsOption === 'perimeter' || edgeRunsOption === 'perimeter only') {
			const perimeter = 2 * (slabLength + slabWidth)
			formula += `Edge Length (Perimeter) = 2 × (${slabLength} + ${slabWidth}) = ${perimeter.toFixed(2)} ${lengthUnit}\n`
		} else {
			formula += `Edge Length (Custom) = ${edgeLength.toFixed(2)} ${lengthUnit}\n`
		}
		formula += `Edge Volume = Edge Length × Edge Width × Edge Depth = ${edgeLength.toFixed(2)} × ${edgeWidth} × ${edgeDepth} = ${edgeVolume.toFixed(2)} ${volumeUnit}\n\n`
	}
	
	formula += `Total Volume = Slab Volume + Edge Volume = ${slabVolume.toFixed(2)} + ${edgeVolume.toFixed(2)} = ${totalVolume.toFixed(2)} ${volumeUnit}`
	
	// Create breakdown
	let breakdown = `Slab Dimensions: ${slabLength} × ${slabWidth} × ${slabThickness} ${lengthUnit}\n`
	breakdown += `Base Slab Volume: ${slabVolume.toFixed(2)} ${volumeUnit} (${slabVolumeM3.toFixed(4)} m³)\n`
	
	if (includeThickenedEdge) {
		breakdown += `\nThickened Edge:\n`
		breakdown += `  Edge Length: ${edgeLength.toFixed(2)} ${lengthUnit}\n`
		breakdown += `  Edge Dimensions: ${edgeWidth} × ${edgeDepth} ${lengthUnit}\n`
		breakdown += `  Edge Volume: ${edgeVolume.toFixed(2)} ${volumeUnit} (${edgeVolumeM3.toFixed(4)} m³)\n`
	}
	
	breakdown += `\nTotal Concrete Volume: ${totalVolume.toFixed(2)} ${volumeUnit} (${totalVolumeM3.toFixed(4)} m³)`
	
	// Create explanation
	let explanation = `For a slab foundation measuring ${slabLength} × ${slabWidth} ${lengthUnit} with thickness ${slabThickness} ${lengthUnit}, the base slab requires ${slabVolume.toFixed(2)} ${volumeUnitFull} (${slabVolumeM3.toFixed(4)} m³) of concrete.`
	
	if (includeThickenedEdge) {
		explanation += `\n\nWith a thickened edge (${edgeWidth} × ${edgeDepth} ${lengthUnit}) running ${edgeLength.toFixed(2)} ${lengthUnit}, an additional ${edgeVolume.toFixed(2)} ${volumeUnitFull} (${edgeVolumeM3.toFixed(4)} m³) is needed.`
	}
	
	explanation += `\n\nTotal concrete required: ${totalVolume.toFixed(2)} ${volumeUnitFull} (${totalVolumeM3.toFixed(4)} m³).`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${totalVolumeDisplayWithWaste.toFixed(2)} ${volumeUnitFull} (${totalVolumeWithWaste.toFixed(4)} m³).`
		if (!isMetric) {
			explanation += ` This is approximately ${totalVolumeCubicYardsWithWaste.toFixed(2)} cubic yards.`
		}
	} else {
		explanation += ` Consider adding 5-10% extra for waste, spillage, and formwork variations.`
		if (!isMetric) {
			explanation += ` This is approximately ${totalVolumeCubicYards.toFixed(2)} cubic yards.`
		}
	}
	
	// Add measurement tips
	explanation += `\n\nHow to Measure: Slab thickness should be measured from your foundation design drawings. Typical residential slab thickness is 10-15 cm (4-6 inches), while commercial slabs may be 15-25 cm (6-10 inches). Thickened edges are used for load distribution around the perimeter and are typically 30-60 cm (12-24 inches) wide and 20-40 cm (8-16 inches) deeper than the slab.`
	
	return {
		slabVolume: Number(slabVolumeM3.toFixed(4)),
		slabVolumeDisplay: Number(slabVolumeDisplay.toFixed(2)),
		edgeVolume: includeThickenedEdge ? Number(edgeVolumeM3.toFixed(4)) : 0,
		edgeVolumeDisplay: includeThickenedEdge ? Number(edgeVolumeDisplay.toFixed(2)) : 0,
		edgeLength: includeThickenedEdge ? Number(edgeLength.toFixed(2)) : 0,
		totalVolume: Number(totalVolumeM3.toFixed(4)),
		totalVolumeWithWaste: includeWaste ? Number(totalVolumeWithWaste.toFixed(4)) : totalVolumeM3,
		totalVolumeDisplay: Number(totalVolumeDisplay.toFixed(2)),
		totalVolumeDisplayWithWaste: includeWaste ? Number(totalVolumeDisplayWithWaste.toFixed(2)) : totalVolumeDisplay,
		totalVolumeCubicYards: !isMetric ? Number(totalVolumeCubicYards.toFixed(2)) : 0,
		totalVolumeCubicYardsWithWaste: !isMetric && includeWaste ? Number(totalVolumeCubicYardsWithWaste.toFixed(2)) : 0,
		volumeUnit,
		volumeUnitFull,
		lengthUnit,
		formula,
		breakdown,
		unit: isMetric ? 'meters' : 'feet',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		includeThickenedEdge: includeThickenedEdge ? 'true' : 'false',
		explanation,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateSlabFoundation', calculateSlabFoundation)

