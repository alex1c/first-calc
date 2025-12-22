/**
 * Calculate car cost of ownership with comprehensive breakdown
 * Inputs: purchasePrice, ownershipPeriodYears, annualMileage, insuranceAnnual, registrationAnnual,
 *         parkingMonthly, fuelCostPerUnit, fuelConsumption, maintenanceAnnual, repairsAnnual,
 *         expectedAnnualDepreciation, resaleValueEstimate
 * Outputs: totalFuelCost, totalMaintenanceCost, totalFixedCosts, depreciationCost, totalOwnershipCost,
 *          monthlyCost, annualCost, costPerMile, breakdown, biggestCostDriver, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate car cost of ownership with comprehensive breakdown
 */
export const calculateCarCostOfOwnership: CalculatorFunction = (inputs) => {
	// Extract and parse inputs
	const purchasePrice = Number(inputs.purchasePrice || 0)
	const ownershipPeriodYears = Math.floor(Number(inputs.ownershipPeriodYears || 1))
	const annualMileage = Number(inputs.annualMileage || 0)
	const insuranceAnnual = Number(inputs.insuranceAnnual || 0)
	const registrationAnnual = Number(inputs.registrationAnnual || 0)
	const parkingMonthly = Number(inputs.parkingMonthly || 0)
	const fuelCostPerUnit = Number(inputs.fuelCostPerUnit || 0)
	const fuelConsumption = Number(inputs.fuelConsumption || 0) // Units per 100 miles/km
	const maintenanceAnnual = Number(inputs.maintenanceAnnual || 0)
	const repairsAnnual = Number(inputs.repairsAnnual || 0)
	const expectedAnnualDepreciation = Number(inputs.expectedAnnualDepreciation || 0)
	const resaleValueEstimate = inputs.resaleValueEstimate !== undefined && inputs.resaleValueEstimate !== null
		? Number(inputs.resaleValueEstimate)
		: null

	// Validation
	if (
		isNaN(purchasePrice) ||
		isNaN(ownershipPeriodYears) ||
		isNaN(annualMileage) ||
		isNaN(insuranceAnnual) ||
		isNaN(registrationAnnual) ||
		isNaN(parkingMonthly) ||
		isNaN(fuelCostPerUnit) ||
		isNaN(fuelConsumption) ||
		isNaN(maintenanceAnnual) ||
		isNaN(repairsAnnual) ||
		isNaN(expectedAnnualDepreciation) ||
		purchasePrice <= 0 ||
		ownershipPeriodYears < 1 ||
		annualMileage < 0 ||
		insuranceAnnual < 0 ||
		registrationAnnual < 0 ||
		parkingMonthly < 0 ||
		fuelCostPerUnit < 0 ||
		fuelConsumption < 0 ||
		maintenanceAnnual < 0 ||
		repairsAnnual < 0 ||
		expectedAnnualDepreciation < 0 ||
		(resaleValueEstimate !== null && (isNaN(resaleValueEstimate) || resaleValueEstimate < 0 || resaleValueEstimate > purchasePrice))
	) {
		return {
			totalFuelCost: null,
			totalMaintenanceCost: null,
			totalFixedCosts: null,
			depreciationCost: null,
			totalOwnershipCost: null,
			monthlyCost: null,
			annualCost: null,
			costPerMile: null,
			breakdown: null,
			biggestCostDriver: null,
			insights: null,
		}
	}

	// Calculate total fuel cost over ownership period
	// fuelConsumption is per 100 miles/km, so we need to convert
	const totalMiles = annualMileage * ownershipPeriodYears
	const fuelUnitsNeeded = (totalMiles / 100) * fuelConsumption
	const totalFuelCost = fuelUnitsNeeded * fuelCostPerUnit

	// Calculate total maintenance and repairs
	const totalMaintenanceCost = maintenanceAnnual * ownershipPeriodYears
	const totalRepairsCost = repairsAnnual * ownershipPeriodYears
	const totalMaintenanceAndRepairs = totalMaintenanceCost + totalRepairsCost

	// Calculate total fixed costs (insurance, registration, parking)
	const totalInsuranceCost = insuranceAnnual * ownershipPeriodYears
	const totalRegistrationCost = registrationAnnual * ownershipPeriodYears
	const totalParkingCost = parkingMonthly * 12 * ownershipPeriodYears
	const totalFixedCosts = totalInsuranceCost + totalRegistrationCost + totalParkingCost

	// Calculate depreciation
	let depreciationCost: number
	let resaleValue: number

	if (resaleValueEstimate !== null) {
		// Use provided resale value estimate
		resaleValue = resaleValueEstimate
		depreciationCost = purchasePrice - resaleValue
	} else {
		// Calculate depreciation based on annual percentage
		// Compound depreciation: value decreases by percentage each year
		const annualDepreciationRate = expectedAnnualDepreciation / 100
		resaleValue = purchasePrice * Math.pow(1 - annualDepreciationRate, ownershipPeriodYears)
		depreciationCost = purchasePrice - resaleValue
	}

	// Ensure depreciation is not negative
	if (depreciationCost < 0) {
		depreciationCost = 0
		resaleValue = purchasePrice
	}

	// Calculate total ownership cost
	const totalOwnershipCost = totalFuelCost + totalMaintenanceAndRepairs + totalFixedCosts + depreciationCost

	// Calculate monthly and annual costs
	const monthlyCost = totalOwnershipCost / (ownershipPeriodYears * 12)
	const annualCost = totalOwnershipCost / ownershipPeriodYears

	// Calculate cost per mile
	const costPerMile = totalMiles > 0 ? totalOwnershipCost / totalMiles : 0

	// Create breakdown object
	const breakdown = {
		fuel: totalFuelCost,
		maintenance: totalMaintenanceAndRepairs,
		insurance: totalInsuranceCost,
		registration: totalRegistrationCost,
		parking: totalParkingCost,
		depreciation: depreciationCost,
		other: totalRegistrationCost + totalParkingCost, // Other fixed costs
	}

	// Find biggest cost driver
	const costCategories = [
		{ name: 'Depreciation', value: depreciationCost },
		{ name: 'Fuel', value: totalFuelCost },
		{ name: 'Maintenance & Repairs', value: totalMaintenanceAndRepairs },
		{ name: 'Insurance', value: totalInsuranceCost },
		{ name: 'Parking', value: totalParkingCost },
		{ name: 'Registration', value: totalRegistrationCost },
	]

	const biggestCostDriver = costCategories.reduce((max, category) =>
		category.value > max.value ? category : max
	, costCategories[0])

	// Generate insights
	const insights: string[] = []

	// Biggest cost driver insight
	insights.push(
		`${biggestCostDriver.name} is your biggest expense, accounting for ${((biggestCostDriver.value / totalOwnershipCost) * 100).toFixed(1)}% of total ownership costs.`
	)

	// Cost per mile insight
	if (costPerMile > 0) {
		insights.push(
			`Your cost per mile is $${costPerMile.toFixed(2)}, meaning every mile you drive costs approximately this amount.`
		)
	}

	// Depreciation insight
	if (depreciationCost > 0) {
		const depreciationPercentage = (depreciationCost / purchasePrice) * 100
		insights.push(
			`Your car will lose $${depreciationCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in value (${depreciationPercentage.toFixed(1)}% of purchase price) over ${ownershipPeriodYears} year${ownershipPeriodYears > 1 ? 's' : ''}.`
		)
	}

	// Fuel cost insight
	if (totalFuelCost > 0 && totalOwnershipCost > 0) {
		const fuelPercentage = (totalFuelCost / totalOwnershipCost) * 100
		if (fuelPercentage > 30) {
			insights.push(
				`Fuel costs represent ${fuelPercentage.toFixed(1)}% of your total ownership cost. Consider fuel-efficient vehicles or alternative transportation for high-mileage drivers.`
			)
		}
	}

	// Ownership period insight
	if (ownershipPeriodYears >= 5) {
		insights.push(
			`Owning a car for ${ownershipPeriodYears} years helps spread the depreciation cost over a longer period, reducing your annual cost.`
		)
	}

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	return {
		totalFuelCost: round(totalFuelCost),
		totalMaintenanceCost: round(totalMaintenanceAndRepairs),
		totalFixedCosts: round(totalFixedCosts),
		depreciationCost: round(depreciationCost),
		totalOwnershipCost: round(totalOwnershipCost),
		monthlyCost: round(monthlyCost),
		annualCost: round(annualCost),
		costPerMile: round(costPerMile),
		breakdown: JSON.stringify(breakdown),
		biggestCostDriver: biggestCostDriver.name,
		insights: insights.join(' '),
		resaleValue: round(resaleValue),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCarCostOfOwnership', calculateCarCostOfOwnership)

