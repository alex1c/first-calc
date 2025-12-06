import { numberToWordsRu } from '../numberToWordsRu'

describe('numberToWordsRu', () => {
	// Basic numbers
	test('converts 0 to "ноль"', () => {
		expect(numberToWordsRu(0)).toBe('ноль')
	})

	test('converts 1 to "один"', () => {
		expect(numberToWordsRu(1)).toBe('один')
	})

	test('converts 2 to "два"', () => {
		expect(numberToWordsRu(2)).toBe('два')
	})

	test('converts 5 to "пять"', () => {
		expect(numberToWordsRu(5)).toBe('пять')
	})

	test('converts 10 to "десять"', () => {
		expect(numberToWordsRu(10)).toBe('десять')
	})

	test('converts 21 to "двадцать один"', () => {
		expect(numberToWordsRu(21)).toBe('двадцать один')
	})

	test('converts 105 to "сто пять"', () => {
		expect(numberToWordsRu(105)).toBe('сто пять')
	})

	test('converts 1000 to "одна тысяча"', () => {
		expect(numberToWordsRu(1000)).toBe('одна тысяча')
	})

	test('converts 2000 to "две тысячи"', () => {
		expect(numberToWordsRu(2000)).toBe('две тысячи')
	})

	test('converts 2345 to "две тысячи триста сорок пять"', () => {
		expect(numberToWordsRu(2345)).toBe('две тысячи триста сорок пять')
	})

	test('converts 1_000_000 to "один миллион"', () => {
		expect(numberToWordsRu(1_000_000)).toBe('один миллион')
	})

	// Edge cases
	test('throws error for negative numbers', () => {
		expect(() => numberToWordsRu(-1)).toThrow('out of range')
	})

	test('throws error for numbers over 999,999,999', () => {
		expect(() => numberToWordsRu(1_000_000_000)).toThrow('out of range')
	})

	// Additional test cases
	test('converts 11 to "одиннадцать"', () => {
		expect(numberToWordsRu(11)).toBe('одиннадцать')
	})

	test('converts 99 to "девяносто девять"', () => {
		expect(numberToWordsRu(99)).toBe('девяносто девять')
	})

	test('converts 100 to "сто"', () => {
		expect(numberToWordsRu(100)).toBe('сто')
	})

	test('converts 999 to "девятьсот девяносто девять"', () => {
		expect(numberToWordsRu(999)).toBe('девятьсот девяносто девять')
	})

	test('converts 5000 to "пять тысяч"', () => {
		expect(numberToWordsRu(5000)).toBe('пять тысяч')
	})

	test('converts 1001 to "одна тысяча один"', () => {
		expect(numberToWordsRu(1001)).toBe('одна тысяча один')
	})

	test('converts 2001 to "две тысячи один"', () => {
		expect(numberToWordsRu(2001)).toBe('две тысячи один')
	})

	test('converts 123456 to "сто двадцать три тысячи четыреста пятьдесят шесть"', () => {
		expect(numberToWordsRu(123456)).toBe(
			'сто двадцать три тысячи четыреста пятьдесят шесть',
		)
	})

	test('converts 999999999 to correct representation', () => {
		const result = numberToWordsRu(999_999_999)
		expect(result).toContain('девятьсот девяносто девять миллионов')
		expect(result).toContain('девятьсот девяносто девять тысяч')
		expect(result).toContain('девятьсот девяносто девять')
	})
})

