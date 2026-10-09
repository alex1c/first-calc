/**
 * @vitest-environment node
 *
 * RU numbers-to-words must not return English word forms on locale=ru.
 */
import { describe, expect, it } from 'vitest'
import { calculateNumbersToWords } from '@/lib/calculations/numbers-to-words'
import { POST } from '@/app/api/calculators/[id]/calculate/route'
import '@/lib/calculations/numbers-to-words'

describe('numbers-to-words RU output', () => {
	it('returns Russian words when language=ru', () => {
		const result = calculateNumbersToWords({
			number: 123,
			language: 'ru',
		})
		expect(result.words).toMatch(/сто/i)
		expect(result.words).not.toMatch(/one|hundred|twenty/i)
	})

	it('returns English words when language=en', () => {
		const result = calculateNumbersToWords({
			number: 21,
			language: 'en',
		})
		expect(String(result.words).toLowerCase()).toMatch(/twenty/)
	})

	it('API locale=ru injects Russian output without explicit language', async () => {
		const request = new Request(
			'http://localhost:3000/api/calculators/numbers-to-words/calculate?locale=ru',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					locale: 'ru',
					inputs: { number: 1000, currencyMode: 'false' },
				}),
			},
		)
		const response = await POST(request, {
			params: { id: 'numbers-to-words' },
		})
		const data = await response.json()
		expect(response.status).toBe(200)
		expect(String(data.results.words)).toMatch(/тысяч/i)
		expect(String(data.results.words)).not.toMatch(/thousand/i)
	})
})
