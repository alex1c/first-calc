import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getCalculatorBySlug } from '@/lib/calculators/loader'
import { calculatorRegistry } from '@/lib/registry/loader'
import { CalculatorPage } from '@/components/calculator-page'
import { CalculatorSchema } from '@/components/schema/calculator-schema'
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

	const keywords = calculator.meta?.keywords || []
	const keywordsString = keywords.join(', ')

	// Custom SEO title for specific calculators
	let seoTitle = `${calculator.title} - Calculator Portal`
	if (calculator.id === 'compound-interest' && calculator.locale === 'en') {
		seoTitle = 'Compound Interest Calculator – Investment Growth Over Time'
	} else if (calculator.id === 'loan-payment' && calculator.locale === 'en') {
		seoTitle = 'Loan Payment Calculator – Monthly Payment & Interest Cost'
	} else if (calculator.id === 'auto-loan-calculator' && calculator.locale === 'en') {
		seoTitle = 'Auto Loan Calculator – Car Payment, Interest & Total Cost'
	} else if (calculator.id === 'investment-calculator' && calculator.locale === 'en') {
		seoTitle = 'Investment Calculator – Estimate Investment Growth & Returns'
	} else if (calculator.id === 'loan-overpayment-calculator' && calculator.locale === 'en') {
		seoTitle = 'Loan Overpayment Calculator – See How Much Interest You Pay'
	} else if (calculator.id === 'mortgage-calculator' && calculator.locale === 'en') {
		seoTitle = 'Mortgage Calculator – Monthly Payment & Total Home Loan Cost'
	} else if (calculator.id === 'personal-loan-calculator' && calculator.locale === 'en') {
		seoTitle = 'Personal Loan Calculator – Monthly Payment & Interest Cost'
	} else if (calculator.id === 'roi-calculator' && calculator.locale === 'en') {
		seoTitle = 'ROI Calculator – Calculate Return on Investment'
	} else if (calculator.id === 'savings-calculator' && calculator.locale === 'en') {
		seoTitle = 'Savings Calculator – Plan Your Savings & Growth Over Time'
	} else if (calculator.id === 'loan-comparison-calculator' && calculator.locale === 'en') {
		seoTitle = 'Loan Comparison Calculator – Compare Payments, APR & Total Cost'
	} else if (calculator.id === 'mortgage-comparison-calculator' && calculator.locale === 'en') {
		seoTitle = 'Mortgage Comparison Calculator – Compare Payments, APR & Total Cost'
	}

	// Custom SEO description for specific calculators
	let seoDescription = calculator.longDescription || calculator.shortDescription
	if (calculator.id === 'compound-interest' && calculator.locale === 'en') {
		seoDescription = 'Calculate compound interest on investments and savings. See how your money grows with interest compounding and regular contributions.'
	} else if (calculator.id === 'loan-payment' && calculator.locale === 'en') {
		seoDescription = 'Calculate loan payments, total interest, and overpayment. Estimate monthly payments for personal loans, auto loans, and mortgages.'
	} else if (calculator.id === 'auto-loan-calculator' && calculator.locale === 'en') {
		seoDescription = 'Calculate auto loan payments with down payment, trade-in, taxes, and fees. Estimate monthly car payments and total loan cost.'
	} else if (calculator.id === 'investment-calculator' && calculator.locale === 'en') {
		seoDescription = 'Calculate investment growth with regular contributions and compound returns. Estimate profit, total contributions, and long-term value.'
	} else if (calculator.id === 'loan-overpayment-calculator' && calculator.locale === 'en') {
		seoDescription = 'Calculate loan overpayment and total interest cost. Find out how much extra you pay on a loan and how to reduce interest expenses.'
	} else if (calculator.id === 'mortgage-calculator' && calculator.locale === 'en') {
		seoTitle = 'Mortgage Calculator – Monthly Payment, Interest & Total Cost'
		seoDescription = 'Calculate your mortgage payment, total interest, and full home cost. Includes taxes, insurance, and extra payment impact.'
	} else if (calculator.id === 'personal-loan-calculator' && calculator.locale === 'en') {
		seoDescription = 'Calculate personal loan payments, interest, fees, and total repayment cost. Estimate monthly payments and overpayment.'
	} else if (calculator.id === 'roi-calculator' && calculator.locale === 'en') {
		seoDescription = 'Calculate ROI to evaluate investment and business profitability. Measure net profit, return percentage, and performance.'
	} else if (calculator.id === 'savings-calculator' && calculator.locale === 'en') {
		seoDescription = 'Calculate savings growth with regular deposits and compound interest. Plan your savings goals and see how your money grows.'
	} else if (calculator.id === 'loan-comparison-calculator' && calculator.locale === 'en') {
		seoDescription = 'Compare loan offers side-by-side. See monthly payment, total interest, fees, and total cost to choose the best loan.'
	} else if (calculator.id === 'mortgage-comparison-calculator' && calculator.locale === 'en') {
		seoDescription = 'Compare mortgage offers side-by-side. See monthly payments, total interest, taxes, insurance, and total cost to choose the best mortgage.'
	} else if (calculator.id === 'retirement-calculator' && calculator.locale === 'en') {
		seoTitle = 'Retirement Calculator – How Much Do You Need to Retire?'
		seoDescription = 'Plan your retirement savings and income. Estimate how much you will have and how much you need to retire comfortably.'
	} else if (calculator.id === 'investment-vs-savings-calculator' && calculator.locale === 'en') {
		seoTitle = 'Investment vs Savings Calculator – Compare Growth Over Time'
		seoDescription = 'Compare saving and investing to see which grows your money faster. Calculate final balance, earnings, and inflation-adjusted value.'
	} else if (calculator.id === 'take-home-pay-calculator' && calculator.locale === 'en') {
		seoTitle = 'Take-Home Pay Calculator – Net Income After Taxes'
		seoDescription = 'Estimate your take-home pay after taxes and deductions. Calculate net income from gross salary using effective tax rates.'
	} else if (calculator.id === 'emergency-fund-calculator' && calculator.locale === 'en') {
		seoTitle = 'Emergency Fund Calculator – How Much Should You Save?'
		seoDescription = 'Calculate how much emergency savings you need and how long it will take to build a financial safety net.'
	} else if (calculator.id === 'net-worth-calculator' && calculator.locale === 'en') {
		seoTitle = 'Net Worth Calculator – Calculate Assets, Liabilities & Wealth'
		seoDescription = 'Calculate your net worth by subtracting liabilities from assets. Understand your financial health and track progress.'
	}

	return {
		title: seoTitle,
		description: seoDescription,
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
