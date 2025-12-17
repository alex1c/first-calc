/**
 * Automatic content generator for calculators
 * Generates how-to, FAQ, and examples based on calculator schema
 * Currently uses templates, but structured for future OpenAI integration
 */

import type { CalculatorSchema } from '@/lib/calculators/schema'
import type { CalculatorExample, CalculatorFaqItem } from '@/lib/calculators/types'

/**
 * Generate calculator content from schema
 * Currently uses templates, but can be extended with OpenAI API
 */
export async function generateCalculatorContent(
	schema: CalculatorSchema,
): Promise<{
	howTo: string[]
	faq: CalculatorFaqItem[]
	examples: CalculatorExample[]
}> {
	// For now, use template-based generation
	// In future, this can call OpenAI API

	const howTo = generateHowTo(schema)
	const faq = generateFaq(schema)
	const examples = generateExamples(schema)

	return {
		howTo,
		faq,
		examples,
	}
}

/**
 * Generate how-to steps based on inputs and formula
 */
function generateHowTo(schema: CalculatorSchema): string[] {
	const steps: string[] = []

	// Step 1: Enter inputs
	schema.inputs.forEach((input) => {
		steps.push(
			`Enter the ${input.label.toLowerCase()}${input.unit ? ` in ${input.unit}` : ''}`,
		)
	})

	// Step 2: Calculate
	steps.push('Click "Calculate" to get the result')

	// Step 3: Understand result
	if (schema.outputs.length === 1) {
		steps.push(
			`The result shows the ${schema.outputs[0].label.toLowerCase()}${schema.outputs[0].unit ? ` in ${schema.outputs[0].unit}` : ''}`,
		)
	} else {
		steps.push('Review the calculated results')
	}

	// Step 4: Formula explanation
	if (schema.variables) {
		const formulaDesc = `Formula: ${schema.formula}`
		steps.push(formulaDesc)
	}

	// Step 5: Use cases
	steps.push('You can use this calculator for various related calculations')

	return steps
}

/**
 * Generate FAQ based on calculator schema
 */
function generateFaq(schema: CalculatorSchema): CalculatorFaqItem[] {
	const faq: CalculatorFaqItem[] = []

	// FAQ 1: How to use
	faq.push({
		question: `How do I use the ${schema.title} calculator?`,
		answer: `Enter the required values in the input fields and click "Calculate" to get the result. The calculator uses the formula: ${schema.formula}`,
	})

	// FAQ 2: Input explanation
	if (schema.inputs.length > 0) {
		const firstInput = schema.inputs[0]
		faq.push({
			question: `What is ${firstInput.label}?`,
			answer: `${firstInput.label} is ${schema.variables?.[firstInput.name] || 'a required input value'}${firstInput.unit ? ` measured in ${firstInput.unit}` : ''}`,
		})
	}

	// FAQ 3: Formula explanation
	if (schema.variables) {
		faq.push({
			question: 'How is the result calculated?',
			answer: `The calculation uses the formula: ${schema.formula}. ${Object.entries(schema.variables)
				.map(([key, desc]) => `${key} represents ${desc}`)
				.join(', ')}`,
		})
	}

	// FAQ 4: Output explanation
	if (schema.outputs.length > 0) {
		const firstOutput = schema.outputs[0]
		faq.push({
			question: `What does ${firstOutput.label} mean?`,
			answer: `${firstOutput.label} is the calculated result${firstOutput.unit ? ` in ${firstOutput.unit}` : ''}`,
		})
	}

	// FAQ 5: Use cases
	faq.push({
		question: 'When should I use this calculator?',
		answer: `This calculator is useful for ${schema.description.toLowerCase()}`,
	})

	// FAQ 6: Limitations
	if (schema.inputs.some((inp) => inp.min !== undefined || inp.max !== undefined)) {
		const limits = schema.inputs
			.filter((inp) => inp.min !== undefined || inp.max !== undefined)
			.map((inp) => {
				const parts: string[] = []
				if (inp.min !== undefined) parts.push(`minimum ${inp.min}`)
				if (inp.max !== undefined) parts.push(`maximum ${inp.max}`)
				return `${inp.label}: ${parts.join(', ')}`
			})
			.join('; ')

		faq.push({
			question: 'Are there any input limitations?',
			answer: `Yes, the following limits apply: ${limits}`,
		})
	}

	return faq
}

/**
 * Generate examples based on schema
 */
function generateExamples(schema: CalculatorSchema): CalculatorExample[] {
	const examples: CalculatorExample[] = []

	// Generate 2-3 examples with typical values
	const exampleCount = Math.min(3, schema.inputs.length + 1)

	for (let i = 0; i < exampleCount; i++) {
		// Create example inputs with typical values
		const exampleInputs: Record<string, number> = {}
		schema.inputs.forEach((input) => {
			if (input.type === 'number') {
				// Use default, min, or a typical value
				if (input.defaultValue !== undefined) {
					exampleInputs[input.name] = Number(input.defaultValue)
				} else if (input.min !== undefined) {
					exampleInputs[input.name] = input.min + (i * 10)
				} else {
					exampleInputs[input.name] = (i + 1) * 10
				}
			}
		})

		// Calculate results using formula
		const exampleResults: Record<string, number> = {}
		try {
			// Simple formula evaluation (in production, use proper parser)
			let formula = schema.formula
			for (const [key, value] of Object.entries(exampleInputs)) {
				formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value))
			}
			// eslint-disable-next-line no-eval
			const result = eval(formula)
			if (typeof result === 'number' && Number.isFinite(result)) {
				schema.outputs.forEach((output) => {
					exampleResults[output.name] = Math.round(result * 100) / 100
				})
			}
		} catch {
			// If calculation fails, use placeholder
			schema.outputs.forEach((output) => {
				exampleResults[output.name] = 0
			})
		}

		examples.push({
			id: `example-${i + 1}`,
			title: `Example ${i + 1}`,
			inputDescription: `Calculate with ${Object.entries(exampleInputs)
				.map(([key, value]) => {
					const input = schema.inputs.find((inp) => inp.name === key)
					return `${input?.label || key} = ${value}${input?.unit || ''}`
				})
				.join(', ')}`,
			steps: [
				...Object.entries(exampleInputs).map(([key, value]) => {
					const input = schema.inputs.find((inp) => inp.name === key)
					return `${input?.label || key}: ${value}${input?.unit ? ` ${input.unit}` : ''}`
				}),
				`Formula: ${schema.formula}`,
				...Object.entries(exampleResults).map(([key, value]) => {
					const output = schema.outputs.find((out) => out.name === key)
					return `Result: ${output?.label || key} = ${value}${output?.unit ? ` ${output.unit}` : ''}`
				}),
			],
			resultDescription: Object.entries(exampleResults)
				.map(([key, value]) => {
					const output = schema.outputs.find((out) => out.name === key)
					return `${output?.label || key} = ${value}${output?.unit ? ` ${output.unit}` : ''}`
				})
				.join(', '),
		})
	}

	return examples
}

/**
 * Future: OpenAI-based content generation
 * Uncomment and implement when OpenAI API is available
 */
/*
async function generateWithOpenAI(
	schema: CalculatorSchema,
	prompt: string,
): Promise<string> {
	// Example implementation:
	// const response = await openai.chat.completions.create({
	//   model: "gpt-4",
	//   messages: [{ role: "user", content: prompt }],
	// });
	// return response.choices[0].message.content;
	
	throw new Error('OpenAI integration not yet implemented')
}
*/




