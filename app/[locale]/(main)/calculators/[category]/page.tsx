import { notFound } from 'next/navigation'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'
import { getCalculatorsByCategoryWithPopularity } from '@/lib/navigation/structure'
import Link from 'next/link'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getCalculatorCategoryBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { CalculatorCard } from '@/components/calculators/calculator-card'
import { MathClustersBlock } from '@/components/calculators/math-clusters-block'
import { FinanceClustersBlock } from '@/components/calculators/finance-clusters-block'
import { AutoClustersBlock } from '@/components/calculators/auto-clusters-block'
import { HealthClustersBlock } from '@/components/calculators/health-clusters-block'
import { EverydayClustersBlock } from '@/components/calculators/everyday-clusters-block'
import { ConstructionClustersBlock } from '@/components/calculators/construction-clusters-block'
import { compatibilityClusters } from '@/lib/navigation/compatibility-clusters'

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

	const isCompatibilityCategory = category === 'compatibility'

	const calculatorsMap = new Map(calculators.map((calc) => [calc.id, calc]))

	const compatibilityClusterData = isCompatibilityCategory
		? Object.entries(compatibilityClusters).map(([clusterKey, config]) => ({
				key: clusterKey,
				icon: config.icon,
				calculators: config.calculatorIds
					.map((id) => calculatorsMap.get(id))
					.filter((calc): calc is NonNullable<typeof calc> => !!calc),
		  }))
		: []

	const compatibilityPopularCalculators = isCompatibilityCategory
		? [
				...['birth-date-compatibility']
					.map((id) => calculatorsMap.get(id))
					.filter((calc): calc is NonNullable<typeof calc> => !!calc),
				...calculators.filter((calc) => calc.id !== 'birth-date-compatibility'),
		  ].slice(0, Math.min(5, calculators.length))
		: []

	const compatibilityTryAlsoCalculators = isCompatibilityCategory
		? ['zodiac-compatibility', 'numerology-compatibility', 'work-compatibility']
				.map((id) => calculatorsMap.get(id))
				.filter((calc): calc is NonNullable<typeof calc> => !!calc)
		: []

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Generate breadcrumbs
	const breadcrumbs = getCalculatorCategoryBreadcrumbs(locale, category, t)

	// Get category description
	const categoryDescription = t(`navigation.categoryDescriptions.${category}`) || ''

	return (
		<>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				{category === 'auto' ? (
					<>
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Car Calculators – Cost, Fuel, Buying & Ownership
						</h1>
						<p className="text-lg text-gray-600 mb-8">
							Comprehensive calculators for all your car-related financial decisions. Calculate ownership costs, fuel expenses, loan payments, and more.
						</p>
					</>
				) : category === 'health' ? (
					<>
						<div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 md:p-8 lg:p-10 mb-8 border border-green-100">
							<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
								<div className="flex-1">
									<h1 className="text-4xl font-bold text-gray-900 mb-4">
										Health Calculators – Body, Nutrition, Fitness & Lifestyle
									</h1>
									<p className="text-lg text-gray-600 leading-relaxed">
										Calculate and understand your body metrics, nutrition needs, fitness goals, and lifestyle health. Track BMI, calories, macronutrients, heart rate zones, and more.
									</p>
								</div>
								{/* Health icon illustration */}
								<div className="flex-shrink-0 hidden md:block">
									<div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-200">
										<svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</>
				) : category === 'everyday' ? (
					<>
						<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 md:p-8 lg:p-10 mb-8 border border-blue-100">
							<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
								<div className="flex-1">
									<h1 className="text-4xl font-bold text-gray-900 mb-4">
										Everyday Calculators – Time, Numbers & Home Tools
									</h1>
									<p className="text-lg text-gray-600 leading-relaxed">
										Simple, useful calculators for everyday tasks. Calculate age and dates, convert numbers, measure rooms, estimate paint needs, and more.
									</p>
								</div>
								{/* Everyday icon illustration */}
								<div className="flex-shrink-0 hidden md:block">
									<div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200">
										<svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</>
				) : category === 'construction' ? (
					<>
						<div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-6 md:p-8 lg:p-10 mb-8 border border-orange-100">
							<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
								<div className="flex-1">
									<h1 className="text-4xl font-bold text-gray-900 mb-4">
										Construction Calculators – Materials, Foundations, Engineering & Finishing
									</h1>
									<p className="text-lg text-gray-600 leading-relaxed">
										Practical construction calculators for estimating materials, foundations, and finishing work. These tools help with planning and budgeting, providing useful estimates for your construction projects. No building standards are applied yet—these are planning tools.
									</p>
								</div>
								{/* Construction icon illustration */}
								<div className="flex-shrink-0 hidden md:block">
									<div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
										<svg className="w-20 h-20 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</>
				) : category === 'compatibility' ? (
					<>
						<div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 md:p-8 lg:p-10 mb-8 border border-purple-100">
							<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
								<div className="flex-1">
									<h1 className="text-4xl font-bold text-gray-900 mb-4">
										{t('calculators/ui.compatibility.title')}
									</h1>
									<p className="text-lg text-gray-700 leading-relaxed">
										{t('calculators/ui.compatibility.subtitle')}
									</p>
								</div>
								<div className="flex-shrink-0 hidden md:block">
									<div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200">
										<span className="text-4xl">💞</span>
									</div>
								</div>
							</div>
						</div>

						{compatibilityClusterData.length > 0 && (
							<section className="mb-10">
								<h2 className="text-2xl font-semibold text-gray-900 mb-2">
									{t('calculators/ui.compatibility.clustersTitle')}
								</h2>
								<p className="text-gray-600 mb-6">
									{t('calculators/ui.compatibility.clustersDescription')}
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{compatibilityClusterData.map(({ key, icon, calculators }) => (
										<div
											key={key}
											className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
										>
											<div className="flex items-start gap-4 mb-4">
												<div className="text-4xl">{icon}</div>
												<div className="flex-1">
													<h3 className="text-xl font-semibold text-gray-900 mb-2">
														{t(`calculators/ui.compatibility.clusters.${key}.title`)}
													</h3>
													<p className="text-sm text-gray-600">
														{t(`calculators/ui.compatibility.clusters.${key}.description`)}
													</p>
												</div>
											</div>
											{calculators.length > 0 && (
												<ul className="space-y-2">
													{calculators.map((calc) => (
														<li key={calc.id}>
															<Link
																href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
																className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm flex items-center gap-2"
															>
																<span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
																{calc.title}
															</Link>
														</li>
													))}
												</ul>
											)}
										</div>
									))}
								</div>
							</section>
						)}

						{compatibilityPopularCalculators.length > 0 && (
							<section className="mb-10">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('calculators/ui.compatibility.popularTitle')}
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
									{compatibilityPopularCalculators.map((calc) => (
										<CalculatorCard
											key={calc.id}
											calculator={calc}
											locale={locale}
											hasStandard={calc.standardIds && calc.standardIds.length > 0}
										/>
									))}
								</div>
							</section>
						)}

						{compatibilityTryAlsoCalculators.length > 0 && (
							<section className="mb-10">
								<div className="bg-white border border-purple-200 rounded-lg p-5 shadow-sm">
									<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-xl font-semibold text-gray-900">
												{t('calculators/ui.compatibility.tryAlsoTitle')}
											</h3>
											<p className="text-sm text-gray-600">
												{t('calculators/ui.compatibility.tryAlsoDescription')}
											</p>
										</div>
										<div className="flex flex-wrap gap-3">
											{compatibilityTryAlsoCalculators.map((calc) => (
												<Link
													key={calc.id}
													href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
													className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-purple-200 bg-purple-50 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
												>
													<span className="w-2 h-2 rounded-full bg-purple-400" />
													{calc.title}
												</Link>
											))}
										</div>
									</div>
								</div>
							</section>
						)}

						<div className="bg-white border border-purple-200 rounded-lg p-4 mb-10 shadow-sm">
							<p className="text-sm text-purple-900 font-medium">
								{t('calculators/ui.compatibility.disclaimer')}
							</p>
						</div>
					</>
				) : category === 'finance' ? (
					<>
						<div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl p-6 md:p-8 lg:p-10 mb-8 border border-emerald-100">
							<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
								<div className="flex-1">
									<h1 className="text-4xl font-bold text-gray-900 mb-4">
										Financial Calculators
									</h1>
									<p className="text-lg text-gray-600 leading-relaxed">
										Free financial planning and estimation tools for loans, investments, savings, and personal finance. Calculate loan payments, investment returns, savings goals, and more. Easy to use and completely free.
									</p>
								</div>
								{/* Finance icon illustration */}
								<div className="flex-shrink-0 hidden md:block">
									<div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-200">
										<svg className="w-20 h-20 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							{t(`navigation.categories.${category}`) || category} {t('navigation.breadcrumb.calculators')}
						</h1>
						{categoryDescription && (
							<p className="text-lg text-gray-600 mb-4">{categoryDescription}</p>
						)}
					</>
				)}
				<div className="flex items-center justify-between mb-8">
					<p className="text-gray-600">
						{calculators.length} {t('common.label.results').toLowerCase()}
					</p>
					{category === 'math' && (
						<Link
							href={`/${locale}/learn`}
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							Learn Math Concepts →
						</Link>
					)}
				</div>

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
				
				{/* Math clusters block - only for math category */}
				{category === 'math' && <MathClustersBlock locale={locale} />}
				
				{/* Finance clusters block - only for finance category */}
				{category === 'finance' && <FinanceClustersBlock locale={locale} />}
				
				{/* Auto clusters block - only for auto category */}
				{category === 'auto' && <AutoClustersBlock locale={locale} />}
				
				{/* Health clusters block - only for health category */}
				{category === 'health' && <HealthClustersBlock locale={locale} />}
				
				{/* Everyday clusters block - only for everyday category */}
				{category === 'everyday' && <EverydayClustersBlock locale={locale} />}
				
				{/* Construction clusters block - only for construction category */}
				{category === 'construction' && <ConstructionClustersBlock locale={locale} />}
			</PageContainer>
		</>
	)
}

