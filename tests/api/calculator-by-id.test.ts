import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/calculators/[id]/route'
import { calculatorRegistry } from '@/lib/registry/loader'

// Mock the registry
vi.mock('@/lib/registry/loader', () => ({
	calculatorRegistry: {
		getById: vi.fn(),
	},
}))

describe('GET /api/calculators/:id', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return calculator by id', async () => {
		const mockCalculator = {
			id: 'test-calc',
			title: 'Test Calculator',
			category: 'math',
			slug: 'test-calc',
			locale: 'en',
			shortDescription: 'Test calculator',
			longDescription: 'Long description',
			inputs: [],
			outputs: [],
			howToBullets: [],
			examples: [],
			faq: [],
			relatedIds: [],
			standardIds: [],
		}

		vi.mocked(calculatorRegistry.getById).mockResolvedValue(mockCalculator as any)

		const request = new Request('http://localhost:3000/api/calculators/test-calc?locale=en')
		const response = await GET(request, { params: { id: 'test-calc' } })
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data.id).toBe('test-calc')
		expect(data.title).toBe('Test Calculator')
	})

	it('should return 404 when calculator not found', async () => {
		vi.mocked(calculatorRegistry.getById).mockResolvedValue(undefined)

		const request = new Request('http://localhost:3000/api/calculators/not-found?locale=en')
		const response = await GET(request, { params: { id: 'not-found' } })

		expect(response.status).toBe(404)
		const data = await response.json()
		expect(data.error).toBe('Calculator not found')
	})
})

