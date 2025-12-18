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

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface AddSubtractPercentageLandingPageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: AddSubtractPercentageLandingPageProps): Promise<Metadata> {
	const { locale } = params

	const title = getLegacyTitle('add-subtract-percentage', locale)
	const description = getLegacyDescription('add-subtract-percentage', locale)
	const ogTitle = getLegacyOgTitle('add-subtract-percentage', locale)
	const ogDescription = getLegacyOgDescription('add-subtract-percentage', locale)

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
				en: '/add-subtract-percentage',
				ru: '/ru/add-subtract-percentage',
				es: '/es/add-subtract-percentage',
				tr: '/tr/add-subtract-percentage',
				hi: '/hi/add-subtract-percentage',
			},
			canonical: `/${locale}/add-subtract-percentage`,
		},
	}
}

export default async function AddSubtractPercentageLandingPage({
	params,
}: AddSubtractPercentageLandingPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Get content
	const content = getLegacyContent('add-subtract-percentage', locale)
	const title = getLegacyTitle('add-subtract-percentage', locale)

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(
		locale,
		'add-subtract-percentage',
		[],
		t,
		title,
	)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={true}
			toolType="add-subtract-percentage"
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
			<PercentageForm
				locale={locale}
				toolSlug="add-subtract-percentage"
				exampleLinks={[
					{ href: '/add-subtract-percentage/100/20-add', label: '/add-subtract-percentage/100/20-add' },
					{ href: '/add-subtract-percentage/500/15-subtract', label: '/add-subtract-percentage/500/15-subtract' },
					{ href: '/add-subtract-percentage/1000/25-add', label: '/add-subtract-percentage/1000/25-add' },
				]}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('add-subtract-percentage')} />
		</LegacyPageLayout>
	)
}

