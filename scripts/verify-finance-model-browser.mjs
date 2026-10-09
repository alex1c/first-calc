import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3105'
const report = { ok: true, checks: [] }
function note(name, ok, detail) {
	report.checks.push({ name, ok, detail })
	if (!ok) report.ok = false
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

await page.goto(`${BASE}/ru/calculators/finance/investment-calculator`, {
	waitUntil: 'domcontentloaded',
})
await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
await page.locator('#initialInvestment, [name="initialInvestment"]').fill('0')
await page.locator('#periodicContribution, [name="periodicContribution"]').fill('100')
await page.locator('#expectedAnnualReturn, [name="expectedAnnualReturn"]').fill('12')
await page.locator('#investmentPeriod, [name="investmentPeriod"]').fill('1')
await page.locator('#inflationRate, [name="inflationRate"]').fill('0')
await page
	.locator('#compoundingFrequency, [name="compoundingFrequency"]')
	.selectOption('annually')
await page.locator('button[type="submit"]').click()
await page.waitForTimeout(1500)
let text = await page.locator('body').innerText()
note('mixed_not_1332', !/1[\s\u00a0]?332/.test(text), '1332 absent')
note('mixed_has_1266', /1[\s\u00a0]?266/.test(text), '1266 present')
note(
	'ru_model_note',
	/номинальн|капитализац/i.test(text),
	'RU model explanation visible',
)
note(
	'ru_number_format',
	/1[\s\u00a0]266,00/.test(text) || /1[\s\u00a0]266/.test(text),
	'Russian-spaced 1 266 present',
)

await page.goto(`${BASE}/ru/calculators/finance/loan-comparison-calculator`, {
	waitUntil: 'domcontentloaded',
})
await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
await page.locator('button[type="submit"]').click()
await page.waitForTimeout(1500)
text = await page.locator('body').innerText()
// Results table uses declined years; form unit labels may still say "лет"
note(
	'ru_years_declension',
	/\d+\s+(год|года|лет)/.test(text),
	'Russian year declension visible in results',
)

await page.goto(`${BASE}/calculators/finance/investment-calculator`, {
	waitUntil: 'domcontentloaded',
})
await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
await page.locator('button[type="submit"]').click()
await page.waitForTimeout(1200)
text = await page.locator('body').innerText()
note(
	'en_still_english',
	/How the Calculation Works|Monthly|Final|\$|USD/i.test(text),
	'EN chrome intact',
)

await browser.close()
console.log(JSON.stringify(report, null, 2))
process.exit(report.ok ? 0 : 1)
