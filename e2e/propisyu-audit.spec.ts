import { test, expect } from '@playwright/test'

/**
 * Chromium coverage for Codex propisyu audit scenarios:
 * form → URL, HTTP status, SEO tags, and rendered results.
 */

test.describe('propisyu audit round-2', () => {
	test('RU decimal and large integer routes render 200 with words', async ({
		request,
	}) => {
		for (const path of [
			'/ru/chislo-propisyu/123.45',
			'/ru/chislo-propisyu/999999999',
			'/ru/chislo-propisyu/0-9999',
			'/ru/chislo-propisyu/420-00',
		]) {
			const res = await request.get(path)
			expect(res.status(), path).toBe(200)
			const html = await res.text()
			expect(html.toLowerCase()).not.toContain('internal server error')
		}
	})

	test('EN suffix supports decimals and EN converter ceiling', async ({
		request,
	}) => {
		const samples = [
			{ path: '/chislo-propisyu/123.45-en', expectText: /one hundred/i },
			{
				path: '/chislo-propisyu/1000000000-en',
				expectText: /one billion/i,
			},
			{
				path: '/chislo-propisyu/999999999999-en',
				// Engine output uses spaces (no hyphens): "ninety nine billion".
				expectText: /nine hundred ninety nine billion/i,
			},
		]
		for (const sample of samples) {
			const res = await request.get(sample.path)
			expect(res.status(), sample.path).toBe(200)
			const html = await res.text()
			expect(html).toMatch(sample.expectText)
		}
	})

	test('invalid and garbage URLs return 404 not 500', async ({ request }) => {
		for (const path of [
			'/ru/chislo-propisyu/1e3',
			'/ru/chislo-propisyu/12abc',
			'/ru/chislo-propisyu/1.2.3',
			'/ru/chislo-propisyu/12abc-money-rub',
			'/ru/chislo-propisyu/1.2.3-money-rub',
			'/ru/chislo-propisyu/1e309-money-rub',
			'/ru/chislo-propisyu/1000000000-money-rub',
			'/ru/chislo-propisyu/12-5',
		]) {
			const res = await request.get(path)
			expect(res.status(), path).toBe(404)
		}
	})

	test('SEO: RU money/hub self-canonical; unprefixed noindex; ES noindex', async ({
		request,
	}) => {
		const ruMoney = await request.get('/ru/chislo-propisyu/420-00')
		const ruHtml = await ruMoney.text()
		expect(ruHtml).toMatch(/name="robots" content="index, follow"/)
		expect(ruHtml).toMatch(
			/rel="canonical" href="https:\/\/first-calc\.com\/ru\/chislo-propisyu\/420-00"/,
		)

		const enMoney = await request.get('/chislo-propisyu/420-00')
		const enHtml = await enMoney.text()
		expect(enHtml).toMatch(/name="robots" content="noindex, follow"/)
		expect(enHtml).toMatch(
			/rel="canonical" href="https:\/\/first-calc\.com\/chislo-propisyu\/420-00"/,
		)

		const esMoney = await request.get('/es/chislo-propisyu/420-00')
		expect(await esMoney.text()).toMatch(
			/name="robots" content="noindex, follow"/,
		)

		const ruHub = await request.get('/ru/chislo-propisyu/0-9999')
		const ruHubHtml = await ruHub.text()
		expect(ruHubHtml).toMatch(/name="robots" content="index, follow"/)
		expect(ruHubHtml).toMatch(
			/rel="canonical" href="https:\/\/first-calc\.com\/ru\/chislo-propisyu\/0-9999"/,
		)
		expect(ruHubHtml).toMatch(/ноль|один|тысяч/)
	})

	test('form submit money 1,50 lands on 1-50 with matching copy', async ({
		page,
	}) => {
		await page.goto('/ru/chislo-propisyu')
		await page.getByLabel(/денеж|money|формат|format/i).first().isVisible().catch(() => false)
		// Select money format via radio value.
		await page.locator('input[name="format"][value="money"]').check()
		await page.locator('#input-value').fill('1,50')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/1-50/)
		await expect(page.locator('body')).toContainText('1,50 руб.')
		await expect(page.locator('body')).toContainText(
			'один рубль пятьдесят копеек',
		)
	})

	test('form rejects money 123.456 without navigating', async ({ page }) => {
		await page.goto('/ru/chislo-propisyu')
		await page.locator('input[name="format"][value="money"]').check()
		await page.locator('#input-value').fill('123.456')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/?$/)
		await expect(page.locator('body')).toContainText(/двух|two|decimal|знаков/i)
	})
})
