#!/usr/bin/env tsx

/**
 * Generate RU items batch script
 * Reads slugs from docs/ru-batch-01.md and generates RU items files
 * Uses autogen to generate content
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import {
	validateCalculatorSchema,
	type CalculatorSchema,
} from '../lib/calculators/schema'
import { generateCalculatorContent } from '../lib/content/autogen'

/**
 * Parse slugs from ru-batch-01.md
 */
async function parseSlugsFromBatchFile(): Promise<string[]> {
	const batchFilePath = path.join(process.cwd(), 'docs', 'ru-batch-01.md')
	const content = await fs.readFile(batchFilePath, 'utf-8')
	
	// Extract slugs from markdown list (format: 1. slug-name)
	const slugPattern = /^\d+\.\s+([a-z0-9-]+)$/gm
	const slugs: string[] = []
	let match
	
	while ((match = slugPattern.exec(content)) !== null) {
		slugs.push(match[1])
	}
	
	return slugs
}

async function main() {
	console.log('🔍 Reading slugs from docs/ru-batch-01.md...\n')
	
	const slugs = await parseSlugsFromBatchFile()
	
	if (slugs.length === 0) {
		console.error('❌ No slugs found in docs/ru-batch-01.md')
		process.exit(1)
	}
	
	console.log(`📋 Found ${slugs.length} slugs to process\n`)
	
	const calculatorsDir = path.join(process.cwd(), 'data', 'calculators')
	const ruItemsDir = path.join(process.cwd(), 'locales', 'ru', 'calculators', 'items')
	
	// Ensure directories exist
	await fs.mkdir(ruItemsDir, { recursive: true })
	
	let created = 0
	let skipped = 0
	let errors = 0
	const errorList: string[] = []
	
	for (const slug of slugs) {
		const schemaPath = path.join(calculatorsDir, `${slug}.json`)
		const ruItemsPath = path.join(ruItemsDir, `${slug}.json`)
		
		// Check if RU items file already exists
		try {
			await fs.access(ruItemsPath)
			console.log(`⏭️  Skipping ${slug} (RU items already exists)`)
			skipped++
			continue
		} catch {
			// File doesn't exist, need to create it
		}
		
		// Check if schema file exists
		try {
			await fs.access(schemaPath)
		} catch {
			console.error(`❌ Schema file not found: ${schemaPath}`)
			errors++
			errorList.push(`${slug}: Schema file not found`)
			continue
		}
		
		try {
			// Read schema file
			const schemaContent = await fs.readFile(schemaPath, 'utf-8')
			const schema: CalculatorSchema = JSON.parse(schemaContent)
			
			// Validate schema
			const validation = validateCalculatorSchema(schema)
			if (!validation.valid) {
				console.error(`❌ Invalid schema for ${slug}:`)
				validation.errors.forEach((error) => console.error(`   - ${error}`))
				errors++
				errorList.push(`${slug}: Invalid schema`)
				continue
			}
			
			// Generate content using autogen
			console.log(`📝 Generating RU items for ${slug}...`)
			
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
			// Note: UI strings are not generated, only items content
			const itemsContent: any = {
				title: (schema as any).title || schema.slug
					.split('-')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
				shortDescription: (schema as any).description || `Calculate ${schema.slug.replace(/-/g, ' ')}`,
				longDescription: (schema as any).description || `Calculate ${schema.slug.replace(/-/g, ' ')}`,
				howTo: generated.howTo,
				faq: generated.faq,
				examples: generated.examples,
			}
			
			// Add inputs/outputs labels if present in schema
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
				ruItemsPath,
				JSON.stringify(itemsContent, null, 2) + '\n',
				'utf-8',
			)
			
			console.log(`✅ Created ${ruItemsPath}`)
			created++
		} catch (error) {
			console.error(`❌ Error processing ${slug}:`, error)
			errors++
			errorList.push(`${slug}: ${error instanceof Error ? error.message : String(error)}`)
		}
	}
	
	console.log(`\n📊 Summary:`)
	console.log(`   ✅ Created: ${created}`)
	console.log(`   ⏭️  Skipped: ${skipped}`)
	console.log(`   ❌ Errors: ${errors}`)
	
	if (errorList.length > 0) {
		console.log(`\n❌ Error details:`)
		errorList.forEach((error) => console.log(`   - ${error}`))
	}
	
	// Run validation
	console.log(`\n🔍 Running i18n validation...`)
	const { execSync } = require('child_process')
	try {
		execSync('npm run i18n:validate', { stdio: 'inherit' })
		console.log(`\n✅ Validation passed`)
	} catch (error) {
		console.error(`\n❌ Validation failed`)
		process.exit(1)
	}
	
	if (errors > 0) {
		process.exit(1)
	}
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})

