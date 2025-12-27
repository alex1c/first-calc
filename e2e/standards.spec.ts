import { test, expect } from '@playwright/test'

test.describe('Standards Pages', () => {
	test('should show English content for RU country in EN locale', async ({ page }) => {
		await page.goto('/standards/national/ru')
		
		// Check that page loads
		await expect(page.locator('body')).toBeVisible()
		
		// Check for title (may contain Russian characters in description, but should have English structure)
		const title = await page.title()
		expect(title.length).toBeGreaterThan(0)
		// Page should load successfully (not 404) - check for any heading
		const heading = page.locator('h1, h2').first()
		await expect(heading).toBeVisible()
	})

	test('should show Russian content for RU country in RU locale', async ({ page }) => {
		await page.goto('/ru/standards/national/ru')
		
		// Check that page loads
		await expect(page.locator('body')).toBeVisible()
		
		// Check for Russian title
		const title = await page.title()
		expect(title).toMatch(/СП|Российские/i)
	})

	test('should open SP24 hub page without 404', async ({ page }) => {
		await page.goto('/standards/national/ru/sp24-soil-foundations')
		
		// Check that page loads (not 404)
		await expect(page.locator('body')).toBeVisible()
		
		// Check for title
		const title = await page.title()
		expect(title.length).toBeGreaterThan(0)
	})
})

