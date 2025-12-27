import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getStandardsByLocale, getStandardsByCountry } from '@/data/standards'
import { getNationalLandingList } from '@/data/national-standards'
import { standardRegistry, calculatorRegistry, articleRegistry } from '@/lib/registry/loader'
import { getCalculatorsByStandard } from '@/lib/standards/linking'
import { getArticlesByStandard } from '@/lib/standards/articles'
import Link from 'next/link'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

const namespaces = ['common', 'navigation'] as const

export async function generateMetadata({
	params,
}: {
	params: { locale: Locale }
}): Promise<Metadata> {
	const { locale } = params
	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'Engineering Standards Explained – How Calculations Relate to Standards',
		description:
			'Learn how engineering standards relate to construction and calculation tools. Understand Eurocode, ISO, and other standards that define engineering principles used in calculators.',
		keywords: [
			'engineering standards',
			'eurocode',
			'iso standards',
			'construction standards',
			'calculation principles',
			'structural engineering',
		].join(', '),
		alternates: {
			languages: {
				en: '/standards',
				ru: '/ru/standards',
				es: '/es/standards',
				tr: '/tr/standards',
				hi: '/hi/standards',
			},
			canonical: `${basePath}/standards`,
		},
	}
}

export default async function StandardsPage({ params }: { params: { locale: Locale } }) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	const standards = getStandardsByLocale(locale)
	const nationalEntries = getNationalLandingList(locale)

	// Get standards by type
	const eurocodeStandards = getStandardsByCountry('EU', locale)
	const isoStandards = getStandardsByCountry('ISO', locale)

	// Get related calculators (construction calculators that reference standards)
	const allConstructionCalculators = await calculatorRegistry.getByCategory('construction', locale)
	const standardsWithCalculators = await Promise.all(
		standards.map(async (std) => {
			const relatedCalcs = await getCalculatorsByStandard(std.id, locale)
			return { standard: std, calculators: relatedCalcs }
		}),
	)

	// Get featured calculators (foundation, concrete, reinforcement)
	const featuredCalculatorIds = [
		'foundation-volume-calculator',
		'slab-foundation-calculator',
		'strip-foundation-calculator',
		'concrete-volume-calculator',
		'cement-calculator',
		'rebar-calculator',
	]
	const featuredCalculators = await Promise.all(
		featuredCalculatorIds.map((id) => calculatorRegistry.getById(id, locale)),
	)
	const validFeaturedCalculators = featuredCalculators.filter(
		(calc): calc is NonNullable<typeof calc> => calc !== null && calc !== undefined,
	)

	// Get related Learn articles
	const allArticles = await articleRegistry.getAll(locale)
	const standardsArticles = allArticles.filter(
		(article) => article.relatedStandardIds && article.relatedStandardIds.length > 0,
	)

	// Generate breadcrumbs
	const breadcrumbs = getStandardsBreadcrumbs(locale, t)

	// Schema for CollectionPage
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Engineering Standards & Calculation Principles',
		description:
			'Learn how engineering standards relate to construction and calculation tools',
		url: `https://first-calc.com/${locale === 'en' ? '' : locale + '/'}standards`,
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				{/* Header */}
				<div className="mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Engineering Standards & Calculation Principles
					</h1>
					<div className="prose prose-lg max-w-none text-gray-600">
						<p className="text-lg leading-relaxed mb-4">
							Engineering standards describe fundamental principles and assumptions used in
							construction and structural design. These standards define concepts like structural
							loads, material properties, and soil behavior.
						</p>
						<p className="text-lg leading-relaxed mb-4">
							Our calculators help estimate quantities and dimensions using simplified logic based
							on these engineering principles. This section explains how standards relate to
							calculation tools and provides educational context for understanding construction
							calculations.
						</p>
						<p className="text-lg leading-relaxed">
							<strong>Important:</strong> Calculators provide estimation only. Final design always
							requires professional engineering and compliance with local building codes.
						</p>
					</div>
				</div>

				{/* Section: National Standards */}
				{nationalEntries.length > 0 && (
					<div className="mb-12">
						<h2 className="text-3xl font-semibold text-gray-900 mb-6">
							National Standards
						</h2>
						<p className="text-gray-600 mb-6">
							Country hubs that outline how national reference documents fit
							into the broader standards library. Educational navigation only,
							with detailed pages to follow.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{nationalEntries.map((entry) => (
								<Link
									key={entry.id}
									href={`/${locale}/standards/national/${entry.slug}`}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
								>
									<p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
										National landing
									</p>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										{entry.countryName}
									</h3>
									<p className="text-gray-600 text-sm">{entry.intro[0]}</p>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Section 1: Standards by Type */}
				<div className="mb-12">
					<h2 className="text-3xl font-semibold text-gray-900 mb-6">
						Standards by Type
					</h2>

					{/* Eurocodes */}
					{eurocodeStandards.length > 0 && (
						<div className="mb-8">
							<h3 className="text-2xl font-semibold text-gray-800 mb-4">Eurocodes</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{eurocodeStandards.map((std) => (
									<Link
										key={std.id}
										href={`/${locale}/standards/${std.country}/${std.slug}`}
										className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
									>
										<h4 className="text-xl font-semibold text-gray-900 mb-2">
											{std.title}
										</h4>
										<p className="text-gray-600 text-sm mb-3">{std.shortDescription}</p>
										{std.meta?.organization && (
											<p className="text-xs text-gray-500">
												{std.meta.organization}
												{std.meta.year && ` • ${std.meta.year}`}
											</p>
										)}
									</Link>
								))}
							</div>
						</div>
					)}

					{/* ISO Standards */}
					{isoStandards.length > 0 && (
						<div className="mb-8">
							<h3 className="text-2xl font-semibold text-gray-800 mb-4">
								ISO Standards
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{isoStandards.map((std) => (
									<Link
										key={std.id}
										href={`/${locale}/standards/${std.country}/${std.slug}`}
										className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
									>
										<h4 className="text-xl font-semibold text-gray-900 mb-2">
											{std.title}
										</h4>
										<p className="text-gray-600 text-sm mb-3">{std.shortDescription}</p>
										{std.meta?.organization && (
											<p className="text-xs text-gray-500">
												{std.meta.organization}
												{std.meta.year && ` • ${std.meta.year}`}
											</p>
										)}
									</Link>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Section 2: How Standards Relate to Calculators */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8 mb-12">
					<h2 className="text-3xl font-semibold text-gray-900 mb-6">
						How Standards Relate to Calculators
					</h2>
					<div className="prose prose-lg max-w-none text-gray-700 space-y-4">
						<p>
							<strong>Standards define concepts and assumptions:</strong> Engineering standards
							like Eurocode and ISO describe fundamental principles—how loads are classified, how
							soil properties are determined, how materials behave under stress. These are
							conceptual frameworks that guide professional design.
						</p>
						<p>
							<strong>Calculators implement simplified estimation logic:</strong> Our calculators
							use simplified formulas and assumptions based on common engineering principles. They
							help estimate quantities (concrete volume, reinforcement weight) and dimensions
							(foundation size, slab thickness) for preliminary planning.
						</p>
						<p>
							<strong>Final design always requires professionals:</strong> While calculators can
							help with early-stage estimation, final structural design must be performed by
							qualified engineers who consider all factors, verify assumptions, and ensure
							compliance with local building codes and regulations.
						</p>
					</div>
				</div>

				{/* Section 3: Related Calculators */}
				{validFeaturedCalculators.length > 0 && (
					<div className="mb-12">
						<h2 className="text-3xl font-semibold text-gray-900 mb-6">
							Related Calculators
						</h2>
						<p className="text-gray-600 mb-6">
							Construction calculators that reference engineering standards:
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{validFeaturedCalculators.map((calc) => (
								<Link
									key={calc.id}
									href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
								>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{calc.title}
									</h3>
									<p className="text-gray-600 text-sm">{calc.shortDescription}</p>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Section 4: Learn More */}
				{standardsArticles.length > 0 && (
					<div className="mb-12">
						<h2 className="text-3xl font-semibold text-gray-900 mb-6">Learn More</h2>
						<p className="text-gray-600 mb-6">
							Educational articles explaining engineering concepts related to standards:
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{standardsArticles.map((article) => (
								<Link
									key={article.id}
									href={`/${locale}/learn/${article.slug}`}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
								>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{article.title}
									</h3>
									{article.shortDescription && (
										<p className="text-gray-600 text-sm">{article.shortDescription}</p>
									)}
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Disclaimer */}
				<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 md:p-8 mb-8">
					<h2 className="text-xl font-semibold text-yellow-900 mb-4">
						⚠️ Important Disclaimer
					</h2>
					<ul className="space-y-2 text-yellow-800">
						<li>
							<strong>This section is for educational and estimation purposes only.</strong>
						</li>
						<li>
							<strong>
								It is not a substitute for professional engineering design or local building
								codes.
							</strong>
						</li>
						<li>
							<strong>
								Calculators provide simplified estimates based on common engineering principles.
							</strong>
						</li>
						<li>
							<strong>
								Final structural design must be performed by qualified engineers and comply with
								local regulations.
							</strong>
						</li>
						<li>
							<strong>
								Always consult qualified professionals for actual construction projects.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}
