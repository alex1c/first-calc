import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { toRoman, fromRoman } from '@/lib/legacy/roman'
import { parseRoman } from '@/lib/legacy/slugParser'
import { parseRange } from '@/lib/legacy/slugParser'
import { generateRange, validateRange } from '@/lib/legacy/parsers'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'

interface RomanNumeralsConverterPageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

export async function generateMetadata({
	params,
}: RomanNumeralsConverterPageProps): Promise<Metadata> {
	const { locale, slug } = params

	const romanParsed = parseRoman(slug)
	const range = parseRange(slug)

	let title = 'Roman Numerals Converter - Calculator Portal'
	let description =
		'Convert between Arabic numbers and Roman numerals. Supports numbers from 1 to 3999 with bidirectional conversion.'

	if (romanParsed) {
		if (romanParsed.roman) {
			try {
				const arabic = fromRoman(romanParsed.roman)
				title = `${romanParsed.roman} in Roman numerals / ${arabic} converter`
				description = `Convert Roman numeral ${romanParsed.roman} to Arabic number ${arabic}.`
			} catch {
				// Keep default
			}
		} else if (romanParsed.number) {
			try {
				const roman = toRoman(romanParsed.number)
				title = `${romanParsed.number} in Roman numerals / ${roman} converter`
				description = `Convert Arabic number ${romanParsed.number} to Roman numeral ${roman}.`
			} catch {
				// Keep default
			}
		}
	} else if (range) {
		title = `Roman numerals ${range.start} to ${range.end} – converter`
		description = `Convert Arabic numbers from ${range.start} to ${range.end} to Roman numerals.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !range || range.end - range.start <= 999

	return {
		title,
		description,
		keywords: 'roman numerals, arabic numbers, converter, I V X L C D M',
		robots: shouldIndex ? 'index, follow' : 'noindex, nofollow',
		alternates: {
			languages: {
				en: `/en/roman-numerals-converter/${slug.join('/')}`,
				ru: `/ru/roman-numerals-converter/${slug.join('/')}`,
				es: `/es/roman-numerals-converter/${slug.join('/')}`,
				tr: `/tr/roman-numerals-converter/${slug.join('/')}`,
				hi: `/hi/roman-numerals-converter/${slug.join('/')}`,
			},
			canonical: `/${locale}/roman-numerals-converter/${slug.join('/')}`,
		},
	}
}

export default function RomanNumeralsConverterPage({
	params,
}: RomanNumeralsConverterPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const romanParsed = parseRoman(slug)
	const range = parseRange(slug)

	// Handle range
	if (range) {
		const validation = validateRange(range.start, range.end, 1, 3999, 200)
		if (!validation.valid) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Roman Numerals Converter"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={validation.error || 'Invalid range'}
						locale={locale}
						examples={[
							{
								href: '/roman-numerals-converter/1-100',
								label: 'Range example: /roman-numerals-converter/1-100',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		const numbers = generateRange(range.start, range.end, 200)
		const title = `Roman numerals from ${range.start} to ${range.end}`

		const tableData = numbers.map((num) => {
			try {
				const roman = toRoman(num)
				return {
					arabic: num.toLocaleString('en-US'),
					roman: roman,
				}
			} catch (error) {
				return {
					arabic: num.toLocaleString('en-US'),
					roman: error instanceof Error ? error.message : 'Error',
				}
			}
		})

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				<ResultsTable
					columns={[
						{ header: 'Arabic', key: 'arabic' },
						{ header: 'Roman', key: 'roman' },
					]}
					data={tableData}
				/>

				<LegacyFaqBlock faq={getFaqForLegacyTool('roman-numerals-converter')} />

				<LegacyRelatedLinks locale={locale} toolType="roman-numerals-converter" />
			</LegacyPageLayout>
		)
	}

	// Handle single value
	if (!romanParsed) {
		return (
			<LegacyPageLayout
				locale={locale}
				title="Roman Numerals Converter"
				relatedLinks={false}
			>
				<ErrorDisplay
					error="Invalid input format"
					locale={locale}
					examples={[
						{
							href: '/roman-numerals-converter/123',
							label: 'Example: /roman-numerals-converter/123',
						},
						{
							href: '/roman-numerals-converter/IV',
							label: 'Example: /roman-numerals-converter/IV',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	let result: { arabic: number; roman: string }
	let title: string

	if (romanParsed.roman) {
		try {
			const arabic = fromRoman(romanParsed.roman)
			result = { arabic, roman: romanParsed.roman }
			title = `Roman numeral ${romanParsed.roman} = ${arabic}`
		} catch (error) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Roman Numerals Converter"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={
							error instanceof Error
								? error.message
								: 'Invalid Roman numeral'
						}
						locale={locale}
						examples={[
							{
								href: '/roman-numerals-converter/IV',
								label: 'Example: /roman-numerals-converter/IV',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}
	} else {
		try {
			const roman = toRoman(romanParsed.number!)
			result = { arabic: romanParsed.number!, roman }
			title = `Number ${romanParsed.number} = ${roman}`
		} catch (error) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Roman Numerals Converter"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={
							error instanceof Error ? error.message : 'Invalid number'
						}
						locale={locale}
						examples={[
							{
								href: '/roman-numerals-converter/123',
								label: 'Example: /roman-numerals-converter/123',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}
	}

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			{/* Result block */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div className="grid grid-cols-2 gap-6 text-center">
					<div>
						<p className="text-sm text-gray-500 mb-2">Arabic</p>
						<p className="text-3xl font-bold text-gray-900">
							{result.arabic.toLocaleString('en-US')}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-2">Roman</p>
						<p className="text-3xl font-bold text-blue-600 font-mono">
							{result.roman}
						</p>
					</div>
				</div>
			</div>

			<LegacyFaqBlock faq={getFaqForLegacyTool('roman-numerals-converter')} />

			<LegacyRelatedLinks locale={locale} toolType="roman-numerals-converter" />
		</LegacyPageLayout>
	)
}
