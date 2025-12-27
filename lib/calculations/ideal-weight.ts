/**
 * Calculate ideal weight range using multiple formulas (Devine, Robinson, Miller)
 * Inputs: sex, height, heightUnit, heightFeet, heightInches, frameSize (optional)
 * Outputs: devineWeight, robinsonWeight, millerWeight, minWeight, maxWeight, idealRangeKg, idealRangeLb, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

// Conversion constants
const CM_TO_INCHES = 0.393701
const INCHES_TO_CM = 2.54
const KG_TO_LB = 2.20462
const LB_TO_KG = 1 / KG_TO_LB

/**
 * Convert height to inches
 */
function convertHeightToInches(height: number, unit: string, heightFeet?: number, heightInches?: number): number {
	const normalizedUnit = String(unit || 'cm').toLowerCase().trim()
	
	if (normalizedUnit === 'ft' || normalizedUnit === 'feet' || normalizedUnit === 'ft+in') {
		// Handle feet and inches
		const feet = heightFeet !== undefined ? Number(heightFeet) : Math.floor(height)
		const inches = heightInches !== undefined ? Number(heightInches) : (height - feet) * 12
		return (feet * 12) + inches
	} else if (normalizedUnit === 'cm' || normalizedUnit === 'centimeters') {
		return height * CM_TO_INCHES
	} else if (normalizedUnit === 'm' || normalizedUnit === 'meters') {
		return (height * 100) * CM_TO_INCHES
	} else if (normalizedUnit === 'in' || normalizedUnit === 'inches') {
		return height
	}
	return height * CM_TO_INCHES // Default to cm
}

/**
 * Calculate ideal weight using Devine formula
 * 
 * Male: 50.0 kg + 2.3 kg per inch over 5 ft
 * Female: 45.5 kg + 2.3 kg per inch over 5 ft
 */
function calculateDevine(heightInches: number, sex: string): number {
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	const baseHeight = 60 // 5 feet in inches
	const inchesOver5Ft = Math.max(0, heightInches - baseHeight)
	
	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female: 45.5 kg + 2.3 kg per inch over 5 ft
		return 45.5 + (2.3 * inchesOver5Ft)
	} else {
		// Male: 50.0 kg + 2.3 kg per inch over 5 ft
		return 50.0 + (2.3 * inchesOver5Ft)
	}
}

/**
 * Calculate ideal weight using Robinson formula
 * 
 * Male: 52 kg + 1.9 kg per inch over 5 ft
 * Female: 49 kg + 1.7 kg per inch over 5 ft
 */
function calculateRobinson(heightInches: number, sex: string): number {
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	const baseHeight = 60 // 5 feet in inches
	const inchesOver5Ft = Math.max(0, heightInches - baseHeight)
	
	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female: 49 kg + 1.7 kg per inch over 5 ft
		return 49 + (1.7 * inchesOver5Ft)
	} else {
		// Male: 52 kg + 1.9 kg per inch over 5 ft
		return 52 + (1.9 * inchesOver5Ft)
	}
}

/**
 * Calculate ideal weight using Miller formula
 * 
 * Male: 56.2 kg + 1.41 kg per inch over 5 ft
 * Female: 53.1 kg + 1.36 kg per inch over 5 ft
 */
function calculateMiller(heightInches: number, sex: string): number {
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	const baseHeight = 60 // 5 feet in inches
	const inchesOver5Ft = Math.max(0, heightInches - baseHeight)
	
	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female: 53.1 kg + 1.36 kg per inch over 5 ft
		return 53.1 + (1.36 * inchesOver5Ft)
	} else {
		// Male: 56.2 kg + 1.41 kg per inch over 5 ft
		return 56.2 + (1.41 * inchesOver5Ft)
	}
}

/**
 * Round to 1 decimal place
 */
function round(value: number, decimals: number = 1): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculate ideal weight range
 */
