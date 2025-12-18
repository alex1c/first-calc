#!/usr/bin/env tsx

/**
 * Ensure EN items script
 * Creates EN items files for all calculators that don't have them
 * Uses autogen to generate content
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import {
	validateCalculatorSchema,
	type CalculatorSchema,
} from '../lib/calculators/schema'
import { generateCalculatorContent } from '../lib/content/autogen'

async function main() {
	console.log('🔍 Checking for missing EN items files...\n')

	const calculatorsDir = path.join(process.cwd(), 'data', 'calculators')
	const enItemsDir = path.join(process.cwd(), 'locales', 'en', 'calculators', 'items')

	// Ensure directories exist
	await fs.mkdir(enItemsDir, { recursive: true })

	// Get all calculator schema files
	const files = await fs.readdir(calculatorsDir)
	const schemaFiles = files.filter(
		(file) => file.endsWith('.json') && !file.endsWith('.ru.json'),
	)

	let created = 0
	let skipped = 0
	let errors = 0

	for (const file of schemaFiles) {
		const slug = file.replace('.json', '')
		const enItemsPath = path.join(enItemsDir, `${slug}.json`)

		// Check if EN items file already exists
		try {
			await fs.access(enItemsPath)
			console.log(`⏭️  Skipping ${slug} (EN items already exists)`)
			skipped++
			continue
		} catch {
			// File doesn't exist, need to create it
		}

		try {
			// Read schema file
			const schemaPath = path.join(calculatorsDir, file)
			const schemaContent = await fs.readFile(schemaPath, 'utf-8')
			const schema: CalculatorSchema = JSON.parse(schemaContent)

			// Validate schema
			const validation = validateCalculatorSchema(schema)
			if (!validation.valid) {
				console.error(`❌ Invalid schema for ${slug}:`)
				validation.errors.forEach((error) => console.error(`   - ${error}`))
				errors++
				continue
			}

			// Generate content using autogen
			console.log(`📝 Generating EN items for ${slug}...`)
			
			// Create a schema with labels for autogen (use name as label if label not present)
			const schemaWithLabels: any = {
				...schema,
				inputs: schema.inputs.map((input: any) => ({
					...input,
					label: input.label || input.name.charAt(0).toUpperCase() + input.name.slice(1),
				})),
				outputs: schema.outputs.map((output: any) => ({
					...output,
					label: output.label || output.name.charAt(0).toUpperCase() + output.name.slice(1),
				})),
				title: (schema as any).title || schema.slug
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
				description: (schema as any).description || `Calculate ${schema.slug.replace(/-/g, ' ')}`,
			}
			
			const generated = await generateCalculatorContent(schemaWithLabels)

			// Create items content
			// Try to get title from schema if it exists (from RU version)
			const titleFromSchema = (schema as any).title
			const itemsContent: any = {
				title: titleFromSchema || schema.slug
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
				shortDescription: (schema as any).description || `Calculate ${schema.slug.replace(/-/g, ' ')}`,
				howTo: generated.howTo,
				faq: generated.faq,
				examples: generated.examples,
			}

			// Add inputs/outputs labels (always add them)
			if (schema.inputs && schema.inputs.length > 0) {
				itemsContent.inputs = schema.inputs.map((input: any) => ({
					label: input.label || input.name.charAt(0).toUpperCase() + input.name.slice(1),
					unitLabel: input.unit || '',
					placeholder: input.placeholder || `Enter ${input.name}`,
					helpText: input.helpText,
				}))
			}

			if (schema.outputs && schema.outputs.length > 0) {
				itemsContent.outputs = schema.outputs.map((output: any) => ({
					label: output.label || output.name.charAt(0).toUpperCase() + output.name.slice(1),
					unitLabel: output.unit || '',
				}))
			}

			// Add SEO if present in schema
			if ((schema as any).meta?.keywords) {
				itemsContent.seo = {
					keywords: (schema as any).meta.keywords,
				}
			}

			// Save items file
			await fs.writeFile(
				enItemsPath,
				JSON.stringify(itemsContent, null, 2) + '\n',
				'utf-8',
			)

			console.log(`✅ Created ${enItemsPath}`)
			created++
		} catch (error) {
			console.error(`❌ Error processing ${slug}:`, error)
			errors++
		}
	}

	console.log(`\n📊 Summary:`)
	console.log(`   ✅ Created: ${created}`)
	console.log(`   ⏭️  Skipped: ${skipped}`)
	console.log(`   ❌ Errors: ${errors}`)

	if (errors > 0) {
		process.exit(1)
	}
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})

