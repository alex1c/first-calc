import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

/**
 * Factory for creating test calculator definitions
 */
export function createTestCalculator(
	overrides?: Partial<CalculatorDefinitionClient>,
): CalculatorDefinitionClient {
	return {
		id: 'test-calculator',
		title: 'Test Calculator',
		shortDescription: 'A test calculator for testing purposes.',
		longDescription: 'A test calculator for testing purposes.',
		category: 'math',
		slug: 'test-calculator',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'value',
				type: 'number',
				label: 'Value',
				min: 0,
				max: 100,
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
			},
		],
		howToBullets: ['Step 1: Enter a value', 'Step 2: Click Calculate'],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1',
				inputDescription: 'Example input',
				steps: ['Step 1', 'Step 2'],
				resultDescription: 'Result is 20',
				inputs: { value: 10 },
				result: '20',
			},
		],
		faq: [],
		...overrides,
	}
}

/**
 * Create a calculator with formula engine
 * Note: This returns a type that includes calculate, which is not part of CalculatorDefinitionClient
 * but is needed for server-side calculations in tests
 */
export function createFormulaCalculator(
	formula: string,
	overrides?: Partial<CalculatorDefinitionClient>,
): CalculatorDefinitionClient & { calculate: string } {
	return {
		...createTestCalculator(overrides),
		calculate: formula,
	} as CalculatorDefinitionClient & { calculate: string }
}

