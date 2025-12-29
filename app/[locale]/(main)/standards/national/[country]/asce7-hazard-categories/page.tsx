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

interface Asce7HazardCategoriesPageProps {
	params: {
		locale: Locale
		country: string
	}
}

const calculatorConfigs = [
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Estimate foundation dimensions that account for hazard-driven loads.',
	},
	{
		id: 'foundation-volume-calculator',
		shortTitle: 'Foundation Volume',
		description: 'Convert hazard-influenced sizing into concrete quantities.',
	},
	{
		id: 'strip-foundation-calculator',
		shortTitle: 'Strip Foundation',
		description: 'Approximate footing sizes based on typical hazard assumptions.',
	},
]

const articleSlugs = [
	'what-are-structural-loads',
	'dead-load-vs-live-load',
	'why-foundations-depend-on-loads',
]

const schemaDescription =
	'Educational overview explaining how hazard categories influence early structural assumptions and estimates.'

export async function generateMetadata({
	params,
}: Asce7HazardCategoriesPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'us') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'ASCE 7 Hazard Categories – Educational Overview',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/us/asce7-hazard-categories',
				ru: '/ru/standards/national/us/asce7-hazard-categories',
				es: '/es/standards/national/us/asce7-hazard-categories',
				tr: '/tr/standards/national/us/asce7-hazard-categories',
				hi: '/hi/standards/national/us/asce7-hazard-categories',
			},
			canonical: `${basePath}/standards/national/us/asce7-hazard-categories`,
		},
		openGraph: {
			title: 'ASCE 7 Hazard Categories – Educational Overview',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/us/asce7-hazard-categories`,
			type: 'article',
		},
	}
}

export default async function Asce7HazardCategoriesPage({
	params,
}: Asce7HazardCategoriesPageProps) {
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
		headline: 'ASCE 7 Hazard Categories – Educational Overview',
		description: schemaDescription,
		inLanguage: locale,
		about: ['hazard categories', 'wind exposure', 'seismic zones', 'snow loads'],
		isPartOf: {
			'@type': 'CollectionPage',
			name: 'United States National Standards',
			url: `https://first-calc.com${localePrefix}/standards/national/us`,
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
					ASCE 7 Hazard Categories
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					<p>
						Hazard categories organize assumptions about environmental forces that
						affect buildings. They help designers and estimators understand how
						wind, seismic activity, snow, and exposure conditions influence
						structural loads and foundation requirements.
					</p>
					<p>
						This page explains these categories at a conceptual level, showing
						why location and exposure matter for early estimates, and connecting
						the concepts to calculators that help translate hazard assumptions
						into foundation dimensions and material quantities.
					</p>
					<p>
						Return to the{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/national/us`}
						>
							United States National Standards
						</Link>{' '}
						overview for related hubs.
					</p>
				</div>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What Hazard Categories Represent Conceptually
					</h2>
					<p className="text-gray-700 mb-4">
						Hazard categories group buildings and sites by the intensity of
						environmental forces they typically experience. These categories don't
						dictate exact loads, but they organize assumptions so designers start
						from consistent baseline values. For estimators, understanding
						categories helps anticipate whether foundations, walls, or roofs will
						need additional capacity.
					</p>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-blue-900 mb-2">
							Why categories matter for early estimates
						</h3>
						<p className="text-blue-900">
							If a site falls in a high wind or seismic category, foundation
							reactions will likely be larger, requiring bigger footings or
							thicker slabs. Early estimates that account for hazard categories
							help budget for these increased material quantities before detailed
							engineering begins.
						</p>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Wind Exposure Zones
					</h2>
					<p className="text-gray-700 mb-4">
						Wind exposure categories describe how open or sheltered a building
						site is, which affects wind pressure on walls and roofs. In simple
						terms:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Exposure B (Suburban)
							</h3>
							<p className="text-gray-700 text-sm">
								Buildings in areas with many nearby structures or trees that
								shelter the site. Wind effects are typically lower, so foundation
								reactions from wind are often smaller.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Exposure C (Open)
							</h3>
							<p className="text-gray-700 text-sm">
								Buildings in open terrain with few obstructions. Wind can
								accelerate more, creating higher pressures. Foundations may need
								to resist larger lateral forces.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Exposure D (Coastal)
							</h3>
							<p className="text-gray-700 text-sm">
								Buildings near large bodies of water with unobstructed wind
								paths. These sites experience the highest wind pressures,
								requiring the most robust foundations and connections.
							</p>
						</div>
					</div>
					<p className="text-gray-600 mt-4">
						For early estimates, understanding exposure helps anticipate whether
						foundation sizing will be driven by gravity loads alone or whether
						lateral forces will also influence dimensions.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Seismic Considerations
					</h2>
					<p className="text-gray-700 mb-4">
						Seismic design categories organize regions by earthquake risk. These
						categories influence how buildings must resist lateral shaking and
						affect foundation requirements:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Low seismic risk
							</h3>
							<p className="text-gray-700 text-sm">
								Regions with minimal earthquake activity. Foundations primarily
								resist gravity loads, with minimal lateral force requirements.
								Standard foundation sizing often suffices.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Moderate to high seismic risk
							</h3>
							<p className="text-gray-700 text-sm">
								Regions with significant earthquake potential. Foundations
								must resist both gravity and substantial lateral forces. This
								often requires larger foundations, additional reinforcement, and
								special connection details.
							</p>
						</div>
					</div>
					<p className="text-gray-600 mt-4">
						Early estimates in seismic regions should account for the likelihood
						that foundations will need additional capacity beyond what gravity
						loads alone would require.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Snow & Environmental Effects
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Snow load categories
							</h3>
							<p className="text-gray-700 text-sm">
								Snow loads vary by location, roof slope, and exposure. Heavy
								snow regions require stronger roof framing, which increases
								vertical loads on walls and foundations. Early estimates should
								account for these increased loads when sizing foundation elements.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Environmental exposure
							</h3>
							<p className="text-gray-700 text-sm">
								Coastal, industrial, or high-altitude sites may face additional
								environmental challenges that affect material selection and
								foundation durability, even if they don't directly change load
								magnitudes.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Why Hazard Assumptions Affect Early Estimates
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						<p>
							<strong>Foundation sizing:</strong> Higher hazard categories
							typically produce larger foundation reactions, requiring bigger
							footings or thicker slabs to maintain acceptable soil bearing
							pressures.
						</p>
						<p>
							<strong>Material quantities:</strong> Larger foundations mean more
							concrete and reinforcement. Early estimates that account for hazard
							categories help budget for these increased quantities.
						</p>
						<p>
							<strong>Connection requirements:</strong> High hazard categories
							often require more robust connections between structural elements,
							which can increase material and labor costs.
						</p>
						<p>
							<strong>Design complexity:</strong> Buildings in high hazard
							categories may require additional engineering analysis, which
							affects project timelines and costs.
						</p>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Related Calculators
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">
							Calculators are loading. Refresh if this message remains.
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
						Related Standards
					</h2>
					<div className="space-y-3">
						<Link
							href={`/${locale}/standards/national/us/asce-loads`}
							className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-1">
								ASCE 7 – Structural Loads Explained
							</h3>
							<p className="text-sm text-gray-600">
								Learn how structural loads are categorized and combined, which
								forms the basis for hazard category applications.
							</p>
						</Link>
						<Link
							href={`/${locale}/standards/national/us/ibc-load-path-essentials`}
							className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-1">
								IBC Load Path Essentials
							</h3>
							<p className="text-sm text-gray-600">
								Understand how loads travel through structures, which helps
								explain why hazard categories matter for foundation design.
							</p>
						</Link>
					</div>
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
								This page is educational and does not provide ASCE 7 code
								compliance guidance.
							</strong>
						</li>
						<li>
							<strong>
								Hazard category determination and structural design must be
								performed by licensed professionals.
							</strong>
						</li>
						<li>
							<strong>
								Always follow local building codes, engineering standards, and
								professional judgment.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}



