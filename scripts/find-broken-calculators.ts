#!/usr/bin/env tsx

/**
 * Find and disable broken calculators
 * 
 * Checks for calculators with suspicious structure:
 * - 1 or fewer inputs
 * - 0 outputs
 * - Empty formula
 * - Duplicate input names
 * - Missing required fields
 */

import { readFile, readdir } from 'fs/promises'
import { join } from 'path'

interface BrokenCalculator {
	slug: string
	reasons: string[]
}

interface CalculatorSchema {
	id: string
	slug: string
	category: string
	inputs?: Array<{ name: string; type: string }>
	outputs?: Array<{ name: string }>
	formula?: string
}

/**
 * Check if calculator is broken
 */
function checkCalculator(schema: CalculatorSchema): string[] {
	const issues: string[] = []

	// Check inputs
	if (!schema.inputs || schema.inputs.length === 0) {
		issues.push('No inputs defined')
	} else if (schema.inputs.length === 1) {
		issues.push('Only 1 input (suspicious)')
	}

	// Check outputs
	if (!schema.outputs || schema.outputs.length === 0) {
		issues.push('No outputs defined')
	}

	// Check formula
	if (!schema.formula || schema.formula.trim() === '') {
		issues.push('Empty or missing formula')
	}

	// Check for duplicate input names
	if (schema.inputs && schema.inputs.length > 1) {
		const inputNames = schema.inputs.map((inp) => inp.name)
		const duplicates = inputNames.filter(
			(name, index) => inputNames.indexOf(name) !== index,
		)
		if (duplicates.length > 0) {
			issues.push(`Duplicate input names: ${duplicates.join(', ')}`)
		}
	}

	// Check for duplicate output names
	if (schema.outputs && schema.outputs.length > 1) {
		const outputNames = schema.outputs.map((out) => out.name)
		const duplicates = outputNames.filter(
			(name, index) => outputNames.indexOf(name) !== index,
		)
		if (duplicates.length > 0) {
			issues.push(`Duplicate output names: ${duplicates.join(', ')}`)
		}
	}

	// Check if all inputs have the same name (suspicious)
	if (
		schema.inputs &&
		schema.inputs.length > 1 &&
		schema.inputs.every((inp) => inp.name === schema.inputs![0].name)
	) {
		issues.push('All inputs have the same name')
	}

	return issues
}

/**
 * Main function
 */
async function main() {
	const calculatorsDir = join(process.cwd(), 'data', 'calculators')
	const broken: BrokenCalculator[] = []

	try {
		const files = await readdir(calculatorsDir)
		const jsonFiles = files.filter(
			(file) => file.endsWith('.json') && !file.includes('.ru.'),
		)

		console.log(`Checking ${jsonFiles.length} calculator files...\n`)

		for (const file of jsonFiles) {
			try {
				const filePath = join(calculatorsDir, file)
				const content = await readFile(filePath, 'utf-8')
				const schema: CalculatorSchema = JSON.parse(content)

				const issues = checkCalculator(schema)
				if (issues.length > 0) {
					broken.push({
						slug: schema.slug || schema.id || file.replace('.json', ''),
						reasons: issues,
					})
				}
			} catch (error) {
				console.error(`Error reading ${file}:`, error)
			}
		}

		// Generate report
		if (broken.length === 0) {
			console.log('✅ No broken calculators found!')
			return
		}

		console.log(`\n❌ Found ${broken.length} broken calculator(s):\n`)

		const reportLines: string[] = []
		reportLines.push('# Disabled Calculators Report')
		reportLines.push('')
		reportLines.push(
			`Generated: ${new Date().toISOString()}`,
		)
		reportLines.push('')
		reportLines.push('## Summary')
		reportLines.push('')
		reportLines.push(`Total broken calculators: ${broken.length}`)
		reportLines.push('')
		reportLines.push('## Disabled Calculators')
		reportLines.push('')

		for (const calc of broken) {
			console.log(`- ${calc.slug}`)
			for (const reason of calc.reasons) {
				console.log(`  ❌ ${reason}`)
			}
			console.log('')

			reportLines.push(`### ${calc.slug}`)
			reportLines.push('')
			reportLines.push(`**Reason for disabling:**`)
			reportLines.push('')
			for (const reason of calc.reasons) {
				reportLines.push(`- ${reason}`)
			}
			reportLines.push('')
		}

		// Write report
		const reportPath = join(process.cwd(), 'docs', 'disabled-calculators.md')
		const { writeFile } = await import('fs/promises')
		await writeFile(reportPath, reportLines.join('\n'), 'utf-8')

		console.log(`\n📄 Report written to: ${reportPath}`)
		console.log('\n💡 To disable these calculators, add `isEnabled: false` to their schemas')
	} catch (error) {
		console.error('Error:', error)
		process.exit(1)
	}
}

main()






