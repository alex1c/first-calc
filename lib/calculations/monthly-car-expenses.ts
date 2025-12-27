/**
 * Calculate monthly car expenses with comprehensive breakdown
 * Inputs: insuranceMonthly, parkingMonthly, loanPaymentMonthly, registrationMonthly,
 *         fuelMonthly, fuelPrice, fuelConsumption, mileage, maintenanceMonthly,
 *         repairsMonthly, otherMonthly, useFuelCalculation
 * Outputs: totalFixedCosts, totalVariableCosts, totalMonthlyCost, costPerDay,
 *          costPerMile, breakdown, biggestExpense, insights
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Calculate monthly car expenses with comprehensive breakdown
 */
export const calculateMonthlyCarExpenses: CalculationFunction = (inputs) => {
	// Extract and parse inputs
	const insuranceMonthly = Number(inputs.insuranceMonthly || 0)
	const parkingMonthly = Number(inputs.parkingMonthly || 0)
	const loanPaymentMonthly = Number(inputs.loanPaymentMonthly || 0)
	const registrationMonthly = Number(inputs.registrationMonthly || 0)
	const fuelMonthly = Number(inputs.fuelMonthly || 0)
	const fuelPrice = Number(inputs.fuelPrice || 0)
	const fuelConsumption = Number(inputs.fuelConsumption || 0) // Units per 100 miles/km
	const mileage = Number(inputs.mileage || 0) // Monthly mileage
	const maintenanceMonthly = Number(inputs.maintenanceMonthly || 0)
	const repairsMonthly = Number(inputs.repairsMonthly || 0)
	const otherMonthly = Number(inputs.otherMonthly || 0)
	const useFuelCalculation = inputs.useFuelCalculation === true || (typeof inputs.useFuelCalculation === 'string' && inputs.useFuelCalculation.toLowerCase() === 'true') || inputs.useFuelCalculation === 'true'

	// Validation
	if (
		isNaN(insuranceMonthly) ||
		isNaN(parkingMonthly) ||
		isNaN(loanPaymentMonthly) ||
		isNaN(registrationMonthly) ||
		isNaN(fuelMonthly) ||
		isNaN(fuelPrice) ||
		isNaN(fuelConsumption) ||
		isNaN(mileage) ||
		isNaN(maintenanceMonthly) ||
		isNaN(repairsMonthly) ||
		isNaN(otherMonthly) ||
		insuranceMonthly < 0 ||
		parkingMonthly < 0 ||
		loanPaymentMonthly < 0 ||
		registrationMonthly < 0 ||
		fuelMonthly < 0 ||
		fuelPrice < 0 ||
		fuelConsumption < 0 ||
		mileage < 0 ||
		maintenanceMonthly < 0 ||
		repairsMonthly < 0 ||
		otherMonthly < 0
	) {
		return {
			totalFixedCosts: null,
			totalVariableCosts: null,
			totalMonthlyCost: null,
			costPerDay: null,
			costPerMile: null,
			breakdown: null,
			biggestExpense: null,
			insights: null,
		}
	}

	// Calculate fuel cost
	let totalFuelCost: number
	if (useFuelCalculation && fuelPrice > 0 && fuelConsumption > 0 && mileage > 0) {
		// Calculate from price, consumption, and mileage
		const fuelUnitsNeeded = (mileage / 100) * fuelConsumption
		totalFuelCost = fuelUnitsNeeded * fuelPrice
	} else {
		// Use direct monthly fuel cost
		totalFuelCost = fuelMonthly
	}

	// Calculate fixed costs (insurance, parking, loan, registration)
	const totalFixedCosts = insuranceMonthly + parkingMonthly + loanPaymentMonthly + registrationMonthly

	// Calculate variable costs (fuel, maintenance, repairs, other)
	const totalVariableCosts = totalFuelCost + maintenanceMonthly + repairsMonthly + otherMonthly

	// Calculate total monthly cost
	const totalMonthlyCost = totalFixedCosts + totalVariableCosts

	// Calculate cost per day (assuming 30 days per month)
	const costPerDay = totalMonthlyCost / 30

	// Calculate cost per mile (if mileage is provided)
	const costPerMile = mileage > 0 ? totalMonthlyCost / mileage : 0

	// Create breakdown object
	const breakdown = {
		fixed: {
			insurance: insuranceMonthly,
			parking: parkingMonthly,
			loan: loanPaymentMonthly,
			registration: registrationMonthly,
			total: totalFixedCosts,
		},
		variable: {
			fuel: totalFuelCost,
			maintenance: maintenanceMonthly,
			repairs: repairsMonthly,
			other: otherMonthly,
			total: totalVariableCosts,
		},
		total: totalMonthlyCost,
	}

	// Find biggest expense
	const expenseCategories = [
		{ name: 'Loan Payment', value: loanPaymentMonthly },
		{ name: 'Fuel', value: totalFuelCost },
		{ name: 'Insurance', value: insuranceMonthly },
		{ name: 'Maintenance', value: maintenanceMonthly },
		{ name: 'Repairs', value: repairsMonthly },
		{ name: 'Parking', value: parkingMonthly },
		{ name: 'Registration', value: registrationMonthly },
		{ name: 'Other', value: otherMonthly },
	]

	const biggestExpense = expenseCategories.reduce((max, category) =>
		category.value > max.value ? category : max
	, expenseCategories[0])

	// Generate insights
	const insights: string[] = []

	// Biggest expense insight
	if (biggestExpense.value > 0) {
		insights.push(
			`${biggestExpense.name} is your largest monthly expense at $${biggestExpense.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, accounting for ${((biggestExpense.value / totalMonthlyCost) * 100).toFixed(1)}% of your total monthly car costs.`
		)
	}

	// Fixed vs variable ratio
	if (totalMonthlyCost > 0) {
		const fixedPercentage = (totalFixedCosts / totalMonthlyCost) * 100
		const variablePercentage = (totalVariableCosts / totalMonthlyCost) * 100
		insights.push(
			`Your monthly costs are ${fixedPercentage.toFixed(1)}% fixed (insurance, loan, parking) and ${variablePercentage.toFixed(1)}% variable (fuel, maintenance, repairs).`
		)
	}

	// Fuel vs ownership ratio
	if (totalMonthlyCost > 0 && totalFuelCost > 0) {
		const fuelPercentage = (totalFuelCost / totalMonthlyCost) * 100
		if (fuelPercentage > 40) {
			insights.push(
				`Fuel costs represent ${fuelPercentage.toFixed(1)}% of your monthly expenses. Consider fuel-efficient driving habits or a more efficient vehicle to reduce costs.`
			)
		} else if (fuelPercentage < 20) {
			insights.push(
				`Fuel costs are relatively low at ${fuelPercentage.toFixed(1)}% of monthly expenses, suggesting you drive less or have an efficient vehicle.`
			)
		}
	}

	// Cost per day insight
	if (costPerDay > 0) {
		insights.push(
			`Your car costs approximately $${costPerDay.toFixed(2)} per day to own and operate.`
		)
	}

	// Cost per mile insight
	if (costPerMile > 0 && mileage > 0) {
		insights.push(
			`Each mile you drive costs approximately $${costPerMile.toFixed(2)}.`
		)
	}

	// Loan payment insight
	if (loanPaymentMonthly > 0 && totalMonthlyCost > 0) {
		const loanPercentage = (loanPaymentMonthly / totalMonthlyCost) * 100
		insights.push(
			`Your car loan payment represents ${loanPercentage.toFixed(1)}% of your monthly car expenses.`
		)
	}

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	return {
		totalFixedCosts: round(totalFixedCosts),
		totalVariableCosts: round(totalVariableCosts),
		totalMonthlyCost: round(totalMonthlyCost),
		costPerDay: round(costPerDay),
		costPerMile: round(costPerMile),
		breakdown: JSON.stringify(breakdown),
		biggestExpense: biggestExpense.name,
		insights: insights.join(' '),
		fuelCost: round(totalFuelCost),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateMonthlyCarExpenses', calculateMonthlyCarExpenses)



