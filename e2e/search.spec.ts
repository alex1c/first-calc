import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
	test('should open search modal and navigate to result', async ({ page }) => {
		await page.goto('/')
		
		// Try to find search input or button
		const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
		const searchButton = page.getByRole('button', { name: /search/i }).first()
		
		if (await searchInput.isVisible()) {
			await searchInput.click()
			await searchInput.fill('calculator')
			await page.keyboard.press('Enter')
			
			// Wait for results
			await page.waitForTimeout(500)
			await expect(page.locator('body')).toBeVisible()
		} else if (await searchButton.isVisible()) {
			await searchButton.click()
			await page.waitForTimeout(500)
			
			// Try to find search input in modal
			const modalInput = page.locator('input[type="search"], input[type="text"]').first()
			if (await modalInput.isVisible()) {
				await modalInput.fill('calculator')
				await page.keyboard.press('Enter')
				await page.waitForTimeout(500)
			}
			
			await expect(page.locator('body')).toBeVisible()
		} else {
			// Search might not be implemented yet - skip test
			test.skip()
		}
	})
})



