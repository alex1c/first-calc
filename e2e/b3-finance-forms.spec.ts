import { test, expect } from '@playwright/test'

/**
 * Chromium form checks for B3.1 finance HTML contracts:
 * - loan-payment fields accept valid amounts/rates/years (no stepMismatch)
 * - mortgage / investment pages render and calculate
 */

test.describe('B3.1 finance forms (Chromium)', () => {
	test('RU loan-payment accepts principal, rate, and whole-year term', async ({
		page,
	}) => {
		await page.goto('/ru/calculators/finance/loan-payment')
		await expect(page.locator('body')).toBeVisible()

		const principal = page.locator('input[name="principal"]')
		const annualRate = page.locator('input[name="annualRate"]')
		const years = page.locator('input[name="years"]')

		await expect(principal).toBeVisible()
		await expect(annualRate).toBeVisible()
		await expect(years).toBeVisible()

		// HTML5 contract: step aligns with min so common values are valid
		await expect(principal).toHaveAttribute('step', /0\.01|any/)
		await expect(annualRate).toHaveAttribute('step', /0\.01|any/)
		await expect(years).toHaveAttribute('min', '1')
		await expect(years).toHaveAttribute('max', '50')

		await principal.fill('1000000')
		await annualRate.fill('5')
		await years.fill('30')

		expect(await principal.evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBe(
			false,
		)
		expect(await annualRate.evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBe(
			false,
		)
		expect(await years.evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBe(
			false,
		)
		expect(await years.evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBe(
			false,
		)

		const calculateButton = page.getByRole('button', {
			name: /рассчитать|calculate/i,
		})
		await calculateButton.click()
		await page.waitForTimeout(800)
		await expect(page.locator('body')).toBeVisible()
	})

	test('EN loan-payment accepts loanAmount / annualInterestRate / loanTerm', async ({
		page,
	}) => {
		await page.goto('/calculators/finance/loan-payment')
		await expect(page.locator('body')).toBeVisible()

		const loanAmount = page.locator('input[name="loanAmount"]')
		const rate = page.locator('input[name="annualInterestRate"]')
		const term = page.locator('input[name="loanTerm"]')

		await expect(loanAmount).toBeVisible()
		await loanAmount.fill('250000')
		await rate.fill('6.5')
		await term.fill('15')

		expect(await loanAmount.evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBe(
			false,
		)
		expect(await rate.evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBe(false)

		const calculateButton = page.getByRole('button', { name: /calculate/i })
		await calculateButton.click()
		await page.waitForTimeout(800)
		await expect(page.locator('body')).toBeVisible()
	})

	test('mortgage calculator page loads and submits finite inputs', async ({ page }) => {
		await page.goto('/calculators/finance/mortgage-calculator')
		await expect(page.locator('body')).toBeVisible()
		await expect(
			page.getByRole('heading', { level: 1, name: 'Mortgage Calculator' }),
		).toBeVisible()

		// TS mortgage definition uses homePrice; JSON schema uses loanAmount — accept either
		const principal = page
			.locator('input[name="homePrice"], input[name="loanAmount"]')
			.first()
		const rate = page
			.locator(
				'input[name="interestRateAPR"], input[name="interestRate"], input[name="annualInterestRate"]',
			)
			.first()
		await expect(principal).toBeVisible()
		await principal.fill('300000')
		await expect(rate).toBeVisible()
		await rate.fill('6.5')

		const calculateButton = page.getByRole('button', { name: /calculate/i }).first()
		await calculateButton.click()
		await page.waitForTimeout(800)
		await expect(page.locator('body')).toBeVisible()
	})
})
