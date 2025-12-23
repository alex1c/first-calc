import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { standardRegistry, calculatorRegistry, articleRegistry } from '@/lib/registry/loader'
import { getCalculatorsByStandard } from '@/lib/standards/linking'
import { getArticlesByStandard } from '@/lib/standards/articles'
import { StandardSchema } from '@/components/schema/standard-schema'
import Link from 'next/link'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import {
	groupCalculators,
	getCalculatorDescription,
	type CalculatorGroup,
} from '@/lib/standards/calculator-grouping'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface StandardPageProps {
	params: {
		locale: Locale
		country: string
		standardSlug: string
	}
}

export async function generateMetadata({
	params,
}: StandardPageProps): Promise<Metadata> {
	const { locale, country, standardSlug } = params

	const standard = await standardRegistry.getBySlug(country, standardSlug, locale)

	if (!standard) {
		return {
			title: 'Standard Not Found',
		}
	}

	const keywords = standard.meta?.keywords || []
	const keywordsString = keywords.join(', ')

	// Custom metadata for ISO soil-foundations
	let title = `${standard.title} - Calculator Portal`
	let description = standard.longDescription || standard.shortDescription
	if (standard.id === 'iso-soil-foundations') {
		title = 'Soil and Foundation Basics – ISO Geotechnical Principles Explained'
		description =
			'Learn how soil properties affect foundations and how geotechnical principles relate to foundation, pile, and concrete calculations.'
	}

	return {
		title: title,
		description: description,
		keywords: keywordsString,
		alternates: {
			languages: {
				en: `/en/standards/${country}/${standardSlug}`,
				ru: `/ru/standards/${country}/${standardSlug}`,
				es: `/es/standards/${country}/${standardSlug}`,
				tr: `/tr/standards/${country}/${standardSlug}`,
				hi: `/hi/standards/${country}/${standardSlug}`,
			},
			canonical: `/${locale}/standards/${country}/${standardSlug}`,
		},
	}
}

