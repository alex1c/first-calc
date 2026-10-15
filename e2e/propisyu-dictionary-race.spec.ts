import { test, expect, type Page } from '@playwright/test'

/**
 * Chromium regression: delayed RU dictionary loads must not leave Header /
 * Footer / Search on the wrong locale after Back/Forward soft navigation.
 *
 * Delay is injected via window flags (see useClientT maybeDelayDictionaryLoad)
 * so the race does not depend on opaque webpack chunk URL patterns.
 */

const RU_DICT_DELAY_MS = 2500

async function installRuDictionaryDelay(page: Page): Promise<void> {
	await page.addInitScript(
		({ ms }) => {
			;(
				window as Window & {
					__FIRST_CALC_DELAY_I18N_MS?: number
					__FIRST_CALC_DELAY_I18N_LOCALES?: string[]
				}
			).__FIRST_CALC_DELAY_I18N_MS = ms
			;(
				window as Window & {
					__FIRST_CALC_DELAY_I18N_LOCALES?: string[]
				}
			).__FIRST_CALC_DELAY_I18N_LOCALES = ['ru']
		},
		{ ms: RU_DICT_DELAY_MS },
	)
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
		// Back before the delayed RU dictionaries settle (~2500ms).
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
