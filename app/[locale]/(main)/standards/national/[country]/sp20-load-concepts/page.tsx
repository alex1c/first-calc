import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'

/**
 * Locale-aware content for SP 20 Load Concepts page
 */
const content = {
	en: {
		title: 'SP 20.13330 – Load Concepts',
		schemaDescription: 'Educational overview of SP 20.13330: load types, climate actions, and combination approaches in estimation context.',
		countryName: 'Russia',
		intro: [
			'SP 20 is commonly discussed as a foundational document for loads in Russian practice. It helps establish baseline actions before moving to calculations and detailing.',
			'This page provides an educational description of load categories and combinations without references to regulatory checks. The material is useful for estimators and engineers at early stages.',
			'Additional hubs on Russian documents can be found on the ',
		],
		section1Title: 'What Load Concepts Cover',
		section1Items: [
			{
				title: 'Permanent Loads',
				description: 'Self-weight of structures, finishes, and building systems. These values form the basis for all subsequent combinations.',
			},
			{
				title: 'Variable Actions',
				description: 'Live loads from people, furniture, equipment. Their intensity depends on room function and operational stage.',
			},
			{
				title: 'Climate Influences',
				description: 'Snow, wind, and temperature variations create additional forces. For early estimates, it is important to consider regional differences and building height.',
			},
			{
				title: 'Special Actions',
				description: 'Seismic or installation scenarios add rare but critical combinations. They show where structures may require reserves.',
			},
		],
		section2Title: 'Why Assumptions Matter',
		section2Text: 'Early load decisions determine slab thickness, support sizes, and material volumes. Correct assumptions affect estimates, schedules, and equipment selection for construction.',
		section2Takeaway: 'Practical Takeaway',
		section2TakeawayText: 'Clarify which variable loads and climate conditions are assumed in the project, and document them in calculation notes. This simplifies option comparison and budget adjustments.',
		section3Title: 'How to Read Combinations',
		section3Items: [
			'Evaluate the main combination with permanent and live loads separately.',
			'Climate actions add alternative scenarios that may govern reinforcement.',
			'Rare combinations help check structure sensitivity to installation and emergency situations.',
		],
		section3Text: 'In estimation context, combinations show which project elements will require reserves in concrete mass or reinforcement density, even without detailed calculations.',
		section4Title: 'Estimation vs. Design',
		section4Text: 'This section discusses principles for preliminary calculations. Full design checks are performed by qualified engineers using current SP editions and regional requirements.',
		section5Title: 'Related Calculators',
		section5Loading: 'Calculators are loading. Refresh the page if needed.',
		section5Open: 'Open calculator',
		section6Title: 'Related Standards',
		section6Text: 'For comparison of load concepts, see the European overview ',
		section6Text2: ' to understand the general logic of international approaches.',
		section7Title: 'Related Learn Articles',
		section7Empty: 'Articles will appear later.',
		section7Read: 'Read',
		disclaimerTitle: '⚠️ Strong Disclaimer',
		disclaimerItems: [
			'Content is for learning and preliminary estimates only.',
			'Does not replace design and engineering checks per current documents.',
			'Requirements and SP editions change; verify with current publications and consult specialists.',
		],
		calculatorConfigs: [
			{
				id: 'slab-foundation-calculator',
				shortTitle: 'Slab Foundation',
				description: 'Quickly estimate slab thickness and dimensions for early estimates.',
			},
			{
				id: 'foundation-volume-calculator',
				shortTitle: 'Foundation Volume',
				description: 'Convert loads into concrete volume for procurement.',
			},
			{
				id: 'stair-calculator',
				shortTitle: 'Stair Calculator',
				description: 'Estimate loads from stairs and select step dimensions.',
			},
		],
	},
	ru: {
		title: 'СП 20.13330 – концепции нагрузок',
		schemaDescription: 'Образовательный обзор СП 20.13330: типы нагрузок, климатические воздействия и подходы к комбинациям в оценочном контексте.',
		countryName: 'Россия',
		intro: [
			'СП 20 часто обсуждается как базовый документ по нагрузкам в российской практике. Он помогает договориться об исходных воздействиях, прежде чем переходить к расчётам и деталировке.',
			'Эта страница даёт образовательное описание категорий нагрузок и комбинаций без ссылок на нормативные проверки. Материал полезен для сметчиков и инженеров на ранних стадиях.',
			'Дополнительные хабы по российским документам можно найти на странице ',
		],
		section1Title: 'Что охватывают концепции нагрузок',
		section1Items: [
			{
				title: 'Постоянные нагрузки',
				description: 'Собственный вес конструкций, отделки и инженерных систем. Эти значения формируют основу для всех последующих комбинаций.',
			},
			{
				title: 'Временные воздействия',
				description: 'Полезные нагрузки от людей, мебели, оборудования. Их интенсивность зависит от назначения помещения и стадии эксплуатации.',
			},
			{
				title: 'Климатические влияния',
				description: 'Снег, ветер и температурные перепады задают дополнительные усилия. При ранних оценках важно учитывать региональные различия и высоту здания.',
			},
			{
				title: 'Особые действия',
				description: 'Сейсмика или монтажные сценарии добавляют редкие, но критичные сочетания. Они показывают, где конструкция может требовать резервов.',
			},
		],
		section2Title: 'Почему важны допущения',
		section2Text: 'Ранние решения по нагрузкам определяют толщину плит, размеры опор и объёмы материалов. От корректных допущений зависят сметы, сроки и выбор оборудования для строительства.',
		section2Takeaway: 'Практический вывод',
		section2TakeawayText: 'Уточните, какие временные нагрузки и климатические условия принимаются в проекте, и фиксируйте их в расчётных записках. Это упростит сравнение вариантов и корректировку бюджета.',
		section3Title: 'Как читают комбинации',
		section3Items: [
			'Отдельно оценивают основную комбинацию с постоянными и полезными нагрузками.',
			'Климатические воздействия добавляют альтернативные сценарии, которые могут управлять армированием.',
			'Редкие комбинации помогают проверить чувствительность конструкции к монтажным и аварийным ситуациям.',
		],
		section3Text: 'В оценочном контексте комбинации показывают, какие элементы проекта потребуют запаса по массе бетона или плотности арматуры, даже без детальных расчётов.',
		section4Title: 'Оценка против проектирования',
		section4Text: 'Здесь рассматриваются принципы для предварительных расчётов. Полные проектные проверки выполняют профильные инженеры с использованием актуальных редакций СП и региональных требований.',
		section5Title: 'Связанные калькуляторы',
		section5Loading: 'Калькуляторы загружаются. Обновите страницу при необходимости.',
		section5Open: 'Открыть калькулятор',
		section6Title: 'Связанные стандарты',
		section6Text: 'Для сравнения концепций нагрузок можно посмотреть европейский обзор ',
		section6Text2: ', чтобы понять общую логику международных подходов.',
		section7Title: 'Связанные материалы',
		section7Empty: 'Статьи появятся позже.',
		section7Read: 'Читать',
		disclaimerTitle: '⚠️ Сильное предупреждение',
		disclaimerItems: [
			'Материал предназначен для обучения и предварительных оценок.',
			'Не заменяет проектирование и инженерные проверки по действующим документам.',
			'Требования и редакции СП меняются; сверяйтесь с актуальными изданиями и консультируйтесь со специалистами.',
		],
		calculatorConfigs: [
			{
				id: 'slab-foundation-calculator',
				shortTitle: 'Плита на грунте',
				description: 'Быстро прикинуть толщину и размеры плиты для ранних оценок.',
			},
			{
				id: 'foundation-volume-calculator',
				shortTitle: 'Объём фундамента',
				description: 'Перевести нагрузки в кубатуру бетона для закупок.',
			},
			{
				id: 'stair-calculator',
				shortTitle: 'Лестничные марши',
				description: 'Оценить нагрузки от лестниц и подобрать габариты ступеней.',
			},
		],
	},
} as const

