/**
 * Calculate fuel consumption or convert between units
 * Inputs: mode, distance, distanceUnit, fuelUsed, fuelUnit, value, fromUnit, toUnit
 * Outputs: l100km, mpgUS, mpgUK, convertedValue, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

// Conversion constants
const MILES_TO_KM = 1.609344
const KM_TO_MILES = 1 / MILES_TO_KM
const GALLON_US_TO_LITERS = 3.785411784
const GALLON_UK_TO_LITERS = 4.54609
const LITERS_TO_GALLON_US = 1 / GALLON_US_TO_LITERS
const LITERS_TO_GALLON_UK = 1 / GALLON_UK_TO_LITERS

/**
 * Calculate fuel consumption or convert between units
 */
export const calculateFuelConsumption: CalculatorFunction = (inputs) => {
	const mode = String(inputs.mode || 'calculate').toLowerCase()

	if (mode === 'convert') {
		// MODE B: Convert Units
		const value = Number(inputs.value || 0)
		// Normalize unit strings (handle various formats)
		let fromUnit = String(inputs.fromUnit || '').toLowerCase().replace(/\s+/g, ' ')
		let toUnit = String(inputs.toUnit || '').toLowerCase().replace(/\s+/g, ' ')
		
		// Normalize to standard format
		if (fromUnit.includes('l/100km') || fromUnit === 'l/100km') {
			fromUnit = 'l/100km'
		} else if (fromUnit.includes('mpg') && fromUnit.includes('uk')) {
			fromUnit = 'mpg uk'
		} else if (fromUnit.includes('mpg')) {
			fromUnit = 'mpg us'
		}
		
		if (toUnit.includes('l/100km') || toUnit === 'l/100km') {
			toUnit = 'l/100km'
		} else if (toUnit.includes('mpg') && toUnit.includes('uk')) {
			toUnit = 'mpg uk'
		} else if (toUnit.includes('mpg')) {
			toUnit = 'mpg us'
		}

		// Validation
		if (
			isNaN(value) ||
			value <= 0 ||
			!['l/100km', 'mpg us', 'mpg uk'].includes(fromUnit) ||
			!['l/100km', 'mpg us', 'mpg uk'].includes(toUnit) ||
			fromUnit === toUnit
		) {
			return {
				convertedValue: null,
				fromUnit: null,
				toUnit: null,
				insights: null,
			}
		}

		// Convert to L/100km first (common intermediate)
		let l100km: number
		if (fromUnit === 'l/100km') {
			l100km = value
		} else if (fromUnit === 'mpg us') {
			// MPG US to L/100km: (235.214583 / MPG)
			l100km = 235.214583 / value
		} else {
			// MPG UK to L/100km: (282.481 / MPG)
			l100km = 282.481 / value
		}

		// Convert from L/100km to target unit
		let convertedValue: number
		if (toUnit === 'l/100km') {
			convertedValue = l100km
		} else if (toUnit === 'mpg us') {
			// L/100km to MPG US: (235.214583 / L/100km)
			convertedValue = 235.214583 / l100km
		} else {
			// L/100km to MPG UK: (282.481 / L/100km)
			convertedValue = 282.481 / l100km
		}

		// Generate insights
		const insights: string[] = []
		
		if (toUnit === 'l/100km') {
			if (convertedValue <= 7) {
				insights.push(`Excellent fuel efficiency! ${convertedValue.toFixed(2)} L/100km is very efficient.`)
			} else if (convertedValue <= 10) {
				insights.push(`Good fuel efficiency at ${convertedValue.toFixed(2)} L/100km.`)
			} else {
				insights.push(`Fuel consumption of ${convertedValue.toFixed(2)} L/100km. Consider fuel-efficient driving habits.`)
			}
		} else {
			const mpgType = toUnit === 'mpg us' ? 'US' : 'UK'
			if (convertedValue >= 30) {
				insights.push(`Excellent fuel efficiency! ${convertedValue.toFixed(2)} MPG (${mpgType}) is very efficient.`)
			} else if (convertedValue >= 25) {
				insights.push(`Good fuel efficiency at ${convertedValue.toFixed(2)} MPG (${mpgType}).`)
			} else {
				insights.push(`Fuel efficiency of ${convertedValue.toFixed(2)} MPG (${mpgType}). Consider fuel-efficient driving habits.`)
			}
		}

		// Round to 2-3 decimal places
		const round = (val: number) => Math.round(val * 1000) / 1000

		// Format unit names for display
		const formatUnit = (unit: string) => {
			if (unit === 'l/100km') return 'L/100km'
			if (unit === 'mpg us') return 'MPG (US)'
			if (unit === 'mpg uk') return 'MPG (UK)'
			return unit.toUpperCase()
		}

		return {
			convertedValue: round(convertedValue),
			fromUnit: formatUnit(fromUnit),
			toUnit: formatUnit(toUnit),
			insights: insights.join(' '),
			l100km: round(l100km),
			mpgUS: round(235.214583 / l100km),
			mpgUK: round(282.481 / l100km),
		}
	} else {
		// MODE A: Calculate Consumption
		const distance = Number(inputs.distance || 0)
		const distanceUnit = String(inputs.distanceUnit || 'km').toLowerCase()
		const fuelUsed = Number(inputs.fuelUsed || 0)
		const fuelUnit = String(inputs.fuelUnit || 'liters').toLowerCase()

		// Validation
		if (
			isNaN(distance) ||
			isNaN(fuelUsed) ||
			distance <= 0 ||
			fuelUsed <= 0 ||
			!['km', 'miles'].includes(distanceUnit) ||
			!['liters', 'gallons us', 'gallons uk'].includes(fuelUnit)
		) {
			return {
				l100km: null,
				mpgUS: null,
				mpgUK: null,
				insights: null,
			}
		}

		// Convert everything to metric (km and liters) for calculation
		let distanceKm: number
		let fuelLiters: number

		// Convert distance to km
		if (distanceUnit === 'km') {
			distanceKm = distance
		} else {
			// miles to km
			distanceKm = distance * MILES_TO_KM
		}

		// Convert fuel to liters
		if (fuelUnit === 'liters') {
			fuelLiters = fuelUsed
		} else if (fuelUnit === 'gallons us') {
			fuelLiters = fuelUsed * GALLON_US_TO_LITERS
		} else {
			// gallons uk
			fuelLiters = fuelUsed * GALLON_UK_TO_LITERS
		}

		// Calculate L/100km
		const l100km = (fuelLiters / distanceKm) * 100

		// Calculate MPG US
		const distanceMiles = distanceKm * KM_TO_MILES
		const fuelGallonsUS = fuelLiters * LITERS_TO_GALLON_US
		const mpgUS = distanceMiles / fuelGallonsUS

		// Calculate MPG UK
		const fuelGallonsUK = fuelLiters * LITERS_TO_GALLON_UK
		const mpgUK = distanceMiles / fuelGallonsUK

		// Generate insights
		const insights: string[] = []

		// Efficiency rating
		if (l100km <= 7) {
			insights.push(`Excellent fuel efficiency! Your vehicle consumes ${l100km.toFixed(2)} L/100km, which is very efficient.`)
		} else if (l100km <= 10) {
			insights.push(`Good fuel efficiency at ${l100km.toFixed(2)} L/100km.`)
		} else if (l100km <= 12) {
			insights.push(`Average fuel consumption of ${l100km.toFixed(2)} L/100km.`)
		} else {
			insights.push(`Higher fuel consumption of ${l100km.toFixed(2)} L/100km. Consider fuel-efficient driving habits to reduce consumption.`)
		}

		// Unit comparison
		insights.push(`This equals ${mpgUS.toFixed(2)} MPG (US) or ${mpgUK.toFixed(2)} MPG (UK).`)

		// Tips
		insights.push(`Tips to improve fuel efficiency: maintain proper tire pressure, drive at steady speeds, avoid aggressive acceleration and braking, remove excess weight, and keep your vehicle well-maintained.`)

		// Round to 2-3 decimal places
		const round = (val: number) => Math.round(val * 1000) / 1000

		return {
			l100km: round(l100km),
			mpgUS: round(mpgUS),
			mpgUK: round(mpgUK),
			insights: insights.join(' '),
			distanceKm: round(distanceKm),
			fuelLiters: round(fuelLiters),
		}
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateFuelConsumption', calculateFuelConsumption)

