import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { calculatorRegistry } from '@/lib/registry/loader'
import {
	getPopularCalculators,
	getNewCalculators,
	getRecommendedCalculators,
} from '@/lib/navigation/structure'
import Link from 'next/link'
import { CalculatorCard } from '@/components/calculators/calculator-card'

interface CalculatorsPageProps {
	params: {
		locale: Locale
	}
}

export default async function CalculatorsPage({
	params,
}: CalculatorsPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const calculators = await calculatorRegistry.getAll(locale)
	const popularCalculators = await getPopularCalculators(locale)
	const newCalculators = await getNewCalculators(locale, 5)
	const recommendedCalculators = await getRecommendedCalculators(locale, {
		limit: 5,
	})

	// Get unique categories
	const categories = Array.from(
		new Set(calculators.map((calc) => calc.category)),
	).sort()

	// Group calculators by category
	const calculatorsByCategory = categories.reduce(
		(acc, category) => {
			acc[category] = calculators.filter((calc) => calc.category === category)
			return acc
		},
		{} as Record<string, typeof calculators>,
	)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">Calculators</h1>
				<p className="text-lg text-gray-600 mb-8">
					Browse our collection of free online calculators
				</p>

				{/* Popular Calculators */}
				{popularCalculators.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Popular Calculators
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{popularCalculators.map((calc) => (
								<CalculatorCard
									key={calc.id}
									calculator={calc}
									locale={locale}
									isPopular={true}
									hasStandard={calc.standardIds && calc.standardIds.length > 0}
								/>
							))}
						</div>
					</div>
				)}

				{/* New Calculators */}
				{newCalculators.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							New Calculators
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{newCalculators.map((calc) => (
								<CalculatorCard
									key={calc.id}
									calculator={calc}
									locale={locale}
									isNew={true}
									hasStandard={calc.standardIds && calc.standardIds.length > 0}
								/>
							))}
						</div>
					</div>
				)}

				{/* Recommended Calculators */}
				{recommendedCalculators.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Recommended for You
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{recommendedCalculators.map((calc) => (
								<CalculatorCard
									key={calc.id}
									calculator={calc}
									locale={locale}
									hasStandard={calc.standardIds && calc.standardIds.length > 0}
								/>
							))}
						</div>
					</div>
				)}

				{/* Categories */}
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Browse by Category
					</h2>
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<Link
								key={category}
								href={`/${locale}/calculators/${category}`}
								className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors capitalize"
							>
								{category}
							</Link>
						))}
					</div>
				</div>

				{/* Table of Contents by Category */}
				<div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Table of Contents
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
						{categories.map((category) => (
							<a
								key={category}
								href={`#category-${category}`}
								className="text-sm text-blue-600 hover:text-blue-800 hover:underline capitalize"
							>
								{category}
							</a>
						))}
					</div>
				</div>

				{/* Calculators by category */}
				<div className="space-y-8">
					{categories.map((category) => {
						const categoryCalculators = calculatorsByCategory[category]
						if (categoryCalculators.length === 0) return null

						const popularIds = new Set(popularCalculators.map((c) => c.id))
						const newIds = new Set(newCalculators.map((c) => c.id))

						return (
							<div key={category} id={`category-${category}`}>
								<h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">
									{category}
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
									{categoryCalculators.map((calc) => (
										<CalculatorCard
											key={calc.id}
											calculator={calc}
											locale={locale}
											isPopular={popularIds.has(calc.id)}
											isNew={newIds.has(calc.id)}
											hasStandard={calc.standardIds && calc.standardIds.length > 0}
										/>
									))}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
