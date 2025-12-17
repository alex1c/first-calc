import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { getStandardsByCountry } from '@/data/standards'
import Link from 'next/link'

interface StandardsCountryPageProps {
	params: {
		locale: Locale
		country: string
	}
}

export default function StandardsCountryPage({
	params,
}: StandardsCountryPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const standards = getStandardsByCountry(country, locale)

	if (standards.length === 0) {
		notFound()
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Link
					href={`/${locale}/standards`}
					className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
				>
					← Back to Standards
				</Link>
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{country} Standards
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					{standards.length} standard{standards.length !== 1 ? 's' : ''}{' '}
					available
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{standards.map((std) => (
						<Link
							key={std.id}
							href={`/${locale}/standards/${std.country}/${std.slug}`}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
						>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{std.title}
							</h3>
							<p className="text-gray-600 text-sm">{std.shortDescription}</p>
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
		</div>
	)
}




