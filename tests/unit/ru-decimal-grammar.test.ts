import { describe, expect, it } from 'vitest'
import { numberToWordsRuDecimal } from '@/lib/legacy/decimalToWords'

describe('Russian decimal grammar (feminine numerator + fraction declension)', () => {
	const cases: Array<[number, string]> = [
		[0.1, 'ноль целых одна десятая'],
		[0.2, 'ноль целых две десятые'],
		[0.01, 'ноль целых одна сотая'],
		[0.02, 'ноль целых две сотые'],
		[0.001, 'ноль целых одна тысячная'],
		[0.000001, 'ноль целых одна миллионная'],
		[0.000002, 'ноль целых две миллионные'],
		[0.000011, 'ноль целых одиннадцать миллионных'],
		[0.000021, 'ноль целых двадцать одна миллионная'],
		[
			0.123456,
			'ноль целых сто двадцать три тысячи четыреста пятьдесят шесть миллионных',
		],
	]

	it.each(cases)('%s → %s', (value, expected) => {
		expect(numberToWordsRuDecimal(value, { format: 'numeric' })).toBe(
			expected,
		)
	})
})
