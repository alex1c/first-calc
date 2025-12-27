import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'

/**
 * Locale-aware content for SP 24 Soil & Foundations page
 */
const content = {
	en: {
		title: 'SP 24.13330 – Soil & Foundations',
		schemaDescription: 'Educational overview of SP 24.13330: soil categories, groundwater, and selection of shallow or pile foundations without regulatory references.',
		countryName: 'Russia',
		intro: [
			'SP 24 helps discuss how soil properties influence foundation type selection. At early stages, it is important to understand which baseline data may change the foundation scheme and work volumes.',
			'This page describes concepts without references to regulatory checks and is useful for those estimating investigation costs, earthworks, and concrete structures.',
			'Return to the overview via the ',
		],
		section1Title: 'What Soil Concepts Cover',
		section1Items: [
			{
				title: 'Soil Categories',
				description: 'Compacted sands, clays, weak soils, and collapsible varieties are discussed in terms of bearing capacity and deformations.',
			},
			{
				title: 'Groundwater',
				description: 'Water level and aggressiveness influence concrete grade selection, waterproofing needs, and the possibility of excavation without dewatering.',
			},
			{
				title: 'Settlement and Stiffness',
				description: 'Predicted settlements set limits on slab thickness and reinforcement, as well as pile length for transferring loads to stable layers.',
			},
			{
				title: 'Excavation and Backfill Risks',
				description: 'Decisions are needed on slopes, excavation support, and backfill compaction control to avoid losing bearing capacity.',
			},
		],
		section2Title: 'When to Choose Piles or Shallow Foundations',
		section2Takeaway: 'Practical Takeaway',
		section2TakeawayText: 'If predicted settlements exceed building tolerances or adjacent loads act nearby, switch to a pile scheme to transfer forces to denser layers.',
		section2Items: [
			'Shallow foundations work well for moderate loads and stable soils.',
			'Pile fields are considered for weak soils, high groundwater, or strict deformation requirements.',
			'Preliminary geology and load scenarios set direction for further design.',
		],
		section2Text: 'These decisions at the estimation stage help understand concrete volumes, reinforcement, and drilling work in advance, even before detailed calculations.',
		section3Title: 'Estimation vs. Design',
		section3Text: 'This section presents principles for approximate calculations. Detailed checks are performed by design engineers using current SP editions and local requirements for soils and hydrogeology.',
		section4Title: 'Related Calculators',
		section4Loading: 'Calculators are loading. Refresh the page if needed.',
		section4Open: 'Open calculator',
		section5Title: 'Related Standards',
		section5Text: 'For international context, see the ',
		section5Text2: ' to compare terminology and approaches.',
		section6Title: 'Related Learn Articles',
		section6Empty: 'Articles will appear later.',
		section6Read: 'Read',
		disclaimerTitle: '⚠️ Strong Disclaimer',
		disclaimerItems: [
			'Content is for learning and preliminary estimates only.',
			'Does not replace design and engineering checks per current documents.',
			'Soil conditions vary significantly; consult current SP documents and geotechnical specialists.',
		],
		calculatorConfigs: [
			{
				id: 'strip-foundation-calculator',
				shortTitle: 'Strip Foundation',
				description: 'Estimate footing width and height for given reactions.',
			},
			{
				id: 'slab-foundation-calculator',
				shortTitle: 'Slab Foundation',
				description: 'Estimate slab thickness and reinforcement for soft soils.',
			},
			{
				id: 'pile-foundation-calculator',
				shortTitle: 'Pile Foundation',
				description: 'Estimate pile quantity and length based on site bearing capacity.',
			},
		],
	},
	ru: {
		title: 'СП 24.13330 – грунты и фундаменты',
		schemaDescription: 'Образовательный обзор СП 24.13330: категории грунтов, грунтовые воды и выбор мелких или свайных фундаментов без нормативных ссылок.',
		countryName: 'Россия',
		intro: [
			'СП 24 помогает обсуждать, как свойства грунта влияют на выбор типа основания. На ранних стадиях важно понимать, какие исходные данные могут поменять схему фундамента и объём работ.',
			'Страница описывает концепции без ссылок на нормативные проверки и пригодится тем, кто оценивает стоимость изысканий, земляных работ и бетонных конструкций.',
			'Вернуться к общему обзору можно через страницу ',
		],
		section1Title: 'Что охватывают грунтовые концепции',
		section1Items: [
			{
				title: 'Категории грунтов',
				description: 'Уплотнённые пески, глины, слабые грунты и просадочные разновидности обсуждаются с точки зрения несущей способности и деформаций.',
			},
			{
				title: 'Грунтовые воды',
				description: 'Уровень и агрессивность воды влияют на выбор марки бетона, необходимость гидроизоляции и возможность котлована без водопонижения.',
			},
			{
				title: 'Осадки и жёсткость',
				description: 'Прогнозируемые осадки задают ограничения по толщине и армированию плит, а также по длине свай для передачи нагрузок на устойчивые слои.',
			},
			{
				title: 'Риски выемки и обратной засыпки',
				description: 'Требуются решения по откосам, креплениям котлованов и контролю уплотнения обратной засыпки, чтобы не потерять несущую способность.',
			},
		],
		section2Title: 'Когда выбирают сваи или мелкие фундаменты',
		section2Takeaway: 'Практический вывод',
		section2TakeawayText: 'Если прогнозируемые осадки превышают допуски здания или рядом действуют соседние нагрузки, переходят к свайной схеме, чтобы передать усилия на более плотные слои.',
		section2Items: [
			'Мелкие основания удобны при умеренных нагрузках и устойчивых грунтах.',
			'Свайные поля рассматривают при слабых грунтах, высоком УГВ или жёстких требованиях к деформациям.',
			'Предварительная геология и нагрузочные сценарии задают направление для дальнейшего проектирования.',
		],
		section2Text: 'Эти решения на оценочной стадии помогают заранее понять объёмы бетона, арматуры и буровых работ, даже до детальных расчётов.',
		section3Title: 'Оценка против проектирования',
		section3Text: 'Здесь приведены принципы для ориентировочных расчётов. Детальные проверки выполняют инженеры-проектировщики с использованием актуальных редакций СП и местных требований по грунтам и гидрогеологии.',
		section4Title: 'Связанные калькуляторы',
		section4Loading: 'Калькуляторы загружаются. Обновите страницу при необходимости.',
		section4Open: 'Открыть калькулятор',
		section5Title: 'Связанные стандарты',
		section5Text: 'Для международного контекста можно посмотреть ',
		section5Text2: ', чтобы сопоставить терминологию и подходы.',
		section6Title: 'Связанные материалы',
		section6Empty: 'Статьи появятся позже.',
		section6Read: 'Читать',
		disclaimerTitle: '⚠️ Сильное предупреждение',
		disclaimerItems: [
			'Материал предназначен для обучения и предварительных оценок.',
			'Не заменяет проектирование и инженерные проверки по действующим документам.',
			'Грунтовые условия сильно различаются; обращайтесь к актуальным СП и специалистам по геотехнике.',
		],
		calculatorConfigs: [
			{
				id: 'strip-foundation-calculator',
				shortTitle: 'Ленточный фундамент',
				description: 'Прикинуть ширину и высоту ленты под заданные реакции.',
			},
			{
				id: 'slab-foundation-calculator',
				shortTitle: 'Плита на грунте',
				description: 'Оценить толщину и армирование плиты для мягких грунтов.',
			},
			{
				id: 'pile-foundation-calculator',
				shortTitle: 'Свайное поле',
				description: 'Оценить количество и длину свай по несущей способности участка.',
			},
		],
	},
} as const

