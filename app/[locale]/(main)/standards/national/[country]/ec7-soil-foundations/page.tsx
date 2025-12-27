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

interface Ec7SoilFoundationsPageProps {
	params: {
		locale: Locale
		country: string
	}
}

const calculatorConfigs = [
	{
		id: 'strip-foundation-calculator',
		shortTitle: 'Strip Foundation',
		description: 'Estimate footing width and depth based on typical soil assumptions.',
	},
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Approximate slab thickness and reinforcement for early estimates.',
	},
	{
		id: 'pile-foundation-calculator',
		shortTitle: 'Pile Foundation',
		description: 'Estimate pile quantities and lengths based on conceptual soil capacity.',
	},
]

const articleSlugs = [
	'why-soil-investigation-matters',
	'foundation-types-explained',
]

const schemaDescription =
	'Educational overview of Eurocode 7 geotechnical principles, soil properties, and foundation design assumptions.'

export async function generateMetadata({
	params,
}: Ec7SoilFoundationsPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'eu') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'Eurocode Soil & Foundations (EC7) – Educational Overview',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/eu/ec7-soil-foundations',
				ru: '/ru/standards/national/eu/ec7-soil-foundations',
				es: '/es/standards/national/eu/ec7-soil-foundations',
				tr: '/tr/standards/national/eu/ec7-soil-foundations',
				hi: '/hi/standards/national/eu/ec7-soil-foundations',
			},
			canonical: `${basePath}/standards/national/eu/ec7-soil-foundations`,
		},
		openGraph: {
			title: 'Eurocode Soil & Foundations (EC7) – Educational Overview',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/eu/ec7-soil-foundations`,
			type: 'article',
		},
	}
}

export default async function Ec7SoilFoundationsPage({
	params,
}: Ec7SoilFoundationsPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'eu') {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		'eu',
		'European Union',
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
		headline: 'Eurocode Soil & Foundations (EC7) – Educational Overview',
		description: schemaDescription,
		inLanguage: locale,
		about: ['Eurocode 7', 'geotechnical engineering', 'foundations', 'soil mechanics'],
		isPartOf: {
			'@type': 'CollectionPage',
			name: 'European Union National Standards',
			url: `https://first-calc.com${localePrefix}/standards/national/eu`,
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
					Eurocode Soil & Foundations (EC7)
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-8">
					<p>
						Eurocode 7 (EN 1997) provides a framework for understanding geotechnical
						principles and foundation design across European building practice. This
						page explains how soil properties influence foundation selection and
						sizing in an educational context.
					</p>
					<p>
						Return to the{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/national/eu`}
						>
							European Union National Standards
						</Link>{' '}
						overview.
					</p>
				</div>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What Eurocode 7 Covers Conceptually
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Soil Types and Classification
							</h3>
							<p className="text-gray-700 text-sm">
								Commonly discussed soil categories include sand, clay, gravel, and
								rock. Each behaves differently under load: sand drains well but can
								shift, clay holds water and can expand or contract, gravel is strong
								and stable, and rock provides the strongest foundation.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Bearing Capacity Concepts
							</h3>
							<p className="text-gray-700 text-sm">
								Bearing capacity describes how much pressure the soil can resist
								before failing. Strong soils allow compact foundations; weak soils
								may require wider footings or piles to distribute loads safely.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Settlement and Deformation
							</h3>
							<p className="text-gray-700 text-sm">
								All soils compress under load—this is settlement. Some soils settle
								uniformly, others settle unevenly and can crack slabs. Understanding
								expected movement helps select appropriate foundation types.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Groundwater Considerations
							</h3>
							<p className="text-gray-700 text-sm">
								Groundwater levels affect foundation design. High water tables can
								reduce soil strength, cause buoyancy issues, or add frost-heave
								risks. Drainage and deeper foundations may be required.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Foundation Types for Early Estimates
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-blue-900 mb-4">
						<h3 className="text-lg font-semibold mb-2">Practical Takeaway</h3>
						<p>
							Shallow foundations (strip footings, pad footings, slab-on-grade) work
							well for moderate loads on stable soils. Deep foundations (piles,
							caissons) are typically considered for weak soils, high groundwater, or
							strict deformation requirements.
						</p>
					</div>
					<ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
						<li>
							<strong>Strip footings:</strong> Common for load-bearing walls, suitable
							for stable soils with moderate bearing capacity.
						</li>
						<li>
							<strong>Slab foundations:</strong> Provide uniform support, work well on
							stable soils, and can distribute loads across larger areas.
						</li>
						<li>
							<strong>Pile foundations:</strong> Transfer loads to deeper, stronger
							soil layers, used when shallow foundations are insufficient.
						</li>
					</ul>
					<p className="text-gray-700">
						These concepts help estimate concrete volumes, reinforcement quantities,
						and excavation work before detailed engineering design begins.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Why Soil Assumptions Affect Early Estimates
					</h2>
					<p className="text-gray-700 mb-4">
						Soil properties directly influence foundation sizing. Higher bearing
						capacity allows smaller footings, while weaker soils require larger
						areas or deeper foundations. Settlement expectations affect slab
						thickness and reinforcement needs.
					</p>
					<p className="text-gray-700">
						Early-stage estimation tools use typical soil assumptions to provide
						quick quantity checks. Final design must replace these assumptions with
						actual geotechnical test data from qualified engineers.
					</p>
				</section>

				{calculators.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Related Calculators
						</h2>
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
											Open calculator →
										</Link>
									</div>
								</li>
							))}
						</ul>
					</section>
				)}

				{articles.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Related Learn Articles
						</h2>
						<ul className="space-y-3">
							{articles.map((article) => (
								<li key={article.id}>
									<Link
										className="text-blue-600 hover:text-blue-800 underline"
										href={`/${locale}/learn/${article.slug}`}
									>
										{article.title}
									</Link>
									{article.shortDescription && (
										<p className="text-gray-600 text-sm mt-1">
											{article.shortDescription}
										</p>
									)}
								</li>
							))}
						</ul>
					</section>
				)}

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Related Standards
					</h2>
					<ul className="space-y-3">
						<li>
							<Link
								className="text-blue-600 hover:text-blue-800 underline"
								href={`/${locale}/standards/national/eu/ec1-load-concepts`}
							>
								Eurocode Load Concepts (EC1)
							</Link>
						</li>
						<li>
							<Link
								className="text-blue-600 hover:text-blue-800 underline"
								href={`/${locale}/standards/national/eu/ec2-concrete-principles`}
							>
								Eurocode Concrete Principles (EC2)
							</Link>
						</li>
					</ul>
				</section>

				{/* Mandatory disclaimer */}
				<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 md:p-8">
					<h2 className="text-xl font-semibold text-yellow-900 mb-3">
						⚠️ Educational Disclaimer
					</h2>
					<p className="text-yellow-800 mb-2">
						<strong>Educational overview only.</strong> This content does not imply
						compliance with any building code or standard.
					</p>
					<p className="text-yellow-800">
						Soil properties cannot be assumed without proper geotechnical testing.
						Always consult qualified geotechnical engineers and use current
						regulations before finalizing foundation design. This content is not a
						substitute for professional engineering services.
					</p>
				</div>
			</PageContainer>
		</>
	)
}


