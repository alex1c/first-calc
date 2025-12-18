import { notFound } from 'next/navigation'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getStandardsByLocale, getCountries } from '@/data/standards'
import Link from 'next/link'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

const namespaces = ['common', 'navigation'] as const

interface StandardsPageProps {
	params: {
		locale: Locale
	}
}

export default async function StandardsPage({ params }: StandardsPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	const standards = getStandardsByLocale(locale)
	const countries = getCountries(locale)

	// Generate breadcrumbs
	const breadcrumbs = getStandardsBreadcrumbs(locale, undefined, undefined, undefined, t)

	// Group standards by country
	const standardsByCountry = countries.reduce(
		(acc, country) => {
			acc[country] = standards.filter((std) => std.country === country)
			return acc
		},
		{} as Record<string, typeof standards>,
	)

	return (
		<>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{t('navigation.breadcrumb.standards')}
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					Browse international and national standards related to calculations
				</p>

				{/* Standards by country */}
				<div className="space-y-8">
					{countries.map((country) => {
						const countryStandards = standardsByCountry[country]
						if (countryStandards.length === 0) return null

						return (
							<div key={country}>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									{country} Standards
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{countryStandards.map((std) => (
										<Link
											key={std.id}
											href={`/${locale}/standards/${std.country}/${std.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h3 className="text-xl font-semibold text-gray-900 mb-2">
												{std.title}
											</h3>
											<p className="text-gray-600 text-sm">
												{std.shortDescription}
											</p>
											{std.meta?.organization && (
												<p className="text-xs text-gray-500 mt-2">
													{std.meta.organization}
													{std.meta.year && ` • ${std.meta.year}`}
												</p>
											)}
										</Link>
									))}
								</div>
							</div>
						)
					})}
				</div>
			</PageContainer>
		</>
	)
}
