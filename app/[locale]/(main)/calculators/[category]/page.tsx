import { notFound } from 'next/navigation'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'
import { getCalculatorsByCategoryWithPopularity } from '@/lib/navigation/structure'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getCalculatorCategoryBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { CalculatorCard } from '@/components/calculators/calculator-card'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation', 'calculators/ui'] as const

interface CalculatorsCategoryPageProps {
	params: {
		locale: Locale
		category: string
	}
}

export default async function CalculatorsCategoryPage({
	params,
}: CalculatorsCategoryPageProps) {
	const { locale, category } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const calculators = await getCalculatorsByCategoryWithPopularity(
		category,
		locale,
	)

	if (calculators.length === 0) {
		notFound()
	}

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Generate breadcrumbs
	const breadcrumbs = getCalculatorCategoryBreadcrumbs(locale, category, t)

	// Get category description
	const categoryDescription = t(`navigation.categoryDescriptions.${category}`) || ''

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumbs items={breadcrumbs} className="mb-4" />
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{t(`navigation.categories.${category}`) || category} {t('navigation.breadcrumb.calculators')}
				</h1>
				{categoryDescription && (
					<p className="text-lg text-gray-600 mb-4">{categoryDescription}</p>
				)}
				<p className="text-gray-600 mb-8">
					{calculators.length} {t('common.label.results').toLowerCase()}
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{calculators.map((calc) => (
						<CalculatorCard
							key={calc.id}
							calculator={calc}
							locale={locale}
							hasStandard={calc.standardIds && calc.standardIds.length > 0}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

