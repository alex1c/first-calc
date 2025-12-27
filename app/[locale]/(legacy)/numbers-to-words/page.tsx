import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { loadNamespaces, createT } from '@/lib/i18n'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { NumberToWordsForm } from '@/components/legacy/number-to-words-form'
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
const namespaces = ['common', 'navigation', 'legacy/notices'] as const

interface NumbersToWordsLandingPageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: NumbersToWordsLandingPageProps): Promise<Metadata> {
	const { locale } = params

	const title = getLegacyTitle('numbers-to-words', locale)
	const description = getLegacyDescription('numbers-to-words', locale)
	const ogTitle = getLegacyOgTitle('numbers-to-words', locale)
	const ogDescription = getLegacyOgDescription('numbers-to-words', locale)

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
				en: '/numbers-to-words',
				ru: '/ru/numbers-to-words',
				es: '/es/numbers-to-words',
				tr: '/tr/numbers-to-words',
				hi: '/hi/numbers-to-words',
			},
			canonical: `/${locale}/numbers-to-words`,
		},
	}
}

export default async function NumbersToWordsLandingPage({
	params,
}: NumbersToWordsLandingPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Get content
	const content = getLegacyContent('numbers-to-words', locale)
	const title = getLegacyTitle('numbers-to-words', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(locale, 'numbers-to-words', [], t, title)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={true}
			toolType="numbers-to-words"
			breadcrumbs={breadcrumbs}
		>
			{/* Notice for ES/TR/HI locales */}
			{['es', 'tr', 'hi'].includes(locale) && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
					<p className="text-sm text-yellow-800">
						{t('legacy/notices.numbersToWords.localizedComingSoon')}
					</p>
				</div>
			)}

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
			<NumberToWordsForm
				locale={locale}
				toolSlug="numbers-to-words"
				exampleLinks={[
					{ href: '/numbers-to-words/123', label: '/numbers-to-words/123' },
					{ href: '/numbers-to-words/1000', label: '/numbers-to-words/1000' },
					{ href: '/numbers-to-words/1000000', label: '/numbers-to-words/1000000' },
				]}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('numbers-to-words')} />
		</LegacyPageLayout>
	)
}

