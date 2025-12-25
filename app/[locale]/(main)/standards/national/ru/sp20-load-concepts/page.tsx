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
]

const articleSlugs = ['what-are-structural-loads']

const schemaDescription =
        'Образовательный обзор СП 20.13330: типы нагрузок, климатические воздействия и подходы к комбинациям в оценочном контексте.'

interface Sp20PageProps {
        params: { locale: Locale; country: string }
}

export async function generateMetadata({ params }: Sp20PageProps): Promise<Metadata> {
        const { locale, country } = params

        if (!locales.includes(locale) || country !== 'ru') {
                notFound()
        }

        const basePath = locale === 'en' ? '' : `/${locale}`

        return {
                title: 'СП 20.13330 – концепции нагрузок',
                description: schemaDescription,
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
                        title: 'СП 20.13330 – концепции нагрузок',
                        description: schemaDescription,
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
                headline: 'СП 20.13330 – концепции нагрузок',
                description: schemaDescription,
                inLanguage: locale,
                about: ['нагрузки', 'СП 20', 'климатические воздействия', 'комбинации'],
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
                                <h1 className="text-4xl font-bold text-gray-900 mb-6">СП 20.13330 – концепции нагрузок</h1>
                                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                                        <p>
                                                СП 20 часто обсуждается как базовый документ по нагрузкам в российской
                                                практике. Он помогает договориться об исходных воздействиях, прежде чем
                                                переходить к расчётам и деталировке.
                                        </p>
                                        <p>
                                                Эта страница даёт образовательное описание категорий нагрузок и
                                                комбинаций без ссылок на нормативные проверки. Материал полезен для
                                                сметчиков и инженеров на ранних стадиях.
                                        </p>
                                        <p>
                                                Дополнительные хабы по российским документам можно найти на странице{' '}
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
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                                Что охватывают концепции нагрузок
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Постоянные нагрузки</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Собственный вес конструкций, отделки и инженерных систем.
                                                                Эти значения формируют основу для всех последующих
                                                                комбинаций.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Временные воздействия</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Полезные нагрузки от людей, мебели, оборудования. Их
                                                                интенсивность зависит от назначения помещения и стадии
                                                                эксплуатации.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Климатические влияния</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Снег, ветер и температурные перепады задают дополнительные
                                                                усилия. При ранних оценках важно учитывать региональные
                                                                различия и высоту здания.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Особые действия</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Сейсмика или монтажные сценарии добавляют редкие,
                                                                но критичные сочетания. Они показывают, где конструкция может
                                                                требовать резервов.
                                                        </p>
                                                </div>
                                        </div>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Почему важны допущения</h2>
                                        <p className="text-gray-700 mb-3">
                                                Ранние решения по нагрузкам определяют толщину плит, размеры опор и
                                                объёмы материалов. От корректных допущений зависят сметы, сроки и выбор
                                                оборудования для строительства.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-blue-900">
                                                <h3 className="text-lg font-semibold mb-2">Практический вывод</h3>
                                                <p>
                                                        Уточните, какие временные нагрузки и климатические условия
                                                        принимаются в проекте, и фиксируйте их в расчётных записках.
                                                        Это упростит сравнение вариантов и корректировку бюджета.
                                                </p>
                                        </div>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Как читают комбинации</h2>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
                                                <li>Отдельно оценивают основную комбинацию с постоянными и полезными нагрузками.</li>
                                                <li>Климатические воздействия добавляют альтернативные сценарии, которые могут управлять армированием.</li>
                                                <li>Редкие комбинации помогают проверить чувствительность конструкции к монтажным и аварийным ситуациям.</li>
                                        </ul>
                                        <p className="text-gray-700">
                                                В оценочном контексте комбинации показывают, какие элементы проекта
                                                потребуют запаса по массе бетона или плотности арматуры, даже без
                                                детальных расчётов.
                                        </p>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Оценка против проектирования</h2>
                                        <p className="text-gray-700">
                                                Здесь рассматриваются принципы для предварительных расчётов. Полные
                                                проектные проверки выполняют профильные инженеры с использованием
                                                актуальных редакций СП и региональных требований.
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
                                                Для сравнения концепций нагрузок можно посмотреть европейский обзор{' '}
                                                <Link
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                        href={`/${locale}/standards/EU/eurocode-1`}
                                                >
                                                        Eurocode 1
                                                </Link>
                                                , чтобы понять общую логику международных подходов.
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
                                                <li>Требования и редакции СП меняются; сверяйтесь с актуальными изданиями и консультируйтесь со специалистами.</li>
                                        </ul>
                                </div>
                        </PageContainer>
                </>
        )
}
