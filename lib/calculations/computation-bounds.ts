/**
 * Hard caps for user-driven iteration / allocation in calculation engines.
 * Form validation is not trusted — every engine must enforce these limits itself.
 */

import { CalculationDomainError } from '@/lib/calculations/domain-error'

/** Maximum years for year-by-year depreciation / ownership tables */
export const MAX_OWNERSHIP_YEARS = 50

/** Maximum loan / investment horizon in years */
export const MAX_HORIZON_YEARS = 50

/** Maximum amortization / payment schedule rows retained in a result payload */
export const MAX_SCHEDULE_ROWS = 360

/** Maximum inner simulation months (extra-payment loops, etc.) */
export const MAX_SIMULATION_MONTHS = 1200

/** Maximum random numbers generated in one request */
export const MAX_RANDOM_QUANTITY = 10_000

/**
 * Clamp a requested period count and throw if it exceeds the hard ceiling.
 * Prefer throwing over silently truncating when the input is clearly hostile.
 */
export function assertBoundedIterations(
	count: number,
	max: number,
	label: string,
): number {
	if (!Number.isFinite(count) || count < 0) {
		throw new CalculationDomainError(
			`${label} must be a non-negative finite number`,
		)
	}
	const rounded = Math.floor(count)
	if (rounded > max) {
		throw new CalculationDomainError(
			`${label} exceeds the maximum allowed value of ${max}`,
		)
	}
	return rounded
}

/**
 * Cap schedule length for result payloads without changing total interest math
 * that may still iterate up to a separate simulation bound.
 */
export function capScheduleRows<T>(rows: T[], max: number = MAX_SCHEDULE_ROWS): T[] {
	if (rows.length <= max) return rows
	return rows.slice(0, max)
}
