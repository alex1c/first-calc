import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale } from '@/lib/i18n'
import { numberToWordsRu } from '@/lib/numberToWordsRu'
import { numberToWordsEn } from '@/lib/legacy/numberToWordsEn'
import {
	numberToWordsRuDecimal,
	numberToWordsEnDecimal,
} from '@/lib/legacy/decimalToWords'
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
import { languageAlternates, localePath, localeUrl } from '@/lib/site-url'
import {
	parsePropisyuSlug,
	buildMoneySeoTitle,
	buildMoneySeoH1,
	buildMoneySeoDescription,
	moneyAmountFromParts,
	isMoneySlugIndexable,
	moneyCanonicalPath,
	findDecadeHub,
	PROPISYU_MAX_INTEGER,
} from '@/lib/propisyu'
import { MoneyResult } from '@/components/propisyu/money-result'
import { DecadeHubContent } from '@/components/propisyu/decade-hub-content'

const namespaces = ['common', 'navigation'] as const

interface ChisloPropisyuPageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

/**
 * Robots for dynamic chislo routes:
 * - decade hubs → index,follow (E2)
 * - money allowlist → index,follow (E1)
 * - everything else stays noindex,follow (existing policy)
 */
function resolveRobots(
	parsed: ReturnType<typeof parsePropisyuSlug>,
): string {
	if (parsed.kind === 'decade-hub') {
		return 'index, follow'
	}
	if (parsed.kind === 'money' && isMoneySlugIndexable(parsed.canonicalSlug)) {
		return 'index, follow'
	}
	return 'noindex, follow'
}

