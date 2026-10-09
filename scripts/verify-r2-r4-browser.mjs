/**
 * Chromium checks for R2 (RU finance chrome) and R4 (compounding differs).
 */
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3102'
const report = { ok: true, checks: [] }

function note(name, ok, detail) {
	report.checks.push({ name, ok, detail })
	if (!ok) report.ok = false
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

async function submitFinance(path, fills = {}) {
	await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' })
	await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
	await page.waitForTimeout(400)
	for (const [name, value] of Object.entries(fills)) {
		const el = page.locator(`#${name}, [name="${name}"]`).first()
		if (await el.count()) {
			const tag = await el.evaluate((n) => n.tagName)
			if (tag === 'SELECT') await el.selectOption(String(value))
			else await el.fill(String(value))
		}
	}
	await page.locator('button[type="submit"]').click()
	await page.waitForTimeout(1500)
	return page.locator('body').innerText()
}

// R2 retirement labels
{
	const text = await submitFinance(
		'/ru/calculators/finance/retirement-calculator',
		{
			currentAge: '30',
			retirementAge: '65',
			currentSavings: '10000',
			monthlyContribution: '200',
			annualReturnRate: '5',
			inflationRate: '2.5',
		},
	)
	note(
		'retirement_no_en_inflation_label',
		!/INFLATION-ADJUSTED BALANCE/i.test(text) &&
			!/Monthly Income \(4% withdrawal\)/i.test(text),
		'EN inflation/income labels absent',
	)
	note(
		'retirement_ru_labels_or_rub',
		/С учётом инфляции|Ежемесячный доход|₽|RUB/.test(text),
		'RU labels or RUB present',
	)
	note(
		'retirement_no_dollar_amounts',
		!/\$\d/.test(text),
		'no $digit in body',
	)
}

// R2 mortgage comparison
{
	const text = await submitFinance(
		'/ru/calculators/finance/mortgage-comparison-calculator',
		{},
	)
	note(
		'mortgage_comparison_no_best_mortgage_en',
		!/Best Mortgage by/i.test(text),
		text.includes('Лучшая ипотека')
			? 'RU best mortgage'
			: 'check banner',
	)
}

// R2 loan comparison dollars in explanation
{
	const text = await submitFinance(
		'/ru/calculators/finance/loan-comparison-calculator',
		{},
	)
	note(
		'loan_comparison_no_dollar',
		!/\$\d/.test(text),
		'no $digit',
	)
}

// R2 investment how-calculation English
{
	const text = await submitFinance(
		'/ru/calculators/finance/investment-calculator',
		{
			initialInvestment: '10000',
			periodicContribution: '0',
			expectedAnnualReturn: '12',
			investmentPeriod: '1',
			inflationRate: '0',
		},
	)
	note(
		'investment_no_how_en_body',
		!/How the Calculation Works/i.test(text) ||
			/Как выполняется расчёт/.test(text),
		'EN how-works gated or RU heading',
	)
	note('investment_rub', /₽|RUB/.test(text), 'RUB on investment')
}

// R4 compounding via API is unit-tested; spot-check UI annual path if select exists
{
	await page.goto(
		`${BASE}/ru/calculators/finance/investment-calculator`,
		{ waitUntil: 'domcontentloaded' },
	)
	await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
	const freq = page.locator('#compoundingFrequency, [name="compoundingFrequency"]')
	if (await freq.count()) {
		await page.locator('#initialInvestment, [name="initialInvestment"]').fill('10000')
		await page.locator('#periodicContribution, [name="periodicContribution"]').fill('0')
		await page.locator('#expectedAnnualReturn, [name="expectedAnnualReturn"]').fill('12')
		await page.locator('#investmentPeriod, [name="investmentPeriod"]').fill('1')
		await freq.selectOption('annually')
		await page.locator('button[type="submit"]').click()
		await page.waitForTimeout(1500)
		const text = await page.locator('body').innerText()
		note(
			'investment_annual_11200',
			/11[\s\u00a0]?200/.test(text),
			'11200 visible for annual compound',
		)
	} else {
		note('investment_annual_11200', false, 'compoundingFrequency missing')
	}
}

// EN still works
{
	const text = await submitFinance(
		'/calculators/finance/mortgage-calculator',
		{},
	)
	note(
		'en_mortgage_has_usd_or_monthly',
		/\$|USD|Monthly Payment/i.test(text),
		'EN mortgage still English/USD',
	)
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
process.exit(report.ok ? 0 : 1)
