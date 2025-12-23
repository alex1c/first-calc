/**
 * Putty calculation function
 * Calculates putty (wall filler) needed for surface finishing
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert kilograms to pounds
 */
function kilogramsToPounds(kg: number): number {
	return kg * 2.20462
}

/**
 * Convert pounds to kilograms
 */
function poundsToKilograms(lb: number): number {
	return lb / 2.20462
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
 * Convert square meters to square feet
 */
function squareMetersToSquareFeet(sqm: number): number {
	return sqm * 10.7639
}

/**
 * Convert square feet to square meters
 */
function squareFeetToSquareMeters(sqft: number): number {
	return sqft / 10.7639
}

/**
 * Calculate putty needed for surface finishing
 * 
 * Takes into account:
 * - Surface area
 * - Layer thickness
 * - Consumption rate (kg per m² per mm)
 * - Number of layers
 * - Waste margin
 * 
 * @param inputs - Input values including surface area, thickness, consumption, layers, and waste margin
 * @returns Calculated putty quantities and breakdown
 */
export const calculatePutty: CalculationFunction = (inputs) => {
	// Extract inputs
	const surfaceAreaStr = String(inputs.surfaceArea || '').trim()
	const layerThicknessStr = String(inputs.layerThickness || '1').trim()
	const consumptionRateStr = String(inputs.consumptionRate || '').trim()
	const numberOfLayersStr = String(inputs.numberOfLayers || '1').trim()
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	const wastePercent = Number(inputs.wasteMargin) || 10

	// Validation
	if (!surfaceAreaStr || surfaceAreaStr.trim() === '') {
		throw new Error('Surface area is required.')
	}

	const surfaceArea = parseFloat(surfaceAreaStr)
	if (isNaN(surfaceArea) || !Number.isFinite(surfaceArea)) {
		throw new Error('Surface area must be a valid number.')
	}

	if (surfaceArea <= 0) {
		throw new Error('Surface area must be greater than 0.')
	}

	const layerThickness = parseFloat(layerThicknessStr)
	if (isNaN(layerThickness) || !Number.isFinite(layerThickness) || layerThickness <= 0) {
		throw new Error('Layer thickness must be a valid positive number.')
	}

	const numberOfLayers = parseInt(numberOfLayersStr, 10)
	if (isNaN(numberOfLayers) || !Number.isInteger(numberOfLayers)) {
		throw new Error('Number of layers must be a valid integer.')
	}

	if (numberOfLayers <= 0) {
		throw new Error('Number of layers must be at least 1.')
	}

	// Determine consumption rate and units
	let consumptionRate: number
	let consumptionUnit: string
	let puttyUnit: string
	let thicknessUnit: string
	let surfaceAreaM2: number
	let layerThicknessMm: number

	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		// Metric: use m² and mm
		surfaceAreaM2 = surfaceArea
		layerThicknessMm = layerThickness // Assume input is in mm
		
		if (consumptionRateStr && consumptionRateStr.trim() !== '') {
			consumptionRate = parseFloat(consumptionRateStr)
			if (isNaN(consumptionRate) || !Number.isFinite(consumptionRate) || consumptionRate <= 0) {
				throw new Error('Consumption rate must be a valid positive number.')
			}
		} else {
			consumptionRate = 1.2 // Default: 1.2 kg/m²/mm
		}
		consumptionUnit = 'kg/m²/mm'
		puttyUnit = 'kg'
		thicknessUnit = 'mm'
	} else {
		// Imperial: convert to metric for calculation, then convert back
		surfaceAreaM2 = squareFeetToSquareMeters(surfaceArea)
		layerThicknessMm = inchesToMillimeters(layerThickness) // Assume input is in inches
		
		if (consumptionRateStr && consumptionRateStr.trim() !== '') {
			// If provided in imperial, convert to metric
			// Assume input is in lbs/ft²/inch, convert to kg/m²/mm
			const consumptionLbFt2In = parseFloat(consumptionRateStr)
			if (isNaN(consumptionLbFt2In) || !Number.isFinite(consumptionLbFt2In) || consumptionLbFt2In <= 0) {
				throw new Error('Consumption rate must be a valid positive number.')
			}
			// Convert: 1 lb/ft²/inch = 0.2048 kg/m²/mm (approximate)
			consumptionRate = consumptionLbFt2In * 0.2048
		} else {
			consumptionRate = 1.2 // Default: 1.2 kg/m²/mm
		}
		consumptionUnit = 'kg/m²/mm'
		puttyUnit = 'kg'
		thicknessUnit = 'mm'
	}

	// Calculate putty per layer
	const puttyPerLayer = surfaceAreaM2 * layerThicknessMm * consumptionRate
	
	// Calculate total putty needed
	// TotalPutty = surfaceArea × layerThickness × consumptionRate × numberOfLayers
	const totalPutty = puttyPerLayer * numberOfLayers
	
	// Apply waste margin if enabled
	let totalPuttyWithWaste = totalPutty
	if (includeWaste) {
		totalPuttyWithWaste = totalPutty * (1 + wastePercent / 100)
	}

	// Convert to display units
	let totalPuttyDisplay = totalPutty
	let totalPuttyWithWasteDisplay = totalPuttyWithWaste
	let puttyPerLayerDisplay = puttyPerLayer
	
	if (unit === 'feet' || unit === 'ft') {
		// Convert kg to pounds for display
		totalPuttyDisplay = kilogramsToPounds(totalPutty)
		totalPuttyWithWasteDisplay = kilogramsToPounds(totalPuttyWithWaste)
		puttyPerLayerDisplay = kilogramsToPounds(puttyPerLayer)
		puttyUnit = 'lbs'
	}

	// Format putty required
	const puttyRequiredFormatted = totalPuttyDisplay < 0.1 
		? totalPuttyDisplay.toFixed(3) 
		: totalPuttyDisplay < 1 
		? totalPuttyDisplay.toFixed(2) 
		: totalPuttyDisplay < 10 
		? totalPuttyDisplay.toFixed(1) 
		: Math.round(totalPuttyDisplay * 10) / 10

	// Format putty per layer
	const puttyPerLayerFormatted = puttyPerLayerDisplay < 0.1 
		? puttyPerLayerDisplay.toFixed(3) 
		: puttyPerLayerDisplay < 1 
		? puttyPerLayerDisplay.toFixed(2) 
		: puttyPerLayerDisplay < 10 
		? puttyPerLayerDisplay.toFixed(1) 
		: Math.round(puttyPerLayerDisplay * 10) / 10
		
	// Format putty with waste
	const puttyRequiredWithWasteFormatted = totalPuttyWithWasteDisplay < 0.1 
		? totalPuttyWithWasteDisplay.toFixed(3) 
		: totalPuttyWithWasteDisplay < 1 
		? totalPuttyWithWasteDisplay.toFixed(2) 
		: totalPuttyWithWasteDisplay < 10 
		? totalPuttyWithWasteDisplay.toFixed(1) 
		: Math.round(totalPuttyWithWasteDisplay * 10) / 10

	// Calculate number of bags (assume 20 kg bags, or 44 lbs for imperial)
	const bagWeight = unit === 'meters' || unit === 'meter' || unit === 'm' ? 20 : 44 // 20 kg ≈ 44 lbs
	const numberOfBags = Math.ceil(totalPuttyWithWaste / bagWeight)
	const numberOfBagsExact = Math.ceil(totalPutty / bagWeight)

	// Create explanation
	const areaUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²'
	const thicknessDisplay = unit === 'meters' || unit === 'meter' || unit === 'm' 
		? `${layerThicknessMm} ${thicknessUnit}` 
		: `${layerThickness} inches`
	
	let explanation = `For ${surfaceArea.toFixed(1)} ${areaUnit} of surface, applying ${numberOfLayers} layer${numberOfLayers > 1 ? 's' : ''} of putty with thickness ${thicknessDisplay} and consumption rate ${consumptionRate.toFixed(2)} ${consumptionUnit}, you will need approximately ${puttyRequiredFormatted} ${puttyUnit} of putty.`
	
	if (numberOfLayers > 1) {
		explanation += `\n\nPer layer: ${puttyPerLayerFormatted} ${puttyUnit}.`
	}
	
	if (includeWaste) {
		explanation += `\n\nWith a ${wastePercent}% waste margin, you should order ${puttyRequiredWithWasteFormatted} ${puttyUnit} (approximately ${numberOfBags} bag${numberOfBags > 1 ? 's' : ''} of ${bagWeight} ${puttyUnit} each) to account for spillage, uneven surfaces, and touch-ups.`
	} else {
		explanation += `\n\nThis is approximately ${numberOfBagsExact} bag${numberOfBagsExact > 1 ? 's' : ''} of ${bagWeight} ${puttyUnit} each. Consider adding 10% extra for waste, spillage, and uneven surfaces.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Thicker layers and uneven surfaces increase consumption. For very uneven walls, you may need 20-30% more putty than calculated. Always buy extra to ensure you have enough material for the entire project.`

	return {
		puttyRequired: totalPutty,
		puttyRequiredFormatted,
		puttyPerLayer: puttyPerLayer,
		puttyPerLayerFormatted,
		puttyRequiredWithWaste: includeWaste ? totalPuttyWithWaste : totalPutty,
		puttyRequiredWithWasteFormatted: includeWaste ? puttyRequiredWithWasteFormatted : puttyRequiredFormatted,
		numberOfBags: includeWaste ? numberOfBags : numberOfBagsExact,
		bagWeight,
		surfaceArea,
		layerThickness: layerThicknessMm,
		layerThicknessDisplay: thicknessDisplay,
		consumptionRate,
		consumptionUnit,
		numberOfLayers,
		puttyUnit,
		unit: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'meters' : 'feet',
		areaUnit,
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculatePutty', calculatePutty)


