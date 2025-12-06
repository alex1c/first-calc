import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'
import { getCalculatorsByCategoryWithPopularity } from '@/lib/navigation/structure'
import Link from 'next/link'

interface CalculatorsCategoryPageProps {
	params: {
		locale: Locale
		category: string
	}
}

export default async function CalculatorsCategoryPage({
	params,
}: CalculatorsCategoryPageProps) {
	const { locale, category } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const calculators = await getCalculatorsByCategoryWithPopularity(
		category,
		locale,
	)

	if (calculators.length === 0) {
		notFound()
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Link
					href={`/${locale}/calculators`}
					className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
				>
					← Back to Calculators
				</Link>
				<h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
					{category} Calculators
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					{calculators.length} calculator{calculators.length !== 1 ? 's' : ''}{' '}
					available
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{calculators.map((calc) => (
						<Link
							key={calc.id}
							href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
						>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{calc.title}
							</h3>
							<p className="text-gray-600 text-sm">
								{calc.shortDescription}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

