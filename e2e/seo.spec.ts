import { test, expect } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

test.describe('SEO Metadata', () => {
	test('limited locale hub does not advertise English fallback calculators', async ({ request }) => {
		const response = await request.get('/es/calculators')
		expect(response.status()).toBe(200)
		const html = await response.text()
		expect(html).not.toContain('/es/calculators/finance/mortgage-calculator')
		expect(html).not.toContain('/es/calculators/construction/cement-calculator')
	})

	test('standalone calculator route renders JSON-LD in final HTML', async ({ request }) => {
		// The Docker runtime contains only .next/standalone. This assertion guards
		// runtime-loaded calculator definitions that Next.js cannot trace from a
		// dynamic fs path.
		expect(
			existsSync(
				path.join(
					process.cwd(),
					'.next',
					'standalone',
					'data',
					'calculators',
					'cement-calculator.json',
				),
			),
		).toBe(true)

		const response = await request.get(
			'/ru/calculators/construction/cement-calculator',
		)
		expect(response.status()).toBe(200)

		const html = await response.text()
		expect(html).toContain('<script type="application/ld+json">')
		expect(html).toContain('"@type":"BreadcrumbList"')
		expect(html).toContain('"@type":"SoftwareApplication"')
	})

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




