import { existsSync } from 'fs'
import path from 'path'
import { locales, type Locale } from '@/lib/i18n'
import type { CalculatorDefinition } from '@/lib/calculators/types'

export function calculatorContentLocales(slug: string): Locale[] {
	return locales.filter(
		(locale) =>
			locale === 'en' ||
			existsSync(
				path.join(
					process.cwd(),
					'locales',
					locale,
					'calculators',
					'items',
					`${slug}.json`,
				),
			),
	)
}

export function hasLocalizedCalculatorContent(locale: Locale, slug: string): boolean {
	return calculatorContentLocales(slug).includes(locale)
}

export function filterLocalizedCalculators<T extends Pick<CalculatorDefinition, 'slug'>>(
	calculators: T[],
	locale: Locale,
): T[] {
	return calculators.filter((calculator) =>
		hasLocalizedCalculatorContent(locale, calculator.slug),
	)
}
