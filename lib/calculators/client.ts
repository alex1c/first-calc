/**
 * Client-side utilities for calculators
 * Functions to convert server-side definitions to client-safe versions
 */

import type {
	CalculatorDefinition,
	CalculatorDefinitionClient,
} from './types'

/**
 * Convert CalculatorDefinition to client-safe version (removes calculate function)
 */
export function toClientDefinition(
	calculator: CalculatorDefinition,
): CalculatorDefinitionClient {
	const { calculate, ...clientSafe } = calculator
	return clientSafe
}

