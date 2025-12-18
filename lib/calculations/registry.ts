/**
 * Calculation functions registry
 * 
 * Maps calculationId to actual calculation functions
 * Functions are imported gradually as calculators are migrated
 */

/**
 * Calculation function type
 * Takes input values and returns output values
 */
export type CalculationFunction = (
	inputs: Record<string, number | string>,
) => Record<string, number | string>

/**
 * Calculation registry
 * Maps calculationId to calculation function
 */
export const calculations: Record<string, CalculationFunction> = {}

/**
 * Register a calculation function
 * 
 * @param calculationId - Unique identifier for the calculation
 * @param fn - Calculation function
 */
export function registerCalculation(
	calculationId: string,
	fn: CalculationFunction,
): void {
	calculations[calculationId] = fn
}

/**
 * Get calculation function by ID
 * 
 * @param calculationId - Calculation ID
 * @returns Calculation function or undefined if not found
 */
export function getCalculation(calculationId: string): CalculationFunction | undefined {
	return calculations[calculationId]
}

/**
 * Check if calculation is registered
 * 
 * @param calculationId - Calculation ID
 * @returns True if calculation is registered
 */
export function hasCalculation(calculationId: string): boolean {
	return calculationId in calculations
}

