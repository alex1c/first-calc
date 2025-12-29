import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
	test('should load English home page', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveTitle(/first-calc|calculator/i)
		// Check for main content
		await expect(page.locator('body')).toBeVisible()
	})

	test('should load Russian home page', async ({ page }) => {
		await page.goto('/ru')
		await expect(page).toHaveTitle(/first-calc|калькулятор/i)
		// Check for main content
		await expect(page.locator('body')).toBeVisible()
	})
})



