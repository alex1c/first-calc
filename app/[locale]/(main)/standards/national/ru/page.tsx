import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

interface RuStandardsLandingProps {
	params: { locale: Locale }
}

/**
 * Locale-aware content for Russian National Standards landing page
 */
const content = {
	en: {
		title: 'Russian National Standards (SP & SNiP) – Overview',
		schemaDescription:
			'Educational overview of SP and SNiP standards focusing on connections between loads, soils, and concrete in Russian practice.',
		countryName: 'Russia',
		intro: [
			'The SP series evolved from historical SNiP documents and provides a common language for discussing loads, soils, concrete, and reinforcement. In practice, these documents help align expectations between clients, designers, and builders at early stages.',
			'The goal of this section is to show how key SP blocks are interconnected and where typical approaches are applied. The material is educational and helps understand terminology commonly used in estimates and planning.',
			'We avoid legal formulations and do not replace full design work. This is a reference overview that suggests which topics require in-depth study by specialized professionals.',
		],
		section1Title: 'How Documents Are Conceptually Connected',
		section1Items: [
			{
				title: 'Loads',
				description:
					'SP 20 discusses permanent and temporary actions, climate factors, and approaches to combinations for preliminary calculations and cost estimates.',
			},
			{
				title: 'Soils and Foundations',
				description:
					'SP 24 considers soil categories, groundwater, and the transition from shallow foundations to piles depending on site conditions.',
			},
			{
				title: 'Concrete and Reinforcement',
				description:
					'SP 63 describes concrete classes, protective layers, and general principles of reinforcement placement for durability and crack control.',
			},
		],
		section2Title: 'SP Hubs',
		section2OpenHub: 'Open hub',
		section2Hubs: [
			{
				href: '/standards/national/ru/sp20-load-concepts',
				title: 'SP 20.13330 – Load Concepts',
				description:
					'Permanent, temporary, and climate actions and how they are discussed in early estimates.',
			},
			{
				href: '/standards/national/ru/sp24-soil-foundations',
				title: 'SP 24.13330 – Soil & Foundations',
				description:
					'Soil classification, groundwater influence, and foundation type selection in estimation context.',
			},
			{
				href: '/standards/national/ru/sp63-concrete-principles',
				title: 'SP 63.13330 – Concrete Principles',
				description:
					'Principles for selecting concrete classes, protective layers, and reinforcement without references to specific checks.',
			},
			{
				href: '/standards/national/ru/sp-snip-foundations',
				title: 'SP & SNiP – Foundations',
				description:
					'Connecting soil investigations, concrete, and reinforcement with useful calculators for preliminary estimates.',
			},
		],
		section3Title: 'Practical Meaning for Estimates',
		section3Items: [
			'Loads per SP 20 affect foundation slab and strip dimensions, which means concrete and reinforcement volumes in estimates.',
			'Soil categories per SP 24 set limits on bearing capacity and settlements, helping choose foundation scheme before geological investigations.',
			'SP 63 principles suggest which concrete classes and protective layers to include in material procurement, even before detailed calculations.',
		],
		section4Title: 'Estimation vs. Design',
		section4Text:
			'Here we consider concepts and typical connections between SP documents that are useful for preliminary estimates. Full checks and design solutions are performed by engineers considering current document editions and regional requirements.',
		section5Title: 'What to Remember',
		section5Items: [
			'Material focuses on understanding concepts, not on checking design solutions.',
			'Actual requirements may differ by region and SP editions.',
			'At early stages, it is better to document assumptions about loads, soils, and concrete classes.',
		],
		disclaimerTitle: '⚠️ Strong Warning',
		disclaimerItems: [
			'Material is for educational and estimation purposes only.',
			'Does not replace engineering design and local requirements.',
			'Regulatory documents are updated; refer to current versions and specialized professionals.',
		],
	},
	ru: {
		title: 'Российские национальные стандарты (СП и СНиП) – обзор',
		schemaDescription:
			'Образовательный обзор СП и СНиП с акцентом на связи нагрузок, грунтов и бетона в российской практике.',
		countryName: 'Россия',
		intro: [
			'Серия СП выросла из исторических СНиПов и аккумулирует общий язык для обсуждения нагрузок, грунтов, бетона и армирования. На практике эти документы помогают согласовать ожидания заказчика, проектировщика и строителя на ранних этапах.',
			'Цель этого раздела — показать, как ключевые блоки СП связаны между собой и где применяются типичные подходы. Материал носит образовательный характер и помогает понять терминологию, которую часто используют при оценках и планировании.',
			'Мы избегаем юридических формулировок и не заменяем полноценное проектирование. Это справочный обзор, который подсказывает, какие темы требуют глубокого изучения у профильных специалистов.',
		],
		section1Title: 'Как документы связаны концептуально',
		section1Items: [
			{
				title: 'Нагрузки',
				description:
					'СП 20 обсуждает постоянные и временные воздействия, климатические факторы и подходы к комбинациям для предварительных расчетов и сметных оценок.',
			},
			{
				title: 'Грунты и основания',
				description:
					'СП 24 рассматривает категории грунтов, подземные воды и переход от мелких фундаментов к сваям в зависимости от условий площадки.',
			},
			{
				title: 'Бетон и арматура',
				description:
					'СП 63 описывает классы бетона, защитные слои и общие принципы расположения арматуры для долговечности и контроля трещин.',
			},
		],
		section2Title: 'Хабы по СП',
		section2OpenHub: 'Открыть хаб',
		section2Hubs: [
			{
				href: '/standards/national/ru/sp20-load-concepts',
				title: 'СП 20.13330 – концепции нагрузок',
				description:
					'Постоянные, временные, климатические воздействия и то, как они обсуждаются в ранних оценках.',
			},
			{
				href: '/standards/national/ru/sp24-soil-foundations',
				title: 'СП 24.13330 – грунты и фундаменты',
				description:
					'Классификация грунтов, влияние грунтовых вод и выбор типа фундамента в оценочном контексте.',
			},
			{
				href: '/standards/national/ru/sp63-concrete-principles',
				title: 'СП 63.13330 – принципы бетона',
				description:
					'Принципы подбора классов бетона, защитных слоев и армирования без ссылок на конкретные проверки.',
			},
			{
				href: '/standards/national/ru/sp-snip-foundations',
				title: 'СП и СНиП – фундаменты',
				description:
					'Соединяем грунтовые исследования, бетон и арматуру с полезными калькуляторами для предварительных оценок.',
			},
		],
		section3Title: 'Практический смысл для оценок',
		section3Items: [
			'Нагрузки по СП 20 влияют на размеры фундаментных плит и лент, а значит — на объёмы бетона и арматуры в смете.',
			'Грунтовые категории СП 24 задают пределы несущей способности и осадок, что помогает выбрать схему основания до геологических изысканий.',
			'Принципы СП 63 подсказывают, какие классы бетона и защитные слои закладывать при закупках материалов, даже до детального расчёта.',
		],
		section4Title: 'Оценка против проектирования',
		section4Text:
			'Здесь рассматриваются концепции и типовые связи между СП, которые полезны для предварительных оценок. Полные проверки и проектные решения выполняют инженеры с учётом актуальных редакций документов и требований региона.',
		section5Title: 'Что важно помнить',
		section5Items: [
			'Материал ориентирован на понимание концепций, а не на проверку проектных решений.',
			'Фактические требования могут отличаться по регионам и редакциям СП.',
			'На ранних стадиях лучше фиксировать допущения по нагрузкам, грунтам и классам бетона.',
		],
		disclaimerTitle: '⚠️ Сильное предупреждение',
		disclaimerItems: [
			'Материал носит образовательный и оценочный характер.',
			'Не заменяет инженерное проектирование и местные требования.',
			'Нормативные документы обновляются; обращайтесь к действующим версиям и профильным специалистам.',
		],
	},
} as const

