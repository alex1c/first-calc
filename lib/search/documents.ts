/**
 * Build and cache normalized search documents for calculators, articles, and standards.
 *
 * Each document carries raw and normalized text plus locale metadata used by the
 * scoring heuristics. Results are cached per locale to avoid repeated registry calls.
 */
import type { Locale } from '@/lib/i18n'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'
import { getStandardsByLocale } from '@/data/standards'
import type { SearchDocument } from './types'
import { normalizeText, buildLocalizedPath } from './utils'

const documentsCache = new Map<Locale, Promise<SearchDocument[]>>()

function createCalculatorDocs(locale: Locale, calculators: any[]): SearchDocument[] {
	return calculators.map((calculator) => {
		const description =
			calculator.shortDescription || calculator.longDescription || ''
		const faqText = calculator.faq
			? calculator.faq.map((item: any) => item.question).join(' ')
			: ''
		const body = `${calculator.longDescription || ''} ${faqText}`

		return {
			id: `calculator-${calculator.id}-${calculator.locale}`,
			type: 'calculator' as const,
			title: calculator.title,
			description,
			url: buildLocalizedPath(
				locale,
				`/calculators/${calculator.category}/${calculator.slug}`,
			),
			locale,
			contentLocale: calculator.contentLocale || calculator.locale,
			category: calculator.category,
			categoryLabel: calculator.category,
			tags: calculator.tags || [],
			keywords: calculator.meta?.keywords || [],
			body,
			extra: {
				badge: calculator.category,
			},
			normalized: {
				title: normalizeText(calculator.title),
				description: normalizeText(description),
				category: normalizeText(calculator.category || ''),
				body: normalizeText(body),
				tags: (calculator.tags || []).map((tag: string) => normalizeText(tag)),
				keywords: (calculator.meta?.keywords || []).map((kw: string) =>
					normalizeText(kw),
				),
			},
		}
	})
}

function createArticleDocs(locale: Locale, articles: any[]): SearchDocument[] {
	return articles.map((article) => {
		const description = article.shortDescription || ''
		const body = article.contentHtml || ''

		return {
			id: `article-${article.id}-${article.locale}`,
			type: 'article' as const,
			title: article.title,
			description,
			url: buildLocalizedPath(locale, `/learn/${article.slug}`),
			locale,
			contentLocale: article.locale,
			tags: [],
			keywords: article.meta?.keywords || [],
			body,
			extra: {
				badge: 'Learn',
			},
			normalized: {
				title: normalizeText(article.title),
				description: normalizeText(description),
				category: '',
				body: normalizeText(body),
				tags: [],
				keywords: (article.meta?.keywords || []).map((kw: string) =>
					normalizeText(kw),
				),
			},
		}
	})
}

function resolveStandardType(country: string): string {
	if (country === 'EU') return 'Eurocode'
	if (country === 'ISO') return 'ISO'
	return 'National'
}

function createStandardDocs(locale: Locale, standards: any[]): SearchDocument[] {
	return standards.map((standard) => {
		const description = standard.shortDescription || ''
		const body = standard.longDescription || ''
		const type = resolveStandardType(standard.country)

		return {
			id: `standard-${standard.id}-${standard.locale}`,
			type: 'standard' as const,
			title: standard.title,
			description,
			url: buildLocalizedPath(locale, `/standards/${standard.country}/${standard.slug}`),
			locale,
			contentLocale: standard.locale,
			categoryLabel: type,
			tags: [],
			keywords: standard.meta?.keywords || [],
			body,
			extra: {
				badge: type,
				standardType: type,
			},
			normalized: {
				title: normalizeText(standard.title),
				description: normalizeText(description),
				category: normalizeText(type),
				body: normalizeText(body),
				tags: [],
				keywords: (standard.meta?.keywords || []).map((kw: string) =>
					normalizeText(kw),
				),
			},
		}
	})
}

/**
 * Return cached search documents for a locale.
 *
 * Populates the cache on first access by fetching calculators, articles, and
 * standards through their registries and normalizing their text fields.
 */
export async function getDocumentsForLocale(locale: Locale): Promise<SearchDocument[]> {
	if (!documentsCache.has(locale)) {
		documentsCache.set(
			locale,
			(async () => {
				const [calculators, articles, standards] = await Promise.all([
					calculatorRegistry.getAll(locale),
					articleRegistry.getAll(locale),
					getStandardsByLocale(locale),
				])

				return [
					...createCalculatorDocs(locale, calculators),
					...createArticleDocs(locale, articles),
					...createStandardDocs(locale, standards),
				]
			})(),
		)
	}

	return documentsCache.get(locale)!
}


