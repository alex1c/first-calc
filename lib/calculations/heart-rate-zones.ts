/**
 * Calculate heart rate training zones
 * Inputs: age, restingHeartRate (optional), method
 * Outputs: maxHeartRate, zone1Min, zone1Max, zone2Min, zone2Max, zone3Min, zone3Max, zone4Min, zone4Max, zone5Min, zone5Max, methodUsed, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate maximum heart rate using simple formula
 * Max HR = 220 - age
 */
function calculateMaxHR(age: number): number {
	return 220 - age
}

/**
 * Calculate heart rate zone using simple method (percentage of max HR)
 */
function calculateZoneSimple(maxHR: number, minPercent: number, maxPercent: number): {
	min: number
	max: number
} {
	return {
		min: Math.round(maxHR * (minPercent / 100)),
		max: Math.round(maxHR * (maxPercent / 100)),
	}
}

/**
 * Calculate heart rate zone using Karvonen method
 * Target HR = ((MaxHR - RestHR) × intensity) + RestHR
 */
function calculateZoneKarvonen(maxHR: number, restHR: number, minPercent: number, maxPercent: number): {
	min: number
	max: number
} {
	const minIntensity = minPercent / 100
	const maxIntensity = maxPercent / 100
	
	const min = Math.round(((maxHR - restHR) * minIntensity) + restHR)
	const max = Math.round(((maxHR - restHR) * maxIntensity) + restHR)
	
	return { min, max }
}

/**
 * Round to nearest integer
 */
function round(value: number): number {
	return Math.round(value)
}

/**
 * Calculate heart rate zones
 */
export const calculateHeartRateZones: CalculatorFunction = (inputs) => {
	// Extract inputs
	const age = Number(inputs.age || 0)
	const restingHeartRate = inputs.restingHeartRate !== undefined ? Number(inputs.restingHeartRate) : undefined
	const method = String(inputs.method || 'simple').toLowerCase().trim()

	// Validation
	if (isNaN(age) || age <= 0) {
		throw new Error('Age must be a positive number.')
	}
	if (age < 10 || age > 120) {
		throw new Error('Age should be between 10 and 120 years for realistic results.')
	}
	
	// Validate method
	if (method !== 'simple' && method !== 'karvonen' && method !== 'maxhr' && method !== 'maxhr-simple') {
		throw new Error('Method must be either "simple" (maxHR) or "karvonen".')
	}
	
	// Validate resting heart rate if using Karvonen method
	const useKarvonen = method === 'karvonen'
	if (useKarvonen) {
		if (restingHeartRate === undefined || isNaN(restingHeartRate)) {
			throw new Error('Resting heart rate is required when using the Karvonen method.')
		}
		if (restingHeartRate <= 0 || restingHeartRate < 40 || restingHeartRate > 120) {
			throw new Error('Resting heart rate should be between 40 and 120 bpm for realistic results.')
		}
	}

	// Calculate maximum heart rate
	const maxHR = calculateMaxHR(age)
	const roundedMaxHR = round(maxHR)

	// Calculate zones
	let zone1: { min: number; max: number }
	let zone2: { min: number; max: number }
	let zone3: { min: number; max: number }
	let zone4: { min: number; max: number }
	let zone5: { min: number; max: number }
	let methodUsed: string

	if (useKarvonen && restingHeartRate !== undefined) {
		// Karvonen method
		zone1 = calculateZoneKarvonen(maxHR, restingHeartRate, 50, 60)
		zone2 = calculateZoneKarvonen(maxHR, restingHeartRate, 60, 70)
		zone3 = calculateZoneKarvonen(maxHR, restingHeartRate, 70, 80)
		zone4 = calculateZoneKarvonen(maxHR, restingHeartRate, 80, 90)
		zone5 = calculateZoneKarvonen(maxHR, restingHeartRate, 90, 100)
		methodUsed = 'Karvonen Method'
	} else {
		// Simple method (percentage of max HR)
		zone1 = calculateZoneSimple(maxHR, 50, 60)
		zone2 = calculateZoneSimple(maxHR, 60, 70)
		zone3 = calculateZoneSimple(maxHR, 70, 80)
		zone4 = calculateZoneSimple(maxHR, 80, 90)
		zone5 = calculateZoneSimple(maxHR, 90, 100)
		methodUsed = 'Max HR Method (220 - age)'
	}

	// Generate insights
	const insights: string[] = []
	
	insights.push(`Your maximum heart rate is approximately ${roundedMaxHR} bpm (calculated as 220 - age).`)
	
	insights.push(`Zone 1 (${zone1.min}-${zone1.max} bpm, 50-60%): Recovery zone - very light activity, ideal for warm-up, cool-down, and active recovery.`)
	
	insights.push(`Zone 2 (${zone2.min}-${zone2.max} bpm, 60-70%): Fat burning zone - light to moderate intensity, sustainable for long durations. Good for building aerobic base and endurance.`)
	
	insights.push(`Zone 3 (${zone3.min}-${zone3.max} bpm, 70-80%): Aerobic zone - moderate to vigorous intensity. Improves cardiovascular fitness and aerobic capacity.`)
	
	insights.push(`Zone 4 (${zone4.min}-${zone4.max} bpm, 80-90%): Anaerobic threshold zone - high intensity. Improves lactate threshold and anaerobic capacity. Challenging but sustainable for shorter durations.`)
	
	insights.push(`Zone 5 (${zone5.min}-${zone5.max} bpm, 90-100%): Maximum effort zone - very high intensity, near maximum heart rate. Used for short intervals and peak performance training. Not sustainable for long periods.`)
	
	insights.push(`Note: These zones are estimates based on age. Individual maximum heart rates can vary by ±10-15 bpm. The ${methodUsed} provides general guidelines. For personalized training zones, consider professional fitness testing or consultation with a healthcare provider.`)

	return {
		maxHeartRate: roundedMaxHR,
		zone1Min: zone1.min,
		zone1Max: zone1.max,
		zone2Min: zone2.min,
		zone2Max: zone2.max,
		zone3Min: zone3.min,
		zone3Max: zone3.max,
		zone4Min: zone4.min,
		zone4Max: zone4.max,
		zone5Min: zone5.min,
		zone5Max: zone5.max,
		methodUsed: methodUsed,
		insights: insights.join(' '),
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateHeartRateZones', calculateHeartRateZones)

