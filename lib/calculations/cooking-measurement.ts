/**
 * Convert cooking measurements
 * Inputs: value, fromUnit, toUnit (optional, auto-detect), ingredient (optional)
 * Outputs: result, resultFormatted, explanation, conversionType
 */

import type { CalculatorFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Ingredient densities (grams per milliliter)
 * Used for volume to weight conversions
 */
const ingredientDensities: Record<string, number> = {
	water: 1.0,
	flour: 0.57, // All-purpose flour
	sugar: 0.85, // Granulated sugar
	brownSugar: 0.72, // Packed brown sugar
	butter: 0.91,
	milk: 1.03,
	oil: 0.92,
	honey: 1.42,
	cocoa: 0.52,
	powderedSugar: 0.56,
}

/**
 * Volume conversion factors (to milliliters)
 */
const volumeToML: Record<string, number> = {
	'cups': 236.588,
	'tablespoons': 14.7868,
	'teaspoons': 4.92892,
	'milliliters': 1,
	'ml': 1,
	'tbsp': 14.7868,
	'tsp': 4.92892,
	'cup': 236.588,
}

/**
 * Weight conversion factors (to grams)
 */
const weightToGramsMap: Record<string, number> = {
	'grams': 1,
	'g': 1,
	'ounces': 28.3495,
	'oz': 28.3495,
	'pounds': 453.592,
	'lb': 453.592,
}

/**
 * Check if unit is volume
 */
function isVolumeUnit(unit: string): boolean {
	return ['cups', 'cup', 'tablespoons', 'tbsp', 'teaspoons', 'tsp', 'milliliters', 'ml'].includes(unit.toLowerCase())
}

/**
 * Check if unit is weight
 */
function isWeightUnit(unit: string): boolean {
	return ['grams', 'g', 'ounces', 'oz', 'pounds', 'lb'].includes(unit.toLowerCase())
}

/**
 * Convert volume to milliliters
 */
function volumeToMilliliters(value: number, unit: string): number {
	const normalizedUnit = unit.toLowerCase()
	const factor = volumeToML[normalizedUnit]
	if (!factor) {
		throw new Error(`Unknown volume unit: ${unit}`)
	}
	return value * factor
}

/**
 * Convert milliliters to target volume unit
 */
function millilitersToVolume(ml: number, unit: string): number {
	const normalizedUnit = unit.toLowerCase()
	const factor = volumeToML[normalizedUnit]
	if (!factor) {
		throw new Error(`Unknown volume unit: ${unit}`)
	}
	return ml / factor
}

/**
 * Convert weight to grams
 */
function weightToGrams(value: number, unit: string): number {
	const normalizedUnit = unit.toLowerCase()
	const factor = weightToGramsMap[normalizedUnit]
	if (!factor) {
		throw new Error(`Unknown weight unit: ${unit}`)
	}
	return value * factor
}

/**
 * Convert grams to target weight unit
 */
function gramsToWeight(g: number, unit: string): number {
	const normalizedUnit = unit.toLowerCase()
	const factor = weightToGramsMap[normalizedUnit]
	if (!factor) {
		throw new Error(`Unknown weight unit: ${unit}`)
	}
	return g / factor
}

/**
 * Get ingredient density
 */
function getIngredientDensity(ingredient: string): number {
	const normalized = ingredient.toLowerCase().replace(/\s+/g, '')
	return ingredientDensities[normalized] || ingredientDensities.water
}

/**
 * Calculate cooking measurement conversion
 */
export const calculateCookingMeasurement: CalculatorFunction = (inputs) => {
	// Extract inputs
	const valueStr = String(inputs.value || '').trim()
	const fromUnit = String(inputs.fromUnit || '').trim()
	const toUnit = String(inputs.toUnit || '').trim()
	const ingredient = String(inputs.ingredient || 'water').trim().toLowerCase()

	// Validation
	if (!valueStr || valueStr.trim() === '') {
		throw new Error('Value is required.')
	}

	const value = parseFloat(valueStr)
	if (isNaN(value) || !Number.isFinite(value)) {
		throw new Error('Invalid value. Please enter a valid number.')
	}

	if (value <= 0) {
		throw new Error('Value must be greater than 0.')
	}

	if (!fromUnit) {
		throw new Error('From unit is required.')
	}

	// Normalize units
	const normalizedFromUnit = fromUnit.toLowerCase()
	const normalizedToUnit = toUnit.toLowerCase() || normalizedFromUnit

	// Determine conversion type
	const fromIsVolume = isVolumeUnit(normalizedFromUnit)
	const fromIsWeight = isWeightUnit(normalizedFromUnit)
	const toIsVolume = isVolumeUnit(normalizedToUnit)
	const toIsWeight = isWeightUnit(normalizedToUnit)

	if (!fromIsVolume && !fromIsWeight) {
		throw new Error(`Unknown unit: ${fromUnit}. Please use a valid cooking measurement unit.`)
	}

	if (toUnit && !toIsVolume && !toIsWeight) {
		throw new Error(`Unknown unit: ${toUnit}. Please use a valid cooking measurement unit.`)
	}

	let result: number
	let conversionType: string
	let explanation: string
	let ingredientNote: string = ''

	// Case 1: Volume to Volume
	if (fromIsVolume && toIsVolume) {
		const ml = volumeToMilliliters(value, normalizedFromUnit)
		result = millilitersToVolume(ml, normalizedToUnit)
		conversionType = 'volume-to-volume'
		explanation = `${value} ${fromUnit} = ${result.toFixed(2)} ${toUnit} (volume conversion)`
	}

	// Case 2: Weight to Weight
	else if (fromIsWeight && toIsWeight) {
		const grams = weightToGrams(value, normalizedFromUnit)
		result = gramsToWeight(grams, normalizedToUnit)
		conversionType = 'weight-to-weight'
		explanation = `${value} ${fromUnit} = ${result.toFixed(2)} ${toUnit} (weight conversion)`
	}

	// Case 3: Volume to Weight (requires ingredient density)
	else if (fromIsVolume && toIsWeight) {
		const ml = volumeToMilliliters(value, normalizedFromUnit)
		const density = getIngredientDensity(ingredient)
		const grams = ml * density
		result = gramsToWeight(grams, normalizedToUnit)
		conversionType = 'volume-to-weight'
		explanation = `${value} ${fromUnit} of ${ingredient} = ${result.toFixed(2)} ${toUnit} (using density: ${density.toFixed(2)} g/ml)`
		ingredientNote = `Note: Conversion depends on ingredient density. ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)} has a density of ${density.toFixed(2)} g/ml.`
	}

	// Case 4: Weight to Volume (requires ingredient density)
	else if (fromIsWeight && toIsVolume) {
		const grams = weightToGrams(value, normalizedFromUnit)
		const density = getIngredientDensity(ingredient)
		const ml = grams / density
		result = millilitersToVolume(ml, normalizedToUnit)
		conversionType = 'weight-to-volume'
		explanation = `${value} ${fromUnit} of ${ingredient} = ${result.toFixed(2)} ${toUnit} (using density: ${density.toFixed(2)} g/ml)`
		ingredientNote = `Note: Conversion depends on ingredient density. ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)} has a density of ${density.toFixed(2)} g/ml.`
	}

	else {
		throw new Error('Invalid conversion. Cannot convert between incompatible unit types.')
	}

	// Format result
	const resultFormatted = result < 0.01 
		? result.toFixed(4) 
		: result < 1 
		? result.toFixed(3) 
		: result < 10 
		? result.toFixed(2) 
		: result.toFixed(1)

	return {
		result,
		resultFormatted,
		explanation,
		conversionType,
		ingredientNote,
		fromUnit: fromUnit,
		toUnit: toUnit || fromUnit,
		ingredient: ingredient,
		originalValue: value,
	}
}

// Register the calculation function
registerCalculation('calculateCookingMeasurement', calculateCookingMeasurement)

