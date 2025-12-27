import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/calculators/route'
import { calculatorRegistry } from '@/lib/registry/loader'

// Mock the registry
vi.mock('@/lib/registry/loader', () => ({
	calculatorRegistry: {
		getAll: vi.fn(),
	},
}))

describe('GET /api/calculators', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return list of calculators', async () => {
		const mockCalculators = [
			{
				id: 'calc1',
				title: 'Calculator 1',
				category: 'math',
				slug: 'calc1',
				locale: 'en',
				shortDescription: 'Test calculator 1',
				inputs: [],
				outputs: [],
			},
			{
				id: 'calc2',
				title: 'Calculator 2',
				category: 'math',
				slug: 'calc2',
				locale: 'en',
				shortDescription: 'Test calculator 2',
				inputs: [],
				outputs: [],
			},
		]

		vi.mocked(calculatorRegistry.getAll).mockResolvedValue(mockCalculators as any)

		const request = new Request('http://localhost:3000/api/calculators?locale=en')
		const response = await GET(request)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data.calculators).toHaveLength(2)
		expect(data.calculators[0].id).toBe('calc1')
	})

	it('should use default locale when not provided', async () => {
		vi.mocked(calculatorRegistry.getAll).mockResolvedValue([])

		const request = new Request('http://localhost:3000/api/calculators')
		await GET(request)

		expect(calculatorRegistry.getAll).toHaveBeenCalledWith('en')
	})

	it('should use locale from query params', async () => {
		vi.mocked(calculatorRegistry.getAll).mockResolvedValue([])

		const request = new Request('http://localhost:3000/api/calculators?locale=ru')
		await GET(request)

		expect(calculatorRegistry.getAll).toHaveBeenCalledWith('ru')
	})
})

