/**
 * Calculate date by adding or subtracting days
 * Inputs: startDate, operation, numberOfDays
 * Outputs: resultDate, weekday, isoDate, explanation, daysAdded, daysSubtracted
 */

import type { CalculatorFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Get weekday name
 */
function getWeekdayName(date: Date, locale: string = 'en'): string {
	const weekdays = {
		en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
	}
	const dayNames = weekdays[locale as keyof typeof weekdays] || weekdays.en
	return dayNames[date.getDay()]
}

/**
 * Format date as YYYY-MM-DD
 */
function formatISODate(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

/**
 * Format date in readable format
 */
function formatReadableDate(date: Date, locale: string = 'en'): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}
	return date.toLocaleDateString(locale, options)
}

/**
 * Calculate date by adding or subtracting days
 */
export const calculateDateCalculator: CalculatorFunction = (inputs) => {
	// Extract inputs
	const startDateStr = String(inputs.startDate || '').trim()
	const operation = String(inputs.operation || 'add').toLowerCase()
	const numberOfDaysStr = String(inputs.numberOfDays || '0').trim()
	const locale = String(inputs.locale || 'en').toLowerCase()

	// Validation
	if (!startDateStr || startDateStr.trim() === '') {
		throw new Error('Start date is required.')
	}

	if (!numberOfDaysStr || numberOfDaysStr.trim() === '') {
		throw new Error('Number of days is required.')
	}

	// Parse start date
	const startDate = new Date(startDateStr)
	if (isNaN(startDate.getTime())) {
		throw new Error('Invalid start date. Please enter a valid date.')
	}

	// Parse number of days
	const numberOfDays = parseInt(numberOfDaysStr, 10)
	if (isNaN(numberOfDays) || !Number.isInteger(numberOfDays)) {
		throw new Error('Number of days must be a valid integer.')
	}

	if (numberOfDays < 0) {
		throw new Error('Number of days must be 0 or greater.')
	}

	// Calculate result date
	const resultDate = new Date(startDate)
	
	if (operation === 'add' || operation === 'add-days') {
		resultDate.setDate(resultDate.getDate() + numberOfDays)
	} else if (operation === 'subtract' || operation === 'subtract-days') {
		resultDate.setDate(resultDate.getDate() - numberOfDays)
	} else {
		throw new Error('Invalid operation. Use "add" or "subtract".')
	}

	// Validate result date
	if (isNaN(resultDate.getTime())) {
		throw new Error('Invalid result date. Please check your inputs.')
	}

	// Get weekday
	const weekday = getWeekdayName(resultDate, locale)

	// Format dates
	const startDateFormatted = formatReadableDate(startDate, locale)
	const resultDateFormatted = formatReadableDate(resultDate, locale)
	const startDateISO = formatISODate(startDate)
	const resultDateISO = formatISODate(resultDate)

	// Create explanation
	let explanation = ''
	if (operation === 'add' || operation === 'add-days') {
		explanation = `Adding ${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'} to ${startDateFormatted} results in ${resultDateFormatted} (${weekday}).`
	} else {
		explanation = `Subtracting ${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'} from ${startDateFormatted} results in ${resultDateFormatted} (${weekday}).`
	}

	// Calculate difference in days (for verification)
	const diffTime = resultDate.getTime() - startDate.getTime()
	const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

	return {
		resultDate: resultDateISO,
		resultDateFormatted,
		weekday,
		isoDate: resultDateISO,
		explanation,
		daysAdded: operation === 'add' || operation === 'add-days' ? numberOfDays : 0,
		daysSubtracted: operation === 'subtract' || operation === 'subtract-days' ? numberOfDays : 0,
		startDate: startDateISO,
		startDateFormatted,
		numberOfDays,
		operation: operation === 'add' || operation === 'add-days' ? 'add' : 'subtract',
		daysDifference: diffDays,
	}
}

// Register the calculation function
registerCalculation('calculateDateCalculator', calculateDateCalculator)