function getContent(locale: Locale) {
	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'
	return content[contentLocale] || content.en
}

export async function generateMetadata({
	params,
}: RuStandardsLandingProps): Promise<Metadata> {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`
	const c = getContent(locale)

	return {
		title: c.title,
		description: c.schemaDescription,
		alternates: {
			languages: {
				en: '/standards/national/ru',
				ru: '/ru/standards/national/ru',
				es: '/es/standards/national/ru',
				tr: '/tr/standards/national/ru',
				hi: '/hi/standards/national/ru',
			},
			canonical: `${basePath}/standards/national/ru`,
		},
		openGraph: {
			title: c.title,
			description: c.schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/ru`,
			type: 'article',
		},
	}
}

export default async function RuStandardsLanding({
	params,
}: RuStandardsLandingProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const dict = await loadNamespaces(locale, ['common', 'navigation'])
	const t = createT(dict)
	const c = getContent(locale)
	const localePrefix = locale === 'en' ? '' : `/${locale}`

	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		'ru',
		c.countryName,
		t,
	)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: c.title,
		description: c.schemaDescription,
		inLanguage: locale,
		about:
			locale === 'ru'
				? ['СП 20', 'СП 24', 'СП 63', 'российские стандарты']
				: ['SP 20', 'SP 24', 'SP 63', 'Russian standards'],
		isPartOf: {
			'@type': 'CollectionPage',
			name:
				locale === 'ru'
					? 'Российские национальные стандарты'
					: 'Russian National Standards',
			url: `https://first-calc.com${localePrefix}/standards/national`,
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
				<div className="prose prose-lg max-w-none text-gray-700 mb-8">
					{c.intro.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section1Title}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{c.section1Items.map((item, index) => (
							<div
								key={index}
								className="bg-white border border-gray-200 rounded-lg p-4"
							>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{item.title}
								</h3>
								<p className="text-gray-700 text-sm">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section2Title}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{c.section2Hubs.map((hub, index) => (
							<Link
								key={index}
								href={`${localePrefix}${hub.href}`}
								className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
							>
								<p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
									{c.section2OpenHub}
								</p>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{hub.title}
								</h3>
								<p className="text-gray-600 text-sm">
									{hub.description}
								</p>
							</Link>
						))}
					</div>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						{c.section3Title}
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
						{c.section3Items.map((item, index) => (
							<p key={index}>{item}</p>
						))}
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section4Title}
					</h2>
					<p className="text-gray-700">{c.section4Text}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section5Title}
					</h2>
					<ul className="list-disc pl-5 text-gray-700 space-y-2">
						{c.section5Items.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
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
