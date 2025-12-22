/**
 * Brick calculation function
 * Estimates number of bricks needed for a wall based on dimensions, brick size, and mortar joints
 */

import type { CalculationFunction } from './registry'

/**
 * Standard brick dimensions in mm (will be converted based on unit)
 */
const STANDARD_BRICK = { length: 250, width: 120, height: 65 } // mm
const MODULAR_BRICK = { length: 200, width: 100, height: 75 } // mm

/**
 * Calculate number of bricks needed for a wall
 * 
 * Takes into account:
 * - Wall dimensions
 * - Brick size (preset or custom)
 * - Mortar joint thickness
 * - Wall thickness (half brick, one brick, etc.)
 * - Openings (doors, windows)
 * - Waste margin
 * 
 * @param inputs - Input values including wall dimensions, brick size, mortar, and waste margin
 * @returns Calculated brick quantities and breakdown
 */
export function calculateBrick(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get wall dimensions
	const wallLength = Number(inputs.wallLength)
	const wallHeight = Number(inputs.wallHeight)
	
	if (isNaN(wallLength) || wallLength <= 0) {
		throw new Error('Wall length must be a positive number')
	}
	if (isNaN(wallHeight) || wallHeight <= 0) {
		throw new Error('Wall height must be a positive number')
	}
	
	// Calculate gross wall area
	const grossWallArea = wallLength * wallHeight
	
	// Calculate openings area if enabled
	const subtractOpenings = 
		inputs.subtractOpenings === true || 
		inputs.subtractOpenings === 'true' || 
		String(inputs.subtractOpenings).toLowerCase() === 'true'
	
	let openingsArea = 0
	let doorsArea = 0
	let windowsArea = 0
	
	if (subtractOpenings) {
		const doorsCount = Number(inputs.doorsCount || 0)
		const doorWidth = Number(inputs.doorWidth || 0)
		const doorHeight = Number(inputs.doorHeight || 0)
		
		const windowsCount = Number(inputs.windowsCount || 0)
		const windowWidth = Number(inputs.windowWidth || 0)
		const windowHeight = Number(inputs.windowHeight || 0)
		
		if (doorsCount > 0) {
			if (isNaN(doorWidth) || doorWidth <= 0) {
				throw new Error('Door width must be a positive number when doors are included')
			}
			if (isNaN(doorHeight) || doorHeight <= 0) {
				throw new Error('Door height must be a positive number when doors are included')
			}
			doorsArea = doorsCount * doorWidth * doorHeight
		}
		
		if (windowsCount > 0) {
			if (isNaN(windowWidth) || windowWidth <= 0) {
				throw new Error('Window width must be a positive number when windows are included')
			}
			if (isNaN(windowHeight) || windowHeight <= 0) {
				throw new Error('Window height must be a positive number when windows are included')
			}
			windowsArea = windowsCount * windowWidth * windowHeight
		}
		
		openingsArea = doorsArea + windowsArea
	}
	
	// Calculate net wall area
	const netWallArea = Math.max(grossWallArea - openingsArea, 0)
	
	// Get brick type and dimensions
	const brickType = String(inputs.brickType || 'standard').toLowerCase()
	
	let brickLength = 0
	let brickWidth = 0
	let brickHeight = 0
	
	if (brickType === 'standard') {
		// Convert mm to display unit
		if (isMetric) {
			brickLength = STANDARD_BRICK.length / 1000 // mm to m
			brickWidth = STANDARD_BRICK.width / 1000
			brickHeight = STANDARD_BRICK.height / 1000
		} else {
			brickLength = STANDARD_BRICK.length / 304.8 // mm to ft
			brickWidth = STANDARD_BRICK.width / 304.8
			brickHeight = STANDARD_BRICK.height / 304.8
		}
	} else if (brickType === 'modular') {
		if (isMetric) {
			brickLength = MODULAR_BRICK.length / 1000
			brickWidth = MODULAR_BRICK.width / 1000
			brickHeight = MODULAR_BRICK.height / 1000
		} else {
			brickLength = MODULAR_BRICK.length / 304.8
			brickWidth = MODULAR_BRICK.width / 304.8
			brickHeight = MODULAR_BRICK.height / 304.8
		}
	} else if (brickType === 'custom') {
		brickLength = Number(inputs.customBrickLength)
		brickWidth = Number(inputs.customBrickWidth)
		brickHeight = Number(inputs.customBrickHeight)
		
		if (isNaN(brickLength) || brickLength <= 0) {
			throw new Error('Custom brick length must be a positive number')
		}
		if (isNaN(brickWidth) || brickWidth <= 0) {
			throw new Error('Custom brick width must be a positive number')
		}
		if (isNaN(brickHeight) || brickHeight <= 0) {
			throw new Error('Custom brick height must be a positive number')
		}
	} else {
		throw new Error(`Unknown brick type: ${brickType}`)
	}
	
	// Get mortar joint thickness (default: 10mm for metric, ~0.4 inches for imperial)
	const defaultJointThickness = isMetric ? 0.01 : 0.4 / 12 // 10mm = 0.01m, 0.4 inches = 0.0333 ft
	const jointThickness = Number(inputs.jointThickness) || defaultJointThickness
	if (isNaN(jointThickness) || jointThickness < 0) {
		throw new Error('Mortar joint thickness must be a non-negative number')
	}
	
	// Calculate effective brick face area (with mortar joint)
	const effectiveBrickLength = brickLength + jointThickness
	const effectiveBrickHeight = brickHeight + jointThickness
	const brickFaceArea = effectiveBrickLength * effectiveBrickHeight
	
	// Calculate bricks per square unit
	const bricksPerSquareUnit = 1 / brickFaceArea
	
	// Get wall thickness
	const wallThickness = String(inputs.wallThickness || 'one').toLowerCase()
	
	// Thickness multipliers (approximate)
	let thicknessMultiplier = 1
	let thicknessDescription = ''
	
	switch (wallThickness) {
		case 'half':
		case 'half brick':
			thicknessMultiplier = 0.5
			thicknessDescription = 'Half Brick (Single Wythe)'
			break
		case 'one':
		case 'one brick':
			thicknessMultiplier = 2.0 // Approximately 2x for double wythe
			thicknessDescription = 'One Brick (Double Wythe)'
			break
		case 'one-and-a-half':
		case 'one and a half':
			thicknessMultiplier = 3.0
			thicknessDescription = 'One and a Half Bricks'
			break
		default:
			thicknessMultiplier = 2.0
			thicknessDescription = 'One Brick (Double Wythe)'
	}
	
	// Calculate total bricks needed
	const totalBricks = netWallArea * bricksPerSquareUnit * thicknessMultiplier
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let totalBricksWithWaste = totalBricks
	if (includeWaste) {
		totalBricksWithWaste = totalBricks * (1 + wastePercent / 100)
	}
	
	// Round up bricks (always round up to ensure enough material)
	const totalBricksRounded = Math.ceil(totalBricks)
	const totalBricksRoundedWithWaste = Math.ceil(totalBricksWithWaste)
	
	// Determine unit labels
	const areaUnit = isMetric ? 'm²' : 'ft²'
	const areaUnitFull = isMetric ? 'square meters' : 'square feet'
	const lengthUnit = isMetric ? 'm' : 'ft'
	const jointUnit = isMetric ? 'mm' : 'in'
	
	// Create formula explanation
	let formula = `Net Wall Area = ${wallLength} × ${wallHeight} = ${grossWallArea.toFixed(2)} ${areaUnit}`
	if (subtractOpenings && openingsArea > 0) {
		formula += ` - ${openingsArea.toFixed(2)} ${areaUnit} (openings) = ${netWallArea.toFixed(2)} ${areaUnit}`
	}
	formula += `\n\nEffective Brick Face Area = (Brick Length + Joint) × (Brick Height + Joint)\n`
	formula += `= (${brickLength.toFixed(3)} + ${jointThickness.toFixed(3)}) × (${brickHeight.toFixed(3)} + ${jointThickness.toFixed(3)})\n`
	formula += `= ${effectiveBrickLength.toFixed(3)} × ${effectiveBrickHeight.toFixed(3)} = ${brickFaceArea.toFixed(4)} ${areaUnit}\n\n`
	formula += `Bricks per ${areaUnit} = 1 / ${brickFaceArea.toFixed(4)} = ${bricksPerSquareUnit.toFixed(2)} bricks\n\n`
	formula += `Total Bricks = Net Area × Bricks per ${areaUnit} × Thickness Multiplier\n`
	formula += `= ${netWallArea.toFixed(2)} × ${bricksPerSquareUnit.toFixed(2)} × ${thicknessMultiplier} = ${totalBricks.toFixed(2)} bricks`
	
	if (includeWaste) {
		formula += `\n\nWith ${wastePercent}% waste margin: ${totalBricksWithWaste.toFixed(2)} bricks → ${totalBricksRoundedWithWaste} bricks (rounded up)`
	} else {
		formula += ` → ${totalBricksRounded} bricks (rounded up)`
	}
	
	// Create breakdown
	let breakdown = `Wall Dimensions: ${wallLength} × ${wallHeight} ${lengthUnit}\n`
	breakdown += `Gross Wall Area: ${grossWallArea.toFixed(2)} ${areaUnit}\n`
	
	if (subtractOpenings && openingsArea > 0) {
		breakdown += `Openings Area: ${openingsArea.toFixed(2)} ${areaUnit}\n`
	}
	
	breakdown += `Net Wall Area: ${netWallArea.toFixed(2)} ${areaUnit}\n\n`
	breakdown += `Brick Size: ${brickLength.toFixed(3)} × ${brickWidth.toFixed(3)} × ${brickHeight.toFixed(3)} ${lengthUnit}\n`
	breakdown += `Mortar Joint: ${jointThickness.toFixed(3)} ${lengthUnit}\n`
	breakdown += `Wall Thickness: ${thicknessDescription}\n`
	breakdown += `Bricks per ${areaUnit}: ${bricksPerSquareUnit.toFixed(2)}\n\n`
	breakdown += `Total Bricks: ${totalBricksRounded} bricks`
	
	if (includeWaste) {
		breakdown += `\nWith ${wastePercent}% waste margin: ${totalBricksRoundedWithWaste} bricks`
	}
	
	// Create explanation
	let explanation = `For a wall measuring ${wallLength} × ${wallHeight} ${lengthUnit}, the net wall area is ${netWallArea.toFixed(2)} ${areaUnitFull}.`
	
	explanation += `\n\nUsing ${brickType} bricks (${brickLength.toFixed(3)} × ${brickHeight.toFixed(3)} ${lengthUnit} face) with ${jointThickness.toFixed(3)} ${lengthUnit} mortar joints, you need approximately ${bricksPerSquareUnit.toFixed(2)} bricks per ${areaUnitFull}.`
	
	explanation += `\n\nFor a ${thicknessDescription.toLowerCase()} wall, you need approximately ${totalBricksRounded} bricks.`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${totalBricksRoundedWithWaste} bricks to account for breakage and cutting.`
	} else {
		explanation += ` Consider adding 10% extra for breakage, cutting, and batch color variations.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Brick breakage during handling and cutting is common, so adding a waste margin is recommended. Also, bricks from different batches may have slight color variations - buying extra ensures you have matching bricks for repairs or additions. The mortar joint thickness affects the number of bricks needed - thicker joints mean fewer bricks per square meter.`
	
	return {
		grossWallArea: Number(grossWallArea.toFixed(2)),
		openingsArea: Number(openingsArea.toFixed(2)),
		netWallArea: Number(netWallArea.toFixed(2)),
		brickFaceArea: Number(brickFaceArea.toFixed(4)),
		bricksPerSquareUnit: Number(bricksPerSquareUnit.toFixed(2)),
		totalBricks: totalBricksRounded,
		totalBricksWithWaste: includeWaste ? totalBricksRoundedWithWaste : totalBricksRounded,
		totalBricksExact: Number(totalBricks.toFixed(2)),
		brickLength,
		brickHeight,
		jointThickness,
		thicknessMultiplier,
		thicknessDescription,
		areaUnit,
		areaUnitFull,
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
registerCalculation('calculateBrick', calculateBrick)

