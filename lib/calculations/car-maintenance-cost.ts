/**
 * Calculate car maintenance costs per year and per month
 * Inputs: annualMileage, vehicleAgeYears, oilChangeCost, oilChangesPerYear,
 *         tireServiceAnnual, brakeServiceAnnual, scheduledServiceAnnual,
 *         unexpectedRepairsAnnual, vehiclePreset
 * Outputs: totalAnnualMaintenanceCost, monthlyMaintenanceCost, costPerMile,
 *          breakdown, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Calculate car maintenance costs per year and per month
 */
export const calculateCarMaintenanceCost: CalculationFunction = (inputs) => {
	// Extract and parse inputs
	const annualMileage = Number(inputs.annualMileage || 0)
	const vehicleAgeYears = Math.floor(Number(inputs.vehicleAgeYears || 0))
	const oilChangeCost = Number(inputs.oilChangeCost || 0)
	const oilChangesPerYear = Number(inputs.oilChangesPerYear || 0)
	const tireServiceAnnual = Number(inputs.tireServiceAnnual || 0)
	const brakeServiceAnnual = Number(inputs.brakeServiceAnnual || 0)
	const scheduledServiceAnnual = Number(inputs.scheduledServiceAnnual || 0)
	const unexpectedRepairsAnnual = Number(inputs.unexpectedRepairsAnnual || 0)
	const vehiclePreset = String(inputs.vehiclePreset || '').toLowerCase()

	// Apply presets if selected (prefill values, but user can still edit)
	// This is handled in the UI, but we validate here
	let effectiveOilChangeCost = oilChangeCost
	let effectiveOilChangesPerYear = oilChangesPerYear
	let effectiveTireServiceAnnual = tireServiceAnnual
	let effectiveBrakeServiceAnnual = brakeServiceAnnual
	let effectiveScheduledServiceAnnual = scheduledServiceAnnual
	let effectiveUnexpectedRepairsAnnual = unexpectedRepairsAnnual

	if (vehiclePreset === 'economycar') {
		// Economy car defaults (if not provided)
		if (effectiveOilChangeCost === 0) effectiveOilChangeCost = 40
		if (effectiveOilChangesPerYear === 0) effectiveOilChangesPerYear = 2
		if (effectiveTireServiceAnnual === 0) effectiveTireServiceAnnual = 200
		if (effectiveBrakeServiceAnnual === 0) effectiveBrakeServiceAnnual = 150
		if (effectiveScheduledServiceAnnual === 0) effectiveScheduledServiceAnnual = 300
		if (effectiveUnexpectedRepairsAnnual === 0) effectiveUnexpectedRepairsAnnual = 400
	} else if (vehiclePreset === 'midrangecar') {
		// Mid-range car defaults
		if (effectiveOilChangeCost === 0) effectiveOilChangeCost = 60
		if (effectiveOilChangesPerYear === 0) effectiveOilChangesPerYear = 2
		if (effectiveTireServiceAnnual === 0) effectiveTireServiceAnnual = 300
		if (effectiveBrakeServiceAnnual === 0) effectiveBrakeServiceAnnual = 250
		if (effectiveScheduledServiceAnnual === 0) effectiveScheduledServiceAnnual = 500
		if (effectiveUnexpectedRepairsAnnual === 0) effectiveUnexpectedRepairsAnnual = 600
	} else if (vehiclePreset === 'premiumcar') {
		// Premium car defaults
		if (effectiveOilChangeCost === 0) effectiveOilChangeCost = 100
		if (effectiveOilChangesPerYear === 0) effectiveOilChangesPerYear = 2
		if (effectiveTireServiceAnnual === 0) effectiveTireServiceAnnual = 500
		if (effectiveBrakeServiceAnnual === 0) effectiveBrakeServiceAnnual = 400
		if (effectiveScheduledServiceAnnual === 0) effectiveScheduledServiceAnnual = 800
		if (effectiveUnexpectedRepairsAnnual === 0) effectiveUnexpectedRepairsAnnual = 1000
	}

	// Validation
	if (
		isNaN(annualMileage) ||
		isNaN(vehicleAgeYears) ||
		isNaN(effectiveOilChangeCost) ||
		isNaN(effectiveOilChangesPerYear) ||
		isNaN(effectiveTireServiceAnnual) ||
		isNaN(effectiveBrakeServiceAnnual) ||
		isNaN(effectiveScheduledServiceAnnual) ||
		isNaN(effectiveUnexpectedRepairsAnnual) ||
		annualMileage < 0 ||
		vehicleAgeYears < 0 ||
		effectiveOilChangeCost < 0 ||
		effectiveOilChangesPerYear < 0 ||
		effectiveBrakeServiceAnnual < 0 ||
		effectiveTireServiceAnnual < 0 ||
		effectiveScheduledServiceAnnual < 0 ||
		effectiveUnexpectedRepairsAnnual < 0
	) {
		return {
			totalAnnualMaintenanceCost: null,
			monthlyMaintenanceCost: null,
			costPerMile: null,
			breakdown: null,
			insights: null,
		}
	}

	// Calculate routine maintenance costs
	const oilChangeAnnual = effectiveOilChangeCost * effectiveOilChangesPerYear
	const routineMaintenanceAnnual = oilChangeAnnual + effectiveTireServiceAnnual + effectiveBrakeServiceAnnual + effectiveScheduledServiceAnnual

	// Apply age multiplier for unexpected repairs (older cars have more issues)
	let ageMultiplier = 1.0
	if (vehicleAgeYears > 0) {
		if (vehicleAgeYears <= 3) {
			ageMultiplier = 1.0 // New cars, minimal unexpected repairs
		} else if (vehicleAgeYears <= 5) {
			ageMultiplier = 1.2 // Slightly more issues
		} else if (vehicleAgeYears <= 8) {
			ageMultiplier = 1.5 // More frequent issues
		} else {
			ageMultiplier = 2.0 // Older cars, significantly more repairs
		}
	}

	const adjustedUnexpectedRepairsAnnual = effectiveUnexpectedRepairsAnnual * ageMultiplier

	// Calculate total annual maintenance cost
	const totalAnnualMaintenanceCost = routineMaintenanceAnnual + adjustedUnexpectedRepairsAnnual

	// Calculate monthly cost
	const monthlyMaintenanceCost = totalAnnualMaintenanceCost / 12

	// Calculate cost per mile
	const costPerMile = annualMileage > 0 ? totalAnnualMaintenanceCost / annualMileage : 0

	// Create breakdown
	const breakdown = {
		routine: {
			oilChanges: oilChangeAnnual,
			tireService: effectiveTireServiceAnnual,
			brakeService: effectiveBrakeServiceAnnual,
			scheduledService: effectiveScheduledServiceAnnual,
			total: routineMaintenanceAnnual,
		},
		unexpected: {
			base: effectiveUnexpectedRepairsAnnual,
			ageMultiplier: ageMultiplier,
			adjusted: adjustedUnexpectedRepairsAnnual,
		},
		total: totalAnnualMaintenanceCost,
	}

	// Generate insights
	const insights: string[] = []

	// Routine vs unexpected insight
	if (totalAnnualMaintenanceCost > 0) {
		const routinePercentage = (routineMaintenanceAnnual / totalAnnualMaintenanceCost) * 100
		const unexpectedPercentage = (adjustedUnexpectedRepairsAnnual / totalAnnualMaintenanceCost) * 100
		insights.push(
			`Your maintenance costs are ${routinePercentage.toFixed(1)}% routine services and ${unexpectedPercentage.toFixed(1)}% unexpected repairs.`
		)
	}

	// Age impact insight
	if (vehicleAgeYears > 5 && ageMultiplier > 1.0) {
		insights.push(
			`Your ${vehicleAgeYears}-year-old vehicle requires ${((ageMultiplier - 1) * 100).toFixed(0)}% more in unexpected repairs compared to newer vehicles. Older cars typically have higher maintenance costs.`
		)
	} else if (vehicleAgeYears <= 3) {
		insights.push(
			`Your newer vehicle (${vehicleAgeYears} year${vehicleAgeYears > 1 ? 's' : ''} old) should have lower unexpected repair costs while under warranty.`
		)
	}

	// Cost per mile insight
	if (costPerMile > 0) {
		insights.push(
			`Your maintenance cost is $${costPerMile.toFixed(3)} per mile. Higher mileage increases maintenance frequency and costs.`
		)
	}

	// Monthly budgeting insight
	insights.push(
		`Budget approximately $${monthlyMaintenanceCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month for maintenance to avoid unexpected financial stress.`
	)

	// Mileage insight
	if (annualMileage > 15000) {
		insights.push(
			`High annual mileage (${annualMileage.toLocaleString('en-US')} miles) increases maintenance frequency. You may need more frequent oil changes, tire replacements, and brake service.`
		)
	} else if (annualMileage > 0 && annualMileage < 8000) {
		insights.push(
			`Low annual mileage (${annualMileage.toLocaleString('en-US')} miles) may reduce some maintenance costs, but don't skip scheduled services based on time intervals.`
		)
	}

	// Maintenance vs depreciation insight
	insights.push(
		`While maintenance costs are significant, they're typically much smaller than depreciation. However, maintenance is unavoidable and essential for vehicle reliability and safety.`
	)

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	return {
		totalAnnualMaintenanceCost: round(totalAnnualMaintenanceCost),
		monthlyMaintenanceCost: round(monthlyMaintenanceCost),
		costPerMile: round(costPerMile),
		breakdown: JSON.stringify(breakdown),
		insights: insights.join(' '),
		routineMaintenanceAnnual: round(routineMaintenanceAnnual),
		unexpectedRepairsAnnual: round(adjustedUnexpectedRepairsAnnual),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCarMaintenanceCost', calculateCarMaintenanceCost)



