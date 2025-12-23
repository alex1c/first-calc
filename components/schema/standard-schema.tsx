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
	// Determine about field based on standard type
	let about: string | string[] = standard.country
	if (standard.id === 'iso-soil-foundations') {
		about = ['soil mechanics', 'geotechnical engineering', 'foundations']
	}

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: standard.title,
		about: about,
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









