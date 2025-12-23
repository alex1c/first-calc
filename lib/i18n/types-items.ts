/**
 * Types for item-based content (calculators, standards, articles)
 */

/**
 * Calculator content structure for i18n items
 */
export interface CalculatorContentI18n {
	title: string
	shortDescription: string
	longDescription?: string
	howTo?: string[]
	examples?: Array<{
		title: string
		description: string
		steps?: string[]
		resultDescription?: string
	}>
	faq?: Array<{
		question: string
		answer: string
	}>
	seo?: {
		title?: string
		description?: string
		keywords?: string[]
	}
	inputs?: Array<{
		label: string
		placeholder?: string
		helpText?: string
		unitLabel?: string
	}>
	outputs?: Array<{
		label: string
		unitLabel?: string
	}>
}

/**
 * Standard content structure for i18n items
 */
export interface StandardContentI18n {
	title: string
	shortDescription: string
	longDescription?: string
	formulas?: Array<{
		title: string
		formula: string
		description?: string
	}>
	tables?: Array<{
		title: string
		rows: string[][]
		description?: string
	}>
	seo?: {
		title?: string
		description?: string
		keywords?: string[]
	}
}

/**
 * Article content structure for i18n items
 */
export interface ArticleContentI18n {
	title: string
	shortDescription: string
	contentHtml: string
	seo?: {
		title?: string
		description?: string
		keywords?: string[]
	}
}






