/**
 * Standard definition for Standards section
 */
export interface StandardDefinition {
	id: string
	slug: string
	country: string
	title: string
	description: string
	keyFormulas?: string[]
	relatedCalculatorIds?: string[]
	meta?: {
		year?: number
		organization?: string
		keywords?: string[]
	}
}

/**
 * Learn article definition
 */
export interface LearnArticle {
	id: string
	slug: string
	title: string
	description: string
	content?: string
	category?: string
	relatedCalculatorIds?: string[]
	meta?: {
		author?: string
		publishedDate?: string
		keywords?: string[]
	}
}








