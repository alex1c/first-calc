/**
 * DSL/JSON Schema for calculator definitions
 * Allows creating calculators without modifying React components
 */

export interface CalculatorSchema {
	id: string
	locale: string
	category: string
	slug: string
	title: string
	description: string
	inputs: Array<{
		name: string
		label: string
		type: 'number' | 'text' | 'select'
		unit?: string
		min?: number
		max?: number
		step?: number
		options?: Array<{ value: string; label: string }>
		defaultValue?: number | string
		helpText?: string
	}>
	outputs: Array<{
		name: string
		label: string
		unit?: string
	}>
	formula: string // e.g., "value * percent / 100"
	variables?: Record<string, string> // Variable descriptions
	howTo?: string[]
	examples?: Array<{
		input: Record<string, number>
		result: Record<string, number>
		title?: string
		description?: string
	}>
	faq?: Array<{ question: string; answer: string }>
	relatedIds?: string[]
	standardIds?: string[]
	meta?: {
		keywords?: string[]
		author?: string
	}
}

/**
 * Validate calculator schema
 */
export function validateCalculatorSchema(schema: unknown): {
	valid: boolean
	errors: string[]
} {
	const errors: string[] = []

	if (!schema || typeof schema !== 'object') {
		return { valid: false, errors: ['Schema must be an object'] }
	}

	const s = schema as Partial<CalculatorSchema>

	// Required fields
	if (!s.id || typeof s.id !== 'string') {
		errors.push('id is required and must be a string')
	}
	if (!s.locale || typeof s.locale !== 'string') {
		errors.push('locale is required and must be a string')
	}
	if (!s.category || typeof s.category !== 'string') {
		errors.push('category is required and must be a string')
	}
	if (!s.slug || typeof s.slug !== 'string') {
		errors.push('slug is required and must be a string')
	}
	if (!s.title || typeof s.title !== 'string') {
		errors.push('title is required and must be a string')
	}
	if (!s.description || typeof s.description !== 'string') {
		errors.push('description is required and must be a string')
	}

	// Inputs validation
	if (!Array.isArray(s.inputs) || s.inputs.length === 0) {
		errors.push('inputs is required and must be a non-empty array')
	} else {
		s.inputs.forEach((input, index) => {
			if (!input.name || typeof input.name !== 'string') {
				errors.push(`inputs[${index}].name is required`)
			}
			if (!input.label || typeof input.label !== 'string') {
				errors.push(`inputs[${index}].label is required`)
			}
			if (!['number', 'text', 'select'].includes(input.type)) {
				errors.push(`inputs[${index}].type must be "number", "text", or "select"`)
			}
			if (input.type === 'select' && !input.options) {
				errors.push(`inputs[${index}].options is required for select type`)
			}
		})
	}

	// Outputs validation
	if (!Array.isArray(s.outputs) || s.outputs.length === 0) {
		errors.push('outputs is required and must be a non-empty array')
	} else {
		s.outputs.forEach((output, index) => {
			if (!output.name || typeof output.name !== 'string') {
				errors.push(`outputs[${index}].name is required`)
			}
			if (!output.label || typeof output.label !== 'string') {
				errors.push(`outputs[${index}].label is required`)
			}
		})
	}

	// Formula validation
	if (!s.formula || typeof s.formula !== 'string') {
		errors.push('formula is required and must be a string')
	}

	return {
		valid: errors.length === 0,
		errors,
	}
}

/**
 * Parse formula string and execute calculation
 * Supports basic math operations: +, -, *, /, %, **, Math functions
 */
