#!/usr/bin/env tsx

/**
 * Batch import calculators from calc1 project
 * 
 * Usage:
 *   npm run import:calc1:batch -- --category=math --limit=10
 *   npm run import:calc1:batch -- --category=math --limit=10 --overwrite
 *   npm run import:calc1:batch -- --category=math --limit=10 --dry-run
 * 
 * Requirements:
 * - inputs >= 2
 * - outputs >= 1
 * - formula not empty
 * - Does not overwrite existing calculators without --overwrite flag
 * - Runs npm run i18n:validate at the end
 */

import { readFile, readdir, writeFile, stat } from 'fs/promises'
import { join } from 'path'
import { execSync } from 'child_process'

interface ImportOptions {
	calc1Path: string
	category?: string
	limit?: number
	overwrite?: boolean
	dryRun?: boolean
}

interface CalculatorData {
	id: string
	slug: string
	category: string
	inputs: Array<{ name: string; type: string }>
	outputs: Array<{ name: string }>
	formula: string
	title?: string
	description?: string
}

/**
 * Parse command line arguments
 */
function parseArgs(): ImportOptions {
	const args = process.argv.slice(2)
	const options: ImportOptions = {
		calc1Path: args[0] || '',
	}

	for (let i = 1; i < args.length; i++) {
		const arg = args[i]
		if (arg.startsWith('--category=')) {
			options.category = arg.split('=')[1]
		} else if (arg.startsWith('--limit=')) {
			options.limit = parseInt(arg.split('=')[1], 10)
		} else if (arg === '--overwrite') {
			options.overwrite = true
		} else if (arg === '--dry-run') {
			options.dryRun = true
		}
	}

	return options
}

/**
 * Validate calculator data
 */
function validateCalculator(calc: CalculatorData): { valid: boolean; errors: string[] } {
	const errors: string[] = []

	if (!calc.inputs || calc.inputs.length < 2) {
		errors.push(`Inputs must be >= 2, got ${calc.inputs?.length || 0}`)
	}

	if (!calc.outputs || calc.outputs.length < 1) {
		errors.push(`Outputs must be >= 1, got ${calc.outputs?.length || 0}`)
	}

	if (!calc.formula || calc.formula.trim() === '') {
		errors.push('Formula is required and must not be empty')
	}

	if (!calc.id || !calc.slug) {
		errors.push('ID and slug are required')
	}

	return {
		valid: errors.length === 0,
		errors,
	}
}

/**
 * Check if calculator already exists
 */
async function calculatorExists(slug: string): Promise<boolean> {
	try {
		const schemaPath = join(process.cwd(), 'data', 'calculators', `${slug}.json`)
		await stat(schemaPath)
		return true
	} catch {
		return false
	}
}

/**
 * Map old category to new category
 */
function mapCategory(oldCategory: string): string {
	const mapping: Record<string, string> = {
		math: 'math',
		mathematics: 'math',
		finance: 'finance',
		financial: 'finance',
		geometry: 'geometry',
		everyday: 'everyday',
		life: 'everyday',
		household: 'everyday',
		engineering: 'engineering',
		construction: 'engineering',
		business: 'business',
	}

	const normalized = oldCategory.toLowerCase().trim()
	return mapping[normalized] || 'everyday'
}

/**
 * Extract calculator data from calc1 (simplified - needs actual implementation)
 * This is a placeholder - you'll need to implement actual parsing based on calc1 structure
 */
async function extractCalculatorData(
	calc1Path: string,
	category?: string,
): Promise<CalculatorData[]> {
	// TODO: Implement actual extraction from calc1
	// This should:
	// 1. Scan calc1 directory structure
	// 2. Find calculators in the specified category
	// 3. Parse TS/JSON/MD files
	// 4. Extract structure and content
	// 5. Return array of CalculatorData

	console.warn('[WARN] extractCalculatorData not implemented yet')
	return []
}

/**
 * Generate schema JSON
 */
function generateSchema(calc: CalculatorData): object {
	return {
		id: calc.id,
		slug: calc.slug,
		category: calc.category,
		inputs: calc.inputs.map((inp) => ({
			name: inp.name,
			type: inp.type || 'number',
		})),
		outputs: calc.outputs.map((out) => ({
			name: out.name,
		})),
		formula: calc.formula,
		isEnabled: true,
	}
}

