/**
 * Compare total cost of leasing vs buying a car
 * Inputs: comparisonYears, annualMileage, purchasePrice, downPayment, loanAPR,
 *         loanTermMonths, resaleValueAfterYears, salesTaxOrFees, leaseMonthlyPayment,
 *         leaseTermMonths, dueAtSigning, residualValue, leaseFees, mileageLimitPerYear,
 *         excessMileageFeePerMileKm, insuranceDifferenceMonthly, maintenanceDifferenceMonthly
 * Outputs: totalCostBuy, totalCostLease, difference, recommendationText, breakdown, insights
 */

import type { CalculatorFunction } from '@/lib/calculators/types'

/**
 * Calculate monthly loan payment using standard amortization formula
 */
function calculateLoanPayment(
	loanAmount: number,
	annualRate: number,
	termMonths: number,
): number {
	if (termMonths === 0) {
		return 0
	}
	if (annualRate === 0) {
		return loanAmount / termMonths
	}
	const monthlyRate = annualRate / 100 / 12
	const rateFactor = Math.pow(1 + monthlyRate, termMonths)
	return (loanAmount * monthlyRate * rateFactor) / (rateFactor - 1)
}

/**
 * Compare total cost of leasing vs buying a car
 */
export const calculateLeaseVsBuy: CalculatorFunction = (inputs) => {
	// Extract and parse inputs
	const comparisonYears = Math.floor(Number(inputs.comparisonYears || 1))
	const annualMileage = Number(inputs.annualMileage || 0)
	const purchasePrice = Number(inputs.purchasePrice || 0)
	const downPayment = Number(inputs.downPayment || 0)
	const loanAPR = Number(inputs.loanAPR || 0)
	const loanTermMonths = Math.floor(Number(inputs.loanTermMonths || 0))
	const resaleValueAfterYears = Number(inputs.resaleValueAfterYears || 0)
	const salesTaxOrFees = Number(inputs.salesTaxOrFees || 0)
	const leaseMonthlyPayment = Number(inputs.leaseMonthlyPayment || 0)
	const leaseTermMonths = Math.floor(Number(inputs.leaseTermMonths || 0))
	const dueAtSigning = Number(inputs.dueAtSigning || 0)
	const residualValue = Number(inputs.residualValue || 0)
	const leaseFees = Number(inputs.leaseFees || 0)
	const mileageLimitPerYear = Number(inputs.mileageLimitPerYear || 0)
	const excessMileageFeePerMileKm = Number(inputs.excessMileageFeePerMileKm || 0)
	const insuranceDifferenceMonthly = Number(inputs.insuranceDifferenceMonthly || 0)
	const maintenanceDifferenceMonthly = Number(inputs.maintenanceDifferenceMonthly || 0)

	// Basic validation - only check for NaN, allow any numeric values
	if (
		isNaN(comparisonYears) ||
		isNaN(annualMileage) ||
		isNaN(purchasePrice) ||
		isNaN(downPayment) ||
		isNaN(loanAPR) ||
		isNaN(loanTermMonths) ||
		isNaN(resaleValueAfterYears) ||
		isNaN(salesTaxOrFees) ||
		isNaN(leaseMonthlyPayment) ||
		isNaN(leaseTermMonths) ||
		isNaN(dueAtSigning) ||
		isNaN(residualValue) ||
		isNaN(leaseFees) ||
		isNaN(mileageLimitPerYear) ||
		isNaN(excessMileageFeePerMileKm) ||
		isNaN(insuranceDifferenceMonthly) ||
		isNaN(maintenanceDifferenceMonthly)
	) {
		return {
			totalCostBuy: null,
			totalCostLease: null,
			difference: null,
			recommendationText: null,
			breakdown: null,
			insights: null,
		}
	}

	const comparisonMonths = comparisonYears * 12

	// ===== BUY CALCULATION =====
	// Calculate loan amount
	const loanAmount = purchasePrice - downPayment + salesTaxOrFees

	// Calculate monthly loan payment
	let monthlyLoanPayment = 0
	let totalLoanPayments = 0
	if (loanTermMonths > 0 && loanAmount > 0) {
		monthlyLoanPayment = calculateLoanPayment(loanAmount, loanAPR, loanTermMonths)
		// Total payments within comparison period
		const paymentsInPeriod = Math.min(loanTermMonths, comparisonMonths)
		totalLoanPayments = monthlyLoanPayment * paymentsInPeriod
	}

	// Total cost to buy
	const totalCostBuy = downPayment + totalLoanPayments + salesTaxOrFees - resaleValueAfterYears

	// ===== LEASE CALCULATION =====
	// Calculate lease payments within comparison period
	const leasePaymentsInPeriod = Math.min(leaseTermMonths, comparisonMonths)
	const totalLeasePayments = leaseMonthlyPayment * leasePaymentsInPeriod

	// Calculate mileage penalty if applicable
	let mileagePenalty = 0
	if (mileageLimitPerYear > 0 && excessMileageFeePerMileKm > 0) {
		const totalMileageInPeriod = annualMileage * comparisonYears
		const allowedMileage = mileageLimitPerYear * comparisonYears
		const excessMileage = Math.max(0, totalMileageInPeriod - allowedMileage)
		mileagePenalty = excessMileage * excessMileageFeePerMileKm
	}

	// Total cost to lease
	const totalCostLease = dueAtSigning + totalLeasePayments + leaseFees + mileagePenalty

	// Add insurance and maintenance differences
	// Positive difference means lease costs more, negative means buy costs more
	// Add to both sides appropriately
	const insuranceMaintenanceDifference = (insuranceDifferenceMonthly + maintenanceDifferenceMonthly) * comparisonMonths
	const totalCostBuyWithExtras = totalCostBuy + insuranceMaintenanceDifference
	const totalCostLeaseWithExtras = totalCostLease - insuranceMaintenanceDifference

	// Use the costs with extras for comparison
	const finalCostBuy = totalCostBuyWithExtras
	const finalCostLease = totalCostLeaseWithExtras

	// Calculate difference
	const difference = finalCostLease - finalCostBuy

	// Generate recommendation
	let recommendationText: string
	if (Math.abs(difference) < 100) {
		recommendationText = `The costs are very similar. Both options cost approximately the same over ${comparisonYears} year${comparisonYears > 1 ? 's' : ''}.`
	} else if (difference > 0) {
		recommendationText = `Buying is ${Math.abs(difference).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cheaper than leasing over ${comparisonYears} year${comparisonYears > 1 ? 's' : ''}.`
	} else {
		recommendationText = `Leasing is ${Math.abs(difference).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cheaper than buying over ${comparisonYears} year${comparisonYears > 1 ? 's' : ''}.`
	}

	// Create breakdown
	const breakdown = {
		buy: {
			upfront: downPayment + salesTaxOrFees,
			monthlyPayments: totalLoanPayments,
			resaleCredit: -resaleValueAfterYears,
			insuranceMaintenance: insuranceMaintenanceDifference,
			total: finalCostBuy,
		},
		lease: {
			upfront: dueAtSigning + leaseFees,
			monthlyPayments: totalLeasePayments,
			mileagePenalty: mileagePenalty,
			insuranceMaintenance: -insuranceMaintenanceDifference,
			total: finalCostLease,
		},
		difference: difference,
	}

	// Generate insights
	const insights: string[] = []

	// Cost comparison insight
	if (Math.abs(difference) > 1000) {
		const cheaperOption = difference > 0 ? 'buying' : 'leasing'
		insights.push(
			`${cheaperOption.charAt(0).toUpperCase() + cheaperOption.slice(1)} is significantly cheaper, saving you $${Math.abs(difference).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} over ${comparisonYears} year${comparisonYears > 1 ? 's' : ''}.`
		)
	}

	// Resale value insight
	if (resaleValueAfterYears > 0) {
		const resalePercentage = (resaleValueAfterYears / purchasePrice) * 100
		insights.push(
			`Resale value of $${resaleValueAfterYears.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${resalePercentage.toFixed(1)}% of purchase price) reduces your total cost of buying.`
		)
	}

	// Mileage penalty insight
	if (mileagePenalty > 0) {
		insights.push(
			`Mileage penalty of $${mileagePenalty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} significantly increases lease costs. Consider your driving habits when choosing.`
		)
	} else if (mileageLimitPerYear > 0 && annualMileage > mileageLimitPerYear) {
		insights.push(
			`Your annual mileage (${annualMileage.toLocaleString('en-US')}) exceeds the lease limit (${mileageLimitPerYear.toLocaleString('en-US')}), which will result in additional fees.`
		)
	}

	// Down payment insight
	if (downPayment > 0) {
		const downPaymentPercentage = (downPayment / purchasePrice) * 100
		insights.push(
			`A down payment of $${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${downPaymentPercentage.toFixed(1)}%) reduces your loan amount and total interest paid.`
		)
	}

	// Loan term insight
	if (loanTermMonths > 0 && loanAPR > 0) {
		const totalInterest = totalLoanPayments - loanAmount
		if (totalInterest > 0) {
			insights.push(
				`Total interest paid on the loan: $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
			)
		}
	}

	// Lease term insight
	if (leaseTermMonths < comparisonMonths) {
		insights.push(
			`The lease term (${leaseTermMonths} months) is shorter than the comparison period (${comparisonMonths} months). You may need to lease again or buy after the lease ends.`
		)
	}

	// Round all monetary values to 2 decimal places
	const round = (value: number) => Math.round(value * 100) / 100

	return {
		totalCostBuy: round(finalCostBuy),
		totalCostLease: round(finalCostLease),
		difference: round(difference),
		recommendationText,
		breakdown: JSON.stringify(breakdown),
		insights: insights.join(' '),
		monthlyLoanPayment: round(monthlyLoanPayment),
		totalLoanPayments: round(totalLoanPayments),
		mileagePenalty: round(mileagePenalty),
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateLeaseVsBuy', calculateLeaseVsBuy)

