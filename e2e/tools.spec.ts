import { test, expect } from '@playwright/test'

test.describe('Tools/Legacy Pages', () => {
	test('should load numbers-to-words landing', async ({ page }) => {
		await page.goto('/tools/numbers-to-words')
		
		// Check that page loads
		await expect(page.locator('body')).toBeVisible()
		
		// Check for title
		const title = await page.title()
		expect(title.length).toBeGreaterThan(0)
	})
})



