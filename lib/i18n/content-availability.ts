/**
 * Single source of truth for whether a calculator has real localized content.
 *
 * Indexable/catalog visibility requires locale-native content — never English
 * fallback masquerading as a finished localization.
 *
 * Recognized RU/other-locale sources:
 * 1. locales/<locale>/calculators/items/<slug>.json (primary)
 * 2. Hardcoded TypeScript definitions in data/calculators.ts for that locale
 *    (secondary allowlist kept in sync with known TS locale rows)
 */

import { existsSync } from 'fs'
import path from 'path'
import { locales, type Locale } from '@/lib/i18n'
import type { CalculatorDefinition } from '@/lib/calculators/types'

/**
 * Calculators that ship full locale-specific definitions in data/calculators.ts
 * without (or in addition to) an items JSON file. Keep this list explicit so the
 * availability gate does not need to parse the large TS module on every call.
 */
const TYPESCRIPT_LOCALIZED_SLUGS: Partial<Record<Locale, readonly string[]>> = {
	ru: ['percentage-of-a-number', 'loan-payment'],
}

function hasItemFile(locale: Locale, slug: string): boolean {
	return existsSync(
		path.join(
			process.cwd(),
			'locales',
			locale,
			'calculators',
			'items',
			`${slug}.json`,
		),
	)
}

function hasTypescriptLocaleDefinition(locale: Locale, slug: string): boolean {
	const slugs = TYPESCRIPT_LOCALIZED_SLUGS[locale]
	return Boolean(slugs?.includes(slug))
}

/**
 * Locales that have real calculator content for the given slug.
 * English is always included as the baseline catalog language.
 */
export function calculatorContentLocales(slug: string): Locale[] {
	return locales.filter(
		(locale) =>
			locale === 'en' ||
			hasItemFile(locale, slug) ||
			hasTypescriptLocaleDefinition(locale, slug),
	)
}

/**
 * True when the locale has native calculator content (item file and/or TS def).
 * English always returns true for enabled catalog purposes.
 */
export function hasLocalizedCalculatorContent(
	locale: Locale,
	slug: string,
): boolean {
	return calculatorContentLocales(slug).includes(locale)
}

/**
 * Filter catalog/search/related lists to calculators with real locale content.
 * Does not block direct route rendering (pages may still EN-fallback + noindex).
 */
export function filterLocalizedCalculators<
	T extends Pick<CalculatorDefinition, 'slug'>,
>(calculators: T[], locale: Locale): T[] {
	return calculators.filter((calculator) =>
		hasLocalizedCalculatorContent(locale, calculator.slug),
	)
}

export interface ContentAvailabilityDiagnostic {
	slug: string
	locale: Locale
	hasItemFile: boolean
	hasTypescriptDefinition: boolean
	isAvailable: boolean
	source: 'en-baseline' | 'item-file' | 'typescript' | 'none'
}

/**
 * Explain why a slug is (or is not) considered localized for a locale.
 */
export function diagnoseCalculatorContentAvailability(
	locale: Locale,
	slug: string,
): ContentAvailabilityDiagnostic {
	const item = hasItemFile(locale, slug)
	const typescript = hasTypescriptLocaleDefinition(locale, slug)
	let source: ContentAvailabilityDiagnostic['source'] = 'none'
	if (locale === 'en') source = 'en-baseline'
	else if (item) source = 'item-file'
	else if (typescript) source = 'typescript'

	return {
		slug,
		locale,
		hasItemFile: item,
		hasTypescriptDefinition: typescript,
		isAvailable: hasLocalizedCalculatorContent(locale, slug),
		source,
	}
}
