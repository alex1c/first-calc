import { http, HttpResponse } from 'msw'
import type { CalculatorDefinition } from '@/lib/calculators/types'

/**
 * MSW handlers for API mocking in tests
 */

export const handlers = [
	// GET /api/calculators - List all calculators
	http.get('/api/calculators', () => {
		return HttpResponse.json({
			calculators: [
				{
					id: 'test-calculator',
					title: 'Test Calculator',
					category: 'math',
					slug: 'test-calculator',
				},
			],
		})
	}),

	// GET /api/calculators/:id - Get calculator by ID
	http.get('/api/calculators/:id', ({ params }) => {
		const { id } = params
		return HttpResponse.json({
			id,
			title: 'Test Calculator',
			category: 'math',
			slug: 'test-calculator',
			inputs: [
				{
					name: 'value',
					type: 'number',
					label: 'Value',
					min: 0,
				},
			],
			outputs: [
				{
					name: 'result',
					label: 'Result',
				},
			],
			formula: 'value * 2',
		} as Partial<CalculatorDefinition>)
	}),

	// POST /api/calculators/:id/calculate - Calculate
	http.post('/api/calculators/:id/calculate', async ({ params, request }) => {
		const { id } = params
		const body = await request.json() as { inputs: Record<string, number | string> }

		// Simple test calculation: double the value
		const value = Number(body.inputs.value) || 0
		const result = value * 2

		return HttpResponse.json({
			results: {
				result,
			},
		})
	}),
]

// Create MSW server instance
import { setupServer } from 'msw/node'

export const server = setupServer(...handlers)


