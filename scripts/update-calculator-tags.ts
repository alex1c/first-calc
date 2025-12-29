#!/usr/bin/env ts-node

/**
 * Script to update all calculator tags according to the new taxonomy
 * Usage: ts-node scripts/update-calculator-tags.ts
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { assignTagsToCalculator, normalizeCalculatorTags } from '../lib/tags/assigner'
import type { CalculatorSchema } from '../lib/calculators/schema'

async function updateCalculatorTags() {
	const calculatorsDir = path.join(__dirname, '../data/calculators')
	const files = await fs.readdir(calculatorsDir)
	
	const jsonFiles = files.filter((f) => f.endsWith('.json') && !f.includes('.ru.json'))
	
	console.log(`Found ${jsonFiles.length} calculator files to process\n`)
	
	let updated = 0
	let skipped = 0
	const errors: Array<{ file: string; error: string }> = []
	
	for (const file of jsonFiles) {
		const filePath = path.join(calculatorsDir, file)
		
		try {
			const content = await fs.readFile(filePath, 'utf-8')
			const calc: CalculatorSchema = JSON.parse(content)
			
			// Skip if calculator is disabled
			if (calc.isEnabled === false) {
				console.log(`⏭️  Skipping disabled: ${file}`)
				skipped++
				continue
			}
			
			// Normalize tags
			const newTags = normalizeCalculatorTags(calc)
			
			// Check if tags changed
			const oldTags = calc.tags || []
			const tagsChanged = 
				oldTags.length !== newTags.length ||
				!oldTags.every((tag) => newTags.includes(tag)) ||
				!newTags.every((tag) => oldTags.includes(tag))
			
			if (tagsChanged) {
				calc.tags = newTags
				const updatedContent = JSON.stringify(calc, null, 2) + '\n'
				await fs.writeFile(filePath, updatedContent, 'utf-8')
				console.log(`✅ Updated: ${file}`)
				console.log(`   Old: [${oldTags.join(', ')}]`)
				console.log(`   New: [${newTags.join(', ')}]`)
				updated++
			} else {
				console.log(`✓ Already correct: ${file}`)
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error)
			console.error(`❌ Error processing ${file}: ${errorMsg}`)
			errors.push({ file, error: errorMsg })
		}
	}
	
	console.log(`\n📊 Summary:`)
	console.log(`   Updated: ${updated}`)
	console.log(`   Skipped: ${skipped}`)
	console.log(`   Errors: ${errors.length}`)
	
	if (errors.length > 0) {
		console.log(`\n❌ Errors:`)
		errors.forEach(({ file, error }) => {
			console.log(`   ${file}: ${error}`)
		})
		process.exit(1)
	}
}

updateCalculatorTags().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})


