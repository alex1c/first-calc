/**
 * Calculate calories burned during physical activities using MET values
 * Inputs: weight, weightUnit, activity, durationMinutes, intensity
 * Outputs: caloriesBurned, caloriesPerMinute, metValue, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

// Conversion constants
const POUNDS_TO_KG = 0.453592
const KG_TO_POUNDS = 1 / POUNDS_TO_KG
const MINUTES_TO_HOURS = 1 / 60

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
 * Get MET value for activity and intensity
 */
function getMETValue(activity: string, intensity: string): {
	met: number
	description: string
} {
	const normalizedActivity = String(activity || 'walking').toLowerCase().trim()
	const normalizedIntensity = String(intensity || 'moderate').toLowerCase().trim()
	
	// MET values by activity and intensity
	const metValues: Record<string, Record<string, { met: number; description: string }>> = {
		'walking': {
			'low': { met: 3.0, description: 'Walking, slow pace (2.5 mph)' },
			'moderate': { met: 3.5, description: 'Walking, moderate pace (3.5 mph)' },
			'high': { met: 4.5, description: 'Walking, brisk pace (4.5 mph)' },
		},
		'running': {
			'low': { met: 8.0, description: 'Running, 5 mph (12 min/mile)' },
			'moderate': { met: 10.0, description: 'Running, 6 mph (10 min/mile)' },
			'high': { met: 12.0, description: 'Running, 7.5 mph (8 min/mile)' },
		},
		'cycling': {
			'low': { met: 6.0, description: 'Cycling, leisure pace (10-12 mph)' },
			'moderate': { met: 8.0, description: 'Cycling, moderate pace (12-14 mph)' },
			'high': { met: 10.0, description: 'Cycling, vigorous pace (14-16 mph)' },
		},
		'swimming': {
			'low': { met: 6.0, description: 'Swimming, leisure pace' },
			'moderate': { met: 7.5, description: 'Swimming, moderate pace' },
			'high': { met: 9.0, description: 'Swimming, vigorous pace' },
		},
		'strength training': {
			'low': { met: 3.0, description: 'Strength training, light effort' },
			'moderate': { met: 4.5, description: 'Strength training, moderate effort' },
			'high': { met: 6.0, description: 'Strength training, vigorous effort' },
		},
		'yoga': {
			'low': { met: 2.5, description: 'Yoga, gentle/restorative' },
			'moderate': { met: 3.0, description: 'Yoga, moderate/Hatha' },
			'high': { met: 4.0, description: 'Yoga, power/Vinyasa' },
		},
		'other': {
			'low': { met: 3.0, description: 'Light activity' },
			'moderate': { met: 5.0, description: 'Moderate activity' },
			'high': { met: 7.0, description: 'Vigorous activity' },
		},
	}
	
	// Get MET value for activity and intensity
	const activityMETs = metValues[normalizedActivity]
	if (activityMETs) {
		const intensityMET = activityMETs[normalizedIntensity] || activityMETs['moderate']
		return intensityMET
	}
	
	// Default to moderate generic activity
	return { met: 5.0, description: 'Moderate activity' }
}

/**
 * Round to 1 decimal place
 */
function round(value: number, decimals: number = 1): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculate calories burned
 */
export const calculateCaloriesBurned: CalculationFunction = (inputs) => {
	// Extract inputs
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const activity = String(inputs.activity || 'walking')
	const durationMinutes = Number(inputs.durationMinutes || 0)
	const intensity = String(inputs.intensity || 'moderate')

	// Validation
	if (isNaN(weight) || weight <= 0) {
		throw new Error('Weight must be a positive number.')
	}
	if (isNaN(durationMinutes) || durationMinutes <= 0) {
		throw new Error('Duration must be a positive number.')
	}
	if (durationMinutes > 600) {
		throw new Error('Duration should be less than 600 minutes (10 hours) for realistic results.')
	}

	// Convert weight to kilograms
	const weightKg = convertWeightToKg(weight, weightUnit)

	// Validate converted weight
	if (weightKg <= 0 || weightKg < 20 || weightKg > 500) {
		throw new Error('Weight must be between 20 and 500 kg (44-1100 lb) for realistic results.')
	}

	// Get MET value for activity and intensity
	const { met: metValue, description: metDescription } = getMETValue(activity, intensity)

	// Convert duration to hours
	const durationHours = durationMinutes * MINUTES_TO_HOURS

	// Calculate calories burned using MET formula
	// Calories = MET × weight(kg) × duration(hours)
	const caloriesBurned = metValue * weightKg * durationHours

	// Calculate calories per minute
	const caloriesPerMinute = caloriesBurned / durationMinutes

	// Round values
	const roundedCalories = round(caloriesBurned, 0)
	const roundedCaloriesPerMinute = round(caloriesPerMinute, 1)

	// Generate insights
	const insights: string[] = []
	
	const activityLabel = activity.charAt(0).toUpperCase() + activity.slice(1).replace(/-/g, ' ')
	
	insights.push(`During ${durationMinutes} minutes of ${activityLabel.toLowerCase()} at ${intensity} intensity, you burned approximately ${roundedCalories} calories.`)
	
	insights.push(`This calculation uses a MET value of ${metValue} (${metDescription}), which represents the metabolic equivalent of the activity. MET values are standardized measures of energy expenditure.`)
	
	insights.push(`Your calorie burn rate was approximately ${roundedCaloriesPerMinute} calories per minute during this activity.`)
	
	insights.push(`Note: These are estimates based on average MET values. Actual calories burned can vary based on individual factors such as fitness level, body composition, efficiency of movement, terrain, and environmental conditions. Fitness trackers and heart rate monitors may provide more personalized estimates.`)
	
	insights.push(`To burn more calories, you can: increase the duration of your activity, increase the intensity level, or choose activities with higher MET values. Remember that consistency and enjoyment are key to maintaining an active lifestyle.`)

	return {
		caloriesBurned: roundedCalories,
		caloriesPerMinute: roundedCaloriesPerMinute,
		metValue: metValue,
		metDescription: metDescription,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCaloriesBurned', calculateCaloriesBurned)


