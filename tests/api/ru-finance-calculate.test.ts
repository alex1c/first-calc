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

	it('mortgage-calculator RU JSON fields resolve the shared mortgage engine', async () => {
		const { response, data } = await postCalculate('mortgage-calculator', {
			loanAmount: 300000,
			downPayment: 60000,
			interestRate: 4.5,
			loanTerm: 30,
			paymentFrequency: 'monthly',
		})
		expect(response.status).toBe(200)
		expect(data.locale).toBe('ru')
		expect(data.results.monthlyPayment).toBeCloseTo(1216.04, 2)
		expect(data.results.loanAmount).toBe(240000)
	})

	it('roi-calculator RU form returns a positive ROI', async () => {
		const { response, data } = await postCalculate('roi-calculator', {
			investmentCost: 10000,
			returnValue: 12000,
			timePeriod: 1,
		})
		expect(response.status).toBe(200)
		expect(data.results.roi).toBeCloseTo(20, 1)
		expect(data.results.netProfit).toBeCloseTo(2000, 1)
	})

	it('investment-calculator RU form returns growth', async () => {
		const { response, data } = await postCalculate('investment-calculator', {
			initialInvestment: 10000,
			monthlyContribution: 100,
			interestRate: 7,
			investmentPeriod: 10,
			compoundingFrequency: 'monthly',
		})
		expect(response.status).toBe(200)
		expect(data.results.finalValue).toBeGreaterThan(10000)
		expect(Number.isFinite(data.results.totalProfit)).toBe(true)
	})

	it('auto-loan-calculator RU form returns monthly payment', async () => {
		const { response, data } = await postCalculate('auto-loan-calculator', {
			carPrice: 30000,
			downPayment: 5000,
			interestRate: 6,
			loanTerm: 5,
			tradeInValue: 0,
			salesTax: 0,
		})
		expect(response.status).toBe(200)
		expect(data.results.monthlyPayment).toBeCloseTo(483.32, 2)
	})

	it('personal-loan-calculator RU form returns monthly payment', async () => {
		const { response, data } = await postCalculate('personal-loan-calculator', {
			loanAmount: 10000,
			interestRate: 10,
			loanTerm: 3,
			originationFee: 0,
		})
		expect(response.status).toBe(200)
		expect(data.results.monthlyPayment).toBeGreaterThan(0)
		expect(Number.isFinite(data.results.totalInterest)).toBe(true)
	})

	it('savings-calculator RU form returns final value', async () => {
		const { response, data } = await postCalculate('savings-calculator', {
			initialSavings: 5000,
			monthlyContribution: 200,
			interestRate: 5,
			years: 10,
			compoundingFrequency: 'monthly',
		})
		expect(response.status).toBe(200)
		expect(data.results.finalValue).toBeGreaterThan(5000)
		expect(Number.isFinite(data.results.totalInterest)).toBe(true)
	})

	it('loan-overpayment-calculator RU form returns payment and overpayment', async () => {
		const { response, data } = await postCalculate('loan-overpayment-calculator', {
			loanAmount: 200000,
			interestRate: 5,
			loanTerm: 20,
			extraPayment: 0,
			paymentFrequency: 'monthly',
		})
		expect(response.status).toBe(200)
		expect(data.results.monthlyPayment).toBeGreaterThan(0)
		expect(data.results.overpayment).toBeGreaterThan(0)
	})
})
