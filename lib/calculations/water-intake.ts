/**
 * Calculate recommended daily water intake
 * Inputs: weight, weightUnit, activityLevel, climate, exerciseMinutesPerDay
 * Outputs: dailyWaterIntakeLiters, dailyWaterIntakeCups, dailyWaterIntakeOunces, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

// Conversion constants
const POUNDS_TO_KG = 0.453592
const KG_TO_POUNDS = 1 / POUNDS_TO_KG
const LITERS_TO_CUPS = 4.22675
const LITERS_TO_OUNCES = 33.814
const ML_TO_LITERS = 0.001

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
 * Get activity level multiplier
 */
function getActivityMultiplier(activityLevel: string): number {
	const normalized = String(activityLevel || 'moderate').toLowerCase().trim()
	
	const multipliers: Record<string, number> = {
		'low': 1.0,
		'sedentary': 1.0,
		'moderate': 1.15,
		'active': 1.15,
		'high': 1.2,
		'very active': 1.2,
	}
	
	return multipliers[normalized] || 1.15 // Default to moderate
}

/**
 * Get climate adjustment multiplier
 */
function getClimateMultiplier(climate: string): number {
	const normalized = String(climate || 'moderate').toLowerCase().trim()
	
	const multipliers: Record<string, number> = {
		'cool': 1.0,
		'moderate': 1.0,
		'hot': 1.125,
		'very hot': 1.15,
	}
	
	return multipliers[normalized] || 1.0 // Default to moderate
}

/**
 * Round to 1 decimal place
 */
function round(value: number, decimals: number = 1): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculate recommended daily water intake
 */
export const calculateWaterIntake: CalculationFunction = (inputs) => {
	// Extract inputs
	const weight = Number(inputs.weight || 0)
	const weightUnit = String(inputs.weightUnit || 'kg')
	const activityLevel = String(inputs.activityLevel || 'moderate')
	const climate = String(inputs.climate || 'moderate')
	const exerciseMinutesPerDay = inputs.exerciseMinutesPerDay !== undefined ? Number(inputs.exerciseMinutesPerDay) : undefined

	// Validation
	if (isNaN(weight) || weight <= 0) {
		throw new Error('Weight must be a positive number.')
	}
	if (weight < 20 || weight > 500) {
		throw new Error('Weight should be between 20 and 500 kg (44-1100 lb) for realistic results.')
	}

	// Convert weight to kilograms
	const weightKg = convertWeightToKg(weight, weightUnit)

	// Validate converted weight
	if (weightKg <= 0 || weightKg < 20 || weightKg > 500) {
		throw new Error('Weight must be between 20 and 500 kg (44-1100 lb) for realistic results.')
	}

	// Base calculation: 30-35 ml per kg body weight (using 32.5 ml as average)
	const baseWaterMl = weightKg * 32.5

	// Apply activity level adjustment
	const activityMultiplier = getActivityMultiplier(activityLevel)
	let adjustedWaterMl = baseWaterMl * activityMultiplier

	// Apply climate adjustment
	const climateMultiplier = getClimateMultiplier(climate)
	adjustedWaterMl = adjustedWaterMl * climateMultiplier

	// Add exercise adjustment (500 ml per hour of exercise)
	if (exerciseMinutesPerDay !== undefined && !isNaN(exerciseMinutesPerDay) && exerciseMinutesPerDay > 0) {
		const exerciseHours = exerciseMinutesPerDay / 60
		const exerciseWaterMl = exerciseHours * 500
		adjustedWaterMl = adjustedWaterMl + exerciseWaterMl
	}

	// Convert to liters
	const waterLiters = adjustedWaterMl * ML_TO_LITERS

	// Convert to cups and ounces
	const waterCups = waterLiters * LITERS_TO_CUPS
	const waterOunces = waterLiters * LITERS_TO_OUNCES

	// Round values
	const roundedLiters = round(waterLiters, 1)
	const roundedCups = round(waterCups, 1)
	const roundedOunces = round(waterOunces, 0)

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Based on your weight (${weightKg.toFixed(1)} kg), activity level, and climate, your recommended daily water intake is approximately ${roundedLiters} liters (${roundedCups} cups or ${roundedOunces} oz).`)
	
	if (activityLevel.toLowerCase() !== 'low' && activityLevel.toLowerCase() !== 'sedentary') {
		insights.push(`Your activity level (${activityLevel}) increases your water needs due to increased sweating and metabolic demands.`)
	}
	
	if (climate.toLowerCase() === 'hot' || climate.toLowerCase() === 'very hot') {
		insights.push(`Hot climate conditions increase your water needs due to increased sweating and fluid loss.`)
	}
	
	if (exerciseMinutesPerDay !== undefined && exerciseMinutesPerDay > 0) {
		insights.push(`Your exercise routine (${exerciseMinutesPerDay} minutes per day) adds approximately ${round((exerciseMinutesPerDay / 60) * 500 * ML_TO_LITERS, 1)} liters to your daily water needs.`)
	}
	
	insights.push(`Remember: This is a general guideline. Individual water needs can vary based on age, health conditions, medications, and other factors. Listen to your body's thirst signals and adjust accordingly.`)
	
	insights.push(`Note: This includes water from all sources (drinks and food). About 20% of daily water intake typically comes from food. If you're very active or in hot conditions, you may need more. Consult a healthcare provider if you have concerns about hydration.`)

	return {
		dailyWaterIntakeLiters: roundedLiters,
		dailyWaterIntakeCups: roundedCups,
		dailyWaterIntakeOunces: roundedOunces,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateWaterIntake', calculateWaterIntake)


