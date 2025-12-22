/**
 * Calculate tire costs over time and per mile
 * Inputs: tirePricePerUnit, tiresCount, tireLifespanMilesKm, annualMileage,
 *         seasonalTiresToggle, mountingAndBalancingCost
 * Outputs: totalTireSetCost, yearsPerSet, annualTireCost, costPerMile,
 *          insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate tire costs over time and per mile
 */
export const calculateTireCost: CalculatorFunction = (inputs) => {
	// Extract and parse inputs
	const tirePricePerUnit = Number(inputs.tirePricePerUnit || 0)
	const tiresCount = Math.floor(Number(inputs.tiresCount || 4))
	const tireLifespanMilesKm = Number(inputs.tireLifespanMilesKm || 0)
	const annualMileage = Number(inputs.annualMileage || 0)
	const seasonalTiresToggle = inputs.seasonalTiresToggle === true || inputs.seasonalTiresToggle === 'true'
	const mountingAndBalancingCost = Number(inputs.mountingAndBalancingCost || 0)

	// Validation
	if (
		isNaN(tirePricePerUnit) ||
		isNaN(tiresCount) ||
		isNaN(tireLifespanMilesKm) ||
		isNaN(annualMileage) ||
		isNaN(mountingAndBalancingCost) ||
		tirePricePerUnit < 0 ||
		tiresCount < 1 ||
		tiresCount > 8 ||
		tireLifespanMilesKm <= 0 ||
		annualMileage < 0 ||
		mountingAndBalancingCost < 0
	) {
		return {
			totalTireSetCost: null,
			yearsPerSet: null,
			annualTireCost: null,
			costPerMile: null,
			insights: null,
		}
	}

	// Calculate total tire set cost
	const tireSetCost = tirePricePerUnit * tiresCount
	const totalTireSetCost = tireSetCost + mountingAndBalancingCost

	// Calculate years per set
	const yearsPerSet = annualMileage > 0 ? tireLifespanMilesKm / annualMileage : 0

	// Calculate annual tire cost
	let annualTireCost: number
	if (seasonalTiresToggle) {
		// Seasonal tires: need two sets (summer and winter)
		// Assume both sets have same price and lifespan for simplicity
		// User can enter combined cost or we calculate as 2x
		const seasonalSetCost = totalTireSetCost * 2
		annualTireCost = annualMileage > 0 ? seasonalSetCost / yearsPerSet : 0
	} else {
		// Single set of tires
		annualTireCost = annualMileage > 0 ? totalTireSetCost / yearsPerSet : 0
	}

	// Calculate cost per mile
	const costPerMile = annualMileage > 0 ? annualTireCost / annualMileage : 0

	// Generate insights
	const insights: string[] = []

	// Total cost insight
	insights.push(
		`A set of ${tiresCount} tires costs $${totalTireSetCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ($${tirePricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per tire${mountingAndBalancingCost > 0 ? ` plus $${mountingAndBalancingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for mounting/balancing` : ''}).`
	)

	// Lifespan insight
	if (yearsPerSet > 0) {
		insights.push(
			`At ${annualMileage.toLocaleString('en-US')} miles per year, your tires will last approximately ${yearsPerSet.toFixed(1)} year${yearsPerSet > 1 ? 's' : ''} (${tireLifespanMilesKm.toLocaleString('en-US')} miles total lifespan).`
		)
	}

	// Annual cost insight
	insights.push(
		`Your annual tire cost is approximately $${annualTireCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per year.`
	)

	// Cost per mile insight
	if (costPerMile > 0) {
		insights.push(
			`Tire cost per mile: $${costPerMile.toFixed(4)}. This means tires add $${(costPerMile * 100).toFixed(2)} to every 100 miles you drive.`
		)
	}

	// Seasonal tires insight
	if (seasonalTiresToggle) {
		insights.push(
			`With seasonal tires (summer and winter sets), your total tire investment is $${(totalTireSetCost * 2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. However, each set may last longer since they're only used part of the year.`
		)
	}

	// Premium vs budget insight
	if (tirePricePerUnit > 150) {
		insights.push(
			`Premium tires ($${tirePricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each) cost more upfront but often provide better performance, longer lifespan, and better fuel economy, potentially reducing cost per mile over time.`
		)
	} else if (tirePricePerUnit < 80) {
		insights.push(
			`Budget tires ($${tirePricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each) are cheaper upfront but may have shorter lifespan, less grip, and higher cost per mile if they wear out faster.`
		)
	}

	// High mileage insight
	if (annualMileage > 20000) {
		insights.push(
			`High annual mileage (${annualMileage.toLocaleString('en-US')} miles) means you'll replace tires more frequently (every ${yearsPerSet.toFixed(1)} years). Consider tires with longer warranties and higher mileage ratings.`
		)
	} else if (annualMileage > 0 && annualMileage < 8000) {
		insights.push(
			`Low annual mileage (${annualMileage.toLocaleString('en-US')} miles) means your tires may age out before wearing out. Check tire age (typically 6-10 years max) even if tread is good.`
		)
	}

	// Mounting and balancing insight
	if (mountingAndBalancingCost > 0) {
		const mountingPercentage = (mountingAndBalancingCost / totalTireSetCost) * 100
		insights.push(
			`Mounting and balancing costs ($${mountingAndBalancingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per set) represent ${mountingPercentage.toFixed(1)}% of your total tire cost.`
		)
	}

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	return {
		totalTireSetCost: round(totalTireSetCost),
		yearsPerSet: round(yearsPerSet),
		annualTireCost: round(annualTireCost),
		costPerMile: round(costPerMile),
		insights: insights.join(' '),
		tireSetCost: round(tireSetCost),
		seasonalTotalCost: seasonalTiresToggle ? round(totalTireSetCost * 2) : null,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateTireCost', calculateTireCost)


