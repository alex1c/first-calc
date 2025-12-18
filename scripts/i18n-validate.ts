#!/usr/bin/env ts-node

/**
 * i18n Validation Script
 * Validates translation files for consistency and completeness
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { locales, defaultLocale } from '../lib/i18n'

interface ValidationResult {
	success: boolean
	errors: string[]
	warnings: string[]
}

/**
 * Get all JSON files in a directory recursively
 */
async function getAllJsonFiles(dir: string): Promise<string[]> {
	const files: string[] = []
	try {
		const entries = await fs.readdir(dir, { withFileTypes: true })
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name)
			if (entry.isDirectory()) {
				const subFiles = await getAllJsonFiles(fullPath)
				files.push(...subFiles)
			} else if (entry.isFile() && entry.name.endsWith('.json')) {
				files.push(fullPath)
			}
		}
	} catch {
		// Directory doesn't exist, return empty
	}
	return files
}

/**
 * Load and parse JSON file
 */
async function loadJsonFile(filePath: string): Promise<any> {
	try {
		const content = await fs.readFile(filePath, 'utf-8')
		return JSON.parse(content)
	} catch (error) {
		throw new Error(`Failed to load ${filePath}: ${error}`)
	}
}

/**
 * Get all keys from a nested object
 */
function getAllKeys(obj: any, prefix = ''): string[] {
	const keys: string[] = []
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			keys.push(...getAllKeys(value, fullKey))
		} else {
			keys.push(fullKey)
		}
	}
	return keys
}

/**
 * Validate namespace files consistency
 */
async function validateNamespaces(): Promise<ValidationResult> {
	const result: ValidationResult = {
		success: true,
		errors: [],
		warnings: [],
	}

	const namespaceFiles = ['common.json', 'navigation.json', 'errors.json']

	for (const namespace of namespaceFiles) {
		const defaultLocaleKeys = new Set<string>()
		const defaultPath = path.join(process.cwd(), 'locales', defaultLocale, namespace)

		try {
			const defaultContent = await loadJsonFile(defaultPath)
			const keys = getAllKeys(defaultContent)
			keys.forEach((key) => defaultLocaleKeys.add(key))
		} catch (error) {
			result.errors.push(`Missing default namespace file: ${namespace}`)
			result.success = false
			continue
		}

		// Check other locales
		for (const locale of locales) {
			if (locale === defaultLocale) continue

			const localePath = path.join(process.cwd(), 'locales', locale, namespace)
			try {
				const localeContent = await loadJsonFile(localePath)
				const localeKeys = new Set(getAllKeys(localeContent))

				// Check for missing keys
				for (const key of defaultLocaleKeys) {
					if (!localeKeys.has(key)) {
						result.warnings.push(
							`Missing key "${key}" in ${locale}/${namespace}`,
						)
					}
				}

				// Check for extra keys
				for (const key of localeKeys) {
					if (!defaultLocaleKeys.has(key)) {
						result.warnings.push(
							`Extra key "${key}" in ${locale}/${namespace} (not in default)`,
						)
					}
				}
			} catch {
				result.warnings.push(`Missing namespace file: ${locale}/${namespace}`)
			}
		}
	}

	return result
}

/**
 * Validate items files existence
 */
async function validateItemsFiles(): Promise<ValidationResult> {
	const result: ValidationResult = {
		success: true,
		errors: [],
		warnings: [],
	}

	// Get all calculator slugs from data/calculators
	const calculatorsDir = path.join(process.cwd(), 'data', 'calculators')
	const calculatorFiles = await getAllJsonFiles(calculatorsDir)
	const calculatorSlugs = new Set<string>()

	for (const file of calculatorFiles) {
		if (file.endsWith('.ru.json')) continue // Skip locale-specific files
		try {
			const schema = await loadJsonFile(file)
			if (schema.slug) {
				calculatorSlugs.add(schema.slug)
			}
		} catch {
			// Skip invalid files
		}
	}

	// Check items files exist for default locale
	// Note: Missing items files are warnings during migration, not errors
	for (const slug of calculatorSlugs) {
		const itemsPath = path.join(
			process.cwd(),
			'locales',
			defaultLocale,
			'calculators',
			'items',
			`${slug}.json`,
		)
		try {
			await fs.access(itemsPath)
		} catch {
			result.warnings.push(
				`Missing items file for calculator: ${slug} (expected at ${itemsPath}) - will use fallback`,
			)
			// Don't fail validation for missing items during migration
			// result.success = false
		}
	}

	return result
}

/**
 * Check file sizes
 */
async function validateFileSizes(maxSizeKB = 50): Promise<ValidationResult> {
	const result: ValidationResult = {
		success: true,
		errors: [],
		warnings: [],
	}

	const localesDir = path.join(process.cwd(), 'locales')
	const allFiles = await getAllJsonFiles(localesDir)

	for (const file of allFiles) {
		try {
			const stats = await fs.stat(file)
			const sizeKB = stats.size / 1024
			if (sizeKB > maxSizeKB) {
				result.warnings.push(
					`Large file: ${path.relative(process.cwd(), file)} (${sizeKB.toFixed(2)} KB)`,
				)
			}
		} catch {
			// Skip files we can't read
		}
	}

	return result
}

/**
 * Main validation function
 */
async function main() {
	console.log('🔍 Validating i18n files...\n')

	const results: ValidationResult[] = []

	// Validate namespaces
	console.log('1. Validating namespace files...')
	const namespaceResult = await validateNamespaces()
	results.push(namespaceResult)

	// Validate items files
	console.log('2. Validating items files...')
	const itemsResult = await validateItemsFiles()
	results.push(itemsResult)

	// Validate file sizes
	console.log('3. Validating file sizes...')
	const sizeResult = await validateFileSizes()
	results.push(sizeResult)

	// Aggregate results
	const allErrors: string[] = []
	const allWarnings: string[] = []

	for (const result of results) {
		allErrors.push(...result.errors)
		allWarnings.push(...result.warnings)
	}

	// Print results
	if (allErrors.length > 0) {
		console.log('\n❌ Errors:')
		allErrors.forEach((error) => console.log(`  - ${error}`))
	}

	if (allWarnings.length > 0) {
		console.log('\n⚠️  Warnings:')
		allWarnings.forEach((warning) => console.log(`  - ${warning}`))
	}

	if (allErrors.length === 0 && allWarnings.length === 0) {
		console.log('\n✅ All validations passed!')
		process.exit(0)
	} else if (allErrors.length > 0) {
		console.log(`\n❌ Validation failed with ${allErrors.length} error(s)`)
		process.exit(1)
	} else {
		console.log(`\n⚠️  Validation passed with ${allWarnings.length} warning(s)`)
		process.exit(0)
	}
}

main().catch((error) => {
	console.error('Validation script error:', error)
	process.exit(1)
})

