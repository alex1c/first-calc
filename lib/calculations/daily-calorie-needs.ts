/**
 * Calculate Total Daily Energy Expenditure (TDEE) and goal-based calorie targets
 * Inputs: sex, age, height, heightUnit, weight, weightUnit, heightFeet, heightInches, activityLevel, goal
 * Outputs: bmr, tdee, goalCalories, goalDescription, activityDescription, insights
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
 * Get activity level multiplier
 */
function getActivityMultiplier(activityLevel: string): number {
	const normalized = String(activityLevel || 'moderate').toLowerCase().trim()
	
	const multipliers: Record<string, number> = {
		'sedentary': 1.2,
		'light': 1.375,
		'lightly active': 1.375,
		'moderate': 1.55,
		'moderately active': 1.55,
		'very active': 1.725,
		'athlete': 1.9,
		'extremely active': 1.9,
	}
	
	return multipliers[normalized] || 1.55 // Default to moderate
}

/**
 * Get activity level description
 */
function getActivityDescription(activityLevel: string): string {
	const normalized = String(activityLevel || 'moderate').toLowerCase().trim()
	
	const descriptions: Record<string, string> = {
		'sedentary': 'Little to no exercise, desk job',
		'light': 'Light exercise 1-3 days/week',
		'lightly active': 'Light exercise 1-3 days/week',
		'moderate': 'Moderate exercise 3-5 days/week',
		'moderately active': 'Moderate exercise 3-5 days/week',
		'very active': 'Hard exercise 6-7 days/week',
		'athlete': 'Very hard exercise, physical job, or training twice/day',
		'extremely active': 'Very hard exercise, physical job, or training twice/day',
	}
	
	return descriptions[normalized] || 'Moderate exercise 3-5 days/week'
}

/**
 * Get goal calorie adjustment
 */
function getGoalAdjustment(goal: string): {
	delta: number
	description: string
	weeklyChange: string
} {
	const normalized = String(goal || 'maintain').toLowerCase().trim()
	
	const goals: Record<string, { delta: number; description: string; weeklyChange: string }> = {
		'maintain': {
			delta: 0,
			description: 'Maintain current weight',
			weeklyChange: '0 kg/week',
		},
		'lose_0_25kg_week': {
			delta: -250,
			description: 'Lose 0.25 kg per week (mild deficit)',
			weeklyChange: '-0.25 kg/week',
		},
		'lose_0_5kg_week': {
			delta: -500,
			description: 'Lose 0.5 kg per week (moderate deficit)',
			weeklyChange: '-0.5 kg/week',
		},
		'gain_0_25kg_week': {
			delta: 250,
			description: 'Gain 0.25 kg per week (mild surplus)',
			weeklyChange: '+0.25 kg/week',
		},
		'gain_0_5kg_week': {
			delta: 500,
			description: 'Gain 0.5 kg per week (moderate surplus)',
			weeklyChange: '+0.5 kg/week',
		},
	}
	
	return goals[normalized] || goals['maintain']
}

/**
 * Round to nearest integer
 */
function round(value: number): number {
	return Math.round(value)
}

/**
 * Calculate TDEE and goal calories
 */
export const calculateDailyCalorieNeeds: CalculationFunction = (inputs) => {
	// Extract inputs
	const sex = String(inputs.sex || 'male').toLowerCase().trim()
	const age = Number(inputs.age || 0)
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const height = Number(inputs.height || 0)
	const heightUnit = String(inputs.heightUnit || 'cm')
	const heightFeet = inputs.heightFeet !== undefined ? Number(inputs.heightFeet) : undefined
	const heightInches = inputs.heightInches !== undefined ? Number(inputs.heightInches) : undefined
	const activityLevel = String(inputs.activityLevel || 'moderate')
	const goal = String(inputs.goal || 'maintain')

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

	// Calculate BMR using Mifflin-St Jeor
	const bmr = calculateMifflinStJeor(weightKg, heightCm, age, sex)
	const roundedBMR = round(bmr)

	// Get activity multiplier and calculate TDEE
	const activityMultiplier = getActivityMultiplier(activityLevel)
	const tdee = bmr * activityMultiplier
	const roundedTDEE = round(tdee)

	// Get goal adjustment
	const goalInfo = getGoalAdjustment(goal)
	const goalCalories = roundedTDEE + goalInfo.delta
	const activityDescription = getActivityDescription(activityLevel)

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Your Basal Metabolic Rate (BMR) is ${roundedBMR} calories per day. This is the calories your body burns at complete rest.`)
	
	insights.push(`Your Total Daily Energy Expenditure (TDEE) is ${roundedTDEE} calories per day. This is your BMR (${roundedBMR} kcal) multiplied by your activity level (${activityMultiplier}x), which accounts for ${activityDescription}.`)
	
	if (goal !== 'maintain') {
		insights.push(`To ${goalInfo.description.toLowerCase()}, aim for ${goalCalories} calories per day. This is your TDEE (${roundedTDEE} kcal) ${goalInfo.delta > 0 ? 'plus' : 'minus'} ${Math.abs(goalInfo.delta)} calories per day, resulting in approximately ${goalInfo.weeklyChange} weight change.`)
		
		if (goalInfo.delta < -500) {
			insights.push(`Note: A deficit greater than 500 calories per day may be too aggressive for some individuals and could lead to muscle loss, metabolic slowdown, or nutritional deficiencies. Consider consulting with a healthcare provider or registered dietitian for personalized guidance.`)
		} else if (goalInfo.delta < 0) {
			insights.push(`This is a moderate calorie deficit that should allow for sustainable weight loss while preserving muscle mass and energy levels.`)
		}
	} else {
		insights.push(`To maintain your current weight, consume approximately ${roundedTDEE} calories per day. This matches your TDEE, which accounts for both your BMR and daily activity.`)
	}
	
	insights.push(`Remember: These are estimates. Individual calorie needs can vary based on genetics, body composition, medical conditions, and other factors. Adjust based on your results and consult a healthcare provider for personalized advice.`)

	// Generate goal description
	const goalDescription = goal !== 'maintain' 
		? `${goalInfo.description} (${goalInfo.weeklyChange})`
		: goalInfo.description

	return {
		bmr: roundedBMR,
		tdee: roundedTDEE,
		goalCalories: goal !== 'maintain' ? goalCalories : roundedTDEE,
		goalDescription: goalDescription,
		activityDescription: activityDescription,
		activityMultiplier: activityMultiplier,
		goalDelta: goalInfo.delta,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateDailyCalorieNeeds', calculateDailyCalorieNeeds)


