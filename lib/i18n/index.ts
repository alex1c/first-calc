/**
 * i18n module exports
 * Central export point for all i18n functionality
 */

export { locales, defaultLocale, localeNames, type Locale } from '../i18n'
export { loadNamespaces, clearCache } from './loadNamespaces'
export { createT } from './t'
export type {
	Namespace,
	Dictionary,
	MergedDictionary,
	TranslationFunction,
	LoadNamespacesOptions,
} from './types'

