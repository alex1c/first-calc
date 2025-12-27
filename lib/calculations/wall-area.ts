/**
 * Wall area calculation function
 * Calculates wall surface area for finishing works (paint, plaster, wallpaper, insulation)
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate wall surface area
 * 
 * Supports three modes:
 * - Single wall: one wall area
 * - Room: 4 walls (perimeter × height)
 * - Multiple walls: count × (width × height)
 * 
 * Optionally subtracts openings (doors and windows)
 * 
 * @param inputs - Input values including mode, dimensions, openings, and units
 * @returns Calculated gross area, openings area, net area, and breakdown
 */
export function calculateWallArea(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get calculation mode
	const mode = String(inputs.mode || 'single').toLowerCase()
	
	let grossArea = 0
	let formula = ''
	let modeDescription = ''
	
	// Determine unit labels
	const areaUnit = isMetric ? 'm²' : 'ft²'
	const areaUnitFull = isMetric ? 'square meters' : 'square feet'
	const lengthUnit = isMetric ? 'm' : 'ft'
	
	// Calculate gross area based on mode
	switch (mode) {
		case 'single': {
			const wallWidth = Number(inputs.wallWidth)
			const wallHeight = Number(inputs.wallHeight)
			
			if (isNaN(wallWidth) || wallWidth <= 0) {
				throw new Error('Wall width must be a positive number')
			}
			if (isNaN(wallHeight) || wallHeight <= 0) {
				throw new Error('Wall height must be a positive number')
			}
			
			grossArea = wallWidth * wallHeight
			formula = `Wall Area = Width × Height = ${wallWidth} × ${wallHeight} = ${grossArea.toFixed(2)} ${areaUnit}`
			modeDescription = 'Single Wall'
			break
		}
		
		case 'room': {
			const roomLength = Number(inputs.roomLength)
			const roomWidth = Number(inputs.roomWidth)
			const roomHeight = Number(inputs.roomHeight)
			
			if (isNaN(roomLength) || roomLength <= 0) {
				throw new Error('Room length must be a positive number')
			}
			if (isNaN(roomWidth) || roomWidth <= 0) {
				throw new Error('Room width must be a positive number')
			}
			if (isNaN(roomHeight) || roomHeight <= 0) {
				throw new Error('Room height must be a positive number')
			}
			
			const perimeter = 2 * (roomLength + roomWidth)
			grossArea = perimeter * roomHeight
			formula = `Perimeter = 2 × (Length + Width) = 2 × (${roomLength} + ${roomWidth}) = ${perimeter.toFixed(2)} ${lengthUnit}\n`
			formula += `Wall Area = Perimeter × Height = ${perimeter.toFixed(2)} × ${roomHeight} = ${grossArea.toFixed(2)} ${areaUnit}`
			modeDescription = 'Room (4 Walls)'
			break
		}
		
		case 'multiple': {
			const wallsCount = Number(inputs.wallsCount)
			const wallWidth = Number(inputs.wallWidth)
			const wallHeight = Number(inputs.wallHeight)
			
			if (isNaN(wallsCount) || wallsCount <= 0 || !Number.isInteger(wallsCount)) {
				throw new Error('Number of walls must be a positive integer')
			}
			if (isNaN(wallWidth) || wallWidth <= 0) {
				throw new Error('Wall width must be a positive number')
			}
			if (isNaN(wallHeight) || wallHeight <= 0) {
				throw new Error('Wall height must be a positive number')
			}
			
			const singleWallArea = wallWidth * wallHeight
			grossArea = wallsCount * singleWallArea
			formula = `Single Wall Area = Width × Height = ${wallWidth} × ${wallHeight} = ${singleWallArea.toFixed(2)} ${areaUnit}\n`
			formula += `Total Wall Area = ${wallsCount} walls × ${singleWallArea.toFixed(2)} = ${grossArea.toFixed(2)} ${areaUnit}`
			modeDescription = `Multiple Walls (${wallsCount} walls)`
			break
		}
		
		default:
			throw new Error(`Unknown mode: ${mode}`)
	}
	
	// Calculate openings area if enabled
	const subtractOpenings =
		inputs.subtractOpenings === true ||
		(typeof inputs.subtractOpenings === 'string' && inputs.subtractOpenings.toLowerCase() === 'true') ||
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
		
		if (openingsArea > 0) {
			formula += `\n\nOpenings:\n`
			if (doorsArea > 0) {
				formula += `Doors Area = ${doorsCount} × (${doorWidth} × ${doorHeight}) = ${doorsArea.toFixed(2)} ${areaUnit}\n`
			}
			if (windowsArea > 0) {
				formula += `Windows Area = ${windowsCount} × (${windowWidth} × ${windowHeight}) = ${windowsArea.toFixed(2)} ${areaUnit}\n`
			}
			formula += `Total Openings Area = ${openingsArea.toFixed(2)} ${areaUnit}`
		}
	}
	
	// Calculate net area (gross - openings, minimum 0)
	const netArea = Math.max(grossArea - openingsArea, 0)
	
	if (openingsArea > 0) {
		formula += `\n\nNet Wall Area = Gross Area - Openings = ${grossArea.toFixed(2)} - ${openingsArea.toFixed(2)} = ${netArea.toFixed(2)} ${areaUnit}`
	} else {
		formula += `\n\nNet Wall Area = Gross Area = ${grossArea.toFixed(2)} ${areaUnit}`
	}
	
	// Create breakdown
	let breakdown = `${modeDescription}:\n`
	breakdown += `Gross Wall Area: ${grossArea.toFixed(2)} ${areaUnit}\n`
	
	if (subtractOpenings && openingsArea > 0) {
		breakdown += `\nOpenings:\n`
		if (doorsArea > 0) {
			breakdown += `  Doors: ${doorsArea.toFixed(2)} ${areaUnit}\n`
		}
		if (windowsArea > 0) {
			breakdown += `  Windows: ${windowsArea.toFixed(2)} ${areaUnit}\n`
		}
		breakdown += `  Total Openings: ${openingsArea.toFixed(2)} ${areaUnit}\n`
		breakdown += `\nNet Wall Area: ${netArea.toFixed(2)} ${areaUnit}`
	} else {
		breakdown += `Net Wall Area: ${netArea.toFixed(2)} ${areaUnit}`
	}
	
	// Create explanation
	let explanation = `For ${modeDescription.toLowerCase()}, the gross wall area is ${grossArea.toFixed(2)} ${areaUnitFull}.`
	
	if (subtractOpenings && openingsArea > 0) {
		explanation += ` After subtracting ${openingsArea.toFixed(2)} ${areaUnitFull} for openings (doors and windows), the net wall area is ${netArea.toFixed(2)} ${areaUnitFull}.`
	} else {
		explanation += ` The net wall area is ${netArea.toFixed(2)} ${areaUnitFull}.`
	}
	
	explanation += `\n\nMeasurement Tips: Measure wall height from floor to ceiling. For painting or plastering, you typically use net area (after subtracting openings). For wallpaper or insulation, you may want to include a small margin for waste. Baseboards and crown molding are typically calculated separately and not included in wall area.`
	
	return {
		grossArea: Number(grossArea.toFixed(2)),
		openingsArea: Number(openingsArea.toFixed(2)),
		doorsArea: Number(doorsArea.toFixed(2)),
		windowsArea: Number(windowsArea.toFixed(2)),
		netArea: Number(netArea.toFixed(2)),
		areaUnit,
		areaUnitFull,
		lengthUnit,
		formula,
		breakdown,
		mode: modeDescription,
		unit: isMetric ? 'meters' : 'feet',
		subtractOpenings: subtractOpenings ? 'true' : 'false',
		explanation,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateWallArea', calculateWallArea)


