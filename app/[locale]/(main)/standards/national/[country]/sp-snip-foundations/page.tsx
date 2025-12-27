import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
	locales,
	type Locale,
	loadNamespaces,
	createT,
} from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

/**
 * Locale-aware content for SP & SNiP Foundations page
 */
const content = {
	en: {
		title: 'SP & SNiP Foundations – Russian Construction Context Explained',
		schemaDescription: 'Russian SP and SNiP foundations hub explaining soil, concrete, and safety concepts with links to calculators and related articles.',
		countryName: 'Russia',
		intro: [
			'Russian practice relies on SP and legacy SNiP documents that define how foundations are investigated, designed, and executed. They translate regulatory expectations into procedures for soils, concrete, reinforcement, and safety factors.',
			'This page is an educational overview that links calculators and articles to the terminology used across Russian projects.',
		],
		section1Title: 'What These Documents Typically Cover',
		section1Items: [
			{
				title: 'Foundation types and assumptions',
				description: 'SP/SNiP documents explain when to use strip, slab, or pile solutions and which default load paths they assume.',
			},
			{
				title: 'Soil considerations',
				description: 'They define investigation scopes, classification systems, and allowable bearing pressures for Russian geologic conditions.',
			},
			{
				title: 'Concrete and reinforcement concepts',
				description: 'Mix classes, curing requirements, and rebar cover settings ensure foundations reach the strengths assumed in analyses.',
			},
			{
				title: 'Safety factors conceptually',
				description: 'Safety factors describe how permanent, temporary, and seismic actions are combined. They connect local regulations to the broader Eurocode safety philosophy.',
			},
		],
		section1Text: 'In Russian practice, teams often reference international soil guidance such as the ',
		section2Title: 'How This Relates to Estimation',
		section2Items: [
			'Knowing which SP or SNiP applies helps capture the correct soil parameters, mix classes, and rebar cover in cost estimates.',
			'Investigation scope affects drilling costs, lab testing, and schedule risk—important inputs for feasibility studies.',
			'Concrete and rebar calculators can provide quick quantities, but the final numbers must be validated against the latest Russian regulations.',
		],
		section3Title: 'Related Calculators',
		section3Loading: 'Calculators are loading. Refresh if this notice remains.',
		section3Open: 'Open calculator',
		section4Title: 'Related Learn Articles',
		section4Empty: 'Supporting articles are being prepared. Please check back soon.',
		section4Read: 'Read article',
		disclaimerTitle: '⚠️ Very strong disclaimer',
		disclaimerItems: [
			'Educational resource only. No regulatory compliance.',
			'SP/SNiP documents are updated frequently. Always consult the latest official publications and local authorities.',
			'Foundation design and verification require licensed professional engineers familiar with current Russian codes.',
		],
		calculatorConfigs: [
			{
				id: 'strip-foundation-calculator',
				shortTitle: 'Strip Foundation',
				description: 'Estimate wall footing sizes before SP verification.',
			},
			{
				id: 'slab-foundation-calculator',
				shortTitle: 'Slab Foundation',
				description: 'Plan slab-on-grade thickness that later aligns with SP checks.',
			},
			{
				id: 'pile-foundation-calculator',
				shortTitle: 'Pile Foundation',
				description: 'Approximate pile quantity and length for weak soils.',
			},
			{
				id: 'foundation-volume-calculator',
				shortTitle: 'Foundation Volume',
				description: 'Convert conceptual dimensions into cubic meters for ordering.',
			},
			{
				id: 'concrete-volume-calculator',
				shortTitle: 'Concrete Volume',
				description: 'General-purpose volume calculator for Russian pours.',
			},
			{
				id: 'rebar-calculator',
				shortTitle: 'Rebar Calculator',
				description: 'Estimate reinforcement weight used in SP/SNiP detailing.',
			},
		],
	},
	ru: {
		title: 'СП и СНиП – фундаменты',
		schemaDescription: 'Образовательный хаб по фундаментам СП и СНиП, объясняющий концепции грунтов, бетона и безопасности со ссылками на калькуляторы и связанные статьи.',
		countryName: 'Россия',
		intro: [
			'Российская практика опирается на документы СП и устаревшие СНиП, которые определяют, как исследуются, проектируются и выполняются фундаменты. Они переводят нормативные ожидания в процедуры для грунтов, бетона, арматуры и коэффициентов безопасности.',
			'Эта страница представляет собой образовательный обзор, который связывает калькуляторы и статьи с терминологией, используемой в российских проектах.',
		],
		section1Title: 'Что обычно охватывают эти документы',
		section1Items: [
			{
				title: 'Типы фундаментов и допущения',
				description: 'Документы СП/СНиП объясняют, когда использовать ленточные, плитные или свайные решения и какие пути нагрузки они предполагают по умолчанию.',
			},
			{
				title: 'Соображения по грунтам',
				description: 'Они определяют объёмы изысканий, системы классификации и допустимые давления на грунт для российских геологических условий.',
			},
			{
				title: 'Концепции бетона и арматуры',
				description: 'Классы смесей, требования к уходу и настройки защитного слоя арматуры обеспечивают достижение фундаментами прочностей, предполагаемых в анализах.',
			},
			{
				title: 'Коэффициенты безопасности концептуально',
				description: 'Коэффициенты безопасности описывают, как комбинируются постоянные, временные и сейсмические воздействия. Они связывают местные нормативы с более широкой философией безопасности Eurocode.',
			},
		],
		section1Text: 'В российской практике команды часто ссылаются на международные руководства по грунтам, такие как ',
		section2Title: 'Как это связано с оценкой',
		section2Items: [
			'Знание того, какой СП или СНиП применяется, помогает правильно определить параметры грунта, классы смесей и защитный слой арматуры в сметах.',
			'Объём изысканий влияет на стоимость бурения, лабораторных испытаний и риски сроков—важные входные данные для исследований осуществимости.',
			'Калькуляторы бетона и арматуры могут предоставить быстрые количества, но окончательные числа должны быть проверены в соответствии с последними российскими нормами.',
		],
		section3Title: 'Связанные калькуляторы',
		section3Loading: 'Калькуляторы загружаются. Обновите страницу, если это уведомление остаётся.',
		section3Open: 'Открыть калькулятор',
		section4Title: 'Связанные материалы',
		section4Empty: 'Поддерживающие статьи готовятся. Пожалуйста, проверьте позже.',
		section4Read: 'Читать статью',
		disclaimerTitle: '⚠️ Очень сильное предупреждение',
		disclaimerItems: [
			'Только образовательный ресурс. Нет нормативного соответствия.',
			'Документы СП/СНиП часто обновляются. Всегда консультируйтесь с последними официальными публикациями и местными властями.',
			'Проектирование и проверка фундаментов требуют лицензированных профессиональных инженеров, знакомых с текущими российскими нормами.',
		],
		calculatorConfigs: [
			{
				id: 'strip-foundation-calculator',
				shortTitle: 'Ленточный фундамент',
				description: 'Оценить размеры ленточного фундамента перед проверкой по СП.',
			},
			{
				id: 'slab-foundation-calculator',
				shortTitle: 'Плита на грунте',
				description: 'Спланировать толщину плиты на грунте, которая позже будет соответствовать проверкам по СП.',
			},
			{
				id: 'pile-foundation-calculator',
				shortTitle: 'Свайный фундамент',
				description: 'Приблизительно оценить количество и длину свай для слабых грунтов.',
			},
			{
				id: 'foundation-volume-calculator',
				shortTitle: 'Объём фундамента',
				description: 'Преобразовать концептуальные размеры в кубические метры для заказа.',
			},
			{
				id: 'concrete-volume-calculator',
				shortTitle: 'Объём бетона',
				description: 'Универсальный калькулятор объёма для российских заливок.',
			},
			{
				id: 'rebar-calculator',
				shortTitle: 'Калькулятор арматуры',
				description: 'Оценить вес арматуры, используемой в деталировке СП/СНиП.',
			},
		],
	},
} as const

