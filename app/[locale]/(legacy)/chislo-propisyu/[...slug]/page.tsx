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
import { localePath } from '@/lib/site-url'
import {
	parsePropisyuSlug,
	buildMoneySeoTitle,
	buildMoneySeoH1,
	buildMoneySeoDescription,
	moneyAmountFromParts,
	findDecadeHub,
	PROPISYU_DECADE_MAX,
	resolvePropisyuSeo,
	propisyuAlternates,
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
		canonicalPath = `/chislo-propisyu/${parsed.canonicalSlug}`
	} else if (parsed.kind === 'decade-hub') {
		// Hubs are Russian historical content on every shell locale.
		title = `Числа ${parsed.start}–${parsed.end} прописью — база чисел`
		description = `Диапазон ${parsed.slug} из исторической базы чисел first-calc.com. Примеры написания чисел прописью и навигация по соседним диапазонам.`
		canonicalPath = `/chislo-propisyu/${parsed.slug}`
	} else if (parsed.kind === 'plain-number') {
		try {
			const words =
				parsed.language === 'en'
					? parsed.isInteger
						? numberToWordsEn(parsed.value)
						: numberToWordsEnDecimal(parsed.value, { format: 'numeric' })
					: parsed.isInteger
						? numberToWordsRu(parsed.value)
						: numberToWordsRuDecimal(parsed.value, { format: 'numeric' })
			title =
				locale === 'ru'
					? `Число ${parsed.canonicalSlug} прописью – калькулятор`
					: `Number ${parsed.canonicalSlug} in Words – Calculator`
			description =
				locale === 'ru'
					? `Конвертируйте число ${parsed.canonicalSlug} в пропись. Результат: ${words}.`
					: `Convert number ${parsed.canonicalSlug} to words. Result: ${words}.`
		} catch {
			title =
				locale === 'ru'
					? `Число ${parsed.canonicalSlug} прописью – калькулятор`
					: `Number ${parsed.canonicalSlug} in Words – Calculator`
		}
		canonicalPath = `/chislo-propisyu/${parsed.canonicalSlug}`
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

	const seo = resolvePropisyuSeo(parsed, locale, canonicalPath)

	return {
		title: parsed.kind === 'money' ? title : `${title} - First Calc`,
		description,
		keywords:
			content?.keywords[contentLocale]?.join(', ') ||
			'число прописью, конвертер чисел, пропись, number to words',
		robots: seo.robots,
		openGraph: {
			title: parsed.kind === 'money' ? title : ogTitle,
			description: parsed.kind === 'money' ? description : ogDescription,
			type: 'website',
			locale: seo.contentLanguage === 'ru' ? 'ru_RU' : 'en_US',
		},
		twitter: {
			card: 'summary_large_image',
			title: parsed.kind === 'money' ? title : ogTitle,
			description: parsed.kind === 'money' ? description : ogDescription,
		},
		alternates: propisyuAlternates(seo),
	}
}

