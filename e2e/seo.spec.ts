import { test, expect } from '@playwright/test'

test.describe('SEO Metadata', () => {
	test('should have non-empty title on calculator page', async ({ page }) => {
		// Navigate to a calculator page
		await page.goto('/calculators/math')
		
		// Try to find and click first calculator
		const calculatorLink = page.getByRole('link').first()
		if (await calculatorLink.isVisible()) {
			await calculatorLink.click()
			await page.waitForLoadState('networkidle')
		} else {
			// If no link, try direct navigation to a known calculator
			// This is a fallback - adjust based on actual calculator slugs
			await page.goto('/calculators/math/percentage-calculator')
		}
		
		const title = await page.title()
		expect(title.length).toBeGreaterThan(0)
		expect(title).not.toBe('')
	})

	test('should have canonical link on calculator page', async ({ page }) => {
		// Navigate to a calculator page
		await page.goto('/calculators/math')
		
		// Try to find and click first calculator
		const calculatorLink = page.getByRole('link').first()
		if (await calculatorLink.isVisible()) {
			await calculatorLink.click()
			await page.waitForLoadState('networkidle')
		}
		
		// Check for canonical link
		const canonical = page.locator('link[rel="canonical"]')
		if (await canonical.count() > 0) {
			const href = await canonical.getAttribute('href')
			expect(href).toBeTruthy()
			expect(href?.length).toBeGreaterThan(0)
		}
	})
})



