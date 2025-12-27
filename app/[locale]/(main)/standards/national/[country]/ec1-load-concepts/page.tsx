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

interface Ec1LoadConceptsPageProps {
	params: {
		locale: Locale
		country: string
	}
}

const calculatorConfigs = [
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Estimate slab dimensions that later receive Eurocode load checks.',
	},
	{
		id: 'foundation-volume-calculator',
		shortTitle: 'Foundation Volume',
		description: 'Approximate footing volume once governing reactions are known.',
	},
	{
		id: 'stair-calculator',
		shortTitle: 'Stair Calculator',
		description: 'Plan stair geometry that respects Eurocode live loads while budgeting.',
	},
]

const articleSlugs = [
	'what-are-structural-loads',
	'dead-load-vs-live-load',
]

const schemaDescription =
	'Educational overview of Eurocode 1 load concepts, actions, and load combinations that influence early design assumptions.'

export async function generateMetadata({
	params,
}: Ec1LoadConceptsPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'eu') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'Eurocode Load Concepts (EC1) – Educational Overview',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/eu/ec1-load-concepts',
				ru: '/ru/standards/national/eu/ec1-load-concepts',
				es: '/es/standards/national/eu/ec1-load-concepts',
				tr: '/tr/standards/national/eu/ec1-load-concepts',
				hi: '/hi/standards/national/eu/ec1-load-concepts',
			},
			canonical: `${basePath}/standards/national/eu/ec1-load-concepts`,
		},
		openGraph: {
			title: 'Eurocode Load Concepts (EC1) – Educational Overview',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/eu/ec1-load-concepts`,
			type: 'article',
		},
	}
}

export default async function Ec1LoadConceptsPage({
	params,
}: Ec1LoadConceptsPageProps) {
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
		headline: 'Eurocode Load Concepts (EC1) – Educational Overview',
		description: schemaDescription,
		inLanguage: locale,
		about: ['Eurocode 1', 'structural loads', 'actions', 'load combinations'],
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
					Eurocode Load Concepts (EC1)
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-8">
					<p>
						Eurocode 1 (EN 1991) provides a framework for understanding structural
						loads and actions across European building practice. This page explains
						how load concepts influence foundations, slabs, and early estimates in
						an educational context.
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
						What Eurocode 1 Covers Conceptually
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Permanent Actions
							</h3>
							<p className="text-gray-700 text-sm">
								These are fixed weights: the structure itself, finishes, fixed
								equipment. Once installed, they rarely change. Estimators usually
								know permanent actions early because they come directly from the
								material schedule.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Variable Actions
							</h3>
							<p className="text-gray-700 text-sm">
								Variable actions move or change: people, furniture, storage, vehicles.
								Eurocode 1 assigns default values by occupancy so a living room,
								office, or warehouse gets an appropriate allowance.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Environmental Actions
							</h3>
							<p className="text-gray-700 text-sm">
								Weather and site conditions add environmental actions: snow on roofs,
								wind on walls, temperature effects, or seismic shaking. These depend
								on climate, exposure, and building height.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Load Combinations
							</h3>
							<p className="text-gray-700 text-sm">
								For safety, Eurocode 1 requires designers to consider multiple
								actions acting together. Permanent + variable, permanent + snow, or
								other combinations establish the governing case.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Why Loads Matter for Foundations and Slabs
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						<p>
							Loads translate directly into soil bearing pressure. Higher reactions
							require larger footing areas to stay within soil limits.
						</p>
						<p>
							Slab thickness and reinforcement layouts depend on how Eurocode 1 live
							load categories and environmental actions distribute across the floor
							plate.
						</p>
						<p>
							Load combinations also influence crack control and serviceability, so
							even preliminary takeoffs should document the assumed load category.
						</p>
					</div>
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
								href={`/${locale}/standards/national/eu/ec7-soil-foundations`}
							>
								Eurocode Soil & Foundations (EC7)
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
						This content is for learning and estimation only. It does not provide
						structural design or compliance guidance. Always consult qualified
						engineers and use current regulations before finalizing design.
					</p>
				</div>
			</PageContainer>
		</>
	)
}


