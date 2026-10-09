import { test, expect } from '@playwright/test'

const LIMITED = ['es', 'tr', 'hi'] as const
const ROUTES = [
	'/chislo-propisyu',
	'/percentage-of-a-number',
	'/add-subtract-percentage',
	'/learn',
	'/standards',
] as const

function pickCanonical(html: string): string | null {
	return (
		html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] ||
		html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] ||
		null
	)
}

function pickRobots(html: string): string | null {
	return (
		html.match(/name=["']robots["'][^>]*content=["']([^"']+)/i)?.[1] ||
		html.match(/content=["']([^"']+)["'][^>]*name=["']robots["']/i)?.[1] ||
		null
	)
}

test.describe('Final release blockers', () => {
	for (const locale of LIMITED) {
		for (const route of ROUTES) {
			test(`${locale}${route} is noindex with EN canonical`, async ({
				request,
			}) => {
				const res = await request.get(`/${locale}${route}`)
				expect(res.status()).toBe(200)
				const html = await res.text()
				expect(pickRobots(html)).toMatch(/noindex/i)
				const canon = pickCanonical(html) || ''
				expect(canon).toContain(`first-calc.com${route}`)
				expect(canon).not.toContain(`/${locale}/`)
				expect(html).not.toMatch(/hreflang=["']es["']/i)
				expect(html).not.toMatch(/hreflang=["']tr["']/i)
				expect(html).not.toMatch(/hreflang=["']hi["']/i)
			})
		}
	}

	test('EN/RU chislo-propisyu show translated form labels (no raw keys)', async ({
		page,
	}) => {
		for (const path of ['/chislo-propisyu', '/ru/chislo-propisyu']) {
			await page.goto(path)
			await expect(page.locator('body')).toBeVisible()
			const body = await page.locator('body').innerText()
			expect(body).not.toMatch(/legacy\/ui\.form/)
			expect(body).not.toMatch(/errors\.validation\./)
			// Prefer the submit control — FAQ accordion titles also mention "convert"
			await expect(
				page.locator('form button[type="submit"]').first(),
			).toBeVisible()
			const submitText = (
				await page.locator('form button[type="submit"]').first().innerText()
			).trim()
			expect(submitText).toMatch(/^(Convert|Конвертировать|Преобразовать)$/i)
			expect(submitText).not.toMatch(/legacy\/ui/)
		}
	})

	test('chislo-propisyu converts 123 without i18n keys', async ({ page }) => {
		await page.goto('/chislo-propisyu/123')
		await expect(page.locator('body')).toBeVisible()
		const body = await page.locator('body').innerText()
		expect(body).not.toMatch(/legacy\/ui\.form/)
		expect(body).toMatch(/сто|hundred|123/i)
	})

	test('EN about/privacy/terms/disclaimer/contact have self-canonical', async ({
		request,
	}) => {
		for (const path of [
			'/about',
			'/privacy',
			'/terms',
			'/disclaimer',
			'/contact',
		]) {
			const res = await request.get(path)
			expect(res.status()).toBe(200)
			const html = await res.text()
			const canon = pickCanonical(html) || ''
			expect(canon).toContain(`first-calc.com${path === '/' ? '' : path}`)
			expect(pickRobots(html) || '').not.toMatch(/noindex/i)
		}
	})
})
