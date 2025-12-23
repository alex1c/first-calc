#!/usr/bin/env tsx

/**
 * Polish RU items quality check script
 * Checks RU items files for quality issues and reports warnings
 */

import * as fs from 'fs/promises'
import * as path from 'path'

interface ItemsContent {
	title?: string
	shortDescription?: string
	longDescription?: string
	howTo?: string[]
	faq?: Array<{ question: string; answer: string }>
	examples?: Array<{ input: Record<string, any>; output: Record<string, any> }>
}

/**
 * Check quality of a single items file
 */
function checkQuality(slug: string, content: ItemsContent): string[] {
	const warnings: string[] = []
	
	// Check title
	if (!content.title || content.title.trim().length === 0) {
		warnings.push('Title is empty')
	}
	
	// Check shortDescription
	if (!content.shortDescription) {
		warnings.push('shortDescription is missing')
	} else if (content.shortDescription.length > 180) {
		warnings.push(`shortDescription is too long (${content.shortDescription.length} chars, max 180)`)
	}
	
	// Check howTo
	if (!content.howTo || !Array.isArray(content.howTo)) {
		warnings.push('howTo is missing or not an array')
	} else {
		const count = content.howTo.length
		if (count < 5) {
			warnings.push(`howTo has too few items (${count}, min 5)`)
		} else if (count > 10) {
			warnings.push(`howTo has too many items (${count}, max 10)`)
		}
	}
	
	// Check faq
	if (!content.faq || !Array.isArray(content.faq)) {
		warnings.push('faq is missing or not an array')
	} else {
		const count = content.faq.length
		if (count < 5) {
			warnings.push(`faq has too few items (${count}, min 5)`)
		} else if (count > 7) {
			warnings.push(`faq has too many items (${count}, max 7)`)
		}
	}
	
	// Check examples
	if (!content.examples || !Array.isArray(content.examples)) {
		warnings.push('examples is missing or not an array')
	} else {
		const count = content.examples.length
		if (count < 2) {
			warnings.push(`examples has too few items (${count}, min 2)`)
		} else if (count > 3) {
			warnings.push(`examples has too many items (${count}, max 3)`)
		}
	}
	
	return warnings
}

async function main() {
	console.log('🔍 Checking quality of RU items files...\n')
	
	const ruItemsDir = path.join(process.cwd(), 'locales', 'ru', 'calculators', 'items')
	
	// Get all RU items files
	const files = await fs.readdir(ruItemsDir)
	const jsonFiles = files.filter((file) => file.endsWith('.json'))
	
	if (jsonFiles.length === 0) {
		console.log('⚠️  No RU items files found')
		return
	}
	
	const issues: Array<{ slug: string; warnings: string[] }> = []
	
	for (const file of jsonFiles) {
		const slug = file.replace('.json', '')
		const filePath = path.join(ruItemsDir, file)
		
		try {
			const content = await fs.readFile(filePath, 'utf-8')
			const itemsContent: ItemsContent = JSON.parse(content)
			
			const warnings = checkQuality(slug, itemsContent)
			
			if (warnings.length > 0) {
				issues.push({ slug, warnings })
			}
		} catch (error) {
			issues.push({
				slug,
				warnings: [`Failed to parse file: ${error instanceof Error ? error.message : String(error)}`],
			})
		}
	}
	
	if (issues.length === 0) {
		console.log('✅ All RU items files meet quality standards\n')
		return
	}
	
	console.log(`⚠️  Found quality issues in ${issues.length} file(s):\n`)
	
	for (const { slug, warnings } of issues) {
		console.log(`📄 ${slug}:`)
		warnings.forEach((warning) => console.log(`   - ${warning}`))
		console.log()
	}
	
	console.log(`\n📊 Summary: ${issues.length} file(s) with issues out of ${jsonFiles.length} total`)
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})




