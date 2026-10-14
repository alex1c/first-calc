import { describe, expect, it } from 'vitest'
import { parseMoneyFormat } from '@/lib/legacy/slugParser'

describe('strict legacy money slug parser (numbers-to-words)', () => {
	it('rejects malformed money amounts (no silent truncate)', () => {
		expect(parseMoneyFormat(['12abc-money-usd'])).toBeNull()
		expect(parseMoneyFormat(['1.2.3-money-usd'])).toBeNull()
		expect(parseMoneyFormat(['123.456-money-usd'])).toBeNull()
	})

	it('accepts valid USD/EUR/RUB money within engine ceilings', () => {
		expect(parseMoneyFormat(['1.50-money-usd'])).toMatchObject({
			number: 1.5,
			currency: 'usd',
		})
		expect(parseMoneyFormat(['1000000000-money-usd'])).toMatchObject({
			number: 1_000_000_000,
			currency: 'usd',
		})
		expect(parseMoneyFormat(['555.23-money-eur'])).toMatchObject({
			currency: 'eur',
		})
		expect(parseMoneyFormat(['999999999.99-money-rub'])).toMatchObject({
			currency: 'rub',
		})
		expect(parseMoneyFormat(['1000000000-money-rub'])).toBeNull()
	})
})
