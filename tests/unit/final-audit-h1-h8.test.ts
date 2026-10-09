/**
 * @vitest-environment node
 *
 * Independent regression expectations for Codex final-audit blockers H1–H8.
 * Expected values are derived outside the engines under test.
 */
import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/calculators/[id]/calculate/route'
import { calculateROI } from '@/lib/calculations/roi'
import { calculateCompoundInterest } from '@/lib/calculations/compound-interest'
import { calculateLoanComparison } from '@/lib/calculations/loan-comparison'
import { calculateMortgageComparison } from '@/lib/calculations/mortgage-comparison'
import { calculateMortgage } from '@/lib/calculations/mortgage'
import { calculateNumbersToWords } from '@/lib/calculations/numbers-to-words'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateSavings } from '@/lib/calculations/savings'
import { calculateLoanPayment } from '@/lib/calculations/loan'
import { getCalculatorById } from '@/lib/calculators/loader'

async function postCalculate(
	id: string,
	inputs: Record<string, number | string | boolean>,
	locale = 'ru',
) {
	const request = new Request(
		`http://localhost:3000/api/calculators/${id}/calculate?locale=${locale}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale, inputs }),
		},
	)
	const response = await POST(request, { params: { id } })
	const data = await response.json()
	return { response, data }
}

describe('H1 — required outputs must not block valid modes', () => {
	it('equation-solver linear equation returns x=3', async () => {
		const { response, data } = await postCalculate('equation-solver', {
			inputMode: 'equation',
			equationType: 'linear',
			equationText: '2x + 4 = 10',
		})
		expect(response.status).toBe(200)
		expect(Number(data.results.x ?? data.results.solution ?? data.results.result)).toBeCloseTo(
			3,
			5,
		)
	})

	it('fuel-consumption calculate mode returns 8 L/100km', async () => {
		const { response, data } = await postCalculate('fuel-consumption-calculator', {
			mode: 'calculate',
			distance: 100,
			distanceUnit: 'km',
			fuelUsed: 8,
			fuelUnit: 'liters',
		})
		expect(response.status).toBe(200)
		expect(Number(data.results.l100km)).toBeCloseTo(8, 2)
	})

	it('fuel-cost trip mode returns cost 12', async () => {
		const { response, data } = await postCalculate('fuel-cost-calculator', {
			periodType: 'trip',
			distance: 100,
			fuelConsumption: 8,
			consumptionUnit: 'L/100km',
			fuelPricePerUnit: 1.5,
		})
		expect(response.status).toBe(200)
		const cost =
			data.results.tripFuelCost ??
			data.results.fuelCost ??
			data.results.totalCost ??
			data.results.result
		expect(Number(cost)).toBeCloseTo(12, 2)
	})

	it('tire-cost without seasonal tires returns annual cost 120', async () => {
		const { response, data } = await postCalculate('tire-cost-calculator', {
			tirePricePerUnit: 100,
			tiresCount: 4,
			tireLifespanMilesKm: 40000,
			annualMileage: 12000,
			seasonalTiresToggle: false,
		})
		expect(response.status).toBe(200)
		// 400 / 40000 * 12000 = 120
		expect(Number(data.results.annualTireCost ?? data.results.result)).toBeCloseTo(
			120,
			2,
		)
	})

	it('trip-cost without split returns cost 12', async () => {
		const { response, data } = await postCalculate('trip-cost-calculator', {
			tripDistance: 100,
			fuelConsumption: 8,
			fuelPricePerUnit: 1.5,
			splitCost: false,
		})
		expect(response.status).toBe(200)
		expect(
			Number(data.results.totalTripCost ?? data.results.fuelCost ?? data.results.result),
		).toBeCloseTo(12, 2)
	})

	it('retirement future_balance with zero contribution succeeds', async () => {
		const { response, data } = await postCalculate('retirement-calculator', {
			calculationMode: 'future_balance',
			currentAge: 30,
			retirementAge: 65,
			currentSavings: 10000,
			annualReturnRate: 5,
			monthlyContribution: 0,
			inflationRate: 0,
		})
		expect(response.status).toBe(200)
		// 10000 * (1.05)^35 ≈ 57337.18 with annual compounding approximation
		expect(Number(data.results.finalBalance)).toBeGreaterThan(50000)
		expect(Number(data.results.finalBalance)).toBeLessThan(65000)
	})

	it('ROI with returnValue=0 returns HTTP 200 and finite netProfit', async () => {
		const { response, data } = await postCalculate('roi-calculator', {
			investmentCost: 10000,
			returnValue: 0,
			timePeriod: 0,
		})
		expect(response.status).toBe(200)
		expect(data.results.netProfit).toBeCloseTo(-10000, 2)
	})
})

describe('H2 — ROI default timePeriod=0 must not block basic ROI', () => {
	it('engine: 10000→12000 yields 20% with timePeriod 0', () => {
		const result = calculateROI({
			investmentCost: 10000,
			returnValue: 12000,
			timePeriod: 0,
		})
		expect(result.roiPercentage).toBeCloseTo(20, 5)
		expect(result.netProfit).toBeCloseTo(2000, 5)
	})

	it('API RU form with omitted/zero timePeriod returns 20%', async () => {
		const { response, data } = await postCalculate('roi-calculator', {
			investmentCost: 10000,
			returnValue: 12000,
			timePeriod: 0,
			additionalCosts: 0,
			revenueType: 'one-time',
		})
		expect(response.status).toBe(200)
		expect(Number(data.results.roiPercentage ?? data.results.roi)).toBeCloseTo(
			20,
			1,
		)
	})
})

describe('H3 — percent outputs must not be ×100 again', () => {
	it('compound-interest EAR ≈ 5.12% for 5% monthly compound', () => {
		const result = calculateCompoundInterest({
			initialAmount: 1000,
			annualInterestRate: 5,
			investmentPeriod: 2,
			monthlyContribution: 0,
			compoundingFrequency: 'monthly',
		})
		expect(result.finalAmount).toBeCloseTo(1104.94, 1)
		expect(result.effectiveAnnualRate).toBeCloseTo(5.12, 1)
		expect(result.effectiveAnnualRate).toBeLessThan(10)
	})

	it('loan-comparison stores APR as 5 not 500', () => {
		const result = calculateLoanComparison({
			loan1Name: 'A',
			loan1Amount: 10000,
			loan1AnnualInterestRate: 5,
			loan1TermYears: 5,
			loan1Fees: 0,
			loan2Name: 'B',
			loan2Amount: 10000,
			loan2AnnualInterestRate: 6,
			loan2TermYears: 5,
			loan2Fees: 0,
			comparisonMetric: 'totalCost',
		}) as { comparisonTable?: Array<{ annualInterestRate: number; monthlyPayment: number }> }
		const row = result.comparisonTable?.[0]
		expect(row?.annualInterestRate).toBeCloseTo(5, 2)
		expect(row?.monthlyPayment).toBeCloseTo(188.71, 1)
	})

	it('mortgage-comparison stores APR as 5 not 500', () => {
		const result = calculateMortgageComparison({
			scenario1Name: 'A',
			scenario1HomePrice: 300000,
			scenario1DownPayment: 60000,
			scenario1DownPaymentType: 'amount',
			scenario1InterestRateAPR: 5,
			scenario1LoanTermYears: 30,
			scenario2Name: 'B',
			scenario2HomePrice: 300000,
			scenario2DownPayment: 60000,
			scenario2DownPaymentType: 'amount',
			scenario2InterestRateAPR: 6,
			scenario2LoanTermYears: 30,
			comparisonMetric: 'totalCost',
		}) as { comparisonTable?: Array<{ interestRateAPR: number }> }
		expect(result.comparisonTable?.[0]?.interestRateAPR).toBeCloseTo(5, 2)
	})
})

describe('H4 — mortgage property tax default is annual amount', () => {
	it('TS definition defaults propertyTaxType to amount', async () => {
		const calc = await getCalculatorById('mortgage-calculator', 'en')
		const taxType = calc?.inputs.find((i) => i.name === 'propertyTaxType')
		expect(taxType?.defaultValue).toBe('amount')
	})

	it('homePrice=300000, tax=3600/year → total monthly ≈ 1910.46', () => {
		const result = calculateMortgage({
			homePrice: 300000,
			downPayment: 0,
			downPaymentType: 'amount',
			loanTermYears: 30,
			interestRateAPR: 5,
			paymentFrequency: 'monthly',
			propertyTax: 3600,
			propertyTaxType: 'amount',
			homeInsurance: 0,
			HOA: 0,
			extraMonthlyPayment: 0,
		})
		expect(result.totalMonthlyPayment).toBeCloseTo(1910.46, 1)
		expect(result.totalMonthlyPayment).toBeLessThan(5000)
	})
})

describe('H5 — numbers-to-words zero and negative currency', () => {
	it('number=0 returns ноль', () => {
		const result = calculateNumbersToWords({
			number: 0,
			currencyMode: false,
			locale: 'ru',
		})
		expect(String(result.words).toLowerCase()).toContain('ноль')
	})

	it('negative currency keeps minus sign', () => {
		const result = calculateNumbersToWords({
			number: -1.25,
			currencyMode: true,
			locale: 'ru',
		})
		expect(String(result.words).toLowerCase()).toContain('минус')
		expect(String(result.currencyWords).toLowerCase()).toContain('минус')
		expect(result.hundreds).toBe(1)
	})
})

describe('investment/savings ordinary annuity: final equals last year row', () => {
	it('investment: finalValue ≈ 94111.23 and equals last year endingValue', () => {
		const result = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 500,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 5,
			investmentPeriod: 10,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
		})
		expect(result.finalValue).toBeCloseTo(94111.23, 2)
		const breakdown = result.yearlyBreakdown as Array<{ endingValue: number }>
		expect(breakdown[breakdown.length - 1].endingValue).toBe(
			result.finalValue,
		)
	})

	it('savings: finalSavings ≈ 39291.50 and equals last year endingBalance', () => {
		const result = calculateSavings({
			initialSavings: 5000,
			regularContribution: 200,
			contributionFrequency: 'monthly',
			annualInterestRate: 5,
			savingsPeriod: 10,
			compoundingFrequency: 'monthly',
			targetAmount: 0,
			inflationRate: 0,
		})
		expect(result.finalSavings).toBeCloseTo(39291.5, 2)
		const breakdown = result.yearlyBreakdown as Array<{ endingBalance: number }>
		expect(breakdown[breakdown.length - 1].endingBalance).toBe(
			result.finalSavings,
		)
	})
})

describe('H6 — investment/savings withdrawals and tax', () => {
	it('investment: 10000 @10% 2y withdraw 100/mo tax 50%', () => {
		const result = calculateInvestment({
			initialInvestment: 10000,
			periodicContribution: 0,
			contributionFrequency: 'monthly',
			expectedAnnualReturn: 10,
			investmentPeriod: 2,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
			interestType: 'compound',
			monthlyWithdrawal: 100,
			taxRate: 50,
		})
		expect(result.finalValue).toBeCloseTo(9559.22, 1)
		expect(result.totalReturn).toBeCloseTo(1959.22, 1)
		expect(result.afterTaxValue).toBeCloseTo(8579.61, 1)
	})

	it('savings engine matches the same cash-flow invariant', () => {
		const result = calculateSavings({
			initialSavings: 10000,
			regularContribution: 0,
			contributionFrequency: 'monthly',
			annualInterestRate: 10,
			savingsPeriod: 2,
			compoundingFrequency: 'monthly',
			inflationRate: 0,
			interestType: 'compound',
			monthlyWithdrawal: 100,
			taxRate: 50,
			targetAmount: 0,
		})
		expect(result.finalSavings).toBeCloseTo(9559.22, 1)
		expect(result.totalInterestEarned).toBeCloseTo(1959.22, 1)
		expect(result.afterTaxValue).toBeCloseTo(8579.61, 1)
	})
})

describe('H7 — interest-only totalPayment includes principal', () => {
	it('EN loan-payment interest-only totalPayment = 11000', () => {
		const result = calculateLoanPayment({
			loanAmount: 10000,
			annualInterestRate: 10,
			loanTerm: 1,
			paymentFrequency: 'monthly',
			loanType: 'interest-only',
		})
		expect(result.periodicPayment).toBeCloseTo(83.33, 2)
		expect(result.totalInterest).toBe(1000)
		expect(result.totalPayment).toBe(11000)
	})
})

describe('H8 — inflationRate default 2.5 has fractional step', () => {
	it('retirement and investment-vs-savings expose step 0.1', async () => {
		for (const id of ['retirement-calculator', 'investment-vs-savings-calculator']) {
			const calc = await getCalculatorById(id, 'en')
			const inflation = calc?.inputs.find((i) => i.name === 'inflationRate')
			expect(inflation?.defaultValue, id).toBe(2.5)
			expect(inflation?.step, id).toBe(0.1)
		}
	})
})
