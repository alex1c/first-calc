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
import { CalculatorCard } from '@/components/calculators/calculator-card'

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
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8 prose prose-lg max-w-none
						prose-headings:font-bold prose-headings:text-gray-900
						prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
						prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800
						prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
						prose-ul:my-4 prose-ul:space-y-2
						prose-ol:my-4 prose-ol:space-y-2
						prose-li:text-gray-700 prose-li:leading-relaxed
						prose-strong:text-gray-900 prose-strong:font-semibold
						prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
						prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
						prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
						prose-table:w-full prose-table:my-6
						prose-th:bg-gray-100 prose-th:font-semibold prose-th:p-3 prose-th:text-left
						prose-td:p-3 prose-td:border-t prose-td:border-gray-200"
					dangerouslySetInnerHTML={{ __html: article.contentHtml }}
				/>

				{/* Try the Calculator */}
				{relatedCalculators.length > 0 && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Try the Calculator
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{relatedCalculators.slice(0, 3).map((calc) => (
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
