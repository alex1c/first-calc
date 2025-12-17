#!/usr/bin/env ts-node

/**
 * Calculator generator script
 * Generates calculator from JSON schema and adds it to data/calculators.ts
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import {
	validateCalculatorSchema,
	schemaToDefinition,
	type CalculatorSchema,
} from '../lib/calculators/schema'
import { generateCalculatorContent } from '../lib/content/autogen'

async function main() {
	const args = process.argv.slice(2)

	if (args.length === 0) {
		console.error('Usage: ts-node scripts/generate-calculator.ts <schema-file.json>')
		process.exit(1)
	}

	const schemaPath = args[0]

	try {
		// Read and parse JSON schema
		const schemaContent = await fs.readFile(schemaPath, 'utf-8')
		const schema: CalculatorSchema = JSON.parse(schemaContent)

		// Auto-detect locale from filename if schema.ru.* pattern
		const filename = path.basename(schemaPath)
		if (filename.startsWith('schema.ru.') || filename.includes('.ru.')) {
			schema.locale = 'ru'
			console.log('✓ Auto-detected locale: ru from filename')
		}

		// Validate schema
		const validation = validateCalculatorSchema(schema)
		if (!validation.valid) {
			console.error('Schema validation failed:')
			validation.errors.forEach((error) => console.error(`  - ${error}`))
			process.exit(1)
		}

		console.log(`✓ Schema validated: ${schema.id}`)

		// Generate missing content if needed
		if (!schema.howTo || !schema.faq || !schema.examples) {
			console.log('Generating missing content...')
			const generated = await generateCalculatorContent(schema)

			if (!schema.howTo) {
				schema.howTo = generated.howTo
			}
			if (!schema.faq) {
				schema.faq = generated.faq
			}
			if (!schema.examples) {
				// Note: In a real implementation, we would need to extract inputs/results from examples
				// For now, generate simple examples from the schema
				schema.examples = []
			}
		}

		// Convert to definition
		const definition = schemaToDefinition(schema)

		// Create calculators directory if it doesn't exist
		const calculatorsDir = path.join(process.cwd(), 'data', 'calculators')
		await fs.mkdir(calculatorsDir, { recursive: true })

		// Save JSON schema file
		const jsonPath = path.join(calculatorsDir, `${schema.slug}.json`)
		await fs.writeFile(jsonPath, JSON.stringify(schema, null, 2))
		console.log(`✓ Saved schema to ${jsonPath}`)

		// Create public directory for OG image placeholder
		const publicDir = path.join(process.cwd(), 'public', 'calculators', schema.slug)
		await fs.mkdir(publicDir, { recursive: true })

		// Create placeholder OG image info (actual image generation would be done separately)
		const ogInfo = {
			slug: schema.slug,
			title: schema.title,
			description: schema.description,
			generated: new Date().toISOString(),
		}
		await fs.writeFile(
			path.join(publicDir, 'og-info.json'),
			JSON.stringify(ogInfo, null, 2),
		)
		console.log(`✓ Created OG image directory: ${publicDir}`)

		// Note: In a real implementation, you would:
		// 1. Generate OG image using a library like @vercel/og or canvas
		// 2. Save it as og-image.png in the public directory

		console.log('\n✓ Calculator generated successfully!')
		console.log(`\nCalculator ID: ${schema.id}`)
		console.log(`Slug: ${schema.slug}`)
		console.log(`Category: ${schema.category}`)
		console.log(`Locale: ${schema.locale}`)
		console.log(`\nTo use this calculator, ensure it's loaded via the loader system.`)

		// Note: In a full implementation, you might also:
		// - Add the calculator to a registry file
		// - Update sitemap
		// - Generate TypeScript types
	} catch (error) {
		console.error('Error generating calculator:')
		console.error(error instanceof Error ? error.message : String(error))
		process.exit(1)
	}
}

main()

