/**
 * Calculator loader - supports loading from JSON Schema files
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
 */
export async function loadCalculatorFromSchema(
	filePath: string,
): Promise<CalculatorDefinition> {
	const schema = await loadCalculatorSchema(filePath)
	return schemaToDefinition(schema)
}

/**
 * Get calculator by ID and locale (supports both data/calculators.ts and JSON schemas)
 */
export async function getCalculatorById(
	id: string,
	locale: string = 'en',
): Promise<CalculatorDefinition | undefined> {
	// First try to find in existing calculators
	const existing = calculators.find(
		(calc) => calc.id === id && calc.locale === locale,
	)
	if (existing) {
		return existing
	}

	// Try to load from JSON schema
	try {
		const schemaPath = `data/calculators/${id}.json`
		return await loadCalculatorFromSchema(schemaPath)
	} catch {
		// Schema file doesn't exist, return undefined
		return undefined
	}
}

/**
 * Get calculator by slug, category, and locale
 */
export async function getCalculatorBySlug(
	category: string,
	slug: string,
	locale: string = 'en',
): Promise<CalculatorDefinition | undefined> {
	// First try to find in existing calculators
	const existing = calculators.find(
		(calc) =>
			calc.category === category &&
			calc.slug === slug &&
			calc.locale === locale,
	)
	if (existing) {
		return existing
	}

	// Try to load from JSON schema (slug-based lookup)
	try {
		const schemaPath = `data/calculators/${slug}.json`
		const definition = await loadCalculatorFromSchema(schemaPath)
		if (
			definition.category === category &&
			definition.slug === slug &&
			definition.locale === locale
		) {
			return definition
		}
	} catch {
		// Schema file doesn't exist
	}

	return undefined
}

/**
 * Validate and convert JSON schema to calculator definition
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

