import { test, expect } from '@playwright/test'

/**
 * Chromium coverage for propisyu final stabilization:
 * precision rejects, money language routing, historical SEO, form parity.
 */

test.describe('propisyu final stabilization', () => {
	test('precision failures return 404 (never silent rewrite)', async ({
		request,
	}) => {
		for (const path of [
			'/ru/chislo-propisyu/0.0000001',
			'/chislo-propisyu/0.99999999999999999999-en',
			'/ru/chislo-propisyu/999999999.00000001',
			'/ru/chislo-propisyu/0.12345678912345678',
		]) {
			const res = await request.get(path)
			expect(res.status(), path).toBe(404)
		}
	})

	test('historical unprefixed money/hub SEO is primary', async ({ request }) => {
		const money = await request.get('/chislo-propisyu/420-00')
		const moneyHtml = await money.text()
		expect(money.status()).toBe(200)
		expect(moneyHtml).toMatch(/name="robots" content="index, follow"/)
		expect(moneyHtml).toMatch(
			/rel="canonical" href="https:\/\/first-calc\.com\/chislo-propisyu\/420-00"/,
		)
		// Next may serialize the attribute as hrefLang; match case-insensitively.
		expect(moneyHtml).toMatch(/hreflang=["']ru["']/i)
		expect(moneyHtml).not.toMatch(/hreflang=["']en["']/i)
		expect(moneyHtml).toMatch(/<html[^>]*lang=["']ru["']/i)
		expect(moneyHtml).toMatch(/руб/)

		const ruMoney = await request.get('/ru/chislo-propisyu/420-00')
		const ruHtml = await ruMoney.text()
		expect(ruHtml).toMatch(/name="robots" content="noindex, follow"/)
		expect(ruHtml).toMatch(
			/rel="canonical" href="https:\/\/first-calc\.com\/chislo-propisyu\/420-00"/,
		)

		const hub = await request.get('/chislo-propisyu/0-9999')
		const hubHtml = await hub.text()
		expect(hubHtml).toMatch(/name="robots" content="index, follow"/)
		expect(hubHtml).toMatch(
			/rel="canonical" href="https:\/\/first-calc\.com\/chislo-propisyu\/0-9999"/,
		)
		expect(hubHtml).toMatch(/База чисел|прописью/)
	})

	test('EN money form goes to USD legacy, not RUB N-KK', async ({ page }) => {
		await page.goto('/chislo-propisyu')
		await page.locator('input[name="language"][value="en"]').check()
		await page.locator('input[name="format"][value="money"]').check()
		await page.locator('#input-value').fill('1.50')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/1\.50-money-usd/)
		await expect(page.locator('body')).toContainText(/dollar/i)
		await expect(page.locator('body')).not.toContainText('1,50 руб')
	})

	test('RU money form still uses historical N-KK', async ({ page }) => {
		await page.goto('/ru/chislo-propisyu')
		await page.locator('input[name="format"][value="money"]').check()
		await page.locator('#input-value').fill('1,50')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/1-50/)
		await expect(page.locator('body')).toContainText('1,50 руб.')
	})

	test('form rejects over-precise numeric input without navigation', async ({
		page,
	}) => {
		await page.goto('/ru/chislo-propisyu')
		await page.locator('#input-value').fill('0.12345678912345678')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/?$/)
		await expect(page.locator('body')).toContainText(/шести|six|точно|exact/i)
	})

	test('EN large money ceiling accepts 1000000000 USD legacy', async ({
		request,
	}) => {
		const res = await request.get('/chislo-propisyu/1000000000-money-usd')
		expect(res.status()).toBe(200)
		const html = await res.text()
		expect(html).toMatch(/one billion/i)
		expect(html.toLowerCase()).not.toContain('internal server error')
	})
})
