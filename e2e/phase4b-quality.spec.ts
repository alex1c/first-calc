import { expect, test } from '@playwright/test'

const viewports = [
	{ name: 'mobile-320', width: 320, height: 720 },
	{ name: 'mobile-390', width: 390, height: 844 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1440, height: 900 },
]

const representativeRoutes = [
	'/',
	'/calculators',
	'/calculators/math',
	'/calculators/math/square-root',
	'/calculators/construction/cement-calculator',
	'/calculators/finance/mortgage-calculator',
	'/standards/national/ru/sp24-soil-foundations',
	'/numbers-to-words',
]

for (const viewport of viewports) {
	test(`${viewport.name} representative routes do not overflow`, async ({ page }) => {
		await page.setViewportSize(viewport)
		for (const route of representativeRoutes) {
			await page.goto(route)
			await expect(page.locator('main').first()).toBeVisible()
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			)
			expect(overflow, `${route} overflow at ${viewport.width}px`).toBeLessThanOrEqual(1)
		}
	})
}

test('RU decimal-comma pilot works in real calculator forms', async ({ page }) => {
	for (const pilot of [
		{ route: '/ru/calculators/math/square-root', field: 0, value: '12,5', expectsResult: true },
		{ route: '/ru/calculators/construction/cement-calculator', field: 0, value: '12,5', expectsResult: true },
		{ route: '/ru/calculators/finance/mortgage-calculator', field: 1, value: '12,5', expectsResult: false },
	]) {
		await page.goto(pilot.route, { waitUntil: 'domcontentloaded' })
		const input = page.locator('input[inputmode="decimal"]').nth(pilot.field)
		await expect(input).toBeVisible()
		await expect(input).toHaveAttribute('type', 'text')
		await input.fill(pilot.value)
		await expect(input).toHaveValue(pilot.value)
		await page.getByRole('button', { name: /^(Рассчитать|Calculate)$/i }).click()
		if (pilot.expectsResult) {
			await expect(page.locator('[data-calculator-results]')).toBeVisible()
		}
	}
})

test('EN decimal point and invalid/empty pilot input remain editable', async ({ page }) => {
	await page.goto('/calculators/math/square-root')
	const input = page.locator('input[inputmode="decimal"]').first()
	await input.fill('12.5')
	await expect(input).toHaveValue('12.5')
	await input.fill('1,2,3')
	await expect(input).toHaveValue('1,2,3')
	await input.fill('')
	await expect(input).toHaveValue('')
})

test('search dialog contains keyboard focus and restores page state', async ({ page }) => {
	await page.goto('/')
	const opener = page.getByRole('button', { name: /search/i }).first()
	await opener.focus()
	await opener.click()
	const dialog = page.getByRole('dialog')
	const input = dialog.getByRole('textbox')
	await expect(dialog).toBeVisible()
	await expect(input).toBeFocused()
	await expect(page.locator('[inert]')).toHaveCount(1)
	await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

	await page.keyboard.press('Shift+Tab')
	const closeButton = dialog.getByRole('button').last()
	await expect(closeButton).toBeFocused()
	await page.keyboard.press('Tab')
	await expect(input).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(dialog).toBeHidden()
	await expect(opener).toBeFocused()
	await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('limited locale surfaces do not expose pseudo-localized calculators', async ({ page }) => {
	await page.goto('/es/calculators')
	await expect(page.locator('a[href^="/es/calculators/"]').filter({ has: page.locator('h2, h3') })).toHaveCount(0)
	await page.goto('/es')
	await page.getByRole('button', { name: /buscar|search/i }).first().click()
	const input = page.getByRole('dialog').getByRole('textbox')
	await input.fill('mortgage')
	await expect(page.getByText(/content in english/i).first()).toBeVisible()
	await expect(page.getByRole('dialog').locator('a[href^="/es/calculators/"]')).toHaveCount(0)
})
