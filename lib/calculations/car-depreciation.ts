/**
 * Calculate car depreciation and resale value over time
 * Inputs: purchasePrice, purchaseType, yearsOwned, depreciationModel,
 *         annualDepreciationRate, firstYearDropRate, mileagePerYear, mileageImpact
 * Outputs: estimatedResaleValue, totalDepreciationAmount, depreciationPerYearAvg,
 *          depreciationPercentTotal, yearByYearTable, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate car depreciation and resale value over time
 */
export const calculateCarDepreciation: CalculatorFunction = (inputs) => {
	// Extract and parse inputs
	const purchasePrice = Number(inputs.purchasePrice || 0)
	const purchaseType = String(inputs.purchaseType || 'new').toLowerCase()
	const yearsOwned = Math.floor(Number(inputs.yearsOwned || 1))
	const depreciationModel = String(inputs.depreciationModel || 'simpleAnnualPercent').toLowerCase()
	const annualDepreciationRate = Number(inputs.annualDepreciationRate || 0)
	const firstYearDropRate = Number(inputs.firstYearDropRate || 0)
	const mileagePerYear = Number(inputs.mileagePerYear || 0)
	const mileageImpact = inputs.mileageImpact === true || inputs.mileageImpact === 'true'
	const fixedResaleValue = inputs.fixedResaleValue !== undefined && inputs.fixedResaleValue !== null
		? Number(inputs.fixedResaleValue)
		: null

	// Set default first year drop rate if not provided
	let effectiveFirstYearDrop = firstYearDropRate
	if (effectiveFirstYearDrop === 0 && purchaseType === 'new') {
		effectiveFirstYearDrop = 20 // Default 20% for new cars
	} else if (effectiveFirstYearDrop === 0 && purchaseType === 'used') {
		effectiveFirstYearDrop = 10 // Default 10% for used cars
	}

	// Validation
	if (
		isNaN(purchasePrice) ||
		isNaN(yearsOwned) ||
		isNaN(annualDepreciationRate) ||
		isNaN(effectiveFirstYearDrop) ||
		isNaN(mileagePerYear) ||
		purchasePrice <= 0 ||
		yearsOwned < 1 ||
		annualDepreciationRate < 0 ||
		effectiveFirstYearDrop < 0 ||
		mileagePerYear < 0 ||
		!['new', 'used'].includes(purchaseType) ||
		!['simpleannualpercent', 'firstyeardropplusannual', 'fixedresalevalue'].includes(depreciationModel) ||
		(fixedResaleValue !== null && (isNaN(fixedResaleValue) || fixedResaleValue < 0 || fixedResaleValue > purchasePrice))
	) {
		return {
			estimatedResaleValue: null,
			totalDepreciationAmount: null,
			depreciationPerYearAvg: null,
			depreciationPercentTotal: null,
			yearByYearTable: null,
			insights: null,
		}
	}

	let estimatedResaleValue: number
	let yearByYearTable: Array<{ year: number; value: number; depreciation: number }> = []

	if (depreciationModel === 'fixedresalevalue' && fixedResaleValue !== null) {
		// Model 3: Fixed resale value override
		estimatedResaleValue = fixedResaleValue
		
		// Generate year-by-year table (linear interpolation for display)
		for (let year = 0; year <= yearsOwned; year++) {
			const value = purchasePrice - ((purchasePrice - fixedResaleValue) * (year / yearsOwned))
			const depreciation = year === 0 ? 0 : purchasePrice - value
			yearByYearTable.push({ year, value, depreciation })
		}
	} else if (depreciationModel === 'firstyeardropplusannual') {
		// Model 2: First year drop plus annual
		// First year: apply first year drop
		const valueAfterFirstYear = purchasePrice * (1 - effectiveFirstYearDrop / 100)
		
		// Subsequent years: apply annual rate
		if (yearsOwned === 1) {
			estimatedResaleValue = valueAfterFirstYear
		} else {
			const remainingYears = yearsOwned - 1
			estimatedResaleValue = valueAfterFirstYear * Math.pow(1 - annualDepreciationRate / 100, remainingYears)
		}

		// Generate year-by-year table
		yearByYearTable.push({ year: 0, value: purchasePrice, depreciation: 0 })
		let currentValue = purchasePrice
		
		for (let year = 1; year <= yearsOwned; year++) {
			if (year === 1) {
				currentValue = purchasePrice * (1 - effectiveFirstYearDrop / 100)
			} else {
				currentValue = currentValue * (1 - annualDepreciationRate / 100)
			}
			const depreciation = purchasePrice - currentValue
			yearByYearTable.push({ year, value: currentValue, depreciation })
		}
	} else {
		// Model 1: Simple annual percent
		estimatedResaleValue = purchasePrice * Math.pow(1 - annualDepreciationRate / 100, yearsOwned)

		// Generate year-by-year table
		for (let year = 0; year <= yearsOwned; year++) {
			const value = purchasePrice * Math.pow(1 - annualDepreciationRate / 100, year)
			const depreciation = purchasePrice - value
			yearByYearTable.push({ year, value, depreciation })
		}
	}

	// Apply mileage impact if enabled
	if (mileageImpact && mileagePerYear > 0) {
		// Simple mileage impact: high mileage reduces value
		// Typical: 10,000-12,000 miles/year is average
		// Above average mileage reduces value by ~$0.10-0.15 per mile over average
		const averageMileagePerYear = 12000 // miles
		const totalMileage = mileagePerYear * yearsOwned
		const averageTotalMileage = averageMileagePerYear * yearsOwned
		const excessMileage = Math.max(0, totalMileage - averageTotalMileage)
		
		// Reduce value by $0.12 per excess mile (simplified model)
		const mileagePenalty = excessMileage * 0.12
		estimatedResaleValue = Math.max(0, estimatedResaleValue - mileagePenalty)
		
		// Update final year in table
		if (yearByYearTable.length > 0) {
			const lastEntry = yearByYearTable[yearByYearTable.length - 1]
			lastEntry.value = estimatedResaleValue
			lastEntry.depreciation = purchasePrice - estimatedResaleValue
		}
	}

	// Ensure resale value is not negative
	estimatedResaleValue = Math.max(0, estimatedResaleValue)

	// Calculate total depreciation
	const totalDepreciationAmount = purchasePrice - estimatedResaleValue
	const depreciationPercentTotal = (totalDepreciationAmount / purchasePrice) * 100
	const depreciationPerYearAvg = totalDepreciationAmount / yearsOwned

	// Generate insights
	const insights: string[] = []

	// Depreciation percentage insight
	insights.push(
		`Your car will lose ${depreciationPercentTotal.toFixed(1)}% of its value ($${totalDepreciationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) over ${yearsOwned} year${yearsOwned > 1 ? 's' : ''}.`
	)

	// Average per year insight
	insights.push(
		`Average depreciation: $${depreciationPerYearAvg.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per year.`
	)

	// New vs used insight
	if (purchaseType === 'new' && depreciationModel === 'firstyeardropplusannual') {
		insights.push(
			`New cars typically lose ${effectiveFirstYearDrop}% of their value in the first year, then depreciate at ${annualDepreciationRate}% annually. This is why depreciation is often the largest cost of car ownership.`
		)
	} else if (purchaseType === 'used') {
		insights.push(
			`Used cars generally depreciate slower than new cars since most of the initial value loss has already occurred.`
		)
	}

	// Mileage insight
	if (mileageImpact && mileagePerYear > 0) {
		const averageMileage = 12000
		if (mileagePerYear > averageMileage) {
			insights.push(
				`High mileage (${mileagePerYear.toLocaleString('en-US')} miles/year) will further reduce your car's resale value.`
			)
		}
	}

	// Model-specific insights
	if (depreciationModel === 'firstyeardropplusannual') {
		insights.push(
			`Using the first-year drop model: ${effectiveFirstYearDrop}% drop in year 1, then ${annualDepreciationRate}% annually.`
		)
	}

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	// Format year-by-year table
	const formattedTable = yearByYearTable.map(entry => ({
		year: entry.year,
		value: round(entry.value),
		depreciation: round(entry.depreciation),
	}))

	return {
		estimatedResaleValue: round(estimatedResaleValue),
		totalDepreciationAmount: round(totalDepreciationAmount),
		depreciationPerYearAvg: round(depreciationPerYearAvg),
		depreciationPercentTotal: round(depreciationPercentTotal),
		yearByYearTable: JSON.stringify(formattedTable),
		insights: insights.join(' '),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCarDepreciation', calculateCarDepreciation)

