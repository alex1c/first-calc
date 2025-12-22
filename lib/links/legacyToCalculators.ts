/**
 * Mapping between legacy tools and new calculators
 * Used for cross-linking between legacy and calculator sections
 */

export interface LegacyToCalculatorMapping {
	legacyTool: string
	calculatorIds: string[]
	description?: string
}

/**
 * Get calculator IDs related to a legacy tool
 */
export function getCalculatorsForLegacyTool(
	legacyTool: string,
): string[] {
	const mappings: Record<string, string[]> = {
		'chislo-propisyu': ['numbers-to-words-calculator'],
		'numbers-to-words': ['numbers-to-words-calculator'],
		'percentage-of-a-number': ['percentage-of-a-number', 'add-percentage', 'subtract-percentage'],
		'add-subtract-percentage': ['add-percentage', 'subtract-percentage'],
		'roman-numerals-converter': [],
		factors: [],
		'number-format-in': [],
		range: [],
	}

	return mappings[legacyTool] || []
}

/**
 * Get legacy tools related to a calculator
 */
export function getLegacyToolsForCalculator(
	calculatorId: string,
): string[] {
	const mappings: Record<string, string[]> = {
		'numbers-to-words-calculator': ['chislo-propisyu', 'numbers-to-words'],
		'percentage-of-a-number': ['percentage-of-a-number', 'add-subtract-percentage'],
		'add-percentage': ['add-subtract-percentage'],
		'subtract-percentage': ['add-subtract-percentage'],
		'loan-payment': [],
		'compound-interest': [],
	}

	return mappings[calculatorId] || []
}








