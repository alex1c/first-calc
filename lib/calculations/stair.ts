/**
 * Stair calculation function
 * Calculates comfortable stair dimensions: steps, riser height, tread depth, and angle
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert meters to feet
 */
function metersToFeet(meters: number): number {
	return meters * 3.28084
}

/**
 * Convert feet to meters
 */
function feetToMeters(feet: number): number {
	return feet / 3.28084
}

/**
 * Convert millimeters to inches
 */
function millimetersToInches(mm: number): number {
	return mm / 25.4
}

/**
 * Convert inches to millimeters
 */
function inchesToMillimeters(inches: number): number {
	return inches * 25.4
}

/**
 * Calculate stair dimensions
 * 
 * Takes into account:
 * - Total height (floor to floor)
 * - Preferred riser height
 * - Preferred tread depth
 * - Comfort rule: 2 × riser + tread ≈ 600-640 mm
 * 
 * @param inputs - Input values including total height, riser, tread, and units
 * @returns Calculated stair dimensions and breakdown
 */
export const calculateStair: CalculationFunction = (inputs) => {
	// Extract inputs
	const totalHeightStr = String(inputs.totalHeight || '').trim()
	const preferredRiserHeightStr = String(inputs.preferredRiserHeight || '170').trim()
	const preferredTreadDepthStr = String(inputs.preferredTreadDepth || '270').trim()
	const maxStepsStr = String(inputs.maxSteps || '').trim()
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'

	// Validation
	if (!totalHeightStr || totalHeightStr.trim() === '') {
		throw new Error('Total height is required.')
	}

	const totalHeight = parseFloat(totalHeightStr)
	if (isNaN(totalHeight) || !Number.isFinite(totalHeight) || totalHeight <= 0) {
		throw new Error('Total height must be a valid positive number.')
	}

	const preferredRiserHeight = parseFloat(preferredRiserHeightStr)
	if (isNaN(preferredRiserHeight) || !Number.isFinite(preferredRiserHeight) || preferredRiserHeight <= 0) {
		throw new Error('Preferred riser height must be a valid positive number.')
	}

	const preferredTreadDepth = parseFloat(preferredTreadDepthStr)
	if (isNaN(preferredTreadDepth) || !Number.isFinite(preferredTreadDepth) || preferredTreadDepth <= 0) {
		throw new Error('Preferred tread depth must be a valid positive number.')
	}

	// Convert to metric for calculations (if imperial)
	let totalHeightM = totalHeight
	let preferredRiserHeightM = preferredRiserHeight
	let preferredTreadDepthM = preferredTreadDepth

	if (!isMetric) {
		// Convert feet to meters
		totalHeightM = feetToMeters(totalHeight)
		// Convert inches to meters (assuming input is in inches)
		preferredRiserHeightM = inchesToMillimeters(preferredRiserHeight) / 1000
		preferredTreadDepthM = inchesToMillimeters(preferredTreadDepth) / 1000
	} else {
		// Convert mm to meters if needed (assuming input is in mm for riser/tread)
		if (preferredRiserHeight > 10) {
			preferredRiserHeightM = preferredRiserHeight / 1000
		}
		if (preferredTreadDepth > 10) {
			preferredTreadDepthM = preferredTreadDepth / 1000
		}
	}

	// Calculate number of steps
	let steps = Math.round(totalHeightM / preferredRiserHeightM)

	// Apply max steps constraint if provided
	if (maxStepsStr && maxStepsStr.trim() !== '') {
		const maxSteps = parseInt(maxStepsStr, 10)
		if (!isNaN(maxSteps) && maxSteps > 0 && steps > maxSteps) {
			steps = maxSteps
		}
	}

	// Ensure at least 1 step
	if (steps < 1) {
		steps = 1
	}

	// Calculate actual riser height (may differ from preferred due to rounding)
	const actualRiserHeight = totalHeightM / steps

	// Use preferred tread depth (or calculate based on comfort rule if needed)
	const treadDepth = preferredTreadDepthM

	// Calculate total run (horizontal distance)
	const totalRun = steps * treadDepth

	// Calculate stair angle
	const stairAngleRad = Math.atan(actualRiserHeight / treadDepth)
	const stairAngleDeg = (stairAngleRad * 180) / Math.PI

	// Calculate comfort rule: 2 × riser + tread
	const comfortValue = 2 * actualRiserHeight + treadDepth
	const comfortValueMm = comfortValue * 1000 // Convert to mm for display

	// Determine comfort level
	let comfortLevel = 'Good'
	let comfortNote = ''
	if (comfortValueMm >= 600 && comfortValueMm <= 640) {
		comfortLevel = 'Optimal'
		comfortNote = 'Meets the comfort rule: 2 × riser + tread = 600-640 mm'
	} else if (comfortValueMm < 600) {
		comfortLevel = 'Too Steep'
		comfortNote = 'Stairs may be too steep. Consider increasing tread depth or reducing riser height.'
	} else if (comfortValueMm > 640) {
		comfortLevel = 'Too Shallow'
		comfortNote = 'Stairs may be too shallow. Consider reducing tread depth or increasing riser height.'
	}

	// Convert results to display units
	let actualRiserHeightDisplay = actualRiserHeight * 1000 // mm
	let treadDepthDisplay = treadDepth * 1000 // mm
	let totalRunDisplay = totalRun
	let totalHeightDisplay = totalHeightM

	if (!isMetric) {
		actualRiserHeightDisplay = millimetersToInches(actualRiserHeight * 1000)
		treadDepthDisplay = millimetersToInches(treadDepth * 1000)
		totalRunDisplay = metersToFeet(totalRun)
		totalHeightDisplay = metersToFeet(totalHeightM)
	}

	// Determine unit labels
	const heightUnit = isMetric ? 'mm' : 'in'
	const lengthUnit = isMetric ? 'm' : 'ft'
	const lengthUnitFull = isMetric ? 'meters' : 'feet'

	// Create formula explanation
	let formula = `Number of Steps = round(Total Height / Preferred Riser)\n`
	formula += `Steps = round(${totalHeightM.toFixed(3)} / ${preferredRiserHeightM.toFixed(3)}) = ${steps}\n\n`
	formula += `Actual Riser Height = Total Height / Steps\n`
	formula += `Riser = ${totalHeightM.toFixed(3)} / ${steps} = ${actualRiserHeight.toFixed(3)} m (${actualRiserHeightDisplay.toFixed(1)} ${heightUnit})\n\n`
	formula += `Total Run = Steps × Tread Depth\n`
	formula += `Run = ${steps} × ${treadDepth.toFixed(3)} = ${totalRun.toFixed(2)} ${lengthUnitFull}\n\n`
	formula += `Stair Angle = arctan(Riser / Tread)\n`
	formula += `Angle = arctan(${actualRiserHeight.toFixed(3)} / ${treadDepth.toFixed(3)}) = ${stairAngleDeg.toFixed(1)}°\n\n`
	formula += `Comfort Rule: 2 × Riser + Tread = ${comfortValueMm.toFixed(0)} mm (${comfortLevel})`

	// Create breakdown
	let breakdown = `Total Height: ${totalHeightDisplay.toFixed(2)} ${lengthUnitFull} (${totalHeightM.toFixed(3)} m)\n`
	breakdown += `Preferred Riser: ${preferredRiserHeightM.toFixed(3)} m (${preferredRiserHeight} ${isMetric ? 'mm' : 'in'})\n`
	breakdown += `Preferred Tread: ${preferredTreadDepthM.toFixed(3)} m (${preferredTreadDepth} ${isMetric ? 'mm' : 'in'})\n\n`
	breakdown += `Calculated Dimensions:\n`
	breakdown += `  Number of Steps: ${steps}\n`
	breakdown += `  Actual Riser Height: ${actualRiserHeightDisplay.toFixed(1)} ${heightUnit} (${actualRiserHeight.toFixed(3)} m)\n`
	breakdown += `  Tread Depth: ${treadDepthDisplay.toFixed(1)} ${heightUnit} (${treadDepth.toFixed(3)} m)\n`
	breakdown += `  Total Run: ${totalRunDisplay.toFixed(2)} ${lengthUnitFull} (${totalRun.toFixed(2)} m)\n`
	breakdown += `  Stair Angle: ${stairAngleDeg.toFixed(1)}°\n\n`
	breakdown += `Comfort Check:\n`
	breakdown += `  2 × Riser + Tread = ${comfortValueMm.toFixed(0)} mm (${comfortLevel})`

	// Create explanation
	let explanation = `For a total height of ${totalHeightDisplay.toFixed(2)} ${lengthUnitFull}, with preferred riser height of ${preferredRiserHeightM.toFixed(3)} m, you need ${steps} steps.`
	
	explanation += `\n\nThe actual riser height is ${actualRiserHeightDisplay.toFixed(1)} ${heightUnit} (${actualRiserHeight.toFixed(3)} m), which may differ slightly from the preferred height due to rounding.`
	
	explanation += `\n\nWith a tread depth of ${treadDepthDisplay.toFixed(1)} ${heightUnit}, the total horizontal run is ${totalRunDisplay.toFixed(2)} ${lengthUnitFull} (${totalRun.toFixed(2)} m).`
	
	explanation += `\n\nThe stair angle is ${stairAngleDeg.toFixed(1)}°, which is ${stairAngleDeg < 30 ? 'comfortable' : stairAngleDeg < 40 ? 'moderate' : 'steep'} for walking.`
	
	explanation += `\n\n${comfortNote}`

	// Add practical note
	explanation += `\n\nPractical Note: Comfortable stairs follow the rule: 2 × riser + tread ≈ 600-640 mm. This ensures comfortable step height and depth. Typical residential stairs have risers of 150-190 mm (6-7.5 inches) and treads of 250-300 mm (10-12 inches). Always check local building codes for specific requirements.`

	return {
		steps,
		actualRiserHeight: Number(actualRiserHeight.toFixed(3)),
		actualRiserHeightDisplay: Number(actualRiserHeightDisplay.toFixed(1)),
		treadDepth: Number(treadDepth.toFixed(3)),
		treadDepthDisplay: Number(treadDepthDisplay.toFixed(1)),
		totalRun: Number(totalRun.toFixed(2)),
		totalRunDisplay: Number(totalRunDisplay.toFixed(2)),
		stairAngle: Number(stairAngleDeg.toFixed(1)),
		comfortValue: Number(comfortValueMm.toFixed(0)),
		comfortLevel,
		comfortNote,
		totalHeight: Number(totalHeightM.toFixed(3)),
		preferredRiserHeight: Number(preferredRiserHeightM.toFixed(3)),
		preferredTreadDepth: Number(preferredTreadDepthM.toFixed(3)),
		heightUnit,
		lengthUnit,
		lengthUnitFull,
		formula,
		breakdown,
		unit: isMetric ? 'meters' : 'feet',
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculateStair', calculateStair)

