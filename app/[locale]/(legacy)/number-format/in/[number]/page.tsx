import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { formatIndianNumber } from '@/lib/numberFormat'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { UseCasesBlock } from '@/components/legacy/use-cases-block'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'
import {
	getLegacyTitle,
	getLegacyDescription,
	getLegacyOgTitle,
	getLegacyOgDescription,
	getLegacyContent,
} from '@/lib/legacy/content'

interface NumberFormatInPageProps {
	params: {
		locale: Locale
		number: string
	}
}

export async function generateMetadata({
	params,
}: NumberFormatInPageProps): Promise<Metadata> {
	const { locale, number } = params

	const ogTitle = getLegacyOgTitle('number-format', locale)
	const ogDescription = getLegacyOgDescription('number-format', locale)
	const content = getLegacyContent('number-format', locale)

	return {
		title: `Indian Number Format - ${number} – calculator`,
		description: `Convert ${number} to Indian number format (lakhs and crores). Compare with US format.`,
		keywords: content?.keywords[locale]?.join(', ') || 'indian number format, lakh, crore, number formatting',
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
				en: `/en/number-format/in/${number}`,
				ru: `/ru/number-format/in/${number}`,
				es: `/es/number-format/in/${number}`,
				tr: `/tr/number-format/in/${number}`,
				hi: `/hi/number-format/in/${number}`,
			},
			canonical: `/${locale}/number-format/in/${number}`,
		},
	}
}

export default function NumberFormatInPage({
	params,
}: NumberFormatInPageProps) {
	const { locale, number } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const parsedNumber = parseFloat(number)

	if (isNaN(parsedNumber) || !Number.isFinite(parsedNumber)) {
		return (
			<LegacyPageLayout
				locale={locale}
				title="Indian Number Format"
				relatedLinks={false}
			>
				<ErrorDisplay
					error="Invalid number format"
					locale={locale}
					examples={[
						{
							href: '/number-format/in/1234567',
							label: 'Example: /number-format/in/1234567',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	const indianFormat = formatIndianNumber(parsedNumber)
	const usFormat = new Intl.NumberFormat('en-US').format(parsedNumber)
	const content = getLegacyContent('number-format', locale)

	return (
		<LegacyPageLayout locale={locale} title="Indian Number Format" relatedLinks={false}>
			<ResultsTable
				columns={[
					{ header: 'Original', key: 'original' },
					{ header: 'Indian Format', key: 'indian' },
					{ header: 'US Format', key: 'us' },
				]}
				data={[
					{
						original: parsedNumber.toLocaleString('en-US'),
						indian: indianFormat,
						us: usFormat,
					},
				]}
			/>

			{/* Text content */}
			{content && content.text[locale] && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					{content.text[locale].map((paragraph, index) => (
						<p key={index} className="text-gray-700 mb-4 last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			)}

			{/* Use cases */}
			{content && content.useCases[locale] && (
				<UseCasesBlock useCases={content.useCases[locale]} locale={locale} />
			)}

			<LegacyFaqBlock faq={getFaqForLegacyTool('number-format-in')} />
			<LegacyRelatedLinks locale={locale} toolType="number-format-in" />
		</LegacyPageLayout>
	)
}
