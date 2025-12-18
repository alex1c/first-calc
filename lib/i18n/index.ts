/**
 * i18n module exports
 * Central export point for all i18n functionality
 */

export { locales, defaultLocale, localeNames, type Locale } from '../i18n'
export { loadNamespaces, clearCache } from './loadNamespaces'
export { createT } from './t'
// Note: useClientT is a client-side hook and should be imported directly from './useClientT'
// to avoid issues with Next.js server/client boundary
export type {
	Namespace,
	Dictionary,
	MergedDictionary,
	TranslationFunction,
	LoadNamespacesOptions,
} from './types'

