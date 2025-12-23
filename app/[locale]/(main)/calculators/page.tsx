/**
 * Calculators listing page
 * 
 * Displays all calculators organized by category with:
 * - Category navigation menu (desktop sidebar, mobile dropdown)
 * - Category cards with descriptions and calculator counts
 * - Popular, new, and recommended calculator sections
 * - Breadcrumbs navigation
 * 
 * Uses i18n for all text content and category names.
 */

import { notFound } from 'next/navigation'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'
import {
	getPopularCalculators,
	getNewCalculators,
	getRecommendedCalculators,
} from '@/lib/navigation/structure'
import { getCategoryIds, getCategoryMeta } from '@/lib/navigation/categories'
import Link from 'next/link'
import { CalculatorCard } from '@/components/calculators/calculator-card'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getCalculatorsListBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { CategoryTiles } from '@/components/navigation/category-tiles'
import { TagsFilter } from '@/components/navigation/tags-filter'
import { categories as categoryConfigs } from '@/lib/navigation/categories'

/**
 * Required i18n namespaces for this page
 * - common: Common UI labels
 * - navigation: Navigation items and category names
 * - calculators/ui: Calculator-specific UI text
 */
const namespaces = ['common', 'navigation', 'calculators/ui'] as const

interface CalculatorsPageProps {
	params: {
		locale: Locale
	}
	searchParams: {
		tag?: string
	}
}

/**
 * Main calculators page component
 * 
 * Server component that loads calculators and renders the listing page.
 * 
 * @param params - Route parameters containing locale
 * @returns JSX for the calculators listing page
 */
export default async function CalculatorsPage({
	params,
	searchParams,
}: CalculatorsPageProps) {
	const { locale } = params
	const { tag } = searchParams

	// Validate locale - return 404 if invalid
	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for all required namespaces
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Load all calculators for the locale (disabled calculators are filtered out automatically)
	let calculators = await calculatorRegistry.getAll(locale)
	
	// Filter by tag if tag parameter is present
	if (tag) {
		calculators = calculators.filter((calc) => 
			calc.tags && calc.tags.includes(tag)
		)
	}
	
	// Load featured calculator lists for display sections
	// These are filtered by tag if tag is present
	let popularCalculators = await getPopularCalculators(locale)
	let newCalculators = await getNewCalculators(locale, 5)
	let recommendedCalculators = await getRecommendedCalculators(locale, {
		limit: 5,
	})
	
	// Apply tag filter to featured lists if tag is present
	if (tag) {
		popularCalculators = popularCalculators.filter((calc) => 
			calc.tags && calc.tags.includes(tag)
		)
		newCalculators = newCalculators.filter((calc) => 
			calc.tags && calc.tags.includes(tag)
		)
		recommendedCalculators = recommendedCalculators.filter((calc) => 
			calc.tags && calc.tags.includes(tag)
		)
	}

	// Get all category IDs from stable category list (ordered by display order)
	const allCategoryIds = getCategoryIds()
	
	// Filter to only categories that have at least one calculator
	// This ensures we don't show empty categories in the UI
	const categories = allCategoryIds.filter((catId) =>
		calculators.some((calc) => calc.category === catId),
	)

	// Group calculators by category (for display in category sections below)
	const calculatorsByCategory = categories.reduce(
		(acc, category) => {
			acc[category] = calculators.filter((calc) => calc.category === category)
			return acc
		},
		{} as Record<string, typeof calculators>,
	)

	// Prepare category tiles data with translations and counts from categoryConfigs
	const categoryTilesData = categoryConfigs
		.map((config) => {
			const meta = getCategoryMeta(config.id, locale, t)
			const categoryCalculators = calculators.filter((calc) => calc.category === config.id)
			return {
				id: config.id,
				title: meta.name,
				description: meta.description,
				calcCount: categoryCalculators.length,
				iconKey: config.iconKey,
			}
		})
		.filter((cat) => cat.calcCount > 0) // Only show categories with calculators
		.sort((a, b) => {
			// Sort by order from categoryConfigs
			const aOrder = categoryConfigs.find((c) => c.id === a.id)?.order || 999
			const bOrder = categoryConfigs.find((c) => c.id === b.id)?.order || 999
			return aOrder - bOrder
		})

	const breadcrumbs = getCalculatorsListBreadcrumbs(locale, t)

	return (
		<>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<div className="flex flex-col">
					{/* Main content */}
					<div className="flex-1">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							{t('calculators/ui.page.title')}
						</h1>
						<p className="text-lg text-gray-600 mb-6">
							{t('calculators/ui.page.description')}
						</p>
						<div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<span>{t('calculators/ui.page.toolsCta.title')}</span>
							<Link
								href={`${locale === 'en' ? '' : `/${locale}`}/tools`}
								className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700 transition-colors"
							>
								{t('calculators/ui.page.toolsCta.linkLabel')}
							</Link>
						</div>

						{/* Category tiles at the top */}
						<CategoryTiles locale={locale} categories={categoryTilesData} />

						{/* Tags filter */}
						<TagsFilter locale={locale} />

						{/* Show active tag filter if present */}
						{tag && (
							<div className="mb-6">
								<p className="text-sm text-gray-600">
									Filtered by tag: <span className="font-semibold text-blue-600">{tag}</span>
								</p>
							</div>
						)}

						{/* Popular Calculators */}
						{popularCalculators.length > 0 && (
							<div className="mb-8" id="popular-calculators">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('calculators/ui.sections.popular')}
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
									{popularCalculators.map((calc) => (
										<CalculatorCard
											key={calc.id}
											calculator={calc}
											locale={locale}
											isPopular={true}
											hasStandard={calc.standardIds && calc.standardIds.length > 0}
										/>
									))}
								</div>
							</div>
						)}

						{/* New Calculators */}
						{newCalculators.length > 0 && (
							<div className="mb-8">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('calculators/ui.sections.new')}
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
									{newCalculators.map((calc) => (
										<CalculatorCard
											key={calc.id}
											calculator={calc}
											locale={locale}
											isNew={true}
											hasStandard={calc.standardIds && calc.standardIds.length > 0}
										/>
									))}
								</div>
							</div>
						)}

						{/* Recommended Calculators */}
						{recommendedCalculators.length > 0 && (
							<div className="mb-8">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('calculators/ui.sections.recommended')}
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
									{recommendedCalculators.map((calc) => (
										<CalculatorCard
											key={calc.id}
											calculator={calc}
											locale={locale}
											hasStandard={calc.standardIds && calc.standardIds.length > 0}
										/>
									))}
								</div>
							</div>
						)}

						{/* Calculators by category */}
						<div className="space-y-8">
							{categories.map((category) => {
								const categoryCalculators = calculatorsByCategory[category]
								if (categoryCalculators.length === 0) return null

								const popularIds = new Set(popularCalculators.map((c) => c.id))
								const newIds = new Set(newCalculators.map((c) => c.id))

								return (
									<div key={category} id={`category-${category}`}>
										<h2 className="text-2xl font-semibold text-gray-900 mb-4">
											{t(`navigation.categories.${category}`) || category}
										</h2>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
											{categoryCalculators.map((calc) => (
												<CalculatorCard
													key={calc.id}
													calculator={calc}
													locale={locale}
													isPopular={popularIds.has(calc.id)}
													isNew={newIds.has(calc.id)}
													hasStandard={calc.standardIds && calc.standardIds.length > 0}
												/>
											))}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</PageContainer>
		</>
	)
}
