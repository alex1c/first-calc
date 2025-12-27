/**
 * Standard deviation calculation functions
 * Calculates mean, variance, and standard deviation for a dataset
 * Supports both population and sample calculations
 */

import type { CalculationFunction } from './registry'

/**
 * Parse dataset string into array of numbers
 * Accepts comma-separated values, spaces, and line breaks
 * 
 * @param datasetStr - String containing numbers (e.g., "4, 7, 10, 10, 15" or "4 7 10 10 15")
 * @returns Array of numbers
 */
function parseDataset(datasetStr: string): number[] {
	if (!datasetStr || typeof datasetStr !== 'string') {
		throw new Error('Dataset is required')
	}

	// Replace line breaks and multiple spaces with single space, then split by comma or space
	const normalized = datasetStr
		.replace(/\n/g, ' ')
		.replace(/\r/g, ' ')
		.replace(/,/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

	if (!normalized) {
		throw new Error('Dataset cannot be empty')
	}

	// Split by spaces and parse numbers
	const numbers = normalized
		.split(' ')
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
		.map((s) => parseFloat(s))

	// Check for invalid numbers
	const invalid = numbers.find((n) => isNaN(n))
	if (invalid !== undefined) {
		throw new Error('Dataset must contain only numbers')
	}

	if (numbers.length < 2) {
		throw new Error('Dataset must contain at least 2 numbers')
	}

	return numbers
}

/**
 * Calculate mean (average)
 */
function calculateMean(numbers: number[]): number {
	const sum = numbers.reduce((acc, n) => acc + n, 0)
	return sum / numbers.length
}

/**
 * Calculate variance
 * 
 * @param numbers - Array of numbers
 * @param type - 'population' or 'sample'
 * @returns Variance
 */
function calculateVariance(numbers: number[], type: 'population' | 'sample'): number {
	const mean = calculateMean(numbers)
	const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2))
	const sumSquaredDiffs = squaredDiffs.reduce((acc, n) => acc + n, 0)
	
	if (type === 'sample') {
		// Sample variance: divide by n-1 (Bessel's correction)
		return sumSquaredDiffs / (numbers.length - 1)
	} else {
		// Population variance: divide by n
		return sumSquaredDiffs / numbers.length
	}
}

/**
 * Calculate standard deviation
 * 
 * @param numbers - Array of numbers
 * @param type - 'population' or 'sample'
 * @returns Standard deviation
 */
function calculateStandardDeviation(numbers: number[], type: 'population' | 'sample'): number {
	return Math.sqrt(calculateVariance(numbers, type))
}

/**
 * Calculate standard deviation statistics for a dataset
 * 
 * @param inputs - Input values including dataset string and type (population/sample)
 * @returns Calculated statistics
 */
export function calculateStandardDeviationStats(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string> {
	const datasetStr = String(inputs.dataset || '')
	const type = String(inputs.type || 'population').toLowerCase() as 'population' | 'sample'
	
	if (type !== 'population' && type !== 'sample') {
		throw new Error('Type must be either "population" or "sample"')
	}

	const numbers = parseDataset(datasetStr)

	// Calculate statistics
	const mean = calculateMean(numbers)
	const variance = calculateVariance(numbers, type)
	const standardDeviation = calculateStandardDeviation(numbers, type)

	return {
		mean,
		variance,
		standardDeviation,
	}
}

// Register the calculation function
import { registerCalculation } from './registry'
registerCalculation('calculateStandardDeviation', calculateStandardDeviationStats)




