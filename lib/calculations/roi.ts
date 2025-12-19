/**
 * ROI (Return on Investment) calculation functions
 * Calculates return on investment percentage and net profit
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate ROI (Return on Investment)
 * 
 * Formula: ROI = ((Return Value - Investment Cost) / Investment Cost) × 100
 * 
 * @param inputs - Input values including investment cost and return value
 * @returns Calculated ROI metrics
 */
export function calculateROI(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const investmentCost = Number(inputs.investmentCost || inputs.initialInvestment || inputs.cost || 0)
	const returnValue = Number(inputs.returnValue || inputs.finalValue || inputs.return || 0)
	const timePeriod = Number(inputs.timePeriod || 1)
	const timeUnit = String(inputs.timeUnit || 'years').toLowerCase()

	// Validation
	if (
		isNaN(investmentCost) ||
		isNaN(returnValue) ||
		investmentCost <= 0 ||
		returnValue < 0
	) {
		throw new Error('Invalid input values. Investment cost must be positive, and return value must be non-negative.')
	}

	// Calculate net profit
	const netProfit = returnValue - investmentCost

	// Calculate ROI percentage
	const roi = (netProfit / investmentCost) * 100

	// Calculate annualized ROI and CAGR
	let annualizedROI = roi
	let cagr = 0
	const years = timeUnit === 'years' ? timePeriod : timePeriod / 12
	
	if (years > 0 && returnValue > 0 && investmentCost > 0) {
		// Annualized ROI: (ROI / Time Period) × 100
		annualizedROI = (roi / years)
		
		// CAGR: ((Return Value / Investment Cost)^(1/Years) - 1) × 100
		const growthFactor = returnValue / investmentCost
		if (growthFactor > 0) {
			cagr = (Math.pow(growthFactor, 1 / years) - 1) * 100
		}
	}

	// Calculate payback period (simplified - assumes constant return)
	// Payback period = Investment Cost / Annual Return
	let paybackPeriod = 0
	if (returnValue > investmentCost && years > 0) {
		const annualReturn = (returnValue - investmentCost) / years
		if (annualReturn > 0) {
			paybackPeriod = investmentCost / annualReturn
		}
	}

	return {
		roi: Math.round(roi * 100) / 100,
		netProfit: Math.round(netProfit * 100) / 100,
		roiPercentage: Math.round(roi * 100) / 100,
		annualizedROI: Math.round(annualizedROI * 100) / 100,
		cagr: Math.round(cagr * 100) / 100,
		paybackPeriod: Math.round(paybackPeriod * 100) / 100,
		investmentCost: Math.round(investmentCost * 100) / 100,
		returnValue: Math.round(returnValue * 100) / 100,
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateROI', calculateROI)

