/**
 * Calculate calories burned from steps walked
 * Inputs: stepsCount, weight, weightUnit, strideLength, strideUnit, walkingSpeed, height, heightUnit, heightFeet, heightInches
 * Outputs: caloriesBurned, estimatedDistance, distanceUnit, caloriesPer1000Steps, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

// Conversion constants
const POUNDS_TO_KG = 0.453592
const KG_TO_POUNDS = 1 / POUNDS_TO_KG
const CM_TO_METERS = 0.01
const INCHES_TO_CM = 2.54
const FEET_TO_CM = 30.48
const METERS_TO_KM = 0.001
const METERS_TO_MILES = 0.000621371

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
		return totalInches * INCHES_TO_CM
	} else if (normalizedUnit === 'cm' || normalizedUnit === 'centimeters') {
		return height
	} else if (normalizedUnit === 'm' || normalizedUnit === 'meters') {
		return height * 100
	} else if (normalizedUnit === 'in' || normalizedUnit === 'inches') {
		return height * INCHES_TO_CM
	}
	return height // Default to cm
}

/**
 * Estimate stride length from height
 * Average stride length ≈ 0.414 × height (cm) for walking
 */
function estimateStrideLength(heightCm: number): number {
	return heightCm * 0.414 // Convert to meters (result is in cm, then convert)
}

/**
 * Convert stride length to meters
 */
function convertStrideToMeters(stride: number, unit: string): number {
	const normalizedUnit = String(unit || 'cm').toLowerCase().trim()
	
	if (normalizedUnit === 'm' || normalizedUnit === 'meters') {
		return stride
	} else if (normalizedUnit === 'cm' || normalizedUnit === 'centimeters') {
		return stride * CM_TO_METERS
	} else if (normalizedUnit === 'ft' || normalizedUnit === 'feet') {
		return stride * 0.3048
	} else if (normalizedUnit === 'in' || normalizedUnit === 'inches') {
		return stride * INCHES_TO_CM * CM_TO_METERS
	}
	return stride * CM_TO_METERS // Default to cm
}

/**
 * Get MET value for walking based on speed
 */
function getWalkingMET(speed: string): number {
	const normalized = String(speed || 'moderate').toLowerCase().trim()
	
	const metValues: Record<string, number> = {
		'slow': 3.0,
		'leisurely': 3.0,
		'moderate': 3.5,
		'normal': 3.5,
		'fast': 4.5,
		'brisk': 4.5,
		'very fast': 5.0,
	}
	
	return metValues[normalized] || 3.5 // Default to moderate
}

/**
 * Round to specified decimal places
 */
function round(value: number, decimals: number = 1): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculate calories burned from steps
 */
