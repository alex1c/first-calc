import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCalculatorsByStandard, getStandardsForCalculator } from '@/lib/standards/linking'
import { calculatorRegistry } from '@/lib/registry/loader'

// Mock the registry
vi.mock('@/lib/registry/loader', () => ({
	calculatorRegistry: {
		getAll: vi.fn(),
		getById: vi.fn(),
	},
}))

describe('getCalculatorsByStandard', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return empty array when no calculators match', async () => {
		vi.mocked(calculatorRegistry.getAll).mockResolvedValue([])
		const result = await getCalculatorsByStandard('standard1', 'en')
		expect(result).toEqual([])
	})

	it('should return calculators linked to standard', async () => {
		const mockCalculator = {
			id: 'calc1',
			standardIds: ['standard1'],
		}
		vi.mocked(calculatorRegistry.getAll).mockResolvedValue([mockCalculator] as any)
		const result = await getCalculatorsByStandard('standard1', 'en')
		expect(result).toHaveLength(1)
		expect(result[0].id).toBe('calc1')
	})
})

describe('getStandardsForCalculator', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return empty array when calculator has no related standards', async () => {
		vi.mocked(calculatorRegistry.getById).mockResolvedValue({
			id: 'calc1',
		} as any)
		const result = await getStandardsForCalculator('calc1', 'en')
		expect(result).toEqual([])
	})

	it('should return standards linked to calculator', async () => {
		vi.mocked(calculatorRegistry.getById).mockResolvedValue({
			id: 'calc1',
			standardIds: ['standard1', 'standard2'],
		} as any)
		const result = await getStandardsForCalculator('calc1', 'en')
		expect(result).toEqual(['standard1', 'standard2'])
	})
})

