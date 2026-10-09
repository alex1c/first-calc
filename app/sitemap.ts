import type { MetadataRoute } from 'next'
import { articles } from '@/data/articles'
import { standards } from '@/data/standards'
import { calculatorRegistry } from '@/lib/registry/loader'
import { legacyTools } from '@/lib/tools/registry'
import { locales, type Locale } from '@/lib/i18n'
import { isIndexingDisabled, localeUrl } from '@/lib/site-url'
import {
	calculatorHubContentLocales,
	hasLocalizedCalculatorContent,
	indexableShellLocales,
} from '@/lib/i18n/content-availability'

export type SitemapGroup =
	| 'pages'
	| 'categories'
	| 'calculators'
	| 'articles'
	| 'standards'
	| 'other'

export interface ClassifiedSitemapEntry {
	url: string
	group: SitemapGroup
	locale: Locale
}

const publicPages = [
	'/',
	'/calculators',
	'/tools',
] as const

const englishInformationalPages = [
	'/learn',
	'/standards',
	'/standards/national',
	'/about',
	'/contact',
	'/privacy',
	'/terms',
	'/disclaimer',
] as const

const englishNationalStandardPages = [
	'/standards/national/us',
	'/standards/national/us/aci-concrete',
	'/standards/national/us/asce-loads',
	'/standards/national/us/asce7-hazard-categories',
	'/standards/national/us/ibc-load-path-essentials',
	'/standards/national/us/soil-foundations',
	'/standards/national/eu',
	'/standards/national/eu/ec1-load-concepts',
	'/standards/national/eu/ec2-concrete-principles',
	'/standards/national/eu/ec7-soil-foundations',
	'/standards/national/de/din-construction',
	'/standards/national/ru',
	'/standards/national/ru/sp20-load-concepts',
	'/standards/national/ru/sp24-soil-foundations',
	'/standards/national/ru/sp63-concrete-principles',
	'/standards/national/ru/sp-snip-foundations',
] as const

function addEntry(
	entries: ClassifiedSitemapEntry[],
	seen: Set<string>,
	locale: Locale,
	pathname: string,
	group: SitemapGroup,
) {
	const url = localeUrl(locale, pathname)
	if (!seen.has(url)) {
		seen.add(url)
		entries.push({ url, group, locale })
	}
}

export async function buildSitemapEntries(): Promise<ClassifiedSitemapEntry[]> {
	if (isIndexingDisabled()) return []

	const entries: ClassifiedSitemapEntry[] = []
	const seen = new Set<string>()

	// Hub locales that actually have localized calculator catalog content.
	// Empty shells (/es/calculators, /tr/calculators, /hi/calculators) are
	// noindex and must not appear in the sitemap.
	const calculatorHubLocales = new Set(calculatorHubContentLocales())
	// Home/tools shells are indexable only when home.json + catalog exist
	// (currently en/ru). Incomplete locales stay reachable but out of sitemap.
	const shellLocales = new Set(indexableShellLocales())

	for (const locale of locales) {
		for (const pathname of publicPages) {
			if (pathname === '/calculators' && !calculatorHubLocales.has(locale)) {
				continue
			}
			if (
				(pathname === '/' || pathname === '/tools') &&
				!shellLocales.has(locale)
			) {
				continue
			}
			addEntry(entries, seen, locale, pathname, 'pages')
		}
		if (locale === 'en') {
			for (const pathname of englishInformationalPages) {
				addEntry(entries, seen, locale, pathname, 'pages')
			}
			for (const pathname of englishNationalStandardPages) {
				addEntry(entries, seen, locale, pathname, 'standards')
			}
		}
		if (locale === 'ru') {
			for (const pathname of englishNationalStandardPages.filter((item) =>
				item.startsWith('/standards/national/ru'),
			)) {
				addEntry(entries, seen, locale, pathname, 'standards')
			}
		}

		const calculators = (await calculatorRegistry.getAll(locale)).filter(
			(calculator) =>
				calculator.isEnabled !== false && hasLocalizedCalculatorContent(locale, calculator.slug),
		)
		const categories = new Set(calculators.map((calculator) => calculator.category))
		for (const category of categories) {
			addEntry(entries, seen, locale, `/calculators/${category}`, 'categories')
		}
		for (const calculator of calculators) {
			addEntry(
				entries,
				seen,
				locale,
				`/calculators/${calculator.category}/${calculator.slug}`,
				'calculators',
			)
		}

		for (const article of articles.filter((item) => item.locale === locale)) {
			addEntry(entries, seen, locale, `/learn/${article.slug}`, 'articles')
		}
		for (const standard of standards.filter((item) => item.locale === locale)) {
			addEntry(
				entries,
				seen,
				locale,
				`/standards/${standard.country}/${standard.slug}`,
				'standards',
			)
		}
	}

	// Legacy landings have substantial locale-specific content only in English/Russian.
	// Skip slug-less historical example paths (/range/1-100, /factors/360,
	// /number-format/in/...) — those dynamic routes are noindex-only and must
	// not appear in the sitemap.
	for (const locale of ['en', 'ru'] as const) {
		for (const tool of legacyTools) {
			if (!tool.slug) continue
			addEntry(entries, seen, locale, tool.path, 'other')
		}
	}

	return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return (await buildSitemapEntries()).map(({ url }) => ({ url }))
}
