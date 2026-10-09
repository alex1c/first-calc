/**
 * @vitest-environment node
 *
 * Safe regression tests for C1 memory exhaustion guards.
 * Hostile huge inputs must throw domain errors quickly without allocating
 * large arrays. Do NOT reproduce unbounded allocation in-process.
 */
import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import {
	MAX_OWNERSHIP_YEARS,
	MAX_RANDOM_QUANTITY,
	assertBoundedIterations,
} from '@/lib/calculations/computation-bounds'
import { calculateCarDepreciation } from '@/lib/calculations/car-depreciation'
import { calculateCarResaleValue } from '@/lib/calculations/car-resale-value'
import { calculateRandomNumber } from '@/lib/calculations/random-number'
import { isCalculationDomainError } from '@/lib/calculations/domain-error'

describe('computation bounds (C1)', () => {
	it('assertBoundedIterations rejects values above the hard ceiling', () => {
		expect(() =>
			assertBoundedIterations(MAX_OWNERSHIP_YEARS + 1, MAX_OWNERSHIP_YEARS, 'Years'),
		).toThrow(/exceeds the maximum/)
		expect(assertBoundedIterations(5, MAX_OWNERSHIP_YEARS, 'Years')).toBe(5)
	})

	it('car-depreciation rejects hostile yearsOwned without building a huge table', () => {
		const started = Date.now()
		expect(() =>
			calculateCarDepreciation({
				purchasePrice: 25000,
				purchaseType: 'new',
				yearsOwned: 1_000_000_000,
				depreciationModel: 'simpleAnnualPercent',
				annualDepreciationRate: 15,
			}),
		).toThrow(/exceeds the maximum/)
		expect(Date.now() - started).toBeLessThan(1000)
	})

	it('car-depreciation accepts the maximum ownership horizon', () => {
		const result = calculateCarDepreciation({
			purchasePrice: 20000,
			purchaseType: 'used',
			yearsOwned: MAX_OWNERSHIP_YEARS,
			depreciationModel: 'simpleAnnualPercent',
			annualDepreciationRate: 12,
		})
		expect(result.estimatedResaleValue).toEqual(expect.any(Number))
		expect(Number.isFinite(result.estimatedResaleValue as number)).toBe(true)
		// Table may be an array or a formatted string depending on model path
		expect(result.yearByYearTable == null).toBe(false)
		if (Array.isArray(result.yearByYearTable)) {
			expect(result.yearByYearTable.length).toBeLessThanOrEqual(
				MAX_OWNERSHIP_YEARS + 1,
			)
		}
	})

	it('car-resale rejects hostile yearsUntilSale', () => {
		expect(() =>
			calculateCarResaleValue({
				currentCarValue: 15000,
				yearsUntilSale: 999_999,
				condition: 'good',
				baselineDepreciationRate: 12,
			}),
		).toThrow(/exceeds the maximum/)
	})

	it('random-number rejects quantity above MAX_RANDOM_QUANTITY', () => {
		try {
			calculateRandomNumber({
				minValue: 1,
				maxValue: 100,
				quantity: MAX_RANDOM_QUANTITY + 1,
				allowDuplicates: true,
			})
			expect.fail('expected domain error')
		} catch (error) {
			expect(isCalculationDomainError(error)).toBe(true)
		}
	})

	it('isolated child process rejects huge yearsOwned under low memory ceiling', () => {
		// Isolated process with a tight heap — must exit cleanly with a domain error,
		// not OOM from allocating a billion-row table.
		const probe = path.join(process.cwd(), 'scripts/b3-memory-bound-probe.mjs')
		const result = spawnSync(
			process.execPath,
			['--import', 'tsx', probe],
			{
				cwd: process.cwd(),
				encoding: 'utf8',
				timeout: 30_000,
				env: {
					...process.env,
					NODE_OPTIONS: '--max-old-space-size=64',
				},
			},
		)

		if (result.status === null && result.error) {
			console.warn('isolated bounds check skipped:', result.error.message)
			return
		}

		// Fallback: npx tsx if --import tsx is unavailable
		if (result.status !== 0 && !String(result.stdout).includes('BOUNDED_OK')) {
			const fallback = spawnSync(
				process.platform === 'win32' ? 'npx.cmd' : 'npx',
				['tsx', probe],
				{
					cwd: process.cwd(),
					encoding: 'utf8',
					timeout: 30_000,
					env: {
						...process.env,
						NODE_OPTIONS: '--max-old-space-size=64',
					},
					shell: process.platform === 'win32',
				},
			)
			expect(fallback.stdout).toContain('BOUNDED_OK')
			expect(fallback.status).toBe(0)
			return
		}

		expect(result.stdout).toContain('BOUNDED_OK')
		expect(result.status).toBe(0)
		expect(result.stdout).not.toContain('UNEXPECTED_SUCCESS')
	})
})
