/**
 * Inflation adjustment between two years at a constant annual rate.
 * Preserves historical inflation-adjustment multi-output semantics.
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
		!Number.isFinite(inflationRate) ||
		amount < 0 ||
		inflationRate < 0
	) {
		return { adjustedAmount: null, totalInflation: null }
	}

	const years = Math.abs(endYear - startYear)
	const totalInflationRatio = Math.pow(1 + inflationRate / 100, years) - 1
	const adjustedAmount = amount * (1 + totalInflationRatio)

	return {
		adjustedAmount,
		totalInflation: totalInflationRatio * 100,
	}
}

registerCalculation('calculateInflationAdjustment', calculateInflationAdjustment)
