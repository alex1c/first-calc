import { notFound } from 'next/navigation'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getArticlesByLocale } from '@/data/articles'
import Link from 'next/link'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getLearnBreadcrumbs } from '@/lib/navigation/breadcrumbs'

const namespaces = ['common', 'navigation'] as const

interface LearnPageProps {
	params: {
		locale: Locale
	}
}

export default async function LearnPage({ params }: LearnPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	const articles = getArticlesByLocale(locale)

	// Filter math articles (by keywords or title patterns)
	const mathArticles = articles.filter((article) => {
		const keywords = article.meta?.keywords || []
		const title = article.title.toLowerCase()
		const description = (article.shortDescription || '').toLowerCase()
		
		return (
			keywords.some((kw) => ['math', 'geometry', 'algebra', 'statistics', 'percentage'].includes(kw.toLowerCase())) ||
			title.includes('area') ||
			title.includes('perimeter') ||
			title.includes('volume') ||
			title.includes('pythagorean') ||
			title.includes('quadratic') ||
			title.includes('linear') ||
			title.includes('equation') ||
			title.includes('mean') ||
			title.includes('median') ||
			title.includes('mode') ||
			title.includes('standard deviation') ||
			title.includes('percentage')
		)
	})

	// Group math articles by topic
	const geometryArticles = mathArticles.filter((a) => 
		a.title.toLowerCase().includes('area') ||
		a.title.toLowerCase().includes('perimeter') ||
		a.title.toLowerCase().includes('volume') ||
		a.title.toLowerCase().includes('pythagorean')
	)
	const algebraArticles = mathArticles.filter((a) =>
		a.title.toLowerCase().includes('equation') ||
		a.title.toLowerCase().includes('quadratic') ||
		a.title.toLowerCase().includes('linear')
	)
	const statisticsArticles = mathArticles.filter((a) =>
		a.title.toLowerCase().includes('mean') ||
		a.title.toLowerCase().includes('median') ||
		a.title.toLowerCase().includes('mode') ||
		a.title.toLowerCase().includes('standard deviation') ||
		a.title.toLowerCase().includes('dataset')
	)
	const percentageArticles = mathArticles.filter((a) =>
		a.title.toLowerCase().includes('percentage')
	)

	// Generate breadcrumbs
	const breadcrumbs = getLearnBreadcrumbs(locale, t)

	return (
		<>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{t('navigation.breadcrumb.learn')}
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					Educational articles and guides on calculations and standards
				</p>

				{/* Mathematics Section */}
				{mathArticles.length > 0 && (
					<div className="mb-12">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900">Mathematics</h2>
							<Link
								href={`/${locale}/calculators/math`}
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								View Math Calculators →
							</Link>
						</div>
						
						{geometryArticles.length > 0 && (
							<div className="mb-8">
								<h3 className="text-xl font-semibold text-gray-800 mb-4">Geometry</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{geometryArticles.map((article) => (
										<Link
											key={article.id}
											href={`/${locale}/learn/${article.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h4 className="text-lg font-semibold text-gray-900 mb-2">
												{article.title}
											</h4>
											{article.shortDescription && (
												<p className="text-gray-600 text-sm">
													{article.shortDescription}
												</p>
											)}
										</Link>
									))}
								</div>
							</div>
						)}

						{algebraArticles.length > 0 && (
							<div className="mb-8">
								<h3 className="text-xl font-semibold text-gray-800 mb-4">Algebra</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{algebraArticles.map((article) => (
										<Link
											key={article.id}
											href={`/${locale}/learn/${article.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h4 className="text-lg font-semibold text-gray-900 mb-2">
												{article.title}
											</h4>
											{article.shortDescription && (
												<p className="text-gray-600 text-sm">
													{article.shortDescription}
												</p>
											)}
										</Link>
									))}
								</div>
							</div>
						)}

						{statisticsArticles.length > 0 && (
							<div className="mb-8">
								<h3 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{statisticsArticles.map((article) => (
										<Link
											key={article.id}
											href={`/${locale}/learn/${article.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h4 className="text-lg font-semibold text-gray-900 mb-2">
												{article.title}
											</h4>
											{article.shortDescription && (
												<p className="text-gray-600 text-sm">
													{article.shortDescription}
												</p>
											)}
										</Link>
									))}
								</div>
							</div>
						)}

						{percentageArticles.length > 0 && (
							<div className="mb-8">
								<h3 className="text-xl font-semibold text-gray-800 mb-4">Percentages</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{percentageArticles.map((article) => (
										<Link
											key={article.id}
											href={`/${locale}/learn/${article.slug}`}
											className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
										>
											<h4 className="text-lg font-semibold text-gray-900 mb-2">
												{article.title}
											</h4>
											{article.shortDescription && (
												<p className="text-gray-600 text-sm">
													{article.shortDescription}
												</p>
											)}
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Other Articles */}
				{articles.filter((a) => !mathArticles.includes(a)).length > 0 && (
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Other Topics</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{articles.filter((a) => !mathArticles.includes(a)).map((article) => (
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
				)}
			</PageContainer>
		</>
	)
}
