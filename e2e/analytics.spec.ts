import { expect, test } from '@playwright/test'

declare global {
	interface Window {
		__ymCalls: unknown[][]
	}
}

test('Metrika initializes once and tracks App Router navigation without a duplicate initial hit', async ({
	page,
}) => {
	await page.route('https://mc.yandex.ru/**', route => route.abort())
	await page.addInitScript(() => {
		window.__ymCalls = []
		window.ym = (...args: unknown[]) => window.__ymCalls.push(args)
	})

	await page.goto('/')
	await expect
		.poll(() =>
			page.evaluate(() => window.__ymCalls.filter(call => call[1] === 'init').length),
		)
		.toBe(1)
	await expect
		.poll(() =>
			page.evaluate(() => window.__ymCalls.filter(call => call[1] === 'hit').length),
		)
		.toBe(1)

	await page.locator('a[href="/calculators"]').first().click()
	await expect(page).toHaveURL(/\/calculators$/)
	await expect
		.poll(() =>
			page.evaluate(() => window.__ymCalls.filter(call => call[1] === 'hit').length),
		)
		.toBe(2)

	const calls = await page.evaluate(() => window.__ymCalls)
	const initCalls = calls.filter(call => call[1] === 'init')
	const hitCalls = calls.filter(call => call[1] === 'hit')
	expect(initCalls).toHaveLength(1)
	expect(hitCalls).toHaveLength(2)
	expect(hitCalls[1][2]).toMatch(/\/calculators$/)
	expect(hitCalls[1][3]).toMatchObject({ referer: hitCalls[0][2] })
})
