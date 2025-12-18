/**
 * i18n Type Definitions
 * Types for modular i18n system with namespaces
 */

import { locales, type Locale as BaseLocale } from '../i18n'

export type Locale = BaseLocale

/**
 * Supported namespaces
 */
export type Namespace =
	| 'common'
	| 'navigation'
	| 'errors'
	| 'calculators/ui'
	| 'seo/templates'
	| `calculators/items/${string}`
	| `standards/items/${string}`
	| `learn/items/${string}`
	| `legacy/${string}`

/**
 * Dictionary type - nested object structure
 */
export type Dictionary = Record<string, any>

/**
 * Merged dictionary from multiple namespaces
 */
export type MergedDictionary = Dictionary

/**
 * Translation function type
 */
export type TranslationFunction = (
	key: string,
	params?: Record<string, string | number>,
) => string

/**
 * Namespace loader options
 */
export interface LoadNamespacesOptions {
	/**
	 * Fallback locale if translation not found
	 * @default 'en'
	 */
	fallbackLocale?: Locale
	/**
	 * Whether to log missing translations
	 * @default false
	 */
	logMissing?: boolean
}

