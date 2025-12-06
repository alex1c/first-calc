import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { formatIndianNumber } from '@/lib/numberFormat'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'

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

	return {
		title: `Indian Number Format - ${number} – calculator`,
		description: `Convert ${number} to Indian number format (lakhs and crores). Compare with US format.`,
		keywords: 'indian number format, lakh, crore, number formatting',
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

			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">
					About Indian Number Format
				</h2>
				<p className="text-gray-700 mb-4">
					The Indian numbering system uses lakhs (100,000) and crores
					(10,000,000) as grouping units. After the first three digits from
					the right, numbers are grouped in sets of two digits.
				</p>
				<ul className="space-y-2 text-gray-700">
					<li>
						<strong>1,00,000</strong> = One Lakh
					</li>
					<li>
						<strong>1,00,00,000</strong> = One Crore
					</li>
				</ul>
			</div>

			<LegacyFaqBlock faq={getFaqForLegacyTool('number-format-in')} />
			<LegacyRelatedLinks locale={locale} toolType="number-format-in" />
		</LegacyPageLayout>
	)
}
