/**
 * Generate random numbers within a range
 * Inputs: minValue, maxValue, quantity, allowDuplicates
 * Outputs: numbers, numbersFormatted, explanation, range
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import {
	MAX_RANDOM_QUANTITY,
	assertBoundedIterations,
} from '@/lib/calculations/computation-bounds'

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate random numbers
 */
export const calculateRandomNumber: CalculationFunction = (inputs) => {
	// Extract inputs
	const minValueStr = String(inputs.minValue || '').trim()
	const maxValueStr = String(inputs.maxValue || '').trim()
	const quantityStr = String(inputs.quantity || '1').trim()
	const allowDuplicates = inputs.allowDuplicates === true || (typeof inputs.allowDuplicates === 'string' && inputs.allowDuplicates.toLowerCase() === 'true') || inputs.allowDuplicates === 'true' || String(inputs.allowDuplicates).toLowerCase() === 'true'

	// Validation — domain errors map to HTTP 400
	if (!minValueStr || minValueStr.trim() === '') {
		throw new CalculationDomainError('Minimum value is required.')
	}

	if (!maxValueStr || maxValueStr.trim() === '') {
		throw new CalculationDomainError('Maximum value is required.')
	}

	const minValue = parseInt(minValueStr, 10)
	const maxValue = parseInt(maxValueStr, 10)

	if (isNaN(minValue) || isNaN(maxValue) || !Number.isInteger(minValue) || !Number.isInteger(maxValue)) {
		throw new CalculationDomainError('Minimum and maximum values must be valid integers.')
	}

	if (minValue >= maxValue) {
		throw new CalculationDomainError('Minimum value must be less than maximum value.')
	}

	const quantityParsed = parseInt(quantityStr, 10)
	if (isNaN(quantityParsed) || !Number.isInteger(quantityParsed)) {
		throw new CalculationDomainError('Quantity must be a valid integer.')
	}

	if (quantityParsed <= 0) {
		throw new CalculationDomainError('Quantity must be at least 1.')
	}

	// Hard cap independent of form validation — prevents unbounded array allocation
	const quantity = assertBoundedIterations(
		quantityParsed,
		MAX_RANDOM_QUANTITY,
		'Quantity',
	)

	// Check if duplicates are possible
	const rangeSize = maxValue - minValue + 1
	if (!allowDuplicates && quantity > rangeSize) {
		throw new CalculationDomainError(
			`Cannot generate ${quantity} unique numbers from a range of ${rangeSize} numbers. Maximum unique numbers: ${rangeSize}.`,
		)
	}

	// Generate random numbers
	const numbers: number[] = []

	if (allowDuplicates) {
		// Allow duplicates - simple generation
		for (let i = 0; i < quantity; i++) {
			numbers.push(randomInt(minValue, maxValue))
		}
	} else {
		// No duplicates - use Set to track used numbers
		const used = new Set<number>()
		let attempts = 0
		const maxAttempts = rangeSize * 10 // Prevent infinite loops

		while (numbers.length < quantity && attempts < maxAttempts) {
			const num = randomInt(minValue, maxValue)
			if (!used.has(num)) {
				numbers.push(num)
				used.add(num)
			}
			attempts++
		}

		if (numbers.length < quantity) {
			throw new CalculationDomainError(
				'Failed to generate enough unique numbers. Try allowing duplicates or reducing quantity.',
			)
		}

		// Shuffle the array for better randomness
		for (let i = numbers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
		}
	}

	// Format numbers
	const numbersFormatted = numbers.join(', ')
	const numbersList = numbers.map(n => n.toString())

	// Create explanation
	let explanation = ''
	if (quantity === 1) {
		explanation = `Generated random number between ${minValue} and ${maxValue} (inclusive): ${numbers[0]}.`
	} else {
		explanation = `Generated ${quantity} random number${quantity > 1 ? 's' : ''} between ${minValue} and ${maxValue} (inclusive)${allowDuplicates ? ' with duplicates allowed' : ' without duplicates'}.`
	}

	return {
		numbers: numbersList,
		numbersFormatted,
		explanation,
		minValue,
		maxValue,
		quantity,
		allowDuplicates,
		range: `${minValue} to ${maxValue}`,
		rangeSize,
	}
}

// Register the calculation function
registerCalculation('calculateRandomNumber', calculateRandomNumber)


