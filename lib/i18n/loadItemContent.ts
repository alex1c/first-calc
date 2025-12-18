/**
 * Loader for item-based content (calculators, standards, articles)
 * Loads content from locales/{locale}/.../items/{slug}.json
 */

import type { Locale } from './types'
import type {
	CalculatorContentI18n,
	StandardContentI18n,
	ArticleContentI18n,
} from './types-items'
import { defaultLocale } from '../i18n'

/**
 * Load calculator content from items file
 */
export async function loadCalculatorContent(
	locale: Locale,
	slug: string,
): Promise<CalculatorContentI18n | null> {
	try {
		const content = await import(`@/locales/${locale}/calculators/items/${slug}.json`)
		return (content.default || content) as CalculatorContentI18n
	} catch (error) {
		// Fallback to English
		if (locale !== defaultLocale) {
			try {
				const content = await import(`@/locales/${defaultLocale}/calculators/items/${slug}.json`)
				return (content.default || content) as CalculatorContentI18n
			} catch {
				// Fallback failed, return null
				console.warn(
					`[i18n] Calculator content not found for slug "${slug}" in locale "${locale}" or "${defaultLocale}"`,
				)
				return null
			}
		}
		console.warn(`[i18n] Calculator content not found for slug "${slug}" in locale "${locale}"`)
		return null
	}
}

/**
 * Load standard content from items file
 */
export async function loadStandardContent(
	locale: Locale,
	country: string,
	slug: string,
): Promise<StandardContentI18n | null> {
	try {
		const content = await import(`@/locales/${locale}/standards/items/${slug}.json`)
		return (content.default || content) as StandardContentI18n
	} catch (error) {
		// Fallback to English
		if (locale !== defaultLocale) {
			try {
				const content = await import(`@/locales/${defaultLocale}/standards/items/${slug}.json`)
				return (content.default || content) as StandardContentI18n
			} catch {
				console.warn(
					`[i18n] Standard content not found for slug "${slug}" in locale "${locale}" or "${defaultLocale}"`,
				)
				return null
			}
		}
		console.warn(`[i18n] Standard content not found for slug "${slug}" in locale "${locale}"`)
		return null
	}
}

/**
 * Load article content from items file
 */
export async function loadArticleContent(
	locale: Locale,
	slug: string,
): Promise<ArticleContentI18n | null> {
	try {
		const content = await import(`@/locales/${locale}/learn/items/${slug}.json`)
		return (content.default || content) as ArticleContentI18n
	} catch (error) {
		// Fallback to English
		if (locale !== defaultLocale) {
			try {
				const content = await import(`@/locales/${defaultLocale}/learn/items/${slug}.json`)
				return (content.default || content) as ArticleContentI18n
			} catch {
				console.warn(
					`[i18n] Article content not found for slug "${slug}" in locale "${locale}" or "${defaultLocale}"`,
				)
				return null
			}
		}
		console.warn(`[i18n] Article content not found for slug "${slug}" in locale "${locale}"`)
		return null
	}
}

/**
 * Get default calculator content (fallback when item file doesn't exist)
 */
export function getDefaultCalculatorContent(slug: string): Partial<CalculatorContentI18n> {
	return {
		title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
		shortDescription: 'Calculator description',
		howTo: ['Enter values', 'Click Calculate', 'View results'],
		examples: [],
		faq: [],
	}
}

/**
 * Get default standard content (fallback when item file doesn't exist)
 */
export function getDefaultStandardContent(slug: string): Partial<StandardContentI18n> {
	return {
		title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
		shortDescription: 'Standard description',
		formulas: [],
		tables: [],
	}
}

/**
 * Get default article content (fallback when item file doesn't exist)
 */
export function getDefaultArticleContent(slug: string): Partial<ArticleContentI18n> {
	return {
		title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
		shortDescription: 'Article description',
		contentHtml: '<p>Article content</p>',
	}
}

