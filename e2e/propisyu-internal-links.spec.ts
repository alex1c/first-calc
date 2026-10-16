import { test, expect, type Page } from '@playwright/test'

/**
 * Codex-reported broken internal targets on historical propisyu money pages.
 * Footer category hubs without RU content must land on working EN routes;
 * Indian number-format related link must use a concrete example number.
 */

const MONEY_PAGE = '/chislo-propisyu/420-00'

/** Destinations that must be reachable from the money page chrome/related links. */
const REQUIRED_HREFS = [
	'/calculators/health',
	'/calculators/everyday',
	'/calculators/compatibility',
	'/ru/number-format/in/1234567',
] as const

async function expectLivePage(page: Page, path: string) {
	const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
	expect(response?.status(), path).toBe(200)
	await expect(page.locator('body')).not.toContainText(
		/This page could not be found|404|Страница не найдена/i,
	)
}

test.describe('propisyu internal navigation fixes', () => {
	test('money page exposes and follows the four fixed destinations', async ({
		page,
		request,
	}) => {
		await page.goto(MONEY_PAGE)
		await expect(page.locator('html')).toHaveAttribute('lang', 'ru')

		// Footer must not point at the broken /ru category hubs.
		await expect(
			page.locator(`footer a[href="/ru/calculators/health"]`),
		).toHaveCount(0)
		await expect(
			page.locator(`footer a[href="/ru/calculators/everyday"]`),
		).toHaveCount(0)
		await expect(
			page.locator(`footer a[href="/ru/calculators/compatibility"]`),
		).toHaveCount(0)

		// EN hubs are the replacements.
		for (const href of [
			'/calculators/health',
			'/calculators/everyday',
			'/calculators/compatibility',
		]) {
			const link = page.locator(`footer a[href="${href}"]`).first()
			await expect(link, href).toBeVisible()
		}

		// Related-links Indian format must use the example number path.
		await expect(
			page.locator('a[href="/ru/number-format/in"]').first(),
		).toHaveCount(0)
		await expect(
			page.locator('a[href="/ru/number-format/in/1234567"]').first(),
		).toBeVisible()

		// HTTP 200 for each replacement (server + no app 404 screen).
		for (const href of REQUIRED_HREFS) {
			const res = await request.get(href)
			expect(res.status(), `request ${href}`).toBe(200)
			await expectLivePage(page, href)
		}
	})

	test('EN footer still uses EN category hubs', async ({ page }) => {
		await page.goto('/chislo-propisyu')
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		for (const href of [
			'/calculators/health',
			'/calculators/everyday',
			'/calculators/compatibility',
			'/calculators/math',
		]) {
			await expect(page.locator(`footer a[href="${href}"]`).first()).toBeVisible()
		}
	})
})
