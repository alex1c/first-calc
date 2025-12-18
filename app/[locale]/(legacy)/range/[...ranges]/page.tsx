import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { parseRangeFromString, parseNestedRanges } from '@/lib/legacy/slugParser'
import { generateRange, validateRange } from '@/lib/legacy/parsers'
import { numberToWordsRu } from '@/lib/numberToWordsRu'
import { numberToWordsEn } from '@/lib/legacy/numberToWordsEn'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'

interface RangePageProps {
	params: {
		locale: Locale
		ranges: string[]
	}
}

export async function generateMetadata({
	params,
}: RangePageProps): Promise<Metadata> {
	const { locale, ranges } = params

	// Join ranges with / for display (e.g., "10000-19999" or "210000-219999/213500-213549")
	const rangeString = ranges.join('/')
	const parsed = parseRangeFromString(rangeString)

	let title = `Range ${rangeString} – calculator`
	let description = `Range-based calculator for ${rangeString}. Convert numbers to words in Russian and English.`

	if (parsed) {
		title = `Range ${parsed.start}-${parsed.end} – calculator`
		description = `Convert numbers from ${parsed.start} to ${parsed.end} to words in Russian and English.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !parsed || parsed.end - parsed.start <= 500

	// Build canonical URL (without /en prefix for default locale)
	const canonicalPath = locale === 'en' ? `/range/${rangeString}` : `/${locale}/range/${rangeString}`

	return {
		title,
		description,
		keywords: 'range, calculator, numbers, words, russian, english',
		robots: shouldIndex ? 'index, follow' : 'noindex, nofollow',
		alternates: {
			languages: {
				en: `/range/${rangeString}`,
				ru: `/ru/range/${rangeString}`,
				es: `/es/range/${rangeString}`,
				tr: `/tr/range/${rangeString}`,
				hi: `/hi/range/${rangeString}`,
			},
			canonical: canonicalPath,
		},
	}
}

export default function RangePage({ params }: RangePageProps) {
	const { locale, ranges } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Join ranges with / for parsing (e.g., "10000-19999" or "210000-219999/213500-213549")
	const rangeString = ranges.join('/')

	// Parse range (handle nested ranges)
	// For single range like "10000-19999", parseRangeFromString works
	// For nested ranges like "210000-219999/213500-213549", parseNestedRanges handles it
	const parsed = parseRangeFromString(rangeString)
	const nestedRanges = parseNestedRanges(ranges)

	if (!parsed) {
		return (
			<LegacyPageLayout locale={locale} title="Range Calculator" relatedLinks={false}>
				<ErrorDisplay
					error="Invalid range format. Use: from-to (e.g., 10000-19999)"
					locale={locale}
					examples={[
						{ href: '/range/10000-19999', label: 'Example: /range/10000-19999' },
						{ href: '/range/1-100', label: 'Example: /range/1-100' },
					]}
				/>
			</LegacyPageLayout>
		)
	}

	// Validate and limit range size
	const validation = validateRange(parsed.start, parsed.end, 0, 999_999_999, 500)
	if (!validation.valid) {
		return (
			<LegacyPageLayout locale={locale} title="Range Calculator" relatedLinks={false}>
				<ErrorDisplay
					error={validation.error || 'Invalid range'}
					locale={locale}
					examples={[{ href: '/range/10000-19999', label: 'Example: /range/10000-19999' }]}
				/>
			</LegacyPageLayout>
		)
	}

	const numbers = generateRange(parsed.start, parsed.end, 500)
	const title = `Range: ${parsed.start} - ${parsed.end}`

	// Prepare table data
	const tableData = numbers.map((num) => {
		let ruWords = ''
		let enWords = ''

		try {
			if (num <= 999_999_999) {
				ruWords = numberToWordsRu(num)
			} else {
				ruWords = 'Out of range'
			}
		} catch {
			ruWords = 'Error'
		}

		try {
			if (num <= 999_999_999_999) {
				enWords = numberToWordsEn(num)
			} else {
				enWords = 'Out of range'
			}
		} catch {
			enWords = 'Error'
		}

		return {
			number: num.toLocaleString('en-US'),
			propisRu: ruWords,
			propisEn: enWords,
		}
	})

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			<ResultsTable
				columns={[
					{ header: 'Number', key: 'number' },
					{ header: 'Пропись (RU)', key: 'propisRu' },
					{ header: 'Words (EN)', key: 'propisEn' },
				]}
				data={tableData}
			/>

			<LegacyFaqBlock faq={getFaqForLegacyTool('range')} />
			<LegacyRelatedLinks locale={locale} toolType="range" />
		</LegacyPageLayout>
	)
}

