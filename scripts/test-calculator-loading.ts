#!/usr/bin/env tsx

/**
 * Test calculator loading and schema validation
 */

import { readFile } from 'fs/promises'
import { join } from 'path'

const calculatorsDir = join(process.cwd(), 'data', 'calculators')

interface TestResult {
	id: string
	loaded: boolean
	errors: string[]
}

async function testCalculator(id: string): Promise<TestResult> {
	const errors: string[] = []
	
	try {
		const filePath = join(calculatorsDir, `${id}.json`)
		const content = await readFile(filePath, 'utf-8')
		const schema = JSON.parse(content)
		
		// Check required fields
		if (!schema.id) errors.push('Missing id')
		if (!schema.slug) errors.push('Missing slug')
		if (!schema.category) errors.push('Missing category')
		if (!schema.engine) errors.push('Missing engine')
		if (!schema.calculationId) errors.push('Missing calculationId')
		if (!schema.inputs || !Array.isArray(schema.inputs)) errors.push('Missing or invalid inputs')
		if (!schema.outputs || !Array.isArray(schema.outputs)) errors.push('Missing or invalid outputs')
		
		// Check inputs
		if (schema.inputs && schema.inputs.length > 0) {
			schema.inputs.forEach((input: any, index: number) => {
				if (!input.name) errors.push(`Input ${index} missing name`)
				if (!input.type) errors.push(`Input ${index} missing type`)
			})
		}
		
		// Check outputs
		if (schema.outputs && schema.outputs.length > 0) {
			schema.outputs.forEach((output: any, index: number) => {
				if (!output.name) errors.push(`Output ${index} missing name`)
			})
		}
		
		return {
			id,
			loaded: errors.length === 0,
			errors
		}
	} catch (error) {
		return {
			id,
			loaded: false,
			errors: [error instanceof Error ? error.message : String(error)]
		}
	}
}

async function main() {
	const autoCalculators = [
		'car-cost-of-ownership-calculator',
		'monthly-car-expenses-calculator',
		'fuel-cost-calculator',
		'fuel-consumption-calculator',
		'trip-cost-calculator',
		'car-depreciation-calculator',
		'lease-vs-buy-calculator',
		'car-affordability-calculator',
		'car-resale-value-calculator',
		'car-maintenance-cost-calculator',
		'tire-cost-calculator'
	]
	
	console.log('🧪 Testing Auto Calculator Loading...\n')
	
	const results = await Promise.all(autoCalculators.map(id => testCalculator(id)))
	
	let passed = 0
	let failed = 0
	
	results.forEach(result => {
		if (result.loaded) {
			console.log(`✅ ${result.id}`)
			passed++
		} else {
			console.log(`❌ ${result.id}`)
			result.errors.forEach(error => console.log(`   - ${error}`))
			failed++
		}
	})
	
	console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`)
	
	if (failed > 0) {
		process.exit(1)
	} else {
		console.log('\n✨ All calculators loaded successfully!')
		process.exit(0)
	}
}

main().catch(console.error)


