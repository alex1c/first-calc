/**
 * Calculate exact age based on date of birth
 * Inputs: dateOfBirth, referenceDate (optional, default = today)
 * Outputs: years, months, days, totalDays, totalWeeks, ageString, referenceDateUsed
 */

import type { CalculatorFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Calculate age from date of birth
 */
export const calculateAge: CalculatorFunction = (inputs) => {
	// Extract inputs
	const dateOfBirthStr = String(inputs.dateOfBirth || '')
	const referenceDateStr = String(inputs.referenceDate || '')

	// Validation
	if (!dateOfBirthStr || dateOfBirthStr.trim() === '') {
		throw new Error('Date of birth is required.')
	}

	const dateOfBirth = new Date(dateOfBirthStr)
	const referenceDate = referenceDateStr && referenceDateStr.trim() !== ''
		? new Date(referenceDateStr)
		: new Date() // Default to today

	// Validate dates
	if (isNaN(dateOfBirth.getTime())) {
		throw new Error('Invalid date of birth.')
	}
	if (isNaN(referenceDate.getTime())) {
		throw new Error('Invalid reference date.')
	}

	// Check that birth date is before reference date
	if (dateOfBirth >= referenceDate) {
		throw new Error('Date of birth must be before the reference date.')
	}

	// Check that reference date is not in the future
	const today = new Date()
	today.setHours(23, 59, 59, 999) // End of today
	if (referenceDate > today) {
		throw new Error('Reference date cannot be in the future.')
	}

	// Calculate age
	let years = referenceDate.getFullYear() - dateOfBirth.getFullYear()
	let months = referenceDate.getMonth() - dateOfBirth.getMonth()
	let days = referenceDate.getDate() - dateOfBirth.getDate()

	// Adjust for negative days
	if (days < 0) {
		months--
		// Get days in the previous month
		const lastDayOfPrevMonth = new Date(
			referenceDate.getFullYear(),
			referenceDate.getMonth(),
			0
		).getDate()
		days += lastDayOfPrevMonth
	}

	// Adjust for negative months
	if (months < 0) {
		years--
		months += 12
	}

	// Calculate total days lived
	const totalDays = Math.floor(
		(referenceDate.getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24)
	)

	// Calculate total weeks
	const totalWeeks = Math.floor(totalDays / 7)

	// Format age string
	const ageParts: string[] = []
	if (years > 0) {
		ageParts.push(`${years} ${years === 1 ? 'year' : 'years'}`)
	}
	if (months > 0) {
		ageParts.push(`${months} ${months === 1 ? 'month' : 'months'}`)
	}
	if (days > 0 || ageParts.length === 0) {
		ageParts.push(`${days} ${days === 1 ? 'day' : 'days'}`)
	}
	const ageString = ageParts.join(', ')

	// Format reference date used
	const referenceDateUsed = referenceDateStr && referenceDateStr.trim() !== ''
		? referenceDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: 'Today'

	return {
		years,
		months,
		days,
		totalDays,
		totalWeeks,
		ageString,
		referenceDateUsed,
		explanation: `You are ${ageString} old as of ${referenceDateUsed}.`,
	}
}

// Register the calculation function
registerCalculation('calculateAge', calculateAge)

