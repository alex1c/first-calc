/**
 * Primer calculation function
 * Calculates primer needed for surface preparation before painting
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
 * Calculate primer needed for surface preparation
 * 
 * Takes into account:
 * - Surface area
 * - Surface condition (affects coverage)
 * - Number of primer coats
 * - Waste margin
 * 
 * @param inputs - Input values including surface area, condition, coats, and waste margin
 * @returns Calculated primer quantities and breakdown
 */
export const calculatePrimer: CalculationFunction = (inputs) => {
	// Extract inputs
	const surfaceAreaStr = String(inputs.surfaceArea || '').trim()
	const surfaceCondition = String(inputs.surfaceCondition || 'smooth').toLowerCase()
	const primerCoatsStr = String(inputs.primerCoats || '1').trim()
	const primerCoverageStr = String(inputs.primerCoverage || '').trim()
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

	const primerCoats = parseInt(primerCoatsStr, 10)
	if (isNaN(primerCoats) || !Number.isInteger(primerCoats)) {
		throw new Error('Number of primer coats must be a valid integer.')
	}

	if (primerCoats <= 0) {
		throw new Error('Number of primer coats must be at least 1.')
	}

	// Determine primer coverage based on surface condition and unit
	let primerCoverage: number
	let coverageUnit: string
	let primerUnit: string
	let conditionDescription: string = 'Smooth'

	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		// Metric: determine coverage based on condition
		if (primerCoverageStr && primerCoverageStr.trim() !== '') {
			primerCoverage = parseFloat(primerCoverageStr)
			if (isNaN(primerCoverage) || !Number.isFinite(primerCoverage) || primerCoverage <= 0) {
				throw new Error('Primer coverage must be a valid positive number.')
			}
		} else {
			// Default coverage based on surface condition
			switch (surfaceCondition) {
				case 'smooth':
					primerCoverage = 10 // m² per liter
					conditionDescription = 'Smooth (painted, sealed surfaces)'
					break
				case 'porous':
					primerCoverage = 7 // m² per liter
					conditionDescription = 'Porous (plaster, drywall, new surfaces)'
					break
				case 'rough':
					primerCoverage = 5 // m² per liter
					conditionDescription = 'Rough (concrete, brick, textured)'
					break
				default:
					primerCoverage = 10
					conditionDescription = 'Smooth'
			}
		}
		coverageUnit = 'm²/liter'
		primerUnit = 'liters'
	} else {
		// Imperial: convert metric defaults
		if (primerCoverageStr && primerCoverageStr.trim() !== '') {
			primerCoverage = parseFloat(primerCoverageStr)
			if (isNaN(primerCoverage) || !Number.isFinite(primerCoverage) || primerCoverage <= 0) {
				throw new Error('Primer coverage must be a valid positive number.')
			}
		} else {
			// Default coverage based on surface condition (convert from metric)
			switch (surfaceCondition) {
				case 'smooth':
					primerCoverage = 400 // ft² per gallon (10 m²/l ≈ 400 ft²/gal)
					conditionDescription = 'Smooth (painted, sealed surfaces)'
					break
				case 'porous':
					primerCoverage = 280 // ft² per gallon (7 m²/l ≈ 280 ft²/gal)
					conditionDescription = 'Porous (plaster, drywall, new surfaces)'
					break
				case 'rough':
					primerCoverage = 200 // ft² per gallon (5 m²/l ≈ 200 ft²/gal)
					conditionDescription = 'Rough (concrete, brick, textured)'
					break
				default:
					primerCoverage = 400
					conditionDescription = 'Smooth'
			}
		}
		coverageUnit = 'ft²/gallon'
		primerUnit = 'gallons'
	}

	// Calculate primer per coat
	const primerPerCoat = surfaceArea / primerCoverage
	
	// Calculate total primer needed
	// TotalPrimer = (surfaceArea × primerCoats) / primerCoverage
	const totalPrimer = (surfaceArea * primerCoats) / primerCoverage
	
	// Apply waste margin if enabled
	let totalPrimerWithWaste = totalPrimer
	if (includeWaste) {
		totalPrimerWithWaste = totalPrimer * (1 + wastePercent / 100)
	}

	// Format primer required
	const primerRequiredFormatted = totalPrimer < 0.1 
		? totalPrimer.toFixed(3) 
		: totalPrimer < 1 
		? totalPrimer.toFixed(2) 
		: totalPrimer < 10 
		? totalPrimer.toFixed(1) 
		: Math.round(totalPrimer * 10) / 10

	// Format primer per coat
	const primerPerCoatFormatted = primerPerCoat < 0.1 
		? primerPerCoat.toFixed(3) 
		: primerPerCoat < 1 
		? primerPerCoat.toFixed(2) 
		: primerPerCoat < 10 
		? primerPerCoat.toFixed(1) 
		: Math.round(primerPerCoat * 10) / 10
		
	// Format primer with waste
	const primerRequiredWithWasteFormatted = totalPrimerWithWaste < 0.1 
		? totalPrimerWithWaste.toFixed(3) 
		: totalPrimerWithWaste < 1 
		? totalPrimerWithWaste.toFixed(2) 
		: totalPrimerWithWaste < 10 
		? totalPrimerWithWaste.toFixed(1) 
		: Math.round(totalPrimerWithWaste * 10) / 10

	// Convert to alternative unit
	let primerRequiredAlternative: number
	let alternativeUnit: string
	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		// Convert liters to gallons
		primerRequiredAlternative = litersToGallons(totalPrimer)
		alternativeUnit = 'gallons'
	} else {
		// Convert gallons to liters
		primerRequiredAlternative = gallonsToLiters(totalPrimer)
		alternativeUnit = 'liters'
	}

	const primerRequiredAlternativeFormatted = primerRequiredAlternative < 0.1 
		? primerRequiredAlternative.toFixed(3) 
		: primerRequiredAlternative < 1 
		? primerRequiredAlternative.toFixed(2) 
		: primerRequiredAlternative < 10 
		? primerRequiredAlternative.toFixed(1) 
		: Math.round(primerRequiredAlternative * 10) / 10

	// Estimate cans (common sizes: 1L, 2.5L, 5L, 1 gallon, 5 gallons)
	let cansEstimate: string = ''
	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		if (totalPrimerWithWaste <= 1) {
			cansEstimate = '1 × 1 liter can'
		} else if (totalPrimerWithWaste <= 2.5) {
			cansEstimate = '1 × 2.5 liter can'
		} else if (totalPrimerWithWaste <= 5) {
			cansEstimate = '1 × 5 liter can'
		} else {
			const cans5L = Math.ceil(totalPrimerWithWaste / 5)
			cansEstimate = `${cans5L} × 5 liter can${cans5L > 1 ? 's' : ''}`
		}
	} else {
		if (totalPrimerWithWaste <= 1) {
			cansEstimate = '1 × 1 gallon can'
		} else if (totalPrimerWithWaste <= 5) {
			cansEstimate = '1 × 5 gallon bucket'
		} else {
			const cans5Gal = Math.ceil(totalPrimerWithWaste / 5)
			cansEstimate = `${cans5Gal} × 5 gallon bucket${cans5Gal > 1 ? 's' : ''}`
		}
	}

	// Create explanation
	const areaUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²'
	
	let explanation = `For ${surfaceArea.toFixed(1)} ${areaUnit} of ${conditionDescription.toLowerCase()} surface, applying ${primerCoats} coat${primerCoats > 1 ? 's' : ''} of primer with coverage of ${primerCoverage} ${coverageUnit}, you will need approximately ${primerRequiredFormatted} ${primerUnit} of primer.`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${primerRequiredWithWasteFormatted} ${primerUnit} to account for spillage, touch-ups, and cutting in around edges.`
	} else {
		explanation += ` Consider adding 10% extra for waste, spillage, and touch-ups.`
	}
	
	// Add primer benefits note
	explanation += ` Primer improves adhesion, seals porous surfaces, and reduces paint consumption by providing a uniform base coat.`

	return {
		primerRequired: totalPrimer,
		primerRequiredFormatted,
		primerPerCoat: primerPerCoat,
		primerPerCoatFormatted,
		primerRequiredWithWaste: includeWaste ? totalPrimerWithWaste : totalPrimer,
		primerRequiredWithWasteFormatted: includeWaste ? primerRequiredWithWasteFormatted : primerRequiredFormatted,
		primerRequiredAlternative,
		primerRequiredAlternativeFormatted,
		alternativeUnit,
		explanation,
		cansEstimate,
		surfaceArea,
		surfaceCondition: conditionDescription,
		primerCoats,
		primerCoverage,
		coverageUnit,
		primerUnit,
		unit: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'meters' : 'feet',
		areaUnit,
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
	}
}

// Register the calculation function
registerCalculation('calculatePrimer', calculatePrimer)


