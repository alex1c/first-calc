import type { Locale } from '@/lib/i18n'

export type SearchDocumentType = 'calculator' | 'article' | 'standard'

export interface SearchDocument {
	id: string
	type: SearchDocumentType
	title: string
	description: string
	url: string
	locale: Locale
	contentLocale: Locale
	category?: string
	categoryLabel?: string
	tags: string[]
	keywords: string[]
	body?: string
	extra?: {
		badge?: string
		standardType?: string
	}
	normalized: {
		title: string
		description: string
		category: string
		body: string
		tags: string[]
		keywords: string[]
	}
}

export interface SearchHit {
	id: string
	type: SearchDocumentType
	title: string
	description: string
	url: string
	category?: string
	badge?: string
	isForeignLocale?: boolean
}

export interface SearchGroup<T = SearchHit> {
	items: T[]
	total: number
}

export interface SearchResponse {
	calculators: SearchGroup
	articles: SearchGroup
	standards: SearchGroup
	fallbackLocaleUsed: boolean
	usedLocale: Locale
}

export interface SearchOptions {
	limitPerType?: number
}

