/**
 * Rebar calculation function
 * Estimates rebar quantity (bars, length, weight) for rectangular slab/grid reinforcement
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Rebar weight per meter (kg/m) by diameter (mm)
 */
const REBAR_WEIGHT_PER_METER: Record<number, number> = {
	6: 0.222,
	8: 0.395,
	10: 0.617,
	12: 0.888,
	14: 1.210,
	16: 1.580,
	18: 2.000,
	20: 2.470,
}

/**
 * Calculate rebar needed for slab reinforcement
 * 
 * Takes into account:
 * - Slab dimensions
 * - Rebar diameter and spacing
 * - Number of layers
 * - Edge allowance (cover)
 * - Waste margin
 * 
 * @param inputs - Input values including slab dimensions, rebar specs, and waste margin
 * @returns Calculated rebar quantities and breakdown
 */
export const calculateRebar: CalculationFunction = (inputs) => {
	// Extract inputs
	const slabLengthStr = String(inputs.slabLength || '').trim()
	const slabWidthStr = String(inputs.slabWidth || '').trim()
	const barDiameter = Number(inputs.barDiameter || 12)
	const spacingStr = String(inputs.spacing || '200').trim()
	const layers = Number(inputs.layers || 1)
	const edgeAllowanceStr = String(inputs.edgeAllowance || '50').trim()
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 5

	// Validation
	if (!slabLengthStr || slabLengthStr.trim() === '') {
		throw new Error('Slab length is required.')
	}
	if (!slabWidthStr || slabWidthStr.trim() === '') {
		throw new Error('Slab width is required.')
	}

	const slabLength = parseFloat(slabLengthStr)
	const slabWidth = parseFloat(slabWidthStr)
	const spacing = parseFloat(spacingStr)
	const edgeAllowance = parseFloat(edgeAllowanceStr)

	if (isNaN(slabLength) || !Number.isFinite(slabLength) || slabLength <= 0) {
		throw new Error('Slab length must be a valid positive number.')
	}
	if (isNaN(slabWidth) || !Number.isFinite(slabWidth) || slabWidth <= 0) {
		throw new Error('Slab width must be a valid positive number.')
	}
	if (isNaN(spacing) || !Number.isFinite(spacing) || spacing <= 0) {
		throw new Error('Spacing must be a valid positive number.')
	}
	if (isNaN(edgeAllowance) || !Number.isFinite(edgeAllowance) || edgeAllowance < 0) {
		throw new Error('Edge allowance must be a valid non-negative number.')
	}
	if (!Number.isInteger(layers) || layers < 1 || layers > 2) {
		throw new Error('Number of layers must be 1 or 2.')
	}

	if (!REBAR_WEIGHT_PER_METER[barDiameter]) {
		throw new Error(`Unsupported bar diameter: ${barDiameter} mm. Supported: ${Object.keys(REBAR_WEIGHT_PER_METER).join(', ')} mm.`)
	}

	// Convert dimensions to meters (assuming input is in meters)
	// Edge allowance is in mm, convert to meters
	const edgeAllowanceM = edgeAllowance / 1000

	// Calculate effective dimensions (accounting for edge allowance/cover)
	const effectiveLength = Math.max(slabLength - 2 * edgeAllowanceM, 0)
	const effectiveWidth = Math.max(slabWidth - 2 * edgeAllowanceM, 0)

	// Convert spacing to meters
	const spacingM = spacing / 1000

	// Calculate number of bars in each direction
	// Bars along length direction (perpendicular to length, running along width)
	const barsAlongLengthDirection = Math.floor(effectiveWidth / spacingM) + 1
	
	// Bars along width direction (perpendicular to width, running along length)
	const barsAlongWidthDirection = Math.floor(effectiveLength / spacingM) + 1

	// Calculate total length per layer
	// Bars along length direction: each bar is effectiveLength long
	const lengthBars1 = barsAlongLengthDirection * effectiveLength
	
	// Bars along width direction: each bar is effectiveWidth long
	const lengthBars2 = barsAlongWidthDirection * effectiveWidth
	
	const totalLengthPerLayer = lengthBars1 + lengthBars2

	// Calculate total length for all layers
	const totalLength = totalLengthPerLayer * layers

	// Get rebar weight per meter
	const weightPerMeter = REBAR_WEIGHT_PER_METER[barDiameter]

	// Calculate total weight
	const totalWeight = totalLength * weightPerMeter

	// Apply waste margin if enabled
	let totalWeightWithWaste = totalWeight
	let totalLengthWithWaste = totalLength
	if (includeWaste) {
		totalWeightWithWaste = totalWeight * (1 + wastePercent / 100)
		totalLengthWithWaste = totalLength * (1 + wastePercent / 100)
	}

	// Create formula explanation
	let formula = `Effective Dimensions (accounting for ${edgeAllowance} mm edge allowance):\n`
	formula += `  Effective Length = ${slabLength} - 2 × ${edgeAllowanceM} = ${effectiveLength.toFixed(3)} m\n`
	formula += `  Effective Width = ${slabWidth} - 2 × ${edgeAllowanceM} = ${effectiveWidth.toFixed(3)} m\n\n`
	formula += `Bar Count:\n`
	formula += `  Bars along length direction = floor(${effectiveWidth.toFixed(3)} / ${spacingM.toFixed(3)}) + 1 = ${barsAlongLengthDirection}\n`
	formula += `  Bars along width direction = floor(${effectiveLength.toFixed(3)} / ${spacingM.toFixed(3)}) + 1 = ${barsAlongWidthDirection}\n\n`
	formula += `Total Length per Layer:\n`
	formula += `  Length bars (${barsAlongLengthDirection} bars × ${effectiveLength.toFixed(3)} m) = ${lengthBars1.toFixed(2)} m\n`
	formula += `  Width bars (${barsAlongWidthDirection} bars × ${effectiveWidth.toFixed(3)} m) = ${lengthBars2.toFixed(2)} m\n`
	formula += `  Total per layer = ${totalLengthPerLayer.toFixed(2)} m\n\n`
	formula += `Total Length (${layers} layer${layers > 1 ? 's' : ''}): ${totalLength.toFixed(2)} m\n\n`
	formula += `Total Weight:\n`
	formula += `  Weight = ${totalLength.toFixed(2)} m × ${weightPerMeter} kg/m = ${totalWeight.toFixed(2)} kg`
	
	if (includeWaste) {
		formula += `\n\nWith ${wastePercent}% waste margin: ${totalWeightWithWaste.toFixed(2)} kg`
	}

	// Create breakdown
	let breakdown = `Slab Dimensions: ${slabLength} × ${slabWidth} m\n`
	breakdown += `Edge Allowance: ${edgeAllowance} mm (${edgeAllowanceM} m)\n`
	breakdown += `Effective Dimensions: ${effectiveLength.toFixed(3)} × ${effectiveWidth.toFixed(3)} m\n\n`
	breakdown += `Rebar Specifications:\n`
	breakdown += `  Bar Diameter: ${barDiameter} mm\n`
	breakdown += `  Spacing: ${spacing} mm (${spacingM.toFixed(3)} m)\n`
	breakdown += `  Layers: ${layers}\n\n`
	breakdown += `Bar Count:\n`
	breakdown += `  Bars along length direction: ${barsAlongLengthDirection}\n`
	breakdown += `  Bars along width direction: ${barsAlongWidthDirection}\n\n`
	breakdown += `Per Layer:\n`
	breakdown += `  Length bars: ${lengthBars1.toFixed(2)} m\n`
	breakdown += `  Width bars: ${lengthBars2.toFixed(2)} m\n`
	breakdown += `  Total per layer: ${totalLengthPerLayer.toFixed(2)} m\n\n`
	breakdown += `Total (${layers} layer${layers > 1 ? 's' : ''}):\n`
	breakdown += `  Total Length: ${totalLength.toFixed(2)} m\n`
	breakdown += `  Total Weight: ${totalWeight.toFixed(2)} kg`
	
	if (includeWaste) {
		breakdown += `\n\nWith ${wastePercent}% waste margin:\n`
		breakdown += `  Total Length: ${totalLengthWithWaste.toFixed(2)} m\n`
		breakdown += `  Total Weight: ${totalWeightWithWaste.toFixed(2)} kg`
	}

	// Create explanation
	let explanation = `For a slab measuring ${slabLength} × ${slabWidth} m with ${edgeAllowance} mm edge allowance, using ${barDiameter} mm rebar at ${spacing} mm spacing, you need:\n\n`
	explanation += `- ${barsAlongLengthDirection} bars along the length direction (each ${effectiveLength.toFixed(3)} m long)\n`
	explanation += `- ${barsAlongWidthDirection} bars along the width direction (each ${effectiveWidth.toFixed(3)} m long)\n\n`
	explanation += `Total rebar length: ${totalLength.toFixed(2)} m (${totalLengthPerLayer.toFixed(2)} m per layer × ${layers} layer${layers > 1 ? 's' : ''}).\n\n`
	explanation += `Total rebar weight: ${totalWeight.toFixed(2)} kg (using ${weightPerMeter} kg/m for ${barDiameter} mm bars).`
	
	if (includeWaste) {
		explanation += `\n\nWith a ${wastePercent}% waste margin, you should order ${totalWeightWithWaste.toFixed(2)} kg (${totalLengthWithWaste.toFixed(2)} m) to account for overlaps, cuts, and handling.`
	} else {
		explanation += `\n\nConsider adding 5% extra for waste, overlaps, and cuts.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Spacing significantly affects rebar cost - tighter spacing (e.g., 150 mm) requires more rebar than standard spacing (200 mm). This calculator provides estimates for grid reinforcement only and is not a structural design tool. Always consult with a structural engineer for actual rebar design requirements. Overlaps and splices are accounted for in the waste margin.`

	return {
		effectiveLength: Number(effectiveLength.toFixed(3)),
		effectiveWidth: Number(effectiveWidth.toFixed(3)),
		barsAlongLengthDirection,
		barsAlongWidthDirection,
		lengthBars1: Number(lengthBars1.toFixed(2)),
		lengthBars2: Number(lengthBars2.toFixed(2)),
		totalLengthPerLayer: Number(totalLengthPerLayer.toFixed(2)),
		totalLength: Number(totalLength.toFixed(2)),
		totalLengthWithWaste: includeWaste ? Number(totalLengthWithWaste.toFixed(2)) : totalLength,
		totalWeight: Number(totalWeight.toFixed(2)),
		totalWeightWithWaste: includeWaste ? Number(totalWeightWithWaste.toFixed(2)) : totalWeight,
		barDiameter,
		spacing,
		layers,
		edgeAllowance,
		weightPerMeter,
		formula,
		breakdown,
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 5,
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculateRebar', calculateRebar)


