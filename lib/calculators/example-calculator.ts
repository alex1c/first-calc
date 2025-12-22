/**
 * Utility to execute calculator examples with real calculations
 * This ensures examples use the same calculation logic as the calculator itself
 */

import type { CalculatorDefinitionClient } from './types'

/**
 * Execute calculation for an example
 * Uses the calculator's own calculation function
 */
/**
 * Convert example inputs to proper types based on calculator input definitions
 */
function convertExampleInputs(
	calculator: CalculatorDefinitionClient,
	exampleInputs: Record<string, number | string>,
): Record<string, number | string> {
	const converted: Record<string, number | string> = {}
	
	calculator.inputs.forEach((input) => {
		const value = exampleInputs[input.name]
		
		// If value is explicitly provided, use it
		if (value !== undefined && value !== null && value !== '') {
			// Convert based on input type
			if (input.type === 'number') {
				const numValue = typeof value === 'number' ? value : Number(value)
				converted[input.name] = isNaN(numValue) ? (input.defaultValue !== undefined ? input.defaultValue : 0) : numValue
			} else if (input.type === 'select') {
				// Keep select values as strings, but ensure they match expected format
				// Handle boolean-like strings
				if (value === 'true' || value === true) {
					converted[input.name] = 'true'
				} else if (value === 'false' || value === false) {
					converted[input.name] = 'false'
				} else {
					converted[input.name] = String(value)
				}
			} else {
				converted[input.name] = value
			}
		} else {
			// Use default value if available
			if (input.defaultValue !== undefined) {
				converted[input.name] = input.defaultValue
			} else if (input.type === 'number') {
				converted[input.name] = 0
			}
		}
	})
	
	// Also include any inputs not in the definition (for flexibility)
	Object.keys(exampleInputs).forEach((key) => {
		if (!(key in converted) && exampleInputs[key] !== undefined && exampleInputs[key] !== null) {
			converted[key] = exampleInputs[key]
		}
	})
	
	return converted
}

export async function executeExampleCalculation(
	calculator: CalculatorDefinitionClient,
	exampleInputs: Record<string, number | string>,
): Promise<Record<string, number | string | null> | null> {
	try {
		// Convert inputs to proper types
		const convertedInputs = convertExampleInputs(calculator, exampleInputs)
		
		// Use the calculator's calculate function if available
		if (calculator.calculate && typeof calculator.calculate === 'function') {
			return calculator.calculate(convertedInputs)
		}

		// If calculate is a string (calculationId), we need to fetch it via API
		// For client-side, we'll need to make an API call
		if (typeof calculator.calculate === 'string') {
			try {
				const response = await fetch(`/api/calculators/${calculator.id}/calculate`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						inputs: convertedInputs,
						locale: calculator.locale || 'en',
					}),
				})

				if (!response.ok) {
					const errorText = await response.text()
					console.warn(`API calculation failed for ${calculator.id}:`, response.status, response.statusText, errorText)
					return null
				}

				const data = await response.json()
				
				// Check for API errors
				if (data.error) {
					console.warn(`API calculation error for ${calculator.id}:`, data.error)
					return null
				}
				
				// API returns results in 'results' property
				const results = data.results
				
				// Validate that we got some results
				if (results && typeof results === 'object' && Object.keys(results).length > 0) {
					return results
				}
				
				console.warn(`API calculation returned empty results for ${calculator.id}`, data)
				return null
			} catch (fetchError) {
				console.error(`Fetch error for ${calculator.id}:`, fetchError)
				return null
			}
		}

		return null
	} catch (error) {
		console.error('Error executing example calculation:', error)
		return null
	}
}

/**
 * Format calculation result for display
 */
export function formatExampleResult(
	value: number | string | null | undefined,
	outputName: string,
	calculator: CalculatorDefinitionClient,
): string {
	if (value === null || value === undefined) {
		return 'N/A'
	}

	// Find output definition for formatting
	const outputDef = calculator.outputs.find((out) => out.name === outputName)

	if (typeof value === 'number') {
		// Format numbers with appropriate precision
		if (outputDef?.formatType === 'currency' || outputName.includes('cost') || outputName.includes('price') || outputName.includes('payment')) {
			return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
		}
		if (outputDef?.formatType === 'percentage' || outputName.includes('rate') || outputName.includes('percent')) {
			return `${value.toFixed(2)}%`
		}
		// Default number formatting
		return value.toLocaleString('en-US', { 
			minimumFractionDigits: value % 1 === 0 ? 0 : 2,
			maximumFractionDigits: value % 1 === 0 ? 0 : 2
		})
	}

	return String(value)
}

