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

import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { locales, type Locale } from '@/lib/i18n'
import type { CalculatorDefinition } from '@/lib/calculators/types'
import { getCalculatorsByCategory } from '@/data/calculators'
import { getCategoryIds } from '@/lib/navigation/categories'

/**
 * Calculators that ship full locale-specific definitions in data/calculators.ts
 * without (or in addition to) an items JSON file. Keep this list explicit so the
 * availability gate does not need to parse the large TS module on every call.
 */
/**
 * TS-only calculators restored for RU via item overlays and/or full RU
 * CalculatorDefinition rows. Keep in sync with data/calculators.ts + items.
 */
const TYPESCRIPT_LOCALIZED_SLUGS: Partial<Record<Locale, readonly string[]>> = {
	ru: [
		// Percentage cluster (full RU TS definitions + items)
		'percentage-of-a-number',
		'add-percentage',
		'subtract-percentage',
		'loan-payment',
		// Compatibility cluster (EN TS engine + RU item overlays)
		'love-compatibility',
		'zodiac-compatibility',
		'numerology-compatibility',
		'friendship-compatibility',
		'work-compatibility',
		'birth-date-compatibility',
	],
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

/** Enabled JSON schema slugs grouped by category (sync, for SEO metadata). */
let enabledSchemasByCategory: Map<string, Set<string>> | null = null

function getCategorySlugSet(category: string): Set<string> {
	if (!enabledSchemasByCategory) {
		enabledSchemasByCategory = new Map()
		const dir = path.join(process.cwd(), 'data', 'calculators')
		for (const file of readdirSync(dir)) {
			if (!file.endsWith('.json') || file.includes('.ru.json')) continue
			const schema = JSON.parse(
				readFileSync(path.join(dir, file), 'utf8'),
			) as { slug: string; category: string; isEnabled?: boolean }
			if (schema.isEnabled === false) continue
			if (!enabledSchemasByCategory.has(schema.category)) {
				enabledSchemasByCategory.set(schema.category, new Set())
			}
			enabledSchemasByCategory.get(schema.category)!.add(schema.slug)
		}
	}
	const slugs = new Set(enabledSchemasByCategory.get(category) ?? [])
	for (const calc of getCalculatorsByCategory(category, 'en')) {
		slugs.add(calc.slug)
	}
	for (const locale of locales) {
		if (locale === 'en') continue
		for (const calc of getCalculatorsByCategory(category, locale)) {
			slugs.add(calc.slug)
		}
	}
	return slugs
}

/**
 * Locales that should appear in hreflang for `/calculators/[category]`.
 * Omits locales where the category hub would 404 (no localized calculators).
 */
export function categoryContentLocales(category: string): Locale[] {
	const slugs = getCategorySlugSet(category)
	if (slugs.size === 0) {
		return ['en']
	}
	return locales.filter((locale) => {
		if (locale === 'en') return true
		return [...slugs].some((slug) =>
			hasLocalizedCalculatorContent(locale, slug),
		)
	})
}

/**
 * Locales for the main `/calculators` hub based on real catalog availability.
 */
export function calculatorHubContentLocales(): Locale[] {
	return locales.filter((locale) => {
		if (locale === 'en') return true
		return getCategoryIds().some((category) =>
			categoryContentLocales(category).includes(locale),
		)
	})
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
