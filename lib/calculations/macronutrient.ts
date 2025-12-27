/**
 * Calculate macronutrient breakdown (protein, carbs, fat) from daily calories
 * Inputs: dailyCalories, macroPreset, proteinPercent, carbsPercent, fatPercent
 * Outputs: proteinGrams, carbsGrams, fatGrams, proteinCalories, carbsCalories, fatCalories, proteinPercent, carbsPercent, fatPercent, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

// Calories per gram for each macronutrient
const PROTEIN_KCAL_PER_GRAM = 4
const CARBS_KCAL_PER_GRAM = 4
const FAT_KCAL_PER_GRAM = 9

/**
 * Get macro distribution percentages based on preset
 */
function getMacroPreset(preset: string): {
	proteinPercent: number
	carbsPercent: number
	fatPercent: number
	description: string
} {
	const normalized = String(preset || 'balanced').toLowerCase().trim()
	
	const presets: Record<string, { proteinPercent: number; carbsPercent: number; fatPercent: number; description: string }> = {
		'balanced': {
			proteinPercent: 30,
			carbsPercent: 40,
			fatPercent: 30,
			description: 'Balanced (30% protein, 40% carbs, 30% fat)',
		},
		'low-carb': {
			proteinPercent: 35,
			carbsPercent: 20,
			fatPercent: 45,
			description: 'Low-Carb (35% protein, 20% carbs, 45% fat)',
		},
		'high-protein': {
			proteinPercent: 40,
			carbsPercent: 30,
			fatPercent: 30,
			description: 'High-Protein (40% protein, 30% carbs, 30% fat)',
		},
		'custom': {
			proteinPercent: 0, // Will be set from inputs
			carbsPercent: 0,
			fatPercent: 0,
			description: 'Custom',
		},
	}
	
	return presets[normalized] || presets['balanced']
}

/**
 * Round to 1 decimal place
 */
function round(value: number, decimals: number = 1): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculate macronutrient breakdown
 */
export const calculateMacronutrient: CalculationFunction = (inputs) => {
	// Extract inputs
	const dailyCalories = Number(inputs.dailyCalories || 0)
	const macroPreset = String(inputs.macroPreset || 'balanced')
	const proteinPercent = inputs.proteinPercent !== undefined ? Number(inputs.proteinPercent) : undefined
	const carbsPercent = inputs.carbsPercent !== undefined ? Number(inputs.carbsPercent) : undefined
	const fatPercent = inputs.fatPercent !== undefined ? Number(inputs.fatPercent) : undefined

	// Validation
	if (isNaN(dailyCalories) || dailyCalories <= 0) {
		throw new Error('Daily calories must be a positive number.')
	}
	if (dailyCalories < 500 || dailyCalories > 10000) {
		throw new Error('Daily calories should be between 500 and 10,000 for realistic results.')
	}

	// Get macro distribution
	let finalProteinPercent: number
	let finalCarbsPercent: number
	let finalFatPercent: number
	let presetDescription: string

	if (macroPreset.toLowerCase() === 'custom') {
		// Use custom percentages
		if (proteinPercent === undefined || carbsPercent === undefined || fatPercent === undefined) {
			throw new Error('Custom macro split requires protein, carbs, and fat percentages.')
		}
		if (isNaN(proteinPercent) || isNaN(carbsPercent) || isNaN(fatPercent)) {
			throw new Error('All macro percentages must be valid numbers.')
		}
		if (proteinPercent < 0 || carbsPercent < 0 || fatPercent < 0) {
			throw new Error('Macro percentages cannot be negative.')
		}
		
		const total = proteinPercent + carbsPercent + fatPercent
		if (Math.abs(total - 100) > 0.1) {
			throw new Error(`Macro percentages must sum to 100%. Current sum: ${total.toFixed(1)}%`)
		}
		
		finalProteinPercent = proteinPercent
		finalCarbsPercent = carbsPercent
		finalFatPercent = fatPercent
		presetDescription = 'Custom'
	} else {
		// Use preset
		const preset = getMacroPreset(macroPreset)
		finalProteinPercent = preset.proteinPercent
		finalCarbsPercent = preset.carbsPercent
		finalFatPercent = preset.fatPercent
		presetDescription = preset.description
	}

	// Calculate calories per macro
	const proteinCalories = (dailyCalories * finalProteinPercent) / 100
	const carbsCalories = (dailyCalories * finalCarbsPercent) / 100
	const fatCalories = (dailyCalories * finalFatPercent) / 100

	// Calculate grams per macro
	const proteinGrams = proteinCalories / PROTEIN_KCAL_PER_GRAM
	const carbsGrams = carbsCalories / CARBS_KCAL_PER_GRAM
	const fatGrams = fatCalories / FAT_KCAL_PER_GRAM

	// Round values
	const roundedProteinGrams = round(proteinGrams)
	const roundedCarbsGrams = round(carbsGrams)
	const roundedFatGrams = round(fatGrams)
	const roundedProteinCalories = round(proteinCalories)
	const roundedCarbsCalories = round(carbsCalories)
	const roundedFatCalories = round(fatCalories)

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Based on ${dailyCalories} calories per day with a ${presetDescription.toLowerCase()} macro split, you should aim for: ${roundedProteinGrams} g protein, ${roundedCarbsGrams} g carbohydrates, and ${roundedFatGrams} g fat.`)
	
	insights.push(`Protein (${roundedProteinGrams} g, ${finalProteinPercent}%): Provides 4 calories per gram and is essential for muscle repair, immune function, and hormone production. Adequate protein intake helps preserve muscle mass during weight loss and supports recovery after exercise.`)
	
	insights.push(`Carbohydrates (${roundedCarbsGrams} g, ${finalCarbsPercent}%): Provide 4 calories per gram and are your body's primary energy source. Carbs fuel your brain, muscles, and daily activities. They're especially important for high-intensity exercise and athletic performance.`)
	
	insights.push(`Fat (${roundedFatGrams} g, ${finalFatPercent}%): Provides 9 calories per gram (more than twice the energy density of protein and carbs). Fat is essential for hormone production, vitamin absorption, and cell membrane function. Healthy fats support brain health and satiety.`)
	
	insights.push(`Note: These are general guidelines. Individual macro needs can vary based on activity level, body composition goals, medical conditions, and personal preferences. Adjust based on your results and consult a registered dietitian for personalized advice.`)

	return {
		proteinGrams: roundedProteinGrams,
		carbsGrams: roundedCarbsGrams,
		fatGrams: roundedFatGrams,
		proteinCalories: roundedProteinCalories,
		carbsCalories: roundedCarbsCalories,
		fatCalories: roundedFatCalories,
		proteinPercent: finalProteinPercent,
		carbsPercent: finalCarbsPercent,
		fatPercent: finalFatPercent,
		presetDescription: presetDescription,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateMacronutrient', calculateMacronutrient)


