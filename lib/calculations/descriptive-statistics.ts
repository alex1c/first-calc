/**
 * Descriptive statistics calculation functions
 * Calculates mean, median, mode, variance, standard deviation, and other statistics
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
 * Calculate median
 */
function calculateMedian(numbers: number[]): number {
	const sorted = [...numbers].sort((a, b) => a - b)
	const mid = Math.floor(sorted.length / 2)
	
	if (sorted.length % 2 === 0) {
		// Even number of elements: average of two middle values
		return (sorted[mid - 1] + sorted[mid]) / 2
	} else {
		// Odd number of elements: middle value
		return sorted[mid]
	}
}

/**
 * Calculate mode(s)
 * Returns array of modes (can be multiple if there are ties)
 */
function calculateMode(numbers: number[]): number[] {
	// Count frequency of each number
	const frequency: Record<number, number> = {}
	numbers.forEach((n) => {
		frequency[n] = (frequency[n] || 0) + 1
	})

	// Find maximum frequency
	const maxFreq = Math.max(...Object.values(frequency))

	// If all numbers appear once, there is no mode
	if (maxFreq === 1 && numbers.length > 1) {
		return []
	}

	// Find all numbers with maximum frequency
	const modes: number[] = []
	Object.entries(frequency).forEach(([num, freq]) => {
		if (freq === maxFreq) {
			modes.push(parseFloat(num))
		}
	})

	return modes.sort((a, b) => a - b)
}

/**
 * Calculate variance (population variance)
 */
function calculateVariance(numbers: number[]): number {
	const mean = calculateMean(numbers)
	const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2))
	const sumSquaredDiffs = squaredDiffs.reduce((acc, n) => acc + n, 0)
	return sumSquaredDiffs / numbers.length
}

/**
 * Calculate standard deviation (population standard deviation)
 */
function calculateStandardDeviation(numbers: number[]): number {
	return Math.sqrt(calculateVariance(numbers))
}

/**
 * Calculate descriptive statistics for a dataset
 * 
 * @param inputs - Input values including dataset string
 * @returns Calculated statistics
 */
export function calculateDescriptiveStatistics(
	inputs: Record<string, number | string>,
): Record<string, number | string | number[]> {
	const datasetStr = String(inputs.dataset || '')
	const numbers = parseDataset(datasetStr)

	// Sort numbers for display
	const sortedData = [...numbers].sort((a, b) => a - b)

	// Calculate all statistics
	const count = numbers.length
	const sum = numbers.reduce((acc, n) => acc + n, 0)
	const mean = calculateMean(numbers)
	const median = calculateMedian(numbers)
	const mode = calculateMode(numbers)
	const min = Math.min(...numbers)
	const max = Math.max(...numbers)
	const range = max - min
	const variance = calculateVariance(numbers)
	const standardDeviation = calculateStandardDeviation(numbers)

	return {
		count,
		sum,
		mean,
		median,
		mode: mode.length > 0 ? mode : 'No mode',
		min,
		max,
		range,
		variance,
		standardDeviation,
		sortedData,
	}
}

// Register the calculation function
import { registerCalculation } from './registry'
registerCalculation('calculateDescriptiveStatistics', calculateDescriptiveStatistics)




