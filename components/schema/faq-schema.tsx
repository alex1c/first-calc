/**
 * FAQPage schema component for calculator pages
 * Adds structured data for FAQ sections to enable rich results
 */

import { serializeStructuredData } from '@/lib/structured-data'

interface FaqSchemaProps {
	faq: Array<{ question: string; answer: string }>
}

/**
 * JSON-LD schema for FAQ sections
 * Only include if FAQ items are visible (not hidden)
 */
export function FaqSchema({ faq }: FaqSchemaProps) {
	// Only create schema if there are FAQ items
	if (!faq || faq.length === 0) {
		return null
	}

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: serializeStructuredData(schema) }}
		/>
	)
}



