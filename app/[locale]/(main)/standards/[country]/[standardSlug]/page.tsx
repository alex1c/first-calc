import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { standardRegistry, calculatorRegistry } from '@/lib/registry/loader'
import { getCalculatorsByStandard } from '@/lib/standards/linking'
import { StandardSchema } from '@/components/schema/standard-schema'
import Link from 'next/link'

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

	return {
		title: `${standard.title} - Calculator Portal`,
		description: standard.longDescription || standard.shortDescription,
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

	const canonicalUrl = `https://first-calc.com/${locale}/standards/${country}/${standardSlug}`

	return (
		<>
			<StandardSchema standard={standard} canonicalUrl={canonicalUrl} />
			<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Link
					href={`/${locale}/standards/${country}`}
					className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
				>
					← Back to {country} Standards
				</Link>

				{/* Header */}
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{standard.title}
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					{standard.shortDescription}
				</p>

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

				{/* Related Calculators */}
				{relatedCalculators.length > 0 && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Related Calculators
						</h2>
						<ul className="space-y-2">
							{relatedCalculators.map((calc) => (
								<li key={calc.id}>
									<Link
										href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
										className="text-blue-600 hover:text-blue-800 underline"
									>
										{calc.title}
									</Link>
									{calc.shortDescription && (
										<p className="text-sm text-gray-600 ml-4">
											{calc.shortDescription}
										</p>
									)}
								</li>
							))}
						</ul>
					</div>
				)}

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
								Refer to the formulas and tables provided above, and use our
								related calculators to perform the calculations according to this
								standard.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	)
}
