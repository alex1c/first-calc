import { describe, expect, it } from 'vitest'
import { resolveUiLocaleFromPathname } from '@/lib/i18n/resolve-ui-locale'

describe('resolveUiLocaleFromPathname', () => {
	it('uses locale prefixes', () => {
		expect(resolveUiLocaleFromPathname('/ru/calculators')).toBe('ru')
		expect(resolveUiLocaleFromPathname('/es/about')).toBe('es')
		expect(resolveUiLocaleFromPathname('/tr/tools')).toBe('tr')
		expect(resolveUiLocaleFromPathname('/hi/learn')).toBe('hi')
	})

	it('forces Russian UI for unprefixed historical money/hubs', () => {
		expect(resolveUiLocaleFromPathname('/chislo-propisyu/420-00')).toBe('ru')
		expect(resolveUiLocaleFromPathname('/chislo-propisyu/0-9999')).toBe('ru')
		expect(resolveUiLocaleFromPathname('/chislo-propisyu/7500-00')).toBe('ru')
	})

	it('keeps English for ordinary unprefixed pages', () => {
		expect(resolveUiLocaleFromPathname('/chislo-propisyu')).toBe('en')
		expect(resolveUiLocaleFromPathname('/chislo-propisyu/123')).toBe('en')
		expect(resolveUiLocaleFromPathname('/calculators/health/bmi-calculator')).toBe(
			'en',
		)
		expect(resolveUiLocaleFromPathname('/')).toBe('en')
	})
})
