'use client'

/**
 * Client-side translation hook with stale-request protection.
 *
 * Soft navigations can change `locale` before a prior dynamic import finishes.
 * Completions are ignored unless they still match the active locale, and the
 * visible dictionary is never taken from a different locale (prevents RU chrome
 * sticking after Back to EN).
 */

import { useEffect, useState, useMemo, useRef } from 'react'
import type { Locale, Dictionary } from './types'

export type { Dictionary }
import { createT } from './t'

/** In-memory cache: already-fetched locale+namespace merges apply synchronously. */
const dictCache = new Map<string, Dictionary>()

type NamespaceLoader = (
	locale: Locale,
	namespaceList: string[],
) => Promise<Dictionary>

function cacheKey(locale: Locale, namespacesKey: string): string {
	return `${locale}::${namespacesKey}`
}

function mergeNamespaceResults(
	results: Array<{ namespace: string; data: Dictionary }>,
): Dictionary {
	const merged: Dictionary = {}
	for (const { namespace, data } of results) {
		const parts = namespace.split('/')
		if (parts.length === 1) {
			merged[namespace] = data
		} else {
			let current = merged
			for (let i = 0; i < parts.length - 1; i++) {
				if (!current[parts[i]]) {
					current[parts[i]] = {}
				}
				current = current[parts[i]] as Dictionary
			}
			current[parts[parts.length - 1]] = data
		}
	}
	return merged
}

/**
 * Optional Chromium/E2E delay: set `window.__FIRST_CALC_DELAY_I18N_MS` and
 * optionally `__FIRST_CALC_DELAY_I18N_LOCALES` (e.g. `['ru']`) via addInitScript
 * so stale-completion races are reproducible without depending on chunk URLs.
 */
async function maybeDelayDictionaryLoad(locale: Locale): Promise<void> {
	if (typeof window === 'undefined') return
	const w = window as Window & {
		__FIRST_CALC_DELAY_I18N_MS?: number
		__FIRST_CALC_DELAY_I18N_LOCALES?: string[]
	}
	const ms = w.__FIRST_CALC_DELAY_I18N_MS
	if (typeof ms !== 'number' || ms <= 0) return
	const only = w.__FIRST_CALC_DELAY_I18N_LOCALES
	if (only && only.length > 0 && !only.includes(locale)) return
	await new Promise((resolve) => setTimeout(resolve, ms))
}

async function defaultLoadNamespacesClient(
	locale: Locale,
	namespaceList: string[],
): Promise<Dictionary> {
	await maybeDelayDictionaryLoad(locale)
	const results = await Promise.all(
		namespaceList.map((ns) =>
			import(`@/locales/${locale}/${ns}.json`)
				.then((module) => ({
					namespace: ns,
					data: (module.default || module) as Dictionary,
				}))
				.catch(() =>
					import(`@/locales/en/${ns}.json`)
						.then((module) => ({
							namespace: ns,
							data: (module.default || module) as Dictionary,
						}))
						.catch(() => ({ namespace: ns, data: {} as Dictionary })),
				),
		),
	)
	return mergeNamespaceResults(results)
}

/** Production loader; tests may replace via setClientTLoaderForTests. */
let loadNamespacesClient: NamespaceLoader = defaultLoadNamespacesClient

/**
 * @param initialDict - Optional server-loaded dictionary (from loadNamespaces).
 *   Prevents SSR/first-paint from flashing raw i18n keys like `legacy/ui.form…`.
 */
export function useClientT(
	locale: Locale,
	namespaces: readonly string[],
	initialDict: Dictionary = {},
): (key: string, params?: Record<string, string | number>) => string {
	const namespacesKey = useMemo(() => namespaces.join(','), [namespaces])
	const initialLocaleRef = useRef<Locale | null>(null)
	if (initialLocaleRef.current === null) {
		initialLocaleRef.current = locale
	}

	const [dictLocale, setDictLocale] = useState<Locale>(locale)
	const [dict, setDict] = useState<Dictionary>(() => {
		const cached = dictCache.get(cacheKey(locale, namespacesKey))
		if (cached) return cached
		return initialDict
	})

	useEffect(() => {
		const namespaceList = namespacesKey.split(',').filter(Boolean)
		const requestedLocale = locale
		let cancelled = false

		const key = cacheKey(requestedLocale, namespacesKey)
		const cached = dictCache.get(key)
		if (cached) {
			// Already available — apply immediately (no wrong-locale frame).
			setDictLocale(requestedLocale)
			setDict(cached)
			return () => {
				cancelled = true
			}
		}

		// Drop previous locale's strings until the matching dict arrives.
		// Prefer SSR initialDict only when it was for this same locale.
		const fallback =
			requestedLocale === initialLocaleRef.current ? initialDict : {}
		setDictLocale(requestedLocale)
		setDict(fallback)

		loadNamespacesClient(requestedLocale, namespaceList).then((merged) => {
			// Always cache under the locale that was requested so a later
			// visit can apply synchronously — never apply if this effect
			// was cleaned up (stale completion after Back/Forward).
			dictCache.set(key, merged)
			if (cancelled) return
			setDictLocale(requestedLocale)
			setDict(merged)
		})

		return () => {
			cancelled = true
		}
		// initialDict is SSR-stable for the mount locale; omit from deps.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locale, namespacesKey])

	// Never translate with a dictionary from a different locale.
	const activeDict = dictLocale === locale ? dict : {}

	return (key: string, params?: Record<string, string | number>) => {
		const t = createT(activeDict)
		return t(key, params)
	}
}

/** Test helper: clear the client dictionary cache between race scenarios. */
export function clearClientTCacheForTests(): void {
	dictCache.clear()
}

/** Test helper: replace the async namespace loader (delayed / controlled). */
export function setClientTLoaderForTests(loader: NamespaceLoader): void {
	loadNamespacesClient = loader
}

/** Test helper: restore the production dynamic-import loader. */
export function resetClientTLoaderForTests(): void {
	loadNamespacesClient = defaultLoadNamespacesClient
}
