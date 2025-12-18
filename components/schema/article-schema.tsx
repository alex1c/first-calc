import type { ArticleDefinition } from '@/lib/learn/types'

interface ArticleSchemaProps {
	article: ArticleDefinition
	canonicalUrl: string
}

/**
 * JSON-LD schema for article pages
 */
export function ArticleSchema({ article, canonicalUrl }: ArticleSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		author: {
			'@type': 'Organization',
			name: article.meta?.author || 'FirstCalc',
		},
		inLanguage: article.locale,
		url: canonicalUrl,
		description: article.shortDescription || article.title,
		datePublished: article.meta?.publishedDate,
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
}






