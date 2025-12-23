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
		id: 'strip-foundation-calculator',
		shortTitle: 'Strip Foundation',
		description: 'Estimate wall footing sizes before SP verification.',
	},
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Plan slab-on-grade thickness that later aligns with SP checks.',
	},
	{
		id: 'pile-foundation-calculator',
		shortTitle: 'Pile Foundation',
		description: 'Approximate pile quantity and length for weak soils.',
	},
	{
		id: 'foundation-volume-calculator',
		shortTitle: 'Foundation Volume',
		description: 'Convert conceptual dimensions into cubic meters for ordering.',
	},
	{
		id: 'concrete-volume-calculator',
		shortTitle: 'Concrete Volume',
		description: 'General-purpose volume calculator for Russian pours.',
	},
	{
		id: 'rebar-calculator',
		shortTitle: 'Rebar Calculator',
		description: 'Estimate reinforcement weight used in SP/SNiP detailing.',
	},
]

const articleSlugs = [
	'soil-basics-for-foundations',
	'when-to-use-piles',
	'concrete-foundations-explained',
]

const schemaDescription =
	'Russian SP and SNiP foundations hub explaining soil, concrete, and safety concepts with links to calculators and related articles.'

interface SpSnipFoundationsPageProps {
	params: {
		locale: Locale
		country: string
	}
}

export async function generateMetadata({
	params,
}: SpSnipFoundationsPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'ru') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'SP & SNiP Foundations – Russian Construction Context Explained',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/ru/sp-snip-foundations',
				ru: '/ru/standards/national/ru/sp-snip-foundations',
				es: '/es/standards/national/ru/sp-snip-foundations',
				tr: '/tr/standards/national/ru/sp-snip-foundations',
				hi: '/hi/standards/national/ru/sp-snip-foundations',
			},
			canonical: `${basePath}/standards/national/ru/sp-snip-foundations`,
		},
		openGraph: {
			title: 'SP & SNiP Foundations – Russian Construction Context Explained',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/ru/sp-snip-foundations`,
			type: 'article',
		},
	}
}

export default async function SpSnipFoundationsPage({
	params,
}: SpSnipFoundationsPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'ru') {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		'ru',
		'Russia',
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
		headline: 'SP & SNiP Foundations – Russian Construction Context Explained',
		description: schemaDescription,
		inLanguage: locale,
		about: ['SP', 'SNiP', 'foundations', 'Russia'],
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
					SP & SNiP Foundations – Russian Construction Context Explained
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					<p>
						Russian practice relies on SP and legacy SNiP documents that define
						how foundations are investigated, designed, and executed. They
						translate regulatory expectations into procedures for soils,
						concrete, reinforcement, and safety factors.
					</p>
					<p>
						This page is an educational overview that links calculators and
						articles to the terminology used across Russian projects.
					</p>
				</div>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What These Documents Typically Cover
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Foundation types and assumptions
							</h3>
							<p className="text-gray-700">
								SP/SNiP documents explain when to use strip, slab, or pile
								solutions and which default load paths they assume.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Soil considerations
							</h3>
							<p className="text-gray-700">
								They define investigation scopes, classification systems, and
								allowable bearing pressures for Russian geologic conditions.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Concrete and reinforcement concepts
							</h3>
							<p className="text-gray-700">
								Mix classes, curing requirements, and rebar cover settings ensure
								foundations reach the strengths assumed in analyses.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Safety factors conceptually
							</h3>
							<p className="text-gray-700">
								Safety factors describe how permanent, temporary, and seismic
								actions are combined. They connect local regulations to the
								broader Eurocode safety philosophy.
							</p>
						</div>
					</div>
					<p className="text-gray-600 mt-4">
						In Russian practice, teams often reference international soil
						guidance such as the{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/ISO/soil-and-foundations`}
						>
							ISO Soil & Foundations hub
						</Link>
						.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						How This Relates to Estimation
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						<p>
							Knowing which SP or SNiP applies helps capture the correct soil
							parameters, mix classes, and rebar cover in cost estimates.
						</p>
						<p>
							Investigation scope affects drilling costs, lab testing, and
							schedule risk—important inputs for feasibility studies.
						</p>
						<p>
							Concrete and rebar calculators can provide quick quantities, but
							the final numbers must be validated against the latest Russian
							regulations.
						</p>
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Related Calculators
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">
							Calculators are loading. Refresh if this notice remains.
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
						⚠️ Very strong disclaimer
					</h2>
					<ul className="space-y-2 text-red-800">
						<li>
							<strong>Educational resource only. No regulatory compliance.</strong>
						</li>
						<li>
							<strong>
								SP/SNiP documents are updated frequently. Always consult the
								latest official publications and local authorities.
							</strong>
						</li>
						<li>
							<strong>
								Foundation design and verification require licensed professional
								engineers familiar with current Russian codes.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}

