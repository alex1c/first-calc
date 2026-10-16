import { test, expect, type Page } from '@playwright/test'

/**
 * Client-navigation locale matrix: soft nav must update html lang + chrome
 * without a full reload (root layout persistence).
 */

async function expectRuChrome(page: Page) {
	await expect(page.locator('html')).toHaveAttribute('lang', 'ru', {
		timeout: 10_000,
	})
	await expect(page.locator('header')).toContainText(/Калькуляторы/, {
		timeout: 10_000,
	})
	await expect(page.locator('header')).toContainText(/Поиск/)
	await expect(page.locator('footer')).toContainText(/Математика|Финансы/)
	await expect(page.locator('footer')).toContainText(/Бесплатные калькуляторы/)
}

async function expectEnChrome(page: Page) {
	await expect(page.locator('html')).toHaveAttribute('lang', 'en', {
		timeout: 10_000,
	})
	await expect(page.locator('header')).toContainText(/Calculators/, {
		timeout: 10_000,
	})
	await expect(page.locator('header')).toContainText(/Search/)
	await expect(page.locator('footer')).toContainText(/Math|Finance/)
	await expect(page.locator('footer')).toContainText(/Free calculators/)
}

test.describe('propisyu client-navigation locale', () => {
	test('EN landing → historical RU hub updates chrome without reload', async ({
		page,
	}) => {
		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.locator('a[href="/chislo-propisyu/0-9999"]').first().click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		await expect(page.locator('body')).toContainText(/База чисел|прописью/)
		await expectRuChrome(page)
	})

	test('EN landing → historical RU money updates chrome', async ({ page }) => {
		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.locator('a[href="/chislo-propisyu/420-00"]').first().click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/420-00/)
		await expect(page.locator('body')).toContainText(/руб/)
		await expectRuChrome(page)
		await expect(page.locator('form')).toContainText(/Конвертировать/)
	})

	test('RU hub soft-nav away then to EN calculator restores English chrome', async ({
		page,
	}) => {
		await page.goto('/chislo-propisyu/0-9999')
		await expectRuChrome(page)

		// Soft-nav back to unprefixed EN landing via logo/home when possible,
		// then to an EN calculator (full URL change within App Router).
		await page.locator('header a[aria-label="First Calc - Home"]').click()
		await expect(page).toHaveURL(/\/ru\/?$|\/$/)
		await page.goto('/calculators/health/bmi-calculator')
		await expectEnChrome(page)
	})

	test('EN calculator → RU hub (soft via chislo landing) updates chrome', async ({
		page,
	}) => {
		await page.goto('/calculators/health/bmi-calculator')
		await expectEnChrome(page)

		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)
		await page.locator('a[href="/chislo-propisyu/0-9999"]').first().click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		await expectRuChrome(page)
	})

	test('Back/Forward restores chrome locale', async ({ page }) => {
		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.locator('a[href="/chislo-propisyu/0-9999"]').first().click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		await expectRuChrome(page)

		await page.goBack()
		await expect(page).toHaveURL(/\/chislo-propisyu\/?$/)
		await expectEnChrome(page)

		await page.goForward()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		await expectRuChrome(page)
	})

	test('direct reload of destinations keeps matching chrome', async ({
		page,
	}) => {
		const cases: Array<[string, typeof expectEnChrome]> = [
			['/chislo-propisyu', expectEnChrome],
			['/chislo-propisyu/0-9999', expectRuChrome],
			['/chislo-propisyu/420-00', expectRuChrome],
			['/calculators/health/bmi-calculator', expectEnChrome],
			['/ru/chislo-propisyu/0-9999', expectRuChrome],
		]
		for (const [path, expectFn] of cases) {
			await page.goto(path)
			await page.reload()
			await expectFn(page)
		}
	})
})
