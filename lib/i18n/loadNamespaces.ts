/**
 * Namespace loader for modular i18n
 * Loads and merges multiple namespace dictionaries
 */

import type { Locale, Namespace, MergedDictionary, LoadNamespacesOptions, Dictionary } from './types'
import { defaultLocale } from '../i18n'

/**
 * Deep merge two dictionaries
 * Recursively merges nested objects
 */
function deepMerge(target: Dictionary, source: Dictionary): void {
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			if (
				typeof source[key] === 'object' &&
				source[key] !== null &&
				!Array.isArray(source[key]) &&
				typeof target[key] === 'object' &&
				target[key] !== null &&
				!Array.isArray(target[key])
			) {
				// Recursively merge nested objects
				deepMerge(target[key] as Dictionary, source[key] as Dictionary)
			} else {
				// Overwrite or set value
				target[key] = source[key]
			}
		}
	}
}

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
	// Note: In development, we skip cache to ensure fresh data
	const cacheKey = getCacheKey(locale, namespaces)
	const cached = cache.get(cacheKey)
	if (cached && process.env.NODE_ENV === 'production') {
		return cached
	}

	// Load all namespaces in parallel
	const namespacePromises = namespaces.map((ns) => loadNamespace(locale, ns, fallbackLocale))
	const namespaceDicts = await Promise.all(namespacePromises)

	// Merge dictionaries (later namespaces override earlier ones)
	// Use deep merge to preserve nested structure
	// IMPORTANT: Wrap each dictionary in its namespace key before merging
	// e.g., navigation.json -> { navigation: {...} }
	const merged: MergedDictionary = {}
	for (let i = 0; i < namespaces.length; i++) {
		const ns = namespaces[i]
		const dict = namespaceDicts[i]
		// Split namespace by '/' to handle nested paths like 'legacy/ui'
		const parts = ns.split('/')
		if (parts.length === 1) {
			// Simple namespace like 'navigation' -> wrap in { navigation: dict }
			deepMerge(merged, { [ns]: dict })
		} else {
			// Nested namespace like 'legacy/ui' -> create { legacy: { ui: dict } }
			let current = merged
			for (let j = 0; j < parts.length - 1; j++) {
				if (!current[parts[j]]) {
					current[parts[j]] = {}
				}
				current = current[parts[j]] as Dictionary
			}
			current[parts[parts.length - 1]] = dict
		}
	}

	// Cache the result (server-side only, and only in production)
	if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
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
 * Automatically called in development mode on module load
 */
export function clearCache(): void {
	cache.clear()
}

// Clear cache in development mode to ensure fresh data
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
	clearCache()
}

