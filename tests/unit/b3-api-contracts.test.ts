/**
 * @vitest-environment node
 *
 * B3.1 API contract: defaults, no 200/null required results, domain 4xx,
 * sanitized 500s.
 */
import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/calculators/[id]/calculate/route'

import '@/lib/calculations/loan'
import '@/lib/calculations/car-depreciation'
import '@/lib/calculations/mortgage'
import '@/lib/calculations/roi'
import '@/lib/calculations/investment'
import '@/lib/calculations/savings'
import '@/lib/calculations/compound-interest'
import '@/lib/calculations/random-number'

async function postCalculate(
	id: string,
	inputs: Record<string, unknown>,
	locale = 'en',
) {
	const url = new URL(`http://localhost:3000/api/calculators/${id}/calculate`)
	url.searchParams.set('locale', locale)
	const request = new Request(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ locale, inputs }),
	})
	const response = await POST(request, { params: { id } })
	const data = await response.json()
	return { response, data }
}

function assertNoNullRequiredResults(data: {
	results?: Record<string, unknown>
}) {
	expect(data.results).toBeDefined()
	for (const [key, value] of Object.entries(data.results || {})) {
		if (
			[
				'formulaExplanation',
				'steps',
				'insights',
				'yearByYearTable',
				'yearlyBreakdown',
				'amortizationSchedule',
				'explanation',
			].includes(key)
		) {
			continue
		}
		expect(value, `${key} must not be null`).not.toBeNull()
		expect(value, `${key} must not be undefined`).not.toBeUndefined()
		if (typeof value === 'number') {
			expect(Number.isFinite(value), `${key} must be finite`).toBe(true)
		}
	}
}

describe('B3.1 API contracts', () => {
	it('loan-payment returns finite required results (EN field names)', async () => {
		const { response, data } = await postCalculate('loan-payment', {
			loanAmount: 100000,
			annualInterestRate: 5,
			loanTerm: 30,
			paymentFrequency: 'monthly',
			loanType: 'annuity',
		})
		expect(response.status).toBe(200)
		assertNoNullRequiredResults(data)
		expect(data.results.periodicPayment).toBeGreaterThan(0)
	})

	it('loan-payment RU rejects oversize principal with 400', async () => {
		const { response, data } = await postCalculate(
			'loan-payment',
			{
				principal: 200_000_000,
				annualRate: 5,
				years: 10,
			},
			'ru',
		)
		expect(response.status).toBe(400)
		expect(data.error).toBeTruthy()
		expect(data.results).toBeUndefined()
	})

	it('car-depreciation-calculator rejects hostile yearsOwned with 400', async () => {
		const { response, data } = await postCalculate(
			'car-depreciation-calculator',
			{
				purchasePrice: 25000,
				purchaseType: 'new',
				yearsOwned: 1_000_000,
				depreciationModel: 'simpleAnnualPercent',
				annualDepreciationRate: 15,
			},
		)
		expect(response.status).toBe(400)
		// Schema max and/or engine hard cap both yield 4xx without results
		expect(String(data.error)).toMatch(/Validation failed|exceeds the maximum|Years owned/i)
		expect(data.results).toBeUndefined()
	})

	it('does not return HTTP 200 with null primary finance results', async () => {
		const { response, data } = await postCalculate(
			'mortgage-calculator',
			{
				loanAmount: 0,
				annualInterestRate: 6.5,
				loanTermYears: 30,
			},
		)
		expect(response.status).not.toBe(200)
		expect(response.status).toBeGreaterThanOrEqual(400)
		expect(data.results).toBeUndefined()
	})

	it('random-number-generator rejects excessive quantity with 400', async () => {
		const { response, data } = await postCalculate(
			'random-number-generator',
			{
				minValue: 1,
				maxValue: 10,
				quantity: 50_000,
				allowDuplicates: true,
			},
		)
		expect(response.status).toBe(400)
		expect(data.results).toBeUndefined()
	})

	it('applies select defaults when omitted (loan-payment EN)', async () => {
		const { response, data } = await postCalculate('loan-payment', {
			loanAmount: 50000,
			annualInterestRate: 7,
			loanTerm: 5,
			// paymentFrequency / loanType omitted — server defaults must apply
		})
		expect(response.status).toBe(200)
		assertNoNullRequiredResults(data)
		expect(data.results.periodicPayment).toBeGreaterThan(0)
	})
})
