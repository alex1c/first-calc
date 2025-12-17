/**
 * Types for Standards section
 */

export interface StandardDefinition {
	id: string
	country: string
	slug: string
	locale: 'en' | 'ru' | 'es' | 'tr' | 'hi'
	title: string
	shortDescription: string
	longDescription?: string
	formulas?: Array<{ title: string; formula: string }>
	tables?: Array<{ title: string; rows: string[][] }>
	relatedCalculatorIds?: string[]
	meta?: {
		keywords?: string[]
		organization?: string
		year?: number
	}
}




