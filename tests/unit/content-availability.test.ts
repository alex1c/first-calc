import { describe, expect, it } from 'vitest'
import {
	calculatorContentLocales,
	filterLocalizedCalculators,
	hasLocalizedCalculatorContent,
} from '@/lib/i18n/content-availability'

describe('calculator content availability', () => {
	it('keeps English as the baseline and exposes only real locale item files', () => {
		expect(calculatorContentLocales('cement-calculator')).toEqual(['en', 'ru'])
		expect(hasLocalizedCalculatorContent('es', 'cement-calculator')).toBe(false)
	})

	it('filters locale hubs without blocking direct fallback routes', () => {
		const calculators = [
			{ slug: 'cement-calculator' },
			{ slug: 'mortgage-calculator' },
		]
		expect(filterLocalizedCalculators(calculators, 'ru')).toEqual([
			{ slug: 'cement-calculator' },
		])
		expect(filterLocalizedCalculators(calculators, 'es')).toEqual([])
	})
})
