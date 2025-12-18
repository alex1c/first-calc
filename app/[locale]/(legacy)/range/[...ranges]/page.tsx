import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
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
import {
	splitRangeIntoChunks,
	splitNestedRangesIntoChunks,
	findChunkIndex,
} from '@/lib/legacy/rangeChunks'
import { rangeCache } from '@/lib/legacy/rangeCache'

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

	// Check if range is too large (will show chunks instead of table)
	const rangeSize = parsed ? parsed.end - parsed.start + 1 : 0
	const isLargeRange = rangeSize > 500

	// Build canonical URL (without /en prefix for default locale)
	// For old format URLs (without /range/), use the same format
	const canonicalPath = locale === 'en' ? `/${rangeString}` : `/${locale}/${rangeString}`

	return {
		title,
		description,
		keywords: 'range, calculator, numbers, words, russian, english',
		// Always index,follow for range pages (both chunks and overview)
		robots: 'index, follow',
		alternates: {
			languages: {
				en: `/${rangeString}`,
				ru: `/ru/${rangeString}`,
				es: `/es/${rangeString}`,
				tr: `/tr/${rangeString}`,
				hi: `/hi/${rangeString}`,
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

	// Validate range bounds (but not size - we'll handle large ranges differently)
	const boundsValidation = validateRange(parsed.start, parsed.end, 0, 999_999_999, Infinity)
	if (!boundsValidation.valid) {
		return (
			<LegacyPageLayout locale={locale} title="Range Calculator" relatedLinks={false}>
				<ErrorDisplay
					error={boundsValidation.error || 'Invalid range'}
					locale={locale}
					examples={[{ href: '/10000-19999', label: 'Example: /10000-19999' }]}
				/>
			</LegacyPageLayout>
		)
	}

	const rangeSize = parsed.end - parsed.start + 1
	const MAX_RANGE_SIZE = 500

	// If range is too large, show chunks instead of table
	if (rangeSize > MAX_RANGE_SIZE) {
		// Try to get chunks from cache
		let chunks = rangeCache.getChunks(locale, parsed.start, parsed.end)

		if (!chunks) {
			// Handle nested ranges: split only the last segment
			const nestedRanges = parseNestedRanges(ranges)

			if (nestedRanges.length > 1) {
				// For nested ranges, split only the last segment
				chunks = splitNestedRangesIntoChunks(nestedRanges, MAX_RANGE_SIZE)
			} else {
				// For single range, split normally
				chunks = splitRangeIntoChunks(parsed.start, parsed.end, MAX_RANGE_SIZE)
			}

			// Cache chunks list (1 day TTL)
			rangeCache.setChunks(locale, parsed.start, parsed.end, chunks, 24 * 60 * 60 * 1000)
		}

		const title = `Range: ${parsed.start} - ${parsed.end} (${rangeSize} numbers)`
		const basePath = locale === 'en' ? '' : `/${locale}`

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				{/* Range too large message */}
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
					<h2 className="text-xl font-semibold text-yellow-900 mb-2">
						{locale === 'ru' ? 'Диапазон слишком большой' : 'Range too large'}
					</h2>
					<p className="text-yellow-800">
						{locale === 'ru'
							? `Диапазон содержит ${rangeSize.toLocaleString()} чисел. Выберите поддиапазон для просмотра:`
							: `This range contains ${rangeSize.toLocaleString()} numbers. Please select a sub-range to view:`}
					</p>
				</div>

				{/* Chunks list */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						{locale === 'ru' ? 'Поддиапазоны' : 'Sub-ranges'}
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{chunks.map((chunk, index) => {
							const chunkSize = chunk.end - chunk.start + 1
							return (
								<Link
									key={index}
									href={`${basePath}${chunk.url}`}
									className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
								>
									<div className="font-medium text-gray-900">
										{chunk.start.toLocaleString()} - {chunk.end.toLocaleString()}
									</div>
									<div className="text-sm text-gray-600 mt-1">
										{chunkSize} {locale === 'ru' ? 'чисел' : 'numbers'}
									</div>
								</Link>
							)
						})}
					</div>
				</div>

				<LegacyFaqBlock faq={getFaqForLegacyTool('range')} />
				<LegacyRelatedLinks locale={locale} toolType="range" />
			</LegacyPageLayout>
		)
	}

	// Range is small enough - show table
	// Try to get table data from cache
	let tableData = rangeCache.getTable(locale, parsed.start, parsed.end)

	if (!tableData) {
		// Generate table data
		const numbers = generateRange(parsed.start, parsed.end, MAX_RANGE_SIZE)

		tableData = numbers.map((num) => {
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

		// Cache table data (1 day TTL)
		rangeCache.setTable(locale, parsed.start, parsed.end, tableData, 24 * 60 * 60 * 1000)
	}

	const title = `Range: ${parsed.start} - ${parsed.end}`

	// For small ranges, add navigation to adjacent chunks if this looks like a chunk
	// (i.e., if the range size is exactly MAX_RANGE_SIZE, it's likely a chunk)
	const basePath = locale === 'en' ? '' : `/${locale}`
	let previousChunk: { url: string; label: string } | null = null
	let nextChunk: { url: string; label: string } | null = null

	// Only show navigation if this looks like a chunk (exact MAX_RANGE_SIZE)
	// or if it's a small range that might be part of a larger one
	const isLikelyChunk = rangeSize === MAX_RANGE_SIZE || (rangeSize < MAX_RANGE_SIZE && parsed.start % MAX_RANGE_SIZE === 0)

	if (isLikelyChunk && parsed.start > 0) {
		const prevStart = Math.max(0, parsed.start - MAX_RANGE_SIZE)
		const prevEnd = parsed.start - 1
		if (prevEnd >= prevStart && prevEnd - prevStart + 1 <= MAX_RANGE_SIZE) {
			previousChunk = {
				url: `${basePath}/${prevStart}-${prevEnd}`,
				label: `${prevStart.toLocaleString()} - ${prevEnd.toLocaleString()}`,
			}
		}
	}

	// Add next chunk link (only if this looks like a chunk)
	if (isLikelyChunk) {
		const nextStart = parsed.end + 1
		const nextEnd = nextStart + MAX_RANGE_SIZE - 1
		nextChunk = {
			url: `${basePath}/${nextStart}-${nextEnd}`,
			label: `${nextStart.toLocaleString()} - ${nextEnd.toLocaleString()}`,
		}
	}

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			{/* Navigation between chunks */}
			{(previousChunk || nextChunk) && (
				<div className="flex justify-between items-center mb-6 bg-gray-50 rounded-lg p-4">
					{previousChunk ? (
						<Link
							href={previousChunk.url}
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							← {locale === 'ru' ? 'Предыдущий' : 'Previous'} chunk: {previousChunk.label}
						</Link>
					) : (
						<div></div>
					)}
					{nextChunk && (
						<Link
							href={nextChunk.url}
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							{locale === 'ru' ? 'Следующий' : 'Next'} chunk: {nextChunk.label} →
						</Link>
					)}
				</div>
			)}

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

