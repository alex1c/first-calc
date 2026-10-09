import { describe, expect, it } from 'vitest'
import {
	calculatorHubContentLocales,
	categoryContentLocales,
} from '@/lib/i18n/content-availability'
import { languageAlternates } from '@/lib/site-url'

describe('category and hub hreflang availability', () => {
	it('includes RU for math (restored catalog) but not shell locales', () => {
		const mathLocales = categoryContentLocales('math')
		expect(mathLocales).toContain('en')
		expect(mathLocales).toContain('ru')
		expect(mathLocales).not.toContain('es')
		expect(mathLocales).not.toContain('tr')
		expect(mathLocales).not.toContain('hi')
	})

	it('limits calculator hub alternates to locales with real catalog content', () => {
		const hubLocales = calculatorHubContentLocales()
		expect(hubLocales).toEqual(['en', 'ru'])
		const alternates = languageAlternates('/calculators', hubLocales)
		expect(Object.keys(alternates)).toContain('en')
		expect(Object.keys(alternates)).toContain('ru')
		expect(Object.keys(alternates)).not.toContain('es')
	})

	it('declares geometry category for RU after orphan restore', () => {
		expect(categoryContentLocales('geometry')).toContain('ru')
	})
})
