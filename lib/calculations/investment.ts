/**
 * Investment calculation functions
 * Calculates future value of investments with compound interest and regular contributions
 */

import type { CalculationFunction } from './registry'

/**
 * Step interface for investment calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Calculate investment growth with compound interest and regular contributions
 * 
 * Formula for compound interest with regular contributions:
 * FV = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 * Where:
 * - FV = future value
 * - P = initial investment
 * - PMT = monthly contribution
 * - r = annual interest rate
 * - n = compounding frequency per year
 * - t = investment period in years
 * 
 * @param inputs - Input values including initial investment, monthly contribution, interest rate, period, compounding frequency
 * @returns Calculated investment metrics with step-by-step explanation
 */
export function calculateInvestment(
	inputs: Record<string, number | string>,
): Record<string, number | string> {
	const initialInvestment = Number(inputs.initialInvestment || inputs.principal || 0)
	const monthlyContribution = Number(inputs.monthlyContribution || inputs.monthlyPayment || 0)
	const interestRate = Number(inputs.interestRate || inputs.annualRate || 0)
	const investmentPeriod = Number(inputs.investmentPeriod || inputs.years || 0)
	const compoundingFrequency = String(inputs.compoundingFrequency || 'monthly').toLowerCase()
	const interestType = String(inputs.interestType || 'compound').toLowerCase()
	const inflationRate = Number(inputs.inflationRate || 0)
	const taxRate = Number(inputs.taxRate || 0)
	const monthlyWithdrawal = Number(inputs.monthlyWithdrawal || 0)

	// Validation
	if (
		isNaN(initialInvestment) ||
		isNaN(monthlyContribution) ||
		isNaN(interestRate) ||
		isNaN(investmentPeriod) ||
		initialInvestment < 0 ||
		monthlyContribution < 0 ||
		interestRate < 0 ||
		investmentPeriod <= 0
	) {
		return {
			finalValue: null,
			totalContributions: null,
			totalProfit: null,
			profitPercentage: null,
			steps: null,
		}
	}

	// Build step-by-step calculation
	const steps: CalculationStep[] = []

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Initial Investment (P) = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nMonthly Contribution (PMT) = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${interestRate}%\nInvestment Period (t) = ${investmentPeriod} years\nInterest Type = ${interestType === 'compound' ? 'Compound Interest' : 'Simple Interest'}`,
		explanation: 'These are the values you entered for the investment calculation.',
	})

	let futureValueInitial = 0
	let futureValueContributions = 0
	let finalValue = 0

	if (interestType === 'simple') {
		// Simple interest calculation
		const annualRate = interestRate / 100

		// Future value of initial investment with simple interest: A = P(1 + rt)
		if (initialInvestment > 0) {
			futureValueInitial = initialInvestment * (1 + annualRate * investmentPeriod)
			steps.push({
				title: 'Step 2: Calculate Future Value of Initial Investment (Simple Interest)',
				math: `FV_initial = Initial Investment × (1 + r × t)\nFV_initial = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${annualRate.toFixed(6)} × ${investmentPeriod})\nFV_initial = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
				explanation: 'Calculate how much the initial investment grows with simple interest. Simple interest is calculated only on the principal, not on accumulated interest.',
			})
		} else {
			steps.push({
				title: 'Step 2: Future Value of Initial Investment',
				math: `FV_initial = $0 (no initial investment)`,
				explanation: 'No initial investment was made.',
			})
		}

		// Future value of monthly contributions with simple interest
		// Each contribution earns simple interest for the remaining time
		if (monthlyContribution > 0) {
			const totalMonths = investmentPeriod * 12
			for (let month = 1; month <= totalMonths; month++) {
				const remainingYears = (totalMonths - month) / 12
				const contributionValue = monthlyContribution * (1 + annualRate * remainingYears)
				futureValueContributions += contributionValue
			}

			steps.push({
				title: 'Step 3: Calculate Future Value of Monthly Contributions (Simple Interest)',
				math: `Each monthly contribution earns simple interest for the remaining time.\nTotal Contributions = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${totalMonths} = $${(monthlyContribution * totalMonths).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nFV_contributions = Sum of all contributions with interest\nFV_contributions = $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
				explanation: 'Each monthly contribution earns simple interest for the time remaining until the end of the investment period.',
			})
		} else {
			steps.push({
				title: 'Step 3: Future Value of Contributions',
				math: `FV_contributions = $0 (no monthly contributions)`,
				explanation: 'No monthly contributions were made.',
			})
		}

		finalValue = futureValueInitial + futureValueContributions
		steps.push({
			title: 'Step 4: Calculate Total Future Value (Simple Interest)',
			math: `Final Value = FV_initial + FV_contributions\nFinal Value = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nFinal Value = $${finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Add the future value of initial investment and contributions to get the total final value with simple interest.',
		})
	} else {
		// Compound interest calculation
		// Determine compounding frequency per year
		let compoundingPerYear = 12 // monthly
		if (compoundingFrequency === 'quarterly') {
			compoundingPerYear = 4
		} else if (compoundingFrequency === 'annually') {
			compoundingPerYear = 1
		}

		steps.push({
			title: 'Step 2: Determine Compounding Frequency',
			math: `Compounding Frequency = ${compoundingFrequency}\nPeriods Per Year = ${compoundingPerYear}${compoundingFrequency === 'monthly' ? ' (12 times per year)' : compoundingFrequency === 'quarterly' ? ' (4 times per year)' : ' (1 time per year)'}`,
			explanation: `Based on your compounding frequency, interest will be calculated ${compoundingPerYear} times per year.`,
		})

		// Convert annual rate to periodic rate
		const periodicRate = interestRate / 100 / compoundingPerYear

		steps.push({
			title: 'Step 3: Convert Annual Rate to Periodic Rate',
			math: `Periodic Rate (r) = Annual Rate / 100 / Compounding Frequency\nr = ${interestRate}% / 100 / ${compoundingPerYear} = ${(interestRate / 100).toFixed(6)} / ${compoundingPerYear} = ${periodicRate.toFixed(6)}`,
			explanation: `Divide the annual interest rate by 100 to convert to decimal, then divide by ${compoundingPerYear} (compounding frequency) to get the rate per compounding period.`,
		})

		// Number of compounding periods
		const numberOfPeriods = investmentPeriod * compoundingPerYear

		steps.push({
			title: 'Step 4: Calculate Total Number of Compounding Periods',
			math: `Number of Periods (n) = Investment Period × Compounding Frequency\nn = ${investmentPeriod} × ${compoundingPerYear} = ${numberOfPeriods}`,
			explanation: 'Multiply the investment period in years by the compounding frequency to get the total number of compounding periods.',
		})

		// Calculate future value of initial investment with compound interest
		if (initialInvestment > 0) {
			if (periodicRate === 0) {
				futureValueInitial = initialInvestment
				steps.push({
					title: 'Step 5: Future Value of Initial Investment (Zero Interest)',
					math: `FV_initial = P = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
					explanation: 'Since the interest rate is 0%, the initial investment remains unchanged.',
				})
			} else {
				futureValueInitial = initialInvestment * Math.pow(1 + periodicRate, numberOfPeriods)
				const rateFactorInitial = Math.pow(1 + periodicRate, numberOfPeriods)
				steps.push({
					title: 'Step 5: Future Value of Initial Investment',
					math: `FV_initial = P × (1 + r)^n\nFV_initial = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${periodicRate.toFixed(6)})^${numberOfPeriods}\nFV_initial = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${rateFactorInitial.toFixed(6)}\nFV_initial = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
					explanation: 'Calculate how much the initial investment grows with compound interest over the investment period.',
				})
			}
		} else {
			steps.push({
				title: 'Step 5: Future Value of Initial Investment',
				math: `FV_initial = $0 (no initial investment)`,
				explanation: 'No initial investment was made.',
			})
		}

		// Calculate future value of monthly contributions
		// Convert monthly contribution to periodic contribution based on compounding frequency
		const periodicContribution = monthlyContribution * (12 / compoundingPerYear)
		
		if (monthlyContribution > 0) {
			if (periodicRate === 0) {
				futureValueContributions = periodicContribution * numberOfPeriods
				steps.push({
					title: 'Step 6: Future Value of Contributions (Zero Interest)',
					math: `Periodic Contribution = Monthly Contribution × (12 / Compounding Frequency)\nPeriodic Contribution = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (12 / ${compoundingPerYear}) = $${periodicContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nFV_contributions = Periodic Contribution × Number of Periods\nFV_contributions = $${periodicContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${numberOfPeriods}\nFV_contributions = $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
					explanation: 'Since the interest rate is 0%, the future value of contributions is simply the sum of all contributions.',
				})
			} else {
				// Future value of annuity: FV = PMT * [((1 + r)^n - 1) / r]
				const rateFactor = Math.pow(1 + periodicRate, numberOfPeriods)
				futureValueContributions = periodicContribution * ((rateFactor - 1) / periodicRate)
				steps.push({
					title: 'Step 6: Future Value of Contributions',
					math: `Periodic Contribution = Monthly Contribution × (12 / Compounding Frequency)\nPeriodic Contribution = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (12 / ${compoundingPerYear}) = $${periodicContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nRate Factor = (1 + r)^n = (1 + ${periodicRate.toFixed(6)})^${numberOfPeriods} = ${rateFactor.toFixed(6)}\n\nFV_contributions = Periodic Contribution × [(1 + r)^n - 1] / r\nFV_contributions = $${periodicContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${rateFactor.toFixed(6)} - 1] / ${periodicRate.toFixed(6)}\nFV_contributions = $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
					explanation: 'Calculate the future value of all regular contributions using the future value of annuity formula.',
				})
			}
		} else {
			steps.push({
				title: 'Step 6: Future Value of Contributions',
				math: `FV_contributions = $0 (no monthly contributions)`,
				explanation: 'No monthly contributions were made.',
			})
		}

		// Total future value
		finalValue = futureValueInitial + futureValueContributions
		steps.push({
			title: 'Step 7: Calculate Total Future Value',
			math: `Final Value = FV_initial + FV_contributions\nFinal Value = $${futureValueInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${futureValueContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nFinal Value = $${Math.round(finalValue * 100) / 100}`,
			explanation: 'Add the future value of the initial investment and the future value of contributions to get the total final value.',
		})
	}

	// Calculate total contributions
	const totalContributions = initialInvestment + (monthlyContribution * 12 * investmentPeriod)

	// Calculate total profit
	const totalProfit = finalValue - totalContributions

	// Calculate profit percentage
	const profitPercentage = totalContributions > 0 
		? (totalProfit / totalContributions) * 100 
		: 0

	// Add remaining steps
	const stepNumber = interestType === 'simple' ? 5 : 8
	steps.push({
		title: `Step ${stepNumber}: Calculate Total Contributions`,
		math: `Total Contributions = Initial Investment + (Monthly Contribution × 12 × Years)\nTotal Contributions = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ($${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × 12 × ${investmentPeriod})\nTotal Contributions = $${initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${(monthlyContribution * 12 * investmentPeriod).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Contributions = $${Math.round(totalContributions * 100) / 100}`,
		explanation: 'Calculate the total amount you contributed (initial investment plus all monthly contributions).',
	})

	steps.push({
		title: `Step ${stepNumber + 1}: Calculate Total Profit`,
		math: `Total Profit = Final Value - Total Contributions\nTotal Profit = $${Math.round(finalValue * 100) / 100} - $${Math.round(totalContributions * 100) / 100}\nTotal Profit = $${Math.round(totalProfit * 100) / 100}`,
		explanation: `Subtract your total contributions from the final value to find how much profit you earned from ${interestType === 'simple' ? 'simple' : 'compound'} interest.`,
	})

	steps.push({
		title: `Step ${stepNumber + 2}: Calculate Profit Percentage`,
		math: `Profit Percentage = (Total Profit / Total Contributions) × 100%\nProfit Percentage = ($${Math.round(totalProfit * 100) / 100} / $${Math.round(totalContributions * 100) / 100}) × 100%\nProfit Percentage = ${Math.round(profitPercentage * 100) / 100}%`,
		explanation: 'Calculate the percentage return on your total contributions.',
	})

	// Calculate real value (adjusted for inflation)
	let realValue = finalValue
	if (inflationRate > 0 && investmentPeriod > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, investmentPeriod)
		realValue = finalValue / inflationFactor
		steps.push({
			title: `Step ${stepNumber + 3}: Calculate Real Value (Inflation Adjusted)`,
			math: `Inflation Factor = (1 + Inflation Rate)^Years\nInflation Factor = (1 + ${inflationRate / 100})^${investmentPeriod} = ${inflationFactor.toFixed(6)}\n\nReal Value = Final Value / Inflation Factor\nReal Value = $${finalValue.toFixed(2)} / ${inflationFactor.toFixed(6)} = $${realValue.toFixed(2)}`,
			explanation: 'Adjust the final value for inflation to see the purchasing power in today\'s dollars.',
		})
	}

	// Calculate after-tax value
	let afterTaxValue = finalValue
	if (taxRate > 0 && totalProfit > 0) {
		const taxAmount = (totalProfit * taxRate) / 100
		afterTaxValue = finalValue - taxAmount
		steps.push({
			title: `Step ${stepNumber + (inflationRate > 0 ? 4 : 3)}: Calculate After-Tax Value`,
			math: `Tax Amount = Total Profit × Tax Rate\nTax Amount = $${totalProfit.toFixed(2)} × ${taxRate}% = $${taxAmount.toFixed(2)}\n\nAfter-Tax Value = Final Value - Tax Amount\nAfter-Tax Value = $${finalValue.toFixed(2)} - $${taxAmount.toFixed(2)} = $${afterTaxValue.toFixed(2)}`,
			explanation: 'Calculate the value after taxes are paid on the investment gains.',
		})
	}

	return {
		finalValue: Math.round(finalValue * 100) / 100,
		totalContributions: Math.round(totalContributions * 100) / 100,
		totalProfit: Math.round(totalProfit * 100) / 100,
		profitPercentage: Math.round(profitPercentage * 100) / 100,
		realValue: Math.round(realValue * 100) / 100,
		afterTaxValue: Math.round(afterTaxValue * 100) / 100,
		steps,
	}
}

// Register the calculation function
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateInvestment', calculateInvestment)