export const calculateIdealWeight: CalculationFunction = (inputs) => {
	// Extract inputs
	const sex = String(inputs.sex || 'male').toLowerCase().trim()
	const height = Number(inputs.height || 0)
	const heightUnit = String(inputs.heightUnit || 'cm')
	const heightFeet = inputs.heightFeet !== undefined ? Number(inputs.heightFeet) : undefined
	const heightInches = inputs.heightInches !== undefined ? Number(inputs.heightInches) : undefined
	const frameSize = String(inputs.frameSize || 'medium').toLowerCase().trim()

	// Validation
	if (isNaN(height) || height <= 0) {
		throw new Error('Height must be a positive number.')
	}
	if (!['male', 'female', 'm', 'f'].includes(sex)) {
		throw new Error('Sex must be either male or female.')
	}
	if (heightUnit.toLowerCase().includes('ft') || heightUnit.toLowerCase() === 'ft+in') {
		if (heightFeet === undefined || isNaN(heightFeet) || heightFeet < 0) {
			throw new Error('Height in feet must be a non-negative number.')
		}
		if (heightInches === undefined || isNaN(heightInches) || heightInches < 0 || heightInches >= 12) {
			throw new Error('Height in inches must be between 0 and 11.')
		}
	}

	// Convert height to inches
	const totalHeightInches = convertHeightToInches(height, heightUnit, heightFeet, heightInches)

	// Validate converted height
	if (totalHeightInches <= 0 || totalHeightInches < 36 || totalHeightInches > 96) {
		throw new Error('Height must be between 36 inches (3 ft) and 96 inches (8 ft).')
	}

	// Calculate ideal weight using all three formulas
	const devineWeight = calculateDevine(totalHeightInches, sex)
	const robinsonWeight = calculateRobinson(totalHeightInches, sex)
	const millerWeight = calculateMiller(totalHeightInches, sex)

	// Find min and max across all formulas
	const weights = [devineWeight, robinsonWeight, millerWeight]
	const minWeight = Math.min(...weights)
	const maxWeight = Math.max(...weights)

	// Round all values
	const roundedDevine = round(devineWeight)
	const roundedRobinson = round(robinsonWeight)
	const roundedMiller = round(millerWeight)
	const roundedMin = round(minWeight)
	const roundedMax = round(maxWeight)

	// Convert to pounds
	const devineWeightLb = round(devineWeight * KG_TO_LB)
	const robinsonWeightLb = round(robinsonWeight * KG_TO_LB)
	const millerWeightLb = round(millerWeight * KG_TO_LB)
	const minWeightLb = round(minWeight * KG_TO_LB)
	const maxWeightLb = round(maxWeight * KG_TO_LB)

	// Generate ideal range strings
	const idealRangeKg = `${roundedMin} - ${roundedMax} kg`
	const idealRangeLb = `${minWeightLb} - ${maxWeightLb} lb`

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Based on your height and sex, the ideal weight range using multiple formulas is ${idealRangeKg} (${idealRangeLb}).`)
	
	insights.push(`The three formulas (Devine, Robinson, and Miller) give slightly different results because they were developed using different populations and methodologies. The range accounts for these variations.`)
	
	insights.push(`Devine formula: ${roundedDevine} kg (${devineWeightLb} lb). Robinson formula: ${roundedRobinson} kg (${robinsonWeightLb} lb). Miller formula: ${roundedMiller} kg (${millerWeightLb} lb).`)
	
	insights.push(`Important: Ideal weight formulas are estimates based on height and sex only. They don't account for body composition (muscle vs fat), bone structure, or individual variations. BMI and body fat percentage may provide more comprehensive information about your health.`)
	
	insights.push(`These formulas are for informational purposes only and should not replace professional medical advice. A healthy weight for you depends on many factors including body composition, medical history, and overall health.`)

	return {
		devineWeight: roundedDevine,
		devineWeightLb: devineWeightLb,
		robinsonWeight: roundedRobinson,
		robinsonWeightLb: robinsonWeightLb,
		millerWeight: roundedMiller,
		millerWeightLb: millerWeightLb,
		minWeight: roundedMin,
		maxWeight: roundedMax,
		minWeightLb: minWeightLb,
		maxWeightLb: maxWeightLb,
		idealRangeKg: idealRangeKg,
		idealRangeLb: idealRangeLb,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateIdealWeight', calculateIdealWeight)


