/**
 * Calculate fuel cost for driving trips or periods
 * Inputs: distance, fuelConsumption, consumptionUnit, fuelPricePerUnit, periodType,
 *         roundTrip, currency
 * Outputs: fuelUsed, fuelCost, costPerDistance, totalFuelCost, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Calculate fuel cost for driving trips or periods
 */
export const calculateFuelCost: CalculationFunction = (inputs) => {
	// Extract and parse inputs
	const distance = Number(inputs.distance || 0)
	const fuelConsumption = Number(inputs.fuelConsumption || 0)
	const consumptionUnit = String(inputs.consumptionUnit || 'L/100km').toLowerCase()
	const fuelPricePerUnit = Number(inputs.fuelPricePerUnit || 0)
	const periodType = String(inputs.periodType || 'trip').toLowerCase() // trip, monthly, yearly
	const roundTrip = inputs.roundTrip === true || (typeof inputs.roundTrip === 'string' && inputs.roundTrip.toLowerCase() === 'true') || inputs.roundTrip === 'true'
	const currency = String(inputs.currency || '$')

	// Validation
	if (
		isNaN(distance) ||
		isNaN(fuelConsumption) ||
		isNaN(fuelPricePerUnit) ||
		distance <= 0 ||
		fuelConsumption <= 0 ||
		fuelPricePerUnit <= 0 ||
		!['l/100km', 'mpg'].includes(consumptionUnit) ||
		!['trip', 'monthly', 'yearly'].includes(periodType)
	) {
		return {
			fuelUsed: null,
			fuelCost: null,
			costPerDistance: null,
			totalFuelCost: null,
			insights: null,
		}
	}

	// Adjust distance for round trip
	const actualDistance = roundTrip ? distance * 2 : distance

	// Calculate fuel used and fuel cost based on consumption unit
	let fuelUsed: number
	let fuelCost: number
	
	if (consumptionUnit === 'l/100km') {
		// L/100km: fuel used = (distance / 100) * consumption (in liters)
		fuelUsed = (actualDistance / 100) * fuelConsumption
		// Fuel price is per liter
		fuelCost = fuelUsed * fuelPricePerUnit
	} else {
		// MPG: fuel used = distance / consumption (in gallons)
		const fuelUsedGallons = actualDistance / fuelConsumption
		fuelUsed = fuelUsedGallons // Keep in gallons for MPG
		// Fuel price is per gallon
		fuelCost = fuelUsed * fuelPricePerUnit
		// Convert fuel used to liters for display consistency (1 gallon = 3.78541 liters)
		fuelUsed = fuelUsed * 3.78541
	}

	// Calculate cost per km or mile
	// For MPG, we need to handle the unit conversion
	let costPerDistance: number
	if (consumptionUnit === 'l/100km') {
		costPerDistance = fuelCost / actualDistance // Cost per km
	} else {
		// For MPG, cost per mile
		costPerDistance = fuelCost / actualDistance
	}

	// Calculate total fuel cost for monthly/yearly periods
	// For monthly/yearly, the distance is already the total monthly/yearly distance
	// So totalFuelCost is the same as fuelCost (already calculated for the period)
	let totalFuelCost: number | null = null
	if (periodType === 'monthly' || periodType === 'yearly') {
		totalFuelCost = fuelCost
	}

	// Generate insights
	const insights: string[] = []

	// Round trip insight
	if (roundTrip) {
		insights.push(
			`Round trip distance: ${actualDistance.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${consumptionUnit === 'l/100km' ? 'km' : 'miles'}.`
		)
	}

	// Fuel efficiency insight
	if (consumptionUnit === 'mpg') {
		if (fuelConsumption >= 30) {
			insights.push(
				`Your vehicle is fuel-efficient at ${fuelConsumption} MPG. This helps keep fuel costs lower.`
			)
		} else if (fuelConsumption < 20) {
			insights.push(
				`Your vehicle has lower fuel efficiency (${fuelConsumption} MPG). Consider fuel-efficient driving habits or a more efficient vehicle to reduce costs.`
			)
		}
	} else {
		// L/100km (lower is better)
		if (fuelConsumption <= 7) {
			insights.push(
				`Your vehicle is fuel-efficient at ${fuelConsumption} L/100km. This helps keep fuel costs lower.`
			)
		} else if (fuelConsumption > 12) {
			insights.push(
				`Your vehicle has higher fuel consumption (${fuelConsumption} L/100km). Consider fuel-efficient driving habits or a more efficient vehicle to reduce costs.`
			)
		}
	}

	// Cost per distance insight
	if (costPerDistance > 0) {
		const distanceUnit = consumptionUnit === 'l/100km' ? 'km' : 'mile'
		insights.push(
			`Your fuel cost is ${currency}${costPerDistance.toFixed(3)} per ${distanceUnit}.`
		)
	}

	// Savings insight for better efficiency
	if (consumptionUnit === 'mpg') {
		const betterMPG = fuelConsumption + 5 // 5 MPG improvement
		const betterFuelUsedGallons = actualDistance / betterMPG
		const currentFuelUsedGallons = actualDistance / fuelConsumption
		const savings = (currentFuelUsedGallons - betterFuelUsedGallons) * fuelPricePerUnit
		if (savings > 0) {
			const periodText = periodType === 'trip' ? 'per trip' : periodType === 'monthly' ? 'per month' : 'per year'
			insights.push(
				`Improving fuel efficiency by 5 MPG could save approximately ${currency}${savings.toFixed(2)} ${periodText}.`
			)
		}
	} else {
			// L/100km (lower is better)
			const betterConsumption = Math.max(1, fuelConsumption - 2) // 2 L/100km improvement
			const betterFuelUsed = (actualDistance / 100) * betterConsumption
			const savings = (fuelUsed - betterFuelUsed) * fuelPricePerUnit
			if (savings > 0 && betterConsumption < fuelConsumption) {
				const periodText = periodType === 'trip' ? 'per trip' : periodType === 'monthly' ? 'per month' : 'per year'
				insights.push(
					`Improving fuel efficiency by 2 L/100km could save approximately ${currency}${savings.toFixed(2)} ${periodText}.`
				)
			}
		}

	// Period-specific insights
	if (periodType === 'monthly') {
		insights.push(
			`Your monthly fuel cost is ${currency}${fuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
		)
	} else if (periodType === 'yearly') {
		insights.push(
			`Your yearly fuel cost is ${currency}${fuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
		)
	}

	// Round all monetary values to 2 decimal places, fuel to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100
	const roundFuel = (value: number) => Math.round(value * 100) / 100

	return {
		fuelUsed: roundFuel(fuelUsed),
		fuelCost: round(fuelCost),
		costPerDistance: round(costPerDistance),
		totalFuelCost: totalFuelCost !== null ? round(totalFuelCost) : null,
		insights: insights.join(' '),
		actualDistance: round(actualDistance),
		consumptionUnit: consumptionUnit,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateFuelCost', calculateFuelCost)

