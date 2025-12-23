/**
 * Calculate emergency fund target and time to reach goal
 * Helps users determine how much emergency savings they need
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate emergency fund
 */
export const calculateEmergencyFund: CalculatorFunction = (inputs) => {
	const monthlyExpenses = Number(inputs.monthlyExpenses || 0)
	const targetMonths = Math.floor(Number(inputs.targetMonths || 6))
	const currentSavings = Number(inputs.currentSavings || 0)
	const monthlyContribution = Number(inputs.monthlyContribution || 0)

	// Validation
	if (
		isNaN(monthlyExpenses) ||
		isNaN(targetMonths) ||
		isNaN(currentSavings) ||
		isNaN(monthlyContribution) ||
		monthlyExpenses <= 0 ||
		targetMonths < 1 ||
		targetMonths > 24 ||
		currentSavings < 0 ||
		monthlyContribution < 0
	) {
		return {
			targetEmergencyFund: null,
			remainingAmount: null,
			monthsToGoal: null,
			progressPercentage: null,
			formulaExplanation: null,
		}
	}

	// Calculate target emergency fund
	const targetEmergencyFund = monthlyExpenses * targetMonths

	// Calculate remaining amount needed
	const remainingAmount = Math.max(0, targetEmergencyFund - currentSavings)

	// Calculate progress percentage
	const progressPercentage = targetEmergencyFund > 0
		? Math.min(100, (currentSavings / targetEmergencyFund) * 100)
		: 0

	// Calculate months to reach goal
	let monthsToGoal: number | null = null
	if (monthlyContribution > 0) {
		monthsToGoal = Math.ceil(remainingAmount / monthlyContribution)
	} else if (remainingAmount > 0) {
		monthsToGoal = null // Infinite - no contribution
	} else {
		monthsToGoal = 0 // Already reached goal
	}

	// Build formula explanation
	let formulaExplanation = ''
	
	formulaExplanation = `Emergency Fund Calculation:\n\n1. Monthly Expenses: $${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Target Emergency Fund:\n   Target Fund = Monthly Expenses × Target Months\n   Target Fund = $${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${targetMonths} months\n   Target Fund = $${targetEmergencyFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n3. Current Savings: $${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n4. Remaining Amount Needed:\n   Remaining = Target Fund - Current Savings\n   Remaining = $${targetEmergencyFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Remaining = $${remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n5. Progress:\n   Progress = (Current Savings / Target Fund) × 100%\n   Progress = ($${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${targetEmergencyFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100%\n   Progress = ${progressPercentage.toFixed(1)}%\n\n${monthlyContribution > 0 ? `6. Time to Reach Goal:\n   Months to Goal = Remaining Amount / Monthly Contribution\n   Months to Goal = $${remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Months to Goal = ${monthsToGoal} months (${(monthsToGoal / 12).toFixed(1)} years)\n\n` : remainingAmount > 0 ? `6. Time to Reach Goal:\n   You need to start saving to reach your emergency fund goal. Enter a monthly contribution amount to see how long it will take.\n\n` : `6. Goal Status:\n   Congratulations! You have reached your emergency fund goal.\n\n`}An emergency fund of ${targetMonths} months of expenses provides a financial safety net for unexpected situations like job loss, medical emergencies, or major repairs. ${targetMonths >= 6 ? 'A 6-month emergency fund is recommended for most people as it provides substantial protection while remaining achievable.' : 'A 3-month emergency fund is a good starting point, especially for those with stable income and low expenses.'} Keep your emergency fund in a high-yield savings account or money market account for easy access and some growth.`

	return {
		targetEmergencyFund: Math.round(targetEmergencyFund * 100) / 100,
		remainingAmount: Math.round(remainingAmount * 100) / 100,
		monthsToGoal: monthsToGoal !== null ? monthsToGoal : null,
		progressPercentage: Math.round(progressPercentage * 100) / 100,
		formulaExplanation,
	}
}



