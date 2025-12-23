import {
	parseSingleNumber,
	parseRange,
	parsePercentage,
	parseRoman,
	parseRangeFromString,
	parseNestedRanges,
} from '../slugParser'

describe('slugParser', () => {
	describe('parseSingleNumber', () => {
		test('parses valid number', () => {
			expect(parseSingleNumber(['123'])).toBe(123)
			expect(parseSingleNumber(['0'])).toBe(0)
			expect(parseSingleNumber(['999999'])).toBe(999999)
		})

		test('handles negative numbers', () => {
			expect(parseSingleNumber(['-123'])).toBe(-123)
		})

		test('returns null for invalid input', () => {
			expect(parseSingleNumber([])).toBeNull()
			expect(parseSingleNumber(['abc'])).toBeNull()
			expect(parseSingleNumber(['12.5'])).toBe(12) // Truncates decimal
		})

		test('handles numbers with extra characters', () => {
			expect(parseSingleNumber(['123abc'])).toBe(123)
			expect(parseSingleNumber(['abc123'])).toBeNull()
		})
	})

	describe('parseRange', () => {
		test('parses valid range', () => {
			expect(parseRange(['100-200'])).toEqual({ start: 100, end: 200 })
			expect(parseRange(['0-10'])).toEqual({ start: 0, end: 10 })
		})

		test('returns null for invalid range', () => {
			expect(parseRange([])).toBeNull()
			expect(parseRange(['100'])).toBeNull() // No dash
			expect(parseRange(['100-200-300'])).toBeNull() // Too many parts
			expect(parseRange(['200-100'])).toBeNull() // Start > end
			expect(parseRange(['abc-def'])).toBeNull() // Not numbers
		})

		test('handles edge cases', () => {
			expect(parseRange(['100-100'])).toEqual({ start: 100, end: 100 })
		})
	})

	describe('parsePercentage', () => {
		test('parses "of" type', () => {
			expect(parsePercentage(['100', '20'])).toEqual({
				type: 'of',
				percent: 20,
				value: 100,
			})
		})

		test('parses "add" type', () => {
			expect(parsePercentage(['100', '20-add'])).toEqual({
				type: 'add',
				percent: 20,
				value: 100,
			})
			expect(parsePercentage(['100', '20add'])).toEqual({
				type: 'add',
				percent: 20,
				value: 100,
			})
		})

		test('parses "subtract" type', () => {
			expect(parsePercentage(['100', '20-subtract'])).toEqual({
				type: 'subtract',
				percent: 20,
				value: 100,
			})
			expect(parsePercentage(['100', '20subtract'])).toEqual({
				type: 'subtract',
				percent: 20,
				value: 100,
			})
		})

		test('returns null for invalid input', () => {
			expect(parsePercentage([])).toBeNull()
			expect(parsePercentage(['100'])).toBeNull()
			expect(parsePercentage(['abc', '20'])).toBeNull()
			expect(parsePercentage(['100', 'abc'])).toBeNull()
		})
	})

	describe('parseRoman', () => {
		test('parses Roman numerals', () => {
			expect(parseRoman(['IV'])).toEqual({ roman: 'IV' })
			expect(parseRoman(['xii'])).toEqual({ roman: 'XII' })
			expect(parseRoman(['MMMCMXCIX'])).toEqual({ roman: 'MMMCMXCIX' })
		})

		test('parses Arabic numbers', () => {
			expect(parseRoman(['123'])).toEqual({ number: 123 })
			expect(parseRoman(['0'])).toEqual({ number: 0 })
		})

		test('returns null for invalid input', () => {
			expect(parseRoman([])).toBeNull()
			expect(parseRoman(['ABC'])).toBeNull()
			expect(parseRoman(['12.5'])).toBeNull()
		})
	})

	describe('parseRangeFromString', () => {
		test('parses valid range string', () => {
			expect(parseRangeFromString('100-200')).toEqual({ start: 100, end: 200 })
			expect(parseRangeFromString('10000-19999')).toEqual({
				start: 10000,
				end: 19999,
			})
		})

		test('handles nested ranges', () => {
			expect(parseRangeFromString('210000-219999/213500-213549')).toEqual({
				start: 210000,
				end: 219999,
			})
		})

		test('returns null for invalid input', () => {
			expect(parseRangeFromString('100')).toBeNull()
			expect(parseRangeFromString('abc-def')).toBeNull()
			expect(parseRangeFromString('200-100')).toBeNull()
		})
	})

	describe('parseNestedRanges', () => {
		test('parses multiple ranges', () => {
			expect(parseNestedRanges(['100-200', '300-400'])).toEqual([
				{ start: 100, end: 200 },
				{ start: 300, end: 400 },
			])
		})

		test('filters out invalid ranges', () => {
			expect(parseNestedRanges(['100-200', 'invalid', '300-400'])).toEqual([
				{ start: 100, end: 200 },
				{ start: 300, end: 400 },
			])
		})

		test('returns empty array for no valid ranges', () => {
			expect(parseNestedRanges(['invalid', 'also-invalid'])).toEqual([])
		})
	})
})