const articleSlugs = [
	'soil-basics-for-foundations',
	'when-to-use-piles',
	'concrete-foundations-explained',
]

interface SpSnipFoundationsPageProps {
	params: {
		locale: Locale
		country: string
	}
}

function getContent(locale: Locale) {
	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'
	return content[contentLocale] || content.en
}

export async function generateMetadata({
	params,
}: SpSnipFoundationsPageProps): Promise<Metadata> {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'ru') {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`
	const c = getContent(locale)

	return {
		title: c.title,
		description: c.schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/ru/sp-snip-foundations',
				ru: '/ru/standards/national/ru/sp-snip-foundations',
				es: '/es/standards/national/ru/sp-snip-foundations',
				tr: '/tr/standards/national/ru/sp-snip-foundations',
				hi: '/hi/standards/national/ru/sp-snip-foundations',
			},
			canonical: `${basePath}/standards/national/ru/sp-snip-foundations`,
		},
		openGraph: {
			title: c.title,
			description: c.schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/ru/sp-snip-foundations`,
			type: 'article',
		},
	}
}

export default async function SpSnipFoundationsPage({
	params,
}: SpSnipFoundationsPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'ru') {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const c = getContent(locale)
	const countryName = c.countryName

	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		'ru',
		countryName,
		t,
	)

	const calculatorsResults = await Promise.all(
		c.calculatorConfigs.map(async (config) => {
			const calc = await calculatorRegistry.getById(config.id, locale)
			return calc
				? {
						id: config.id,
						shortTitle: config.shortTitle,
						description: config.description,
						category: calc.category,
						slug: calc.slug,
						title: calc.title,
				  }
				: null
		}),
	)

	const calculators = calculatorsResults.filter((calc) => calc !== null) as Array<{
		id: string
		shortTitle: string
		description: string
		category: string
		slug: string
		title: string
	}>

	const articles = (
		await Promise.all(
			articleSlugs.map(async (slug) => {
				const localized = await articleRegistry.getBySlug(slug, locale)
				if (localized) {
					return localized
				}
				return articleRegistry.getBySlug(slug, 'en')
			}),
		)
	).filter((article): article is NonNullable<typeof article> => article !== null)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: c.title,
		description: c.schemaDescription,
		inLanguage: locale,
		about: locale === 'ru' 
			? ['СП', 'СНиП', 'фундаменты', 'Россия']
			: ['SP', 'SNiP', 'foundations', 'Russia'],
		isPartOf: {
			'@type': 'CollectionPage',
			name: locale === 'ru' ? 'Российские национальные стандарты' : 'Russian National Standards',
			url: `https://first-calc.com${localePrefix}/standards/national/ru`,
		},
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<h1 className="text-4xl font-bold text-gray-900 mb-6">
					{c.title}
				</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-10">
					{c.intro.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section1Title}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{c.section1Items.map((item, index) => (
							<div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{item.title}
								</h3>
								<p className="text-gray-700">{item.description}</p>
							</div>
						))}
					</div>
					<p className="text-gray-600 mt-4">
						{c.section1Text}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/ISO/soil-and-foundations`}
						>
							ISO Soil & Foundations hub
						</Link>
						.
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section2Title}
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						{c.section2Items.map((item, index) => (
							<p key={index}>{item}</p>
						))}
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section3Title}
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">{c.section3Loading}</p>
					) : (
						<ul className="space-y-4">
							{calculators.map((calc) => (
								<li
									key={calc.id}
									className="bg-white border border-gray-200 rounded-lg p-4"
								>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
										<div>
											<h3 className="text-lg font-semibold text-gray-900">
												{calc.shortTitle || calc.title}
											</h3>
											<p className="text-gray-600 text-sm">
												{
													c.calculatorConfigs.find(
														(config) => config.id === calc.id,
													)?.description
												}
											</p>
										</div>
										<Link
											className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
											href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
										>
											{c.section3Open} →
										</Link>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section4Title}
					</h2>
					{articles.length === 0 ? (
						<p className="text-gray-600">{c.section4Empty}</p>
					) : (
						<ul className="space-y-4">
							{articles.map((article) => (
								<li
									key={article.id}
									className="bg-white border border-gray-200 rounded-lg p-4"
								>
									<h3 className="text-lg font-semibold text-gray-900 mb-1">
										{article.title}
									</h3>
									{article.shortDescription && (
										<p className="text-gray-600 text-sm mb-2">
											{article.shortDescription}
										</p>
									)}
									<Link
										className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
										href={`/${locale}/learn/${article.slug}`}
									>
										{c.section4Read} →
									</Link>
								</li>
							))}
						</ul>
					)}
				</section>

				<div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-red-900 mb-3">
						{c.disclaimerTitle}
					</h2>
					<ul className="space-y-2 text-red-800">
						{c.disclaimerItems.map((item, index) => (
							<li key={index}>
								<strong>{item}</strong>
							</li>
						))}
					</ul>
				</div>
			</PageContainer>
		</>
	)
}
