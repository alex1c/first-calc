import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { loadNamespaces, createT } from '@/lib/i18n'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { PercentageForm } from '@/components/legacy/percentage-form'
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
import { primaryLocalePageMetadata } from '@/lib/seo/limited-locale-metadata'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const
const formNamespaces = ['legacy/ui', 'errors'] as const

interface PercentageOfANumberLandingPageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: PercentageOfANumberLandingPageProps): Promise<Metadata> {
	const { locale } = params

	const title = getLegacyTitle('percentage-of-a-number', locale)
	const description = getLegacyDescription('percentage-of-a-number', locale)
	const ogTitle = getLegacyOgTitle('percentage-of-a-number', locale)
	const ogDescription = getLegacyOgDescription('percentage-of-a-number', locale)

	return {
		title: `${title} - First Calc`,
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
		...primaryLocalePageMetadata(locale, '/percentage-of-a-number'),
	}
}

export default async function PercentageOfANumberLandingPage({
	params,
}: PercentageOfANumberLandingPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs + hydrate client form
	const dict = await loadNamespaces(locale, namespaces)
	const formDict = await loadNamespaces(locale, formNamespaces)
	const t = createT(dict)

	// Get content
	const content = getLegacyContent('percentage-of-a-number', locale)
	const title = getLegacyTitle('percentage-of-a-number', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(
		locale,
		'percentage-of-a-number',
		[],
		t,
		title,
	)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={true}
			toolType="percentage-of-a-number"
			breadcrumbs={breadcrumbs}
		>
			{/* Description */}
			{content && content.text[contentLocale] && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					{content.text[contentLocale].map((paragraph, index) => (
						<p key={index} className="text-gray-700 mb-4 last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			)}

			{/* Form */}
			<PercentageForm
				locale={locale}
				toolSlug="percentage-of-a-number"
				initialDict={formDict}
				exampleLinks={[
					{ href: '/percentage-of-a-number/100/20', label: '/percentage-of-a-number/100/20' },
					{ href: '/percentage-of-a-number/500/15', label: '/percentage-of-a-number/500/15' },
					{ href: '/percentage-of-a-number/1000/25', label: '/percentage-of-a-number/1000/25' },
				]}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('percentage-of-a-number')} />
		</LegacyPageLayout>
	)
}
