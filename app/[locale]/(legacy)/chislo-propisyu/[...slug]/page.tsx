import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { numberToWordsRu } from '@/lib/numberToWordsRu'
import { parseSingleNumber, parseRange } from '@/lib/legacy/slugParser'
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

	const singleNumber = parseSingleNumber(slug)
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
		title = locale === 'ru'
			? `Число ${singleNumber} прописью – калькулятор`
			: `Number ${singleNumber} in Words (Russian) – Calculator`
		description = locale === 'ru'
			? `Конвертируйте число ${singleNumber} в пропись на русском языке.`
			: `Convert number ${singleNumber} to Russian words.`
	} else if (range) {
		title = locale === 'ru'
			? `Числа от ${range.start} до ${range.end} прописью – калькулятор`
			: `Numbers ${range.start} to ${range.end} in Words (Russian) – Calculator`
		description = locale === 'ru'
			? `Конвертируйте диапазон чисел от ${range.start} до ${range.end} в пропись на русском языке.`
			: `Convert numbers from ${range.start} to ${range.end} to Russian words.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !range || range.end - range.start <= 999

	return {
		title: `${title} - Calculator Portal`,
		description,
		keywords: content?.keywords[locale]?.join(', ') || 'число прописью, конвертер чисел, русский язык, пропись',
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

export default function ChisloPropisyuPage({ params }: ChisloPropisyuPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const singleNumber = parseSingleNumber(slug)
	const range = parseRange(slug)

	// Handle single number
	if (singleNumber !== null && !range) {
		// Validate range
		if (singleNumber < 0 || singleNumber > 999_999_999) {
			return (
				<LegacyPageLayout
					locale={locale}
					title="Число прописью"
					relatedLinks={false}
				>
					<ErrorDisplay
						error={`Number ${singleNumber} is out of range (0-999,999,999)`}
						locale={locale}
						examples={[
							{ href: '/chislo-propisyu/123', label: 'Example: /chislo-propisyu/123' },
						]}
					/>
				</LegacyPageLayout>
			)
		}

		// Convert single number
		let wordRepresentation: string
		try {
			wordRepresentation = numberToWordsRu(singleNumber)
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

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
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