/**
 * Generate content JSON
 */
function generateContent(calc: CalculatorData): object {
	return {
		title: calc.title || calc.slug,
		shortDescription: calc.description || '',
		longDescription: calc.description || '',
		howTo: [],
		examples: [],
		faq: [],
		seo: {
			keywords: [calc.category, calc.slug],
		},
	}
}

/**
 * Main import function
 */
async function main() {
	const options = parseArgs()

	if (!options.calc1Path) {
		console.error('Error: calc1 path is required')
		console.error('Usage: npm run import:calc1:batch -- <calc1-path> [--category=math] [--limit=10] [--overwrite] [--dry-run]')
		process.exit(1)
	}

	console.log('='.repeat(60))
	console.log('CALC1 BATCH IMPORT')
	console.log('='.repeat(60))
	console.log(`Calc1 path: ${options.calc1Path}`)
	console.log(`Category: ${options.category || 'all'}`)
	console.log(`Limit: ${options.limit || 'unlimited'}`)
	console.log(`Overwrite: ${options.overwrite ? 'yes' : 'no'}`)
	console.log(`Dry run: ${options.dryRun ? 'yes' : 'no'}`)
	console.log('='.repeat(60))
	console.log('')

	// Extract calculators
	const calculators = await extractCalculatorData(options.calc1Path, options.category)

	if (calculators.length === 0) {
		console.log('No calculators found')
		return
	}

	// Apply limit
	const limited = options.limit ? calculators.slice(0, options.limit) : calculators

	console.log(`Found ${calculators.length} calculator(s), processing ${limited.length}...\n`)

	let imported = 0
	let skipped = 0
	let failed = 0
	const errors: Array<{ slug: string; error: string }> = []

	for (const calc of limited) {
		try {
			// Validate
			const validation = validateCalculator(calc)
			if (!validation.valid) {
				console.error(`❌ ${calc.slug}: Validation failed`)
				validation.errors.forEach((err) => console.error(`   - ${err}`))
				failed++
				errors.push({ slug: calc.slug, error: validation.errors.join(', ') })
				continue
			}

			// Check if exists
			const exists = await calculatorExists(calc.slug)
			if (exists && !options.overwrite) {
				console.log(`⏭️  ${calc.slug}: Already exists (use --overwrite to replace)`)
				skipped++
				continue
			}

			// Map category
			calc.category = mapCategory(calc.category)

			if (options.dryRun) {
				console.log(`✅ [DRY RUN] Would import: ${calc.slug}`)
				imported++
				continue
			}

			// Generate files
			const schema = generateSchema(calc)
			const content = generateContent(calc)

			// Write schema
			const schemaPath = join(process.cwd(), 'data', 'calculators', `${calc.slug}.json`)
			await writeFile(schemaPath, JSON.stringify(schema, null, 2), 'utf-8')

			// Write content
			const contentPath = join(
				process.cwd(),
				'locales',
				'en',
				'calculators',
				'items',
				`${calc.slug}.json`,
			)
			await writeFile(contentPath, JSON.stringify(content, null, 2), 'utf-8')

			console.log(`✅ Imported: ${calc.slug}`)
			imported++
		} catch (error) {
			console.error(`❌ ${calc.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`)
			failed++
			errors.push({
				slug: calc.slug,
				error: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	}

	console.log('')
	console.log('='.repeat(60))
	console.log('IMPORT SUMMARY')
	console.log('='.repeat(60))
	console.log(`Imported: ${imported}`)
	console.log(`Skipped: ${skipped}`)
	console.log(`Failed: ${failed}`)
	console.log('='.repeat(60))

	if (errors.length > 0) {
		console.log('\nErrors:')
		errors.forEach((err) => {
			console.log(`  - ${err.slug}: ${err.error}`)
		})
	}

	// Run validation
	if (!options.dryRun && imported > 0) {
		console.log('\nRunning i18n validation...')
		try {
			execSync('npm run i18n:validate', { stdio: 'inherit' })
			console.log('\n✅ Validation passed!')
		} catch (error) {
			console.error('\n❌ Validation failed!')
			process.exit(1)
		}
	}
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})





