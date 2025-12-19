import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Step interface for compound interest calculation
 */
interface CalculationStep {
	title: string
	math: string
	explanation: string
}

/**
 * Calculate compound interest with step-by-step explanation
 * Inputs: principal, annualRate, years, compoundFrequency
 * Outputs: finalAmount, totalInterest, steps
 */
export const calculateCompoundInterest: CalculatorFunction = (inputs) => {
	const principal = Number(inputs.principal)
	const annualRate = Number(inputs.annualRate)
	const years = Number(inputs.years)
	const compoundFrequency = Number(inputs.compoundFrequency || 12) // Default monthly

	if (
		isNaN(principal) ||
		isNaN(annualRate) ||
		isNaN(years) ||
		isNaN(compoundFrequency) ||
		principal <= 0 ||
		annualRate < 0 ||
		years <= 0 ||
		compoundFrequency <= 0
	) {
		return {
			finalAmount: null,
			totalInterest: null,
			steps: null,
		}
	}

	// Convert annual rate to decimal
	const rate = annualRate / 100

	// Calculate compound interest: A = P(1 + r/n)^(nt)
	// where A = final amount, P = principal, r = annual rate, n = compounding frequency, t = years
	const finalAmount =
		principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * years)

	// Round to 2 decimal places
	const roundedFinalAmount = Math.round(finalAmount * 100) / 100

	// Calculate total interest earned
	const totalInterest = roundedFinalAmount - principal

	// Build step-by-step calculation
	const steps: CalculationStep[] = []

	// Step 1: Input values
	steps.push({
		title: 'Step 1: Input Values',
		math: `Principal (P) = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nAnnual Rate (r) = ${annualRate}%\nYears (t) = ${years}\nCompounding Frequency (n) = ${compoundFrequency} times per year`,
		explanation: 'These are the values you entered for the calculation.',
	})

	// Step 2: Convert rate to decimal
	steps.push({
		title: 'Step 2: Convert Annual Rate to Decimal',
		math: `r = ${annualRate}% / 100 = ${rate}`,
		explanation: 'Convert the annual interest rate from percentage to decimal form.',
	})

	// Step 3: Calculate periodic rate
	const periodicRate = rate / compoundFrequency
	steps.push({
		title: 'Step 3: Calculate Periodic Interest Rate',
		math: `Periodic Rate = r / n = ${rate} / ${compoundFrequency} = ${periodicRate.toFixed(6)}`,
		explanation: `Divide the annual rate by the compounding frequency to get the rate per compounding period.`,
	})

	// Step 4: Calculate number of periods
	const numberOfPeriods = compoundFrequency * years
	steps.push({
		title: 'Step 4: Calculate Total Number of Compounding Periods',
		math: `Number of Periods = n × t = ${compoundFrequency} × ${years} = ${numberOfPeriods}`,
		explanation: 'Multiply the compounding frequency by the number of years to get the total number of compounding periods.',
	})

	// Step 5: Calculate the compound factor
	const compoundFactor = Math.pow(1 + periodicRate, numberOfPeriods)
	steps.push({
		title: 'Step 5: Calculate Compound Factor',
		math: `(1 + r/n)^(nt) = (1 + ${periodicRate.toFixed(6)})^${numberOfPeriods} = ${compoundFactor.toFixed(6)}`,
		explanation: 'This factor represents how much your money grows per dollar invested.',
	})

	// Step 6: Calculate final amount
	steps.push({
		title: 'Step 6: Calculate Final Amount',
		math: `A = P × (1 + r/n)^(nt)\nA = $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${compoundFactor.toFixed(6)}\nA = $${finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
		explanation: 'Multiply the principal by the compound factor to get the final amount.',
	})

	// Step 7: Calculate total interest
	steps.push({
		title: 'Step 7: Calculate Total Interest Earned',
		math: `Total Interest = Final Amount - Principal\nTotal Interest = $${roundedFinalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest = $${Math.round(totalInterest * 100) / 100}`,
		explanation: 'Subtract the original principal from the final amount to find how much interest was earned.',
	})

	return {
		finalAmount: roundedFinalAmount,
		totalInterest: Math.round(totalInterest * 100) / 100,
		steps,
	}
}

