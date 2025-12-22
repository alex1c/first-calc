/**
 * Calculate body fat percentage using U.S. Navy Method
 * Inputs: sex, age, height, heightUnit, weight, weightUnit, heightFeet, heightInches, waistCircumference, waistUnit, neckCircumference, neckUnit, hipCircumference, hipUnit
 * Outputs: bodyFatPercentage, category, categoryDescription, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

// Conversion constants
const POUNDS_TO_KG = 0.453592
const KG_TO_POUNDS = 1 / POUNDS_TO_KG
const CM_TO_INCHES = 0.393701
const INCHES_TO_CM = 2.54

/**
 * Convert measurement to inches
 */
function convertToInches(value: number, unit: string): number {
	const normalizedUnit = String(unit || 'cm').toLowerCase().trim()
	
	if (normalizedUnit === 'cm' || normalizedUnit === 'centimeters') {
		return value * CM_TO_INCHES
	} else if (normalizedUnit === 'in' || normalizedUnit === 'inches') {
		return value
	} else if (normalizedUnit === 'm' || normalizedUnit === 'meters') {
		return (value * 100) * CM_TO_INCHES
	}
	return value * CM_TO_INCHES // Default to cm
}

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
 * Get body fat category
 */
function getBodyFatCategory(bodyFat: number, sex: string): {
	category: string
	description: string
	color: string
} {
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	
	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female categories
		if (bodyFat < 14) {
			return {
				category: 'Athletic',
				description: 'Very low body fat, typical of competitive athletes. May not be sustainable long-term.',
				color: 'blue',
			}
		} else if (bodyFat < 20) {
			return {
				category: 'Fitness',
				description: 'Low body fat, typical of very fit individuals who exercise regularly.',
				color: 'green',
			}
		} else if (bodyFat < 25) {
			return {
				category: 'Average',
				description: 'Average body fat for women. Generally considered healthy.',
				color: 'green',
			}
		} else if (bodyFat < 32) {
			return {
				category: 'Above Average',
				description: 'Above average body fat. Consider lifestyle changes for better health.',
				color: 'yellow',
			}
		} else {
			return {
				category: 'High',
				description: 'High body fat. Consider consulting with a healthcare provider for guidance.',
				color: 'red',
			}
		}
	} else {
		// Male categories
		if (bodyFat < 6) {
			return {
				category: 'Athletic',
				description: 'Very low body fat, typical of competitive athletes. May not be sustainable long-term.',
				color: 'blue',
			}
		} else if (bodyFat < 14) {
			return {
				category: 'Fitness',
				description: 'Low body fat, typical of very fit individuals who exercise regularly.',
				color: 'green',
			}
		} else if (bodyFat < 18) {
			return {
				category: 'Average',
				description: 'Average body fat for men. Generally considered healthy.',
				color: 'green',
			}
		} else if (bodyFat < 25) {
			return {
				category: 'Above Average',
				description: 'Above average body fat. Consider lifestyle changes for better health.',
				color: 'yellow',
			}
		} else {
			return {
				category: 'High',
				description: 'High body fat. Consider consulting with a healthcare provider for guidance.',
				color: 'red',
			}
		}
	}
}

/**
 * Round to 1 decimal place
 */
function round(value: number, decimals: number = 1): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculate body fat percentage using U.S. Navy Method
 */
