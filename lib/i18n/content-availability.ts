import { existsSync } from 'fs'
import path from 'path'
import { locales, type Locale } from '@/lib/i18n'

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