export default async function ChisloPropisyuPage({
	params,
}: ChisloPropisyuPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const parsed = parsePropisyuSlug(slug)
	// Historical money/hub pages always expose a Russian UI (chrome + form),
	// even on the unprefixed default-locale shell. Routing/SEO still use
	// `locale` from the URL rewrite (en shell for unprefixed).
	const isHistoricalRuUi =
		parsed.kind === 'money' || parsed.kind === 'decade-hub'
	const uiLocale: Locale = isHistoricalRuUi ? 'ru' : locale
	const dict = await loadNamespaces(uiLocale, namespaces)
	const formDict = await loadNamespaces(uiLocale, ['legacy/ui', 'errors'])
	const t = createT(dict)
	const content = getLegacyContent('chislo-propisyu', locale)
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	// --- Historical money pages (always Russian ruble wording) ---
	if (parsed.kind === 'money') {
		const amount = moneyAmountFromParts(parsed.rubles, parsed.kopecks)
		const h1 = buildMoneySeoH1(amount)
		const breadcrumbs = getLegacyBreadcrumbs(
			uiLocale,
			'chislo-propisyu',
			[parsed.canonicalSlug],
			t,
		)

		return (
			<LegacyPageLayout
				locale={uiLocale}
				title={h1}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				{/* Russian money content + Russian form chrome. */}
				<div lang="ru">
					<div className="mb-8">
						<NumberToWordsForm
							locale={uiLocale}
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
				</div>

				<div className="mt-10">
					<Link
						href={localePath(uiLocale, '/chislo-propisyu')}
						className="text-sm font-medium text-blue-700 hover:underline"
					>
						← Вернуться к конвертеру «Число прописью»
					</Link>
				</div>

				<div className="mt-10">
					<LegacyRelatedLinks locale={uiLocale} toolType="chislo-propisyu" />
				</div>
			</LegacyPageLayout>
		)
	}

	// --- Decade hubs (number base) ---
	if (parsed.kind === 'decade-hub') {
		const hub = findDecadeHub(parsed.start, parsed.end)
		if (!hub) {
			notFound()
		}
		// Historical number-base hubs always present Russian content (SEO family).
		const title = `Числа ${hub.start}–${hub.end} прописью`
		const breadcrumbs = getLegacyBreadcrumbs(
			uiLocale,
			'chislo-propisyu',
			[hub.slug],
			t,
		)

		return (
			<LegacyPageLayout
				locale={uiLocale}
				title={title}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				<div lang="ru">
					<DecadeHubContent locale={uiLocale} hub={hub} forceRussian />
				</div>
			</LegacyPageLayout>
		)
	}

	// --- Legacy currency money format (strict amount; invalid → 404) ---
	if (parsed.kind === 'legacy-money-currency') {
		// Currency drives the engine: USD/EUR → English; RUB → Russian.
		// Do not bind conversion language to the shell locale (EN users on /ru
		// must still get English USD/EUR wording, never RUB N-KK copy).
		const useEnglish =
			parsed.currency === 'usd' || parsed.currency === 'eur'
		let wordRepresentation: string
		try {
			wordRepresentation = useEnglish
				? numberToWordsEnDecimal(parsed.value, {
						format: 'money',
						currency: parsed.currency,
					})
				: numberToWordsRuDecimal(parsed.value, {
						format: 'money',
						currency: parsed.currency,
					})
		} catch {
			notFound()
		}

		const pageTitle = useEnglish
			? `Number ${parsed.numberLabel} in words`
			: `Число ${parsed.numberLabel} прописью`

		return (
			<LegacyPageLayout
				locale={locale}
				title={pageTitle}
				relatedLinks={false}
			>
				<div lang={useEnglish ? 'en' : 'ru'}>
					<div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
						<p className="mb-2 text-sm text-gray-500">
							{useEnglish ? 'Amount' : 'Сумма'}
						</p>
						<p className="mb-4 text-4xl font-bold text-gray-900">
							{parsed.numberLabel}
						</p>
						<p className="text-3xl font-semibold text-blue-600">
							{wordRepresentation}
						</p>
					</div>
				</div>
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// --- Plain number (integer or historical decimal) ---
	if (parsed.kind === 'plain-number') {
		const targetLanguage = parsed.language || 'ru'
		let wordRepresentation: string
		try {
			if (targetLanguage === 'en') {
				wordRepresentation = parsed.isInteger
					? numberToWordsEn(parsed.value)
					: numberToWordsEnDecimal(parsed.value, { format: 'numeric' })
			} else {
				wordRepresentation = parsed.isInteger
					? numberToWordsRu(parsed.value)
					: numberToWordsRuDecimal(parsed.value, { format: 'numeric' })
			}
		} catch {
			// Out-of-range or engine failure on a user URL → 404, never 500.
			notFound()
		}

		const title =
			targetLanguage === 'en'
				? `Number ${parsed.canonicalSlug} in words`
				: `Число ${parsed.canonicalSlug} прописью`
		const breadcrumbs = getLegacyBreadcrumbs(
			locale,
			'chislo-propisyu',
			[parsed.canonicalSlug],
			t,
		)

		return (
			<LegacyPageLayout
				locale={locale}
				title={title}
				relatedLinks={false}
				breadcrumbs={breadcrumbs}
			>
				<div lang={targetLanguage}>
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
							{parsed.canonicalSlug}
						</p>
						<p className="mb-2 text-sm text-gray-500">
							{locale === 'ru' ? 'Прописью' : 'In Words'}
						</p>
						<p className="text-3xl font-semibold text-blue-600">
							{wordRepresentation}
						</p>
					</div>
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
			PROPISYU_DECADE_MAX,
			200,
		)
		if (!validation.valid) {
			notFound()
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
				<div lang="ru">
					<ResultsTable
						columns={[
							{ header: locale === 'ru' ? 'Число' : 'Number', key: 'number' },
							{ header: locale === 'ru' ? 'Прописью' : 'In Words', key: 'words' },
						]}
						data={tableData}
					/>
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
				<LegacyFaqBlock faq={getFaqForLegacyTool('chislo-propisyu')} />
				<LegacyRelatedLinks locale={locale} toolType="chislo-propisyu" />
			</LegacyPageLayout>
		)
	}

	// Truly invalid routes must be HTTP 404 (not 200 + error UI / not 500).
	notFound()
}
