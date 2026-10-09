/**
 * @vitest-environment node
 *
 * Stage B2 regression suite: RU forms, calculations, errors, URL identity,
 * and metadata availability — asserts expected values, not mere HTTP 200.
 */
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import { POST } from '@/app/api/calculators/[id]/calculate/route'
import { getCalculatorBySlug } from '@/lib/calculators/loader'
import { calculatorRegistry } from '@/lib/registry/loader'
import {
	calculatorContentLocales,
	categoryContentLocales,
	filterLocalizedCalculators,
	hasLocalizedCalculatorContent,
} from '@/lib/i18n/content-availability'
import { languageAlternates, localeUrl } from '@/lib/site-url'

async function calculate(
	id: string,
	inputs: Record<string, number | string>,
	locale: string = 'ru',
) {
	const request = new Request(
		`http://localhost:3000/api/calculators/${id}/calculate?locale=${locale}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale, inputs }),
		},
	)
	const response = await POST(request, { params: { id } })
	const data = await response.json()
	return { response, data }
}

describe('B2 regression — RU finance forms with expected values', () => {
	it('loan-payment RU annuity matches known payment', async () => {
		const { response, data } = await calculate('loan-payment', {
			principal: 10000,
			annualRate: 8,
			years: 5,
		})
		expect(response.status).toBe(200)
		expect(data.locale).toBe('ru')
		expect(data.results.monthlyPayment).toBeCloseTo(202.76, 1)
	})

	it('mortgage-calculator RU matches canonical amortization sample', async () => {
		// TS-owned mortgage engine: homePrice path (loanAmount JSON schema is orphaned).
		const { response, data } = await calculate('mortgage-calculator', {
			homePrice: 300000,
			downPayment: 0,
			downPaymentType: 'amount',
			loanTermYears: '30',
			interestRateAPR: 4.5,
			paymentFrequency: 'monthly',
		})
		expect(response.status).toBe(200)
		expect(data.results.monthlyMortgagePayment ?? data.results.monthlyPayment).toBeCloseTo(
			1520.06,
			2,
		)
		expect(data.results.loanAmount).toBe(300000)
	})
})

describe('B2 regression — invalid inputs never return fake numbers', () => {
	it('logarithm base 1 is an error, not 200 with argument echo', async () => {
		const { response, data } = await calculate(
			'logarithm',
			{ number: 100, base: 1 },
			'en',
		)
		expect(response.status).not.toBe(200)
		expect(data.results?.result).not.toBe(100)
	})

	it('exponent 0^-1 is an error', async () => {
		const { response, data } = await calculate(
			'exponent',
			{ base: 0, exponent: -1 },
			'en',
		)
		expect(response.status).not.toBe(200)
		expect(typeof data.error).toBe('string')
	})
})

describe('B2 regression — registry URLs and RU availability', () => {
	it('numbers-to-words schema identity matches routing slug', () => {
		const schemaPath = path.join(
			process.cwd(),
			'data',
			'calculators',
			'numbers-to-words.json',
		)
		expect(existsSync(schemaPath)).toBe(true)
		const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
		expect(schema.id).toBe('numbers-to-words')
		expect(schema.slug).toBe('numbers-to-words')
	})

	it('every enabled schema file stem equals slug and id', () => {
		const dir = path.join(process.cwd(), 'data', 'calculators')
		const violations = readdirSync(dir)
			.filter((f) => f.endsWith('.json') && !f.includes('.ru.json'))
			.flatMap((file) => {
				const schema = JSON.parse(readFileSync(path.join(dir, file), 'utf8'))
				const stem = file.replace(/\.json$/, '')
				const issues: string[] = []
				if (schema.slug !== stem) issues.push(`${file} slug`)
				if (schema.id !== stem) issues.push(`${file} id`)
				return issues
			})
		expect(violations).toEqual([])
	})

	it('RU catalog filter only includes available calculators', async () => {
		const all = await calculatorRegistry.getAll('ru')
		const filtered = filterLocalizedCalculators(all, 'ru')
		expect(filtered.length).toBeGreaterThan(50)
		for (const calc of filtered) {
			expect(hasLocalizedCalculatorContent('ru', calc.slug)).toBe(true)
			const resolved = await getCalculatorBySlug(
				calc.category,
				calc.slug,
				'ru',
			)
			expect(resolved, `${calc.category}/${calc.slug}`).toBeDefined()
		}
	})

	it('unique calculator ids across EN registry stay near the Stage B census', async () => {
		const all = await calculatorRegistry.getAll('en')
		const uniqueIds = new Set(all.map((calc) => calc.id))
		expect(uniqueIds.size).toBeGreaterThanOrEqual(90)
		expect(uniqueIds.size).toBeLessThanOrEqual(120)
	})
})

describe('B2 regression — metadata helpers', () => {
	it('category hreflang only includes locales with catalog content', () => {
		const mathLocales = categoryContentLocales('math')
		expect(mathLocales).toContain('en')
		expect(mathLocales).toContain('ru')
		expect(mathLocales).not.toContain('hi')
	})

	it('calculator alternates are reciprocal for available locales only', () => {
		const slug = 'loan-payment'
		const available = calculatorContentLocales(slug)
		expect(available).toEqual(expect.arrayContaining(['en', 'ru']))
		const pathname = `/calculators/finance/${slug}`
		const alternates = languageAlternates(pathname, available)
		expect(alternates.en).toBe(localeUrl('en', pathname))
		expect(alternates.ru).toBe(localeUrl('ru', pathname))
		expect(alternates.es).toBeUndefined()
	})
})
