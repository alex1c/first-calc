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

interface Ec2ConcretePrinciplesPageProps {
	params: {
		locale: Locale
		country: string
	}
}

const calculatorConfigs = [
	{
		id: 'concrete-volume-calculator',
		shortTitle: 'Concrete Volume',
		description: 'Estimate slab, footing, and pad volume for ordering ready-mix.',
	},
	{
		id: 'cement-calculator',
		shortTitle: 'Cement',
		description: 'Approximate cement bag quantities for planned pours.',
	},
	{
		id: 'concrete-mix-ratio-calculator',
		shortTitle: 'Concrete Mix Ratio',
		description: 'Compare mix proportions that align with conceptual Eurocode 2 guidance.',
	},
	{
		id: 'rebar-calculator',
		shortTitle: 'Rebar Calculator',
		description: 'Approximate reinforcement weight for takeoff discussions.',
	},
]

const articleSlugs = [
	'concrete-basics-for-construction',
	'concrete-mix-ratios-explained',
]

const schemaDescription =
	'Educational explainer describing how Eurocode 2 concrete concepts inform early planning, material estimates, and calculator usage.'

export async function generateMetadata({
	params,
}: Ec2ConcretePrinciplesPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'eu') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'Eurocode Concrete Principles (EC2) – Educational Overview',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/eu/ec2-concrete-principles',
				ru: '/ru/standards/national/eu/ec2-concrete-principles',
				es: '/es/standards/national/eu/ec2-concrete-principles',
				tr: '/tr/standards/national/eu/ec2-concrete-principles',
				hi: '/hi/standards/national/eu/ec2-concrete-principles',
			},
			canonical: `${basePath}/standards/national/eu/ec2-concrete-principles`,
		},
		openGraph: {
			title: 'Eurocode Concrete Principles (EC2) – Educational Overview',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/eu/ec2-concrete-principles`,
			type: 'article',
		},
	}
}

export default async function Ec2ConcretePrinciplesPage({
	params,
}: Ec2ConcretePrinciplesPageProps) {
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
							shortTitle: 'shortTitle' in calc ? calc.shortTitle : undefined,
					  }
					: null
			}),
		)
	).filter((calc): calc is NonNullable<typeof calc> => calc !== null) as Array<{
		id: string
		category: string
		slug: string
		title: string
		shortTitle?: string
	}>

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
		headline: 'Eurocode Concrete Principles (EC2) – Educational Overview',
		description: schemaDescription,
		inLanguage: locale,
		about: ['Eurocode 2', 'concrete', 'reinforced concrete', 'material properties'],
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
					Eurocode Concrete Principles (EC2)
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-8">
					<p>
						Eurocode 2 (EN 1992) provides a framework for understanding concrete and
						reinforced concrete design across European building practice. This page
						explains how concrete concepts influence material estimation and early
						planning in an educational context.
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
						What Eurocode 2 Covers Conceptually
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Concrete Strength Classes
							</h3>
							<p className="text-gray-700 text-sm">
								Concrete is commonly classified by compressive strength (e.g., C20/25,
								C30/37). Higher strength classes allow thinner sections or higher
								loads, but also require more cement and careful mix design.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Reinforcement Properties
							</h3>
							<p className="text-gray-700 text-sm">
								Reinforcing steel provides tensile strength that concrete lacks.
								Common grades (e.g., B500) define yield strength and ductility
								characteristics that influence design assumptions.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Cover and Durability
							</h3>
							<p className="text-gray-700 text-sm">
								Concrete cover protects reinforcement from corrosion and fire. Typical
								cover values depend on exposure conditions and structural requirements.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Mix Design Concepts
							</h3>
							<p className="text-gray-700 text-sm">
								Mix proportions (cement, water, aggregates) influence workability,
								strength, and durability. Early estimates use typical mix ratios;
								final design requires specific mix design based on project needs.
							</p>
						</div>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						How This Relates to Estimation
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						<p>
							Concrete strength class selection affects material quantities: higher
							strength typically requires more cement, which increases costs.
						</p>
						<p>
							Reinforcement assumptions (cover, spacing, bar sizes) directly translate
							into rebar weight and concrete volume calculations.
						</p>
						<p>
							Mix design concepts help estimate cement, sand, and gravel quantities
							for budgeting and ordering materials.
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
								href={`/${locale}/standards/national/eu/ec1-load-concepts`}
							>
								Eurocode Load Concepts (EC1)
							</Link>
						</li>
						<li>
							<Link
								className="text-blue-600 hover:text-blue-800 underline"
								href={`/${locale}/standards/national/eu/ec7-soil-foundations`}
							>
								Eurocode Soil & Foundations (EC7)
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
						structural design or compliance guidance. Eurocode 2 compliance requires
						professional design verification. Always consult qualified engineers and
						use current regulations before finalizing design.
					</p>
				</div>
			</PageContainer>
		</>
	)
}

