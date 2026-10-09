/**
 * Inflation adjustment between two years at a constant annual rate.
 * Direction follows (endYear - startYear): future years inflate, past years deflate.
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

export const calculateInflationAdjustment: CalculationFunction = (inputs) => {
	const amount = Number(inputs.amount)
	const startYear = Number(inputs.startYear)
	const endYear = Number(inputs.endYear)
	const inflationRate = Number(inputs.inflationRate)

	if (
		!Number.isFinite(amount) ||
		!Number.isFinite(startYear) ||
		!Number.isFinite(endYear) ||
		!Number.isFinite(inflationRate)
	) {
		throw new Error('Inflation adjustment inputs must be finite numbers')
	}
	if (amount < 0) {
		throw new Error('Amount must be non-negative')
	}
	if (inflationRate < 0) {
		throw new Error('Inflation rate must be non-negative')
	}

	// Signed year delta: positive → inflate forward; negative → deflate backward
	const yearDelta = endYear - startYear
	const factor = Math.pow(1 + inflationRate / 100, yearDelta)

	if (!Number.isFinite(factor)) {
		throw new Error('Inflation factor overflowed')
	}

	const adjustedAmount = amount * factor
	if (!Number.isFinite(adjustedAmount)) {
		throw new Error('Adjusted amount overflowed')
	}

	// Percent change relative to the original amount (signed with year direction)
	const totalInflation = (factor - 1) * 100

	return {
		adjustedAmount,
		totalInflation,
	}
}

registerCalculation('calculateInflationAdjustment', calculateInflationAdjustment)