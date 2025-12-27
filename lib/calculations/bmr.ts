/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor or Harris-Benedict formula
 * Inputs: sex, age, height, heightUnit, weight, weightUnit, heightFeet, heightInches, formula
 * Outputs: bmr, bmrPerHour, formulaUsed, explanation, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

// Conversion constants
const POUNDS_TO_KG = 0.453592
const KG_TO_POUNDS = 1 / POUNDS_TO_KG
const CM_TO_METERS = 0.01
const INCHES_TO_METERS = 0.0254
const FEET_TO_METERS = 0.3048

/**
 * Convert weight to kilograms
 */
function convertWeightToKg(weight: number, unit: string): number {
	const normalizedUnit = String(unit || 'kg').toLowerCase().trim()
	if (normalizedUnit === 'kg' || normalizedUnit === 'kilograms') {
		return weight
	} else if (normalizedUnit === 'lb' || normalizedUnit === 'lbs' || normalizedUnit === 'pounds') {
		return weight * POUNDS_TO_KG
	}
	return weight // Default to kg
}

/**
 * Convert height to centimeters
 */
function convertHeightToCm(height: number, unit: string, heightFeet?: number, heightInches?: number): number {
	const normalizedUnit = String(unit || 'cm').toLowerCase().trim()
	
	if (normalizedUnit === 'ft' || normalizedUnit === 'feet' || normalizedUnit === 'ft+in') {
		// Handle feet and inches
		const feet = heightFeet !== undefined ? Number(heightFeet) : Math.floor(height)
		const inches = heightInches !== undefined ? Number(heightInches) : (height - feet) * 12
		const totalInches = (feet * 12) + inches
		return totalInches * 2.54 // Convert inches to cm
	} else if (normalizedUnit === 'cm' || normalizedUnit === 'centimeters') {
		return height
	} else if (normalizedUnit === 'm' || normalizedUnit === 'meters') {
		return height * 100
	} else if (normalizedUnit === 'in' || normalizedUnit === 'inches') {
		return height * 2.54
	}
	return height // Default to cm
}

/**
 * Calculate BMR using Mifflin-St Jeor formula
 * 
 * Male: BMR = 10W + 6.25H - 5A + 5
 * Female: BMR = 10W + 6.25H - 5A - 161
 * 
 * Where:
 * W = weight in kg
 * H = height in cm
 * A = age in years
 */
function calculateMifflinStJeor(
	weightKg: number,
	heightCm: number,
	age: number,
	sex: string,
): number {
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	
	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female: BMR = 10W + 6.25H - 5A - 161
		return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161
	} else {
		// Male: BMR = 10W + 6.25H - 5A + 5
		return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
	}
}

/**
 * Calculate BMR using Harris-Benedict (revised) formula
 * 
 * Male: BMR = 88.362 + (13.397 × W) + (4.799 × H) - (5.677 × A)
 * Female: BMR = 447.593 + (9.247 × W) + (3.098 × H) - (4.330 × A)
 * 
 * Where:
 * W = weight in kg
 * H = height in cm
 * A = age in years
 */
function calculateHarrisBenedict(
	weightKg: number,
	heightCm: number,
	age: number,
	sex: string,
): number {
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	
	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female: BMR = 447.593 + (9.247 × W) + (3.098 × H) - (4.330 × A)
		return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age)
	} else {
		// Male: BMR = 88.362 + (13.397 × W) + (4.799 × H) - (5.677 × A)
		return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age)
	}
}

/**
 * Round to nearest integer
 */
function round(value: number): number {
	return Math.round(value)
}

/**
 * Calculate BMR
 */
export const calculateBMR: CalculationFunction = (inputs) => {
	// Extract inputs
	const sex = String(inputs.sex || 'male').toLowerCase().trim()
	const age = Number(inputs.age || 0)
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const height = Number(inputs.height || 0)
	const heightUnit = String(inputs.heightUnit || 'cm')
	const heightFeet = inputs.heightFeet !== undefined ? Number(inputs.heightFeet) : undefined
	const heightInches = inputs.heightInches !== undefined ? Number(inputs.heightInches) : undefined
	const formula = String(inputs.formula || 'mifflin').toLowerCase().trim()

	// Validation
	if (isNaN(weight) || weight <= 0) {
		throw new Error('Weight must be a positive number.')
	}
	if (isNaN(age) || age <= 0) {
		throw new Error('Age must be a positive number.')
	}
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

	// Convert to metric units
	const weightKg = convertWeightToKg(weight, weightUnit)
	const heightCm = convertHeightToCm(height, heightUnit, heightFeet, heightInches)

	// Validate converted values
	if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
		throw new Error('Invalid input values after conversion.')
	}

	// Calculate BMR based on selected formula
	let bmr: number
	let formulaName: string
	let formulaDescription: string

	if (formula === 'harris' || formula === 'harris-benedict') {
		bmr = calculateHarrisBenedict(weightKg, heightCm, age, sex)
		formulaName = 'Harris-Benedict (Revised)'
		formulaDescription = 'Harris-Benedict (Revised) formula'
	} else {
		// Default to Mifflin-St Jeor
		bmr = calculateMifflinStJeor(weightKg, heightCm, age, sex)
		formulaName = 'Mifflin-St Jeor'
		formulaDescription = 'Mifflin-St Jeor formula'
	}

	const roundedBMR = round(bmr)
	const bmrPerHour = round(roundedBMR / 24)

	// Generate explanation
	const sexLabel = (sex === 'female' || sex === 'f') ? 'female' : 'male'
	const explanation = `Your Basal Metabolic Rate (BMR) is ${roundedBMR} calories per day. This is the number of calories your body burns at complete rest to maintain basic physiological functions like breathing, circulation, and cell production. BMR represents approximately 60-70% of your total daily energy expenditure.`

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Your BMR of ${roundedBMR} kcal/day means your body burns approximately ${bmrPerHour} calories per hour even when completely at rest.`)
	
	insights.push(`This calculation uses the ${formulaName}, which is ${formula === 'harris' || formula === 'harris-benedict' ? 'an older formula that may slightly overestimate BMR for some individuals' : 'considered the most accurate formula for modern populations'}.`)
	
	insights.push(`Remember: BMR is your baseline metabolism. Your actual daily calorie needs are higher because you move, exercise, and perform daily activities. To calculate your total daily energy expenditure (TDEE), multiply your BMR by an activity factor.`)
	
	insights.push(`Note: This calculator is for informational purposes only and should not replace professional medical advice. Individual metabolic rates can vary based on genetics, muscle mass, medical conditions, and other factors.`)

	return {
		bmr: roundedBMR,
		bmrPerHour: bmrPerHour,
		formulaUsed: formulaName,
		explanation: explanation,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateBMR', calculateBMR)

