import type { BreadcrumbItem } from '@/components/navigation/breadcrumbs'
import { serializeStructuredData } from '@/lib/structured-data'
import { getSiteOrigin } from '@/lib/site-url'

interface BreadcrumbSchemaProps {
	items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
	if (items.length === 0) return null

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			item: new URL(item.href, getSiteOrigin()).toString(),
		})),
	}

	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(schema) }} />
}
