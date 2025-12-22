/**
 * Import calculator manifest (batch mode)
 * 
 * Imports calculators from docs/export-calc1-manifest.json and docs/export-calc1.json
 * Creates data/calculators/<slug>.json and locales/en/calculators/items/<slug>.json
 * 
 * Usage:
 *   tsx scripts/import-manifest.ts --category=math --limit=10 --onlyEngine=function --overwrite=false
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

interface ManifestCalculator {
	slug: string
	category: string
	engine: string
	calculationId: string | null
	inputs: Array<{
		name: string
		type: string
		unit: string | null
		min: number | null
		max: number | null
		step: number | null
		optional: boolean
	}>
	outputs: Array<{
		name: string
		unit: string | null
	}>
	defaults: Record<string, any>
	notes: string | null
}

interface ExportCalculator {
	slug: string
	title: string
}

interface ImportReport {
	created: string[]
	skipped: string[]
	disabled: string[]
	errors: Array<{ slug: string; error: string }>
}

/**
 * Parse command line arguments
 */
function parseArgs() {
	const args: Record<string, string> = {}
	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i]
		if (arg.startsWith('--')) {
			const [key, value] = arg.slice(2).split('=')
			args[key] = value || 'true'
		}
	}
	return {
		category: args.category || '',
		limit: parseInt(args.limit || '10', 10),
		onlyEngine: args.onlyEngine || 'function',
		overwrite: args.overwrite === 'true',
	}
}

/**
 * Generate short description from title
 */
function generateShortDescription(title: string): string {
	// Remove "Калькулятор" prefix if present
	let desc = title.replace(/^Калькулятор\s+/i, '')
	// Capitalize first letter
	desc = desc.charAt(0).toUpperCase() + desc.slice(1)
	// Limit to 150 characters
	if (desc.length > 150) {
		desc = desc.slice(0, 147) + '...'
	}
	return desc
}

/**
 * Convert manifest input to schema input
 */
function convertInput(input: ManifestCalculator['inputs'][0]) {
	const result: any = {
		name: input.name,
		type: input.type === 'select' ? 'select' : input.type === 'text' ? 'text' : 'number',
	}
	if (input.unit) result.unit = input.unit
	if (input.min !== null) result.min = input.min
	if (input.max !== null) result.max = input.max
	if (input.step !== null) result.step = input.step
	if (input.defaultValue !== undefined) result.defaultValue = input.defaultValue
	return result
}

/**
 * Convert manifest output to schema output
 */
function convertOutput(output: ManifestCalculator['outputs'][0]) {
	return {
		name: output.name,
	}
}

/**
 * Main import function
 */
