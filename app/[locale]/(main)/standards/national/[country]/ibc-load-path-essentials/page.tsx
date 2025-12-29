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

interface IbcLoadPathPageProps {
	params: {
		locale: Locale
		country: string
	}
}

const calculatorConfigs = [
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Estimate slab dimensions that form part of the vertical load path.',
	},
	{
		id: 'strip-foundation-calculator',
		shortTitle: 'Strip Foundation',
		description: 'Approximate footing sizes that transfer loads from walls to soil.',
	},
	{
		id: 'foundation-volume-calculator',
		shortTitle: 'Foundation Volume',
		description: 'Convert load-driven sizing into concrete quantities for takeoffs.',
	},
]

const articleSlugs = [
	'what-are-structural-loads',
	'dead-load-vs-live-load',
	'why-foundations-depend-on-loads',
]

const schemaDescription =
	'Educational overview explaining load paths in buildings and how they influence early structural estimates.'

export async function generateMetadata({
	params,
}: IbcLoadPathPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'us') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'IBC Load Path Essentials – Educational Overview',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/us/ibc-load-path-essentials',
				ru: '/ru/standards/national/us/ibc-load-path-essentials',
				es: '/es/standards/national/us/ibc-load-path-essentials',
				tr: '/tr/standards/national/us/ibc-load-path-essentials',
				hi: '/hi/standards/national/us/ibc-load-path-essentials',
			},
			canonical: `${basePath}/standards/national/us/ibc-load-path-essentials`,
		},
		openGraph: {
			title: 'IBC Load Path Essentials – Educational Overview',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/us/ibc-load-path-essentials`,
			type: 'article',
		},
	}
}

export default async function IbcLoadPathPage({ params }: IbcLoadPathPageProps) {
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
		headline: 'IBC Load Path Essentials – Educational Overview',
		description: schemaDescription,
		inLanguage: locale,
		about: ['load paths', 'structural continuity', 'IBC concepts'],
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
					IBC Load Path Essentials
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					<p>
						The concept of a complete load path describes how forces travel from
						where they originate—roof, floors, walls—down through the structure
						to the foundation and finally into the soil. Understanding this flow
						helps estimators and builders visualize why certain connections and
						continuity matter, even before detailed engineering begins.
					</p>
					<p>
						This page explains load paths in simple terms, shows why continuity
						matters for early estimates, and connects the concepts to calculators
						that help translate loads into foundation dimensions and material
						quantities.
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
						What a Load Path Means in Simple Terms
					</h2>
					<p className="text-gray-700 mb-4">
						A load path is the route forces follow from their source to the
						ground. Think of it like water flowing through pipes: if any section
						is missing or too weak, the system fails. In buildings, loads start
						at the top (roof, upper floors) and must reach the foundation
						without interruption.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Vertical load paths
							</h3>
							<p className="text-gray-700 text-sm">
								Gravity loads flow downward: roof → upper floors → lower floors
								→ walls/columns → foundations → soil. Each element must be
								capable of carrying the accumulated weight from above.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Lateral load paths
							</h3>
							<p className="text-gray-700 text-sm">
								Wind and seismic forces push sideways. They travel: exterior
								walls → floor diaphragms → shear walls/braced frames →
								foundations. Continuity ensures these forces don't create
								unexpected stress concentrations.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Vertical vs Lateral Load Paths
					</h2>
					<div className="space-y-4">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-2">
								Vertical paths (gravity)
							</h3>
							<p className="text-blue-900 mb-3">
								These are the most intuitive: everything above pushes down on
								everything below. A typical residential building might have:
							</p>
							<ul className="list-disc list-inside text-blue-900 space-y-1">
								<li>Roof loads → roof framing → bearing walls</li>
								<li>Second floor loads → floor joists → first floor walls</li>
								<li>First floor loads → foundation walls → footings</li>
								<li>Footings → soil bearing pressure</li>
							</ul>
							<p className="text-blue-900 mt-3">
								Early estimates can approximate these loads and size foundations
								accordingly, but final design requires verifying each connection
								and ensuring no gaps exist.
							</p>
						</div>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-yellow-900 mb-2">
								Lateral paths (wind/seismic)
							</h3>
							<p className="text-yellow-900 mb-3">
								These are less obvious but equally important. Lateral forces
								need a complete path from where they hit the building to where
								they exit into the foundation:
							</p>
							<ul className="list-disc list-inside text-yellow-900 space-y-1">
								<li>Wind pressure on walls → floor diaphragms</li>
								<li>Diaphragms → shear walls or braced frames</li>
								<li>Shear walls → foundations with proper anchorage</li>
								<li>Foundations → soil resistance</li>
							</ul>
							<p className="text-yellow-900 mt-3">
								Conceptual understanding helps identify where additional
								reinforcement or connections might be needed, but detailed
								lateral design requires professional engineering.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Why Continuity Matters for Early Estimates
					</h2>
					<p className="text-gray-700 mb-4">
						When a load path is broken or incomplete, forces find alternative
						routes that may overload other elements. This can lead to unexpected
						foundation reactions, wall failures, or connection problems. For
						estimators, understanding load paths helps:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Identify critical connections
							</h3>
							<p className="text-gray-700 text-sm">
								Joints between floors and walls, or walls and foundations, must
								transfer loads reliably. Early estimates should note where
								additional reinforcement or connection details might be
								required.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Size foundation elements
							</h3>
							<p className="text-gray-700 text-sm">
								If you know loads accumulate from multiple floors, you can
								estimate larger footing areas or thicker slabs. Calculators
								help translate these loads into concrete volumes and
								reinforcement quantities.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Anticipate material needs
							</h3>
							<p className="text-gray-700 text-sm">
								Continuous load paths often require more reinforcement at
								connections. Understanding the path helps budget for additional
								steel, anchors, or connection hardware.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Avoid costly surprises
							</h3>
							<p className="text-gray-700 text-sm">
								Recognizing potential breaks in load paths early allows
								estimators to flag areas that need engineering review before
								construction begins.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Common Breaks in Conceptual Load Paths
					</h2>
					<p className="text-gray-700 mb-4">
						In educational terms, these are scenarios where load paths might be
						interrupted, requiring special attention during design:
					</p>
					<ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
						<li>
							<strong>Openings in load-bearing walls:</strong> Large windows or
							doors can interrupt vertical paths, requiring headers or lintels
							that transfer loads around the opening.
						</li>
						<li>
							<strong>Discontinuous floor systems:</strong> If floors don't
							connect properly to walls, lateral loads can't transfer, creating
							weak points in the structure.
						</li>
						<li>
							<strong>Foundation step-downs:</strong> Changes in foundation
							levels must maintain load continuity, often requiring additional
							reinforcement or connection details.
						</li>
						<li>
							<strong>Missing shear walls:</strong> In lateral load paths,
							buildings need continuous vertical elements (shear walls or braced
							frames) from roof to foundation. Gaps create instability.
						</li>
					</ul>
					<p className="text-gray-700">
						These concepts help estimators understand why certain details matter,
						but final resolution always requires licensed structural engineering.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What Can Be Estimated Early vs What Requires Engineering Design
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-2">
								What can be estimated early
							</h3>
							<ul className="list-disc list-inside text-blue-900 space-y-2">
								<li>
									Foundation dimensions based on typical load assumptions
								</li>
								<li>
									Concrete volumes for footings and slabs using load-driven
									sizing
								</li>
								<li>
									Preliminary reinforcement quantities for common load paths
								</li>
								<li>
									Material takeoffs that assume continuous load paths exist
								</li>
							</ul>
						</div>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-yellow-900 mb-2">
								What requires engineering design
							</h3>
							<ul className="list-disc list-inside text-yellow-900 space-y-2">
								<li>
									Verification that all load paths are actually complete and
									continuous
								</li>
								<li>
									Connection details that ensure loads transfer reliably at
									every joint
								</li>
								<li>
									Lateral force-resisting system design and detailing
								</li>
								<li>
									Foundation design that accounts for actual soil conditions
									and code requirements
								</li>
								<li>
									Load combinations and safety factors required by building
									codes
								</li>
							</ul>
						</div>
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
								forms the basis for load path calculations.
							</p>
						</Link>
						<Link
							href={`/${locale}/standards/national/us/aci-concrete`}
							className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-1">
								ACI Concrete Principles
							</h3>
							<p className="text-sm text-gray-600">
								Understand concrete material properties and reinforcement
								concepts that support load path continuity.
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
								This page is educational and does not provide IBC compliance
								guidance.
							</strong>
						</li>
						<li>
							<strong>
								Load path verification and structural design must be performed
								by licensed structural engineers.
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



