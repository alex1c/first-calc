/**
 * Merge calculator input defaults into a request payload before calculation.
 * Server-side defaults are required because API clients can omit fields that
 * the UI would otherwise seed from defaultValue.
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { CalculationDomainError } from '@/lib/calculations/domain-error'

/**
 * Apply defaultValue for any visible input that was omitted or left empty.
 */
export function mergeCalculatorInputDefaults(
	calculator: CalculatorDefinition,
	inputs: Record<string, unknown>,
	isVisible: (input: CalculatorDefinition['inputs'][0]) => boolean,
): Record<string, number | string | boolean> {
	const merged: Record<string, number | string | boolean> = {}

	for (const input of calculator.inputs) {
		if (!isVisible(input)) continue

		const raw = inputs[input.name]
		const isEmpty = raw === undefined || raw === null || raw === ''

		if (!isEmpty) {
			if (input.type === 'number') {
				merged[input.name] = Number(raw)
			} else if (typeof raw === 'boolean') {
				merged[input.name] = raw
			} else {
				merged[input.name] = String(raw)
			}
			continue
		}

		if (input.defaultValue !== undefined && input.defaultValue !== null) {
			merged[input.name] = input.defaultValue as number | string | boolean
		}
	}

	return merged
}

/**
 * Narrative / schedule fields that may legitimately be null or empty strings.
 */
const OPTIONAL_OUTPUT_NAMES = new Set([
	'formulaExplanation',
	'steps',
	'insights',
	'yearByYearTable',
	'yearlyBreakdown',
	'amortizationSchedule',
	'paymentBreakdown',
	'extraPaymentImpact',
	'breakdown',
	'explanation',
	'recommendations',
	'interpretation',
	'matchSummary',
	'insight',
	'timeToTarget',
	'payoffDate',
	// Conditionally meaningful — null when the related option is unused
	'interestSaved',
	'timeSaved',
	'monthsSaved',
	'paybackPeriod',
	'breakevenYear',
])

/**
 * Ensure declared calculator outputs are present (not null/undefined) unless optional.
 */
export function assertRequiredOutputsPresent(
	calculator: CalculatorDefinition,
	results: Record<string, unknown>,
): void {
	const missing: string[] = []
	for (const output of calculator.outputs) {
		if (OPTIONAL_OUTPUT_NAMES.has(output.name)) continue
		const value = results[output.name]
		if (value === null || value === undefined) {
			missing.push(output.name)
		}
	}
	if (missing.length > 0) {
		throw new CalculationDomainError(
			`Calculation did not produce required results: ${missing.join(', ')}`,
		)
	}
}
