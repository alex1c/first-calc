/**
 * Search page for internal portal search
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { searchPortal } from '@/lib/search'
import Link from 'next/link'
import { CalculatorCard } from '@/components/calculators/calculator-card'

// Declare required namespaces for this page
const namespaces = ['common', 'calculators/ui'] as const

interface SearchPageProps {
	params: {
		locale: Locale
	}
	searchParams: {
		q?: string
	}
}

export async function generateMetadata({
	params,
	searchParams,
}: SearchPageProps): Promise<Metadata> {
	const { locale, q } = searchParams

	return {
		title: q ? `Search: ${q} - Calculator Portal` : 'Search - Calculator Portal',
		description: q
			? `Search results for "${q}" in calculators, standards, and articles`
			: 'Search calculators, standards, and articles',
	}
}

export default async function SearchPage({
	params,
	searchParams,
}: SearchPageProps) {
	const { locale } = params
	const { q } = searchParams

	if (!locales.includes(locale)) {
		notFound()
	}

	const query = q || ''
	const results = query ? await searchPortal(query, locale) : null

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{t('common.label.search')}
				</h1>

				{/* Search form */}
				<div className="mb-8">
					<form method="GET" action={`/${locale}/search`} className="flex gap-4">
						<input
							type="text"
							name="q"
							defaultValue={query}
							placeholder={t('calculators/ui.search.placeholder')}
							className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<button
							type="submit"
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							{t('common.button.search')}
						</button>
					</form>
				</div>

				{/* Results */}
				{query && results && (
					<div className="space-y-8">
						{/* Summary */}
						<div className="text-gray-600">
							Found {results.calculators.length} calculators,{' '}
							{results.standards.length} standards, and {results.articles.length}{' '}
							articles for &quot;{query}&quot;
						</div>

						{/* Calculators */}
						{results.calculators.length > 0 && (
							<div>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('navigation.menu.calculators')} ({results.calculators.length})
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
									{results.calculators.map((calc) => (
										<CalculatorCard
											key={calc.id}
											calculator={calc}
											locale={locale}
											hasStandard={
												calc.standardIds && calc.standardIds.length > 0
											}
										/>
									))}
								</div>
							</div>
						)}

						{/* Standards */}
						{results.standards.length > 0 && (
							<div>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('navigation.menu.standards')} ({results.standards.length})
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{results.standards.map((standard) => (
										<Link
											key={`${standard.id}-${standard.locale}`}
											href={`/${locale}/standards/${standard.country}/${standard.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h3 className="text-xl font-semibold text-gray-900 mb-2">
												{standard.title}
											</h3>
											<p className="text-gray-600 text-sm mb-2">
												{standard.shortDescription}
											</p>
											<div className="flex items-center gap-2 text-xs text-gray-500">
												<span className="px-2 py-1 bg-gray-100 rounded">
													{standard.country}
												</span>
												{standard.meta?.year && (
													<span>{standard.meta.year}</span>
												)}
											</div>
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Articles */}
						{results.articles.length > 0 && (
							<div>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('navigation.menu.learn')} ({results.articles.length})
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{results.articles.map((article) => (
										<Link
											key={`${article.id}-${article.locale}`}
											href={`/${locale}/learn/${article.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h3 className="text-xl font-semibold text-gray-900 mb-2">
												{article.title}
											</h3>
											<p className="text-gray-600 text-sm">
												{article.shortDescription}
											</p>
										</Link>
									))}
								</div>
							</div>
						)}

						{/* No results */}
						{results.calculators.length === 0 &&
							results.standards.length === 0 &&
							results.articles.length === 0 && (
								<div className="text-center py-12">
									<p className="text-gray-600 text-lg mb-2">
										{t('common.label.noResults')} &quot;{query}&quot;
									</p>
									<p className="text-gray-500">
										{t('calculators/ui.search.noResults')}
									</p>
								</div>
							)}
					</div>
				)}

				{/* Empty state */}
				{!query && (
					<div className="text-center py-12">
						<p className="text-gray-600 text-lg">
							{t('calculators/ui.search.placeholder')}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

