#!/usr/bin/env tsx

/**
 * Script to migrate calculator JSON schemas to items files
 * Extracts text content from schema files and creates items files
 */

import * as fs from 'fs/promises'
import * as path from 'path'

interface OldSchema {
	id: string
	locale?: string
	category: string
	slug: string
	title?: string
	description?: string
	inputs?: Array<{
		name: string
		label?: string
		placeholder?: string
		helpText?: string
		unit?: string
	}>
	outputs?: Array<{
		name: string
		label?: string
		unit?: string
	}>
	howTo?: string[]
	examples?: Array<{
		input: Record<string, number>
		result: Record<string, number>
		title?: string
		description?: string
	}>
	faq?: Array<{ question: string; answer: string }>
	meta?: {
		keywords?: string[]
	}
}

async function migrateCalculator(schemaPath: string) {
	try {
		const content = await fs.readFile(schemaPath, 'utf-8')
		const schema: OldSchema = JSON.parse(content)

		// Detect locale from filename
		const filename = path.basename(schemaPath)
		let locale = schema.locale || 'en'
		if (filename.includes('.ru.')) {
			locale = 'ru'
		}

		// Extract items content
		const itemsContent: any = {}

		if (schema.title) itemsContent.title = schema.title
		if (schema.description) {
			itemsContent.shortDescription = schema.description
			itemsContent.longDescription = schema.description
		}
		if (schema.howTo) itemsContent.howTo = schema.howTo
		if (schema.examples) {
			itemsContent.examples = schema.examples.map((ex) => ({
				title: ex.title || 'Example',
				description: ex.description || '',
				steps: Object.entries(ex.input)
					.map(([key, value]) => {
						const input = schema.inputs?.find((inp) => inp.name === key)
						return `${input?.label || key}: ${value}${input?.unit ? ` ${input.unit}` : ''}`
					})
					.concat(
						Object.entries(ex.result).map(([key, value]) => {
							const output = schema.outputs?.find((out) => out.name === key)
							return `Result: ${output?.label || key} = ${value}${output?.unit ? ` ${output.unit}` : ''}`
						}),
					),
				resultDescription: Object.entries(ex.result)
					.map(([key, value]) => {
						const output = schema.outputs?.find((out) => out.name === key)
						return `${output?.label || key}: ${value}${output?.unit ? ` ${output.unit}` : ''}`
					})
					.join(', '),
			}))
		}
		if (schema.faq) itemsContent.faq = schema.faq
		if (schema.meta?.keywords) {
			itemsContent.seo = {
				keywords: schema.meta.keywords,
			}
		}

		// Add inputs/outputs labels
		if (schema.inputs) {
			itemsContent.inputs = schema.inputs.map((input) => ({
				label: input.label || input.name,
				placeholder: input.placeholder,
				helpText: input.helpText,
				unitLabel: input.unit,
			}))
		}
		if (schema.outputs) {
			itemsContent.outputs = schema.outputs.map((output) => ({
				label: output.label || output.name,
				unitLabel: output.unit,
			}))
		}

		// Create items file
		const itemsDir = path.join(
			process.cwd(),
			'locales',
			locale,
			'calculators',
			'items',
		)
		await fs.mkdir(itemsDir, { recursive: true })
		const itemsPath = path.join(itemsDir, `${schema.slug}.json`)
		await fs.writeFile(itemsPath, JSON.stringify(itemsContent, null, 2))

		console.log(`✓ Created items file: ${itemsPath}`)

		// Update schema file (remove text fields)
		const structureSchema: any = {
			id: schema.id,
			category: schema.category,
			slug: schema.slug,
			inputs: schema.inputs?.map((input: any) => ({
				name: input.name,
				type: input.type || 'number',
				unit: input.unit,
				min: input.min,
				max: input.max,
				step: input.step,
				options: input.options,
				defaultValue: input.defaultValue,
			})),
			outputs: schema.outputs?.map((output: any) => ({
				name: output.name,
			})),
			formula: (schema as any).formula,
			variables: (schema as any).variables,
			relatedIds: (schema as any).relatedIds,
			standardIds: (schema as any).standardIds,
		}

		await fs.writeFile(schemaPath, JSON.stringify(structureSchema, null, 2))
		console.log(`✓ Updated schema file: ${schemaPath}`)
	} catch (error) {
		console.error(`Error migrating ${schemaPath}:`, error)
	}
}

async function main() {
	const calculatorsDir = path.join(process.cwd(), 'data', 'calculators')
	const files = await fs.readdir(calculatorsDir)

	// Filter JSON files (skip .ru.json, process only base files)
	const schemaFiles = files.filter(
		(f) => f.endsWith('.json') && !f.includes('.ru.'),
	)

	console.log(`Found ${schemaFiles.length} calculator schemas to migrate\n`)

	for (const file of schemaFiles) {
		const schemaPath = path.join(calculatorsDir, file)
		await migrateCalculator(schemaPath)
	}

	// Also process .ru.json files
	const ruFiles = files.filter((f) => f.includes('.ru.json'))
	console.log(`\nProcessing ${ruFiles.length} RU locale files...\n`)

	for (const file of ruFiles) {
		const schemaPath = path.join(calculatorsDir, file)
		await migrateCalculator(schemaPath)
	}

	console.log('\n✓ Migration complete!')
}

main().catch(console.error)



