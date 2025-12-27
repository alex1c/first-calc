import type { Locale } from '@/lib/i18n'

/**
 * Represents a placeholder tile for upcoming national-standard content.
 * Tiles link to anchored sections on the same page until real standards launch.
 */
export interface NationalStandardTile {
	id: string
	title: string
	description: string
	anchor: string
	href?: string
}

/**
 * Describes a national standards landing page that lives under /standards/national.
 * Each locale reuses the same English copy for now so that the routes render everywhere.
 */
export interface NationalStandardLanding {
	id: string
	slug: string
	locale: Locale
	countryName: string
	title: string
	intro: string[]
	seoTitle: string
	seoDescription: string
	tiles: NationalStandardTile[]
}

/**
 * Core English content that we mirror for every locale so that each locale has
 * a deterministic version of the new national landing hubs.
 */
const baseNationalContent = [
	{
		slug: 'us',
		countryName: 'United States',
		title: 'United States National Standards Overview',
		intro: [
			'United States building practice relies on a family of national reference documents such as the International Building Code (IBC), ASCE 7 load provisions, and ACI concrete guides.',
			'This landing page explains how those references fit together conceptually so future detailed pages can expand on regional interpretations without implying compliance.',
		],
		seoTitle: 'United States National Standards Overview',
		seoDescription:
			'Educational overview of how U.S. reference standards relate conceptually to building practice.',
		tiles: [
			{
				id: 'us-loads-hazards',
				title: 'Loads & Hazards',
				description:
					'Educational overview of structural loads, load paths, and hazard categories that influence early design assumptions.',
				anchor: 'loads-hazards',
				href: '/standards/national/us/asce-loads',
			},
			{
				id: 'us-soil-foundations',
				title: 'Soil & Foundations',
				description:
					'Conceptual explanation of how soil properties and foundation types relate to early estimation and design assumptions.',
				anchor: 'soil-foundations',
				href: '/standards/national/us/soil-foundations',
			},
			{
				id: 'us-aci-concrete',
				title: 'Concrete Principles',
				description:
					'Educational hub explaining how ACI guidance shapes concrete estimation and links to supporting calculators.',
				anchor: 'aci318-concepts',
				href: '/standards/national/us/aci-concrete',
			},
		],
	},
	{
		slug: 'eu',
		countryName: 'European Union',
		title: 'European Union National Standards Overview',
		intro: [
			'European building practice relies on Eurocodes, a family of harmonized standards that provide common design principles across EU member states.',
			'This landing page explains how Eurocode concepts relate to loads, foundations, and materials in an educational context without implying compliance.',
		],
		seoTitle: 'European Union National Standards Overview',
		seoDescription:
			'Educational overview of how Eurocode standards relate conceptually to building practice across Europe.',
		tiles: [
			{
				id: 'eu-ec1-loads',
				title: 'Eurocode Load Concepts (EC1)',
				description:
					'Educational overview of structural loads, actions, and load combinations that influence early design assumptions.',
				anchor: 'ec1-load-concepts',
				href: '/standards/national/eu/ec1-load-concepts',
			},
			{
				id: 'eu-ec7-soil',
				title: 'Eurocode Soil & Foundations (EC7)',
				description:
					'Conceptual explanation of geotechnical principles, soil properties, and foundation design assumptions.',
				anchor: 'ec7-soil-foundations',
				href: '/standards/national/eu/ec7-soil-foundations',
			},
			{
				id: 'eu-ec2-concrete',
				title: 'Eurocode Concrete Principles (EC2)',
				description:
					'Educational hub explaining how Eurocode 2 concepts shape concrete estimation and material assumptions.',
				anchor: 'ec2-concrete-principles',
				href: '/standards/national/eu/ec2-concrete-principles',
			},
		],
	},
        {
                slug: 'ru',
                countryName: 'Russia',
                title: 'Russia National Standards Overview',
                intro: [
                        'Russian design work references SP documents that organize actions, materials, soil behavior, and detailing expectations.',
                        'This educational hub previews how SP 20, SP 24, and SP 63 interact conceptually ahead of deeper explanatory content.',
                ],
                seoTitle: 'Russia National Standards Overview',
                seoDescription:
                        'Conceptual description of how Russian SP documents frame structural practice.',
                tiles: [
                        {
                                id: 'ru-sp20',
                                title: 'SP 20 Load Concepts',
                                description:
                                        'Educational overview of climate actions, partial factors, and load combinations used across Russian practice.',
                                anchor: 'sp20-load-concepts',
                                href: '/standards/national/ru/sp20-load-concepts',
                        },
                        {
                                id: 'ru-sp24',
                                title: 'SP 24 Soil & Foundations',
                                description:
                                        'Conceptual explanation of how SP 24.13330 connects soil categories with foundation selection.',
                                anchor: 'sp24-soil-foundations',
                                href: '/standards/national/ru/sp24-soil-foundations',
                        },
                        {
                                id: 'ru-sp63',
                                title: 'SP 63 Concrete Principles',
                                description:
                                        'Educational summary describing design resistance, material factors, and concrete principles within SP 63.13330.',
                                anchor: 'sp63-concrete-principles',
                                href: '/standards/national/ru/sp63-concrete-principles',
                        },
                        {
                                id: 'ru-sp-snip-foundations',
                                title: 'SP & SNiP Foundations Hub',
                                description:
                                        'Additional educational hub on Russian foundation standards and concrete basics, linked to calculators and context pages.',
                                anchor: 'sp-snip-foundations',
                                href: '/standards/national/ru/sp-snip-foundations',
                        },
                ],
        },
]

