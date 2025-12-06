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
import {
	getFaqForLegacyTool,
	getExamplesForLegacyTool,
} from '@/lib/legacy/faqExamples'

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

	let title = 'Число прописью - Конвертер'
	let description =
		'Конвертер чисел в пропись на русском языке. Преобразуйте числа от 0 до 999,999,999 в их текстовое представление.'

	if (singleNumber !== null) {
		title = `Число ${singleNumber} прописью – калькулятор`
		description = `Конвертируйте число ${singleNumber} в пропись на русском языке.`
	} else if (range) {
		title = `Числа от ${range.start} до ${range.end} прописью – калькулятор`
		description = `Конвертируйте диапазон чисел от ${range.start} до ${range.end} в пропись на русском языке.`
	}

	// Disable indexing for large ranges
	const shouldIndex = !range || range.end - range.start <= 999

	return {
		title: `${title} - Calculator Portal`,
		description,
		keywords: 'число прописью, конвертер чисел, русский язык, пропись',
		robots: shouldIndex ? 'index, follow' : 'noindex, nofollow',
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

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				{/* Result block */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					<div className="text-center">
						<p className="text-sm text-gray-500 mb-2">Число</p>
						<p className="text-4xl font-bold text-gray-900 mb-4">
							{singleNumber.toLocaleString('ru-RU')}
						</p>
						<p className="text-sm text-gray-500 mb-2">Прописью</p>
						<p className="text-3xl font-semibold text-blue-600">
							{wordRepresentation}
						</p>
					</div>
				</div>

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
				number: num.toLocaleString('ru-RU'),
				words: wordRepresentation,
			}
		})

		return (
			<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
				<ResultsTable
					columns={[
						{ header: 'Число', key: 'number' },
						{ header: 'Прописью', key: 'words' },
					]}
					data={tableData}
				/>

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
