/**
 * Calculate total trip cost including fuel, tolls, parking, meals, and accommodation
 * Inputs: tripDistance, distanceUnit, roundTrip, fuelConsumption, consumptionUnit,
 *         fuelPricePerUnit, tolls, parking, meals, accommodationPerNight, nights,
 *         splitCost, passengersCount
 * Outputs: fuelCost, fuelUsed, tollsCost, parkingCost, mealsCost, accommodationCost,
 *          totalTripCost, costPerPerson, costPerDistance, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

// Conversion constants
const MILES_TO_KM = 1.609344
const GALLON_US_TO_LITERS = 3.785411784
const GALLON_UK_TO_LITERS = 4.54609

/**
 * Calculate total trip cost including fuel, tolls, parking, meals, and accommodation
 */
export const calculateTripCost: CalculationFunction = (inputs) => {
	// Extract and parse inputs
	const tripDistance = Number(inputs.tripDistance || 0)
	const distanceUnit = String(inputs.distanceUnit || 'km').toLowerCase()
	const roundTrip = inputs.roundTrip === true || inputs.roundTrip === 'true'
	const fuelConsumption = Number(inputs.fuelConsumption || 0)
	const consumptionUnit = String(inputs.consumptionUnit || 'L/100km').toLowerCase()
	const fuelPricePerUnit = Number(inputs.fuelPricePerUnit || 0)
	const tolls = Number(inputs.tolls || 0)
	const parking = Number(inputs.parking || 0)
	const meals = Number(inputs.meals || 0)
	const accommodationPerNight = Number(inputs.accommodationPerNight || 0)
	const nights = Math.floor(Number(inputs.nights || 0))
	const splitCost = inputs.splitCost === true || inputs.splitCost === 'true'
	const passengersCount = Math.floor(Number(inputs.passengersCount || 1))

	// Validation
	if (
		isNaN(tripDistance) ||
		isNaN(fuelConsumption) ||
		isNaN(fuelPricePerUnit) ||
		isNaN(tolls) ||
		isNaN(parking) ||
		isNaN(meals) ||
		isNaN(accommodationPerNight) ||
		isNaN(nights) ||
		isNaN(passengersCount) ||
		tripDistance <= 0 ||
		fuelConsumption <= 0 ||
		fuelPricePerUnit <= 0 ||
		tolls < 0 ||
		parking < 0 ||
		meals < 0 ||
		accommodationPerNight < 0 ||
		nights < 0 ||
		passengersCount < 1 ||
		!['km', 'miles'].includes(distanceUnit) ||
		!['l/100km', 'mpg us', 'mpg uk'].includes(consumptionUnit)
	) {
		return {
			fuelCost: null,
			fuelUsed: null,
			tollsCost: null,
			parkingCost: null,
			mealsCost: null,
			accommodationCost: null,
			totalTripCost: null,
			costPerPerson: null,
			costPerDistance: null,
			insights: null,
		}
	}

	// Calculate effective distance (accounting for round trip)
	const effectiveDistance = roundTrip ? tripDistance * 2 : tripDistance

	// Convert distance to km for calculations
	const distanceKm = distanceUnit === 'km' ? effectiveDistance : effectiveDistance * MILES_TO_KM

	// Calculate fuel used and fuel cost
	let fuelUsed: number
	let fuelCost: number

	if (consumptionUnit === 'l/100km') {
		// L/100km: fuel used = (distance / 100) * consumption (in liters)
		fuelUsed = (distanceKm / 100) * fuelConsumption
		// Fuel price is per liter
		fuelCost = fuelUsed * fuelPricePerUnit
	} else {
		// MPG: fuel used = distance / consumption (in gallons)
		const distanceMiles = distanceUnit === 'miles' ? effectiveDistance : effectiveDistance / MILES_TO_KM
		
		if (consumptionUnit === 'mpg us') {
			const fuelUsedGallons = distanceMiles / fuelConsumption
			fuelUsed = fuelUsedGallons * GALLON_US_TO_LITERS // Convert to liters for display
			fuelCost = fuelUsedGallons * fuelPricePerUnit // Price is per gallon
		} else {
			// MPG UK
			const fuelUsedGallons = distanceMiles / fuelConsumption
			fuelUsed = fuelUsedGallons * GALLON_UK_TO_LITERS // Convert to liters for display
			fuelCost = fuelUsedGallons * fuelPricePerUnit // Price is per gallon
		}
	}

	// Calculate accommodation cost
	const accommodationCost = accommodationPerNight * nights

	// Calculate total trip cost
	const totalTripCost = fuelCost + tolls + parking + meals + accommodationCost

	// Calculate cost per distance
	const costPerDistance = effectiveDistance > 0 ? totalTripCost / effectiveDistance : 0

	// Calculate cost per person if splitting
	const costPerPerson = splitCost && passengersCount > 1 ? totalTripCost / passengersCount : null

	// Generate insights
	const insights: string[] = []

	// Round trip insight
	if (roundTrip) {
		insights.push(
			`Round trip distance: ${effectiveDistance.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${distanceUnit}.`
		)
	}

	// Fuel percentage insight
	if (totalTripCost > 0) {
		const fuelPercentage = (fuelCost / totalTripCost) * 100
		insights.push(
			`Fuel costs represent ${fuelPercentage.toFixed(1)}% of your total trip cost.`
		)
	}

	// Cost breakdown insight
	if (totalTripCost > 0) {
		const breakdown: string[] = []
		if (fuelCost > 0) breakdown.push(`fuel (${((fuelCost / totalTripCost) * 100).toFixed(1)}%)`)
		if (tolls > 0) breakdown.push(`tolls (${((tolls / totalTripCost) * 100).toFixed(1)}%)`)
		if (parking > 0) breakdown.push(`parking (${((parking / totalTripCost) * 100).toFixed(1)}%)`)
		if (meals > 0) breakdown.push(`meals (${((meals / totalTripCost) * 100).toFixed(1)}%)`)
		if (accommodationCost > 0) breakdown.push(`accommodation (${((accommodationCost / totalTripCost) * 100).toFixed(1)}%)`)
		
		if (breakdown.length > 0) {
			insights.push(`Cost breakdown: ${breakdown.join(', ')}.`)
		}
	}

	// Cost per distance insight
	if (costPerDistance > 0) {
		const distanceUnitLabel = distanceUnit === 'km' ? 'km' : 'mile'
		insights.push(
			`Your trip costs approximately $${costPerDistance.toFixed(2)} per ${distanceUnitLabel}.`
		)
	}

	// Cost per person insight
	if (splitCost && passengersCount > 1 && costPerPerson !== null) {
		insights.push(
			`When split between ${passengersCount} people, each person pays $${costPerPerson.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
		)
	}

	// Accommodation insight
	if (accommodationCost > 0) {
		insights.push(
			`Accommodation for ${nights} night${nights > 1 ? 's' : ''} adds $${accommodationCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to your trip cost.`
		)
	}

	// Fuel efficiency tip
	if (fuelCost > 0 && totalTripCost > 0) {
		const fuelPercentage = (fuelCost / totalTripCost) * 100
		if (fuelPercentage > 50) {
			insights.push(
				`Fuel is your largest expense. Consider fuel-efficient driving habits or a more efficient vehicle to reduce costs.`
			)
		}
	}

	// Round all monetary values to 2 decimal places, fuel to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100
	const roundFuel = (value: number) => Math.round(value * 100) / 100

	return {
		fuelCost: round(fuelCost),
		fuelUsed: roundFuel(fuelUsed),
		tollsCost: round(tolls),
		parkingCost: round(parking),
		mealsCost: round(meals),
		accommodationCost: round(accommodationCost),
		totalTripCost: round(totalTripCost),
		costPerPerson: costPerPerson !== null ? round(costPerPerson) : null,
		costPerDistance: round(costPerDistance),
		insights: insights.join(' '),
		effectiveDistance: round(effectiveDistance),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateTripCost', calculateTripCost)



