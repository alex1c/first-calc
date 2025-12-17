import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'

/**
 * Get calculators that are based on a specific standard
 */
export async function getCalculatorsByStandard(
	standardId: string,
	locale: string = 'en',
): Promise<CalculatorDefinition[]> {
	const allCalculators = await calculatorRegistry.getAll(locale)
	return allCalculators.filter((calc) => calc.standardIds?.includes(standardId))
}

/**
 * Get standards for a specific calculator
 */
export async function getStandardsForCalculator(
	calculatorId: string,
	locale: string = 'en',
): Promise<string[]> {
	const calculator = await calculatorRegistry.getById(calculatorId, locale)
	return calculator?.standardIds || []
}