export const calculateStepsToCalories: CalculatorFunction = (inputs) => {
	// Extract inputs
	const stepsCount = Number(inputs.stepsCount || 0)
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const strideLength = inputs.strideLength !== undefined ? Number(inputs.strideLength) : undefined
	const strideUnit = String(inputs.strideUnit || 'cm')
	const walkingSpeed = String(inputs.walkingSpeed || 'moderate')
	const height = inputs.height !== undefined ? Number(inputs.height) : undefined
	const heightUnit = String(inputs.heightUnit || 'cm')
	const heightFeet = inputs.heightFeet !== undefined ? Number(inputs.heightFeet) : undefined
	const heightInches = inputs.heightInches !== undefined ? Number(inputs.heightInches) : undefined

	// Validation
	if (isNaN(stepsCount) || stepsCount <= 0) {
		throw new Error('Steps count must be a positive number.')
	}
	if (isNaN(weight) || weight <= 0) {
		throw new Error('Weight must be a positive number.')
	}
	if (stepsCount > 100000) {
		throw new Error('Steps count should be less than 100,000 for realistic results.')
	}

	// Convert weight to kilograms
	const weightKg = convertWeightToKg(weight, weightUnit)

	// Validate converted weight
	if (weightKg <= 0 || weightKg < 20 || weightKg > 500) {
		throw new Error('Weight must be between 20 and 500 kg (44-1100 lb) for realistic results.')
	}

	// Determine stride length
	let strideLengthMeters: number
	if (strideLength !== undefined && !isNaN(strideLength) && strideLength > 0) {
		// Use provided stride length
		strideLengthMeters = convertStrideToMeters(strideLength, strideUnit)
	} else if (height !== undefined && !isNaN(height) && height > 0) {
		// Estimate from height
		const heightCm = convertHeightToCm(height, heightUnit, heightFeet, heightInches)
		if (heightCm > 0) {
			const estimatedStrideCm = estimateStrideLength(heightCm)
			strideLengthMeters = estimatedStrideCm * CM_TO_METERS
		} else {
			// Default stride length (average: ~0.7 meters)
			strideLengthMeters = 0.7
		}
	} else {
		// Default stride length (average: ~0.7 meters)
		strideLengthMeters = 0.7
	}

	// Validate stride length
	if (strideLengthMeters <= 0 || strideLengthMeters < 0.3 || strideLengthMeters > 1.5) {
		throw new Error('Stride length must be between 0.3 and 1.5 meters for realistic results.')
	}

	// Calculate distance
	const distanceMeters = stepsCount * strideLengthMeters
	const distanceKm = distanceMeters * METERS_TO_KM
	const distanceMiles = distanceMeters * METERS_TO_MILES

	// Get MET value for walking
	const metValue = getWalkingMET(walkingSpeed)

	// Estimate walking time (assuming average walking speed based on MET)
	// MET 3.0 = ~2.5 mph, MET 3.5 = ~3.5 mph, MET 4.5 = ~4.5 mph
	let walkingSpeedMph: number
	if (walkingSpeed.toLowerCase() === 'slow' || walkingSpeed.toLowerCase() === 'leisurely') {
		walkingSpeedMph = 2.5
	} else if (walkingSpeed.toLowerCase() === 'fast' || walkingSpeed.toLowerCase() === 'brisk' || walkingSpeed.toLowerCase() === 'very fast') {
		walkingSpeedMph = 4.5
	} else {
		walkingSpeedMph = 3.5 // Moderate
	}

	// Convert to m/s for time calculation
	const walkingSpeedMs = walkingSpeedMph * 0.44704
	const durationHours = distanceMeters / (walkingSpeedMs * 3600)

	// Calculate calories using MET formula
	// Calories = MET × weight(kg) × duration(hours)
	const caloriesBurned = metValue * weightKg * durationHours

	// Calculate calories per 1,000 steps
	const caloriesPer1000Steps = (caloriesBurned / stepsCount) * 1000

	// Round values
	const roundedCalories = round(caloriesBurned, 0)
	const roundedDistanceKm = round(distanceKm, 2)
	const roundedDistanceMiles = round(distanceMiles, 2)
	const roundedCaloriesPer1000 = round(caloriesPer1000Steps, 1)

	// Determine distance unit (use km if < 1 km, otherwise show both)
	const distanceUnit = distanceKm < 1 ? 'meters' : 'km'
	const distanceValue = distanceKm < 1 ? round(distanceMeters, 0) : roundedDistanceKm

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Walking ${stepsCount.toLocaleString()} steps burned approximately ${roundedCalories} calories.`)
	
	insights.push(`This is based on an estimated distance of ${distanceValue} ${distanceUnit}${distanceKm >= 1 ? ` (${roundedDistanceMiles} miles)` : ''}, calculated using a stride length of ${round(strideLengthMeters, 2)} meters.`)
	
	insights.push(`Your calorie burn rate is approximately ${roundedCaloriesPer1000} calories per 1,000 steps.`)
	
	if (walkingSpeed.toLowerCase() !== 'moderate') {
		insights.push(`Walking at ${walkingSpeed} pace (MET ${metValue}) affects calorie burn. Faster walking burns more calories per step.`)
	}
	
	insights.push(`Note: These are estimates. Actual calories burned can vary based on individual factors such as fitness level, body composition, terrain (hills vs flat), walking surface, and environmental conditions. Pedometers and fitness trackers may provide different estimates.`)

	return {
		caloriesBurned: roundedCalories,
		estimatedDistance: distanceValue,
		distanceUnit: distanceUnit,
		distanceKm: roundedDistanceKm,
		distanceMiles: roundedDistanceMiles,
		caloriesPer1000Steps: roundedCaloriesPer1000,
		strideLengthUsed: round(strideLengthMeters, 2),
		metValue: metValue,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateStepsToCalories', calculateStepsToCalories)

