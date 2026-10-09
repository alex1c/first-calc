import { test, expect } from '@playwright/test'

/**
 * B3.3 Chromium checks: RU calculator UI + historical chislo-propisyu landing.
 */

test.describe('B3.3 RU UI (Chromium)', () => {
	test('RU compound-interest shows Cyrillic H1 and localized How to heading', async ({
		page,
	}) => {
		await page.goto('/ru/calculators/finance/compound-interest')
		await expect(page.locator('body')).toBeVisible()

		const h1 = page.locator('h1').first()
		await expect(h1).toBeVisible()
		await expect(h1).toContainText(/[А-Яа-яЁё]/)

		// Wait for client i18n: HowTo heading should resolve to RU common.label.howTo.
		const howToHeading = page.getByRole('heading', { name: /как вычислить/i })
		await expect(howToHeading.first()).toBeVisible({ timeout: 10000 })
		await expect(
			page.getByRole('heading', { name: /^how to calculate$/i }),
		).toHaveCount(0)
	})

	test('RU numbers-to-words calculator shows Russian UI', async ({ page }) => {
		await page.goto('/ru/calculators/everyday/numbers-to-words')
		await expect(page.locator('body')).toBeVisible()

		const h1 = page.locator('h1').first()
		await expect(h1).toBeVisible()
		await expect(h1).toContainText(/[А-Яа-яЁё]/)

		// Form should render with a calculate action (RU or shared).
		const calculateButton = page.getByRole('button', {
			name: /рассчитать|вычислить|calculate/i,
		})
		await expect(calculateButton.first()).toBeVisible()
	})

	test('chislo-propisyu landing loads', async ({ page }) => {
		await page.goto('/chislo-propisyu')
		await expect(page.locator('body')).toBeVisible()
		await expect(page.locator('h1').first()).toBeVisible()
		// Historical RU tool: expect Cyrillic branding or form on the landing.
		await expect(page.locator('body')).toContainText(/пропись|числ|number/i)
	})
})
