/**
 * Test script for auto calculators
 * Tests all newly created auto calculators
 */

import { calculateCarCostOfOwnership } from '../lib/calculations/car-cost-of-ownership'
import { calculateMonthlyCarExpenses } from '../lib/calculations/monthly-car-expenses'
import { calculateFuelCost } from '../lib/calculations/fuel-cost'
import { calculateFuelConsumption } from '../lib/calculations/fuel-consumption'
import { calculateTripCost } from '../lib/calculations/trip-cost'
import { calculateCarDepreciation } from '../lib/calculations/car-depreciation'
import { calculateLeaseVsBuy } from '../lib/calculations/lease-vs-buy'
import { calculateCarAffordability } from '../lib/calculations/car-affordability'
import { calculateCarResaleValue } from '../lib/calculations/car-resale-value'
import { calculateCarMaintenanceCost } from '../lib/calculations/car-maintenance-cost'
import { calculateTireCost } from '../lib/calculations/tire-cost'

interface TestResult {
	name: string
	passed: boolean
	error?: string
	result?: any
}

function testCalculator(
	name: string,
	fn: (inputs: Record<string, string | number>) => Record<string, string | number>,
	testInputs: Record<string, string | number>,
	requiredFields?: string[]
): TestResult {
	try {
		const result = fn(testInputs)
		
		// Check if all required fields are present and not null
		if (requiredFields) {
			for (const field of requiredFields) {
				if (!(field in result) || result[field] === null) {
					return {
						name,
						passed: false,
						error: `Required field '${field}' is missing or null`,
						result
					}
				}
			}
		} else {
			// Check if all result values are null (complete failure)
			const allNulls = Object.values(result).every(v => v === null)
			if (allNulls) {
				return {
					name,
					passed: false,
					error: 'All result values are null (validation failed)',
					result
				}
			}
		}
		
		return {
			name,
			passed: true,
			result
		}
	} catch (error) {
		return {
			name,
			passed: false,
			error: error instanceof Error ? error.message : String(error)
		}
	}
}

console.log('🧪 Testing Auto Calculators...\n')

const tests: TestResult[] = []

// Test 1: Car Cost of Ownership
tests.push(testCalculator(
	'Car Cost of Ownership',
	calculateCarCostOfOwnership,
	{
		purchasePrice: 30000,
		ownershipPeriodYears: 5,
		annualMileage: 12000,
		insuranceAnnual: 1200,
		registrationAnnual: 150,
		parkingMonthly: 0,
		fuelCostPerUnit: 3.50,
		fuelConsumption: 25,
		maintenanceAnnual: 600,
		repairsAnnual: 400,
		expectedAnnualDepreciation: 15
	}
))

// Test 2: Monthly Car Expenses
tests.push(testCalculator(
	'Monthly Car Expenses',
	calculateMonthlyCarExpenses,
	{
		insuranceMonthly: 120,
		parkingMonthly: 150,
		loanPaymentMonthly: 450,
		registrationMonthly: 20,
		useFuelCalculation: 'true',
		fuelPrice: 3.50,
		fuelConsumption: 28,
		mileage: 1000,
		maintenanceMonthly: 50,
		repairsMonthly: 0,
		otherMonthly: 0
	}
))

// Test 3: Fuel Cost
tests.push(testCalculator(
	'Fuel Cost',
	calculateFuelCost,
	{
		periodType: 'trip',
		distance: 100,
		consumptionUnit: 'l/100km',
		fuelConsumption: 8,
		fuelPricePerUnit: 1.50,
		roundTrip: 'false',
		currency: '$'
	},
	['fuelUsed', 'fuelCost'] // totalFuelCost can be null for trip type
))

// Test 4: Fuel Consumption
tests.push(testCalculator(
	'Fuel Consumption',
	calculateFuelConsumption,
	{
		mode: 'calculate',
		distance: 500,
		distanceUnit: 'km',
		fuelUsed: 35,
		fuelUnit: 'liters'
	}
))