const articleSlugs = ['what-are-structural-loads']

interface Sp20PageProps {
	params: { locale: Locale; country: string }
}

function getContent(locale: Locale) {
	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'
	return content[contentLocale] || content.en
}

export async function generateMetadata({ params }: Sp20PageProps): Promise<Metadata> {
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
				en: '/standards/national/ru/sp20-load-concepts',
				ru: '/ru/standards/national/ru/sp20-load-concepts',
				es: '/es/standards/national/ru/sp20-load-concepts',
				tr: '/tr/standards/national/ru/sp20-load-concepts',
				hi: '/hi/standards/national/ru/sp20-load-concepts',
			},
			canonical: `${basePath}/standards/national/ru/sp20-load-concepts`,
		},
		openGraph: {
			title: c.title,
			description: c.schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/ru/sp20-load-concepts`,
			type: 'article',
		},
	}
}

export default async function Sp20Page({ params }: Sp20PageProps) {
	const { locale, country } = params

	if (!locales.includes(locale) || country !== 'ru') {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const c = getContent(locale)
	const countryName = c.countryName

	const breadcrumbs = getNationalStandardsBreadcrumbs(locale, 'ru', countryName, t)

	const calculators = (
		await Promise.all(
			c.calculatorConfigs.map(async (config) => {
				const calc = await calculatorRegistry.getById(config.id, locale)
				return calc
					? {
							...config,
							category: calc.category,
							slug: calc.slug,
							title: calc.title,
							shortTitle: 'shortTitle' in calc ? calc.shortTitle : undefined,
					  }
					: null
			}),
		)
	).filter((calc): calc is NonNullable<typeof calc> => calc !== null) as Array<{
		id: string
		category: string
		slug: string
		title: string
		shortTitle?: string
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
			? ['нагрузки', 'СП 20', 'климатические воздействия', 'комбинации']
			: ['loads', 'SP 20', 'climate actions', 'combinations'],
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
				<h1 className="text-4xl font-bold text-gray-900 mb-6">{c.title}</h1>
				<div className="prose prose-lg max-w-none text-gray-700 mb-8">
					{c.intro.map((paragraph, index) => (
						<p key={index}>
							{paragraph}
							{index === 2 && (
								<>
									<Link
										className="text-blue-600 hover:text-blue-800 underline"
										href={`/${locale}/standards/national/ru`}
									>
										{locale === 'ru' ? 'Российские национальные стандарты' : 'Russian National Standards'}
									</Link>
									.
								</>
							)}
						</p>
					))}
				</div>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section1Title}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{c.section1Items.map((item, index) => (
							<div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{item.title}
								</h3>
								<p className="text-gray-700 text-sm">{item.description}</p>
							</div>
						))}
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section2Title}
					</h2>
					<p className="text-gray-700 mb-3">{c.section2Text}</p>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-blue-900">
						<h3 className="text-lg font-semibold mb-2">{c.section2Takeaway}</h3>
						<p>{c.section2TakeawayText}</p>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section3Title}
					</h2>
					<ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
						{c.section3Items.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
					<p className="text-gray-700">{c.section3Text}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section4Title}
					</h2>
					<p className="text-gray-700">{c.section4Text}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section5Title}
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">{c.section5Loading}</p>
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
											{c.section5Open} →
										</Link>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section6Title}
					</h2>
					<p className="text-gray-700">
						{c.section6Text}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/EU/eurocode-1`}
						>
							Eurocode 1
						</Link>
						{c.section6Text2}
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section7Title}
					</h2>
					{articles.length === 0 ? (
						<p className="text-gray-600">{c.section7Empty}</p>
					) : (
						<ul className="space-y-3">
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
										{c.section7Read} →
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
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>
			</PageContainer>
		</>
	)
}
