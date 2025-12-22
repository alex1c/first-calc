/**
 * Calculate how much car you can afford based on monthly budget or income rule
 * Inputs: mode, maxMonthlyCarBudget, monthlyNetIncome, rulePreset, downPayment,
 *         loanAPR, loanTermMonths, estimatedMonthlyFixedCosts, tradeInValue, salesTaxOrFees
 * Outputs: maxAffordableCarPrice, maxAffordableLoanAmount, allowedMonthlyPayment,
 *          recommendedBudgetRange, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate maximum loan amount from monthly payment using inverse amortization
 */
function calculateMaxLoanAmount(
	monthlyPayment: number,
	annualRate: number,
	termMonths: number,
): number {
	if (termMonths === 0) {
		return 0
	}
	if (annualRate === 0) {
		return monthlyPayment * termMonths
	}
	const monthlyRate = annualRate / 100 / 12
	const rateFactor = Math.pow(1 + monthlyRate, termMonths)
	return (monthlyPayment * (rateFactor - 1)) / (monthlyRate * rateFactor)
}

/**
 * Calculate how much car you can afford
 */
export const calculateCarAffordability: CalculatorFunction = (inputs) => {
	// Extract and parse inputs
	const mode = String(inputs.mode || 'byMonthlyBudget').toLowerCase()
	const maxMonthlyCarBudget = Number(inputs.maxMonthlyCarBudget || 0)
	const monthlyNetIncome = Number(inputs.monthlyNetIncome || 0)
	const rulePreset = String(inputs.rulePreset || 'moderate').toLowerCase()
	const downPayment = Number(inputs.downPayment || 0)
	const loanAPR = Number(inputs.loanAPR || 0)
	const loanTermMonths = Math.floor(Number(inputs.loanTermMonths || 0))
	const estimatedMonthlyFixedCosts = Number(inputs.estimatedMonthlyFixedCosts || 0)
	const tradeInValue = Number(inputs.tradeInValue || 0)
	const salesTaxOrFees = Number(inputs.salesTaxOrFees || 0)

	// Validation
	if (
		isNaN(maxMonthlyCarBudget) ||
		isNaN(monthlyNetIncome) ||
		isNaN(downPayment) ||
		isNaN(loanAPR) ||
		isNaN(loanTermMonths) ||
		isNaN(estimatedMonthlyFixedCosts) ||
		isNaN(tradeInValue) ||
		isNaN(salesTaxOrFees) ||
		!['bymonthlybudget', 'byincomerule'].includes(mode) ||
		!['conservative', 'moderate', 'aggressive'].includes(rulePreset) ||
		maxMonthlyCarBudget < 0 ||
		monthlyNetIncome < 0 ||
		downPayment < 0 ||
		loanAPR < 0 ||
		loanAPR > 40 ||
		loanTermMonths < 12 ||
		loanTermMonths > 96 ||
		estimatedMonthlyFixedCosts < 0 ||
		tradeInValue < 0 ||
		salesTaxOrFees < 0
	) {
		return {
			maxAffordableCarPrice: null,
			maxAffordableLoanAmount: null,
			allowedMonthlyPayment: null,
			recommendedBudgetRange: null,
			insights: null,
		}
	}

	// Calculate allowed monthly payment based on mode
	let allowedMonthlyPayment: number

	if (mode === 'byincomerule') {
		// Calculate based on income rule
		let incomePercentage: number
		if (rulePreset === 'conservative') {
			incomePercentage = 10
		} else if (rulePreset === 'moderate') {
			incomePercentage = 15
		} else {
			// aggressive
			incomePercentage = 20
		}

		const maxCarBudgetFromIncome = (monthlyNetIncome * incomePercentage) / 100
		allowedMonthlyPayment = maxCarBudgetFromIncome - estimatedMonthlyFixedCosts
	} else {
		// byMonthlyBudget mode
		allowedMonthlyPayment = maxMonthlyCarBudget - estimatedMonthlyFixedCosts
	}

	// Ensure allowed payment is positive
	if (allowedMonthlyPayment <= 0) {
		return {
			maxAffordableCarPrice: null,
			maxAffordableLoanAmount: null,
			allowedMonthlyPayment: null,
			recommendedBudgetRange: null,
			insights: 'Your fixed costs exceed your available budget. Consider reducing fixed costs or increasing your budget.',
		}
	}

	// Calculate maximum loan amount from allowed payment
	const maxAffordableLoanAmount = calculateMaxLoanAmount(
		allowedMonthlyPayment,
		loanAPR,
		loanTermMonths,
	)

	// Calculate maximum car price
	// maxCarPrice = loanAmount + downPayment + tradeInValue - fees
	// But we need to account for fees being part of the loan or separate
	// Typically: loanAmount = carPrice - downPayment - tradeIn + fees
	// So: carPrice = loanAmount + downPayment + tradeIn - fees
	const maxAffordableCarPrice = maxAffordableLoanAmount + downPayment + tradeInValue - salesTaxOrFees

	// Ensure car price is positive
	if (maxAffordableCarPrice <= 0) {
		return {
			maxAffordableCarPrice: null,
			maxAffordableLoanAmount: null,
			allowedMonthlyPayment: null,
			recommendedBudgetRange: null,
			insights: 'Unable to calculate affordable price with current inputs. Try increasing down payment or reducing fees.',
		}
	}

	// Calculate recommended budget range
	const recommendedBudgetRange = {
		conservative: allowedMonthlyPayment * 0.8,
		moderate: allowedMonthlyPayment,
		aggressive: allowedMonthlyPayment * 1.2,
	}

	// Generate insights
	const insights: string[] = []

	// Down payment impact
	if (downPayment > 0) {
		const downPaymentPercentage = (downPayment / maxAffordableCarPrice) * 100
		insights.push(
			`Your down payment of $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${downPaymentPercentage.toFixed(1)}% of car price) helps you afford a more expensive vehicle.`
		)
	} else {
		// Calculate impact of adding down payment
		const exampleDownPayment = maxAffordableCarPrice * 0.1 // 10% example
		const additionalLoanCapacity = exampleDownPayment
		const newMaxPrice = maxAffordableCarPrice + additionalLoanCapacity
		insights.push(
			`Adding a $${exampleDownPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} down payment (10%) could increase your affordable price to approximately $${newMaxPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
		)
	}

	// Loan term insight
	if (loanTermMonths > 0) {
		const totalInterest = (allowedMonthlyPayment * loanTermMonths) - maxAffordableLoanAmount
		if (totalInterest > 0) {
			insights.push(
				`With a ${loanTermMonths}-month term at ${loanAPR}% APR, you'll pay approximately $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in interest.`
			)
		}

		// Compare with shorter term
		if (loanTermMonths >= 60) {
			const shorterTerm = 48
			const shorterLoanAmount = calculateMaxLoanAmount(allowedMonthlyPayment, loanAPR, shorterTerm)
			const shorterPrice = shorterLoanAmount + downPayment + tradeInValue - salesTaxOrFees
			if (shorterPrice < maxAffordableCarPrice) {
				const savings = (allowedMonthlyPayment * loanTermMonths) - (allowedMonthlyPayment * shorterTerm)
				insights.push(
					`A shorter ${shorterTerm}-month term would reduce your affordable price to $${shorterPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, but save approximately $${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in total payments.`
				)
			}
		}
	}

	// Fixed costs insight
	if (estimatedMonthlyFixedCosts > 0) {
		const fixedCostsPercentage = (estimatedMonthlyFixedCosts / (allowedMonthlyPayment + estimatedMonthlyFixedCosts)) * 100
		insights.push(
			`Fixed costs (insurance, parking, etc.) of $${estimatedMonthlyFixedCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month represent ${fixedCostsPercentage.toFixed(1)}% of your total car budget.`
		)
	}

	// Income rule insight (if applicable)
	if (mode === 'byincomerule') {
		const rulePercentage = rulePreset === 'conservative' ? 10 : rulePreset === 'moderate' ? 15 : 20
		insights.push(
			`Using the ${rulePreset} rule (${rulePercentage}% of net income), your car budget is $${((monthlyNetIncome * rulePercentage) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month.`
		)
	}

	// Budget range insight
	insights.push(
		`Recommended budget range: Conservative $${recommendedBudgetRange.conservative.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - Aggressive $${recommendedBudgetRange.aggressive.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month for car payment.`
	)

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	return {
		maxAffordableCarPrice: round(maxAffordableCarPrice),
		maxAffordableLoanAmount: round(maxAffordableLoanAmount),
		allowedMonthlyPayment: round(allowedMonthlyPayment),
		recommendedBudgetRange: JSON.stringify(recommendedBudgetRange),
		insights: insights.join(' '),
		totalMonthlyCost: round(allowedMonthlyPayment + estimatedMonthlyFixedCosts),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateCarAffordability', calculateCarAffordability)


