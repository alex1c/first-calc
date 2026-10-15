import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
	useClientT,
	clearClientTCacheForTests,
	setClientTLoaderForTests,
	resetClientTLoaderForTests,
} from '@/lib/i18n/useClientT'
import type { Locale, Dictionary } from '@/lib/i18n'

const EN_NAV: Dictionary = {
	navigation: {
		menu: {
			calculators: 'Calculators',
			standards: 'Standards',
			tools: 'Tools',
			learn: 'Learn',
			about: 'About',
			contact: 'Contact',
		},
	},
}

const RU_NAV: Dictionary = {
	navigation: {
		menu: {
			calculators: 'Калькуляторы',
			standards: 'Стандарты',
			tools: 'Инструменты',
			learn: 'Обучение',
			about: 'О нас',
			contact: 'Контакты',
		},
	},
}

/**
 * Controlled async loader reproduces the soft-nav race: RU dictionary
 * completes after the hook has already returned to EN.
 */
describe('useClientT stale dictionary race', () => {
	beforeEach(() => {
		clearClientTCacheForTests()
		resetClientTLoaderForTests()
	})

	afterEach(() => {
		clearClientTCacheForTests()
		resetClientTLoaderForTests()
	})

	it('ignores a late RU dictionary when locale already returned to EN', async () => {
		let resolveRu!: (value: Dictionary) => void
		const ruPending = new Promise<Dictionary>((resolve) => {
			resolveRu = resolve
		})

		setClientTLoaderForTests(async (locale) => {
			if (locale === 'ru') return ruPending
			return EN_NAV
		})

		const { result, rerender } = renderHook(
			({ locale }: { locale: Locale }) =>
				useClientT(locale, ['navigation'], EN_NAV),
			{ initialProps: { locale: 'en' as Locale } },
		)

		expect(result.current('navigation.menu.calculators')).toBe('Calculators')

		// Switch to RU — loader stays pending.
		rerender({ locale: 'ru' })
		await act(async () => {
			await Promise.resolve()
		})
		// Must not keep showing EN chrome as if it were the RU dict.
		expect(result.current('navigation.menu.calculators')).not.toBe(
			'Calculators',
		)
		expect(result.current('navigation.menu.calculators')).not.toBe(
			'Калькуляторы',
		)

		// Back to EN before RU resolves — EN cache/SSR fallback applies.
		rerender({ locale: 'en' })
		await act(async () => {
			await Promise.resolve()
		})
		expect(result.current('navigation.menu.calculators')).toBe('Calculators')

		// Late RU completion must not overwrite EN.
		await act(async () => {
			resolveRu(RU_NAV)
			await Promise.resolve()
			await Promise.resolve()
		})

		expect(result.current('navigation.menu.calculators')).toBe('Calculators')
		expect(result.current('navigation.menu.calculators')).not.toBe(
			'Калькуляторы',
		)
	})

	it('applies cached RU immediately on Forward after a prior load', async () => {
		setClientTLoaderForTests(async (locale) =>
			locale === 'ru' ? RU_NAV : EN_NAV,
		)

		const { result, rerender } = renderHook(
			({ locale }: { locale: Locale }) =>
				useClientT(locale, ['navigation'], EN_NAV),
			{ initialProps: { locale: 'en' as Locale } },
		)

		rerender({ locale: 'ru' })
		await waitFor(() => {
			expect(result.current('navigation.menu.calculators')).toBe(
				'Калькуляторы',
			)
		})

		rerender({ locale: 'en' })
		await waitFor(() => {
			expect(result.current('navigation.menu.calculators')).toBe(
				'Calculators',
			)
		})

		// Forward to RU — cache hit, no pending English frame from EN dict.
		rerender({ locale: 'ru' })
		expect(result.current('navigation.menu.calculators')).toBe('Калькуляторы')
	})
})
