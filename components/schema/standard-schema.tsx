import type { StandardDefinition } from '@/lib/standards/types'

interface StandardSchemaProps {
	standard: StandardDefinition
	canonicalUrl: string
}

/**
 * JSON-LD schema for standard pages
 */
export function StandardSchema({
	standard,
	canonicalUrl,
}: StandardSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: standard.title,
		about: standard.country,
		url: canonicalUrl,
		description: standard.shortDescription,
		inLanguage: standard.locale,
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
}