// Test 5: Trip Cost
tests.push(testCalculator(
	'Trip Cost',
	calculateTripCost,
	{
		tripDistance: 250,
		distanceUnit: 'km',
		roundTrip: 'false',
		fuelConsumption: 8,
		consumptionUnit: 'l/100km',
		fuelPricePerUnit: 1.50,
		tolls: 0,
		parking: 20,
		meals: 50,
		accommodationPerNight: 0,
		nights: 0,
		splitCost: 'false'
	},
	['totalTripCost', 'fuelCost'] // costPerPerson can be null if splitCost is false
))

// Test 6: Car Depreciation
tests.push(testCalculator(
	'Car Depreciation',
	calculateCarDepreciation,
	{
		purchasePrice: 30000,
		purchaseType: 'new',
		yearsOwned: 5,
		depreciationModel: 'simpleAnnualPercent',
		annualDepreciationRate: 15,
		mileagePerYear: 0,
		mileageImpact: 'false'
	}
))

// Test 7: Lease vs Buy
tests.push(testCalculator(
	'Lease vs Buy',
	calculateLeaseVsBuy,
	{
		comparisonYears: 3,
		annualMileage: 12000,
		purchasePrice: 30000,
		downPayment: 5000,
		loanAPR: 4.5,
		loanTermMonths: 36, // Must be <= comparisonYears * 12
		resaleValueAfterYears: 18000,
		salesTaxOrFees: 0,
		leaseMonthlyPayment: 350,
		leaseTermMonths: 36,
		dueAtSigning: 2000,
		residualValue: 0,
		leaseFees: 0,
		mileageLimitPerYear: 12000,
		excessMileageFeePerMileKm: 0.25,
		insuranceDifferenceMonthly: 0,
		maintenanceDifferenceMonthly: 0
	},
	['totalCostBuy', 'totalCostLease', 'difference'] // Required fields
))

// Test 8: Car Affordability
tests.push(testCalculator(
	'Car Affordability',
	calculateCarAffordability,
	{
		mode: 'byMonthlyBudget',
		maxMonthlyCarBudget: 600,
		downPayment: 5000,
		loanAPR: 5.5,
		loanTermMonths: 60,
		estimatedMonthlyFixedCosts: 150,
		tradeInValue: 0,
		salesTaxOrFees: 0
	}
))

// Test 9: Car Resale Value
tests.push(testCalculator(
	'Car Resale Value',
	calculateCarResaleValue,
	{
		currentCarValue: 18000,
		yearsUntilSale: 3,
		condition: 'good',
		purchaseType: 'used',
		baselineDepreciationRate: 0,
		annualMileage: 0,
		mileageImpactToggle: 'false'
	}
))

// Test 10: Car Maintenance Cost
tests.push(testCalculator(
	'Car Maintenance Cost',
	calculateCarMaintenanceCost,
	{
		annualMileage: 12000,
		vehicleAgeYears: 0,
		vehiclePreset: '',
		oilChangeCost: 40,
		oilChangesPerYear: 2,
		tireServiceAnnual: 200,
		brakeServiceAnnual: 150,
		scheduledServiceAnnual: 300,
		unexpectedRepairsAnnual: 400
	}
))

// Test 11: Tire Cost
tests.push(testCalculator(
	'Tire Cost',
	calculateTireCost,
	{
		tirePricePerUnit: 120,
		tiresCount: 4,
		tireLifespanMilesKm: 50000,
		annualMileage: 12000,
		seasonalTiresToggle: 'false',
		mountingAndBalancingCost: 80
	},
	['totalTireSetCost', 'annualTireCost'] // seasonalTotalCost can be null if not seasonal
))

// Print results
console.log('Results:\n')
let passed = 0
let failed = 0

tests.forEach(test => {
	if (test.passed) {
		console.log(`✅ ${test.name}`)
		passed++
	} else {
		console.log(`❌ ${test.name}`)
		if (test.error) {
			console.log(`   Error: ${test.error}`)
		}
		if (test.result) {
			console.log(`   Result: ${JSON.stringify(test.result, null, 2)}`)
		}
		failed++
	}
})

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`)

if (failed > 0) {
	process.exit(1)
} else {
	console.log('\n✨ All tests passed!')
	process.exit(0)
}

