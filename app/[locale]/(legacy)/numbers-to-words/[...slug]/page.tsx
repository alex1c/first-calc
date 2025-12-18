import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { numberToWordsEn } from '@/lib/legacy/numberToWordsEn'
import { numberToWordsEnDecimal, numberToWordsRuDecimal } from '@/lib/legacy/decimalToWords'
import { parseSingleNumber, parseRange, parseMoneyFormat } from '@/lib/legacy/slugParser'
import { generateRange, validateRange } from '@/lib/legacy/parsers'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { NumberToWordsForm } from '@/components/legacy/number-to-words-form'
import { LegacyExamplesBlock } from '@/components/legacy/examples-block'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { UseCasesBlock } from '@/components/legacy/use-cases-block'
import {
	getFaqForLegacyTool,
	getExamplesForLegacyTool,
} from '@/lib/legacy/faqExamples'
import {
	getLegacyTitle,
	getLegacyDescription,
	getLegacyOgTitle,
	getLegacyOgDescription,
	getLegacyContent,
} from '@/lib/legacy/content'

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

	const moneyFormat = parseMoneyFormat(slug)
	const singleNumber = moneyFormat ? moneyFormat.number : parseSingleNumber(slug)
	const range = parseRange(slug)

	// Get base content from module
	const baseTitle = getLegacyTitle('numbers-to-words', locale)
	const baseDescription = getLegacyDescription('numbers-to-words', locale)
	const ogTitle = getLegacyOgTitle('numbers-to-words', locale)
	const ogDescription = getLegacyOgDescription('numbers-to-words', locale)
	const content = getLegacyContent('numbers-to-words', locale)

	let title = baseTitle
	let description = baseDescription

	if (singleNumber !== null) {
		try {
			let words = ''
			if (moneyFormat) {
				words = numberToWordsEnDecimal(singleNumber, {
					format: 'money',
					currency: moneyFormat.currency,
				})
			} else if (singleNumber % 1 !== 0) {
				words = numberToWordsEnDecimal(singleNumber, { format: 'numeric' })
			} else {
				words = numberToWordsEn(singleNumber)
			}
			title = `${singleNumber} in words – number to words converter`
			description = `Convert ${singleNumber} to English words. ${singleNumber} in words is "${words}".`
		} catch {
			// Keep default
		}
	} else if (range) {
		title = `Numbers ${range.start} to ${range.end} in words – converter`
		description = `Convert numbers from ${range.start} to ${range.end} to English words.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !range || range.end - range.start <= 999

	return {
		title,
		description,
		keywords: content?.keywords[locale]?.join(', ') || 'numbers to words, number converter, english, text representation',
		robots: shouldIndex ? 'index, follow' : 'noindex, nofollow',
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

	const moneyFormat = parseMoneyFormat(slug)
	const singleNumber = moneyFormat ? moneyFormat.number : parseSingleNumber(slug)
	const range = parseRange(slug)

	// Handle single number
	if (singleNumber !== null && !range) {
		// Validate range (support decimals, so check integer part)
		const integerPart = Math.floor(Math.abs(singleNumber))
		if (singleNumber < 0 || integerPart > 999_999_999_999) {
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

		// Convert single number (support decimals and money format)
		let wordRepresentation: string
		try {
			if (moneyFormat) {
				wordRepresentation = numberToWordsEnDecimal(singleNumber, {
					format: 'money',
					currency: moneyFormat.currency,
				})
			} else if (singleNumber % 1 !== 0) {
				// Decimal number
				wordRepresentation = numberToWordsEnDecimal(singleNumber, {
					format: 'numeric',
				})
			} else {
				// Integer number
				wordRepresentation = numberToWordsEn(singleNumber)
			}
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
		const content = getLegacyContent('numbers-to-words', locale)

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				{/* Form for new conversion - at the top */}
				<div className="mb-8">
					<NumberToWordsForm
						locale={locale}
						toolSlug="numbers-to-words"
						exampleLinks={[
							{ href: '/numbers-to-words/123', label: '/numbers-to-words/123' },
							{ href: '/numbers-to-words/1000', label: '/numbers-to-words/1000' },
							{ href: '/numbers-to-words/555.23-money-usd', label: '/numbers-to-words/555.23-money-usd' },
						]}
					/>
				</div>

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
		const content = getLegacyContent('numbers-to-words', locale)

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

				{/* Examples */}
				<LegacyExamplesBlock
					examples={getExamplesForLegacyTool('numbers-to-words')}
					locale={locale}
				/>

				{/* FAQ */}
				<LegacyFaqBlock faq={getFaqForLegacyTool('numbers-to-words')} />

				{/* Form for new conversion */}
				<div className="mb-8">
					<NumberToWordsForm
						locale={locale}
						toolSlug="numbers-to-words"
						exampleLinks={[
							{ href: '/numbers-to-words/123', label: '/numbers-to-words/123' },
							{ href: '/numbers-to-words/100-199', label: '/numbers-to-words/100-199' },
						]}
					/>
				</div>

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