/**
 * Locales supported by the broader site. We reuse the same copy so that
 * localized routes do not break while awaiting translations.
 */
const supportedLocales: Locale[] = ['en', 'ru', 'es', 'tr', 'hi']

/**
 * Fully expanded list of national landing definitions by locale.
 */
const ruLocaleOverrides: Partial<NationalStandardLanding> = {
        countryName: 'Россия',
        title: 'Российские национальные стандарты (СП и СНиП) – обзор',
        intro: [
                'В строительной практике России широко обсуждаются документы серии СП, которые развивают идеи старых СНиПов и описывают нагрузки, материалы и взаимодействие конструкций с грунтом.',
                'Этот раздел собирает образовательные обзоры по СП 20, СП 24 и СП 63, показывая, как общие концепции нагрузок, оснований и бетона переходят от эскизов к более детальной проработке.',
        ],
        seoTitle: 'Российские национальные стандарты (СП и СНиП) – обзор',
        seoDescription:
                'Образовательный обзор того, как СП 20, СП 24 и СП 63 связывают нагрузки, грунты и бетон в российской практике.',
        tiles: [
                {
                        id: 'ru-sp20',
                        title: 'СП 20.13330 – концепции нагрузок',
                        description:
                                'Обзор постоянных и временных воздействий, климатических факторов и типичных комбинаций для ранних оценок.',
                        anchor: 'sp20-load-concepts',
                        href: '/standards/national/ru/sp20-load-concepts',
                },
                {
                        id: 'ru-sp24',
                        title: 'СП 24.13330 – грунты и фундаменты',
                        description:
                                'Разбор категорий грунтов, уровней грунтовых вод и выбора мелкого или свайного фундамента на концептуальном уровне.',
                        anchor: 'sp24-soil-foundations',
                        href: '/standards/national/ru/sp24-soil-foundations',
                },
                {
                        id: 'ru-sp63',
                        title: 'СП 63.13330 – принципы бетона',
                        description:
                                'Образовательная страница о классах бетона, защитных слоях арматуры и привычных деталировочных подходах.',
                        anchor: 'sp63-concrete-principles',
                        href: '/standards/national/ru/sp63-concrete-principles',
                },
                {
                        id: 'ru-sp-snip-foundations',
                        title: 'СП и СНиП – фундаменты',
                        description:
                                'Образовательный хаб о фундаментных темах с ссылками на калькуляторы и смежные материалы.',
                        anchor: 'sp-snip-foundations',
                        href: '/standards/national/ru/sp-snip-foundations',
                },
        ],
}

export const nationalStandards: NationalStandardLanding[] = supportedLocales.flatMap(
        (locale) =>
                baseNationalContent.map((entry) => ({
                        ...entry,
                        ...(entry.slug === 'ru' && locale === 'ru' ? ruLocaleOverrides : {}),
                        locale,
                        id: `${entry.slug}-${locale}`,
                })).filter((entry) => {
                        // Filter out 'de' (Germany) entry as we're replacing it with 'eu'
                        return entry.slug !== 'de'
                }),
)

/**
 * Return all national entries for a locale with an English fallback.
 */
export function getNationalLandingList(locale: Locale): NationalStandardLanding[] {
	const entries = nationalStandards.filter((entry) => entry.locale === locale)
	return entries.length > 0
		? entries
		: nationalStandards.filter((entry) => entry.locale === 'en')
}

/**
 * Locate a specific national landing by slug, falling back to English
 * so non-translated locales still receive content instead of a 404.
 */
export function getNationalLandingBySlug(
	locale: Locale,
	slug: string,
): NationalStandardLanding | undefined {
	return (
		nationalStandards.find(
			(entry) => entry.locale === locale && entry.slug === slug,
		) ||
		nationalStandards.find(
			(entry) => entry.locale === 'en' && entry.slug === slug,
		)
	)
}

