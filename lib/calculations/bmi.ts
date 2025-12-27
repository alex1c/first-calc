/**
 * Calculate Body Mass Index (BMI) and category
 * Inputs: weight, weightUnit, height, heightUnit, gender (optional), age (optional)
 * Outputs: bmi, category, categoryDescription, healthyWeightRange, insights
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
 * Convert height to meters
 */
function convertHeightToMeters(height: number, unit: string, heightFeet?: number, heightInches?: number): number {
	const normalizedUnit = String(unit || 'cm').toLowerCase().trim()
	
	if (normalizedUnit === 'ft' || normalizedUnit === 'feet' || normalizedUnit === 'ft+in') {
		// Handle feet and inches
		// When using ft+in, height parameter may be total inches or we use heightFeet/heightInches
		if (heightFeet !== undefined && !isNaN(heightFeet) && heightInches !== undefined && !isNaN(heightInches)) {
			// Use provided feet and inches
			return (heightFeet * FEET_TO_METERS) + (heightInches * INCHES_TO_METERS)
		} else {
			// Fallback: treat height as total inches
			const totalInches = height
			const feet = Math.floor(totalInches / 12)
			const inches = totalInches % 12
			return (feet * FEET_TO_METERS) + (inches * INCHES_TO_METERS)
		}
	} else if (normalizedUnit === 'cm' || normalizedUnit === 'centimeters') {
		return height * CM_TO_METERS
	} else if (normalizedUnit === 'm' || normalizedUnit === 'meters') {
		return height
	} else if (normalizedUnit === 'in' || normalizedUnit === 'inches') {
		return height * INCHES_TO_METERS
	}
	return height * CM_TO_METERS // Default to cm
}

/**
 * Get BMI category based on BMI value
 */
function getBMICategory(bmi: number): {
	category: string
	description: string
	color: string
} {
	if (bmi < 18.5) {
		return {
			category: 'Underweight',
			description: 'Your BMI indicates you may be underweight. Consider consulting with a healthcare provider to ensure you\'re getting adequate nutrition.',
			color: 'blue',
		}
	} else if (bmi < 25) {
		return {
			category: 'Normal',
			description: 'Your BMI falls within the healthy weight range. Maintain a balanced diet and regular physical activity.',
			color: 'green',
		}
	} else if (bmi < 30) {
		return {
			category: 'Overweight',
			description: 'Your BMI indicates you may be overweight. Consider lifestyle changes such as improved diet and increased physical activity.',
			color: 'yellow',
		}
	} else {
		return {
			category: 'Obese',
			description: 'Your BMI indicates obesity. It\'s recommended to consult with a healthcare provider to develop a safe and effective weight management plan.',
			color: 'red',
		}
	}
}

/**
 * Calculate healthy weight range for a given height
 */
function calculateHealthyWeightRange(heightMeters: number, weightUnit: string): {
	minWeight: number
	maxWeight: number
	unit: string
} {
	// Healthy BMI range is 18.5 to 24.9
	const minBMI = 18.5
	const maxBMI = 24.9
	
	const minWeightKg = minBMI * (heightMeters * heightMeters)
	const maxWeightKg = maxBMI * (heightMeters * heightMeters)
	
	const normalizedUnit = String(weightUnit || 'kg').toLowerCase().trim()
	if (normalizedUnit === 'lb' || normalizedUnit === 'lbs' || normalizedUnit === 'pounds') {
		return {
			minWeight: Math.round(minWeightKg * KG_TO_POUNDS),
			maxWeight: Math.round(maxWeightKg * KG_TO_POUNDS),
			unit: 'lb',
		}
	}
	
	return {
		minWeight: Math.round(minWeightKg),
		maxWeight: Math.round(maxWeightKg),
		unit: 'kg',
	}
}

/**
 * Round to 1 decimal place
 */
function round(value: number): number {
	return Math.round(value * 10) / 10
}

/**
 * Calculate BMI
 */
export const calculateBMI: CalculationFunction = (inputs) => {
	// Extract inputs
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const height = Number(inputs.height || 0)
	const heightUnit = String(inputs.heightUnit || 'cm')
	const heightFeet = inputs.heightFeet !== undefined ? Number(inputs.heightFeet) : undefined
	const heightInches = inputs.heightInches !== undefined ? Number(inputs.heightInches) : undefined
	const gender = inputs.gender ? String(inputs.gender) : null
	const age = inputs.age !== undefined ? Number(inputs.age) : null

	// Validation
	const normalizedHeightUnit = String(heightUnit || 'cm').toLowerCase().trim()
	const isFeetInches = normalizedHeightUnit === 'ft+in' || normalizedHeightUnit === 'ft' || normalizedHeightUnit === 'feet'
	
	if (
		isNaN(weight) ||
		weight <= 0 ||
		(isFeetInches && (heightFeet === undefined || isNaN(heightFeet) || heightFeet <= 0))
	) {
		return {
			bmi: null,
			category: null,
			categoryDescription: null,
			healthyWeightRange: null,
			insights: null,
		}
	}
	
	// For non-ft+in units, validate height
	if (!isFeetInches && (isNaN(height) || height <= 0)) {
		return {
			bmi: null,
			category: null,
			categoryDescription: null,
			healthyWeightRange: null,
			insights: null,
		}
	}

	// Convert to metric units
	const weightKg = convertWeightToKg(weight, weightUnit)
	const heightMeters = convertHeightToMeters(height, heightUnit, heightFeet, heightInches)

	// Validate converted values
	if (weightKg <= 0 || heightMeters <= 0) {
		return {
			bmi: null,
			category: null,
			categoryDescription: null,
			healthyWeightRange: null,
			insights: null,
		}
	}

	// Calculate BMI: weight (kg) / height (m)^2
	const bmi = weightKg / (heightMeters * heightMeters)
	const roundedBMI = round(bmi)

	// Get category
	const categoryInfo = getBMICategory(roundedBMI)

	// Calculate healthy weight range
	const healthyRange = calculateHealthyWeightRange(heightMeters, weightUnit)

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Your BMI of ${roundedBMI} falls into the "${categoryInfo.category}" category.`)
	
	if (roundedBMI < 18.5) {
		insights.push('A BMI below 18.5 may indicate insufficient body weight. Consider consulting a healthcare provider.')
	} else if (roundedBMI >= 18.5 && roundedBMI < 25) {
		insights.push('Your BMI is within the healthy range. Continue maintaining a balanced lifestyle.')
	} else if (roundedBMI >= 25 && roundedBMI < 30) {
		insights.push('Consider lifestyle modifications such as improved nutrition and increased physical activity.')
	} else {
		insights.push('It\'s recommended to consult with a healthcare provider for personalized guidance.')
	}

	// Add healthy weight range to insights
	insights.push(`For your height, a healthy weight range is approximately ${healthyRange.minWeight}-${healthyRange.maxWeight} ${healthyRange.unit}.`)

	// Add limitations note
	insights.push('Note: BMI is a screening tool and does not directly measure body fat. It may not accurately reflect body composition for athletes, older adults, or individuals with high muscle mass.')

	return {
		bmi: roundedBMI,
		category: categoryInfo.category,
		categoryDescription: categoryInfo.description,
		healthyWeightRange: `${healthyRange.minWeight}-${healthyRange.maxWeight} ${healthyRange.unit}`,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateBMI', calculateBMI)

