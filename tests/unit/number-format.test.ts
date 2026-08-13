import { describe, expect, it } from 'vitest'
import { formatLocalizedNumber, parseLocalizedNumber } from '@/lib/numberFormat'

describe('locale-aware numbers', () => {
	it('formats with locale separators', () => {
		expect(formatLocalizedNumber(1234.5, 'en')).toBe('1,234.5')
		expect(formatLocalizedNumber(1234.5, 'ru')).toMatch(/^1[\s\u00a0\u202f]234,5$/)
	})

	it('accepts decimal comma and decimal point safely', () => {
		expect(parseLocalizedNumber('1,5', 'ru')).toBe(1.5)
		expect(parseLocalizedNumber('1.5', 'ru')).toBe(1.5)
		expect(parseLocalizedNumber('1,5', 'en')).toBe(1.5)
		expect(parseLocalizedNumber('not a number', 'ru')).toBeNull()
		expect(parseLocalizedNumber('', 'ru')).toBeNull()
		expect(parseLocalizedNumber('-12,5', 'ru')).toBe(-12.5)
		expect(parseLocalizedNumber('1.234,5', 'ru')).toBe(1234.5)
		expect(parseLocalizedNumber('1,234.5', 'en')).toBe(1234.5)
		expect(parseLocalizedNumber('1,2,3', 'ru')).toBeNull()
	})
})
