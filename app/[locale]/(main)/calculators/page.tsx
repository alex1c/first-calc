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
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getCalculatorsListBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { CategoryMenu } from '@/components/navigation/category-menu'
import { CategoryCards } from '@/components/navigation/category-cards'
import { LegacyToolsBlock } from '@/components/calculators/legacy-tools-block'

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
}: CalculatorsPageProps) {
	const { locale } = params

	// Validate locale - return 404 if invalid
	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for all required namespaces
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Load all calculators for the locale (disabled calculators are filtered out automatically)
	const calculators = await calculatorRegistry.getAll(locale)
	
	// Load featured calculator lists for display sections
	const popularCalculators = await getPopularCalculators(locale)
	const newCalculators = await getNewCalculators(locale, 5)
	const recommendedCalculators = await getRecommendedCalculators(locale, {
		limit: 5,
	})

	// Get all category IDs from stable category list (ordered by display order)
	const allCategoryIds = getCategoryIds()
	
	// Filter to only categories that have at least one calculator
	// This ensures we don't show empty categories in the UI
	const categories = allCategoryIds.filter((catId) =>
		calculators.some((calc) => calc.category === catId),
	)

	// Group calculators by category
	const calculatorsByCategory = categories.reduce(
		(acc, category) => {
			acc[category] = calculators.filter((calc) => calc.category === category)
			return acc
		},
		{} as Record<string, typeof calculators>,
	)

	// Prepare category data for cards with translations using getCategoryMeta
	const categoryData = categories.map((category) => {
		const meta = getCategoryMeta(category, locale, t)
		return {
			slug: category,
			count: calculatorsByCategory[category].length,
			label: meta.name,
			description: meta.description,
		}
	})

	// Prepare translated labels for CategoryMenu using getCategoryMeta
	const categoryLabels = categories.reduce(
		(acc, category) => {
			const meta = getCategoryMeta(category, locale, t)
			acc[category] = meta.name
			return acc
		},
		{} as Record<string, string>,
	)
	
	const categoryDescriptions = categories.reduce(
		(acc, category) => {
			const meta = getCategoryMeta(category, locale, t)
			acc[category] = meta.description
			return acc
		},
		{} as Record<string, string>,
	)

	const breadcrumbs = getCalculatorsListBreadcrumbs(locale, t)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumbs items={breadcrumbs} className="mb-4" />
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Category menu */}
					<CategoryMenu
						locale={locale}
						categories={categories}
						categoryLabels={categoryLabels}
						allLabel={t('calculators/ui.sections.all')}
						categoriesLabel={t('calculators/ui.sections.categories')}
						calculatorsLabel={t('navigation.menu.calculators')}
					/>

					{/* Main content */}
					<div className="flex-1">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							{t('calculators/ui.page.title')}
						</h1>
						<p className="text-lg text-gray-600 mb-8">
							{t('calculators/ui.page.description')}
						</p>

				{/* Popular Calculators */}
				{popularCalculators.length > 0 && (
					<div className="mb-8">
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

				{/* Legacy Tools / Converters */}
				<LegacyToolsBlock locale={locale} />

						{/* Browse by Category */}
						<div className="mb-8">
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">
								{t('calculators/ui.sections.categories')}
							</h2>
							<CategoryCards locale={locale} categories={categoryData} />
						</div>

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
			</div>
		</div>
	)
}
