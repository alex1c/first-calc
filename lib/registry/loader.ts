/**
 * Universal registry loader
 * Supports loading from local data files, with extension points for CMS/API
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import type { StandardDefinition } from '@/lib/standards/types'
import type { ArticleDefinition } from '@/lib/learn/types'

/**
 * Data source type
 */
type DataSource = 'local' | 'api' | 'cms'

/**
 * Get data source from environment
 */
function getDataSource(): DataSource {
	const source = process.env.NEXT_PUBLIC_DATA_SOURCE || 'local'
	return source as DataSource
}

/**
 * Calculator loader interface
 */
interface CalculatorLoader {
	getById(id: string, locale: string): Promise<CalculatorDefinition | undefined>
	getBySlug(
		category: string,
		slug: string,
		locale: string,
	): Promise<CalculatorDefinition | undefined>
	getAll(locale: string): Promise<CalculatorDefinition[]>
	getByCategory(
		category: string,
		locale: string,
	): Promise<CalculatorDefinition[]>
}

/**
 * Standard loader interface
 */
interface StandardLoader {
	getById(id: string, locale: string): Promise<StandardDefinition | undefined>
	getBySlug(
		country: string,
		slug: string,
		locale: string,
	): Promise<StandardDefinition | undefined>
	getAll(locale: string): Promise<StandardDefinition[]>
	getByCountry(
		country: string,
		locale: string,
	): Promise<StandardDefinition[]>
}

/**
 * Article loader interface
 */
interface ArticleLoader {
	getById(id: string, locale: string): Promise<ArticleDefinition | undefined>
	getBySlug(slug: string, locale: string): Promise<ArticleDefinition | undefined>
	getAll(locale: string): Promise<ArticleDefinition[]>
}

/**
 * Local calculator loader (from data/calculators.ts and JSON schemas)
 */
class LocalCalculatorLoader implements CalculatorLoader {
	async getById(
		id: string,
		locale: string,
	): Promise<CalculatorDefinition | undefined> {
		const { calculators } = await import('@/data/calculators')
		const { getCalculatorById } = await import('@/lib/calculators/loader')

		// Try local data first
		const local = calculators.find(
			(calc) => calc.id === id && calc.locale === locale,
		)
		if (local) return local

		// Try JSON schema
		return getCalculatorById(id, locale)
	}

	async getBySlug(
		category: string,
		slug: string,
		locale: string,
	): Promise<CalculatorDefinition | undefined> {
		const { getCalculatorBySlug } = await import('@/lib/calculators/loader')
		return getCalculatorBySlug(category, slug, locale)
	}

	async getAll(locale: string): Promise<CalculatorDefinition[]> {
		const { getCalculatorsByLocale } = await import('@/data/calculators')
		return getCalculatorsByLocale(locale)
	}

	async getByCategory(
		category: string,
		locale: string,
	): Promise<CalculatorDefinition[]> {
		const { getCalculatorsByCategory } = await import('@/data/calculators')
		return getCalculatorsByCategory(category, locale)
	}
}

/**
 * Local standard loader
 */
class LocalStandardLoader implements StandardLoader {
	async getById(
		id: string,
		locale: string,
	): Promise<StandardDefinition | undefined> {
		const { getStandardById } = await import('@/data/standards')
		return getStandardById(id, locale)
	}

	async getBySlug(
		country: string,
		slug: string,
		locale: string,
	): Promise<StandardDefinition | undefined> {
		const { getStandardBySlug } = await import('@/data/standards')
		return getStandardBySlug(country, slug, locale)
	}

	async getAll(locale: string): Promise<StandardDefinition[]> {
		const { getStandardsByLocale } = await import('@/data/standards')
		return getStandardsByLocale(locale)
	}

	async getByCountry(
		country: string,
		locale: string,
	): Promise<StandardDefinition[]> {
		const { getStandardsByCountry } = await import('@/data/standards')
		return getStandardsByCountry(country, locale)
	}
}

/**
 * Local article loader
 */
class LocalArticleLoader implements ArticleLoader {
	async getById(
		id: string,
		locale: string,
	): Promise<ArticleDefinition | undefined> {
		const { getArticleById } = await import('@/data/articles')
		return getArticleById(id, locale)
	}