export async function generateMetadata({
	params,
}: ChisloPropisyuPageProps): Promise<Metadata> {
	const { locale, slug } = params
	const parsed = parsePropisyuSlug(slug)

	const baseTitle = getLegacyTitle('chislo-propisyu', locale)
	const baseDescription = getLegacyDescription('chislo-propisyu', locale)
	const ogTitle = getLegacyOgTitle('chislo-propisyu', locale)
	const ogDescription = getLegacyOgDescription('chislo-propisyu', locale)
	const content = getLegacyContent('chislo-propisyu', locale)
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	let title = baseTitle
	let description = baseDescription
	let canonicalPath = `/chislo-propisyu/${slug.join('/')}`

	if (parsed.kind === 'money') {
		const amount = moneyAmountFromParts(parsed.rubles, parsed.kopecks)
		title = buildMoneySeoTitle(amount)
		description = buildMoneySeoDescription(amount)
		// Prefer historical money slug as self-canonical (normalized).
		canonicalPath = moneyCanonicalPath(parsed.canonicalSlug)
	} else if (parsed.kind === 'decade-hub') {
		title =
			locale === 'ru'
				? `Числа ${parsed.start}–${parsed.end} прописью — база чисел`
				: `Numbers ${parsed.start}–${parsed.end} in words — number base`
		description =
			locale === 'ru'
				? `Диапазон ${parsed.slug} из исторической базы чисел first-calc.com. Навигация по суммам прописью.`
				: `Range ${parsed.slug} from the historical number base. Navigate amounts in words.`
		canonicalPath = `/chislo-propisyu/${parsed.slug}`
	} else if (parsed.kind === 'plain-number') {
		try {
			const words =
				parsed.language === 'en'
					? numberToWordsEn(parsed.value)
					: numberToWordsRu(parsed.value)
			title =
				locale === 'ru'
					? `Число ${parsed.value} прописью – калькулятор`
					: `Number ${parsed.value} in Words – Calculator`
			description =
				locale === 'ru'
					? `Конвертируйте число ${parsed.value} в пропись. Результат: ${words}.`
					: `Convert number ${parsed.value} to words. Result: ${words}.`
		} catch {
			title =
				locale === 'ru'
					? `Число ${parsed.value} прописью – калькулятор`
					: `Number ${parsed.value} in Words – Calculator`
		}
		canonicalPath = `/chislo-propisyu/${parsed.value}`
	} else if (parsed.kind === 'small-range') {
		title =
			locale === 'ru'
				? `Числа от ${parsed.start} до ${parsed.end} прописью – калькулятор`
				: `Numbers ${parsed.start} to ${parsed.end} in Words – Calculator`
		description =
			locale === 'ru'
				? `Конвертируйте диапазон чисел от ${parsed.start} до ${parsed.end} в пропись.`
				: `Convert numbers from ${parsed.start} to ${parsed.end} to words.`
	}

	const robots = resolveRobots(parsed)

	return {
		title: parsed.kind === 'money' ? title : `${title} - First Calc`,
		description,
		keywords:
			content?.keywords[contentLocale]?.join(', ') ||
			'число прописью, конвертер чисел, пропись, number to words',
		robots,
		openGraph: {
			title: parsed.kind === 'money' ? title : ogTitle,
			description: parsed.kind === 'money' ? description : ogDescription,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: parsed.kind === 'money' ? title : ogTitle,
			description: parsed.kind === 'money' ? description : ogDescription,
		},
		alternates: {
			languages: languageAlternates(canonicalPath, ['en', 'ru']),
			// Historical propisyu URLs were unprefixed; keep self-canonical on the
			// default-locale path to avoid /ru vs bare duplicates for money/hubs.
			canonical: localeUrl(
				parsed.kind === 'money' || parsed.kind === 'decade-hub'
					? 'en'
					: locale,
				canonicalPath,
			),
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

	const dict = await loadNamespaces(locale, namespaces)
	const formDict = await loadNamespaces(locale, ['legacy/ui', 'errors'])
	const t = createT(dict)
	const parsed = parsePropisyuSlug(slug)
	const content = getLegacyContent('chislo-propisyu', locale)
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	// --- Historical money pages (E1) ---
	if (parsed.kind === 'money') {
		const amount = moneyAmountFromParts(parsed.rubles, parsed.kopecks)
		const h1 = buildMoneySeoH1(amount)
		const breadcrumbs = getLegacyBreadcrumbs(
			locale,
			'chislo-propisyu',
			[parsed.canonicalSlug],
			t,
		)

		return (
			<LegacyPageLayout
				locale={locale}
				title={h1}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				<div className="mb-8">
					<NumberToWordsForm
						locale={locale}
						toolSlug="chislo-propisyu"
						initialDict={formDict}
						exampleLinks={[
							{ href: '/chislo-propisyu/199-00', label: '/chislo-propisyu/199-00' },
							{ href: '/chislo-propisyu/420-00', label: '/chislo-propisyu/420-00' },
							{ href: '/chislo-propisyu/5788-00', label: '/chislo-propisyu/5788-00' },
						]}
					/>
				</div>

				<MoneyResult amount={amount} />

				<div className="mt-10">
					<Link
						href={localePath(locale, '/chislo-propisyu')}
						className="text-sm font-medium text-blue-700 hover:underline"
					>
						← Вернуться к конвертеру «Число прописью»
					</Link>
				</div>

				<div className="mt-10">
					<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
				</div>
			</LegacyPageLayout>
		)
	}

	// --- Decade hubs (E2) ---
	if (parsed.kind === 'decade-hub') {
		const hub = findDecadeHub(parsed.start, parsed.end)
		if (!hub) {
			notFound()
		}
		const title =
			locale === 'ru'
				? `Числа ${hub.start}–${hub.end} прописью`
				: `Numbers ${hub.start}–${hub.end} in words`
		const breadcrumbs = getLegacyBreadcrumbs(
			locale,
			'chislo-propisyu',
			[hub.slug],
			t,
		)

		return (
			<LegacyPageLayout
				locale={locale}
				title={title}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				<DecadeHubContent locale={locale} hub={hub} />
			</LegacyPageLayout>
		)
	}

	// --- Legacy currency money format (existing Next URLs) ---
	if (parsed.kind === 'legacy-money-currency') {
		const number = Number.parseFloat(parsed.numberLabel)
		if (!Number.isFinite(number) || number < 0) {
			return (
				<LegacyPageLayout locale={locale} title="Число прописью" relatedLinks={false}>
					<ErrorDisplay
						error="Invalid money amount"
						locale={locale}
						examples={[
							{
								href: '/chislo-propisyu/555.23-money-rub',
								label: '/chislo-propisyu/555.23-money-rub',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}
		const useEnglish =
			(parsed.currency === 'usd' || parsed.currency === 'eur') && locale !== 'ru'
		const wordRepresentation = useEnglish
			? numberToWordsEnDecimal(number, {
					format: 'money',
					currency: parsed.currency,
				})
			: numberToWordsRuDecimal(number, {
					format: 'money',
					currency: parsed.currency,
				})

		return (
			<LegacyPageLayout
				locale={locale}
				title={`Число ${number} прописью`}
				relatedLinks={false}
			>
				<div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
					<p className="mb-2 text-sm text-gray-500">
						{locale === 'ru' ? 'Сумма' : 'Amount'}
					</p>
					<p className="mb-4 text-4xl font-bold text-gray-900">{number}</p>
					<p className="text-3xl font-semibold text-blue-600">
						{wordRepresentation}
					</p>
				</div>
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// --- Plain integer ---
	if (parsed.kind === 'plain-number') {
		const targetLanguage = parsed.language || (locale === 'ru' ? 'ru' : 'ru')
		let wordRepresentation: string
		try {
			wordRepresentation =
				targetLanguage === 'en'
					? numberToWordsEn(parsed.value)
					: numberToWordsRu(parsed.value)
		} catch (error) {
			return (
				<LegacyPageLayout locale={locale} title="Число прописью" relatedLinks={false}>
					<ErrorDisplay
						error={
							error instanceof Error ? error.message : 'Ошибка конвертации'
						}
						locale={locale}
						examples={[
							{ href: '/chislo-propisyu/123', label: '/chislo-propisyu/123' },
						]}
					/>
				</LegacyPageLayout>
			)
		}

		const title = `Число ${parsed.value} прописью`
		const breadcrumbs = getLegacyBreadcrumbs(
			locale,
			'chislo-propisyu',
			[String(parsed.value)],
			t,
		)

		return (
			<LegacyPageLayout
				locale={locale}
				title={title}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				<div className="mb-8">
					<NumberToWordsForm
						locale={locale}
						toolSlug="chislo-propisyu"
						initialDict={formDict}
						exampleLinks={[
							{ href: '/chislo-propisyu/123', label: '/chislo-propisyu/123' },
							{ href: '/chislo-propisyu/1000', label: '/chislo-propisyu/1000' },
							{ href: '/chislo-propisyu/199-00', label: '/chislo-propisyu/199-00' },
						]}
					/>
				</div>

				<div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
					<p className="mb-2 text-sm text-gray-500">
						{locale === 'ru' ? 'Число' : 'Number'}
					</p>
					<p className="mb-4 text-4xl font-bold text-gray-900">
						{parsed.value.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')}
					</p>
					<p className="mb-2 text-sm text-gray-500">
						{locale === 'ru' ? 'Прописью' : 'In Words'}
					</p>
					<p className="text-3xl font-semibold text-blue-600">
						{wordRepresentation}
					</p>
				</div>

				{content && content.text[contentLocale] && (
					<div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						{content.text[contentLocale].map((paragraph, index) => (
							<p key={index} className="mb-4 text-gray-700 last:mb-0">
								{paragraph}
							</p>
						))}
					</div>
				)}

				{content && content.useCases[contentLocale] && (
					<UseCasesBlock
						useCases={content.useCases[contentLocale]}
						locale={locale}
					/>
				)}

				<LegacyExamplesBlock
					examples={getExamplesForLegacyTool('chislo-propisyu')}
					locale={locale}
				/>
				<LegacyFaqBlock faq={getFaqForLegacyTool('chislo-propisyu')} />
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// --- Small non-decade ranges (legacy table, still noindex) ---
	if (parsed.kind === 'small-range') {
		const validation = validateRange(
			parsed.start,
			parsed.end,
			0,
			PROPISYU_MAX_INTEGER,
			200,
		)
		if (!validation.valid) {
			return (
				<LegacyPageLayout locale={locale} title="Число прописью" relatedLinks={false}>
					<ErrorDisplay
						error={validation.error || 'Invalid range'}
						locale={locale}
						examples={[
							{
								href: '/chislo-propisyu/100-199',
								label: 'Range example: /chislo-propisyu/100-199',
							},
							{
								href: '/chislo-propisyu/0-9999',
								label: 'База чисел: /chislo-propisyu/0-9999',
							},
						]}
					/>
				</LegacyPageLayout>
			)
		}

		const numbers = generateRange(parsed.start, parsed.end, 200)
		const title = `Числа от ${parsed.start} до ${parsed.end} прописью`
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
				{content && content.text[contentLocale] && (
					<div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						{content.text[contentLocale].map((paragraph, index) => (
							<p key={index} className="mb-4 text-gray-700 last:mb-0">
								{paragraph}
							</p>
						))}
					</div>
				)}
				<LegacyFaqBlock faq={getFaqForLegacyTool('chislo-propisyu')} />
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// Invalid
	return (
		<LegacyPageLayout locale={locale} title="Число прописью" relatedLinks={false}>
			<ErrorDisplay
				error={
					parsed.kind === 'invalid'
						? `Некорректный адрес (${parsed.reason})`
						: 'Invalid input format'
				}
				locale={locale}
				examples={[
					{ href: '/chislo-propisyu/123', label: '/chislo-propisyu/123' },
					{ href: '/chislo-propisyu/199-00', label: '/chislo-propisyu/199-00' },
					{
						href: '/chislo-propisyu/0-9999',
						label: '/chislo-propisyu/0-9999',
					},
				]}
			/>
		</LegacyPageLayout>
	)
}
