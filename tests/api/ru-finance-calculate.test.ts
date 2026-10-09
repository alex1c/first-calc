/**
 * @vitest-environment node
 *
 * Integration tests: Russian finance calculator forms → calculate API.
 * Uses the real registry (no mocks) so locale resolution, JSON schemas,
 * and registered calculation engines are exercised end-to-end.
 */
import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/calculators/[id]/calculate/route'
import { hasCalculation } from '@/lib/calculations/registry'
import { resolveRequestLocale } from '@/lib/i18n'

// Side-effect imports ensure finance engines are registered before assertions
import '@/lib/calculations/mortgage'
import '@/lib/calculations/roi'
import '@/lib/calculations/investment'
import '@/lib/calculations/auto-loan'
import '@/lib/calculations/personal-loan'
import '@/lib/calculations/savings'
import '@/lib/calculations/loan-overpayment'
import '@/lib/calculations/loan'

async function postCalculate(
	id: string,
	inputs: Record<string, number | string>,
	options: { bodyLocale?: string; queryLocale?: string } = {},
) {
	const { bodyLocale = 'ru', queryLocale = 'ru' } = options
	const url = new URL(`http://localhost:3000/api/calculators/${id}/calculate`)
	if (queryLocale) {
		url.searchParams.set('locale', queryLocale)
	}
	const request = new Request(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			locale: bodyLocale,
			inputs,
		}),
	})
	const response = await POST(request, { params: { id } })
	const data = await response.json()
	return { response, data }
}

describe('resolveRequestLocale contract', () => {
	it('prefers body locale over query and never remaps ru to en', () => {
		expect(resolveRequestLocale('ru', 'en')).toBe('ru')
		expect(resolveRequestLocale(undefined, 'ru')).toBe('ru')
		expect(resolveRequestLocale('en', 'ru')).toBe('en')
		expect(resolveRequestLocale(undefined, undefined)).toBe('en')
	})
})

describe('finance calculation registration', () => {
	it('registers all seven JSON finance engines plus loan payment', () => {
		for (const id of [
			'calculateMortgage',
			'calculateROI',
			'calculateInvestment',
			'calculateAutoLoan',
			'calculatePersonalLoan',
			'calculateSavings',
			'calculateLoanOverpayment',
			'calculateLoanPayment',
		]) {
			expect(hasCalculation(id), `${id} must be registered`).toBe(true)
		}
	})
})

