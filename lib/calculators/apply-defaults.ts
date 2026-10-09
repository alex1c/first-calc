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
 * Narrative / schedule / mode-conditional fields that may legitimately be
 * null or omitted. Zero is always a valid numeric result and must never be
 * treated as missing (see investment-vs-savings inflationAdjustedBalance=0).
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
	// Conditionally meaningful — null when the related option/mode is unused
	'interestSaved',
	'timeSaved',
	'monthsSaved',
	'paybackPeriod',
	'breakevenYear',
	'cagr',
	'annualizedROI',
	// Mode-specific math / auto outputs
	'discriminant',
	'convertedValue',
	'totalFuelCost',
	'seasonalTotalCost',
	'costPerPerson',
	// Mode-specific finance outputs (future_balance vs required_savings, etc.)
	'requiredRetirementFund',
	'monthlyIncomeAchievable',
	'savingsGap',
	'requiredMonthlyContribution',
	'monthsToGoal',
	'profitMargin',
	'inflationAdjustedBalance',
	'savingsInflationAdjustedBalance',
	'investmentInflationAdjustedBalance',
	'finalBalance',
	'totalContributed',
	'totalEarnings',
	'monthlyRetirementIncome',
	'comparisonTable',
	'winner',
	'bestLoanByMetric',
])

/**
 * Ensure the calculation produced at least one meaningful required output.
 *
 * Multi-mode calculators intentionally leave other declared outputs null
 * (discriminant for linear equations, costPerPerson when split is off, etc.).
 * Numeric zero is a successful result, never a missing output.
 */
export function assertRequiredOutputsPresent(
	calculator: CalculatorDefinition,
	results: Record<string, unknown>,
): void {
	const required = calculator.outputs.filter(
		(output) => !OPTIONAL_OUTPUT_NAMES.has(output.name),
	)
	if (required.length === 0) return

	const present = required.filter((output) => {
		const value = results[output.name]
		return value !== null && value !== undefined
	})

	if (present.length === 0) {
		throw new CalculationDomainError(
			`Calculation did not produce required results: ${required
				.map((output) => output.name)
				.join(', ')}`,
		)
	}
}
