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
import { RomanNumeralsForm } from '@/components/legacy/roman-numerals-form'
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

	// Get base content from module
	const baseTitle = getLegacyTitle('roman-numerals-converter', locale)
	const baseDescription = getLegacyDescription('roman-numerals-converter', locale)
	const ogTitle = getLegacyOgTitle('roman-numerals-converter', locale)
	const ogDescription = getLegacyOgDescription('roman-numerals-converter', locale)
	const content = getLegacyContent('roman-numerals-converter', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	let title = baseTitle
	let description = baseDescription

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

	// SEO Safety: Prevent indexing of infinite dynamic legacy pages
	// Only the landing page (/roman-numerals-converter) should be indexed
	// All dynamic routes (single conversions, ranges) should be noindex
	const isLandingPage = slug.length === 0
	const robots = isLandingPage ? 'index, follow' : 'noindex, follow'

	return {
		title,
		description,
		keywords: content?.keywords[contentLocale]?.join(', ') || 'roman numerals, arabic numbers, converter, I V X L C D M',
		robots,
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
		const content = getLegacyContent('roman-numerals-converter', locale)

		// Use 'en' as fallback for locales that don't have translations
		const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

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

				{/* Text content */}
				{content && content.text[contentLocale] && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
						{content.text[contentLocale].map((paragraph, index) => (
							<p key={index} className="text-gray-700 mb-4 last:mb-0">
								{paragraph}
							</p>
						))}
					</div>
				)}

				{/* Use cases */}
				{content && content.useCases[contentLocale] && (
					<UseCasesBlock useCases={content.useCases[contentLocale]} locale={locale} />
				)}

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

	const content = getLegacyContent('roman-numerals-converter', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			{/* Form for new conversion - at the top */}
			<div className="mb-8">
				<RomanNumeralsForm
					locale={locale}
					exampleLinks={[
						{ href: '/roman-numerals-converter/123', label: '/roman-numerals-converter/123' },
						{ href: '/roman-numerals-converter/XII', label: '/roman-numerals-converter/XII' },
						{ href: '/roman-numerals-converter/MMXXIV', label: '/roman-numerals-converter/MMXXIV' },
					]}
				/>
			</div>

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

			{/* Description of Roman numerals */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					{locale === 'ru' ? 'О римских цифрах' : 'About Roman Numerals'}
				</h2>
				{locale === 'ru' ? (
					<>
						<p className="text-gray-700 mb-4">
							Римские цифры — это система счисления, которая использовалась в
							Древнем Риме и до сих пор применяется в некоторых случаях. Система
							использует буквы латинского алфавита для обозначения чисел:
						</p>
						<ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
							<li>
								<strong>I</strong> = 1
							</li>
							<li>
								<strong>V</strong> = 5
							</li>
							<li>
								<strong>X</strong> = 10
							</li>
							<li>
								<strong>L</strong> = 50
							</li>
							<li>
								<strong>C</strong> = 100
							</li>
							<li>
								<strong>D</strong> = 500
							</li>
							<li>
								<strong>M</strong> = 1000
							</li>
						</ul>
						<p className="text-gray-700 mb-4">
							Римские цифры используют вычитательную нотацию для чисел 4, 9, 40,
							90, 400, 900 (например, IV = 4, IX = 9, XL = 40, XC = 90, CD =
							400, CM = 900).
						</p>
						<p className="text-gray-700 font-semibold">
							<strong>Почему ограничение до 3999?</strong> Классическая римская
							система счисления не имеет стандартного способа представления чисел
							больше 3999 (MMMCMXCIX) без использования дополнительных символов
							или надстрочных знаков. Для чисел больше 3999 обычно используются
							другие системы или специальные обозначения.
						</p>
					</>
				) : (
					<>
						<p className="text-gray-700 mb-4">
							Roman numerals are a numeral system that originated in ancient Rome
							and is still used in some cases today. The system uses letters from
							the Latin alphabet to represent numbers:
						</p>
						<ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
							<li>
								<strong>I</strong> = 1
							</li>
							<li>
								<strong>V</strong> = 5
							</li>
							<li>
								<strong>X</strong> = 10
							</li>
							<li>
								<strong>L</strong> = 50
							</li>
							<li>
								<strong>C</strong> = 100
							</li>
							<li>
								<strong>D</strong> = 500
							</li>
							<li>
								<strong>M</strong> = 1000
							</li>
						</ul>
						<p className="text-gray-700 mb-4">
							Roman numerals use subtractive notation for numbers 4, 9, 40, 90,
							400, 900 (e.g., IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM =
							900).
						</p>
						<p className="text-gray-700 font-semibold">
							<strong>Why the limit of 3999?</strong> The classical Roman numeral
							system does not have a standard way to represent numbers greater
							than 3999 (MMMCMXCIX) without using additional symbols or
							overlines. For numbers greater than 3999, other systems or special
							notations are typically used.
						</p>
					</>
				)}
			</div>

			{/* Text content */}
			{content && content.text[contentLocale] && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					{content.text[contentLocale].map((paragraph, index) => (
						<p key={index} className="text-gray-700 mb-4 last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			)}

			{/* Use cases */}
			{content && content.useCases[contentLocale] && (
				<UseCasesBlock useCases={content.useCases[contentLocale]} locale={locale} />
			)}

			<LegacyFaqBlock faq={getFaqForLegacyTool('roman-numerals-converter')} />

			<LegacyRelatedLinks locale={locale} toolType="roman-numerals-converter" />
		</LegacyPageLayout>
	)
}
