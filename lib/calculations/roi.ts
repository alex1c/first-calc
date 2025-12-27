/**
 * Calculate ROI (Return on Investment) with comprehensive breakdown
 * Inputs: investmentCost, returnValue, timePeriod, additionalCosts, revenueType
 * Outputs: roiPercentage, netProfit, totalInvestment, profitMargin, formulaExplanation
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Calculate ROI with comprehensive breakdown
 */
export const calculateROI: CalculationFunction = (inputs) => {
	const investmentCost = Number(inputs.investmentCost || inputs.initialInvestment || inputs.cost || 0)
	const returnValue = Number(inputs.returnValue || inputs.finalValue || inputs.return || 0)
	const timePeriod = Number(inputs.timePeriod || 0) // Optional
	const additionalCosts = Number(inputs.additionalCosts || 0) // Optional
	const revenueType = String(inputs.revenueType || 'one-time').toLowerCase()

	// Validation
	if (
		isNaN(investmentCost) ||
		isNaN(returnValue) ||
		isNaN(additionalCosts) ||
		investmentCost <= 0 ||
		returnValue < 0 ||
		additionalCosts < 0
	) {
		return {
			roiPercentage: null,
			netProfit: null,
			totalInvestment: null,
			profitMargin: null,
			formulaExplanation: null,
		}
	}

	const totalInvestment = investmentCost + additionalCosts
	const netProfit = returnValue - totalInvestment

	// Calculate ROI percentage
	const roiPercentage = (netProfit / totalInvestment) * 100

	// Calculate profit margin (profit as percentage of return)
	const profitMargin = returnValue > 0 ? (netProfit / returnValue) * 100 : 0

	// Build interpretation
	let interpretation = ''
	if (roiPercentage < 0) {
		interpretation = `A ROI of ${roiPercentage.toFixed(2)}% means that for every $1 invested, you lost $${Math.abs(roiPercentage / 100).toFixed(2)}. This investment resulted in a loss of $${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
	} else if (roiPercentage === 0) {
		interpretation = `A ROI of 0% means you broke even - you recovered exactly what you invested with no profit or loss.`
	} else if (roiPercentage < 10) {
		interpretation = `A ROI of ${roiPercentage.toFixed(2)}% means that for every $1 invested, you earned $${(roiPercentage / 100).toFixed(2)} in profit. This is a relatively low return, which may not justify the investment risk.`
	} else if (roiPercentage < 25) {
		interpretation = `A ROI of ${roiPercentage.toFixed(2)}% means that for every $1 invested, you earned $${(roiPercentage / 100).toFixed(2)} in profit. This is a moderate return that may be acceptable depending on the investment type and risk level.`
	} else if (roiPercentage < 50) {
		interpretation = `A ROI of ${roiPercentage.toFixed(2)}% means that for every $1 invested, you earned $${(roiPercentage / 100).toFixed(2)} in profit. This is a good return that indicates a profitable investment.`
	} else {
		interpretation = `A ROI of ${roiPercentage.toFixed(2)}% means that for every $1 invested, you earned $${(roiPercentage / 100).toFixed(2)} in profit. This is an excellent return that indicates a highly profitable investment.`
	}

	// Build formula explanation
	let formulaExplanation = ''
	
	formulaExplanation = `ROI Calculation:\n\n1. Calculate Total Investment:\n   Total Investment = Investment Cost + Additional Costs\n   Total Investment = $${investmentCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${additionalCosts > 0 ? ` + $${additionalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}\n   Total Investment = $${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Calculate Net Profit:\n   Net Profit = Return Value - Total Investment\n   Net Profit = $${returnValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Net Profit = $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Calculate ROI Percentage:\n   ROI = (Net Profit / Total Investment) × 100\n   ROI = ($${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100\n   ROI = ${roiPercentage.toFixed(2)}%\n\n${profitMargin !== null && returnValue > 0 ? `4. Calculate Profit Margin:\n   Profit Margin = (Net Profit / Return Value) × 100\n   Profit Margin = ($${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${returnValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100\n   Profit Margin = ${profitMargin.toFixed(2)}%\n\n` : ''}Interpretation:\n${interpretation}\n\nROI measures the efficiency and profitability of an investment. A positive ROI indicates profit, while a negative ROI indicates loss. The higher the ROI, the more profitable the investment relative to the amount invested.`

	return {
		roiPercentage: Math.round(roiPercentage * 10000) / 100, // Round to 2 decimal places
		netProfit: Math.round(netProfit * 100) / 100,
		totalInvestment: Math.round(totalInvestment * 100) / 100,
		profitMargin: returnValue > 0 ? Math.round(profitMargin * 10000) / 100 : null,
		formulaExplanation,
	}
}