	async getBySlug(
		slug: string,
		locale: string,
	): Promise<ArticleDefinition | undefined> {
		const { getArticleBySlug } = await import('@/data/articles')
		return getArticleBySlug(slug, locale)
	}

	async getAll(locale: string): Promise<ArticleDefinition[]> {
		const { getArticlesByLocale } = await import('@/data/articles')
		return getArticlesByLocale(locale)
	}
}

/**
 * API-based calculator loader (for future CMS integration)
 * Example implementation for REST API
 */
class ApiCalculatorLoader implements CalculatorLoader {
	private baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	async getById(
		id: string,
		locale: string,
	): Promise<CalculatorDefinition | undefined> {
		try {
			const response = await fetch(
				`${this.baseUrl}/calculators/${id}?locale=${locale}`,
			)
			if (!response.ok) return undefined
			return response.json()
		} catch {
			return undefined
		}
	}

	async getBySlug(
		category: string,
		slug: string,
		locale: string,
	): Promise<CalculatorDefinition | undefined> {
		try {
			const response = await fetch(
				`${this.baseUrl}/calculators/${category}/${slug}?locale=${locale}`,
			)
			if (!response.ok) return undefined
			return response.json()
		} catch {
			return undefined
		}
	}

	async getAll(locale: string): Promise<CalculatorDefinition[]> {
		try {
			const response = await fetch(
				`${this.baseUrl}/calculators?locale=${locale}`,
			)
			if (!response.ok) return []
			return response.json()
		} catch {
			return []
		}
	}

	async getByCategory(
		category: string,
		locale: string,
	): Promise<CalculatorDefinition[]> {
		try {
			const response = await fetch(
				`${this.baseUrl}/calculators?category=${category}&locale=${locale}`,
			)
			if (!response.ok) return []
			return response.json()
		} catch {
			return []
		}
	}
}

/**
 * Get calculator loader based on data source
 */
function getCalculatorLoader(): CalculatorLoader {
	const source = getDataSource()

	switch (source) {
		case 'api':
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
			return new ApiCalculatorLoader(apiUrl)
		case 'cms':
			// Future: Supabase, Sanity, etc.
			// For now, fall back to local
			return new LocalCalculatorLoader()
		case 'local':
		default:
			return new LocalCalculatorLoader()
	}
}

/**
 * Get standard loader
 */
function getStandardLoader(): StandardLoader {
	// For now, only local loader is implemented
	// Future: Add API/CMS loaders similar to calculators
	return new LocalStandardLoader()
}

/**
 * Get article loader
 */
function getArticleLoader(): ArticleLoader {
	// For now, only local loader is implemented
	// Future: Add API/CMS loaders similar to calculators
	return new LocalArticleLoader()
}

/**
 * Public API - Calculator functions
 */
export const calculatorRegistry = {
	getById: (id: string, locale: string = 'en') =>
		getCalculatorLoader().getById(id, locale),
	getBySlug: (category: string, slug: string, locale: string = 'en') =>
		getCalculatorLoader().getBySlug(category, slug, locale),
	getAll: (locale: string = 'en') => getCalculatorLoader().getAll(locale),
	getByCategory: (category: string, locale: string = 'en') =>
		getCalculatorLoader().getByCategory(category, locale),
}

/**
 * Public API - Standard functions
 */
export const standardRegistry = {
	getById: (id: string, locale: string = 'en') =>
		getStandardLoader().getById(id, locale),
	getBySlug: (country: string, slug: string, locale: string = 'en') =>
		getStandardLoader().getBySlug(country, slug, locale),
	getAll: (locale: string = 'en') => getStandardLoader().getAll(locale),
	getByCountry: (country: string, locale: string = 'en') =>
		getStandardLoader().getByCountry(country, locale),
}

/**
 * Public API - Article functions
 */
export const articleRegistry = {
	getById: (id: string, locale: string = 'en') =>
		getArticleLoader().getById(id, locale),
	getBySlug: (slug: string, locale: string = 'en') =>
		getArticleLoader().getBySlug(slug, locale),
	getAll: (locale: string = 'en') => getArticleLoader().getAll(locale),
}

