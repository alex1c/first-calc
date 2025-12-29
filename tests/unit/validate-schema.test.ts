import { describe, it, expect } from 'vitest'
import { validateCalculatorSchema } from '@/lib/calculators/schema'
import type { CalculatorSchema } from '@/lib/calculators/types'

describe('validateCalculatorSchema', () => {
	it('should validate a correct schema', () => {
		const schema: CalculatorSchema = {
			id: 'test-calc',
			category: 'math',
			slug: 'test-calc',
			inputs: [
				{
					name: 'value',
					type: 'number',
					label: 'Value',
				},
			],
			outputs: [
				{
					name: 'result',
					label: 'Result',
				},
			],
			formula: 'value * 2',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(true)
		expect(result.errors).toHaveLength(0)
	})

	it('should reject schema without id', () => {
		const schema = {
			category: 'math',
			slug: 'test',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(false)
		expect(result.errors).toContain('id is required and must be a string')
	})

	it('should reject schema without inputs', () => {
		const schema: Partial<CalculatorSchema> = {
			id: 'test',
			category: 'math',
			slug: 'test',
			inputs: [],
			outputs: [{ name: 'result', label: 'Result' }],
			formula: '1',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(false)
		expect(result.errors).toContain('inputs is required and must be a non-empty array')
	})

	it('should reject schema without formula for formula engine', () => {
		const schema: Partial<CalculatorSchema> = {
			id: 'test',
			category: 'math',
			slug: 'test',
			inputs: [{ name: 'value', type: 'number', label: 'Value' }],
			outputs: [{ name: 'result', label: 'Result' }],
			engine: 'formula',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(false)
		expect(result.errors).toContain('formula is required and must be a string for engine="formula"')
	})

	it('should reject schema without calculationId for function engine', () => {
		const schema: Partial<CalculatorSchema> = {
			id: 'test',
			category: 'math',
			slug: 'test',
			inputs: [{ name: 'value', type: 'number', label: 'Value' }],
			outputs: [{ name: 'result', label: 'Result' }],
			engine: 'function',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(false)
		expect(result.errors).toContain('calculationId is required and must be a string for engine="function"')
	})

	it('should allow disabled calculators with empty inputs/outputs', () => {
		const schema: Partial<CalculatorSchema> = {
			id: 'disabled-calc',
			category: 'math',
			slug: 'disabled-calc',
			isEnabled: false,
			inputs: [],
			outputs: [],
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(true)
	})

	it('should reject invalid input type', () => {
		const schema = {
			id: 'test',
			category: 'math',
			slug: 'test',
			inputs: [
				{
			name: 'value',
					type: 'invalid',
					label: 'Value',
				},
			],
			outputs: [{ name: 'result', label: 'Result' }],
			formula: 'value',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(false)
		expect(result.errors.some((e) => e.includes('type must be'))).toBe(true)
	})

	it('should reject select input without options', () => {
		const schema = {
			id: 'test',
			category: 'math',
			slug: 'test',
			inputs: [
				{
					name: 'choice',
					type: 'select',
					label: 'Choice',
				},
			],
			outputs: [{ name: 'result', label: 'Result' }],
			formula: '1',
		}

		const result = validateCalculatorSchema(schema)
		expect(result.valid).toBe(false)
		expect(result.errors).toContain('inputs[0].options is required for select type')
	})
})



