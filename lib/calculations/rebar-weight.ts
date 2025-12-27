/**
 * Rebar weight calculation function
 * Calculates rebar weight from length, or length from weight
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Rebar weight per meter (kg/m) by diameter (mm)
 * Same table as used in rebar calculator
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
 * Calculate rebar weight or length
 * 
 * Supports two modes:
 * - Length → Weight: Calculate weight from diameter and length
 * - Weight → Length: Calculate length from diameter and weight
 * 
 * @param inputs - Input values including mode, diameter, length/weight, and quantity
 * @returns Calculated weight or length with breakdown
 */
export const calculateRebarWeight: CalculationFunction = (inputs) => {
	// Extract inputs
	const mode = String(inputs.mode || 'length-to-weight').toLowerCase()
	const barDiameter = Number(inputs.barDiameter || 12)
	const quantity = Number(inputs.quantity || 1)
	
	// Validation
	if (!REBAR_WEIGHT_PER_METER[barDiameter]) {
		throw new Error(`Unsupported bar diameter: ${barDiameter} mm. Supported: ${Object.keys(REBAR_WEIGHT_PER_METER).join(', ')} mm.`)
	}
	
	if (isNaN(quantity) || quantity <= 0) {
		throw new Error('Quantity must be a positive number.')
	}

	// Get rebar weight per meter
	const weightPerMeter = REBAR_WEIGHT_PER_METER[barDiameter]

	let result: number
	let resultLabel: string
	let inputValue: number
	let inputLabel: string
	let formula: string
	let explanation: string

	if (mode === 'length-to-weight' || mode === 'length to weight') {
		// Mode: Length → Weight
		const totalLengthStr = String(inputs.totalLength || '').trim()
		
		if (!totalLengthStr || totalLengthStr.trim() === '') {
			throw new Error('Total length is required for length-to-weight mode.')
		}
		
		const totalLength = parseFloat(totalLengthStr)
		if (isNaN(totalLength) || !Number.isFinite(totalLength) || totalLength <= 0) {
			throw new Error('Total length must be a valid positive number.')
		}
		
		// Calculate weight
		result = totalLength * weightPerMeter * quantity
		resultLabel = 'Total Weight'
		inputValue = totalLength
		inputLabel = 'Total Length'
		
		formula = `Weight = Length × Weight per Meter × Quantity\n`
		formula += `Weight = ${totalLength} m × ${weightPerMeter} kg/m × ${quantity} = ${result.toFixed(2)} kg`
		
		explanation = `For ${totalLength} meter${totalLength !== 1 ? 's' : ''} of ${barDiameter} mm rebar`
		if (quantity > 1) {
			explanation += ` (${quantity} bar${quantity > 1 ? 's' : ''})`
		}
		explanation += `, the total weight is ${result.toFixed(2)} kg.`
		explanation += `\n\nWeight per meter for ${barDiameter} mm rebar: ${weightPerMeter} kg/m.`
		
	} else if (mode === 'weight-to-length' || mode === 'weight to length') {
		// Mode: Weight → Length
		const totalWeightStr = String(inputs.totalWeight || '').trim()
		
		if (!totalWeightStr || totalWeightStr.trim() === '') {
			throw new Error('Total weight is required for weight-to-length mode.')
		}
		
		const totalWeight = parseFloat(totalWeightStr)
		if (isNaN(totalWeight) || !Number.isFinite(totalWeight) || totalWeight <= 0) {
			throw new Error('Total weight must be a valid positive number.')
		}
		
		// Calculate length
		result = totalWeight / (weightPerMeter * quantity)
		resultLabel = 'Total Length'
		inputValue = totalWeight
		inputLabel = 'Total Weight'
		
		formula = `Length = Weight / (Weight per Meter × Quantity)\n`
		formula += `Length = ${totalWeight} kg / (${weightPerMeter} kg/m × ${quantity}) = ${result.toFixed(2)} m`
		
		explanation = `For ${totalWeight} kg of ${barDiameter} mm rebar`
		if (quantity > 1) {
			explanation += ` (${quantity} bar${quantity > 1 ? 's' : ''})`
		}
		explanation += `, the total length is ${result.toFixed(2)} meter${result !== 1 ? 's' : ''}.`
		explanation += `\n\nWeight per meter for ${barDiameter} mm rebar: ${weightPerMeter} kg/m.`
		
	} else {
		throw new Error(`Unknown mode: ${mode}. Supported modes: 'length-to-weight' or 'weight-to-length'.`)
	}

	// Create weight table snippet for common diameters
	let weightTable = 'Common Rebar Weight per Meter:\n'
	weightTable += 'Diameter | Weight (kg/m)\n'
	weightTable += '---------|-------------\n'
	for (const [diam, weight] of Object.entries(REBAR_WEIGHT_PER_METER)) {
		const marker = Number(diam) === barDiameter ? ' ←' : ''
		weightTable += `${diam.padStart(2)} mm   | ${weight.toFixed(3)}${marker}\n`
	}

	// Create breakdown
	let breakdown = `Rebar Diameter: ${barDiameter} mm\n`
	breakdown += `Weight per Meter: ${weightPerMeter} kg/m\n`
	if (quantity > 1) {
		breakdown += `Quantity: ${quantity} bars\n`
	}
	breakdown += `\n${inputLabel}: ${inputValue} ${mode.includes('length') ? 'm' : 'kg'}\n`
	breakdown += `${resultLabel}: ${result.toFixed(2)} ${mode.includes('length') ? 'm' : 'kg'}`

	// Add practical note
	explanation += `\n\nPractical Note: Values are typical approximations used in practice. Actual weights may vary slightly by manufacturer and rebar grade. These values are based on standard steel density and are commonly used for estimation and planning purposes.`

	return {
		result: Number(result.toFixed(2)),
		resultLabel,
		weightPerMeter: Number(weightPerMeter.toFixed(3)),
		barDiameter,
		quantity,
		mode: mode.includes('length-to-weight') ? 'length-to-weight' : 'weight-to-length',
		inputValue: Number(inputValue.toFixed(2)),
		inputLabel,
		formula,
		breakdown,
		weightTable,
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculateRebarWeight', calculateRebarWeight)


