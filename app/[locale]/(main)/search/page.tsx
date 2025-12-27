/**
 * Search page for internal portal search
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { searchPortal } from '@/lib/search'
import Link from 'next/link'

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
	const { locale } = params
	const { q } = searchParams

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
						<div className="text-gray-600">
							Found {results.calculators.total} calculators,{' '}
							{results.standards.total} standards, and {results.articles.total} articles for
							&quot;{query}&quot;
						</div>

						{results.fallbackLocaleUsed && (
							<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
								No matches in this language. Showing English content.
							</div>
						)}

						{results.calculators.total > 0 && (
							<section>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('navigation.menu.calculators')} ({results.calculators.total})
								</h2>
								<div className="space-y-3">
									{results.calculators.items.map((item) => (
										<Link
											key={item.id}
											href={item.url}
											className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition"
										>
											<div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
												<span>{item.title}</span>
												{item.badge && (
													<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
														{item.badge}
													</span>
												)}
												{item.isForeignLocale && (
													<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
														Content in English
													</span>
												)}
											</div>
											<p className="mt-2 text-sm text-gray-600">
												{item.description}
											</p>
										</Link>
									))}
								</div>
							</section>
						)}

						{results.standards.total > 0 && (
							<section>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('navigation.menu.standards')} ({results.standards.total})
								</h2>
								<div className="space-y-3">
									{results.standards.items.map((item) => (
										<Link
											key={item.id}
											href={item.url}
											className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition"
										>
											<div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
												<span>{item.title}</span>
												{item.badge && (
													<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
														{item.badge}
													</span>
												)}
												{item.isForeignLocale && (
													<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
														Content in English
													</span>
												)}
											</div>
											<p className="mt-2 text-sm text-gray-600">
												{item.description}
											</p>
										</Link>
									))}
								</div>
							</section>
						)}

						{results.articles.total > 0 && (
							<section>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{t('navigation.menu.learn')} ({results.articles.total})
								</h2>
								<div className="space-y-3">
									{results.articles.items.map((item) => (
										<Link
											key={item.id}
											href={item.url}
											className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition"
										>
											<div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
												<span>{item.title}</span>
												{item.badge && (
													<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
														{item.badge}
													</span>
												)}
												{item.isForeignLocale && (
													<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
														Content in English
													</span>
												)}
											</div>
											<p className="mt-2 text-sm text-gray-600">
												{item.description}
											</p>
										</Link>
									))}
								</div>
							</section>
						)}

						{results.calculators.total === 0 &&
							results.standards.total === 0 &&
							results.articles.total === 0 && (
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

