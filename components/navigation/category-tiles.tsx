/**
 * Category tiles component
 * Displays categories as tiles in a grid at the top of the calculators page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getCategoryIcon } from '@/lib/navigation/categories'

interface CategoryTileProps {
	locale: Locale
	categories: Array<{
		id: string
		title: string
		description?: string
		calcCount: number
		iconKey: string
	}>
}

/**
 * Category tiles component
 * Shows categories as tiles with icons, titles, descriptions, and calculator counts
 */
export function CategoryTiles({ locale, categories }: CategoryTileProps) {
	const basePath = locale === 'en' ? '' : `/${locale}`
	
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
			{categories.map((category) => (
				<Link
					key={category.id}
					href={`${basePath}/calculators/${category.id}`}
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
				>
					<div className="flex flex-col items-center text-center">
						<div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
							{category.iconKey}
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
							{category.title}
						</h3>
						{category.description && (
							<p className="text-sm text-gray-600 mb-3 line-clamp-2">
								{category.description}
							</p>
						)}
						<div className="text-sm text-blue-600 font-medium">
							{category.calcCount} {category.calcCount === 1 ? 'calculator' : 'calculators'}
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}