async function importManifest() {
	const { category, limit, onlyEngine, overwrite } = parseArgs()

	if (!category) {
		console.error('Error: --category is required')
		console.error('Usage: tsx scripts/import-manifest.ts --category=math --limit=10 --onlyEngine=function --overwrite=false')
		process.exit(1)
	}

	console.log(`\n📦 Importing calculators from manifest...`)
	console.log(`   Category: ${category}`)
	console.log(`   Limit: ${limit}`)
	console.log(`   Engine filter: ${onlyEngine}`)
	console.log(`   Overwrite: ${overwrite}\n`)

	// Load manifest
	const manifestPath = join(process.cwd(), 'docs', 'export-calc1-manifest.json')
	const exportPath = join(process.cwd(), 'docs', 'export-calc1.json')

	const manifestContent = await readFile(manifestPath, 'utf-8')
	const exportContent = await readFile(exportPath, 'utf-8')

	const manifest = JSON.parse(manifestContent) as { calculators: ManifestCalculator[] }
	const exportData = JSON.parse(exportContent) as { categories: Array<{ id: string; calculators: ExportCalculator[] }> }

	// Find category in export data
	const categoryData = exportData.categories.find((cat) => cat.id === category)
	if (!categoryData) {
		console.error(`Error: Category "${category}" not found in export-calc1.json`)
		process.exit(1)
	}

	// Create title map
	const titleMap = new Map<string, string>()
	categoryData.calculators.forEach((calc) => {
		titleMap.set(calc.slug, calc.title)
	})

	// Filter calculators by category and engine
	const calculators = manifest.calculators
		.filter((calc) => calc.category === category && calc.engine === onlyEngine)
		.slice(0, limit)

	console.log(`Found ${calculators.length} calculators to process\n`)

	const report: ImportReport = {
		created: [],
		skipped: [],
		disabled: [],
		errors: [],
	}

	// Ensure directories exist
	const calculatorsDir = join(process.cwd(), 'data', 'calculators')
	const itemsDir = join(process.cwd(), 'locales', 'en', 'calculators', 'items')

	await mkdir(calculatorsDir, { recursive: true })
	await mkdir(itemsDir, { recursive: true })

	// Process each calculator
	for (const calc of calculators) {
		try {
			// Skip if engine doesn't match
			if (calc.engine !== onlyEngine) {
				report.skipped.push(calc.slug)
				console.log(`⏭️  Skipped ${calc.slug}: engine=${calc.engine} (expected ${onlyEngine})`)
				continue
			}

			// Check if calculator file already exists
			const calculatorPath = join(calculatorsDir, `${calc.slug}.json`)
			const itemsPath = join(itemsDir, `${calc.slug}.json`)

			if (existsSync(calculatorPath) && !overwrite) {
				report.skipped.push(calc.slug)
				console.log(`⏭️  Skipped ${calc.slug}: file already exists (use --overwrite=true to overwrite)`)
				continue
			}

			// Validate inputs and outputs
			const hasValidInputs = calc.inputs && calc.inputs.length >= 2
			const hasValidOutputs = calc.outputs && calc.outputs.length > 0
			const isEnabled = hasValidInputs && hasValidOutputs

			if (!isEnabled) {
				report.disabled.push(calc.slug)
				console.log(`⚠️  Disabled ${calc.slug}: ${!hasValidInputs ? 'inputs < 2' : 'no outputs'}`)
			}

			// Create calculator schema
			const calculatorSchema = {
				id: calc.slug,
				slug: calc.slug,
				category: calc.category,
				engine: 'function' as const,
				calculationId: calc.calculationId || null,
				inputs: calc.inputs.map(convertInput),
				outputs: calc.outputs.map(convertOutput),
				defaults: calc.defaults || {},
				isEnabled,
			}

			// Write calculator file
			await writeFile(
				calculatorPath,
				JSON.stringify(calculatorSchema, null, 2) + '\n',
				'utf-8',
			)

			// Create/update items file
			const title = titleMap.get(calc.slug) || calc.slug
			const shortDescription = generateShortDescription(title)

			let itemsContent: any = {}
			if (existsSync(itemsPath)) {
				// Load existing content
				const existingContent = await readFile(itemsPath, 'utf-8')
				itemsContent = JSON.parse(existingContent)
			}

			// Update only if not exists or overwrite
			if (!itemsContent.title || overwrite) {
				itemsContent.title = title
			}
			if (!itemsContent.shortDescription || overwrite) {
				itemsContent.shortDescription = shortDescription
			}

			// Only autogen howTo/faq/examples if they don't exist
			if (!itemsContent.howTo || overwrite) {
				// Will be autogenerated by schemaToDefinition if missing
			}
			if (!itemsContent.faq || overwrite) {
				// Will be autogenerated by schemaToDefinition if missing
			}
			if (!itemsContent.examples || overwrite) {
				// Will be autogenerated by schemaToDefinition if missing
			}

			// Write items file
			await writeFile(
				itemsPath,
				JSON.stringify(itemsContent, null, 2) + '\n',
				'utf-8',
			)

			report.created.push(calc.slug)
			console.log(`✅ Created ${calc.slug}${!isEnabled ? ' (disabled)' : ''}`)
		} catch (error) {
			report.errors.push({
				slug: calc.slug,
				error: error instanceof Error ? error.message : 'Unknown error',
			})
			console.error(`❌ Error processing ${calc.slug}:`, error)
		}
	}

	// Print report
	console.log(`\n📊 Import Report:`)
	console.log(`   Created: ${report.created.length}`)
	console.log(`   Skipped: ${report.skipped.length}`)
	console.log(`   Disabled: ${report.disabled.length}`)
	console.log(`   Errors: ${report.errors.length}`)

	if (report.errors.length > 0) {
		console.log(`\n❌ Errors:`)
		report.errors.forEach((err) => {
			console.log(`   ${err.slug}: ${err.error}`)
		})
	}

	// Run validation
	console.log(`\n🔍 Running i18n validation...`)
	const { exec } = await import('child_process')
	const { promisify } = await import('util')
	const execAsync = promisify(exec)

	try {
		const { stdout, stderr } = await execAsync('npm run i18n:validate')
		console.log(stdout)
		if (stderr) console.error(stderr)
	} catch (error: any) {
		console.error('Validation failed:', error.message)
		if (error.stdout) console.log(error.stdout)
		if (error.stderr) console.error(error.stderr)
	}
}

// Run import
importManifest().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})