export function executeFormula(
	formula: string,
	variables: Record<string, number>,
): number {
	// Create safe evaluation context
	const context: Record<string, number> = {
		...variables,
		Math,
		PI: Math.PI,
		E: Math.E,
	}

	// Replace variable names with their values
	let expression = formula
	for (const [key, value] of Object.entries(variables)) {
		// Replace whole word matches only
		const regex = new RegExp(`\\b${key}\\b`, 'g')
		expression = expression.replace(regex, String(value))
	}

	// Evaluate safely (in production, consider using a proper expression parser)
	try {
		// eslint-disable-next-line no-eval
		const result = eval(expression)
		if (typeof result !== 'number' || !Number.isFinite(result)) {
			throw new Error('Formula result is not a valid number')
		}
		return result
	} catch (error) {
		throw new Error(
			`Formula evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

/**
 * Convert CalculatorSchema to CalculatorDefinition
 */
export function schemaToDefinition(
	schema: CalculatorSchema,
): import('@/lib/calculators/types').CalculatorDefinition {
	const { formula, variables, ...rest } = schema

	// Create calculate function from formula
	const calculate: import('@/lib/calculators/types').CalculatorFunction = (
		inputs,
	) => {
		// Convert inputs to numbers
		const numericInputs: Record<string, number> = {}
		for (const [key, value] of Object.entries(inputs)) {
			const numValue = Number(value)
			if (isNaN(numValue)) {
				throw new Error(`Invalid number for input: ${key}`)
			}
			numericInputs[key] = numValue
		}

		// Execute formula for each output
		const results: Record<string, number | string> = {}
		for (const output of schema.outputs) {
			try {
				// For now, assume single output uses the formula directly
				// In future, we might support multiple formulas
				const result = executeFormula(formula, numericInputs)
				results[output.name] = result
			} catch (error) {
				results[output.name] = null
			}
		}

		return results
	}

	// Convert inputs
	const calculatorInputs: import('@/lib/calculators/types').CalculatorInput[] =
		schema.inputs.map((input) => ({
			name: input.name,
			label: input.label,
			type: input.type === 'select' ? 'select' : 'number',
			unitLabel: input.unit,
			placeholder: `Enter ${input.label.toLowerCase()}`,
			options: input.options,
			min: input.min,
			max: input.max,
			step: input.step,
			defaultValue: input.defaultValue,
			helpText: input.helpText,
			validation: {
				required: true,
				min: input.min,
				max: input.max,
			},
		}))

	// Convert outputs
	const calculatorOutputs: import('@/lib/calculators/types').CalculatorOutput[] =
		schema.outputs.map((output) => ({
			name: output.name,
			label: output.label,
			unitLabel: output.unit,
		}))

	// Convert examples
	const calculatorExamples: import('@/lib/calculators/types').CalculatorExample[] =
		schema.examples?.map((example, index) => ({
			id: `example-${index + 1}`,
			title: example.title || `Example ${index + 1}`,
			inputDescription: example.description || 'Calculation example',
			steps: Object.entries(example.input)
				.map(([key, value]) => {
					const inputDef = schema.inputs.find((inp) => inp.name === key)
					return `${inputDef?.label || key}: ${value}${inputDef?.unit ? ` ${inputDef.unit}` : ''}`
				})
				.concat(
					Object.entries(example.result).map(([key, value]) => {
						const outputDef = schema.outputs.find((out) => out.name === key)
						return `Result: ${outputDef?.label || key} = ${value}${outputDef?.unit ? ` ${outputDef.unit}` : ''}`
					}),
				),
			resultDescription: Object.entries(example.result)
				.map(([key, value]) => {
					const outputDef = schema.outputs.find((out) => out.name === key)
					return `${outputDef?.label || key}: ${value}${outputDef?.unit ? ` ${outputDef.unit}` : ''}`
				})
				.join(', '),
		})) || []

	// Convert FAQ
	const calculatorFaq: import('@/lib/calculators/types').CalculatorFaqItem[] =
		schema.faq || []

	return {
		id: schema.id,
		slug: schema.slug,
		category: schema.category as import('@/lib/calculators/types').CalculatorCategory,
		title: schema.title,
		shortDescription: schema.description,
		longDescription: schema.description,
		locale: schema.locale as import('@/lib/calculators/types').CalculatorLocale,
		inputs: calculatorInputs,
		outputs: calculatorOutputs,
		calculate,
		howToBullets: schema.howTo || [],
		examples: calculatorExamples,
		faq: calculatorFaq,
		relatedIds: schema.relatedIds,
		standardIds: schema.standardIds,
		meta: schema.meta,
	}
}

/**
 * Load calculator schema from JSON file
 */
export async function loadCalculatorSchema(
	filePath: string,
): Promise<CalculatorSchema> {
	try {
		const fs = await import('fs/promises')
		const content = await fs.readFile(filePath, 'utf-8')
		const schema = JSON.parse(content) as CalculatorSchema

		const validation = validateCalculatorSchema(schema)
		if (!validation.valid) {
			throw new Error(`Invalid schema: ${validation.errors.join(', ')}`)
		}

		return schema
	} catch (error) {
		throw new Error(
			`Failed to load calculator schema: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

