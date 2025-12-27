/**
 * Calculate paint needed for walls, ceilings, or floors
 * Inputs: surfaceArea, surfaceType, numberOfCoats, paintCoverage, unit, wasteMargin
 * Outputs: paintRequired, paintPerCoat, paintRequiredWithWaste, explanation, cansEstimate
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert liters to gallons
 */
function litersToGallons(liters: number): number {
	return liters / 3.78541
}

/**
 * Convert gallons to liters
 */
function gallonsToLiters(gallons: number): number {
	return gallons * 3.78541
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
 * Calculate paint needed
 */
export const calculatePaint: CalculationFunction = (inputs) => {
	// Extract inputs
	const surfaceAreaStr = String(inputs.surfaceArea || inputs.roomArea || '').trim() // Support both for backward compatibility
	const surfaceType = String(inputs.surfaceType || 'walls').toLowerCase()
	const numberOfCoatsStr = String(inputs.numberOfCoats || '2').trim()
	const paintCoverageStr = String(inputs.paintCoverage || '').trim()
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const includeWaste = 
		inputs.includeWaste === true || (typeof inputs.includeWaste === 'string' && inputs.includeWaste.toLowerCase() === 'true') || 
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

	const numberOfCoats = parseInt(numberOfCoatsStr, 10)
	if (isNaN(numberOfCoats) || !Number.isInteger(numberOfCoats)) {
		throw new Error('Number of coats must be a valid integer.')
	}

	if (numberOfCoats <= 0) {
		throw new Error('Number of coats must be at least 1.')
	}

	// Determine paint coverage based on unit
	let paintCoverage: number
	let coverageUnit: string
	let paintUnit: string

	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		// Metric: default 10 m² per liter
		if (paintCoverageStr && paintCoverageStr.trim() !== '') {
			paintCoverage = parseFloat(paintCoverageStr)
			if (isNaN(paintCoverage) || !Number.isFinite(paintCoverage) || paintCoverage <= 0) {
				throw new Error('Paint coverage must be a valid positive number.')
			}
		} else {
			paintCoverage = 10 // Default: 10 m² per liter
		}
		coverageUnit = 'm²/liter'
		paintUnit = 'liters'
	} else {
		// Imperial: default 400 ft² per gallon
		if (paintCoverageStr && paintCoverageStr.trim() !== '') {
			paintCoverage = parseFloat(paintCoverageStr)
			if (isNaN(paintCoverage) || !Number.isFinite(paintCoverage) || paintCoverage <= 0) {
				throw new Error('Paint coverage must be a valid positive number.')
			}
		} else {
			paintCoverage = 400 // Default: 400 ft² per gallon
		}
		coverageUnit = 'ft²/gallon'
		paintUnit = 'gallons'
	}

	// Calculate paint per coat
	const paintPerCoat = surfaceArea / paintCoverage
	
	// Calculate total paint needed
	// TotalPaint = (surfaceArea × numberOfCoats) / paintCoverage
	const totalPaint = (surfaceArea * numberOfCoats) / paintCoverage
	
	// Apply waste margin if enabled
	let totalPaintWithWaste = totalPaint
	if (includeWaste) {
		totalPaintWithWaste = totalPaint * (1 + wastePercent / 100)
	}

	// Format paint required
	const paintRequiredFormatted = totalPaint < 0.1 
		? totalPaint.toFixed(3) 
		: totalPaint < 1 
		? totalPaint.toFixed(2) 
		: totalPaint < 10 
		? totalPaint.toFixed(1) 
		: Math.round(totalPaint * 10) / 10

	// Convert to alternative unit
	let paintRequiredAlternative: number
	let alternativeUnit: string
	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		// Convert liters to gallons
		paintRequiredAlternative = litersToGallons(totalPaint)
		alternativeUnit = 'gallons'
	} else {
		// Convert gallons to liters
		paintRequiredAlternative = gallonsToLiters(totalPaint)
		alternativeUnit = 'liters'
	}

	const paintRequiredAlternativeFormatted = paintRequiredAlternative < 0.1 
		? paintRequiredAlternative.toFixed(3) 
		: paintRequiredAlternative < 1 
		? paintRequiredAlternative.toFixed(2) 
		: paintRequiredAlternative < 10 
		? paintRequiredAlternative.toFixed(1) 
		: Math.round(paintRequiredAlternative * 10) / 10

	// Estimate cans (common sizes: 1L, 2.5L, 5L, 1 gallon, 5 gallons)
	let cansEstimate: string = ''
	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		if (totalPaint <= 1) {
			cansEstimate = '1 × 1 liter can'
		} else if (totalPaint <= 2.5) {
			cansEstimate = '1 × 2.5 liter can'
		} else if (totalPaint <= 5) {
			cansEstimate = '1 × 5 liter can'
		} else {
			const cans5L = Math.ceil(totalPaint / 5)
			cansEstimate = `${cans5L} × 5 liter can${cans5L > 1 ? 's' : ''}`
		}
	} else {
		if (totalPaint <= 1) {
			cansEstimate = '1 × 1 gallon can'
		} else if (totalPaint <= 5) {
			cansEstimate = '1 × 5 gallon bucket'
		} else {
			const cans5Gal = Math.ceil(totalPaint / 5)
			cansEstimate = `${cans5Gal} × 5 gallon bucket${cans5Gal > 1 ? 's' : ''}`
		}
	}

	// Format paint per coat
	const paintPerCoatFormatted = paintPerCoat < 0.1 
		? paintPerCoat.toFixed(3) 
		: paintPerCoat < 1 
		? paintPerCoat.toFixed(2) 
		: paintPerCoat < 10 
		? paintPerCoat.toFixed(1) 
		: Math.round(paintPerCoat * 10) / 10
		
	// Format paint with waste
	const paintRequiredWithWasteFormatted = totalPaintWithWaste < 0.1 
		? totalPaintWithWaste.toFixed(3) 
		: totalPaintWithWaste < 1 
		? totalPaintWithWaste.toFixed(2) 
		: totalPaintWithWaste < 10 
		? totalPaintWithWaste.toFixed(1) 
		: Math.round(totalPaintWithWaste * 10) / 10

	// Create explanation
	const areaUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²'
	const surfaceTypeName = surfaceType === 'walls' ? 'walls' : surfaceType === 'ceiling' ? 'ceiling' : surfaceType === 'floor' ? 'floor' : 'surface'
	
	let explanation = `For ${surfaceArea.toFixed(1)} ${areaUnit} of ${surfaceTypeName} area, applying ${numberOfCoats} coat${numberOfCoats > 1 ? 's' : ''} with paint coverage of ${paintCoverage} ${coverageUnit}, you will need approximately ${paintRequiredFormatted} ${paintUnit} of paint.`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${paintRequiredWithWasteFormatted} ${paintUnit} to account for spillage, touch-ups, and cutting in around edges.`
	} else {
		explanation += ` Consider adding 10% extra for waste, spillage, and touch-ups.`
	}
	
	// Add tip about rough surfaces
	if (surfaceType === 'walls' || surfaceType === 'ceiling') {
		explanation += ` Tip: Rough or textured surfaces may require 10-20% more paint than smooth surfaces.`
	}

	return {
		paintRequired: totalPaint,
		paintRequiredFormatted,
		paintPerCoat: paintPerCoat,
		paintPerCoatFormatted,
		paintRequiredWithWaste: includeWaste ? totalPaintWithWaste : totalPaint,
		paintRequiredWithWasteFormatted: includeWaste ? paintRequiredWithWasteFormatted : paintRequiredFormatted,
		paintRequiredAlternative,
		paintRequiredAlternativeFormatted,
		alternativeUnit,
		explanation,
		cansEstimate,
		surfaceArea,
		roomArea: surfaceArea, // Backward compatibility
		numberOfCoats,
		paintCoverage,
		coverageUnit,
		paintUnit,
		surfaceType,
		unit: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'meters' : 'feet',
		areaUnit,
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
	}
}

// Register the calculation function
registerCalculation('calculatePaint', calculatePaint)

