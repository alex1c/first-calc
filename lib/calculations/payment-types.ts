/**
 * Payment type calculation utilities
 * Supports both annuity (fixed) and differentiated (declining) payment types
 */

/**
 * Calculate differentiated payment schedule
 * In differentiated payments:
 * - Principal payment is constant: Principal / Number of Payments
 * - Interest payment decreases: Remaining Balance × Monthly Rate
 * - Total payment decreases over time
 */
export function calculateDifferentiatedPayment(
	principal: number,
	annualRate: number,
	numberOfPayments: number,
): {
	firstPayment: number
	lastPayment: number
	averagePayment: number
	totalPayment: number
	totalInterest: number
	paymentSchedule: Array<{
		month: number
		principalPayment: number
		interestPayment: number
		totalPayment: number
		remainingBalance: number
	}>
} {
	const monthlyRate = annualRate / 100 / 12
	const principalPayment = principal / numberOfPayments

	const paymentSchedule: Array<{
		month: number
		principalPayment: number
		interestPayment: number
		totalPayment: number
		remainingBalance: number
	}> = []

	let remainingBalance = principal
	let totalPayment = 0
	let totalInterest = 0

	for (let month = 1; month <= numberOfPayments; month++) {
		const interestPayment = remainingBalance * monthlyRate
		const totalMonthlyPayment = principalPayment + interestPayment

		paymentSchedule.push({
			month,
			principalPayment: Math.round(principalPayment * 100) / 100,
			interestPayment: Math.round(interestPayment * 100) / 100,
			totalPayment: Math.round(totalMonthlyPayment * 100) / 100,
			remainingBalance: Math.round(remainingBalance * 100) / 100,
		})

		totalPayment += totalMonthlyPayment
		totalInterest += interestPayment
		remainingBalance -= principalPayment
	}

	const firstPayment = paymentSchedule[0]?.totalPayment || 0
	const lastPayment = paymentSchedule[paymentSchedule.length - 1]?.totalPayment || 0
	const averagePayment = totalPayment / numberOfPayments

	return {
		firstPayment: Math.round(firstPayment * 100) / 100,
		lastPayment: Math.round(lastPayment * 100) / 100,
		averagePayment: Math.round(averagePayment * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		paymentSchedule,
	}
}



