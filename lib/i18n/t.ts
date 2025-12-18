/**
 * Translation function creator
 * Creates a translation function from a dictionary with key path support
 */

import type { Dictionary, TranslationFunction } from './types'

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: Dictionary, path: string): string | undefined {
	const keys = path.split('.')
	let current: any = obj

	for (const key of keys) {
		if (current === null || current === undefined) {
			return undefined
		}
		current = current[key]
	}

	return typeof current === 'string' ? current : undefined
}

/**
 * Replace template placeholders in string
 * Supports {key} and {key.value} formats
 */
function replaceTemplate(
	template: string,
	params?: Record<string, string | number>,
): string {
	if (!params) {
		return template
	}

	return template.replace(/\{(\w+(?:\.\w+)*)\}/g, (match, key) => {
		const value = params[key]
		return value !== undefined ? String(value) : match
	})
}

/**
 * Normalize translation key by replacing / with .
 * Example: "calculators/ui.sections.all" -> "calculators.ui.sections.all"
 */
function normalizeKey(key: string): string {
	return key.replace(/\//g, '.')
}

/**
 * Create a translation function from a dictionary
 * Supports:
 * - Key paths: "common.button.calculate"
 * - Keys with slashes: "calculators/ui.sections.all" (normalized to "calculators.ui.sections.all")
 * - Template parameters: t("message", { name: "John" })
 */
export function createT(dict: Dictionary): TranslationFunction {
	return (key: string, params?: Record<string, string | number>): string => {
		// Normalize key: replace / with .
		const normalizedKey = normalizeKey(key)

		// Try to get value using normalized key path
		const value = getNestedValue(dict, normalizedKey)

		if (value === undefined) {
			// Return key as fallback (helps identify missing translations)
			// Log both original and normalized key for easier debugging
			// In development, also log the dictionary structure for debugging
			if (process.env.NODE_ENV === 'development') {
				console.warn(
					`[i18n] Missing translation for key: "${key}" (normalized: "${normalizedKey}")`,
				)
				console.warn(`[i18n] Dictionary keys:`, Object.keys(dict))
				if (normalizedKey.startsWith('navigation.')) {
					console.warn(`[i18n] Navigation dict:`, dict.navigation)
				}
			}
			return key
		}

		// Replace template parameters if provided
		if (params) {
			return replaceTemplate(value, params)
		}

		return value
	}
}



