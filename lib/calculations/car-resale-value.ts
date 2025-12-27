/**
 * Estimate car resale value after a number of years
 * Inputs: currentCarValue, yearsUntilSale, condition, annualMileage,
 *         baselineDepreciationRate, purchaseType, mileageImpactToggle,
 *         mileageBaselinePerYear, mileagePenaltyPerExtraUnit
 * Outputs: estimatedResaleValue, valueLossAmount, valueLossPercent,
 *          yearByYearTable, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Estimate car resale value after a number of years
 */
export const calculateCarResaleValue: CalculationFunction = (inputs) => {
	// Extract and parse inputs
	const currentCarValue = Number(inputs.currentCarValue || inputs.purchasePrice || 0)
	const yearsUntilSale = Math.floor(Number(inputs.yearsUntilSale || 1))
	const condition = String(inputs.condition || 'good').toLowerCase()
	const annualMileage = Number(inputs.annualMileage || 0)
	const baselineDepreciationRate = Number(inputs.baselineDepreciationRate || 0)
	const purchaseType = String(inputs.purchaseType || 'used').toLowerCase()
	const mileageImpactToggle = inputs.mileageImpactToggle === true || (typeof inputs.mileageImpactToggle === 'string' && inputs.mileageImpactToggle.toLowerCase() === 'true') || inputs.mileageImpactToggle === 'true'
	const mileageBaselinePerYear = Number(inputs.mileageBaselinePerYear || 12000)
	const mileagePenaltyPerExtraUnit = Number(inputs.mileagePenaltyPerExtraUnit || 0.01)

	// Set default depreciation rate if not provided
	let effectiveDepreciationRate = baselineDepreciationRate
	if (effectiveDepreciationRate === 0) {
		effectiveDepreciationRate = purchaseType === 'new' ? 18 : 12
	}

	// Validation
	if (
		isNaN(currentCarValue) ||
		isNaN(yearsUntilSale) ||
		isNaN(annualMileage) ||
		isNaN(effectiveDepreciationRate) ||
		isNaN(mileageBaselinePerYear) ||
		isNaN(mileagePenaltyPerExtraUnit) ||
		currentCarValue <= 0 ||
		yearsUntilSale < 1 ||
		yearsUntilSale > 15 ||
		annualMileage < 0 ||
		effectiveDepreciationRate < 0 ||
		effectiveDepreciationRate > 40 ||
		mileageBaselinePerYear < 0 ||
		mileagePenaltyPerExtraUnit < 0 ||
		!['excellent', 'good', 'fair', 'poor'].includes(condition) ||
		!['new', 'used'].includes(purchaseType)
	) {
		return {
			estimatedResaleValue: null,
			valueLossAmount: null,
			valueLossPercent: null,
			yearByYearTable: null,
			insights: null,
		}
	}

	// Calculate base resale value using compound depreciation
	let estimatedResaleValue = currentCarValue * Math.pow(1 - effectiveDepreciationRate / 100, yearsUntilSale)

	// Apply condition adjustment
	let conditionMultiplier = 1.0
	if (condition === 'excellent') {
		conditionMultiplier = 1.05 // +5%
	} else if (condition === 'good') {
		conditionMultiplier = 1.0 // No change
	} else if (condition === 'fair') {
		conditionMultiplier = 0.93 // -7%
	} else if (condition === 'poor') {
		conditionMultiplier = 0.85 // -15%
	}

	estimatedResaleValue = estimatedResaleValue * conditionMultiplier

	// Apply mileage impact if enabled
	if (mileageImpactToggle && annualMileage > 0 && mileageBaselinePerYear > 0) {
		const totalMileage = annualMileage * yearsUntilSale
		const baselineTotalMileage = mileageBaselinePerYear * yearsUntilSale
		const excessMileage = Math.max(0, totalMileage - baselineTotalMileage)
		
		// Calculate mileage penalty as percentage reduction
		// For every block of excess mileage, reduce value by penalty percentage
		const mileageBlocks = Math.floor(excessMileage / 1000) // Per 1000 miles/km
		const mileagePenaltyPercent = mileageBlocks * mileagePenaltyPerExtraUnit
		
		// Apply penalty (reduce value)
		estimatedResaleValue = estimatedResaleValue * (1 - mileagePenaltyPercent / 100)
	}

	// Ensure resale value is not negative
	estimatedResaleValue = Math.max(0, estimatedResaleValue)

	// Calculate value loss
	const valueLossAmount = currentCarValue - estimatedResaleValue
	const valueLossPercent = (valueLossAmount / currentCarValue) * 100

	// Generate year-by-year table
	const yearByYearTable: Array<{ year: number; value: number; loss: number }> = []
	for (let year = 0; year <= yearsUntilSale; year++) {
		let yearValue = currentCarValue * Math.pow(1 - effectiveDepreciationRate / 100, year)
		yearValue = yearValue * conditionMultiplier
		
		// Apply mileage impact for this year if enabled
		if (mileageImpactToggle && annualMileage > 0 && mileageBaselinePerYear > 0 && year > 0) {
			const yearMileage = annualMileage * year
			const baselineYearMileage = mileageBaselinePerYear * year
			const excessMileage = Math.max(0, yearMileage - baselineYearMileage)
			const mileageBlocks = Math.floor(excessMileage / 1000)
			const mileagePenaltyPercent = mileageBlocks * mileagePenaltyPerExtraUnit
			yearValue = yearValue * (1 - mileagePenaltyPercent / 100)
		}
		
		yearValue = Math.max(0, yearValue)
		const loss = currentCarValue - yearValue
		yearByYearTable.push({ year, value: yearValue, loss })
	}

	// Generate insights
	const insights: string[] = []

	// Value loss insight
	insights.push(
		`Your car will lose $${valueLossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${valueLossPercent.toFixed(1)}%) in value over ${yearsUntilSale} year${yearsUntilSale > 1 ? 's' : ''}.`
	)

	// Average loss per year
	const averageLossPerYear = valueLossAmount / yearsUntilSale
	insights.push(
		`Average value loss: $${averageLossPerYear.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per year.`
	)

	// Condition impact
	if (condition !== 'good') {
		const conditionImpact = condition === 'excellent' ? 'increases' : 'reduces'
		const conditionAmount = Math.abs(estimatedResaleValue - (currentCarValue * Math.pow(1 - effectiveDepreciationRate / 100, yearsUntilSale)))
		insights.push(
			`${condition.charAt(0).toUpperCase() + condition.slice(1)} condition ${conditionImpact} your resale value by approximately $${conditionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
		)
	}

	// Mileage impact
	if (mileageImpactToggle && annualMileage > 0) {
		if (annualMileage > mileageBaselinePerYear) {
			const excessMileage = (annualMileage - mileageBaselinePerYear) * yearsUntilSale
			insights.push(
				`High mileage (${annualMileage.toLocaleString('en-US')} miles/year, ${excessMileage.toLocaleString('en-US')} excess over ${yearsUntilSale} years) will reduce your resale value.`
			)
		} else {
			insights.push(
				`Your mileage (${annualMileage.toLocaleString('en-US')} miles/year) is within normal limits and won't significantly impact resale value.`
			)
		}
	}

	// Depreciation rate insight
	insights.push(
		`Using ${effectiveDepreciationRate}% annual depreciation rate (${purchaseType === 'new' ? 'typical for new cars' : 'typical for used cars'}).`
	)

	// Assumptions transparency
	insights.push(
		`Note: Actual resale value depends on market conditions, brand reputation, model popularity, and specific vehicle history. This is an estimate based on general depreciation patterns.`
	)

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	// Format year-by-year table
	const formattedTable = yearByYearTable.map(entry => ({
		year: entry.year,
		value: round(entry.value),
		loss: round(entry.loss),
	}))

	return {
		estimatedResaleValue: round(estimatedResaleValue),
		valueLossAmount: round(valueLossAmount),
		valueLossPercent: round(valueLossPercent),
		yearByYearTable: JSON.stringify(formattedTable),
		insights: insights.join(' '),
		averageLossPerYear: round(averageLossPerYear),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCarResaleValue', calculateCarResaleValue)



