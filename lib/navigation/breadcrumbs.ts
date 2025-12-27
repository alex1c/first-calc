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
	t: TranslationFunction,
	calculatorTitle?: string,
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
			label: (() => {
				const translated = t(`navigation.categories.${category}`)
				// If translation returns the key itself (missing translation), use fallback
				return translated !== `navigation.categories.${category}` ? translated : category
			})(),
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
			label: (() => {
				const translated = t(`navigation.categories.${category}`)
				// If translation returns the key itself (missing translation), use fallback
				return translated !== `navigation.categories.${category}` ? translated : category
			})(),
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
 * Generate breadcrumbs for tools landing page
 */
export function getToolsBreadcrumbs(
	locale: Locale,
	t: TranslationFunction,
): BreadcrumbItem[] {
	const basePath = locale === 'en' ? '' : `/${locale}`

	return [
		{
			label: t('navigation.breadcrumb.home'),
			href: basePath || '/',
		},
		{
			label: t('navigation.breadcrumb.tools'),
			href: `${basePath}/tools`,
		},
	]
}

/**
 * Get human-readable label for standard region/type
 */
function getStandardRegionLabel(country: string, t: TranslationFunction): string {
	const regionLabels: Record<string, string> = {
		EU: 'European Standards',
		ISO: 'International Standards',
		RU: 'Russian Standards',
		TR: 'Turkish Standards',
	}

	// Try to get translated label, fallback to English label, then to country code
	const label = regionLabels[country] || country
	return label
}

/**
 * Generate breadcrumbs for standards pages
 * Pattern: Home → Standards → [Region or Type] → [Standard Name]
 */
export function getStandardsBreadcrumbs(
	locale: Locale,
	t: TranslationFunction,
	country?: string,
	slug?: string,
	standardTitle?: string,
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
		// Use human-readable region/type label instead of country code
		const regionLabel = getStandardRegionLabel(country, t)
		items.push({
			label: regionLabel,
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
 * Generate breadcrumbs for national standards hub pages that live under
 * /standards/national. Country label falls back to the slug when no friendly
 * name is provided so links always render.
 */
export function getNationalStandardsBreadcrumbs(
	locale: Locale,
	countrySlug: string | undefined,
	countryName: string | undefined,
	t: TranslationFunction,
): BreadcrumbItem[] {
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
		{
			label: 'National Standards',
			href: `${basePath}/standards/national`,
		},
	]

	if (countrySlug) {
		items.push({
			label: countryName || countrySlug.toUpperCase(),
			href: `${basePath}/standards/national/${countrySlug}`,
		})
	}

	return items
}

/**
 * Generate breadcrumbs for learn/articles pages
 */
export function getLearnBreadcrumbs(
	locale: Locale,
	t: TranslationFunction,
	slug?: string,
	articleTitle?: string,
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
			label: t('navigation.breadcrumb.tools'),
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



