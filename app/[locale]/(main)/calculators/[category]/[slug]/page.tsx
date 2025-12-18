import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getCalculatorBySlug } from '@/lib/calculators/loader'
import { calculatorRegistry } from '@/lib/registry/loader'
import { CalculatorPage } from '@/components/calculator-page'
import { CalculatorSchema } from '@/components/schema/calculator-schema'
import { toClientDefinition } from '@/lib/calculators/client'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getCalculatorBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { CalculatorNavigation } from '@/components/navigation/calculator-navigation'
import { getCalculatorsByCategoryWithPopularity } from '@/lib/navigation/structure'

// Declare required namespaces for this page
const namespaces = ['common', 'errors', 'navigation'] as const

interface CalculatorRoutePageProps {
	params: {
		locale: Locale
		category: string
		slug: string
	}
}

export async function generateMetadata({
	params,
}: CalculatorRoutePageProps): Promise<Metadata> {
	const { locale, category, slug } = params

	const calculator = await getCalculatorBySlug(category, slug, locale)

	if (!calculator) {
		return {
			title: 'Calculator Not Found',
		}
	}

	const keywords = calculator.meta?.keywords || []
	const keywordsString = keywords.join(', ')

	return {
		title: `${calculator.title} - Calculator Portal`,
		description: calculator.longDescription || calculator.shortDescription,
		keywords: keywordsString,
		alternates: {
			languages: {
				en: `/en/calculators/${category}/${slug}`,
				ru: `/ru/calculators/${category}/${slug}`,
				es: `/es/calculators/${category}/${slug}`,
				tr: `/tr/calculators/${category}/${slug}`,
				hi: `/hi/calculators/${category}/${slug}`,
			},
			canonical: `/${locale}/calculators/${category}/${slug}`,
		},
		openGraph: {
			title: calculator.title,
			description: calculator.longDescription || calculator.shortDescription,
			type: 'website',
			locale: locale,
		},
	}
}

export default async function CalculatorRoutePage({
	params,
}: CalculatorRoutePageProps) {
	const { locale, category, slug } = params

	// Validate locale
	if (!locales.includes(locale)) {
		notFound()
	}

	// Get calculator definition
	const calculator = await calculatorRegistry.getBySlug(category, slug, locale)

	if (!calculator) {
		notFound()
	}

	const canonicalUrl = `https://first-calc.com/${locale}/calculators/${category}/${slug}`

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Convert to client-safe version (remove calculate function)
	const clientCalculator = toClientDefinition(calculator)

	// Generate breadcrumbs
	const breadcrumbs = getCalculatorBreadcrumbs(
		locale,
		category,
		slug,
		calculator.title,
		t,
	)

	// Get calculators in category for Previous/Next navigation
	const categoryCalculators = await getCalculatorsByCategoryWithPopularity(
		category,
		locale,
	)
	const currentIndex = categoryCalculators.findIndex((c) => c.id === calculator.id)
	const previousCalculator =
		currentIndex > 0
			? {
					slug: categoryCalculators[currentIndex - 1].slug,
					title: categoryCalculators[currentIndex - 1].title,
				}
			: null
	const nextCalculator =
		currentIndex < categoryCalculators.length - 1 && currentIndex >= 0
			? {
					slug: categoryCalculators[currentIndex + 1].slug,
					title: categoryCalculators[currentIndex + 1].title,
				}
			: null

	return (
		<>
			<CalculatorSchema calculator={clientCalculator} canonicalUrl={canonicalUrl} />
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<Breadcrumbs items={breadcrumbs} className="mb-4" />
					<CalculatorPage
						calculator={clientCalculator}
						locale={locale}
						calculatorId={calculator.id}
					/>
					<CalculatorNavigation
						locale={locale}
						category={category}
						previousCalculator={previousCalculator}
						nextCalculator={nextCalculator}
						t={t}
					/>
				</div>
			</div>
		</>
	)
}
