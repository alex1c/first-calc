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
		let detectedLocale = 'en'
		if (filename.startsWith('schema.ru.') || filename.includes('.ru.')) {
			detectedLocale = 'ru'
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

		// Extract texts from schema (if present) for items file
		const itemsContent: any = {}
		if ('title' in schema) {
			itemsContent.title = (schema as any).title
		}
		if ('description' in schema) {
			itemsContent.shortDescription = (schema as any).description
		}
		if ('howTo' in schema) {
			itemsContent.howTo = (schema as any).howTo
		}
		if ('examples' in schema) {
			itemsContent.examples = (schema as any).examples
		}
		if ('faq' in schema) {
			itemsContent.faq = (schema as any).faq
		}
		if ('meta' in schema && (schema as any).meta) {
			itemsContent.seo = {
				keywords: (schema as any).meta.keywords,
			}
		}

		// Generate missing content if needed
		if (!itemsContent.howTo || !itemsContent.faq) {
			console.log('Generating missing content...')
			const generated = await generateCalculatorContent(schema as any)

			if (!itemsContent.howTo) {
				itemsContent.howTo = generated.howTo
			}
			if (!itemsContent.faq) {
				itemsContent.faq = generated.faq
			}
		}

		// Remove text fields from schema (structure only)
		const structureSchema: any = {
			id: schema.id,
			category: schema.category,
			slug: schema.slug,
			inputs: schema.inputs.map((input: any) => ({
				name: input.name,
				type: input.type,
				unit: input.unit,
				min: input.min,
				max: input.max,
				step: input.step,
				options: input.options,
				defaultValue: input.defaultValue,
			})),
			outputs: schema.outputs.map((output: any) => ({
				name: output.name,
			})),
			formula: schema.formula,
			variables: schema.variables,
			relatedIds: schema.relatedIds,
			standardIds: schema.standardIds,
		}

		// Convert to definition (for validation)
		const definition = await schemaToDefinition(structureSchema, detectedLocale)

		// Create calculators directory if it doesn't exist
		const calculatorsDir = path.join(process.cwd(), 'data', 'calculators')
		await fs.mkdir(calculatorsDir, { recursive: true })

		// Save JSON schema file (structure only)
		const jsonPath = path.join(calculatorsDir, `${schema.slug}.json`)
		await fs.writeFile(jsonPath, JSON.stringify(structureSchema, null, 2))
		console.log(`✓ Saved schema to ${jsonPath}`)

		// Create items file in locales
		const itemsDir = path.join(
			process.cwd(),
			'locales',
			detectedLocale,
			'calculators',
			'items',
		)
		await fs.mkdir(itemsDir, { recursive: true })
		const itemsPath = path.join(itemsDir, `${schema.slug}.json`)

		// Add inputs/outputs labels if present in original schema
		if ('inputs' in schema && Array.isArray((schema as any).inputs)) {
			itemsContent.inputs = (schema as any).inputs.map((input: any) => ({
				label: input.label || input.name,
				placeholder: input.placeholder,
				helpText: input.helpText,
				unitLabel: input.unit,
			}))
		}
		if ('outputs' in schema && Array.isArray((schema as any).outputs)) {
			itemsContent.outputs = (schema as any).outputs.map((output: any) => ({
				label: output.label || output.name,
				unitLabel: output.unit,
			}))
		}

		await fs.writeFile(itemsPath, JSON.stringify(itemsContent, null, 2))
		console.log(`✓ Saved items content to ${itemsPath}`)

		// Create public directory for OG image placeholder
		const publicDir = path.join(process.cwd(), 'public', 'calculators', schema.slug)
		await fs.mkdir(publicDir, { recursive: true })

		// Create placeholder OG image info (actual image generation would be done separately)
		const ogInfo = {
			slug: schema.slug,
			id: schema.id,
			category: schema.category,
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
		console.log(`Locale: ${detectedLocale}`)
		console.log(`\nFiles created:`)
		console.log(`  - Schema: ${jsonPath}`)
		console.log(`  - Items: ${itemsPath}`)
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

