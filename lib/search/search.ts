import type { Locale } from '@/lib/i18n'
import { getDocumentsForLocale } from './documents'
/**
 * Lightweight in-memory search that scores calculators, articles, and standards.
 *
 * Text is normalized per locale, expanded with synonyms, and ranked with simple
 * weighted heuristics. Designed for server-side usage without external search
 * infrastructure.
 */
import { getSynonyms } from './synonyms'
import { normalizeText, tokenize } from './utils'
import type { SearchResponse, SearchOptions, SearchDocument, SearchGroup, SearchHit } from './types'

function expandTokens(locale: Locale, tokens: string[]): string[] {
	const synonyms = getSynonyms(locale)
	const expanded = new Set<string>()

	for (const token of tokens) {
		expanded.add(token)
		const entries = synonyms[token]
		if (entries) {
			for (const syn of entries) {
				expanded.add(normalizeText(syn))
			}
		}

		// Include inverse lookup
		Object.entries(synonyms).forEach(([key, values]) => {
			if (values.includes(token)) {
				expanded.add(normalizeText(key))
			}
		})
	}

	return Array.from(expanded)
}

function scoreDocument(doc: SearchDocument, normalizedQuery: string, tokens: string[]): number {
	let score = 0

	if (!normalizedQuery) return 0

	const normalized = doc.normalized

	if (normalized.title === normalizedQuery) {
		score += 60
	}

	if (normalized.title.includes(normalizedQuery)) {
		score += 35
	}

	if (normalized.description.includes(normalizedQuery)) {
		score += 15
	}

	for (const token of tokens) {
		if (normalized.title.includes(token)) {
			score += 12
		}

		if (normalized.description.includes(token)) {
			score += 6
		}

		if (normalized.category && normalized.category.includes(token)) {
			score += 5
		}

		if (normalized.body && normalized.body.includes(token)) {
			score += 3
		}

		if (normalized.tags.some((tag) => tag.includes(token))) {
			score += 4
		}

		if (normalized.keywords.some((kw) => kw.includes(token))) {
			score += 2
		}
	}

	return score
}

function mapToHit(doc: SearchDocument): SearchHit {
	return {
		id: doc.id,
		type: doc.type,
		title: doc.title,
		description: doc.description,
		url: doc.url,
		category: doc.categoryLabel || doc.category,
		badge: doc.extra?.badge,
		isForeignLocale: doc.contentLocale !== doc.locale,
	}
}

function buildGroup(
	documents: SearchDocument[],
	type: SearchDocument['type'],
	query: string,
	tokens: string[],
	limit: number,
): SearchGroup {
	const normalizedQuery = normalizeText(query)
	const results = documents
		.filter((doc) => doc.type === type)
		.map((doc) => ({
			doc,
			score: scoreDocument(doc, normalizedQuery, tokens),
		}))
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)

	return {
		total: results.length,
		items: results.slice(0, limit).map((item) => mapToHit(item.doc)),
	}
}

/**
 * Search calculators, articles, and standards for a locale.
 *
 * Falls back to English when no results are found in the requested locale,
 * retaining a flag so the UI can display a "Content in English" badge.
 */
export async function searchPortal(
        query: string,
        locale: Locale,
        options: SearchOptions = {},
): Promise<SearchResponse> {
	const limit = options.limitPerType ?? 20
	const normalizedQuery = normalizeText(query)
	if (!normalizedQuery || normalizedQuery.length < 2) {
		return {
			calculators: { items: [], total: 0 },
			articles: { items: [], total: 0 },
			standards: { items: [], total: 0 },
			fallbackLocaleUsed: false,
			usedLocale: locale,
		}
	}

	const tokens = expandTokens(locale, tokenize(query))
	const documents = await getDocumentsForLocale(locale)

	const calculators = buildGroup(documents, 'calculator', query, tokens, limit)
	const articles = buildGroup(documents, 'article', query, tokens, limit)
	const standards = buildGroup(documents, 'standard', query, tokens, limit)

	const hasResults =
		calculators.total > 0 || articles.total > 0 || standards.total > 0

	if (!hasResults && locale !== 'en') {
		const fallbackLocale: Locale = 'en'
		const fallbackDocs = await getDocumentsForLocale(fallbackLocale)
		const fallbackTokens = expandTokens(fallbackLocale, tokenize(query))

		return {
			calculators: buildGroup(fallbackDocs, 'calculator', query, fallbackTokens, limit),
			articles: buildGroup(fallbackDocs, 'article', query, fallbackTokens, limit),
			standards: buildGroup(fallbackDocs, 'standard', query, fallbackTokens, limit),
			fallbackLocaleUsed: true,
			usedLocale: fallbackLocale,
		}
	}

	return {
		calculators,
		articles,
		standards,
		fallbackLocaleUsed: false,
		usedLocale: locale,
	}
}

