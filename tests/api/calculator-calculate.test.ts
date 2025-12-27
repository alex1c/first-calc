import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/calculators/[id]/calculate/route'
import { calculatorRegistry } from '@/lib/registry/loader'
import { createTestCalculator } from '../factories/calculator'

// Mock the registry
vi.mock('@/lib/registry/loader', () => ({
	calculatorRegistry: {
		getById: vi.fn(),
	},
}))

describe('POST /api/calculators/:id/calculate', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should calculate and return results', async () => {
		const calculator = createTestCalculator({
			id: 'test-calc',
			calculate: (inputs) => ({
				result: Number(inputs.value) * 2,
			}),
		})

		vi.mocked(calculatorRegistry.getById).mockResolvedValue(calculator as any)

		const request = new Request('http://localhost:3000/api/calculators/test-calc/calculate?locale=en', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ inputs: { value: 10 } }),
		})

		const response = await POST(request, { params: { id: 'test-calc' } })
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data.results).toBeDefined()
		expect(data.results.result).toBe(20)
	})

	it('should return validation error for invalid input', async () => {
		const calculator = createTestCalculator({
			id: 'test-calc',
			inputs: [
				{
					name: 'value',
					type: 'number',
					label: 'Value',
					validation: {
						required: true,
						min: 0,
					},
				},
			],
		})

		vi.mocked(calculatorRegistry.getById).mockResolvedValue(calculator as any)

		const request = new Request('http://localhost:3000/api/calculators/test-calc/calculate?locale=en', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ inputs: { value: -5 } }),
		})

		const response = await POST(request, { params: { id: 'test-calc' } })
		const data = await response.json()

		expect(response.status).toBe(400)
		expect(data.errors).toBeDefined()
	})

	it('should return 404 when calculator not found', async () => {
		vi.mocked(calculatorRegistry.getById).mockResolvedValue(undefined)

		const request = new Request('http://localhost:3000/api/calculators/not-found/calculate?locale=en', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ inputs: {} }),
		})

		const response = await POST(request, { params: { id: 'not-found' } })

		expect(response.status).toBe(404)
	})
})


