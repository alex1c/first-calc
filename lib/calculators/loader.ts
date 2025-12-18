/**
 * Calculator loader - supports loading from JSON Schema files
 * 
 * This module provides functions to load calculator definitions from:
 * 1. Hardcoded definitions in data/calculators.ts
 * 2. JSON schema files in data/calculators/*.json
 * 
 * It handles disabled calculators (isEnabled: false) by filtering them out.
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculators } from '@/data/calculators'
import {
	loadCalculatorSchema,
	schemaToDefinition,
	validateCalculatorSchema,
} from './schema'

/**
 * Load calculator from JSON Schema file
 * 
 * Loads a calculator definition from a JSON schema file, converts it to a CalculatorDefinition,
 * and filters out disabled calculators.
 * 
 * @param filePath - Path to the JSON schema file (e.g., "data/calculators/square-root.json")
 * @param locale - Locale code for loading translations (default: 'en')
 * @returns CalculatorDefinition if loaded and enabled, undefined otherwise
 * 
 * @example
 * const calc = await loadCalculatorFromSchema('data/calculators/square-root.json', 'en')
 */
export async function loadCalculatorFromSchema(
	filePath: string,
	locale: string = 'en',
): Promise<CalculatorDefinition | undefined> {
	const schema = await loadCalculatorSchema(filePath)
	
	// Skip disabled calculators (soft disable feature)
	// Calculators with isEnabled: false are filtered out from listings
	if (schema.isEnabled === false) {
		return undefined
	}
	
	return schemaToDefinition(schema, locale)
}

/**
 * Get calculator by ID and locale
 * 
 * Searches for a calculator in both hardcoded definitions and JSON schema files.
 * Priority: hardcoded definitions first, then JSON schemas.
 * 
 * @param id - Calculator ID (e.g., "square-root")
 * @param locale - Locale code (default: 'en')
 * @returns CalculatorDefinition if found and enabled, undefined otherwise
 * 
 * @example
 * const calc = await getCalculatorById('square-root', 'en')
 */
export async function getCalculatorById(
	id: string,
	locale: string = 'en',
): Promise<CalculatorDefinition | undefined> {
	// First try to find in existing hardcoded calculators (data/calculators.ts)
	// These have higher priority than JSON schemas
	const existing = calculators.find(
		(calc) => calc.id === id && calc.locale === locale,
	)
	if (existing) {
		return existing
	}

	// Try to load from JSON schema file (data/calculators/{id}.json)
	try {
		const schemaPath = `data/calculators/${id}.json`
		const definition = await loadCalculatorFromSchema(schemaPath, locale)
		// Filter out disabled calculators
		if (!definition || definition.isEnabled === false) {
			return undefined
		}
		return definition
	} catch {
		// Schema file doesn't exist or failed to load, return undefined
		return undefined
	}
}

/**
 * Get calculator by slug, category, and locale
 * 
 * Searches for a calculator using its slug, category, and locale.
 * Used for routing (e.g., /calculators/math/square-root).
 * 
 * @param category - Calculator category (e.g., "math", "finance")
 * @param slug - Calculator slug (e.g., "square-root")
 * @param locale - Locale code (default: 'en')
 * @returns CalculatorDefinition if found and enabled, undefined otherwise
 * 
 * @example
 * const calc = await getCalculatorBySlug('math', 'square-root', 'en')
 */
export async function getCalculatorBySlug(
	category: string,
	slug: string,
	locale: string = 'en',
): Promise<CalculatorDefinition | undefined> {
	// First try to find in existing hardcoded calculators
	const existing = calculators.find(
		(calc) =>
			calc.category === category &&
			calc.slug === slug &&
			calc.locale === locale,
	)
	if (existing) {
		return existing
	}

	// Try to load from JSON schema file (slug-based lookup)
	// File name is based on slug: data/calculators/{slug}.json
	try {
		const schemaPath = `data/calculators/${slug}.json`
		const definition = await loadCalculatorFromSchema(schemaPath, locale)
		// Filter out disabled calculators
		if (!definition || definition.isEnabled === false) {
			return undefined
		}
		// Verify that the loaded calculator matches the requested category and slug
		if (
			definition.category === category &&
			definition.slug === slug &&
			definition.locale === locale
		) {
			return definition
		}
	} catch {
		// Schema file doesn't exist or failed to load
	}

	return undefined
}

/**
 * Validate and convert JSON schema to calculator definition
 * 
 * Validates a schema object and converts it to a CalculatorDefinition.
 * Throws an error if validation fails.
 * 
 * @param schema - Unknown schema object to validate and convert
 * @returns CalculatorDefinition
 * @throws Error if schema validation fails
 * 
 * @example
 * const definition = convertSchemaToDefinition({ id: 'test', ... })
 */
export function convertSchemaToDefinition(
	schema: unknown,
): CalculatorDefinition {
	const validation = validateCalculatorSchema(schema)
	if (!validation.valid) {
		throw new Error(`Invalid schema: ${validation.errors.join(', ')}`)
	}
	return schemaToDefinition(schema as import('./schema').CalculatorSchema)
}




