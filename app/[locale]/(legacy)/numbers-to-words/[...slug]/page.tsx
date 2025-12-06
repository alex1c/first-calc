import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { numberToWordsEn } from '@/lib/legacy/numberToWordsEn'
import { parseSingleNumber, parseRange } from '@/lib/legacy/slugParser'
import { generateRange, validateRange } from '@/lib/legacy/parsers'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyExamplesBlock } from '@/components/legacy/examples-block'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import {
	getFaqForLegacyTool,
	getExamplesForLegacyTool,
} from '@/lib/legacy/faqExamples'

interface NumbersToWordsPageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

export async function generateMetadata({
	params,
}: NumbersToWordsPageProps): Promise<Metadata> {
	const { locale, slug } = params

	const singleNumber = parseSingleNumber(slug)
	const range = parseRange(slug)

	let title = 'Numbers to Words Converter - Calculator Portal'
	let description =
		'Convert numbers to words in English. Transform any number from 0 to 999,999,999,999 into its word representation.'

	if (singleNumber !== null) {
		title = `${singleNumber} in words – number to words converter`
		description = `Convert ${singleNumber} to English words. ${singleNumber} in words is "${numberToWordsEn(singleNumber)}".`
	} else if (range) {
		title = `Numbers ${range.start} to ${range.end} in words – converter`
		description = `Convert numbers from ${range.start} to ${range.end} to English words.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !range || range.end - range.start <= 999

	return {
		title,
		description,
		keywords: 'numbers to words, number converter, english, text representation',
		robots: shouldIndex ? 'index, follow' : 'noindex, nofollow',
		alternates: {
			languages: {
				en: `/en/numbers-to-words/${slug.join('/')}`,
				ru: `/ru/numbers-to-words/${slug.join('/')}`,
				es: `/es/numbers-to-words/${slug.join('/')}`,
				tr: `/tr/numbers-to-words/${slug.join('/')}`,
				hi: `/hi/numbers-to-words/${slug.join('/')}`,
			},
			canonical: `/${locale}/numbers-to-words/${slug.join('/')}`,
		},
	}
}

export default function NumbersToWordsPage({
	params,
}: NumbersToWordsPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const singleNumber = parseSingleNumber(slug)
	const range = parseRange(slug)

	// Handle single number
	if (singleNumber !== null && !range) {
		// Validate range
		if (singleNumber < 0 || singleNumber > 999_999_999_999) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Numbers to Words"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={`Number ${singleNumber} is out of range (0-999,999,999,999)`}
						locale={locale}
						examples={[
							{
								href: '/numbers-to-words/123',
								label: 'Example: /numbers-to-words/123',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		// Convert single number
		let wordRepresentation: string
		try {
			wordRepresentation = numberToWordsEn(singleNumber)
		} catch (error) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Numbers to Words"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={
							error instanceof Error ? error.message : 'Conversion error'
						}
						locale={locale}
						examples={[
							{
								href: '/numbers-to-words/123',
								label: 'Example: /numbers-to-words/123',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		const title = `Number ${singleNumber} in words`

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				{/* Result block */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					<div className="text-center">
						<p className="text-sm text-gray-500 mb-2">Number</p>
						<p className="text-4xl font-bold text-gray-900 mb-4">
							{singleNumber.toLocaleString('en-US')}
						</p>
						<p className="text-sm text-gray-500 mb-2">In Words</p>
						<p className="text-3xl font-semibold text-blue-600">
							{wordRepresentation}
						</p>
					</div>
				</div>

				{/* Examples */}
				<LegacyExamplesBlock
					examples={getExamplesForLegacyTool('numbers-to-words')}
					locale={locale}
				/>

				{/* FAQ */}
				<LegacyFaqBlock faq={getFaqForLegacyTool('numbers-to-words')} />

				{/* Related links */}
				<LegacyRelatedLinks locale={locale} toolType="numbers-to-words" />
			</LegacyPageLayout>
		)
	}

	// Handle range
	if (range) {
		// Validate range
		const validation = validateRange(range.start, range.end, 0, 999_999_999_999, 200)
		if (!validation.valid) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Numbers to Words"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={validation.error || 'Invalid range'}
						locale={locale}
						examples={[
							{
								href: '/numbers-to-words/100-199',
								label: 'Range example: /numbers-to-words/100-199',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		// Generate numbers (max 200)
		const numbers = generateRange(range.start, range.end, 200)

		const title = `Numbers from ${range.start} to ${range.end} in words`

		// Prepare table data
		const tableData = numbers.map((num) => {
			let wordRepresentation: string
			try {
				wordRepresentation = numberToWordsEn(num)
			} catch (error) {
				wordRepresentation =
					error instanceof Error ? error.message : 'Conversion error'
			}

			return {
				number: num.toLocaleString('en-US'),
				words: wordRepresentation,
			}
		})

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				<ResultsTable
					columns={[
						{ header: 'Number', key: 'number' },
						{ header: 'In Words', key: 'words' },
					]}
					data={tableData}
				/>

				{/* Examples */}
				<LegacyExamplesBlock
					examples={getExamplesForLegacyTool('numbers-to-words')}
					locale={locale}
				/>

				{/* FAQ */}
				<LegacyFaqBlock faq={getFaqForLegacyTool('numbers-to-words')} />

				{/* Related links */}
				<LegacyRelatedLinks locale={locale} toolType="numbers-to-words" />
			</LegacyPageLayout>
		)
	}

	// Error case
	return (
		<LegacyPageLayout locale={locale} title="Numbers to Words" relatedLinks={false}>
			<ErrorDisplay
				error="Invalid input format"
				locale={locale}
				examples={[
					{ href: '/numbers-to-words/123', label: 'Example: /numbers-to-words/123' },
					{
						href: '/numbers-to-words/100-199',
						label: 'Range example: /numbers-to-words/100-199',
					},
				]}
			/>
		</LegacyPageLayout>
	)
}