describe('POST /api/calculators/:id/calculate — RU finance forms', () => {
	it('rejects invalid locale instead of silently falling back to en', async () => {
		const { response, data } = await postCalculate(
			'loan-payment',
			{ principal: 10000, annualRate: 8, years: 5 },
			{ bodyLocale: 'de', queryLocale: 'de' },
		)
		expect(response.status).toBe(400)
		expect(data.error).toMatch(/unsupported locale/i)
	})

	it('uses body locale when query is omitted (UI contract)', async () => {
		const { response, data } = await postCalculate(
			'loan-payment',
			{ principal: 10000, annualRate: 8, years: 5 },
			{ bodyLocale: 'ru', queryLocale: '' },
		)
		expect(response.status).toBe(200)
		expect(data.locale).toBe('ru')
		expect(data.results.monthlyPayment).toBeCloseTo(202.76, 1)
	})

	it('loan-payment accepts whole-year term 5 with RU field names', async () => {
		const { response, data } = await postCalculate('loan-payment', {
			principal: 10000,
			annualRate: 8,
			years: 5,
		})
		expect(response.status).toBe(200)
		expect(data.locale).toBe('ru')
		expect(Number.isFinite(data.results.monthlyPayment)).toBe(true)
		expect(data.results.monthlyPayment).toBeGreaterThan(0)
		expect(data.results.totalInterest).toBeGreaterThan(0)
	})

	it('mortgage-calculator RU uses TS field names on the shared mortgage engine', async () => {
		// TS-owned definition (homePrice path). Orphan JSON loanAmount schema is skipped.
		const { response, data } = await postCalculate('mortgage-calculator', {
			homePrice: 300000,
			downPayment: 0,
			downPaymentType: 'amount',
			loanTermYears: '30',
			interestRateAPR: 4.5,
			paymentFrequency: 'monthly',
		})
		expect(response.status).toBe(200)
		expect(data.locale).toBe('ru')
		expect(
			data.results.monthlyMortgagePayment ?? data.results.monthlyPayment,
		).toBeCloseTo(1520.06, 2)
		expect(data.results.loanAmount).toBe(300000)
	})

	it('roi-calculator RU form returns a positive ROI', async () => {
		const { response, data } = await postCalculate('roi-calculator', {
			investmentCost: 10000,
			returnValue: 12000,
			timePeriod: 1,
			revenueType: 'one-time',
		})
		expect(response.status).toBe(200)
		expect(
			data.results.roiPercentage ?? data.results.roi,
		).toBeCloseTo(20, 1)
		expect(data.results.netProfit).toBeCloseTo(2000, 1)
	})

	it('investment-calculator RU form returns growth', async () => {
		const { response, data } = await postCalculate('investment-calculator', {
			initialInvestment: 10000,
			periodicContribution: 100,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 7,
			investmentPeriod: 10,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
		})
		expect(response.status).toBe(200)
		expect(data.results.finalValue).toBeGreaterThan(10000)
		expect(
			Number.isFinite(data.results.totalReturn ?? data.results.totalProfit),
		).toBe(true)
	})

	it('auto-loan-calculator RU form returns monthly payment', async () => {
		const { response, data } = await postCalculate('auto-loan-calculator', {
			vehiclePrice: 30000,
			downPayment: 5000,
			tradeInValue: 0,
			salesTaxRate: 0,
			annualInterestRate: 6,
			loanTerm: 5,
			fees: 0,
		})
		expect(response.status).toBe(200)
		expect(data.results.monthlyPayment).toBeCloseTo(483.32, 2)
	})

	it('personal-loan-calculator RU form returns monthly payment', async () => {
		const { response, data } = await postCalculate('personal-loan-calculator', {
			loanAmount: 10000,
			annualInterestRate: 10,
			loanTerm: 3,
			paymentFrequency: 'monthly',
			originationFee: 0,
			feeType: 'percentage',
			extraMonthlyPayment: 0,
		})
		expect(response.status).toBe(200)
		expect(data.results.monthlyPayment).toBeGreaterThan(0)
		expect(Number.isFinite(data.results.totalInterest)).toBe(true)
	})

	it('savings-calculator RU form returns final value', async () => {
		const { response, data } = await postCalculate('savings-calculator', {
			initialSavings: 5000,
			regularContribution: 200,
			contributionFrequency: 'monthly',
			annualInterestRate: 5,
			savingsPeriod: 10,
			compoundingFrequency: 'monthly',
			targetAmount: 0,
			inflationRate: 0,
		})
		expect(response.status).toBe(200)
		expect(
			data.results.finalSavings ?? data.results.finalValue,
		).toBeGreaterThan(5000)
		expect(
			Number.isFinite(
				data.results.totalInterestEarned ?? data.results.totalInterest,
			),
		).toBe(true)
	})

	it('loan-overpayment-calculator RU form returns payment and overpayment', async () => {
		const { response, data } = await postCalculate('loan-overpayment-calculator', {
			loanAmount: 200000,
			annualInterestRate: 5,
			loanTerm: 20,
			paymentFrequency: 'monthly',
			extraMonthlyPayment: 0,
			loanType: 'annuity',
		})
		expect(response.status).toBe(200)
		expect(
			data.results.regularPayment ?? data.results.monthlyPayment,
		).toBeGreaterThan(0)
		expect(data.results.overpayment).toBeGreaterThan(0)
	})
})
