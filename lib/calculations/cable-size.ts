/**
 * Cable size calculation function
 * Estimates recommended cable cross-section based on electrical load and voltage
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Cable size lookup table (copper, typical practice)
 * Cross-section (mm²) → Maximum current (A)
 */
const CABLE_SIZE_COPPER: Array<{ size: number; maxCurrent: number }> = [
	{ size: 1.5, maxCurrent: 16 },
	{ size: 2.5, maxCurrent: 25 },
	{ size: 4, maxCurrent: 32 },
	{ size: 6, maxCurrent: 40 },
	{ size: 10, maxCurrent: 63 },
	{ size: 16, maxCurrent: 80 },
	{ size: 25, maxCurrent: 100 },
	{ size: 35, maxCurrent: 125 },
	{ size: 50, maxCurrent: 160 },
	{ size: 70, maxCurrent: 200 },
	{ size: 95, maxCurrent: 250 },
	{ size: 120, maxCurrent: 300 },
	{ size: 150, maxCurrent: 350 },
	{ size: 185, maxCurrent: 400 },
	{ size: 240, maxCurrent: 500 },
]

/**
 * Find recommended cable size based on current
 */
function findCableSize(current: number, material: string): { size: number; maxCurrent: number } {
	const isAluminum = material.toLowerCase() === 'aluminum' || material.toLowerCase() === 'aluminium'
	
	// For aluminum, use next size up (aluminum has lower current capacity)
	const currentAdjusted = isAluminum ? current * 1.3 : current // Approximate adjustment
	
	// Find smallest cable that can handle the current
	for (const cable of CABLE_SIZE_COPPER) {
		if (cable.maxCurrent >= currentAdjusted) {
			return cable
		}
	}
	
	// If current exceeds all sizes, return largest
	return CABLE_SIZE_COPPER[CABLE_SIZE_COPPER.length - 1]
}

/**
 * Calculate recommended cable size
 * 
 * Takes into account:
 * - Electrical power
 * - Voltage and phase
 * - Material (copper/aluminum)
 * 
 * @param inputs - Input values including power, voltage, phase, and material
 * @returns Calculated current and recommended cable size
 */
export const calculateCableSize: CalculationFunction = (inputs) => {
	// Extract inputs
	const voltageStr = String(inputs.voltage || '220-230').toLowerCase()
	const phase = String(inputs.phase || 'single-phase').toLowerCase()
	const totalPowerStr = String(inputs.totalPower || '').trim()
	const material = String(inputs.material || 'copper').toLowerCase()
	const installationType = String(inputs.installationType || 'indoor').toLowerCase()

	// Validation
	if (!totalPowerStr || totalPowerStr.trim() === '') {
		throw new Error('Total power is required.')
	}

	const totalPower = parseFloat(totalPowerStr)
	if (isNaN(totalPower) || !Number.isFinite(totalPower) || totalPower <= 0) {
		throw new Error('Total power must be a valid positive number.')
	}

	// Determine voltage from selection
	let voltage = 230 // Default
	if (voltageStr.includes('110') || voltageStr.includes('120')) {
		voltage = 115 // Average of 110-120
	} else if (voltageStr.includes('220') || voltageStr.includes('230')) {
		voltage = 230 // Average of 220-230
	} else if (voltageStr.includes('380') || voltageStr.includes('400')) {
		voltage = 400 // Average of 380-400
	}

	// Calculate current
	let current = 0
	let currentFormula = ''
	
	if (phase === 'single-phase' || phase === 'single') {
		// Single-phase: I = P / V
		current = (totalPower * 1000) / voltage
		currentFormula = `I = P / V = (${totalPower} × 1000) / ${voltage} = ${current.toFixed(2)} A`
	} else if (phase === 'three-phase' || phase === '3-phase' || phase === 'three') {
		// Three-phase: I = P / (√3 × V)
		const sqrt3 = Math.sqrt(3)
		current = (totalPower * 1000) / (sqrt3 * voltage)
		currentFormula = `I = P / (√3 × V) = (${totalPower} × 1000) / (√3 × ${voltage}) = ${current.toFixed(2)} A`
	} else {
		throw new Error(`Unknown phase: ${phase}. Supported: 'single-phase' or 'three-phase'.`)
	}

	// Find recommended cable size
	const cableInfo = findCableSize(current, material)
	const recommendedSize = cableInfo.size
	const maxCurrent = cableInfo.maxCurrent

	// Determine material name
	const materialName = material === 'aluminum' || material === 'aluminium' ? 'Aluminum' : 'Copper'
	const isAluminum = materialName === 'Aluminum'

	// Create formula explanation
	let formula = `Current Calculation:\n${currentFormula}\n\n`
	formula += `Cable Size Selection:\n`
	formula += `  Calculated Current: ${current.toFixed(2)} A\n`
	if (isAluminum) {
		formula += `  Adjusted Current (Aluminum): ${(current * 1.3).toFixed(2)} A\n`
	}
	formula += `  Recommended Cable: ${recommendedSize} mm² (max ${maxCurrent} A)`

	// Create breakdown
	let breakdown = `Electrical System:\n`
	breakdown += `  Voltage: ${voltage} V (${voltageStr})\n`
	breakdown += `  Phase: ${phase === 'single-phase' || phase === 'single' ? 'Single-phase' : 'Three-phase'}\n`
	breakdown += `  Power: ${totalPower} kW\n\n`
	breakdown += `Calculated Current: ${current.toFixed(2)} A\n\n`
	breakdown += `Recommended Cable:\n`
	breakdown += `  Cross-Section: ${recommendedSize} mm²\n`
	breakdown += `  Material: ${materialName}\n`
	breakdown += `  Maximum Current: ${maxCurrent} A\n`
	breakdown += `  Installation: ${installationType.charAt(0).toUpperCase() + installationType.slice(1)}`

	// Create explanation
	let explanation = `For a ${totalPower} kW load at ${voltage} V ${phase === 'single-phase' || phase === 'single' ? 'single-phase' : 'three-phase'}, the calculated current is ${current.toFixed(2)} A.`
	
	explanation += `\n\nThe recommended cable cross-section is ${recommendedSize} mm² ${materialName.toLowerCase()} cable, which can handle up to ${maxCurrent} A.`
	
	if (isAluminum) {
		explanation += `\n\nNote: Aluminum cables typically require one size larger than copper for the same current capacity due to lower conductivity.`
	}
	
	explanation += `\n\nThis is a simplified estimation based on current calculation. Actual cable sizing depends on: installation method, ambient temperature, cable length (voltage drop), and local electrical codes.`
	
	// Add warning
	explanation += `\n\n⚠️ Warning: This is a simplified estimation tool. Always consult local electrical codes, qualified electricians, and proper electrical design standards (IEC, NEC, etc.) for actual cable sizing. This calculator is for planning and estimation only, not a replacement for proper electrical design.`

	return {
		current: Number(current.toFixed(2)),
		recommendedSize: Number(recommendedSize.toFixed(1)),
		maxCurrent,
		voltage,
		phase: phase === 'single-phase' || phase === 'single' ? 'single-phase' : 'three-phase',
		totalPower: Number(totalPower.toFixed(2)),
		material: materialName,
		installationType: installationType.charAt(0).toUpperCase() + installationType.slice(1),
		formula,
		breakdown,
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculateCableSize', calculateCableSize)

