import type { ArticleDefinition } from '@/lib/learn/types'

interface ArticleSchemaProps {
	article: ArticleDefinition
	canonicalUrl: string
}

/**
 * JSON-LD schema for article pages
 */
export function ArticleSchema({ article, canonicalUrl }: ArticleSchemaProps) {
	// Check if article is about Mathematics
	const isMathArticle = article.meta?.keywords?.some((kw) =>
		['math', 'geometry', 'algebra', 'statistics', 'percentage'].includes(kw.toLowerCase())
	) || article.title.toLowerCase().includes('area') ||
		article.title.toLowerCase().includes('perimeter') ||
		article.title.toLowerCase().includes('volume') ||
		article.title.toLowerCase().includes('pythagorean') ||
		article.title.toLowerCase().includes('quadratic') ||
		article.title.toLowerCase().includes('equation') ||
		article.title.toLowerCase().includes('mean') ||
		article.title.toLowerCase().includes('median') ||
		article.title.toLowerCase().includes('standard deviation') ||
		article.title.toLowerCase().includes('percentage')

	// Check if article is educational (for students, early-stage planners, non-engineers)
	const isEducationalArticle = article.meta?.keywords?.some((kw) =>
		['educational', 'educational comparison', 'students', 'concepts', 'design concepts'].includes(kw.toLowerCase())
	) || article.title.toLowerCase().includes('educational') ||
		article.title.toLowerCase().includes('concepts') ||
		article.slug.includes('vs') ||
		article.slug.includes('comparison')

	// Check if article is about calculators and standards
	const isCalculatorStandardsArticle = article.meta?.keywords?.some((kw) =>
		['calculators', 'standards', 'engineering education', 'abstraction'].includes(kw.toLowerCase())
	) || article.slug.includes('calculators') ||
		article.slug.includes('standards')

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		author: {
			'@type': 'Organization',
			name: article.meta?.author || 'Calculator Portal',
		},
		inLanguage: article.locale,
		url: canonicalUrl,
		description: article.shortDescription || article.title,
		datePublished: article.meta?.publishedDate,
		...(isMathArticle && {
			about: {
				'@type': 'Thing',
				name: 'Mathematics',
			},
		}),
		...(isEducationalArticle && {
			audience: {
				'@type': 'EducationalAudience',
				educationalRole: ['student', 'learner'],
			},
		}),
		...(isCalculatorStandardsArticle && {
			about: [
				{
					'@type': 'Thing',
					name: 'Calculators',
				},
				{
					'@type': 'Thing',
					name: 'Standards',
				},
				{
					'@type': 'Thing',
					name: 'Engineering Education',
				},
			],
		}),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
}






