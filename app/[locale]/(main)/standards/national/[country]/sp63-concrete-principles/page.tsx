import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'

/**
 * Locale-aware content for SP 63 Concrete Principles page
 */
const content = {
	en: {
		title: 'SP 63.13330 – Concrete Principles',
		schemaDescription: 'Educational overview of SP 63.13330: concrete strength classes, reinforcement cover, and general principles without calculation formulas.',
		countryName: 'Russia',
		intro: [
			'SP 63 discusses how materials and reinforcement work together. At early stages, it is important to understand concrete strength classes, protective layer requirements, and general reinforcement approaches to properly plan work volumes.',
			'This page provides educational explanations without formulas. It helps connect estimation calculations for concrete and reinforcement with SP 63 terminology.',
			'All Russian hubs are collected on the ',
		],
		section1Title: 'What Concrete Principles Cover',
		section1Items: [
			{
				title: 'Strength Classes',
				description: 'Strength and stiffness classes are discussed, which guide mix selection and bearing capacity estimation.',
			},
			{
				title: 'Durability',
				description: 'Environmental conditions, water-cement ratio, and air entrainment needs affect expected service life and corrosion protection.',
			},
			{
				title: 'Protective Layers',
				description: 'Protective layer thickness depends on bar diameter, concrete class, and service conditions; this affects concrete and reinforcement consumption.',
			},
			{
				title: 'Reinforcement Detailing',
				description: 'Spacing, anchorage, and lap lengths determine how reinforcement is distributed in slabs and beams, and define steel mass.',
			},
		],
		section2Title: 'Why Reinforcement Estimates Differ from Calculations',
		section2Text: 'Estimates use averaged reinforcement schemes and reserves to account for site variations. In design calculations, engineers refine spacing, diameters, and anchorage for specific forces.',
		section2Takeaway: 'Practical Takeaway',
		section2TakeawayText: 'Document assumed concrete classes and expected protective layers in estimates to avoid underestimating reinforcement mass and mix cost in subsequent adjustments.',
		section3Title: 'Balance of Strength and Workability',
		section3Items: [
			'Increasing concrete class may reduce reinforcement quantity but increases curing and placement temperature requirements.',
			'More frequent reinforcement spacing improves crack control but complicates concreting and mix vibration.',
			'Protective layers must account for service conditions to balance durability and economy.',
		],
		section3Text: 'These considerations help at the estimation stage choose a reasonable balance between strength, labor costs, and material logistics.',
		section4Title: 'Estimation vs. Design',
		section4Text: 'This text describes concepts without calculation formulas. Design is performed by qualified engineers using current SP documents and local requirements for concrete and reinforcement quality.',
		section5Title: 'Related Calculators',
		section5Loading: 'Calculators are loading. Refresh the page if needed.',
		section5Open: 'Open calculator',
		section6Title: 'Related Standards',
		section6Text: 'For comparison of concrete approaches, see ',
		section6Text2: ' and the ',
		section6Text3: ' to see common principles and terminology in other regions.',
		section7Title: 'Related Learn Articles',
		section7Empty: 'Articles will appear later.',
		section7Read: 'Read',
		disclaimerTitle: '⚠️ Strong Disclaimer',
		disclaimerItems: [
			'Content is for learning and preliminary estimates only.',
			'Does not replace design and engineering checks per current documents.',
			'Concrete and reinforcement properties depend on suppliers and region; verify with current documents and consult specialists.',
		],
		calculatorConfigs: [
			{
				id: 'concrete-volume-calculator',
				shortTitle: 'Concrete Volume',
				description: 'Estimate volume of slabs, grillages, and floors.',
			},
			{
				id: 'concrete-mix-ratio-calculator',
				shortTitle: 'Concrete Mix Ratio',
				description: 'Select proportions for required workability and strength class.',
			},
			{
				id: 'rebar-calculator',
				shortTitle: 'Rebar Calculator',
				description: 'Estimate bar mass by spacing and diameter.',
			},
			{
				id: 'rebar-weight-calculator',
				shortTitle: 'Rebar Weight',
				description: 'Check total weight by known length or vice versa.',
			},
		],
	},
	ru: {
		title: 'СП 63.13330 – принципы бетона',
		schemaDescription: 'Образовательный обзор СП 63.13330: классы бетона, защитные слои арматуры и общие принципы без расчётных формул.',
		countryName: 'Россия',
		intro: [
			'СП 63 обсуждает, как материал и армирование работают вместе. На ранних стадиях важно понимать классы бетона, требования к защитным слоям и общие подходы к армированию, чтобы правильно планировать объёмы работ.',
			'Эта страница даёт образовательные пояснения без формул. Она помогает связать сметные расчёты по бетону и арматуре с терминологией СП 63.',
			'Все российские хабы собраны на странице ',
		],
		section1Title: 'Что охватывают бетонные принципы',
		section1Items: [
			{
				title: 'Классы прочности',
				description: 'Обсуждаются классы по прочности и жёсткости, которые ориентируют подбор смеси и оценку несущей способности.',
			},
			{
				title: 'Долговечность',
				description: 'Условия среды, водоцементное отношение и необходимость воздухововлечения влияют на ожидаемый срок службы и защиту от коррозии.',
			},
			{
				title: 'Защитные слои',
				description: 'Толщина защитного слоя зависит от диаметра стержней, класса бетона и условий эксплуатации; это влияет на расход бетона и арматуры.',
			},
			{
				title: 'Деталирование арматуры',
				description: 'Шаг, анкеровка и нахлёсты задают, как распределяется армирование в плитах и балках, и определяют массу стали.',
			},
		],
		section2Title: 'Почему оценки по арматуре отличаются от расчётов',
		section2Text: 'В сметах используют усреднённые схемы армирования и запасы, чтобы учесть вариации стройплощадки. В проектных расчётах инженеры уточняют шаг, диаметры и анкеровку под конкретные усилия.',
		section2Takeaway: 'Практический вывод',
		section2TakeawayText: 'Фиксируйте принятые классы бетона и предполагаемые защитные слои в сметах, чтобы избежать недооценки массы арматуры и стоимости смеси при последующих корректировках.',
		section3Title: 'Баланс прочности и технологичности',
		section3Items: [
			'Повышение класса бетона может сократить количество арматуры, но увеличивает требования к уходу и температуре укладки.',
			'Более частый шаг арматуры улучшает контроль трещин, но усложняет бетонирование и вибрацию смеси.',
			'Защитные слои должны учитывать условия эксплуатации, чтобы совместить долговечность и экономичность.',
		],
		section3Text: 'Эти соображения помогают на оценочной стадии выбрать разумный баланс между прочностью, трудозатратами и логистикой материалов.',
		section4Title: 'Оценка против проектирования',
		section4Text: 'Текст описывает концепции без расчётных формул. Проектирование выполняют профильные инженеры, используя актуальные СП и местные требования по качеству бетона и арматуры.',
		section5Title: 'Связанные калькуляторы',
		section5Loading: 'Калькуляторы загружаются. Обновите страницу при необходимости.',
		section5Open: 'Открыть калькулятор',
		section6Title: 'Связанные стандарты',
		section6Text: 'Для сравнения подходов к бетону можно изучить ',
		section6Text2: ' и обзор ',
		section6Text3: ', чтобы увидеть общие принципы и терминологию в других регионах.',
		section7Title: 'Связанные материалы',
		section7Empty: 'Статьи появятся позже.',
		section7Read: 'Читать',
		disclaimerTitle: '⚠️ Сильное предупреждение',
		disclaimerItems: [
			'Материал предназначен для обучения и предварительных оценок.',
			'Не заменяет проектирование и инженерные проверки по действующим документам.',
			'Характеристики бетона и арматуры зависят от поставщиков и региона; сверяйтесь с актуальными документами и консультируйтесь со специалистами.',
		],
		calculatorConfigs: [
			{
				id: 'concrete-volume-calculator',
				shortTitle: 'Объём бетона',
				description: 'Оценить кубатуру плит, ростверков и перекрытий.',
			},
			{
				id: 'concrete-mix-ratio-calculator',
				shortTitle: 'Соотношение смеси',
				description: 'Подобрать пропорции для нужной подвижности и класса прочности.',
			},
			{
				id: 'rebar-calculator',
				shortTitle: 'Расход арматуры',
				description: 'Прикинуть массу стержней по шагу и диаметру.',
			},
			{
				id: 'rebar-weight-calculator',
				shortTitle: 'Масса арматуры по длине',
				description: 'Проверить общий вес по известной длине или наоборот.',
			},
		],
	},
} as const

