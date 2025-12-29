import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getCalculatorBySlug } from '@/lib/calculators/loader'
import { calculatorRegistry } from '@/lib/registry/loader'
import { CalculatorPage } from '@/components/calculator-page'
import { CalculatorSchema } from '@/components/schema/calculator-schema'
import { FaqSchema } from '@/components/schema/faq-schema'
import { toClientDefinition } from '@/lib/calculators/client'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getCalculatorBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { CalculatorNavigation } from '@/components/navigation/calculator-navigation'
import { getCalculatorsByCategoryWithPopularity } from '@/lib/navigation/structure'
import { RelatedCalculatorsWrapper } from '@/components/calculators/related-calculators-wrapper'
import { RelatedArticlesBlock } from '@/components/calculators/related-articles-block'
import { EngineeringContextBlock } from '@/components/calculators/engineering-context-block'

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

	// Load content to get SEO fields
	const { loadCalculatorContent } = await import('@/lib/i18n/loadItemContent')
	const { content } = await loadCalculatorContent(locale, slug)

	// Use SEO fields from content file if available, otherwise fallback to calculator fields
	const seoTitle =
		content?.seo?.title ||
		calculator.seo?.title ||
		calculator.title ||
		'Calculator'
	const seoDescription =
		content?.seo?.description ||
		calculator.seo?.description ||
		calculator.longDescription ||
		calculator.shortDescription ||
		''

	// Ensure description is not empty
	if (!seoDescription) {
		console.warn(
			`[SEO] Empty description for calculator "${calculator.id}" (locale: ${locale})`,
		)
	}

	const keywords = content?.seo?.keywords || calculator.meta?.keywords || []
	const keywordsString = keywords.join(', ')

	// Build canonical URL - EN locale should not have /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`
	const canonicalPath = `${basePath}/calculators/${category}/${slug}`

	// Build alternates with proper EN path (no /en prefix)
	const baseUrl = 'https://first-calc.com'
	const alternates: Record<string, string> = {}
	for (const loc of locales) {
		const locPath = loc === 'en' ? '' : `/${loc}`
		alternates[loc] = `${baseUrl}${locPath}/calculators/${category}/${slug}`
	}

	return {
		title: seoTitle,
		description: seoDescription,
		keywords: keywordsString,
		alternates: {
			languages: alternates,
			canonical: `${baseUrl}${canonicalPath}`,
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

	// Build canonical URL - EN locale should not have /en prefix
	const basePath = locale === 'en' ? '' : `/${locale}`
	const canonicalUrl = `https://first-calc.com${basePath}/calculators/${category}/${slug}`

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
		t,
		calculator.title,
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
			{clientCalculator.faq && clientCalculator.faq.length > 0 && (
				<FaqSchema faq={clientCalculator.faq} canonicalUrl={canonicalUrl} />
			)}
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				{/* Content language badge */}
				{calculator.contentLocale !== locale && (
					<div className="mb-4">
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
							{t('common.label.contentInEnglish')}
						</span>
					</div>
				)}
				{/* Migration warning for disabled calculators */}
				{calculator.isEnabled === false && (
					<div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-yellow-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-yellow-800">
									This calculator is being migrated
								</h3>
								<div className="mt-2 text-sm text-yellow-700">
									<p>
										This calculator is temporarily unavailable while we migrate it to the new system.
										Please check back soon.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
				<CalculatorPage
					calculator={clientCalculator}
					locale={locale}
					calculatorId={calculator.id}
				/>
				{/* Engineering Context Block - Standards link (after Results, before Examples) */}
				<EngineeringContextBlock calculatorId={calculator.id} locale={locale} />
				{/* Related Calculators - Server Component */}
				<div className="mb-8">
					<RelatedCalculatorsWrapper calculator={clientCalculator} locale={locale} />
				</div>
				{/* Related Articles - Server Component */}
				<RelatedArticlesBlock calculatorId={calculator.id} locale={locale} />
				<CalculatorNavigation
					locale={locale}
					category={category}
					previousCalculator={previousCalculator}
					nextCalculator={nextCalculator}
					t={t}
				/>
			</PageContainer>
		</>
	)
}
