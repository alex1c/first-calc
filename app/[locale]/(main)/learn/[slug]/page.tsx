import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { articleRegistry, calculatorRegistry, standardRegistry } from '@/lib/registry/loader'
import { generateFaq } from '@/lib/faq/generator'
import { ArticleSchema } from '@/components/schema/article-schema'
import Link from 'next/link'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getLearnBreadcrumbs } from '@/lib/navigation/breadcrumbs'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface ArticlePageProps {
	params: {
		locale: Locale
		slug: string
	}
}

export async function generateMetadata({
	params,
}: ArticlePageProps): Promise<Metadata> {
	const { locale, slug } = params

	const article = await articleRegistry.getBySlug(slug, locale)

	if (!article) {
		return {
			title: 'Article Not Found',
		}
	}

	const keywords = article.meta?.keywords || []
	const keywordsString = keywords.join(', ')

	return {
		title: `${article.title} - Calculator Portal`,
		description: article.shortDescription || article.title,
		keywords: keywordsString,
		alternates: {
			languages: {
				en: `/en/learn/${slug}`,
				ru: `/ru/learn/${slug}`,
				es: `/es/learn/${slug}`,
				tr: `/tr/learn/${slug}`,
				hi: `/hi/learn/${slug}`,
			},
			canonical: `/${locale}/learn/${slug}`,
		},
	}
}

export default async function ArticlePage({ params }: ArticlePageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const article = await articleRegistry.getBySlug(slug, locale)

	if (!article) {
		notFound()
	}

	const relatedCalculators = article.relatedCalculatorIds
		? await Promise.all(
				article.relatedCalculatorIds.map((id) =>
					calculatorRegistry.getById(id, locale),
				),
			).then((calcs) => calcs.filter((c): c is NonNullable<typeof c> => c !== undefined))
		: []

	const relatedStandards = article.relatedStandardIds
		? await Promise.all(
				article.relatedStandardIds.map((id) =>
					standardRegistry.getById(id, locale),
				),
			).then((stds) => stds.filter((s): s is NonNullable<typeof s> => s !== undefined))
		: []

	// Generate FAQ based on article topic
	const faqItems = generateFaq(article.title, locale)
	const canonicalUrl = `https://first-calc.com/${locale}/learn/${slug}`

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Generate breadcrumbs
	const breadcrumbs = getLearnBreadcrumbs(locale, slug, article.title, t)

	return (
		<>
			<ArticleSchema article={article} canonicalUrl={canonicalUrl} />
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>

				{/* Header */}
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{article.title}
				</h1>
				{article.shortDescription && (
					<p className="text-lg text-gray-600 mb-8">
						{article.shortDescription}
					</p>
				)}

				{/* Content */}
				<div
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 prose max-w-none"
					dangerouslySetInnerHTML={{ __html: article.contentHtml }}
				/>

				{/* Related Calculators */}
				{relatedCalculators.length > 0 && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Related Calculators
						</h2>
						<ul className="space-y-2">
							{relatedCalculators.map((calc) => (
								<li key={calc.id}>
									<Link
										href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
										className="text-blue-600 hover:text-blue-800 underline"
									>
										{calc.title}
									</Link>
									{calc.shortDescription && (
										<p className="text-sm text-gray-600 ml-4">
											{calc.shortDescription}
										</p>
									)}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Related Standards */}
				{relatedStandards.length > 0 && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Related Standards
						</h2>
						<ul className="space-y-2">
							{relatedStandards.map((std) => (
								<li key={std.id}>
									<Link
										href={`/${locale}/standards/${std.country}/${std.slug}`}
										className="text-blue-600 hover:text-blue-800 underline"
									>
										{std.title}
									</Link>
									{std.shortDescription && (
										<p className="text-sm text-gray-600 ml-4">
											{std.shortDescription}
										</p>
									)}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* FAQ */}
				{faqItems.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Frequently Asked Questions
						</h2>
						<div className="space-y-4">
							{faqItems.map((item, index) => (
								<div key={index} className="border-b border-gray-200 pb-4 last:border-0">
									<h3 className="font-medium text-gray-900 mb-2">
										{item.question}
									</h3>
									<p className="text-gray-700">{item.answer}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</PageContainer>
		</>
	)
}
