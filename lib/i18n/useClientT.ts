'use client'

/**
 * Client-side translation hook
 * Loads translations dynamically for client components
 */

import { useEffect, useState } from 'react'
import type { Locale, Dictionary } from './types'
import { createT } from './t'

/**
 * Hook to load and use translations in client components
 * @param locale - The locale to load translations for
 * @param namespaces - Array of namespace names to load
 * @returns Translation function
 */
export function useClientT(
	locale: Locale,
	namespaces: readonly string[],
): (key: string, params?: Record<string, string | number>) => string {
	const [dict, setDict] = useState<Dictionary>({})

	useEffect(() => {
		// Load all namespaces in parallel
		Promise.all(
			namespaces.map((ns) =>
				import(`@/locales/${locale}/${ns}.json`)
					.then((module) => ({ namespace: ns, data: module.default || module }))
					.catch(() => {
						// Fallback to English
						return import(`@/locales/en/${ns}.json`)
							.then((module) => ({ namespace: ns, data: module.default || module }))
							.catch(() => ({ namespace: ns, data: {} }))
					}),
			),
		).then((results) => {
			// Merge all namespaces into a single dictionary
			const merged: Dictionary = {}
			for (const { namespace, data } of results) {
				// Split namespace by '/' to handle nested paths like 'legacy/ui'
				const parts = namespace.split('/')
				if (parts.length === 1) {
					merged[namespace] = data
				} else {
					// For nested namespaces like 'legacy/ui', create nested structure
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
			setDict(merged)
		})
	}, [locale, namespaces.join(',')])

	return (key: string, params?: Record<string, string | number>) => {
		const t = createT(dict)
		return t(key, params)
	}
}

