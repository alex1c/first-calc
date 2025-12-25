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
]

const articleSlugs = ['why-soil-investigation-matters', 'foundation-types-explained']

const schemaDescription =
        'Образовательный обзор СП 24.13330: категории грунтов, грунтовые воды и выбор мелких или свайных фундаментов без нормативных ссылок.'

interface Sp24PageProps {
        params: { locale: Locale; country: string }
}

export async function generateMetadata({ params }: Sp24PageProps): Promise<Metadata> {
        const { locale, country } = params

        if (!locales.includes(locale) || country !== 'ru') {
                notFound()
        }

        const basePath = locale === 'en' ? '' : `/${locale}`

        return {
                title: 'СП 24.13330 – грунты и фундаменты',
                description: schemaDescription,
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
                        title: 'СП 24.13330 – грунты и фундаменты',
                        description: schemaDescription,
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
                headline: 'СП 24.13330 – грунты и фундаменты',
                description: schemaDescription,
                inLanguage: locale,
                about: ['СП 24', 'грунты', 'фундаменты', 'осадки'],
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
                                <h1 className="text-4xl font-bold text-gray-900 mb-6">СП 24.13330 – грунты и фундаменты</h1>
                                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                                        <p>
                                                СП 24 помогает обсуждать, как свойства грунта влияют на выбор типа
                                                основания. На ранних стадиях важно понимать, какие исходные данные могут
                                                поменять схему фундамента и объём работ.
                                        </p>
                                        <p>
                                                Страница описывает концепции без ссылок на нормативные проверки и
                                                пригодится тем, кто оценивает стоимость изысканий, земляных работ и
                                                бетонных конструкций.
                                        </p>
                                        <p>
                                                Вернуться к общему обзору можно через страницу{' '}
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
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Что охватывают грунтовые концепции</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Категории грунтов</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Уплотнённые пески, глины, слабые грунты и просадочные
                                                                разновидности обсуждаются с точки зрения несущей способности и
                                                                деформаций.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Грунтовые воды</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Уровень и агрессивность воды влияют на выбор марки бетона,
                                                                необходимость гидроизоляции и возможность котлована без
                                                                водопонижения.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Осадки и жёсткость</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Прогнозируемые осадки задают ограничения по толщине и
                                                                армированию плит, а также по длине свай для передачи нагрузок на
                                                                устойчивые слои.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Риски выемки и обратной засыпки</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                Требуются решения по откосам, креплениям котлованов и контролю
                                                                уплотнения обратной засыпки, чтобы не потерять несущую
                                                                способность.
                                                        </p>
                                                </div>
                                        </div>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Когда выбирают сваи или мелкие фундаменты</h2>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-blue-900 mb-3">
                                                <h3 className="text-lg font-semibold mb-2">Практический вывод</h3>
                                                <p>
                                                        Если прогнозируемые осадки превышают допуски здания или рядом
                                                        действуют соседние нагрузки, переходят к свайной схеме, чтобы
                                                        передать усилия на более плотные слои.
                                                </p>
                                        </div>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
                                                <li>Мелкие основания удобны при умеренных нагрузках и устойчивых грунтах.</li>
                                                <li>Свайные поля рассматривают при слабых грунтах, высоком УГВ или жёстких требованиях к деформациям.</li>
                                                <li>Предварительная геология и нагрузочные сценарии задают направление для дальнейшего проектирования.</li>
                                        </ul>
                                        <p className="text-gray-700">
                                                Эти решения на оценочной стадии помогают заранее понять объёмы бетона,
                                                арматуры и буровых работ, даже до детальных расчётов.
                                        </p>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Оценка против проектирования</h2>
                                        <p className="text-gray-700">
                                                Здесь приведены принципы для ориентировочных расчётов. Детальные проверки
                                                выполняют инженеры-проектировщики с использованием актуальных редакций СП
                                                и местных требований по грунтам и гидрогеологии.
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
                                                Для международного контекста можно посмотреть{' '}
                                                <Link
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                        href={`/${locale}/standards/ISO/soil-and-foundations`}
                                                >
                                                        ISO Soil &amp; Foundations hub
                                                </Link>
                                                , чтобы сопоставить терминологию и подходы.
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
                                                <li>Грунтовые условия сильно различаются; обращайтесь к актуальным СП и специалистам по геотехнике.</li>
                                        </ul>
                                </div>
                        </PageContainer>
                </>
        )
}
