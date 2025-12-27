/**
 * Calculate take-home pay (net income) after taxes and deductions
 * General estimation tool, not country-specific
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Calculate take-home pay
 */
export const calculateTakeHomePay: CalculationFunction = (inputs) => {
	const grossIncome = Number(inputs.grossIncome || 0)
	const incomePeriod = String(inputs.incomePeriod || 'yearly').toLowerCase()
	const effectiveTaxRate = Number(inputs.effectiveTaxRate || 0)
	const totalTaxAmount = Number(inputs.totalTaxAmount || 0)
	const taxCalculationMode = String(inputs.taxCalculationMode || 'rate').toLowerCase()

	// Optional deductions
	const pensionContribution = Number(inputs.pensionContribution || 0)
	const pensionContributionType = String(inputs.pensionContributionType || 'amount').toLowerCase()
	const socialContributions = Number(inputs.socialContributions || 0)
	const socialContributionsType = String(inputs.socialContributionsType || 'amount').toLowerCase()
	const otherDeductions = Number(inputs.otherDeductions || 0)
	const bonusIncome = Number(inputs.bonusIncome || 0)

	// Validation
	if (
		isNaN(grossIncome) ||
		isNaN(effectiveTaxRate) ||
		isNaN(totalTaxAmount) ||
		isNaN(pensionContribution) ||
		isNaN(socialContributions) ||
		isNaN(otherDeductions) ||
		isNaN(bonusIncome) ||
		grossIncome <= 0 ||
		(taxCalculationMode === 'rate' && (effectiveTaxRate < 0 || effectiveTaxRate > 60)) ||
		(taxCalculationMode === 'amount' && totalTaxAmount < 0) ||
		pensionContribution < 0 ||
		socialContributions < 0 ||
		otherDeductions < 0 ||
		bonusIncome < 0
	) {
		return {
			grossIncome: null,
			totalTaxes: null,
			totalDeductions: null,
			netIncome: null,
			netIncomePerMonth: null,
			effectiveNetRate: null,
			formulaExplanation: null,
		}
	}

	// Calculate total gross income (including bonus)
	const totalGrossIncome = grossIncome + bonusIncome

	// Calculate tax amount
	let totalTaxes: number
	if (taxCalculationMode === 'amount') {
		totalTaxes = totalTaxAmount
	} else {
		// Tax rate mode
		totalTaxes = totalGrossIncome * (effectiveTaxRate / 100)
	}

	// Calculate deductions
	let pensionAmount = 0
	if (pensionContribution > 0) {
		if (pensionContributionType === 'percentage') {
			pensionAmount = totalGrossIncome * (pensionContribution / 100)
		} else {
			pensionAmount = pensionContribution
		}
	}

	let socialAmount = 0
	if (socialContributions > 0) {
		if (socialContributionsType === 'percentage') {
			socialAmount = totalGrossIncome * (socialContributions / 100)
		} else {
			socialAmount = socialContributions
		}
	}

	const totalDeductions = pensionAmount + socialAmount + otherDeductions

	// Validate deductions don't exceed income
	if (totalDeductions > totalGrossIncome) {
		return {
			grossIncome: null,
			totalTaxes: null,
			totalDeductions: null,
			netIncome: null,
			netIncomePerMonth: null,
			effectiveNetRate: null,
			formulaExplanation: null,
		}
	}

	// Calculate net income
	const netIncome = totalGrossIncome - totalTaxes - totalDeductions

	// Calculate monthly net income
	let netIncomePerMonth: number | null = null
	if (incomePeriod === 'yearly') {
		netIncomePerMonth = netIncome / 12
	} else {
		netIncomePerMonth = netIncome
	}

	// Calculate effective net rate (percentage of gross kept)
	const effectiveNetRate = totalGrossIncome > 0
		? (netIncome / totalGrossIncome) * 100
		: 0

	// Build formula explanation
	let formulaExplanation = ''
	
	const grossIncomeLabel = incomePeriod === 'yearly' ? 'Annual Gross Income' : 'Monthly Gross Income'
	const taxModeLabel = taxCalculationMode === 'amount' ? 'Fixed Tax Amount' : 'Tax Rate'
	
	formulaExplanation = `Take-Home Pay Calculation:\n\n1. Gross Income:\n   ${grossIncomeLabel}: $${grossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ${bonusIncome > 0 ? `Bonus Income: $${bonusIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ` : ''}Total Gross Income: $${totalGrossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n2. Taxes:\n   ${taxCalculationMode === 'amount' ? `Tax Amount: $${totalTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Effective Tax Rate: ${effectiveTaxRate}%\n   Tax Amount = Total Gross Income × Tax Rate\n   Tax Amount = $${totalGrossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${effectiveTaxRate}% = $${totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}\n\n3. Deductions:\n   ${pensionAmount > 0 ? `${pensionContributionType === 'percentage' ? `Pension Contribution (${pensionContribution}%): $${pensionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Pension Contribution: $${pensionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}\n   ` : ''}${socialAmount > 0 ? `${socialContributionsType === 'percentage' ? `Social Contributions (${socialContributions}%): $${socialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Social Contributions: $${socialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}\n   ` : ''}${otherDeductions > 0 ? `Other Deductions: $${otherDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ` : ''}Total Deductions: $${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n4. Net Income (Take-Home Pay):\n   Net Income = Total Gross Income - Taxes - Deductions\n   Net Income = $${totalGrossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Net Income = $${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n5. Summary:\n   ${incomePeriod === 'yearly' ? `Monthly Net Income: $${netIncomePerMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   ` : ''}Effective Net Rate: ${effectiveNetRate.toFixed(2)}% (percentage of gross income you keep)\n   Total Taxes: $${totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n   Total Deductions: $${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nNote: This is an estimation tool. Actual take-home pay varies by country, state/province, local tax laws, specific deductions, and individual circumstances. Tax rates, deductions, and calculations differ significantly between jurisdictions. Always consult with a tax professional or use official tax calculators for your specific location for accurate calculations.`

	return {
		grossIncome: Math.round(totalGrossIncome * 100) / 100,
		totalTaxes: Math.round(totalTaxes * 100) / 100,
		totalDeductions: Math.round(totalDeductions * 100) / 100,
		netIncome: Math.round(netIncome * 100) / 100,
		netIncomePerMonth: netIncomePerMonth ? Math.round(netIncomePerMonth * 100) / 100 : null,
		effectiveNetRate: Math.round(effectiveNetRate * 100) / 100,
		formulaExplanation,
	}
}

