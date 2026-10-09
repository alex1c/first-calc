/**
 * ROI with optional time-based metrics (annualized ROI, CAGR, payback period).
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'

function round2(value: number): number {
	return Math.round(value * 100) / 100
}

export const calculateROI: CalculationFunction = (inputs) => {
	const investmentCost = Number(
		inputs.investmentCost || inputs.initialInvestment || inputs.cost || 0,
	)
	const returnValue = Number(
		inputs.returnValue || inputs.finalValue || inputs.return || 0,
	)
	const timePeriod = Number(inputs.timePeriod ?? 1)
	const timeUnit = String(inputs.timeUnit || 'years').toLowerCase()
	const additionalCosts = Number(inputs.additionalCosts || 0)
	if (
		isNaN(investmentCost) ||
		isNaN(returnValue) ||
		isNaN(additionalCosts) ||
		isNaN(timePeriod) ||
		investmentCost <= 0 ||
		returnValue < 0 ||
		additionalCosts < 0 ||
		timePeriod <= 0
	) {
		throw new CalculationDomainError('ROI inputs are out of valid range')
	}

	const years =
		timeUnit === 'months' ? timePeriod / 12 : timePeriod

	const totalInvestment = investmentCost + additionalCosts
	const netProfit = returnValue - totalInvestment
	const roiPercentage = (netProfit / totalInvestment) * 100
	const profitMargin = returnValue > 0 ? (netProfit / returnValue) * 100 : 0

	// Lump-sum model: CAGR equals annualized ROI (same closed form).
	let cagr: number | null = null
	let annualizedROI: number | null = null
	if (years > 0 && totalInvestment > 0 && returnValue > 0) {
		const growthFactor = returnValue / totalInvestment
		const rate = Math.pow(growthFactor, 1 / years) - 1
		cagr = rate * 100
		annualizedROI = cagr
	}

	let paybackPeriod: number | null = null
	if (netProfit > 0 && years > 0) {
		const profitPerYear = netProfit / years
		paybackPeriod = round2(totalInvestment / profitPerYear)
	}

	let interpretation = ''
	if (roiPercentage < 0) {
		interpretation = `Negative ROI (${round2(roiPercentage)}%).`
	} else {
		interpretation = `ROI ${round2(roiPercentage)}% over ${round2(years)} year(s).`
	}

	const formulaExplanation = [
		interpretation,
		cagr !== null ? `CAGR: ${round2(cagr)}%` : '',
		paybackPeriod !== null ? `Payback: ${paybackPeriod} years` : '',
	]
		.filter(Boolean)
		.join(' ')

	const roundedRoi = round2(roiPercentage)
	const roundedMargin =
		returnValue > 0 ? round2(profitMargin) : null

	return {
		roiPercentage: roundedRoi,
		roi: roundedRoi,
		netProfit: round2(netProfit),
		totalInvestment: round2(totalInvestment),
		profitMargin: roundedMargin,
		formulaExplanation,
		annualizedROI: annualizedROI !== null ? round2(annualizedROI) : null,
		cagr: cagr !== null ? round2(cagr) : null,
		paybackPeriod,
	}
}

registerCalculation('calculateROI', calculateROI)
