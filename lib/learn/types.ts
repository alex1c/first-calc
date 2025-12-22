/**
 * Types for Learn section (Articles)
 */

export interface ArticleDefinition {
	id: string
	slug: string
	locale: string
	title: string
	shortDescription?: string
	contentHtml: string
	relatedCalculatorIds?: string[]
	relatedStandardIds?: string[]
	meta?: {
		keywords?: string[]
		author?: string
		publishedDate?: string
	}
}








