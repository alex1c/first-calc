/**
 * Related articles block component
 * Shows Learn articles related to a calculator
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getRelatedArticlesForCalculator } from '@/lib/navigation/related-articles'

interface RelatedArticlesBlockProps {
	calculatorId: string
	locale: Locale
}

/**
 * Related articles block
 * Displays 1-2 Learn articles related to the calculator
 */
export async function RelatedArticlesBlock({
	calculatorId,
	locale,
}: RelatedArticlesBlockProps) {
	const articles = await getRelatedArticlesForCalculator(calculatorId, locale, 2)
	
	if (articles.length === 0) {
		return null
	}
	
	return (
		<div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				Learn More
			</h2>
			<div className="space-y-4">
				{articles.map((article) => (
					<Link
						key={article.id}
						href={`/${locale}/learn/${article.slug}`}
						className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all"
					>
						<h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-700">
							{article.title}
						</h3>
						{article.shortDescription && (
							<p className="text-gray-600 text-sm">
								{article.shortDescription}
							</p>
						)}
					</Link>
				))}
			</div>
		</div>
	)
}




