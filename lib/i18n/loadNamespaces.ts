/**
 * Namespace loader for modular i18n
 * Loads and merges multiple namespace dictionaries
 */

import type { Locale, Namespace, MergedDictionary, LoadNamespacesOptions } from './types'
import { defaultLocale } from '../i18n'

// Server-side cache for loaded dictionaries
const cache = new Map<string, MergedDictionary>()

/**
 * Generate cache key
 */
function getCacheKey(locale: Locale, namespaces: readonly Namespace[]): string {
	return `${locale}:${namespaces.sort().join(',')}`
}

/**
 * Load a single namespace dictionary
 */
async function loadNamespace(
	locale: Locale,
	namespace: Namespace,
	fallbackLocale: Locale = 'en',
): Promise<Dictionary> {
	try {
		// Dynamic import based on namespace path
		// Convert namespace to file path (e.g., "calculators/ui" -> "calculators/ui.json")
		const namespacePath = namespace
		const dict = await import(`@/locales/${locale}/${namespacePath}.json`)
		return dict.default || dict
	} catch (error) {
		// Fallback to default locale if current locale not found
		if (locale !== fallbackLocale) {
			try {
				const namespacePath = namespace
				const dict = await import(`@/locales/${fallbackLocale}/${namespacePath}.json`)
				return dict.default || dict
			} catch {
				// If fallback also fails, return empty dict
				console.warn(
					`[i18n] Failed to load namespace "${namespace}" for locale "${locale}" and fallback "${fallbackLocale}"`,
				)
				return {}
			}
		}
		console.warn(`[i18n] Failed to load namespace "${namespace}" for locale "${locale}"`)
		return {}
	}
}

/**
 * Load and merge multiple namespace dictionaries
 * Uses dynamic imports to avoid bundling all translations
 * Implements server-side caching for performance
 */
export async function loadNamespaces(
	locale: Locale,
	namespaces: readonly Namespace[],
	options: LoadNamespacesOptions = {},
): Promise<MergedDictionary> {
	const { fallbackLocale = defaultLocale, logMissing = false } = options

	// Check cache first
	const cacheKey = getCacheKey(locale, namespaces)
	const cached = cache.get(cacheKey)
	if (cached) {
		return cached
	}

	// Load all namespaces in parallel
	const namespacePromises = namespaces.map((ns) => loadNamespace(locale, ns, fallbackLocale))
	const namespaceDicts = await Promise.all(namespacePromises)

	// Merge dictionaries (later namespaces override earlier ones)
	const merged: MergedDictionary = {}
	for (const dict of namespaceDicts) {
		Object.assign(merged, dict)
	}

	// Cache the result (server-side only)
	if (typeof window === 'undefined') {
		cache.set(cacheKey, merged)
	}

	if (logMissing && Object.keys(merged).length === 0) {
		console.warn(
			`[i18n] No translations loaded for locale "${locale}" with namespaces: ${namespaces.join(', ')}`,
		)
	}

	return merged
}

/**
 * Clear the cache (useful for development)
 */
export function clearCache(): void {
	cache.clear()
}

