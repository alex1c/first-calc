/**
 * Internal portal search functionality
 * Searches across calculators, standards, and articles
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import type { StandardDefinition } from '@/lib/standards/types'
import type { ArticleDefinition } from '@/lib/learn/types'
import { calculatorRegistry } from '@/lib/registry/loader'
import { getStandardsByLocale } from '@/data/standards'
import { articles } from '@/data/articles'

export interface SearchResults {
	calculators: CalculatorDefinition[]
	standards: StandardDefinition[]
	articles: ArticleDefinition[]
}

/**
 * Normalize search query (lowercase, trim)
 */
function normalizeQuery(query: string): string {
	return query.toLowerCase().trim()
}

/**
 * Check if text matches query
 */
function matchesQuery(text: string, query: string): boolean {
	const normalizedText = normalizeQuery(text)
	const normalizedQuery = normalizeQuery(query)
	
	// Exact match
	if (normalizedText.includes(normalizedQuery)) {
		return true
	}
	
	// Word-by-word match
	const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0)
	return queryWords.every((word) => normalizedText.includes(word))
}

/**
 * Calculate relevance score for a calculator
 */
function calculateCalculatorScore(
	calculator: CalculatorDefinition,
	query: string,
): number {
	let score = 0
	const normalizedQuery = normalizeQuery(query)
	
	// Title match (highest weight)
	if (normalizeQuery(calculator.title).includes(normalizedQuery)) {
		score += 10
	}
	
	// Exact title match
	if (normalizeQuery(calculator.title) === normalizedQuery) {
		score += 5
	}
	
	// Description match
	if (matchesQuery(calculator.shortDescription, query)) {
		score += 5
	}
	
	if (matchesQuery(calculator.longDescription || '', query)) {
		score += 3
	}
	
	// Category match
	if (normalizeQuery(calculator.category).includes(normalizedQuery)) {
		score += 2
	}
	
	// Keywords match
	if (calculator.meta?.keywords) {
		const keywordMatches = calculator.meta.keywords.filter((keyword) =>
			normalizeQuery(keyword).includes(normalizedQuery),
		).length
		score += keywordMatches
	}
	
	return score
}

/**
 * Calculate relevance score for a standard
 */
function calculateStandardScore(
	standard: StandardDefinition,
	query: string,
): number {
	let score = 0
	const normalizedQuery = normalizeQuery(query)
	
	// Title match
	if (normalizeQuery(standard.title).includes(normalizedQuery)) {
		score += 10
	}
	
	// Description match
	if (matchesQuery(standard.shortDescription, query)) {
		score += 5
	}
	
	if (matchesQuery(standard.longDescription || '', query)) {
		score += 3
	}
	
	// Keywords match
	if (standard.meta?.keywords) {
		const keywordMatches = standard.meta.keywords.filter((keyword) =>
			normalizeQuery(keyword).includes(normalizedQuery),
		).length
		score += keywordMatches
	}
	
	return score
}

/**
 * Calculate relevance score for an article
 */
function calculateArticleScore(
	article: ArticleDefinition,
	query: string,
): number {
	let score = 0
	const normalizedQuery = normalizeQuery(query)
	
	// Title match
	if (normalizeQuery(article.title).includes(normalizedQuery)) {
		score += 10
	}
	
	// Description match
	if (matchesQuery(article.shortDescription || '', query)) {
		score += 5
	}
	
	// Content match (simple check)
	if (article.contentHtml && matchesQuery(article.contentHtml, query)) {
		score += 3
	}
	
	// Keywords match
	if (article.meta?.keywords) {
		const keywordMatches = article.meta.keywords.filter((keyword) =>
			normalizeQuery(keyword).includes(normalizedQuery),
		).length
		score += keywordMatches
	}
	
	return score
}

/**
 * Search portal across calculators, standards, and articles
 */
export async function searchPortal(
	query: string,
	locale: string,
): Promise<SearchResults> {
	if (!query || query.trim().length === 0) {
		return {
			calculators: [],
			standards: [],
			articles: [],
		}
	}

	// Get all calculators for locale
	const allCalculators = await calculatorRegistry.getAll(locale)
	
	// Get all standards for locale
	const allStandards = getStandardsByLocale(locale)
	
	// Get all articles for locale
	const allArticles = articles.filter((article) => article.locale === locale)

	// Search calculators
	const calculatorResults = allCalculators
		.map((calc) => ({
			calculator: calc,
			score: calculateCalculatorScore(calc, query),
		}))
		.filter((result) => result.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((result) => result.calculator)
		.slice(0, 20) // Limit to top 20

	// Search standards
	const standardResults = allStandards
		.map((std) => ({
			standard: std,
			score: calculateStandardScore(std, query),
		}))
		.filter((result) => result.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((result) => result.standard)
		.slice(0, 10) // Limit to top 10

	// Search articles
	const articleResults = allArticles
		.map((article) => ({
			article,
			score: calculateArticleScore(article, query),
		}))
		.filter((result) => result.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((result) => result.article)
		.slice(0, 10) // Limit to top 10

	return {
		calculators: calculatorResults,
		standards: standardResults,
		articles: articleResults,
	}
}





