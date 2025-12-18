import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { loadNamespaces, createT } from '@/lib/i18n'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { RomanNumeralsForm } from '@/components/legacy/roman-numerals-form'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import {
	getLegacyTitle,
	getLegacyDescription,
	getLegacyOgTitle,
	getLegacyOgDescription,
	getLegacyContent,
} from '@/lib/legacy/content'
import { getLegacyBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface RomanNumeralsConverterLandingPageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: RomanNumeralsConverterLandingPageProps): Promise<Metadata> {
	const { locale } = params

	const title = getLegacyTitle('roman-numerals-converter', locale)
	const description = getLegacyDescription('roman-numerals-converter', locale)
	const ogTitle = getLegacyOgTitle('roman-numerals-converter', locale)
	const ogDescription = getLegacyOgDescription('roman-numerals-converter', locale)

	return {
		title: `${title} - Calculator Portal`,
		description,
		openGraph: {
			title: ogTitle,
			description: ogDescription,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: ogTitle,
			description: ogDescription,
		},
		alternates: {
			languages: {
				en: '/roman-numerals-converter',
				ru: '/ru/roman-numerals-converter',
				es: '/es/roman-numerals-converter',
				tr: '/tr/roman-numerals-converter',
				hi: '/hi/roman-numerals-converter',
			},
			canonical: `/${locale}/roman-numerals-converter`,
		},
	}
}

export default async function RomanNumeralsConverterLandingPage({
	params,
}: RomanNumeralsConverterLandingPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Get content
	const content = getLegacyContent('roman-numerals-converter', locale)
	const title = getLegacyTitle('roman-numerals-converter', locale)

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(
		locale,
		'roman-numerals-converter',
		[],
		t,
		title,
	)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={true}
			toolType="roman-numerals-converter"
			breadcrumbs={breadcrumbs}
		>
			{/* Description */}
			{content && content.text[locale] && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					{content.text[locale].map((paragraph, index) => (
						<p key={index} className="text-gray-700 mb-4 last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			)}

			{/* Form */}
			<RomanNumeralsForm
				locale={locale}
				exampleLinks={[
					{ href: '/roman-numerals-converter/123', label: '/roman-numerals-converter/123' },
					{ href: '/roman-numerals-converter/XII', label: '/roman-numerals-converter/XII' },
					{ href: '/roman-numerals-converter/MMXXIV', label: '/roman-numerals-converter/MMXXIV' },
				]}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('roman-numerals-converter')} />
		</LegacyPageLayout>
	)
}

