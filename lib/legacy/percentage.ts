/**
 * Percentage calculation functions for legacy routes
 */

/**
 * Calculate percentage of a number
 * @param value - Base number
 * @param percent - Percentage value
 * @returns Result of the calculation
 */
export function percentOf(value: number, percent: number): number {
	return (value * percent) / 100
}

/**
 * Increase a number by a percentage
 * @param value - Base number
 * @param percent - Percentage to add
 * @returns Result of the calculation
 */
export function increaseBy(value: number, percent: number): number {
	return value + (value * percent) / 100
}

/**
 * Decrease a number by a percentage
 * @param value - Base number
 * @param percent - Percentage to subtract
 * @returns Result of the calculation
 */
export function decreaseBy(value: number, percent: number): number {
	return value - (value * percent) / 100
}

/**
 * Calculate step-by-step breakdown for percentage calculation
 */
export function getPercentageSteps(
	value: number,
	percent: number,
	operation: 'of' | 'add' | 'subtract',
): string[] {
	const steps: string[] = []

	if (operation === 'of') {
		steps.push(`Step 1: ${percent}% of ${value}`)
		steps.push(`Step 2: (${value} × ${percent}) / 100`)
		const calculation = (value * percent) / 100
		steps.push(`Step 3: ${value * percent} / 100 = ${calculation.toFixed(2)}`)
		steps.push(`Result: ${calculation.toFixed(2)}`)
	} else if (operation === 'add') {
		steps.push(`Step 1: Original value: ${value}`)
		steps.push(`Step 2: Calculate ${percent}% of ${value}`)
		const percentage = (value * percent) / 100
		steps.push(`Step 3: ${percent}% of ${value} = ${percentage.toFixed(2)}`)
		const result = value + percentage
		steps.push(`Step 4: ${value} + ${percentage.toFixed(2)} = ${result.toFixed(2)}`)
		steps.push(`Result: ${result.toFixed(2)}`)
	} else {
		// subtract
		steps.push(`Step 1: Original value: ${value}`)
		steps.push(`Step 2: Calculate ${percent}% of ${value}`)
		const percentage = (value * percent) / 100
		steps.push(`Step 3: ${percent}% of ${value} = ${percentage.toFixed(2)}`)
		const result = value - percentage
		steps.push(`Step 4: ${value} - ${percentage.toFixed(2)} = ${result.toFixed(2)}`)
		steps.push(`Result: ${result.toFixed(2)}`)
	}

	return steps
}
