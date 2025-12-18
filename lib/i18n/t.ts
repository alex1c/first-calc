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
 * Create a translation function from a dictionary
 * Supports:
 * - Key paths: "common.button.calculate"
 * - Template parameters: t("message", { name: "John" })
 */
export function createT(dict: Dictionary): TranslationFunction {
	return (key: string, params?: Record<string, string | number>): string => {
		// Try to get value using key path
		const value = getNestedValue(dict, key)

		if (value === undefined) {
			// Return key as fallback (helps identify missing translations)
			console.warn(`[i18n] Missing translation for key: "${key}"`)
			return key
		}

		// Replace template parameters if provided
		if (params) {
			return replaceTemplate(value, params)
		}

		return value
	}
}



