/**
 * Breadcrumb generators for different page types
 * Generates breadcrumb data with localized labels
 */

import type { Locale } from '@/lib/i18n'
import type { TranslationFunction } from '@/lib/i18n/types'

export interface BreadcrumbItem {
	label: string
	href: string
}

/**
 * Generate breadcrumbs for calculator pages
 */
export function getCalculatorBreadcrumbs(
	locale: Locale,
	category: string,
	slug: string,
	calculatorTitle?: string,
	t: TranslationFunction,
): BreadcrumbItem[] {
	// EN locale uses URLs without /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`

	return [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.breadcrumb.calculators'),
			href: `${basePath}/calculators`,
		},
		{
			label: t(`navigation.categories.${category}`) || category,
			href: `${basePath}/calculators/${category}`,
		},
		{
			label: calculatorTitle || slug,
			href: `${basePath}/calculators/${category}/${slug}`,
		},
	]
}

/**
 * Generate breadcrumbs for calculator category pages
 */
export function getCalculatorCategoryBreadcrumbs(
	locale: Locale,
	category: string,
	t: TranslationFunction,
): BreadcrumbItem[] {
	// EN locale uses URLs without /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`

	return [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.breadcrumb.calculators'),
			href: `${basePath}/calculators`,
		},
		{
			label: t(`navigation.categories.${category}`) || category,
			href: `${basePath}/calculators/${category}`,
		},
	]
}

/**
 * Generate breadcrumbs for calculators list page
 */
export function getCalculatorsListBreadcrumbs(
	locale: Locale,
	t: TranslationFunction,
): BreadcrumbItem[] {
	// EN locale uses URLs without /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`

	return [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.breadcrumb.calculators'),
			href: `${basePath}/calculators`,
		},
	]
}

/**
 * Generate breadcrumbs for standards pages
 */
export function getStandardsBreadcrumbs(
	locale: Locale,
	country?: string,
	slug?: string,
	standardTitle?: string,
	t: TranslationFunction,
): BreadcrumbItem[] {
	// EN locale uses URLs without /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`

	const items: BreadcrumbItem[] = [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.breadcrumb.standards'),
			href: `${basePath}/standards`,
		},
	]

	if (country) {
		items.push({
			label: country,
			href: `${basePath}/standards/${country}`,
		})
	}

	if (slug && standardTitle) {
		items.push({
			label: standardTitle,
			href: `${basePath}/standards/${country || ''}/${slug}`,
		})
	}

	return items
}

/**
 * Generate breadcrumbs for learn/articles pages
 */
export function getLearnBreadcrumbs(
	locale: Locale,
	slug?: string,
	articleTitle?: string,
	t: TranslationFunction,
): BreadcrumbItem[] {
	// EN locale uses URLs without /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`

	const items: BreadcrumbItem[] = [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.breadcrumb.learn'),
			href: `${basePath}/learn`,
		},
	]

	if (slug && articleTitle) {
		items.push({
			label: articleTitle,
			href: `${basePath}/learn/${slug}`,
		})
	}

	return items
}

/**
 * Generate breadcrumbs for legacy pages
 * Handles EN without prefix (no /en in URLs)
 */
export function getLegacyBreadcrumbs(
	locale: Locale,
	toolType: string,
	params: string[],
	t: TranslationFunction,
	toolTitle?: string,
): BreadcrumbItem[] {
	// EN locale uses URLs without /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`

	const items: BreadcrumbItem[] = [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.menu.tools'),
			href: `${basePath}/tools`,
		},
	]

	// Add tool type (route groups like (legacy) are not part of the URL)
	// Use toolTitle if provided, otherwise use toolType slug
	items.push({
		label: toolTitle || toolType,
		href: `${basePath}/${toolType}`,
	})

	// Add params as additional breadcrumbs
	params.forEach((param, index) => {
		items.push({
			label: param,
			href: `${basePath}/${toolType}/${params.slice(0, index + 1).join('/')}`,
		})
	})

	return items
}



