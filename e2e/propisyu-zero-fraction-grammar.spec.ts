import { test, expect } from '@playwright/test'

/**
 * P2: zero fractional digits must use masculine integers (один/два),
 * while non-zero fractions keep feminine whole-part agreement.
 */

const resultWords = 'p.text-3xl.font-semibold.text-blue-600'

test.describe('propisyu zero-fraction grammar', () => {
	test('direct URLs: .00 uses masculine; non-zero keeps feminine', async ({
		page,
	}) => {
		const cases: Array<[string, string]> = [
			['/ru/chislo-propisyu/1', 'один'],
			['/ru/chislo-propisyu/1.00', 'один'],
			['/ru/chislo-propisyu/2', 'два'],
			['/ru/chislo-propisyu/2.00', 'два'],
			['/ru/chislo-propisyu/21', 'двадцать один'],
			['/ru/chislo-propisyu/21.00', 'двадцать один'],
			['/ru/chislo-propisyu/102', 'сто два'],
			['/ru/chislo-propisyu/102.00', 'сто два'],
			['/ru/chislo-propisyu/1.50', 'одна целая пять десятых'],
			['/ru/chislo-propisyu/2.50', 'две целых пять десятых'],
			['/ru/chislo-propisyu/21.05', 'двадцать одна целая пять сотых'],
			['/ru/chislo-propisyu/0.000001', 'ноль целых одна миллионная'],
			['/ru/chislo-propisyu/0.000002', 'ноль целых две миллионных'],
			['/ru/chislo-propisyu/0.000021', 'ноль целых двадцать одна миллионная'],
			['/ru/chislo-propisyu/0.000022', 'ноль целых двадцать две миллионных'],
		]

		for (const [path, expected] of cases) {
			await page.goto(path)
			await expect(page.locator(resultWords), path).toHaveText(expected)
		}
	})

	test('Chromium form: 1.00 and 21.00 submit masculine results', async ({
		page,
	}) => {
		await page.goto('/ru/chislo-propisyu')
		await page.locator('input[name="format"][value="numeric"]').check()
		await page.locator('#input-value').fill('1.00')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/1\.00/)
		await expect(page.locator(resultWords)).toHaveText('один')

		await page.goto('/ru/chislo-propisyu')
		await page.locator('input[name="format"][value="numeric"]').check()
		await page.locator('#input-value').fill('21.00')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/21\.00/)
		await expect(page.locator(resultWords)).toHaveText('двадцать один')

		await page.goto('/ru/chislo-propisyu')
		await page.locator('input[name="format"][value="numeric"]').check()
		await page.locator('#input-value').fill('1.50')
		await page.locator('button[type="submit"]').click()
		await expect(page).toHaveURL(/\/ru\/chislo-propisyu\/1\.50/)
		await expect(page.locator(resultWords)).toHaveText(
			'одна целая пять десятых',
		)
	})
})
