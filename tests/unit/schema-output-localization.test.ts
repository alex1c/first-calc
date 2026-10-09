/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest'
import { schemaToDefinition } from '@/lib/calculators/schema'
import { loadCalculatorSchema } from '@/lib/calculators/schema'
import path from 'path'

describe('schemaToDefinition output localization', () => {
	it('maps output labels by stable name when item order differs', async () => {
		const schemaPath = path.join(
			process.cwd(),
			'data',
			'calculators',
			'gcd.json',
		)
		const schema = await loadCalculatorSchema(schemaPath)
		const definition = await schemaToDefinition(schema, 'ru')
		const gcdOutput = definition.outputs.find((out) => out.name === 'result')
		expect(gcdOutput?.label).toBe('НОД')
	})

	it('localizes select option labels from item files', async () => {
		const schemaPath = path.join(
			process.cwd(),
			'data',
			'calculators',
			'trip-cost-calculator.json',
		)
		const schema = await loadCalculatorSchema(schemaPath)
		const definition = await schemaToDefinition(schema, 'ru')
		const distanceUnit = definition.inputs.find(
			(input) => input.name === 'distanceUnit',
		)
		expect(distanceUnit?.options?.[0]?.label).toMatch(/Километр/i)
		expect(distanceUnit?.options?.[1]?.label).toMatch(/Мил/i)
	})
})
