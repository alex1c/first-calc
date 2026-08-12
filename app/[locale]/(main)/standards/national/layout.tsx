import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

export function generateMetadata({
	params,
}: {
	params: { locale: Locale }
}): Metadata {
	// National-standard pages currently contain authored EN content plus a limited
	// RU subset. Other locale routes remain usable through product fallback but
	// must not be presented to search engines as translated documents.
	if (params.locale === 'es' || params.locale === 'tr' || params.locale === 'hi') {
		return { robots: { index: false, follow: true } }
	}
	return {}
}

export default function NationalStandardsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
