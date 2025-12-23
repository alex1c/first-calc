/**
 * Calculate number of days between two dates
 * Inputs: startDate, endDate, includeEndDate (optional boolean)
 * Outputs: totalDays, weeks, remainingDays, totalDaysInclusive, breakdown, explanation
 */

import type { CalculatorFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Calculate days between two dates
 */
export const calculateDaysBetweenDates: CalculatorFunction = (inputs) => {
	// Extract inputs
	const startDateStr = String(inputs.startDate || '')
	const endDateStr = String(inputs.endDate || '')
	const includeEndDate = inputs.includeEndDate === true || inputs.includeEndDate === 'true' || String(inputs.includeEndDate).toLowerCase() === 'true'

	// Validation
	if (!startDateStr || startDateStr.trim() === '') {
		throw new Error('Start date is required.')
	}
	if (!endDateStr || endDateStr.trim() === '') {
		throw new Error('End date is required.')
	}

	const startDate = new Date(startDateStr)
	const endDate = new Date(endDateStr)

	// Validate dates
	if (isNaN(startDate.getTime())) {
		throw new Error('Invalid start date.')
	}
	if (isNaN(endDate.getTime())) {
		throw new Error('Invalid end date.')
	}

	// Check that start date is before or equal to end date
	if (startDate > endDate) {
		throw new Error('Start date must be before or equal to end date.')
	}

	// Calculate difference in milliseconds
	const diffTime = endDate.getTime() - startDate.getTime()
	
	// Calculate total days (exclusive of end date by default)
	const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

	// Calculate weeks and remaining days
	const weeks = Math.floor(totalDays / 7)
	const remainingDays = totalDays % 7

	// Calculate inclusive days (if includeEndDate is true)
	const totalDaysInclusive = includeEndDate ? totalDays + 1 : totalDays
	const weeksInclusive = Math.floor(totalDaysInclusive / 7)
	const remainingDaysInclusive = totalDaysInclusive % 7

	// Format dates for display
	const startDateFormatted = startDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
	const endDateFormatted = endDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	// Create breakdown string
	let breakdown = ''
	if (weeks > 0) {
		breakdown = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
		if (remainingDays > 0) {
			breakdown += ` and ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
		}
	} else {
		breakdown = `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`
	}

	let breakdownInclusive = ''
	if (includeEndDate) {
		if (weeksInclusive > 0) {
			breakdownInclusive = `${weeksInclusive} ${weeksInclusive === 1 ? 'week' : 'weeks'}`
			if (remainingDaysInclusive > 0) {
				breakdownInclusive += ` and ${remainingDaysInclusive} ${remainingDaysInclusive === 1 ? 'day' : 'days'}`
			}
		} else {
			breakdownInclusive = `${totalDaysInclusive} ${totalDaysInclusive === 1 ? 'day' : 'days'}`
		}
	}

	// Create explanation
	let explanation = ''
	if (includeEndDate) {
		explanation = `There are ${totalDaysInclusive} days between ${startDateFormatted} and ${endDateFormatted} (inclusive of the end date). This equals ${breakdownInclusive}.`
	} else {
		explanation = `There are ${totalDays} days between ${startDateFormatted} and ${endDateFormatted} (exclusive of the end date). This equals ${breakdown}.`
	}

	return {
		totalDays,
		weeks,
		remainingDays,
		totalDaysInclusive,
		weeksInclusive,
		remainingDaysInclusive,
		breakdown,
		breakdownInclusive,
		startDateFormatted,
		endDateFormatted,
		explanation,
		includeEndDate: includeEndDate ? 'Yes' : 'No',
	}
}

// Register the calculation function
registerCalculation('calculateDaysBetweenDates', calculateDaysBetweenDates)


