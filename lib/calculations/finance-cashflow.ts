/**
 * Shared investment/savings cash-flow model.
 *
 * ## Nominal annual rate
 * The quoted rate `r` is a nominal annual rate. The monthly accrual share is
 * always `r/12` applied to **principal only** (simple intra-period accrual).
 *
 * ## Accrual vs capitalization
 * - Accrual: each month `accrued += principal * (r/12)`.
 * - Capitalization: on compounding-boundary months only,
 *   `principal += accrued; accrued = 0`.
 * Uncapitalized interest does **not** itself earn interest — that is what
 * distinguishes annual/quarterly compounding from monthly compounding.
 *
 * ## Contributions (ordinary / end-of-month)
 * Within a month the order is: accrue → capitalize (if boundary) → contribute
 * → withdraw. A deposit therefore earns from the **following** month onward.
 *
 * ## Why not “multiply by (1+r) once on the year-end balance”?
 * That wrongly credits full-year interest to deposits made mid-year (the 1332
 * bug). Time-weighted accrual on principal avoids interest before money
 * arrives without secretly switching to monthly compounding.
 */

import { MAX_HORIZON_YEARS, assertBoundedIterations } from '@/lib/calculations/computation-bounds'

export interface YearCashflowRow {
	year: number
	startingBalance: number
	contribution: number
	interestEarned: number
	endingBalance: number
}

export function round2(value: number): number {
	return Math.round(value * 100) / 100
}

export function getCompoundingFrequency(
	frequency: string | number | boolean,
): number {
	if (typeof frequency === 'number') return frequency
	if (typeof frequency === 'boolean') return frequency ? 12 : 1
	const map: Record<string, number> = {
		annually: 1,
		quarterly: 4,
		monthly: 12,
	}
	return map[String(frequency).toLowerCase()] || 12
}

export function getContributionsPerYear(
	frequency: string | number | boolean,
): number {
	if (typeof frequency === 'number') return frequency
	if (typeof frequency === 'boolean') return frequency ? 12 : 1
	const map: Record<string, number> = {
		monthly: 12,
		yearly: 1,
	}
	return map[String(frequency).toLowerCase()] || 12
}

/** Months (1–12) that close a compounding period. */
export function compoundingMonths(periodsPerYear: number): Set<number> {
	if (periodsPerYear <= 1) return new Set([12])
	if (periodsPerYear === 4) return new Set([3, 6, 9, 12])
	return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

/** Months (1–12) when a contribution event occurs. */
export function contributionMonths(contributionsPerYear: number): Set<number> {
	if (contributionsPerYear <= 1) return new Set([12])
	return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
}

export function simulateFinanceCashflow(options: {
	initialPrincipal: number
	contributionAmount: number
	contributionsPerYear: number
	compoundingFrequency: number
	annualRatePercent: number
	years: number
	interestType: string
	monthlyWithdrawal: number
}): {
	finalBalance: number
	totalContributions: number
	totalWithdrawals: number
	yearlyBreakdown: YearCashflowRow[]
} {
	assertBoundedIterations(
		options.years * 12,
		MAX_HORIZON_YEARS * 12,
		'Finance horizon (months)',
	)

	const compoundSet = compoundingMonths(
		options.interestType === 'simple' ? 12 : options.compoundingFrequency,
	)
	const contribSet = contributionMonths(options.contributionsPerYear)
	const monthlyAccrualRate = options.annualRatePercent / 100 / 12

	let principal = options.initialPrincipal
	let accrued = 0
	let totalWithdrawals = 0
	const yearlyBreakdown: YearCashflowRow[] = []

	for (let year = 1; year <= options.years; year++) {
		const startingBalance = round2(principal + accrued)
		let yearContributions = 0
		let yearWithdrawals = 0

		for (let month = 1; month <= 12; month++) {
			// 1) Accrue nominal month-share on principal only
			if (monthlyAccrualRate !== 0) {
				accrued += principal * monthlyAccrualRate
			}

			// 2) Capitalize only on compounding-period boundaries (compound mode).
			//    Simple mode never folds accrued into principal for re-earning.
			if (options.interestType !== 'simple' && compoundSet.has(month)) {
				principal += accrued
				accrued = 0
			}

			// 3) End-of-month contribution
			if (contribSet.has(month) && options.contributionAmount !== 0) {
				principal += options.contributionAmount
				yearContributions += options.contributionAmount
			}

			// 4) Optional monthly withdrawal (principal first, then accrued)
			const gross = principal + accrued
			const withdrawal = Math.min(options.monthlyWithdrawal, gross)
			yearWithdrawals += withdrawal
			totalWithdrawals += withdrawal
			let remaining = withdrawal
			const fromPrincipal = Math.min(principal, remaining)
			principal -= fromPrincipal
			remaining -= fromPrincipal
			accrued = Math.max(0, accrued - remaining)
		}

		const endingBalance = round2(principal + accrued)
		const interestEarned = round2(
			endingBalance - startingBalance - yearContributions + yearWithdrawals,
		)
		yearlyBreakdown.push({
			year,
			startingBalance: round2(startingBalance),
			contribution: round2(yearContributions),
			interestEarned,
			endingBalance,
		})
	}

	const totalContributions =
		options.initialPrincipal +
		options.contributionAmount * options.contributionsPerYear * options.years

	return {
		finalBalance: round2(principal + accrued),
		totalContributions: round2(totalContributions),
		totalWithdrawals: round2(totalWithdrawals),
		yearlyBreakdown,
	}
}
