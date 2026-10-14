import { describe, expect, it } from 'vitest'
import { buildSitemapEntries } from '@/app/sitemap'
import { DECADE_HUBS, PROPISYU_DECADE_COUNT } from '@/lib/propisyu/decades'

describe('propisyu decade sitemap segment', () => {
	it('exposes exactly 100 decade hubs', () => {
		expect(DECADE_HUBS).toHaveLength(PROPISYU_DECADE_COUNT)
		expect(DECADE_HUBS[0]).toMatchObject({
			start: 0,
			end: 9999,
			pathname: '/chislo-propisyu/0-9999',
		})
		expect(DECADE_HUBS[PROPISYU_DECADE_COUNT - 1]).toMatchObject({
			start: 990000,
			end: 999999,
			pathname: '/chislo-propisyu/990000-999999',
		})
	})

	it('adds decade hubs to sitemap without money or chunk tables', async () => {
		const previousEnv = process.env.NEXT_PUBLIC_ENV
		process.env.NEXT_PUBLIC_ENV = 'production'
		try {
			const entries = await buildSitemapEntries()
			const decades = entries.filter((e) => e.group === 'propisyu-decades')
			expect(decades).toHaveLength(100)
			expect(
				decades.every((e) =>
					e.url.includes('/chislo-propisyu/') &&
					!e.url.includes('/0-9999/0-49'),
				),
			).toBe(true)
			expect(
				decades.some((e) => e.url.endsWith('/ru/chislo-propisyu/0-9999')),
			).toBe(true)
			expect(
				decades.every((e) => e.url.includes('/ru/chislo-propisyu/')),
			).toBe(true)
			expect(
				decades.some((e) => e.url.includes('/chislo-propisyu/420-00')),
			).toBe(false)
		} finally {
			if (previousEnv === undefined) delete process.env.NEXT_PUBLIC_ENV
			else process.env.NEXT_PUBLIC_ENV = previousEnv
		}
	})
})
