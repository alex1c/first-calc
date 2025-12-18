/**
 * Category cards component
 * Displays categories as cards with icons, descriptions, and calculator counts
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getCategoryIcon } from '@/lib/navigation/categories'

interface CategoryCardsProps {
	locale: Locale
	categories: Array<{
		slug: string
		count: number
		label: string
		description: string
	}>
}

/**
 * Category cards component
 * Shows categories as cards with descriptions and counts
 */
export function CategoryCards({ locale, categories }: CategoryCardsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
			{categories.map((category) => (
				<Link
					key={category.slug}
					href={`/${locale}/calculators/${category.slug}`}
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
				>
					<div className="flex items-start">
						<div className="text-4xl mr-4 group-hover:scale-110 transition-transform">
							{getCategoryIcon(category.slug)}
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
								{category.label}
							</h3>
							<p className="text-sm text-gray-600 mb-3">
								{category.description}
							</p>
							<div className="text-sm text-blue-600 font-medium">
								{category.count} {category.count === 1 ? 'calculator' : 'calculators'}
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}

