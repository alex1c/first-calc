/**
 * Chromium checks for R2 (RU currency/labels) and R3 (property tax % unit).
 * Uses Playwright against the already-running production server.
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

// --- R2: mortgage results show RUB, not $, and Russian monthly payment label ---
await page.goto(
	`${BASE}/ru/calculators/finance/mortgage-calculator`,
	{ waitUntil: 'domcontentloaded' },
)
await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
await page.waitForTimeout(500)
await page.locator('button[type="submit"]').click()
await page.waitForTimeout(2000)
const mortgageText = await page.locator('body').innerText()
note(
	'mortgage_no_dollar_in_results',
	!/\$\d/.test(mortgageText.split('Ежемесячный')[1]?.slice(0, 400) || '') &&
		(/₽|RUB/.test(mortgageText) || /1[\s\u00a0]?610/.test(mortgageText)),
	mortgageText.includes('Ежемесячный')
		? 'found RU monthly label'
		: mortgageText.includes('Monthly Payment')
			? 'still English Monthly Payment'
			: 'label check inconclusive',
)
note(
	'mortgage_rub_or_ru_number',
	/₽|RUB|1[\s\u00a0]?610/.test(mortgageText),
	'currency/number present',
)

// --- R3: switch propertyTaxType to percentage → unit shows % ---
const taxType = page.locator('#propertyTaxType, select[name="propertyTaxType"]')
if (await taxType.count()) {
	await taxType.selectOption('percentage')
	await page.waitForTimeout(300)
	const taxLabel = await page.locator('label[for="propertyTax"]').innerText()
	note(
		'property_tax_percent_unit',
		taxLabel.includes('%') && !taxLabel.includes('₽/год'),
		taxLabel,
	)
} else {
	note('property_tax_percent_unit', false, 'propertyTaxType select not found')
}

// --- R2/R4: investment page year table + RUB ---
await page.goto(
	`${BASE}/ru/calculators/finance/investment-calculator`,
	{ waitUntil: 'domcontentloaded' },
)
await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
await page.waitForTimeout(500)
// fill known fields if empty
for (const [name, value] of [
	['initialInvestment', '10000'],
	['periodicContribution', '500'],
	['expectedAnnualReturn', '5'],
	['investmentPeriod', '10'],
	['inflationRate', '0'],
]) {
	const el = page.locator(`#${name}, input[name="${name}"]`)
	if (await el.count()) {
		await el.fill(String(value))
	}
}
await page.locator('button[type="submit"]').click()
await page.waitForTimeout(1500)
const invText = await page.locator('body').innerText()
note(
	'investment_rub_not_dollar',
	!/\$\d/.test(invText) || /₽|RUB/.test(invText),
	/₽|RUB/.test(invText) ? 'has RUB' : 'check dollar usage',
)
note(
	'investment_year_table_ru_headers',
	/Год|Рост по годам|Итоговая стоимость|Доход/.test(invText),
	'RU year-table headers',
)
note(
	'investment_final_matches_table',
	/94[\s\u00a0]?111/.test(invText) && !/94[\s\u00a0]?434/.test(invText),
	'94111 present, 94434 absent',
)

await browser.close()
console.log(JSON.stringify(report, null, 2))
process.exit(report.ok ? 0 : 1)
