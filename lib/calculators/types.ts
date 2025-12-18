/**
 * Calculator types and interfaces
 * Centralized type definitions for the calculator engine
 */

/**
 * Calculator category types
 */
export type CalculatorCategory =
	| 'finance'
	| 'math'
	| 'everyday'
	| 'engineering'
	| 'business'

/**
 * Supported locales for calculators
 */
export type CalculatorLocale = 'en' | 'ru' | 'es' | 'tr' | 'hi'

/**
 * Calculator example with step-by-step explanation
 */
export interface CalculatorExample {
	id: string
	title: string
	inputDescription: string
	steps: string[]
	resultDescription: string
}

/**
 * FAQ item for calculator
 */
export interface CalculatorFaqItem {
	question: string
	answer: string
}

/**
 * Input field definition for calculator form
 */
export interface CalculatorInput {
	name: string
	label: string
	type: 'number' | 'select'
	unitLabel?: string
	placeholder?: string
	options?: Array<{ value: string; label: string }>
	min?: number
	max?: number
	step?: number
	defaultValue?: number | string
	helpText?: string
	validation?: {
		required?: boolean
		min?: number
		max?: number
		message?: string
		custom?: (value: any) => boolean | string
	}
}

/**
 * Output field definition for calculator results
 */
export interface CalculatorOutput {
	name: string
	label: string
	unitLabel?: string
	formatType?: 'number' | 'currency' | 'percentage' | 'default'
}

/**
 * Calculator calculation function type
 */
export type CalculatorFunction = (
	values: Record<string, number | string>,
) => Record<string, number | string>

/**
 * Main calculator definition interface
 * Supports multi-language by having separate definitions per locale with same id
 */
export interface CalculatorDefinition {
	id: string
	slug: string
	category: CalculatorCategory
	title: string
	shortDescription: string
	longDescription?: string
	locale: CalculatorLocale
	contentLocale: CalculatorLocale // Locale of the actual content (may differ from locale if fallback to EN)
	tags?: string[] // Optional tags for filtering and navigation
	inputs: CalculatorInput[]
	outputs: CalculatorOutput[]
	calculate: CalculatorFunction
	howToBullets: string[]
	examples: CalculatorExample[]
	faq: CalculatorFaqItem[]
	relatedIds?: string[]
	standardIds?: string[]
	isEnabled?: boolean // Soft disable flag (default: true)
	meta?: {
		keywords?: string[]
		author?: string
	}
}

/**
 * Client-safe calculator definition (without calculate function)
 * Used for passing calculator data to client components
 */
export interface CalculatorDefinitionClient {
	id: string
	slug: string
	category: CalculatorCategory
	title: string
	shortDescription: string
	longDescription?: string
	locale: CalculatorLocale
	contentLocale: CalculatorLocale // Locale of the actual content (may differ from locale if fallback to EN)
	tags?: string[] // Optional tags for filtering and navigation
	inputs: CalculatorInput[]
	outputs: CalculatorOutput[]
	howToBullets: string[]
	examples: CalculatorExample[]
	faq: CalculatorFaqItem[]
	relatedIds?: string[]
	standardIds?: string[]
	meta?: {
		keywords?: string[]
		author?: string
	}
}

