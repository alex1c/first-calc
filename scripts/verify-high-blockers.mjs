/**
 * Targeted HTTP verification for High blockers R1–R4 against local production.
 */
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3102'

async function post(id, inputs) {
	const res = await fetch(`${BASE}/api/calculators/${id}/calculate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ locale: 'ru', inputs }),
	})
	const body = await res.json().catch(() => ({}))
	return { status: res.status, body }
}

const results = {}

// R1: invalid retirement ages → 4xx, not 200 with nulls
{
	const r = await post('retirement-calculator', {
		calculationMode: 'future_balance',
		currentAge: 65,
		retirementAge: 60,
		currentSavings: 10000,
		monthlyContribution: 0,
		annualReturnRate: 5,
		contributionGrowthRate: 0,
		inflationRate: 2.5,
		compoundFrequency: 'monthly',
	})
	results.r1_invalid_ages = {
		status: r.status,
		ok: r.status >= 400 && r.status < 500,
	}
}

// R1: valid retirement still works
{
	const r = await post('retirement-calculator', {
		calculationMode: 'future_balance',
		currentAge: 30,
		retirementAge: 65,
		currentSavings: 10000,
		monthlyContribution: 200,
		annualReturnRate: 5,
		contributionGrowthRate: 0,
		inflationRate: 2.5,
		compoundFrequency: 'monthly',
	})
	const out = r.body?.results || r.body?.outputs || r.body
	results.r1_valid = {
		status: r.status,
		finalBalance: out?.finalBalance,
		ok: r.status === 200 && typeof out?.finalBalance === 'number',
	}
}

// R3: mortgage percentage tax
{
	const r = await post('mortgage-calculator', {
		homePrice: 300000,
		downPayment: 0,
		downPaymentType: 'amount',
		loanTermYears: 30,
		interestRateAPR: 5,
		paymentFrequency: 'monthly',
		propertyTax: 1,
		propertyTaxType: 'percentage',
		homeInsurance: 0,
		hoaFees: 0,
		extraPayment: 0,
	})
	const out = r.body?.results || r.body?.outputs || r.body
	const taxes = out?.paymentBreakdown?.taxes
	results.r3_percent_tax = {
		status: r.status,
		taxes,
		ok: r.status === 200 && Math.abs(Number(taxes) - 250) < 0.02,
	}
}

// R4: investment final === last year
{
	const r = await post('investment-calculator', {
		initialInvestment: 10000,
		periodicContribution: 500,
		contributionFrequency: 'monthly',
		expectedAnnualReturn: 5,
		investmentPeriod: 10,
		compoundingFrequency: 'monthly',
		inflationRate: 0,
	})
	const out = r.body?.results || r.body?.outputs || r.body
	const breakdown = out?.yearlyBreakdown || []
	const last = breakdown[breakdown.length - 1]?.endingValue
	results.r4_investment = {
		status: r.status,
		finalValue: out?.finalValue,
		lastEnding: last,
		ok:
			r.status === 200 &&
			Math.abs(Number(out?.finalValue) - 94111.23) < 0.02 &&
			Number(out?.finalValue) === Number(last),
	}
}

{
	const r = await post('savings-calculator', {
		initialSavings: 5000,
		regularContribution: 200,
		contributionFrequency: 'monthly',
		annualInterestRate: 5,
		savingsPeriod: 10,
		compoundingFrequency: 'monthly',
		targetAmount: 0,
		inflationRate: 0,
	})
	const out = r.body?.results || r.body?.outputs || r.body
	const breakdown = out?.yearlyBreakdown || []
	const last = breakdown[breakdown.length - 1]?.endingBalance
	results.r4_savings = {
		status: r.status,
		finalSavings: out?.finalSavings,
		lastEnding: last,
		ok:
			r.status === 200 &&
			Math.abs(Number(out?.finalSavings) - 39291.5) < 0.02 &&
			Number(out?.finalSavings) === Number(last),
	}
}

const allOk = Object.values(results).every((r) => r.ok)
console.log(JSON.stringify({ allOk, results }, null, 2))
process.exit(allOk ? 0 : 1)
