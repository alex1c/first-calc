import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'

const calculatorConfigs = [
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
]

const articleSlugs = ['concrete-vs-reinforced-concrete']

const schemaDescription =
        'Образовательный обзор СП 63.13330: классы бетона, защитные слои арматуры и общие принципы без расчётных формул.'

interface Sp63PageProps {
        params: { locale: Locale; country: string }
}

export async function generateMetadata({ params }: Sp63PageProps): Promise<Metadata> {
        const { locale, country } = params

        if (!locales.includes(locale) || country !== 'ru') {
                notFound()
        }

        const basePath = locale === 'en' ? '' : `/${locale}`

        return {
                title: 'СП 63.13330 – принципы бетона',
                description: schemaDescription,
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
                        title: 'СП 63.13330 – принципы бетона',
                        description: schemaDescription,
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
        const breadcrumbs = getNationalStandardsBreadcrumbs(locale, 'ru', 'Россия', t)

        const calculators = (
                await Promise.all(
                        calculatorConfigs.map(async (config) => {
                                const calc = await calculatorRegistry.getById(config.id, locale)
                                return calc
                                        ? {
                                                        ...config,
                                                        category: calc.category,
                                                        slug: calc.slug,
                                                        title: calc.title,
                                          }
                                        : null
                        }),
                )
        ).filter((calc): calc is NonNullable<typeof calc> => calc !== null)

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
                headline: 'СП 63.13330 – принципы бетона',
                description: schemaDescription,
                inLanguage: locale,
                about: ['СП 63', 'бетон', 'армирование', 'долговечность'],
                isPartOf: {
                        '@type': 'CollectionPage',
                        name: 'Russian National Standards',
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
                                <h1 className="text-4xl font-bold text-gray-900 mb-6">СП 63.13330 – принципы бетона</h1>
                                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                                        <p>
                                                СП 63 обсуждает, как материал и армирование работают вместе. На ранних
                                                стадиях важно понимать классы бетона, требования к защитным слоям и
                                                общие подходы к армированию, чтобы правильно планировать объёмы работ.
                                        </p>
                                        <p>
                                                Эта страница даёт образовательные пояснения без формул. Она помогает
                                                связать сметные расчёты по бетону и арматуре с терминологией СП 63.
                                        </p>
                                        <p>
                                                Все российские хабы собраны на странице{' '}
                                                <Link
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                        href={`/${locale}/standards/national/ru`}
                                                >
                                                        Russian National Standards
                                                </Link>
                                                .
                                        </p>
                                </div>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Что охватывают бетонные принципы</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Классы прочности</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Обсуждаются классы по прочности и жёсткости, которые
                                                                ориентируют подбор смеси и оценку несущей способности.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Долговечность</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Условия среды, водоцементное отношение и необходимость
                                                                воздухововлечения влияют на ожидаемый срок службы и защиту от
                                                                коррозии.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Защитные слои</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Толщина защитного слоя зависит от диаметра стержней, класса
                                                                бетона и условий эксплуатации; это влияет на расход
                                                                бетона и арматуры.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Деталирование арматуры</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Шаг, анкеровка и нахлёсты задают, как распределяется армирование
                                                                в плитах и балках, и определяют массу стали.
                                                        </p>
                                                </div>
                                        </div>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Почему оценки по арматуре отличаются от расчётов</h2>
                                        <p className="text-gray-700 mb-3">
                                                В сметах используют усреднённые схемы армирования и запасы, чтобы
                                                учесть вариации стройплощадки. В проектных расчётах инженеры уточняют
                                                шаг, диаметры и анкеровку под конкретные усилия.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-blue-900">
                                                <h3 className="text-lg font-semibold mb-2">Практический вывод</h3>
                                                <p>
                                                        Фиксируйте принятые классы бетона и предполагаемые защитные слои в
                                                        сметах, чтобы избежать недооценки массы арматуры и стоимости
                                                        смеси при последующих корректировках.
                                                </p>
                                        </div>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Баланс прочности и технологичности</h2>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
                                                <li>Повышение класса бетона может сократить количество арматуры, но увеличивает требования к уходу и температуре укладки.</li>
                                                <li>Более частый шаг арматуры улучшает контроль трещин, но усложняет бетонирование и вибрацию смеси.</li>
                                                <li>Защитные слои должны учитывать условия эксплуатации, чтобы совместить долговечность и экономичность.</li>
                                        </ul>
                                        <p className="text-gray-700">
                                                Эти соображения помогают на оценочной стадии выбрать разумный баланс между
                                                прочностью, трудозатратами и логистикой материалов.
                                        </p>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Оценка против проектирования</h2>
                                        <p className="text-gray-700">
                                                Текст описывает концепции без расчётных формул. Проектирование выполняют
                                                профильные инженеры, используя актуальные СП и местные требования по
                                                качеству бетона и арматуры.
                                        </p>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Связанные калькуляторы</h2>
                                        {calculators.length === 0 ? (
                                                <p className="text-gray-600">Калькуляторы загружаются. Обновите страницу при необходимости.</p>
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
                                                                                                        calculatorConfigs.find(
                                                                                                                (config) => config.id === calc.id,
                                                                                                        )?.description
                                                                                                }
                                                                                        </p>
                                                                                </div>
                                                                                <Link
                                                                                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                                                                                        href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
                                                                                >
                                                                                        Открыть калькулятор
                                                                                </Link>
                                                                        </div>
                                                                </li>
                                                        ))}
                                                </ul>
                                        )}
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Связанные стандарты</h2>
                                        <p className="text-gray-700">
                                                Для сравнения подходов к бетону можно изучить{' '}
                                                <Link
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                        href={`/${locale}/standards/EU/eurocode-2`}
                                                >
                                                        Eurocode 2
                                                </Link>
                                                {' '}и обзор{' '}
                                                <Link
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                        href={`/${locale}/standards/national/us/aci-concrete`}
                                                >
                                                        ACI concrete hub
                                                </Link>
                                                , чтобы увидеть общие принципы и терминологию в других регионах.
                                        </p>
                                </section>

                                <section className="mb-10">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Связанные материалы</h2>
                                        {articles.length === 0 ? (
                                                <p className="text-gray-600">Статьи появятся позже.</p>
                                        ) : (
                                                <ul className="space-y-3">
                                                        {articles.map((article) => (
                                                                <li
                                                                        key={article.id}
                                                                        className="bg-white border border-gray-200 rounded-lg p-4"
                                                                >
                                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h3>
                                                                        {article.shortDescription && (
                                                                                <p className="text-gray-600 text-sm mb-2">{article.shortDescription}</p>
                                                                        )}
                                                                        <Link
                                                                                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                                                                                href={`/${locale}/learn/${article.slug}`}
                                                                        >
                                                                                Читать
                                                                        </Link>
                                                                </li>
                                                        ))}
                                                </ul>
                                        )}
                                </section>

                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold text-red-900 mb-3">⚠️ Сильное предупреждение</h2>
                                        <ul className="space-y-2 text-red-800">
                                                <li>Материал предназначен для обучения и предварительных оценок.</li>
                                                <li>Не заменяет проектирование и инженерные проверки по действующим документам.</li>
                                                <li>Характеристики бетона и арматуры зависят от поставщиков и региона; сверяйтесь с актуальными документами и консультируйтесь со специалистами.</li>
                                        </ul>
                                </div>
                        </PageContainer>
                </>
        )
}
