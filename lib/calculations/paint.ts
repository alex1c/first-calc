/**
 * Calculate paint needed for a room
 * Inputs: roomArea, numberOfCoats, paintCoverage, unit
 * Outputs: paintRequired, paintRequiredFormatted, paintRequiredGallons, explanation, cansEstimate
 */

import type { CalculatorFunction } from '@/lib/calculators/types'
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
export const calculatePaint: CalculatorFunction = (inputs) => {
	// Extract inputs
	const roomAreaStr = String(inputs.roomArea || '').trim()
	const numberOfCoatsStr = String(inputs.numberOfCoats || '2').trim()
	const paintCoverageStr = String(inputs.paintCoverage || '').trim()
	const unit = String(inputs.unit || 'meters').toLowerCase()

	// Validation
	if (!roomAreaStr || roomAreaStr.trim() === '') {
		throw new Error('Room area is required.')
	}

	const roomArea = parseFloat(roomAreaStr)
	if (isNaN(roomArea) || !Number.isFinite(roomArea)) {
		throw new Error('Room area must be a valid number.')
	}

	if (roomArea <= 0) {
		throw new Error('Room area must be greater than 0.')
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

	// Calculate total paint needed
	// TotalPaint = (roomArea × numberOfCoats) / paintCoverage
	const totalPaint = (roomArea * numberOfCoats) / paintCoverage

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

	// Create explanation
	const areaUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²'
	const explanation = `For a room with area ${roomArea.toFixed(1)} ${areaUnit}, applying ${numberOfCoats} coat${numberOfCoats > 1 ? 's' : ''} with paint coverage of ${paintCoverage} ${coverageUnit}, you will need approximately ${paintRequiredFormatted} ${paintUnit} of paint.`

	return {
		paintRequired: totalPaint,
		paintRequiredFormatted,
		paintRequiredAlternative,
		paintRequiredAlternativeFormatted,
		alternativeUnit,
		explanation,
		cansEstimate,
		roomArea,
		numberOfCoats,
		paintCoverage,
		coverageUnit,
		paintUnit,
		unit: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'meters' : 'feet',
		areaUnit,
	}
}

// Register the calculation function
registerCalculation('calculatePaint', calculatePaint)

