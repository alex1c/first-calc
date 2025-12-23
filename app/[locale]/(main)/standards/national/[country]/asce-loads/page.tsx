import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
	locales,
	type Locale,
	loadNamespaces,
	createT,
} from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'

interface AsceLoadsPageProps {
	params: {
		locale: Locale
		country: string
	}
}

const schemaDescription =
	'Educational overview of ASCE 7 structural load categories, why they affect foundations and slabs, and which calculators help with early estimates.'

const calculatorConfigs = [
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Estimate slab dimensions that later receive ASCE 7 load checks.',
	},
	{
		id: 'foundation-volume-calculator',
		shortTitle: 'Foundation Volume',
		description: 'Approximate footing volume once governing reactions are known.',
	},
	{
		id: 'concrete-volume-calculator',
		shortTitle: 'Concrete Volume',
		description: 'Convert load-driven sizing into ready-mix quantities.',
	},
	{
		id: 'rebar-calculator',
		shortTitle: 'Rebar Calculator',
		description: 'Estimate reinforcement weight aligned with anticipated load paths.',
	},
	{
		id: 'stair-calculator',
		shortTitle: 'Stair Calculator',
		description: 'Plan stair geometry that respects ASCE live loads while budgeting.',
	},
]

const articleSlugs = [
	'what-are-structural-loads',
	'dead-load-vs-live-load',
	'why-foundations-depend-on-loads',
]

export async function generateMetadata({
	params,
}: AsceLoadsPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'us') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'ASCE 7 Structural Loads – USA Load Concepts Explained',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/us/asce-loads',
				ru: '/ru/standards/national/us/asce-loads',
				es: '/es/standards/national/us/asce-loads',
				tr: '/tr/standards/national/us/asce-loads',
				hi: '/hi/standards/national/us/asce-loads',
			},
			canonical: `${basePath}/standards/national/us/asce-loads`,
		},
		openGraph: {
			title: 'ASCE 7 Structural Loads – USA Load Concepts Explained',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/us/asce-loads`,
			type: 'article',
		},
	}
}

export default async function AsceLoadsPage({ params }: AsceLoadsPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'us') {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		'us',
		'United States',
		t,
	)

	const calculators = (
		await Promise.all(
			calculatorConfigs.map(async (config) => {
				const calc = await calculatorRegistry.getById(config.id, locale)
				return calc
					? {
							...config,
							category: calc.category,
							slug: calc.slug,
							title: calc.title,
					  }
					: null
			}),
		)
	).filter((calc): calc is NonNullable<typeof calc> => calc !== null)

	const articles = (
		await Promise.all(
			articleSlugs.map(async (slug) => {
				const localized = await articleRegistry.getBySlug(slug, locale)
				if (localized) {
					return localized
				}
				return articleRegistry.getBySlug(slug, 'en')
			}),
		)
	).filter((article): article is NonNullable<typeof article> => article !== null)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'ASCE 7 Structural Loads – USA Load Concepts Explained',
		description: schemaDescription,
		inLanguage: locale,
		about: ['structural loads', 'ASCE 7', 'actions on structures'],
		isPartOf: {
			'@type': 'CollectionPage',
			name: 'Standards Portal – National Standards',
			url: `https://first-calc.com${localePrefix}/standards/national`,
		},
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<h1 className="text-4xl font-bold text-gray-900 mb-6">
					ASCE 7 Structural Loads – USA Load Concepts Explained
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					<p>
						ASCE 7 organizes the forces acting on buildings. Those assumptions
						determine member sizes, foundation reactions, and how slabs resist
						cracking. Getting the load story right is the first step before any
						reinforcement or detailing discussion.
					</p>
					<p>
						This page highlights each major load type, shows why combinations
						are important, and connects the concepts to calculators you can use
						for early planning.
					</p>
				</div>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What ASCE 7 Covers
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Dead loads
							</h3>
							<p className="text-gray-700">
								Permanent weights from concrete, finishes, and fixed mechanical
								systems. These loads rarely change, so they anchor every load
								combination.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Live loads
							</h3>
							<p className="text-gray-700">
								Occupancy-driven forces from people, furniture, vehicles, or
								stored materials. ASCE 7 supplies default values based on use
								(e.g., residential vs. storage).
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Snow loads
							</h3>
							<p className="text-gray-700">
								Location-specific roof loads that account for accumulation,
								drifting, and sliding. They directly influence roof framing and
								foundation reactions.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Wind loads
							</h3>
							<p className="text-gray-700">
								Pressure and suction on walls and roofs. ASCE 7 explains how
								building shape, exposure category, and height change the design
								wind effect.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Load combinations
							</h3>
							<p className="text-gray-700">
								For safety, ASCE 7 requires designers to consider multiple loads
								acting together. Dead load + live load, dead load + snow, or
								other combinations establish the governing case.
							</p>
						</div>
					</div>
					<p className="text-gray-600 mt-4">
						In European standards, related load concepts appear in{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/EU/eurocode-1`}
						>
							Eurocode 1
						</Link>
						, offering another reference for international teams.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Why Loads Matter for Foundations and Slabs
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						<p>
							Loads translate directly into soil bearing pressure. Higher
							reactions require larger footing areas to stay within soil limits.
						</p>
						<p>
							Slab thickness and reinforcement layouts depend on how ASCE 7 live
							load categories and environmental loads distribute across the
							floor plate.
						</p>
						<p>
							Load combinations also influence crack control and serviceability,
							so even preliminary takeoffs should document the assumed load
							category.
						</p>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Related Calculators
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">
							Calculators are loading. Refresh if this notice persists.
						</p>
					) : (
						<ul className="space-y-4">
							{calculators.map((calc) => (
								<li
									key={calc.id}
									className="bg-white border border-gray-200 rounded-lg p-4"
								>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
										<div>
											<h3 className="text-lg font-semibold text-gray-900">
												{calc.shortTitle || calc.title}
											</h3>
											<p className="text-gray-600 text-sm">
												{
													calculatorConfigs.find(
														(config) => config.id === calc.id,
													)?.description
												}
											</p>
										</div>
										<Link
											className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
											href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
										>
											Open calculator
										</Link>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Related Learn Articles
					</h2>
					{articles.length === 0 ? (
						<p className="text-gray-600">
							We are preparing supporting articles. Please check again soon.
						</p>
					) : (
						<ul className="space-y-4">
							{articles.map((article) => (
								<li
									key={article.id}
									className="bg-white border border-gray-200 rounded-lg p-4"
								>
									<h3 className="text-lg font-semibold text-gray-900 mb-1">
										{article.title}
									</h3>
									{article.shortDescription && (
										<p className="text-gray-600 text-sm mb-2">
											{article.shortDescription}
										</p>
									)}
									<Link
										className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
										href={`/${locale}/learn/${article.slug}`}
									>
										Read article
									</Link>
								</li>
							))}
						</ul>
					)}
				</section>

				<div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-red-900 mb-3">
						⚠️ Strong disclaimer
					</h2>
					<ul className="space-y-2 text-red-800">
						<li>
							<strong>
								This hub is for education only and does not replace ASCE 7 code
								compliance.
							</strong>
						</li>
						<li>
							<strong>
								Structural load calculations must be performed and sealed by
								licensed professionals.
							</strong>
						</li>
						<li>
							<strong>
								Always follow local code amendments, building department
								requirements, and engineering judgment.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}

