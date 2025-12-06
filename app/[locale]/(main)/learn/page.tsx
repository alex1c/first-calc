import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { getArticlesByLocale } from '@/data/articles'
import Link from 'next/link'

interface LearnPageProps {
	params: {
		locale: Locale
	}
}

export default function LearnPage({ params }: LearnPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const articles = getArticlesByLocale(locale)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">Learn</h1>
				<p className="text-lg text-gray-600 mb-8">
					Educational articles and guides on calculations and standards
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{articles.map((article) => (
						<Link
							key={article.id}
							href={`/${locale}/learn/${article.slug}`}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
						>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{article.title}
							</h3>
							{article.shortDescription && (
								<p className="text-gray-600 text-sm mb-3">
									{article.shortDescription}
								</p>
							)}
							{article.meta?.publishedDate && (
								<p className="text-xs text-gray-500">
									Published: {new Date(article.meta.publishedDate).toLocaleDateString(locale)}
								</p>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