export default async function StandardPage({ params }: StandardPageProps) {
	const { locale, country, standardSlug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const standard = await standardRegistry.getBySlug(country, standardSlug, locale)

	if (!standard) {
		notFound()
	}

	// Get calculators both from relatedCalculatorIds and standardIds
	const relatedFromIds = standard.relatedCalculatorIds
		? await Promise.all(
				standard.relatedCalculatorIds.map((id) =>
					calculatorRegistry.getById(id, locale),
				),
			).then((calcs) => calcs.filter((c): c is NonNullable<typeof c> => c !== undefined))
		: []
	const relatedFromStandard = await getCalculatorsByStandard(standard.id, locale)
	
	// Combine and deduplicate
	const allRelatedIds = new Set([
		...relatedFromIds.map((c) => c.id),
		...relatedFromStandard.map((c) => c.id),
	])
	const relatedCalculators = [
		...relatedFromIds,
		...relatedFromStandard,
	].filter((calc, index, self) => 
		index === self.findIndex((c) => c.id === calc.id)
	)

	// Get related articles for this standard
	const relatedArticles = await getArticlesByStandard(standard.id, locale)

	const canonicalUrl = `https://first-calc.com/${locale}/standards/${country}/${standardSlug}`

	const crossLinksSection = (() => {
		if (standard.id === 'eurocode-2') {
			return (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
					<p className="text-blue-900">
						In US practice, related concrete principles are summarized in the{' '}
						<Link
							className="text-blue-700 underline"
							href={`/${locale}/standards/national/us/aci-concrete`}
						>
							ACI Concrete Principles hub
						</Link>
						.
					</p>
				</div>
			)
		}
		if (standard.id === 'eurocode-1') {
			return (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
					<p className="text-blue-900">
						In US practice, structural load discussions are outlined in the{' '}
						<Link
							className="text-blue-700 underline"
							href={`/${locale}/standards/national/us/asce-loads`}
						>
							ASCE 7 Structural Loads hub
						</Link>
						.
					</p>
				</div>
			)
		}
		return null
	})()

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Generate breadcrumbs
	const breadcrumbs = getStandardsBreadcrumbs(
		locale,
		country,
		standardSlug,
		standard.title,
		t,
	)

	return (
		<>
			<StandardSchema standard={standard} canonicalUrl={canonicalUrl} />
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>

				{/* Header */}
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{standard.title}
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					{standard.shortDescription}
				</p>

				{crossLinksSection}

				{standard.longDescription && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
						<p className="text-gray-700">{standard.longDescription}</p>
					</div>
				)}

				{/* Formulas */}
				{standard.formulas && standard.formulas.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Key Formulas
						</h2>
						<div className="space-y-4">
							{standard.formulas.map((formula, index) => (
								<div key={index} className="border-b border-gray-200 pb-4 last:border-0">
									<h3 className="font-medium text-gray-900 mb-2">
										{formula.title}
									</h3>
									<div className="bg-gray-50 rounded-md p-4 font-mono text-lg">
										{formula.formula}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Tables */}
				{standard.tables && standard.tables.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Reference Tables
						</h2>
						<div className="space-y-6">
							{standard.tables.map((table, index) => (
								<div key={index}>
									<h3 className="font-medium text-gray-900 mb-3">
										{table.title}
									</h3>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200 border border-gray-200">
											<thead className="bg-gray-50">
												<tr>
													{table.rows[0]?.map((header, headerIndex) => (
														<th
															key={headerIndex}
															scope="col"
															className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
														>
															{header}
														</th>
													))}
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{table.rows.slice(1).map((row, rowIndex) => (
													<tr key={rowIndex}>
														{row.map((cell, cellIndex) => (
															<td
																key={cellIndex}
																className="px-4 py-3 text-sm text-gray-900"
															>
																{cell}
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Hub Page Content - Show for standards without formulas/tables */}
				{(!standard.formulas || standard.formulas.length === 0) &&
				(!standard.tables || standard.tables.length === 0) ? (
					<>
						{/* What Geotechnical Standards Cover - for ISO soil-foundations */}
						{standard.id === 'iso-soil-foundations' && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									What Geotechnical Standards Cover
								</h2>
								<div className="space-y-4">
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Soil types (sand, clay, gravel, rock)
										</h3>
										<p className="text-gray-700">
											The basic classification of soils and how different types behave differently under load. Sand drains well but can shift. Clay holds water and can expand or contract. Gravel is strong and stable. Rock provides the strongest foundation.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Bearing capacity concepts
										</h3>
										<p className="text-gray-700">
											Bearing capacity is the soil's ability to support loads without failure. Strong soils can support more load per unit area. Standards define how to determine and use bearing capacity values.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Settlement and deformation
										</h3>
										<p className="text-gray-700">
											All soils compress under load—this is settlement. Some soils settle more than others. Standards provide guidance on acceptable settlement limits.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Groundwater influence
										</h3>
										<p className="text-gray-700">
											Water in the ground affects soil behavior. High groundwater can reduce soil strength, cause frost heave, and require drainage systems.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Safety factors and assumptions
										</h3>
										<p className="text-gray-700">
											Standards define safety factors to account for uncertainty in soil properties. These factors ensure foundations are designed conservatively.
										</p>
									</div>
									<p className="text-gray-600 italic mt-4">
										Standards define HOW soils are classified and tested, not just numerical values.
									</p>
									<p className="text-gray-700 mt-2">
										In Russian practice, field teams expand on these ideas using the{' '}
										<Link
											className="text-blue-600 hover:text-blue-800 underline"
											href={`/${locale}/standards/national/ru/sp-snip-foundations`}
										>
											SP &amp; SNiP Foundations hub
										</Link>
										.
									</p>
								</div>
							</div>
						)}

						{/* How Soil Affects Foundations - for ISO soil-foundations */}
						{standard.id === 'iso-soil-foundations' && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									How Soil Affects Foundations
								</h2>
								<div className="space-y-4">
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Weak soil → larger foundations
										</h3>
										<p className="text-gray-700">
											Weak soils cannot support much load per unit area, so foundations must be larger (wider, deeper) to spread the load over more soil area.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Compressible soil → settlement risk
										</h3>
										<p className="text-gray-700">
											Soils that compress easily (like soft clay) will settle more under load, requiring deeper foundations or special design considerations.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Groundwater → drainage and design changes
										</h3>
										<p className="text-gray-700">
											High groundwater levels can reduce soil strength, require waterproofing, and may need drainage systems or dewatering during construction.
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 mb-2">
											Piles used when shallow foundations are insufficient
										</h3>
										<p className="text-gray-700">
											When soil near the surface is too weak, piles transfer loads to deeper, stronger soil layers or bedrock.
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Calculations in Early-Stage Practice - for ISO soil-foundations */}
						{standard.id === 'iso-soil-foundations' && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									Calculations in Early-Stage Practice
								</h2>
								<p className="text-gray-700 mb-4">
									Before detailed soil reports, users commonly estimate:
								</p>
								<ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
									<li>
										<strong>Foundation geometry:</strong> Estimating foundation dimensions based on building loads and assumed soil conditions
									</li>
									<li>
										<strong>Concrete volume:</strong> Calculating concrete needed for foundations based on estimated dimensions
									</li>
									<li>
										<strong>Pile quantity and size:</strong> Estimating number and size of piles for preliminary design
									</li>
									<li>
										<strong>Reinforcement estimates:</strong> Calculating approximate rebar quantities for foundation elements
									</li>
								</ul>
								<p className="text-gray-700 font-semibold">
									Final design always requires geotechnical investigation.
								</p>
							</div>
						)}
					</>
				) : null}

				{/* Related Calculators - Grouped by type */}
				{relatedCalculators.length > 0 && (() => {
					// Limit calculators to 6-8 per standard
					const limitedCalculators = relatedCalculators.slice(0, 8)
					
					// Group calculators by type
					const grouped = groupCalculators(limitedCalculators)
					
					// Order groups: Foundations, Concrete, Reinforcement, Other
					const groupOrder: CalculatorGroup[] = ['Foundations', 'Concrete', 'Reinforcement', 'Other']
					
					// Filter out empty groups
					const nonEmptyGroups = groupOrder.filter(group => grouped[group].length > 0)
					
					return (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">
								Related Calculators
							</h2>
							<div className="space-y-6">
								{nonEmptyGroups.map((group) => (
									<div key={group}>
										<h3 className="text-lg font-semibold text-gray-800 mb-3">
											{group}
										</h3>
										<ul className="space-y-3">
											{grouped[group].map((calc) => {
												// Get description from mapping or use short description
												const description = getCalculatorDescription(calc.id, standard.id) || calc.shortDescription
												return (
													<li key={calc.id}>
														<Link
															href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
															className="text-blue-600 hover:text-blue-800 underline font-medium"
														>
															{calc.title}
														</Link>
														{description && (
															<p className="text-sm text-gray-600 mt-1">
																{description}
															</p>
														)}
													</li>
												)
											})}
										</ul>
									</div>
								))}
							</div>
						</div>
					)
				})()}

				{/* Related Learn Articles */}
				{relatedArticles.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Related Learn Articles
						</h2>
						<ul className="space-y-3">
							{relatedArticles.map((article) => (
								<li key={article.id}>
									<Link
										href={`/${locale}/learn/${article.slug}`}
										className="text-blue-600 hover:text-blue-800 underline font-medium"
									>
										{article.title}
									</Link>
									{article.shortDescription && (
										<p className="text-sm text-gray-600 mt-1">
											{article.shortDescription}
										</p>
									)}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Disclaimers for Hub Pages */}
				{(!standard.formulas || standard.formulas.length === 0) &&
				(!standard.tables || standard.tables.length === 0) ? (
					<>
						{/* Strong Disclaimer - for ISO soil-foundations */}
						{standard.id === 'iso-soil-foundations' && (
							<div className="bg-red-50 border-4 border-red-300 rounded-lg p-8 mb-8 shadow-sm">
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0">
										<svg
											className="h-8 w-8 text-red-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<h2 className="text-2xl font-bold text-red-900 mb-4">
											⚠️ Critical Disclaimer
										</h2>
										<ul className="space-y-3 text-red-800">
											<li className="flex items-start gap-2">
												<span className="text-red-600 font-bold mt-1">•</span>
												<span><strong>Calculators are for estimation only.</strong></span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-red-600 font-bold mt-1">•</span>
												<span><strong>Soil properties cannot be assumed without proper geotechnical testing.</strong></span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-red-600 font-bold mt-1">•</span>
												<span><strong>Always consult qualified geotechnical engineers and local building regulations.</strong></span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-red-600 font-bold mt-1">•</span>
												<span><strong>Final foundation design requires site-specific soil investigation and professional engineering.</strong></span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-red-600 font-bold mt-1">•</span>
												<span><strong>This page is an educational resource, not a substitute for geotechnical engineering services.</strong></span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						)}

						{/* Disclaimer - for Eurocode 1 */}
						{standard.id === 'eurocode-1' && (
							<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
								<h2 className="text-xl font-semibold text-yellow-900 mb-3">
									⚠️ Important Disclaimer
								</h2>
								<ul className="space-y-2 text-yellow-800">
									<li>
										<strong>Calculators provide estimation only.</strong>
									</li>
									<li>
										<strong>Eurocode load combinations are not fully implemented in these tools.</strong>
									</li>
									<li>
										<strong>Always consult a qualified structural engineer for structural design.</strong>
									</li>
									<li>
										<strong>This page is an educational resource, not a substitute for professional engineering design.</strong>
									</li>
									<li>
										<strong>Load calculations must follow local building codes and regulations.</strong>
									</li>
								</ul>
							</div>
						)}

						{/* Disclaimer - for Eurocode 2 */}
						{standard.id === 'eurocode-2' && (
							<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
								<h2 className="text-xl font-semibold text-yellow-900 mb-3">
									⚠️ Important Disclaimer
								</h2>
								<ul className="space-y-2 text-yellow-800">
									<li>
										<strong>This is an estimation tool and educational resource.</strong>
									</li>
									<li>
										<strong>This page is not a substitute for professional engineering design.</strong>
									</li>
									<li>
										<strong>Always consult qualified structural engineers and local building regulations for actual construction projects.</strong>
									</li>
									<li>
										<strong>Eurocode 2 compliance requires professional design verification.</strong>
									</li>
								</ul>
							</div>
						)}
					</>
				) : null}

				{/* FAQ - Universal static FAQ for now */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-medium text-gray-900 mb-2">
								What is this standard used for?
							</h3>
							<p className="text-gray-700">
								This standard provides guidelines and requirements for specific
								calculations and design procedures in its field of application.
							</p>
						</div>
						<div>
							<h3 className="font-medium text-gray-900 mb-2">
								How do I apply this standard?
							</h3>
							<p className="text-gray-700">
								This page provides educational context about the standard. For actual
								design work, consult the official standard documents and qualified
								engineers. Our calculators can help with preliminary estimations, but
								they are not a substitute for professional design.
							</p>
						</div>
					</div>
				</div>
			</PageContainer>
		</>
	)
}
