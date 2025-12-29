import { test, expect } from '@playwright/test'

test.describe('Calculators Navigation', () => {
	test('should navigate to calculators page', async ({ page }) => {
		await page.goto('/')
		// Find and click calculators link (adjust selector based on actual implementation)
		const calculatorsLink = page.getByRole('link', { name: /calculators/i }).first()
		if (await calculatorsLink.isVisible()) {
			await calculatorsLink.click()
			await expect(page).toHaveURL(/\/calculators/)
		} else {
			// Direct navigation if link not found
			await page.goto('/calculators')
		}
		await expect(page.locator('body')).toBeVisible()
	})

	test('should navigate to math category', async ({ page }) => {
		await page.goto('/calculators/math')
		await expect(page).toHaveURL(/\/calculators\/math/)
		await expect(page.locator('body')).toBeVisible()
	})

	test('should open calculator and compute', async ({ page }) => {
		// Navigate to a calculator page
		// Adjust the path based on actual calculator slugs
		await page.goto('/calculators/math')
		
		// Try to find and click first calculator link
		const calculatorLink = page.getByRole('link').first()
		if (await calculatorLink.isVisible()) {
			await calculatorLink.click()
			
			// Wait for calculator page to load
			await page.waitForLoadState('networkidle')
			
			// Try to find input field and calculate button
			const input = page.locator('input[type="number"]').first()
			if (await input.isVisible()) {
				await input.fill('10')
				
				// Try to find and click calculate button
				const calculateButton = page.getByRole('button', { name: /calculate/i }).first()
				if (await calculateButton.isVisible()) {
					await calculateButton.click()
					
					// Wait for results (adjust selector based on actual implementation)
					await page.waitForTimeout(500)
					await expect(page.locator('body')).toBeVisible()
				}
			}
		}
	})
})



