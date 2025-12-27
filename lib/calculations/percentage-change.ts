/**
 * Percentage change calculation functions
 * Calculates percentage increase or decrease between two values
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate percentage change between original and new value
 * 
 * Formula: ((new - original) / original) × 100%
 * 
 * @param inputs - Input values: original and new
 * @returns Percentage change, direction, formula, and absolute difference
 */
export function calculatePercentageChange(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string> {
	const original = Number(inputs.original)
	const newValue = Number(inputs.new)
	
	if (isNaN(original)) {
		throw new Error('Original value must be a number')
	}
	if (isNaN(newValue)) {
		throw new Error('New value must be a number')
	}
	if (original === 0) {
		throw new Error('Original value cannot be zero (division by zero)')
	}
	
	// Calculate absolute difference
	const absoluteDifference = newValue - original
	
	// Calculate percentage change
	const percentageChange = (absoluteDifference / original) * 100
	
	// Determine direction
	const direction = percentageChange > 0 ? 'Increase' : percentageChange < 0 ? 'Decrease' : 'No Change'
	
	// Build formula string
	const sign = percentageChange >= 0 ? '+' : ''
	const formula = `((new − original) / original) × 100% = ((${newValue} − ${original}) / ${original}) × 100% = (${absoluteDifference} / ${original}) × 100% = ${sign}${percentageChange.toFixed(6)}%`
	
	return {
		percentageChange: Number(percentageChange.toFixed(6)),
		direction,
		formula,
		absoluteDifference: Number(absoluteDifference.toFixed(6)),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculatePercentageChange', calculatePercentageChange)




