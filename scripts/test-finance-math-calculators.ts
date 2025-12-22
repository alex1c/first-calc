#!/usr/bin/env tsx

/**
 * Test script for finance and math calculators
 * Tests all calculators in finance and math categories
 */

import { readFile } from 'fs/promises'
import { join } from 'path'

// Import calculation functions
import { calculateAutoLoan } from '../lib/calculations/auto-loan'
import { calculatePersonalLoan } from '../lib/calculations/personal-loan'
import { calculateMortgage } from '../lib/calculations/mortgage'
import { calculateInvestment } from '../lib/calculations/investment'
import { calculateLoanOverpayment } from '../lib/calculations/loan-overpayment'
import { calculateROI } from '../lib/calculations/roi'
import { calculateSavings } from '../lib/calculations/savings'
import { calculateAverage } from '../lib/calculations/average'
import { calculatePercentageChange } from '../lib/calculations/percentage-change'
import { calculateStandardDeviationStats } from '../lib/calculations/standard-deviation'
import { calculateQuadratic } from '../lib/calculations/quadratic'
import { calculateDescriptiveStatistics } from '../lib/calculations/descriptive-statistics'
import { solveEquation } from '../lib/calculations/equation-solver'
import { calculatePythagorean } from '../lib/calculations/pythagorean'
import { calculateVolume } from '../lib/calculations/volume'
import { calculateArea } from '../lib/calculations/area'
import { calculatePerimeter } from '../lib/calculations/perimeter'

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

async function testSchema(id: string): Promise<{ loaded: boolean; errors: string[] }> {
	const errors: string[] = []
	try {
		const filePath = join(process.cwd(), 'data', 'calculators', `${id}.json`)
		const content = await readFile(filePath, 'utf-8')
		const schema = JSON.parse(content)
		
		if (!schema.id) errors.push('Missing id')
		if (!schema.slug) errors.push('Missing slug')
		if (!schema.category) errors.push('Missing category')
		if (!schema.engine) errors.push('Missing engine')
		if (schema.engine === 'function' && !schema.calculationId) errors.push('Missing calculationId')
		if (!schema.inputs || !Array.isArray(schema.inputs)) errors.push('Missing or invalid inputs')
		if (!schema.outputs || !Array.isArray(schema.outputs)) errors.push('Missing or invalid outputs')
		
		return { loaded: errors.length === 0, errors }
	} catch (error) {
		return { loaded: false, errors: [error instanceof Error ? error.message : String(error)] }
	}
}