const articleSlugs = ['concrete-vs-reinforced-concrete']

interface Sp63PageProps {
	params: { locale: Locale; country: string }
}

function getContent(locale: Locale) {
	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'
	return content[contentLocale] || content.en
}

export async function generateMetadata({ params }: Sp63PageProps): Promise<Metadata> {
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
				en: '/standards/national/ru/sp63-concrete-principles',
				ru: '/ru/standards/national/ru/sp63-concrete-principles',
				es: '/es/standards/national/ru/sp63-concrete-principles',
				tr: '/tr/standards/national/ru/sp63-concrete-principles',
				hi: '/hi/standards/national/ru/sp63-concrete-principles',
			},
			canonical: `${basePath}/standards/national/ru/sp63-concrete-principles`,
		},
		openGraph: {
			title: c.title,
			description: c.schemaDescription,
			url: `https://first-calc.com${basePath}/standards/national/ru/sp63-concrete-principles`,
			type: 'article',
		},
	}
}

export default async function Sp63Page({ params }: Sp63PageProps) {
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
			? ['СП 63', 'бетон', 'армирование', 'долговечность']
			: ['SP 63', 'concrete', 'reinforcement', 'durability'],
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
							href={`/${locale}/standards/EU/eurocode-2`}
						>
							Eurocode 2
						</Link>
						{c.section6Text2}
						<Link
							className="text-blue-600 hover:text-blue-800 underline"
							href={`/${locale}/standards/national/us/aci-concrete`}
						>
							ACI concrete hub
						</Link>
						{c.section6Text3}
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
