import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { numberToWordsRu } from '@/lib/numberToWordsRu'
import { numberToWordsEn } from '@/lib/legacy/numberToWordsEn'
import {
	numberToWordsRuDecimal,
	numberToWordsEnDecimal,
} from '@/lib/legacy/decimalToWords'
import { parseSingleNumber, parseRange, parseMoneyFormat, parseLanguage } from '@/lib/legacy/slugParser'
import { generateRange, validateRange } from '@/lib/legacy/parsers'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { ResultsTable } from '@/components/legacy/results-table'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
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
import { loadNamespaces, createT } from '@/lib/i18n'
import { getLegacyBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { NumberToWordsForm } from '@/components/legacy/number-to-words-form'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface ChisloPropisyuPageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

export async function generateMetadata({
	params,
}: ChisloPropisyuPageProps): Promise<Metadata> {
	const { locale, slug } = params

	const moneyFormat = parseMoneyFormat(slug)
	const singleNumber = moneyFormat ? moneyFormat.number : parseSingleNumber(slug)
	const range = parseRange(slug)

	// Get base content from module
	const baseTitle = getLegacyTitle('chislo-propisyu', locale)
	const baseDescription = getLegacyDescription('chislo-propisyu', locale)
	const ogTitle = getLegacyOgTitle('chislo-propisyu', locale)
	const ogDescription = getLegacyOgDescription('chislo-propisyu', locale)
	const content = getLegacyContent('chislo-propisyu', locale)

	let title = baseTitle
	let description = baseDescription

	if (singleNumber !== null) {
		try {
			let words = ''
			if (moneyFormat) {
				const useEnglish =
					(moneyFormat.currency === 'usd' || moneyFormat.currency === 'eur') &&
					locale !== 'ru'
				if (useEnglish) {
					words = numberToWordsEnDecimal(singleNumber, {
						format: 'money',
						currency: moneyFormat.currency,
					})
				} else {
					words = numberToWordsRuDecimal(singleNumber, {
						format: 'money',
						currency: moneyFormat.currency,
					})
				}
			} else if (singleNumber % 1 !== 0) {
				words = numberToWordsRuDecimal(singleNumber, { format: 'numeric' })
			} else {
				words = numberToWordsRu(singleNumber)
			}
			title = locale === 'ru'
				? `Число ${singleNumber} прописью – калькулятор`
				: `Number ${singleNumber} in Words – Calculator`
			description = locale === 'ru'
				? `Конвертируйте число ${singleNumber} в пропись. Результат: ${words}.`
				: `Convert number ${singleNumber} to words. Result: ${words}.`
		} catch {
			// Keep default
			title = locale === 'ru'
				? `Число ${singleNumber} прописью – калькулятор`
				: `Number ${singleNumber} in Words – Calculator`
			description = locale === 'ru'
				? `Конвертируйте число ${singleNumber} в пропись.`
				: `Convert number ${singleNumber} to words.`
		}
		} else if (range) {
			title = locale === 'ru'
				? `Числа от ${range.start} до ${range.end} прописью – калькулятор`
				: `Numbers ${range.start} to ${range.end} in Words – Calculator`
			description = locale === 'ru'
				? `Конвертируйте диапазон чисел от ${range.start} до ${range.end} в пропись.`
				: `Convert numbers from ${range.start} to ${range.end} to words.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !range || range.end - range.start <= 999

	return {
		title: `${title} - Calculator Portal`,
		description,
			keywords: content?.keywords[locale]?.join(', ') || 'число прописью, конвертер чисел, пропись, number to words',
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
				en: `/en/chislo-propisyu/${slug.join('/')}`,
				ru: `/ru/chislo-propisyu/${slug.join('/')}`,
				es: `/es/chislo-propisyu/${slug.join('/')}`,
				tr: `/tr/chislo-propisyu/${slug.join('/')}`,
				hi: `/hi/chislo-propisyu/${slug.join('/')}`,
			},
			canonical: `/${locale}/chislo-propisyu/${slug.join('/')}`,
		},
	}
}

export default async function ChisloPropisyuPage({
	params,
}: ChisloPropisyuPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	const moneyFormat = parseMoneyFormat(slug)
	const singleNumber = moneyFormat ? moneyFormat.number : parseSingleNumber(slug)
	const range = parseRange(slug)
	
	// Parse language from slug (for numeric format)
	// For money format, language is determined by currency
	const targetLanguage = moneyFormat 
		? ((moneyFormat.currency === 'usd' || moneyFormat.currency === 'eur') && locale !== 'ru' ? 'en' : 'ru')
		: parseLanguage(slug)

	// Handle single number
	if (singleNumber !== null && !range) {
		// Validate range (support decimals, so check integer part)
		const integerPart = Math.floor(Math.abs(singleNumber))
		const maxRange = targetLanguage === 'en' ? 999_999_999_999 : 999_999_999
		if (singleNumber < 0 || integerPart > maxRange) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Число прописью"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={`Number ${singleNumber} is out of range (0-${maxRange.toLocaleString()})`}
						locale={locale}
						examples={[
							{ href: '/chislo-propisyu/123', label: 'Example: /chislo-propisyu/123' },
						]}
					/>
				</LegacyPageLayout>
			)
		}

		// Convert single number (support decimals and money format)
		let wordRepresentation: string
		try {
			if (moneyFormat) {
				// For money format, use appropriate language based on currency or locale
				// If currency is USD/EUR and locale is not ru, use English
				const useEnglish = (moneyFormat.currency === 'usd' || moneyFormat.currency === 'eur') && locale !== 'ru'
				
				if (useEnglish) {
					wordRepresentation = numberToWordsEnDecimal(singleNumber, {
						format: 'money',
						currency: moneyFormat.currency,
					})
				} else {
					wordRepresentation = numberToWordsRuDecimal(singleNumber, {
						format: 'money',
						currency: moneyFormat.currency,
					})
				}
			} else if (singleNumber % 1 !== 0) {
				// Decimal number - use target language
				if (targetLanguage === 'en') {
					wordRepresentation = numberToWordsEnDecimal(singleNumber, {
						format: 'numeric',
					})
				} else {
					wordRepresentation = numberToWordsRuDecimal(singleNumber, {
						format: 'numeric',
					})
				}
			} else {
				// Integer number - use target language
				if (targetLanguage === 'en') {
					wordRepresentation = numberToWordsEn(singleNumber)
				} else {
					wordRepresentation = numberToWordsRu(singleNumber)
				}
			}
		} catch (error) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Число прописью"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={
							error instanceof Error
								? error.message
								: 'Ошибка конвертации'
						}
						locale={locale}
						examples={[
							{
								href: '/chislo-propisyu/123',
								label: 'Example: /chislo-propisyu/123',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		const title = `Число ${singleNumber} прописью`
		const content = getLegacyContent('chislo-propisyu', locale)

		// Generate breadcrumbs
		const breadcrumbs = getLegacyBreadcrumbs(
			locale,
			'chislo-propisyu',
			[String(singleNumber)],
			t,
		)

		return (
			<LegacyPageLayout
				locale={locale}
				title={title}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				{/* Form for new conversion - at the top */}
				<div className="mb-8">
					<NumberToWordsForm
						locale={locale}
						toolSlug="chislo-propisyu"
						exampleLinks={[
							{ href: '/chislo-propisyu/123', label: '/chislo-propisyu/123' },
							{ href: '/chislo-propisyu/1000', label: '/chislo-propisyu/1000' },
							{ href: '/chislo-propisyu/555.23-money-usd', label: '/chislo-propisyu/555.23-money-usd' },
						]}
					/>
				</div>

				{/* Result block */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					<div className="text-center">
						<p className="text-sm text-gray-500 mb-2">
							{locale === 'ru' ? 'Число' : 'Number'}
						</p>
						<p className="text-4xl font-bold text-gray-900 mb-4">
							{singleNumber.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')}
						</p>
						<p className="text-sm text-gray-500 mb-2">
							{locale === 'ru' ? 'Прописью' : 'In Words'}
						</p>
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
					examples={getExamplesForLegacyTool('chislo-propisyu')}
					locale={locale}
				/>

				{/* FAQ */}
				<LegacyFaqBlock faq={getFaqForLegacyTool('chislo-propisyu')} />

				{/* Related links */}
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// Handle range
	if (range) {
		// Validate range
		const validation = validateRange(range.start, range.end, 0, 999_999_999, 200)
		if (!validation.valid) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Число прописью"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={validation.error || 'Invalid range'}
						locale={locale}
						examples={[
							{
								href: '/chislo-propisyu/100-199',
								label: 'Range example: /chislo-propisyu/100-199',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		// Generate numbers (max 200)
		const numbers = generateRange(range.start, range.end, 200)

		const title = `Числа от ${range.start} до ${range.end} прописью`
		const content = getLegacyContent('chislo-propisyu', locale)

		// Prepare table data
		const tableData = numbers.map((num) => {
			let wordRepresentation: string
			try {
				wordRepresentation = numberToWordsRu(num)
			} catch (error) {
				wordRepresentation =
					error instanceof Error ? error.message : 'Ошибка конвертации'
			}

			return {
				number: num.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US'),
				words: wordRepresentation,
			}
		})

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				<ResultsTable
					columns={[
						{ header: locale === 'ru' ? 'Число' : 'Number', key: 'number' },
						{ header: locale === 'ru' ? 'Прописью' : 'In Words', key: 'words' },
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
					examples={getExamplesForLegacyTool('chislo-propisyu')}
					locale={locale}
				/>

				{/* FAQ */}
				<LegacyFaqBlock faq={getFaqForLegacyTool('chislo-propisyu')} />

				{/* Related links */}
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// Error case
	return (
		<LegacyPageLayout locale={locale} title="Число прописью" relatedLinks={false}>
			<ErrorDisplay
				error="Invalid input format"
				locale={locale}
				examples={[
					{ href: '/chislo-propisyu/123', label: 'Example: /chislo-propisyu/123' },
					{
						href: '/chislo-propisyu/100-199',
						label: 'Range example: /chislo-propisyu/100-199',
					},
				]}
			/>
		</LegacyPageLayout>
	)
}
