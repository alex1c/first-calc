import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'

/**
 * Get calculators that reference a specific standard id.
 *
 * Useful for building cross-links on standards hubs without implying compliance.
 */
export async function getCalculatorsByStandard(
        standardId: string,
        locale: string = 'en',
): Promise<CalculatorDefinition[]> {
        const allCalculators = await calculatorRegistry.getAll(locale)
        return allCalculators.filter((calc) => calc.standardIds?.includes(standardId))
}

/**
 * Get standard ids associated with a calculator.
 */
export async function getStandardsForCalculator(
        calculatorId: string,
        locale: string = 'en',
): Promise<string[]> {
	const calculator = await calculatorRegistry.getById(calculatorId, locale)
	return calculator?.standardIds || []
}

