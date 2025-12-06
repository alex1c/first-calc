/**
 * Input field types for calculator forms
 */
export type InputType = 'number' | 'text' | 'select' | 'checkbox' | 'radio'

/**
 * Output value types
 */
export type OutputValue = number | string | boolean | null

/**
 * Validation rule for input fields
 */
export interface ValidationRule {
	required?: boolean
	min?: number
	max?: number
	pattern?: string
	message?: string
	custom?: (value: any) => boolean | string
}

/**
 * Input field definition
 */
export interface InputDefinition {
	name: string
	label: string
	type: InputType
	units?: string
	placeholder?: string
	validation?: ValidationRule
	options?: Array<{ value: string | number; label: string }> // For select/radio
	defaultValue?: string | number | boolean
	helpText?: string
}

/**
 * Output field definition
 */
export interface OutputDefinition {
	name: string
	label: string
	units?: string
	format?: (value: OutputValue) => string
}

/**
 * FAQ item
 */
export interface FAQItem {
	question: string
	answer: string
}

/**
 * Example calculation with step-by-step explanation
 */
export interface Example {
	inputDescription?: string
	steps?: string[]
	result: string | OutputValue
	inputs?: Record<string, string | number | boolean>
	outputs?: Record<string, OutputValue>
	description?: string // Legacy support
}

/**
 * How to calculate block - list of bullet points
 */
export interface HowToBlock {
	title?: string
	steps: string[]
}

/**
 * Calculator calculation function type
 */
export type CalculateFunction = (
	inputs: Record<string, string | number | boolean>,
) => Record<string, OutputValue>

/**
 * Calculator definition - the core model for calculators
 */
export interface CalculatorDefinition {
	id: string
	slug: string
	category: string
	title: string
	description: string
	inputs: InputDefinition[]
	outputs: OutputDefinition[]
	calculate: CalculateFunction | string // Function or module path
	howTo?: HowToBlock
	faq?: FAQItem[]
	examples?: Example[]
	relatedIds?: string[]
	meta?: {
		keywords?: string[]
		author?: string
	}
}