async function runTests() {
	console.log('🧪 Testing Finance & Math Calculators...\n')

	const tests: TestResult[] = []
	const schemaTests: Array<{ id: string; result: { loaded: boolean; errors: string[] } }> = []

	// ===== FINANCE CALCULATORS =====
	console.log('📊 Finance Calculators:\n')

	// 1. Auto Loan
	tests.push(testCalculator(
		'Auto Loan',
		calculateAutoLoan,
		{
			carPrice: 30000,
			downPayment: 5000,
			interestRate: 5.5,
			loanTerm: 5,
			tradeInValue: 0
		},
		['monthlyPayment', 'totalPayment']
	))
	schemaTests.push({ id: 'auto-loan-calculator', result: await testSchema('auto-loan-calculator') })

	// 2. Personal Loan
	tests.push(testCalculator(
		'Personal Loan',
		calculatePersonalLoan,
		{
			loanAmount: 10000,
			interestRate: 7.5,
			loanTerm: 3,
			originationFee: 0
		},
		['monthlyPayment', 'totalPayment']
	))
	schemaTests.push({ id: 'personal-loan-calculator', result: await testSchema('personal-loan-calculator') })

	// 3. Mortgage
	tests.push(testCalculator(
		'Mortgage',
		calculateMortgage,
		{
			homePrice: 400000,
			downPayment: 100000,
			downPaymentType: 'amount',
			loanTermYears: 30,
			interestRateAPR: 4.5,
			paymentFrequency: 'monthly',
			propertyTax: 3000,
			propertyTaxType: 'amount',
			homeInsurance: 1200,
			hoa: 0,
			extraMonthlyPayment: 0
		},
		['monthlyMortgagePayment']
	))
	schemaTests.push({ id: 'mortgage-calculator', result: await testSchema('mortgage-calculator') })

	// 4. Investment
	tests.push(testCalculator(
		'Investment',
		calculateInvestment,
		{
			initialInvestment: 10000,
			periodicContribution: 500,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 7,
			investmentPeriod: 10,
			compoundingFrequency: 'monthly',
			inflationRate: 0
		},
		['finalValue', 'totalContributions']
	))
	schemaTests.push({ id: 'investment-calculator', result: await testSchema('investment-calculator') })

	// 5. Loan Overpayment
	tests.push(testCalculator(
		'Loan Overpayment',
		calculateLoanOverpayment,
		{
			loanAmount: 200000,
			interestRate: 5.0,
			loanTerm: 30,
			overpayment: 200,
			overpaymentFrequency: 'monthly',
			paymentType: 'monthly'
		},
		['overpayment']
	))
	schemaTests.push({ id: 'loan-overpayment-calculator', result: await testSchema('loan-overpayment-calculator') })

	// 6. ROI
	tests.push(testCalculator(
		'ROI',
		calculateROI,
		{
			investmentCost: 50000,
			returnValue: 75000
		},
		['roiPercentage', 'netProfit']
	))
	schemaTests.push({ id: 'roi-calculator', result: await testSchema('roi-calculator') })

	// 7. Savings
	tests.push(testCalculator(
		'Savings',
		calculateSavings,
		{
			initialSavings: 5000,
			monthlyContribution: 300,
			annualInterestRate: 3.5,
			years: 5,
			compoundingFrequency: 12
		},
		['finalSavings', 'totalContributions']
	))
	schemaTests.push({ id: 'savings-calculator', result: await testSchema('savings-calculator') })

	// ===== MATH CALCULATORS =====
	console.log('\n🔢 Math Calculators:\n')

	// 8. Average
	tests.push(testCalculator(
		'Average',
		calculateAverage,
		{
			dataset: '10,20,30,40,50'
		},
		['mean', 'median']
	))
	schemaTests.push({ id: 'average-calculator', result: await testSchema('average-calculator') })

	// 9. Percentage Change
	tests.push(testCalculator(
		'Percentage Change',
		calculatePercentageChange,
		{
			original: 100,
			new: 120
		},
		['percentageChange', 'absoluteDifference']
	))
	schemaTests.push({ id: 'percentage-change-calculator', result: await testSchema('percentage-change-calculator') })

	// 10. Standard Deviation
	tests.push(testCalculator(
		'Standard Deviation',
		calculateStandardDeviationStats,
		{
			dataset: '10,20,30,40,50',
			type: 'population'
		},
		['standardDeviation', 'mean']
	))
	schemaTests.push({ id: 'standard-deviation-calculator', result: await testSchema('standard-deviation-calculator') })

	// 11. Quadratic Equation
	tests.push(testCalculator(
		'Quadratic Equation',
		calculateQuadratic,
		{
			a: 1,
			b: -5,
			c: 6
		},
		['roots']
	))
	schemaTests.push({ id: 'quadratic-equation-calculator', result: await testSchema('quadratic-equation-calculator') })

	// 12. Descriptive Statistics
	tests.push(testCalculator(
		'Descriptive Statistics',
		calculateDescriptiveStatistics,
		{
			dataset: '10,20,30,40,50,60,70'
		},
		['mean', 'median']
	))
	schemaTests.push({ id: 'descriptive-statistics-calculator', result: await testSchema('descriptive-statistics-calculator') })

	// 13. Equation Solver
	tests.push(testCalculator(
		'Equation Solver',
		solveEquation,
		{
			equationText: '2x+5=15',
			equationType: 'linear'
		},
		['result']
	))
	schemaTests.push({ id: 'equation-solver', result: await testSchema('equation-solver') })

	// 14. Pythagorean Theorem
	tests.push(testCalculator(
		'Pythagorean Theorem',
		calculatePythagorean,
		{
			mode: 'hypotenuse',
			a: 3,
			b: 4
		},
		['result']
	))
	schemaTests.push({ id: 'pythagorean-theorem-calculator', result: await testSchema('pythagorean-theorem-calculator') })

	// 15. Volume
	tests.push(testCalculator(
		'Volume',
		calculateVolume,
		{
			shape: 'cube',
			side: 5
		},
		['volume']
	))
	schemaTests.push({ id: 'volume', result: await testSchema('volume') })

	// 16. Area
	tests.push(testCalculator(
		'Area',
		calculateArea,
		{
			shape: 'rectangle',
			length: 10,
			width: 5
		},
		['area']
	))
	schemaTests.push({ id: 'area', result: await testSchema('area') })

	// 17. Perimeter
	tests.push(testCalculator(
		'Perimeter',
		calculatePerimeter,
		{
			shape: 'rectangle',
			length: 10,
			width: 5
		},
		['perimeter']
	))
	schemaTests.push({ id: 'perimeter-of-shapes', result: await testSchema('perimeter-of-shapes') })

	// Print function test results
	console.log('Function Tests:\n')
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
				console.log(`   Result keys: ${Object.keys(test.result).join(', ')}`)
			}
			failed++
		}
	})

	// Print schema test results
	console.log('\n\nSchema Validation:\n')
	let schemaPassed = 0
	let schemaFailed = 0

	schemaTests.forEach(test => {
		if (test.result.loaded) {
			console.log(`✅ ${test.id}`)
			schemaPassed++
		} else {
			console.log(`❌ ${test.id}`)
			test.result.errors.forEach(error => console.log(`   - ${error}`))
			schemaFailed++
		}
	})

	console.log(`\n📊 Summary:`)
	console.log(`   Function Tests: ${passed} passed, ${failed} failed`)
	console.log(`   Schema Tests: ${schemaPassed} passed, ${schemaFailed} failed`)

	if (failed > 0 || schemaFailed > 0) {
		process.exit(1)
	} else {
		console.log('\n✨ All tests passed!')
		process.exit(0)
	}
}

runTests().catch(console.error)

