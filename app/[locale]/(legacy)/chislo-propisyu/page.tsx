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
const namespaces = ['common', 'navigation'] as const

interface ChisloPropisyuLandingPageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: ChisloPropisyuLandingPageProps): Promise<Metadata> {
	const { locale } = params

	const title = getLegacyTitle('chislo-propisyu', locale)
	const description = getLegacyDescription('chislo-propisyu', locale)
	const ogTitle = getLegacyOgTitle('chislo-propisyu', locale)
	const ogDescription = getLegacyOgDescription('chislo-propisyu', locale)

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
				en: '/chislo-propisyu',
				ru: '/ru/chislo-propisyu',
				es: '/es/chislo-propisyu',
				tr: '/tr/chislo-propisyu',
				hi: '/hi/chislo-propisyu',
			},
			canonical: `/${locale}/chislo-propisyu`,
		},
	}
}

export default async function ChisloPropisyuLandingPage({
	params,
}: ChisloPropisyuLandingPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	// Get content
	const content = getLegacyContent('chislo-propisyu', locale)
	const title = getLegacyTitle('chislo-propisyu', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(locale, 'chislo-propisyu', [], t, title)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={true}
			toolType="chislo-propisyu"
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
			<NumberToWordsForm
				locale={locale}
				toolSlug="chislo-propisyu"
				exampleLinks={[
					{ href: '/chislo-propisyu/123', label: '/chislo-propisyu/123' },
					{ href: '/chislo-propisyu/1000', label: '/chislo-propisyu/1000' },
					{ href: '/chislo-propisyu/1000000', label: '/chislo-propisyu/1000000' },
				]}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('chislo-propisyu')} />
		</LegacyPageLayout>
	)
}

