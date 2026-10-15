import { test, expect, type Page, type Route } from '@playwright/test'

/**
 * Chromium regression: delayed RU dictionary chunk responses must not leave
 * Header / Footer / Search on the wrong locale after Back/Forward soft nav.
 *
 * Delay is applied via real network interception: fetch the chunk, detect RU
 * chrome dictionary payloads, wait, then fulfill. No production window hooks.
 */

const RU_DICT_DELAY_MS = 2500

/**
 * RU chrome dictionary markers (navigation / footer / search JSON modules).
 * Keep narrow so unrelated RU page content is not delayed unnecessarily.
 */
function isRuChromeDictionaryBody(body: string): boolean {
	return (
		body.includes('"calculators":"Калькуляторы"') ||
		body.includes('"open":"Поиск"') ||
		(body.includes('"sharePage"') && body.includes('Бесплатные')) ||
		(body.includes('"tagline"') &&
			body.includes('Бесплатные калькуляторы')) ||
		body.includes('Бесплатные калькуляторы')
	)
}

async function installRuDictionaryDelay(page: Page): Promise<void> {
	await page.route('**/_next/static/chunks/**', async (route: Route) => {
		const request = route.request()
		// Only delay script/chunk GETs (dictionary modules are JS wrappers).
		if (request.method() !== 'GET') {
			await route.continue()
			return
		}

		const response = await route.fetch()
		const body = await response.text()
		if (isRuChromeDictionaryBody(body)) {
			await new Promise((r) => setTimeout(r, RU_DICT_DELAY_MS))
		}
		await route.fulfill({
			response,
			body,
			headers: {
				...response.headers(),
			},
		})
	})
}

async function expectRuChrome(page: Page) {
	await expect(page.locator('html')).toHaveAttribute('lang', 'ru', {
		timeout: 15_000,
	})
	await expect(page.locator('header')).toContainText(/Калькуляторы/, {
		timeout: 15_000,
	})
	await expect(page.locator('header')).toContainText(/Поиск/)
	await expect(page.locator('footer')).toContainText(/Математика|Финансы/)
	await expect(page.locator('footer')).toContainText(/Бесплатные калькуляторы/)
}

async function expectEnChrome(page: Page) {
	await expect(page.locator('html')).toHaveAttribute('lang', 'en', {
		timeout: 15_000,
	})
	await expect(page.locator('header')).toContainText(/Calculators/, {
		timeout: 15_000,
	})
	await expect(page.locator('header')).toContainText(/Search/)
	await expect(page.locator('footer')).toContainText(/Math|Finance/)
	await expect(page.locator('footer')).toContainText(/Free calculators/)
	// Must not leave RU chrome after settling.
	await expect(page.locator('header')).not.toContainText(/Калькуляторы/)
	await expect(page.locator('header')).not.toContainText(/Поиск/)
}

/**
 * Poll header text while RU loads are still in flight; fail if RU labels
 * appear while URL/lang are already EN (mixed-language intermediate).
 */
async function assertNoRuChromeWhileEn(
	page: Page,
	durationMs: number,
): Promise<void> {
	const deadline = Date.now() + durationMs
	while (Date.now() < deadline) {
		const lang = await page.locator('html').getAttribute('lang')
		const headerText = (await page.locator('header').innerText()) || ''
		const url = page.url()
		if (lang === 'en' && /\/chislo-propisyu\/?$/.test(new URL(url).pathname)) {
			expect(headerText).not.toMatch(/Калькуляторы/)
			expect(headerText).not.toMatch(/Поиск/)
		}
		await page.waitForTimeout(100)
	}
}

test.describe('propisyu delayed dictionary race', () => {
	test('EN → RU → Back EN before RU dictionaries finish', async ({ page }) => {
		await installRuDictionaryDelay(page)

		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.locator('a[href="/chislo-propisyu/0-9999"]').first().click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		// Back before the delayed RU dictionary chunks settle (~2500ms).
		await page.waitForTimeout(200)
		await page.goBack()
		await expect(page).toHaveURL(/\/chislo-propisyu\/?$/)

		// Wait longer than the artificial delay so late completions arrive.
		await assertNoRuChromeWhileEn(page, RU_DICT_DELAY_MS + 800)
		await expectEnChrome(page)
	})

	test('RU → EN → Forward RU with delayed dictionaries', async ({ page }) => {
		await installRuDictionaryDelay(page)

		await page.goto('/chislo-propisyu/0-9999')
		// Allow delayed RU dicts to land once for the initial load.
		await expectRuChrome(page)

		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.goBack()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		await expectRuChrome(page)

		await page.goForward()
		await expect(page).toHaveURL(/\/chislo-propisyu\/?$/)
		await expectEnChrome(page)
	})

	test('repeated fast Back/Forward under delayed RU dictionaries', async ({
		page,
	}) => {
		await installRuDictionaryDelay(page)

		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.locator('a[href="/chislo-propisyu/0-9999"]').first().click()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)

		for (let i = 0; i < 4; i++) {
			await page.goBack()
			await page.waitForTimeout(50)
			await page.goForward()
			await page.waitForTimeout(50)
		}

		await page.goBack()
		await expect(page).toHaveURL(/\/chislo-propisyu\/?$/)
		await page.waitForTimeout(RU_DICT_DELAY_MS + 800)
		await expectEnChrome(page)

		await page.goForward()
		await expect(page).toHaveURL(/\/chislo-propisyu\/0-9999/)
		await expectRuChrome(page)
	})

	test('navigation after all dictionaries have loaded', async ({ page }) => {
		await installRuDictionaryDelay(page)

		await page.goto('/chislo-propisyu')
		await expectEnChrome(page)

		await page.locator('a[href="/chislo-propisyu/0-9999"]').first().click()
		await expectRuChrome(page)

		await page.goBack()
		await expectEnChrome(page)

		await page.goForward()
		await expectRuChrome(page)
	})

	test('direct reload keeps matching chrome under delay', async ({ page }) => {
		await installRuDictionaryDelay(page)

		await page.goto('/chislo-propisyu')
		await page.reload()
		await expectEnChrome(page)

		await page.goto('/chislo-propisyu/0-9999')
		await page.reload()
		await expectRuChrome(page)
	})
})
