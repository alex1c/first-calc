import { describe, expect, it } from 'vitest'
import {
	calculatorContentLocales,
	calculatorHubContentLocales,
	categoryContentLocales,
	diagnoseCalculatorContentAvailability,
	filterLocalizedCalculators,
	hasLocalizedCalculatorContent,
} from '@/lib/i18n/content-availability'

describe('calculator content availability', () => {
	it('keeps English as the baseline and exposes real locale content sources', () => {
		expect(calculatorContentLocales('cement-calculator')).toEqual(['en', 'ru'])
		expect(hasLocalizedCalculatorContent('es', 'cement-calculator')).toBe(false)
		expect(
			diagnoseCalculatorContentAvailability('ru', 'cement-calculator').source,
		).toBe('item-file')
	})

	it('recognizes TypeScript RU definitions as localized content', () => {
		expect(hasLocalizedCalculatorContent('ru', 'percentage-of-a-number')).toBe(
			true,
		)
		expect(hasLocalizedCalculatorContent('ru', 'loan-payment')).toBe(true)
	})

	it('exposes category hub locales only where localized calculators exist', () => {
		expect(categoryContentLocales('compatibility')).toContain('ru')
		expect(categoryContentLocales('fun')).toEqual(['en'])
	})

	it('limits main calculators hub to EN and RU catalogs', () => {
		expect(calculatorHubContentLocales()).toEqual(['en', 'ru'])
	})

	it('filters locale hubs without treating English fallback as localized', () => {
		const calculators = [
			{ slug: 'cement-calculator' },
			{ slug: 'nonexistent-slug-xyz' },
		]
		expect(filterLocalizedCalculators(calculators, 'ru')).toEqual([
			{ slug: 'cement-calculator' },
		])
		expect(filterLocalizedCalculators(calculators, 'es')).toEqual([])
	})
})
