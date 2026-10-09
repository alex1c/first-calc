import { test, expect } from '@playwright/test'

/**
 * Browser regression: RU currency display, fractional rate stepMismatch,
 * and finance modelNote scoping.
 */

test.describe('UI recovery (Chromium)', () => {
	test('RU investment accepts 12.5% and shows ₽ not $', async ({ page }) => {
		await page.goto('/ru/calculators/finance/investment-calculator')
		await page.waitForSelector('button[type="submit"]', { timeout: 20000 })

		const rate = page.locator(
			'#expectedAnnualReturn, [name="expectedAnnualReturn"]',
		)
		await expect(rate).toHaveAttribute('step', /^(0\.01|any)$/)

		await page.locator('#initialInvestment, [name="initialInvestment"]').fill('10000')
		await page
			.locator('#periodicContribution, [name="periodicContribution"]')
			.fill('500')
		await rate.fill('12.5')
		await page.locator('#investmentPeriod, [name="investmentPeriod"]').fill('10')
		await page.locator('#inflationRate, [name="inflationRate"]').fill('0')

		// HTML5 constraint validation must accept fractional rate
		const stepValid = await rate.evaluate(
			(el: HTMLInputElement) => el.validity.stepMismatch === false,
		)
		expect(stepValid).toBe(true)

		await page.locator('button[type="submit"]').click()
		await page.waitForTimeout(1500)

		const body = await page.locator('body').innerText()
		expect(body).toMatch(/₽/)
		expect(body).not.toMatch(/\$\d/)
		expect(body).toMatch(/номинальн|капитализац/i)
	})

	test('RU savings accepts 12.5% and shows ₽', async ({ page }) => {
		await page.goto('/ru/calculators/finance/savings-calculator')
		await page.waitForSelector('button[type="submit"]', { timeout: 20000 })

		const rate = page.locator(
			'#annualInterestRate, [name="annualInterestRate"]',
		)
		await expect(rate).toHaveAttribute('step', /^(0\.01|any)$/)
		await rate.fill('12.5')
		const stepValid = await rate.evaluate(
			(el: HTMLInputElement) => el.validity.stepMismatch === false,
		)
		expect(stepValid).toBe(true)

		await page.locator('button[type="submit"]').click()
		await page.waitForTimeout(1500)
		const body = await page.locator('body').innerText()
		expect(body).toMatch(/₽/)
		expect(body).not.toMatch(/\$\d/)
	})

	test('percentage-of-a-number does not show end-of-month contribution note', async ({
		page,
	}) => {
		await page.goto('/ru/calculators/math/percentage-of-a-number')
		await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
		await page.locator('button[type="submit"]').click()
		await page.waitForTimeout(1000)
		const body = await page.locator('body').innerText()
		expect(body).not.toMatch(/конце месяца|end of (the )?month|месяц.? и начинают/i)
	})

	test('retirement does not show investment end-of-month contribution note', async ({
		page,
	}) => {
		await page.goto('/ru/calculators/finance/retirement-calculator')
		await page.waitForSelector('button[type="submit"]', { timeout: 20000 })
		await page.locator('button[type="submit"]').click()
		await page.waitForTimeout(1500)
		const body = await page.locator('body').innerText()
		// Investment/Savings-specific ordinary-annuity wording must not appear
		expect(body).not.toMatch(
			/Регулярные взносы добавляются в конце месяца|Regular deposits are added at month-end/i,
		)
	})

	test('bare /factors redirects to example page', async ({ request }) => {
		const res = await request.get('/factors', { maxRedirects: 0 })
		expect([301, 308]).toContain(res.status())
		const location = res.headers()['location'] || ''
		expect(location).toMatch(/\/factors\/12\/?$/)
	})
})