export const calculateBodyFatPercentage: CalculatorFunction = (inputs) => {
	// Extract inputs
	const sex = String(inputs.sex || 'male').toLowerCase().trim()
	const age = Number(inputs.age || 0)
	const height = Number(inputs.height || 0)
	const heightUnit = String(inputs.heightUnit || 'cm')
	const heightFeet = inputs.heightFeet !== undefined ? Number(inputs.heightFeet) : undefined
	const heightInches = inputs.heightInches !== undefined ? Number(inputs.heightInches) : undefined
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const waistCircumference = Number(inputs.waistCircumference || 0)
	const waistUnit = String(inputs.waistUnit || 'cm')
	const neckCircumference = inputs.neckCircumference !== undefined ? Number(inputs.neckCircumference) : undefined
	const neckUnit = String(inputs.neckUnit || 'cm')
	const hipCircumference = inputs.hipCircumference !== undefined ? Number(inputs.hipCircumference) : undefined
	const hipUnit = String(inputs.hipUnit || 'cm')

	// Validation
	if (isNaN(height) || height <= 0) {
		throw new Error('Height must be a positive number.')
	}
	if (isNaN(weight) || weight <= 0) {
		throw new Error('Weight must be a positive number.')
	}
	if (isNaN(waistCircumference) || waistCircumference <= 0) {
		throw new Error('Waist circumference must be a positive number.')
	}
	if (!['male', 'female', 'm', 'f'].includes(sex)) {
		throw new Error('Sex must be either male or female.')
	}
	if (isNaN(age) || age <= 0) {
		throw new Error('Age must be a positive number.')
	}
	if (heightUnit.toLowerCase().includes('ft') || heightUnit.toLowerCase() === 'ft+in') {
		if (heightFeet === undefined || isNaN(heightFeet) || heightFeet < 0) {
			throw new Error('Height in feet must be a non-negative number.')
		}
		if (heightInches === undefined || isNaN(heightInches) || heightInches < 0 || heightInches >= 12) {
			throw new Error('Height in inches must be between 0 and 11.')
		}
	}

	// Convert all measurements to inches
	const totalHeightInches = convertHeightToInches(height, heightUnit, heightFeet, heightInches)
	const waistInches = convertToInches(waistCircumference, waistUnit)
	const neckInches = neckCircumference !== undefined ? convertToInches(neckCircumference, neckUnit) : undefined
	const hipInches = hipCircumference !== undefined ? convertToInches(hipCircumference, hipUnit) : undefined

	// Validate converted values
	if (totalHeightInches <= 0 || totalHeightInches < 36 || totalHeightInches > 96) {
		throw new Error('Height must be between 36 inches (3 ft) and 96 inches (8 ft).')
	}
	if (waistInches <= 0) {
		throw new Error('Waist circumference must be a positive number.')
	}
	if (neckInches !== undefined && neckInches <= 0) {
		throw new Error('Neck circumference must be a positive number.')
	}
	if (hipInches !== undefined && hipInches <= 0) {
		throw new Error('Hip circumference must be a positive number.')
	}

	// Calculate body fat percentage using U.S. Navy Method
	let bodyFat: number
	const normalizedSex = String(sex || 'male').toLowerCase().trim()
	let hasNeck = neckInches !== undefined && neckInches > 0

	if (normalizedSex === 'female' || normalizedSex === 'f') {
		// Female formula: bodyFat = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
		if (!hasNeck) {
			// If neck is not provided, use waist + hip only (less accurate)
			if (hipInches === undefined || hipInches <= 0) {
				throw new Error('For females, both waist and hip measurements are required. Neck measurement is optional but recommended for better accuracy.')
			}
			// Approximate: use waist + hip without neck (less accurate)
			const sum = waistInches + hipInches
			bodyFat = 163.205 * Math.log10(sum) - 97.684 * Math.log10(totalHeightInches) - 78.387
		} else {
			// Full formula with neck
			if (hipInches === undefined || hipInches <= 0) {
				throw new Error('For females, hip measurement is required.')
			}
			const sum = waistInches + hipInches - neckInches
			bodyFat = 163.205 * Math.log10(sum) - 97.684 * Math.log10(totalHeightInches) - 78.387
		}
	} else {
		// Male formula: bodyFat = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
		if (!hasNeck) {
			// If neck is not provided, use waist only (less accurate)
			bodyFat = 86.010 * Math.log10(waistInches) - 70.041 * Math.log10(totalHeightInches) + 36.76
		} else {
			// Full formula with neck
			const difference = waistInches - neckInches
			if (difference <= 0) {
				throw new Error('Waist circumference must be greater than neck circumference.')
			}
			bodyFat = 86.010 * Math.log10(difference) - 70.041 * Math.log10(totalHeightInches) + 36.76
		}
	}

	// Clamp body fat to reasonable range (0-50%)
	bodyFat = Math.max(0, Math.min(50, bodyFat))

	const roundedBodyFat = round(bodyFat)
	const { category, description, color } = getBodyFatCategory(roundedBodyFat, sex)

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Your estimated body fat percentage is ${roundedBodyFat}%, which falls into the "${category}" category.`)
	
	insights.push(description)
	
	if (!hasNeck) {
		insights.push(`Note: Neck measurement was not provided. Including neck measurement improves accuracy. The current estimate may be less precise.`)
	}
	
	insights.push(`This calculation uses the U.S. Navy Method, which is a formula-based estimation. It's less accurate than professional methods like DEXA scan, hydrostatic weighing, or BodPod, but provides a reasonable estimate for most people.`)
	
	insights.push(`Important: Body fat percentage can vary based on hydration, time of day, measurement technique, and other factors. This is an estimate for informational purposes only and should not replace professional medical advice.`)

	return {
		bodyFatPercentage: roundedBodyFat,
		category: category,
		categoryDescription: description,
		color: color,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateBodyFatPercentage', calculateBodyFatPercentage)
