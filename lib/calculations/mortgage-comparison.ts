/**
 * Compare multiple mortgage offers side-by-side
 * Inputs: scenarios (array), comparisonMetric, includeTaxesInsurance, paymentFrequency
 * Outputs: comparisonTable, winner, bestScenarioByMetric, formulaExplanation
 */

import type { CalculationFunction } from '@/lib/calculations/registry'

/**
 * Mortgage comparison result interface
 */
interface MortgageComparisonResult {
	scenarioName: string
	homePrice: number
	downPaymentAmount: number
	loanAmount: number
	interestRateAPR: number
	loanTermYears: number
	propertyTaxAnnual: number
	homeInsuranceAnnual: number
	HOAmonthly: number
	extraMonthlyPayment: number
	closingCosts: number
	monthlyPandI: number
	totalMonthly: number
	totalPayment: number
	totalInterest: number
	totalCost: number
	payoffMonths?: number
	payoffDate?: string
	interestSaved?: number
}

/**
 * Calculate mortgage comparison with multiple scenarios
 */
export const calculateMortgageComparison: CalculationFunction = (inputs) => {
	const comparisonMetric = String(inputs.comparisonMetric || 'lowest-total-monthly-payment').toLowerCase()
	const includeTaxesInsurance = inputs.includeTaxesInsurance === 'true' || inputs.includeTaxesInsurance === true
	const paymentFrequencyStr = inputs.paymentFrequency || 'monthly'

	// Parse scenarios array - can be passed as JSON string or object
	let scenarios: any[] = []
	if (typeof inputs.scenarios === 'string') {
		try {
			scenarios = JSON.parse(inputs.scenarios)
		} catch {
			scenarios = []
		}
	} else if (Array.isArray(inputs.scenarios)) {
		scenarios = inputs.scenarios
	} else {
		// Try to parse individual scenario inputs (scenario1, scenario2, etc.)
		for (let i = 1; i <= 4; i++) {
			const scenarioName = inputs[`scenario${i}Name`] || `Mortgage ${String.fromCharCode(64 + i)}`
			const homePrice = Number(inputs[`scenario${i}HomePrice`] || 0)
			const downPayment = Number(inputs[`scenario${i}DownPayment`] || 0)
			const downPaymentType = String(inputs[`scenario${i}DownPaymentType`] || 'amount').toLowerCase()
			const interestRateAPR = Number(inputs[`scenario${i}InterestRateAPR`] || inputs[`scenario${i}APR`] || 0)
			const loanTermYears = Math.floor(Number(inputs[`scenario${i}LoanTermYears`] || inputs[`scenario${i}Term`] || 0))
			const propertyTaxAnnual = Number(inputs[`scenario${i}PropertyTaxAnnual`] || 0)
			const propertyTaxType = String(inputs[`scenario${i}PropertyTaxType`] || 'amount').toLowerCase()
			const homeInsuranceAnnual = Number(inputs[`scenario${i}HomeInsuranceAnnual`] || 0)
			const HOAmonthly = Number(inputs[`scenario${i}HOAmonthly`] || inputs[`scenario${i}HOA`] || 0)
			const extraMonthlyPayment = Number(inputs[`scenario${i}ExtraMonthlyPayment`] || 0)
			const closingCosts = Number(inputs[`scenario${i}ClosingCosts`] || 0)
			const startDateValue = inputs[`scenario${i}StartDate`]
			const startDate = startDateValue && typeof startDateValue !== 'boolean' ? new Date(startDateValue) : new Date()

			if (homePrice > 0 && interestRateAPR > 0 && loanTermYears > 0) {
				// Calculate down payment amount
				let downPaymentAmount = 0
				if (downPaymentType === 'percentage') {
					downPaymentAmount = (homePrice * downPayment) / 100
				} else {
					downPaymentAmount = downPayment
				}

				// Calculate property tax
				let propertyTaxValue = 0
				if (propertyTaxAnnual > 0) {
					if (propertyTaxType === 'percentage') {
						propertyTaxValue = (homePrice * propertyTaxAnnual) / 100
					} else {
						propertyTaxValue = propertyTaxAnnual
					}
				}

				scenarios.push({
					scenarioName,
					homePrice,
					downPayment,
					downPaymentType,
					downPaymentAmount,
					interestRateAPR,
					loanTermYears,
					propertyTaxAnnual: propertyTaxValue,
					homeInsuranceAnnual,
					HOAmonthly,
					extraMonthlyPayment,
					closingCosts,
					startDate,
				})
			}
		}
	}

	// Validation
	if (!Array.isArray(scenarios) || scenarios.length < 2 || scenarios.length > 4) {
		return {
			comparisonTable: null,
			winner: null,
			bestScenarioByMetric: null,
			formulaExplanation: null,
		}
	}

	// Calculate each scenario
	const comparisonResults: MortgageComparisonResult[] = []

	for (const scenario of scenarios) {
		const scenarioName = String(scenario.scenarioName || 'Mortgage')
		const homePrice = Number(scenario.homePrice || 0)
		const downPaymentAmount = Number(scenario.downPaymentAmount || 0)
		const interestRateAPR = Number(scenario.interestRateAPR || scenario.APR || 0)
		const loanTermYears = Math.floor(Number(scenario.loanTermYears || scenario.term || 0))
		const propertyTaxAnnual = Number(scenario.propertyTaxAnnual || 0)
		const homeInsuranceAnnual = Number(scenario.homeInsuranceAnnual || 0)
		const HOAmonthly = Number(scenario.HOAmonthly || scenario.HOA || 0)
		const extraMonthlyPayment = Number(scenario.extraMonthlyPayment || 0)
		const closingCosts = Number(scenario.closingCosts || 0)
		const startDate = scenario.startDate ? new Date(scenario.startDate) : new Date()

		// Validate individual scenario
		if (
			isNaN(homePrice) ||
			isNaN(downPaymentAmount) ||
			isNaN(interestRateAPR) ||
			isNaN(loanTermYears) ||
			isNaN(propertyTaxAnnual) ||
			isNaN(homeInsuranceAnnual) ||
			isNaN(HOAmonthly) ||
			isNaN(extraMonthlyPayment) ||
			isNaN(closingCosts) ||
			homePrice <= 0 ||
			downPaymentAmount < 0 ||
			downPaymentAmount >= homePrice ||
			interestRateAPR <= 0 ||
			interestRateAPR > 30 ||
			loanTermYears < 1 ||
			loanTermYears > 40 ||
			propertyTaxAnnual < 0 ||
			homeInsuranceAnnual < 0 ||
			HOAmonthly < 0 ||
			extraMonthlyPayment < 0 ||
			closingCosts < 0
		) {
			continue
		}

		const loanAmount = homePrice - downPaymentAmount
		const monthlyRate = interestRateAPR / 100 / 12
		const numberOfPayments = loanTermYears * 12

		// Calculate monthly P&I payment
		let monthlyPandI: number
		if (monthlyRate === 0) {
			monthlyPandI = loanAmount / numberOfPayments
		} else {
			const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments)
			monthlyPandI = (loanAmount * monthlyRate * rateFactor) / (rateFactor - 1)
		}

		monthlyPandI = Math.round(monthlyPandI * 100) / 100

		// Calculate monthly taxes and insurance
		const monthlyTax = propertyTaxAnnual / 12
		const monthlyInsurance = homeInsuranceAnnual / 12

		// Calculate total monthly payment
		let totalMonthly = monthlyPandI
		if (includeTaxesInsurance) {
			totalMonthly = monthlyPandI + monthlyTax + monthlyInsurance + HOAmonthly
		} else {
			totalMonthly = monthlyPandI + HOAmonthly
		}
		totalMonthly = Math.round(totalMonthly * 100) / 100

		// Calculate standard totals (without extra payments)
		const totalPayment = monthlyPandI * numberOfPayments
		const totalInterest = totalPayment - loanAmount
		let totalCost = totalPayment + closingCosts
		if (includeTaxesInsurance) {
			totalCost += (monthlyTax + monthlyInsurance + HOAmonthly) * numberOfPayments
		} else {
			totalCost += HOAmonthly * numberOfPayments
		}

		// Calculate with extra payments if provided
		let payoffMonths: number | undefined
		let payoffDate: string | undefined
		let interestSaved: number | undefined

		if (extraMonthlyPayment > 0) {
			// Simulate mortgage payments with extra payments
			let remainingBalance = loanAmount
			let monthsPaid = 0
			let totalInterestPaid = 0
			const paymentWithExtra = monthlyPandI + extraMonthlyPayment

			const maxMonths = numberOfPayments * 2

			while (remainingBalance > 0.01 && monthsPaid < maxMonths) {
				const periodInterest = remainingBalance * monthlyRate
				totalInterestPaid += periodInterest
				const principalPayment = paymentWithExtra - periodInterest
				remainingBalance = remainingBalance - principalPayment
				monthsPaid++

				if (remainingBalance < 0) {
					remainingBalance = 0
				}
			}

			payoffMonths = monthsPaid
			interestSaved = totalInterest - totalInterestPaid
			
			// Calculate payoff date
			const newPayoffDate = new Date(startDate)
			newPayoffDate.setMonth(newPayoffDate.getMonth() + monthsPaid)
			payoffDate = newPayoffDate.toISOString().split('T')[0]
		} else {
			// Calculate standard payoff date
			const standardPayoffDate = new Date(startDate)
			standardPayoffDate.setMonth(standardPayoffDate.getMonth() + numberOfPayments)
			payoffDate = standardPayoffDate.toISOString().split('T')[0]
		}

		comparisonResults.push({
			scenarioName,
			homePrice: Math.round(homePrice * 100) / 100,
			downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
			loanAmount: Math.round(loanAmount * 100) / 100,
			interestRateAPR: Math.round(interestRateAPR * 10000) / 100,
			loanTermYears,
			propertyTaxAnnual: Math.round(propertyTaxAnnual * 100) / 100,
			homeInsuranceAnnual: Math.round(homeInsuranceAnnual * 100) / 100,
			HOAmonthly: Math.round(HOAmonthly * 100) / 100,
			extraMonthlyPayment: Math.round(extraMonthlyPayment * 100) / 100,
			closingCosts: Math.round(closingCosts * 100) / 100,
			monthlyPandI,
			totalMonthly,
			totalPayment: Math.round(totalPayment * 100) / 100,
			totalInterest: Math.round(totalInterest * 100) / 100,
			totalCost: Math.round(totalCost * 100) / 100,
			payoffMonths,
			payoffDate,
			interestSaved: interestSaved !== undefined ? Math.round(interestSaved * 100) / 100 : undefined,
		})
	}

	if (comparisonResults.length < 2) {
		return {
			comparisonTable: null,
			winner: null,
			bestScenarioByMetric: null,
			formulaExplanation: null,
		}
	}

	// Find winner by selected metric
	let winnerIndex = 0
	let winnerValue = comparisonResults[0].totalMonthly
	const metricLabel = comparisonMetric === 'lowest-total-monthly-payment' ? 'Lowest Total Monthly Payment' :
		comparisonMetric === 'lowest-total-interest' ? 'Lowest Total Interest' :
		comparisonMetric === 'lowest-total-cost' ? 'Lowest Total Cost' :
		'Fastest Payoff'

	if (comparisonMetric === 'lowest-total-monthly-payment') {
		winnerValue = comparisonResults[0].totalMonthly
		for (let i = 1; i < comparisonResults.length; i++) {
			if (comparisonResults[i].totalMonthly < winnerValue) {
				winnerValue = comparisonResults[i].totalMonthly
				winnerIndex = i
			}
		}
	} else if (comparisonMetric === 'lowest-total-interest') {
		winnerValue = comparisonResults[0].totalInterest
		for (let i = 1; i < comparisonResults.length; i++) {
			if (comparisonResults[i].totalInterest < winnerValue) {
				winnerValue = comparisonResults[i].totalInterest
				winnerIndex = i
			}
		}
	} else if (comparisonMetric === 'lowest-total-cost') {
		winnerValue = comparisonResults[0].totalCost
		for (let i = 1; i < comparisonResults.length; i++) {
			if (comparisonResults[i].totalCost < winnerValue) {
				winnerValue = comparisonResults[i].totalCost
				winnerIndex = i
			}
		}
	} else {
		// fastest-payoff
		const payoffMonths1 = comparisonResults[0].payoffMonths || (comparisonResults[0].loanTermYears * 12)
		winnerValue = payoffMonths1
		for (let i = 1; i < comparisonResults.length; i++) {
			const payoffMonthsI = comparisonResults[i].payoffMonths || (comparisonResults[i].loanTermYears * 12)
			if (payoffMonthsI < winnerValue) {
				winnerValue = payoffMonthsI
				winnerIndex = i
			}
		}
	}

	const winner = comparisonResults[winnerIndex]

	// Build formula explanation
	let formulaExplanation = ''
	
	formulaExplanation = `Mortgage Comparison Analysis:\n\nComparison Metric: ${metricLabel}\nInclude Taxes & Insurance: ${includeTaxesInsurance ? 'Yes' : 'No'}\n\nFor each mortgage, the calculation uses the standard mortgage payment formula:\nM = L × [r(1+r)^n] / [(1+r)^n - 1]\n\nWhere:\n- M = Monthly payment (Principal & Interest)\n- L = Loan amount (Home price - Down payment)\n- r = Monthly interest rate (APR / 12)\n- n = Number of payments (Years × 12)\n\nTotal Monthly Payment = P&I${includeTaxesInsurance ? ' + Property Tax + Insurance' : ''} + HOA\nTotal Cost = Total Payment + Closing Costs${includeTaxesInsurance ? ' + (Taxes + Insurance + HOA) × Months' : ' + HOA × Months'}\n\n${comparisonResults.map((mortgage, idx) => {
		const isWinner = idx === winnerIndex
		return `${isWinner ? '★ ' : ''}${mortgage.scenarioName}:\n  Home Price: $${mortgage.homePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Down Payment: $${mortgage.downPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Loan Amount: $${mortgage.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  APR: ${mortgage.interestRateAPR}%\n  Term: ${mortgage.loanTermYears} years\n  P&I Monthly: $${mortgage.monthlyPandI.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Total Monthly: $${mortgage.totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${includeTaxesInsurance ? `\n  Property Tax (monthly): $${(mortgage.propertyTaxAnnual / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Insurance (monthly): $${(mortgage.homeInsuranceAnnual / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${mortgage.HOAmonthly > 0 ? `\n  HOA (monthly): $${mortgage.HOAmonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}\n  Total Interest: $${mortgage.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Closing Costs: $${mortgage.closingCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n  Total Cost: $${mortgage.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${mortgage.payoffMonths ? `\n  Payoff Time (with extra payments): ${mortgage.payoffMonths} months` : `\n  Payoff Time: ${mortgage.loanTermYears * 12} months`}${mortgage.interestSaved ? `\n  Interest Saved (with extra payments): $${mortgage.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}${mortgage.payoffDate ? `\n  Payoff Date: ${new Date(mortgage.payoffDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}${isWinner ? `\n  → Winner by ${metricLabel}` : ''}`
	}).join('\n\n')}\n\n${metricLabel === 'Lowest Total Monthly Payment' ? 'The mortgage with the lowest total monthly payment may not have the lowest total cost. Longer terms and higher down payments reduce monthly payments but may increase total interest. Consider your budget and long-term financial goals.' : metricLabel === 'Lowest Total Interest' ? 'The mortgage with the lowest total interest saves you money over the life of the loan. This is often the best choice if you can afford the monthly payment and want to minimize total cost.' : metricLabel === 'Lowest Total Cost' ? 'The mortgage with the lowest total cost (payment + closing costs + taxes/insurance/HOA) is the most economical overall. This considers all costs to show the true cost of homeownership.' : 'The mortgage with the fastest payoff gets you out of debt sooner. This requires higher monthly payments or extra payments, but saves significant interest over time.'}`

	return {
		comparisonTable: comparisonResults,
		winner: winner,
		bestScenarioByMetric: {
			metric: comparisonMetric,
			scenarioIndex: winnerIndex,
			scenarioName: winner.scenarioName,
			value: winnerValue,
		},
		formulaExplanation,
	}
}