const articleSlugs = ['why-soil-investigation-matters', 'foundation-types-explained']

interface Sp24PageProps {
	params: { locale: Locale; country: string }
}

function getContent(locale: Locale) {
	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'
	return content[contentLocale] || content.en
}

export async function generateMetadata({ params }: Sp24PageProps): Promise<Metadata> {
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
				en: '/standards/national/ru/sp24-soil-foundations',
				ru: '/ru/standards/national/ru/sp24-soil-foundations',
				es: '/es/standards/national/ru/sp24-soil-foundations',
				tr: '/tr/standards/national/ru/sp24-soil-foundations',
				hi: '/hi/standards/national/ru/sp24-soil-foundations',
			},
			canonical: `${basePath}/standards/national/ru/sp24-soil-foundations`,
		},
		openGraph: {
			title: c.title,
			description: c.schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/ru/sp24-soil-foundations`,
			type: 'article',
		},
	}
}

export default async function Sp24Page({ params }: Sp24PageProps) {
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
			? ['СП 24', 'грунты', 'фундаменты', 'осадки']
			: ['SP 24', 'soil', 'foundations', 'settlement'],
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
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-blue-900 mb-3">
						<h3 className="text-lg font-semibold mb-2">{c.section2Takeaway}</h3>
						<p>{c.section2TakeawayText}</p>
					</div>
					<ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
						{c.section2Items.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
					<p className="text-gray-700">{c.section2Text}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section3Title}
					</h2>
					<p className="text-gray-700">{c.section3Text}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section4Title}
					</h2>
					{calculators.length === 0 ? (
						<p className="text-gray-600">{c.section4Loading}</p>
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
											{c.section4Open} →
										</Link>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section5Title}
					</h2>
					<p className="text-gray-700">
						{c.section5Text}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/ISO/soil-and-foundations`}
						>
							ISO Soil & Foundations hub
						</Link>
						{c.section5Text2}
					</p>
				</section>

				<section className="mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						{c.section6Title}
					</h2>
					{articles.length === 0 ? (
						<p className="text-gray-600">{c.section6Empty}</p>
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
										{c.section6Read} →
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
