/**
 * @vitest-environment node
 *
 * P0 follow-up: RU finance (and numbers-to-words) select options must be
 * Russian labels matched by stable option value against the live engine.
 */
import { describe, expect, it } from 'vitest'
import { getCalculatorById } from '@/lib/calculators/loader'
import { calculatorRegistry } from '@/lib/registry/loader'
import { buildSitemapEntries } from '@/app/sitemap'
import { calculatorHubContentLocales } from '@/lib/i18n/content-availability'

const FINANCE_WITH_SELECTS = [
	'mortgage-calculator',
	'personal-loan-calculator',
	'loan-overpayment-calculator',
	'savings-calculator',
	'investment-calculator',
	'roi-calculator',
	'numbers-to-words',
] as const

const CYRILLIC = /[А-Яа-яЁё]/

describe('B3.3 RU select option localization', () => {
	it('overlays Russian option labels for every live select field', async () => {
		for (const slug of FINANCE_WITH_SELECTS) {
			const calc = await getCalculatorById(slug, 'ru')
			expect(calc, slug).toBeTruthy()
			const selects = (calc?.inputs || []).filter(
				(input) => input.type === 'select' && input.options?.length,
			)
			expect(selects.length, `${slug} should expose selects`).toBeGreaterThan(0)
			for (const input of selects) {
				for (const option of input.options || []) {
					expect(
						CYRILLIC.test(option.label),
						`${slug}.${input.name}=${option.value} label="${option.label}"`,
					).toBe(true)
				}
			}
		}
	})

	it('matches mortgage field names to the TypeScript engine (not the orphan JSON schema)', async () => {
		const calc = await getCalculatorById('mortgage-calculator', 'ru')
		const names = (calc?.inputs || []).map((input) => input.name)
		expect(names).toContain('homePrice')
		expect(names).toContain('interestRateAPR')
		expect(names).toContain('loanTermYears')
		expect(names).toContain('downPaymentType')
		expect(names).not.toContain('paymentType')
		// loanAmount is an output on the TS mortgage engine, not an input
		expect(names.filter((name) => name === 'loanAmount')).toHaveLength(0)
	})

	it('registry getAll(ru) uses TS mortgage engine, not orphan JSON schema', async () => {
		const all = await calculatorRegistry.getAll('ru')
		const mortgage = all.find((calc) => calc.slug === 'mortgage-calculator')
		expect(mortgage).toBeDefined()
		expect(mortgage!.inputs.map((input) => input.name)).toContain('homePrice')
		expect(
			mortgage!.inputs.find((input) => input.name === 'loanTermYears')
				?.options?.[0]?.label,
		).toMatch(/лет/)
	})
})

describe('B3.3 sitemap excludes empty-locale calculator hubs', () => {
	it('omits /es|/tr|/hi /calculators hub URLs while keeping en/ru', async () => {
		const previousEnv = process.env.NEXT_PUBLIC_ENV
		const previousBase = process.env.NEXT_PUBLIC_BASE_URL
		process.env.NEXT_PUBLIC_ENV = 'production'
		process.env.NEXT_PUBLIC_BASE_URL = 'https://first-calc.com'

		try {
			const hubLocales = calculatorHubContentLocales()
			expect(hubLocales).toContain('en')
			expect(hubLocales).toContain('ru')
			expect(hubLocales).not.toContain('es')
			expect(hubLocales).not.toContain('tr')
			expect(hubLocales).not.toContain('hi')

			const entries = await buildSitemapEntries()
			const urls = entries.map((entry) => entry.url)

			expect(urls).toContain('https://first-calc.com/calculators')
			expect(urls).toContain('https://first-calc.com/ru/calculators')
			expect(urls).not.toContain('https://first-calc.com/es/calculators')
			expect(urls).not.toContain('https://first-calc.com/tr/calculators')
			expect(urls).not.toContain('https://first-calc.com/hi/calculators')
		} finally {
			if (previousEnv === undefined) delete process.env.NEXT_PUBLIC_ENV
			else process.env.NEXT_PUBLIC_ENV = previousEnv
			if (previousBase === undefined) delete process.env.NEXT_PUBLIC_BASE_URL
			else process.env.NEXT_PUBLIC_BASE_URL = previousBase
		}
	})
})
