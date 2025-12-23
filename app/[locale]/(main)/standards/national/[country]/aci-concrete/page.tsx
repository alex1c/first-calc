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

interface AciConcretePageProps {
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
		id: 'sand-calculator',
		shortTitle: 'Sand',
		description: 'Plan sand requirements that support ACI mix proportions.',
	},
	{
		id: 'gravel-calculator',
		shortTitle: 'Gravel',
		description: 'Estimate coarse aggregate for structural elements.',
	},
	{
		id: 'concrete-mix-ratio-calculator',
		shortTitle: 'Concrete Mix Ratio',
		description: 'Compare mix proportions that align with conceptual ACI guidance.',
	},
	{
		id: 'slab-foundation-calculator',
		shortTitle: 'Slab Foundation',
		description: 'Outline dimensions needed before structural design begins.',
	},
	{
		id: 'rebar-calculator',
		shortTitle: 'Rebar Calculator',
		description: 'Approximate reinforcement weight for takeoff discussions.',
	},
]

const articleConfigs = [
	{
		slug: 'concrete-basics-for-construction',
		title: 'Concrete Basics for Construction',
	},
	{
		slug: 'concrete-mix-ratios-explained',
		title: 'Concrete Mix Ratios Explained',
	},
	{
		slug: 'rebar-estimation-basics',
		title: 'Rebar Estimation Basics',
	},
]

const schemaDescription =
	'Educational explainer describing how ACI concrete concepts inform early planning, material estimates, and calculator usage.'

export async function generateMetadata({
	params,
}: AciConcretePageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'us') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`

	return {
		title: 'ACI Concrete Principles – USA Concrete Design Context',
		description: schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/us/aci-concrete',
				ru: '/ru/standards/national/us/aci-concrete',
				es: '/es/standards/national/us/aci-concrete',
				tr: '/tr/standards/national/us/aci-concrete',
				hi: '/hi/standards/national/us/aci-concrete',
			},
			canonical: `${basePath}/standards/national/us/aci-concrete`,
		},
		openGraph: {
			title: 'ACI Concrete Principles – USA Concrete Design Context',
			description: schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/us/aci-concrete`,
			type: 'article',
		},
	}
}

export default async function AciConcretePage({ params }: AciConcretePageProps) {
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

	const calculatorResults = await Promise.all(
		calculatorConfigs.map(async (config) => {
			const calc = await calculatorRegistry.getById(config.id, locale)
			return calc
				? {
						...config,
						slug: calc.slug,
						category: calc.category,
						title: calc.title,
				  }
				: null
		}),
	)
	const calculators = calculatorResults.filter(
		(calc): calc is NonNullable<typeof calc> => calc !== null,
	)

	const articleResults = await Promise.all(
		articleConfigs.map(async (config) => {
			const localized = await articleRegistry.getBySlug(config.slug, locale)
			if (localized) {
				return localized
			}
			// Fallback to English copy so the links remain active
			return articleRegistry.getBySlug(config.slug, 'en')
		}),
	)
	const articles = articleResults.filter(
		(article): article is NonNullable<typeof article> => article !== null,
	)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'ACI Concrete Principles – USA Concrete Design Context',
		description: schemaDescription,
		inLanguage: locale,
		about: ['ACI', 'concrete', 'reinforcement principles', 'durability'],
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
					ACI Concrete Principles – USA Concrete Design Context
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					<p>
						ACI documents organize how U.S. engineers discuss concrete materials,
						mixes, reinforcement, and safety factors. They translate decades of
						test data into design assumptions that guide detailing, durability,
						and inspection.
					</p>
					<p>
						This hub explains those ideas at a conceptual level so estimators
						and builders can connect material takeoffs and calculator workflows
						to the language ACI uses during design development.
					</p>
				</div>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						What ACI Covers
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Concrete materials and mixes
							</h3>
							<p className="text-gray-700">
								ACI describes how cement, water, sand, and coarse aggregate
								combine, how water-cement ratios influence strength, and why mix
								adjustments handle workability or exposure conditions.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Reinforcement concepts
							</h3>
							<p className="text-gray-700">
								It defines where steel is needed, how bar spacing and cover
								protect against corrosion, and how development length ensures
								reinforcement actually delivers tension resistance.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Durability concepts
							</h3>
							<p className="text-gray-700">
								Exposure categories, air entrainment guidance, and curing
								expectations tie mixes to freeze-thaw, chemical, or coastal
								conditions so the structure lasts through service life.
							</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Safety assumptions
							</h3>
							<p className="text-gray-700">
								Strength reduction factors, load combinations, and detailing
								rules build conservative margins so field tolerances and
								material variability stay within acceptable risk.
							</p>
						</div>
					</div>
					<p className="text-gray-600 mt-4">
						In European standards, similar concepts are discussed in{' '}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/EU/eurocode-2`}
						>
							Eurocode 2
						</Link>
						, which provides another reference point for concrete behavior.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						How This Relates to Estimation
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-2">
								What can be estimated early
							</h3>
							<ul className="list-disc list-inside text-blue-900 space-y-2">
								<li>Concrete volume based on schematic geometry</li>
								<li>Preliminary mix proportions for procurement planning</li>
								<li>Material quantities for cement, sand, and gravel</li>
								<li>Rough reinforcement tonnage for budgeting</li>
							</ul>
						</div>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-yellow-900 mb-2">
								What cannot be finalized
							</h3>
							<ul className="list-disc list-inside text-yellow-900 space-y-2">
								<li>Member sizing or bar layouts required for code compliance</li>
								<li>Strength reduction factors chosen by licensed engineers</li>
								<li>Durability provisions tied to exposure categories</li>
								<li>Inspection and testing plans mandated by local authorities</li>
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
								<li key={calc.id} className="bg-white border border-gray-200 rounded-lg p-4">
									<h3 className="text-lg font-semibold text-gray-900">
										{calc.shortTitle || calc.title}
									</h3>
									<p className="text-gray-600 text-sm mb-2">
										{
											calculatorConfigs.find((config) => config.id === calc.id)
												?.description
										}
									</p>
									<Link
										className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
										href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
									>
										Open calculator
									</Link>
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
							Articles are being prepared. Please check back soon.
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
								This page is educational and does not provide ACI compliance guidance.
							</strong>
						</li>
						<li>
							<strong>
								Use licensed structural engineers for design decisions, detailing, and
								documentation.
							</strong>
						</li>
						<li>
							<strong>
								Always follow local building codes, material standards, and inspection
								requirements.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}

