/**
 * Calculate savings growth with compound interest
 * Inputs: initialSavings, monthlyContribution, interestRate, years, compoundingFrequency
 * Outputs: finalValue, totalContributions, totalInterest, growthPercentage, steps
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Step interface for savings calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

export const calculateSavings: CalculationFunction = (inputs) => {
	const initialSavings = Number(inputs.initialSavings) || 0
	const monthlyContribution = Number(inputs.monthlyContribution) || 0
	const interestRate = Number(inputs.interestRate) || 0
	const years = Number(inputs.years) || 1
	const compoundingFrequency = String(inputs.compoundingFrequency || 'monthly').toLowerCase()
	const interestType = String(inputs.interestType || 'compound').toLowerCase()
	const inflationRate = Number(inputs.inflationRate || 0)
	const taxRate = Number(inputs.taxRate || 0)
	const monthlyWithdrawal = Number(inputs.monthlyWithdrawal || 0)

	// Validation
	if (initialSavings < 0 || monthlyContribution < 0 || interestRate < 0 || years <= 0) {
		return {
			finalValue: null,
			totalContributions: null,
			totalInterest: null,
			growthPercentage: null,
			steps: null,
		}
	}

	const steps: CalculationStep[] = []

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Initial Savings = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nMonthly Contribution = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Interest Rate = ${interestRate}%\nYears = ${years} years\nCompounding Frequency = ${compoundingFrequency}\nInterest Type = ${interestType === 'compound' ? 'Compound Interest' : 'Simple Interest'}`,
		explanation: 'These are the values you entered for the savings calculation.',
	})

	// Determine compounding periods per year
	let periodsPerYear: number
	switch (compoundingFrequency) {
		case 'monthly':
			periodsPerYear = 12
			break
		case 'quarterly':
			periodsPerYear = 4
			break
		case 'annually':
			periodsPerYear = 1
			break
		default:
			periodsPerYear = 12
	}

	steps.push({
		title: 'Step 2: Determine Compounding Periods Per Year',
		math: `Compounding Frequency = ${compoundingFrequency}\nPeriods Per Year = ${periodsPerYear}${compoundingFrequency === 'monthly' ? ' (12 times per year)' : compoundingFrequency === 'quarterly' ? ' (4 times per year)' : ' (1 time per year)'}`,
		explanation: `Based on your compounding frequency, interest will be calculated ${periodsPerYear} times per year.`,
	})

	const totalPeriods = years * periodsPerYear
	const periodRate = interestRate / 100 / periodsPerYear

	steps.push({
		title: 'Step 3: Calculate Total Compounding Periods',
		math: `Total Periods = Years × Periods Per Year\nTotal Periods = ${years} × ${periodsPerYear} = ${totalPeriods}`,
		explanation: 'Calculate the total number of compounding periods over the savings period.',
	})

	steps.push({
		title: 'Step 4: Convert Annual Rate to Periodic Rate',
		math: `Periodic Rate (r) = Annual Rate / 100 / Periods Per Year\nr = ${interestRate}% / 100 / ${periodsPerYear} = ${(interestRate / 100).toFixed(6)} / ${periodsPerYear} = ${periodRate.toFixed(6)}`,
		explanation: 'Convert the annual interest rate to the rate per compounding period.',
	})

	// Calculate future value based on interest type
	let finalValue: number
	if (interestRate === 0) {
		finalValue = initialSavings + monthlyContribution * 12 * years
		steps.push({
			title: 'Step 5: Calculate Final Value (Zero Interest)',
			math: `Final Value = Initial Savings + (Monthly Contribution × 12 × Years)\nFinal Value = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ($${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × 12 × ${years})\nFinal Value = $${finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Since the interest rate is 0%, the final value is simply the sum of initial savings and all contributions.',
		})
	} else if (interestType === 'simple') {
		// Simple interest calculation
		const annualRate = interestRate / 100
		
		steps.push({
			title: 'Step 2: Convert Annual Rate to Decimal (Simple Interest)',
			math: `Annual Rate (r) = ${interestRate}% / 100 = ${annualRate.toFixed(6)}`,
			explanation: 'Convert the annual interest rate from percentage to decimal form for simple interest calculation.',
		})
		
		// Future value of initial savings with simple interest: A = P(1 + rt)
		const fvInitial = initialSavings * (1 + annualRate * years)
		steps.push({
			title: 'Step 3: Calculate Future Value of Initial Savings (Simple Interest)',
			math: `FV_initial = Initial Savings × (1 + r × t)\nFV_initial = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${annualRate.toFixed(6)} × ${years})\nFV_initial = $${fvInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Calculate how much the initial savings will grow with simple interest. Simple interest is calculated only on the principal, not on accumulated interest.',
		})

		// Future value of monthly contributions with simple interest
		// Each contribution earns simple interest for the remaining time
		let fvContributions = 0
		const totalMonths = years * 12
		
		for (let month = 1; month <= totalMonths; month++) {
			const remainingYears = (totalMonths - month) / 12
			const contributionValue = monthlyContribution * (1 + annualRate * remainingYears)
			fvContributions += contributionValue
		}

		steps.push({
			title: 'Step 4: Calculate Future Value of Monthly Contributions (Simple Interest)',
			math: `Each monthly contribution earns simple interest for the remaining time.\nTotal Contributions = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${totalMonths} = $${(monthlyContribution * totalMonths).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nFV_contributions = Sum of all contributions with interest\nFV_contributions = $${fvContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Each monthly contribution earns simple interest for the time remaining until the end of the savings period.',
		})

		finalValue = fvInitial + fvContributions
		steps.push({
			title: 'Step 5: Calculate Total Final Value (Simple Interest)',
			math: `Final Value = FV_initial + FV_contributions\nFinal Value = $${fvInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${fvContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nFinal Value = $${finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Add the future value of initial savings and contributions to get the total final value with simple interest.',
		})
	} else {
		// Future value of initial savings with compound interest
		const fvInitial = initialSavings * Math.pow(1 + periodRate, totalPeriods)
		steps.push({
			title: 'Step 5: Calculate Future Value of Initial Savings',
			math: `FV_initial = Initial Savings × (1 + r)^n\nFV_initial = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (1 + ${periodRate.toFixed(6)})^${totalPeriods}\nFV_initial = $${fvInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Calculate how much the initial savings will grow with compound interest.',
		})

		// Future value of monthly contributions (annuity)
		// Convert monthly contributions to period contributions
		const contributionsPerPeriod = monthlyContribution * (12 / periodsPerYear)
		const rateFactor = Math.pow(1 + periodRate, totalPeriods)
		const fvContributions =
			contributionsPerPeriod *
			((rateFactor - 1) / periodRate)

		steps.push({
			title: 'Step 6: Calculate Future Value of Monthly Contributions',
			math: `Contributions Per Period = Monthly Contribution × (12 / Periods Per Year)\nContributions Per Period = $${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × (12 / ${periodsPerYear}) = $${contributionsPerPeriod.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nRate Factor = (1 + r)^n = (1 + ${periodRate.toFixed(6)})^${totalPeriods} = ${rateFactor.toFixed(6)}\n\nFV_contributions = Contributions Per Period × [(1 + r)^n - 1] / r\nFV_contributions = $${contributionsPerPeriod.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × [${rateFactor.toFixed(6)} - 1] / ${periodRate.toFixed(6)}\nFV_contributions = $${fvContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Calculate the future value of all monthly contributions using the future value of annuity formula.',
		})

		finalValue = fvInitial + fvContributions
		steps.push({
			title: 'Step 7: Calculate Total Final Value',
			math: `Final Value = FV_initial + FV_contributions\nFinal Value = $${fvInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + $${fvContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nFinal Value = $${finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			explanation: 'Add the future value of initial savings and contributions to get the total final value.',
		})
	}

	// Calculate totals
	const totalContributions = initialSavings + monthlyContribution * 12 * years
	const totalInterest = finalValue - totalContributions
	const growthPercentage = totalContributions > 0 ? (totalInterest / totalContributions) * 100 : 0

	steps.push({
		title: 'Step 8: Calculate Total Contributions',
		math: `Total Contributions = Initial Savings + (Monthly Contribution × 12 × Years)\nTotal Contributions = $${initialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ($${monthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × 12 × ${years})\nTotal Contributions = $${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		explanation: 'Calculate the total amount you contributed (initial savings plus all monthly contributions).',
	})

	steps.push({
		title: 'Step 9: Calculate Total Interest Earned',
		math: `Total Interest = Final Value - Total Contributions\nTotal Interest = $${finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest = $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		explanation: 'Calculate how much interest you earned from compound interest.',
	})

	steps.push({
		title: 'Step 10: Calculate Growth Percentage',
		math: `Growth Percentage = (Total Interest / Total Contributions) × 100%\nGrowth Percentage = ($${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) × 100%\nGrowth Percentage = ${growthPercentage.toFixed(2)}%`,
		explanation: 'Calculate the percentage growth of your savings relative to your total contributions.',
	})

	// Calculate real value (adjusted for inflation)
	let realValue = finalValue
	if (inflationRate > 0 && years > 0) {
		const inflationFactor = Math.pow(1 + inflationRate / 100, years)
		realValue = finalValue / inflationFactor
		steps.push({
			title: 'Step 11: Calculate Real Value (Inflation Adjusted)',
			math: `Inflation Factor = (1 + Inflation Rate)^Years\nInflation Factor = (1 + ${inflationRate / 100})^${years} = ${inflationFactor.toFixed(6)}\n\nReal Value = Final Value / Inflation Factor\nReal Value = $${finalValue.toFixed(2)} / ${inflationFactor.toFixed(6)} = $${realValue.toFixed(2)}`,
			explanation: 'Adjust the final value for inflation to see the purchasing power in today\'s dollars.',
		})
	}

	// Calculate after-tax value
	let afterTaxValue = finalValue
	if (taxRate > 0 && totalInterest > 0) {
		const taxAmount = (totalInterest * taxRate) / 100
		afterTaxValue = finalValue - taxAmount
		steps.push({
			title: `Step ${inflationRate > 0 ? 12 : 11}: Calculate After-Tax Value`,
			math: `Tax Amount = Total Interest × Tax Rate\nTax Amount = $${totalInterest.toFixed(2)} × ${taxRate}% = $${taxAmount.toFixed(2)}\n\nAfter-Tax Value = Final Value - Tax Amount\nAfter-Tax Value = $${finalValue.toFixed(2)} - $${taxAmount.toFixed(2)} = $${afterTaxValue.toFixed(2)}`,
			explanation: 'Calculate the value after taxes are paid on the interest earned.',
		})
	}

	return {
		finalValue: Math.round(finalValue * 100) / 100,
		totalContributions: Math.round(totalContributions * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		growthPercentage: Math.round(growthPercentage * 100) / 100,
		realValue: Math.round(realValue * 100) / 100,
		afterTaxValue: Math.round(afterTaxValue * 100) / 100,
		steps,
	}
}

// Register the calculation function
registerCalculation('calculateSavings', calculateSavings)

