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
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

const calculatorConfigs = [
	{
		id: 'concrete-volume-calculator',
		shortTitle: 'Concrete Volume',
		description: 'Translate DIN-driven dimensions into cubic meters of ready-mix.',
	},
	{
		id: 'concrete-mix-ratio-calculator',
		shortTitle: 'Concrete Mix Ratio',
		description: 'Balance mix proportions while considering DIN material requirements.',
	},
	{
		id: 'strip-foundation-calculator',
		shortTitle: 'Strip Foundation',
		description: 'Outline wall footing sizes that later accept DIN detailing.',
	},
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Estimate slab-on-grade thickness before applying DIN checks.',
	},
	{
		id: 'pile-foundation-calculator',
		shortTitle: 'Pile Foundation',
		description: 'Approximate pile quantities when soils demand deeper support.',
	},
	{
		id: 'rebar-calculator',
		shortTitle: 'Rebar Calculator',
		description: 'Estimate reinforcement weight aligned with DIN execution tolerances.',
	},
]

const articleSlugs = [
	'concrete-basics-for-construction',
	'foundation-types-explained',
]

const schemaDescription =
	'DIN-focused explainer showing how German construction standards describe materials, testing, and safety concepts alongside Eurocodes.'

interface DinConstructionPageProps {
	params: {
		locale: Locale
		country: string
	}
}

export async function generateMetadata({
	params,
}: DinConstructionPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'de') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'DIN Construction Standards – Germany Engineering Context',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/de/din-construction',
				ru: '/ru/standards/national/de/din-construction',
				es: '/es/standards/national/de/din-construction',
				tr: '/tr/standards/national/de/din-construction',
				hi: '/hi/standards/national/de/din-construction',
			},
			canonical: `${basePath}/standards/national/de/din-construction`,
		},
		openGraph: {
			title: 'DIN Construction Standards – Germany Engineering Context',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/de/din-construction`,
			type: 'article',
		},
	}
}

export default async function DinConstructionPage({
	params,
}: DinConstructionPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'de') {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		'de',
		'Germany',
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
		headline: 'DIN Construction Standards – Germany Engineering Context',
		description: schemaDescription,
		inLanguage: locale,
		about: ['DIN', 'construction standards', 'materials', 'testing'],
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
					DIN Construction Standards – Germany Engineering Context
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					<p>
						DIN standards translate European structural principles into German
						execution rules. They explain how materials are specified, how tests
						are documented, and how safety concepts align with Eurocodes.
					</p>
					<p>
						This hub gives an educational overview so estimators and builders
						can connect Eurocode guidance with the DIN requirements they see in
						specifications.
					</p>
				</div>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What DIN Standards Commonly Cover
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Materials and quality
							</h3>
							<p className="text-gray-700">
								DIN documents describe declared properties, tolerances, and
								conformity marks so materials match the assumptions inside
								Eurocode design models.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Test methods
							</h3>
							<p className="text-gray-700">
								Standardized laboratory and field tests verify compressive
								strength, reinforcement quality, and durability parameters.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Construction practices
							</h3>
							<p className="text-gray-700">
								DIN execution standards outline mixing, curing, reinforcement
								placement, and documentation expected on German sites.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Safety concepts
							</h3>
							<p className="text-gray-700">
								Partial factors and inspection procedures ensure designs satisfy
								both Eurocode limit states and national regulatory checks.
							</p>
						</div>
					</div>
					<p className="text-gray-600 mt-4">
						In European standards,{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/EU/eurocode-2`}
						>
							Eurocode 2
						</Link>{' '}
						and{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/EU/eurocode-1`}
						>
							Eurocode 1
						</Link>{' '}
						provide the structural design framework that DIN supplements with
						local requirements.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						How This Relates to Estimation
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						<p>
							Material quantities and mix choices often reference DIN product
							classes, so early estimates should capture the specified class or
							performance tier.
						</p>
						<p>
							Test and inspection requirements influence waste factors and lead
							times, which should be noted during budgeting.
						</p>
						<p>
							Knowing which DIN execution standards apply helps teams predict
							reinforcement detailing density, cover requirements, and curing
							expectations.
						</p>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Related Calculators
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">
							Calculators are loading. Refresh the page if this notice remains.
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
							Supporting articles are being prepared. Please check back soon.
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
								This hub is for education only and does not provide DIN or
								Eurocode compliance guidance.
							</strong>
						</li>
						<li>
							<strong>
								Design, detailing, and testing must be performed by qualified
								engineering professionals.
							</strong>
						</li>
						<li>
							<strong>
								Always follow German regulations, Eurocode national annexes, and
								project specifications.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}

