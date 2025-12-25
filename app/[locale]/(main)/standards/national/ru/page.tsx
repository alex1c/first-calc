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

const schemaDescription =
        'Образовательный обзор СП и СНиП с акцентом на связи нагрузок, грунтов и бетона в российской практике.'

export async function generateMetadata({
        params,
}: RuStandardsLandingProps): Promise<Metadata> {
        const { locale } = params

        if (!locales.includes(locale)) {
                notFound()
        }

        const basePath = locale === 'en' ? '' : `/${locale}`

        return {
                title: 'Российские национальные стандарты (СП и СНиП) – обзор',
                description: schemaDescription,
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
                        title: 'Российские национальные стандарты (СП и СНиП) – обзор',
                        description: schemaDescription,
                        url: `https://first-calc.com${basePath}/standards/national/ru`,
                        type: 'article',
                },
        }
}

export default async function RuStandardsLanding({ params }: RuStandardsLandingProps) {
        const { locale } = params

        if (!locales.includes(locale)) {
                notFound()
        }

        const dict = await loadNamespaces(locale, ['common', 'navigation'])
        const t = createT(dict)
        const breadcrumbs = getNationalStandardsBreadcrumbs(locale, 'ru', 'Россия', t)

        const schema = {
                '@context': 'https://schema.org',
                '@type': 'TechArticle',
                headline: 'Российские национальные стандарты (СП и СНиП) – обзор',
                description: schemaDescription,
                inLanguage: locale,
                about: ['СП 20', 'СП 24', 'СП 63', 'российские стандарты'],
                isPartOf: {
                        '@type': 'CollectionPage',
                        name: 'Standards Portal – National Standards',
                        url: 'https://first-calc.com/ru/standards/national',
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
                                        Russian National Standards (SP &amp; SNiP) – Overview
                                </h1>
                                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                                        <p>
                                                Серия СП выросла из исторических СНиПов и аккумулирует общий язык для
                                                обсуждения нагрузок, грунтов, бетона и армирования. На практике эти
                                                документы помогают согласовать ожидания заказчика, проектировщика и
                                                строителя на ранних этапах.
                                        </p>
                                        <p>
                                                Цель этого раздела — показать, как ключевые блоки СП связаны между собой
                                                и где применяются типичные подходы. Материал носит образовательный
                                                характер и помогает понять терминологию, которую часто используют при
                                                оценках и планировании.
                                        </p>
                                        <p>
                                                Мы избегаем юридических формулировок и не заменяем полноценное
                                                проектирование. Это справочный обзор, который подсказывает, какие темы
                                                требуют глубокого изучения у профильных специалистов.
                                        </p>
                                </div>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                                Как документы связаны концептуально
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Нагрузки</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                СП 20 обсуждает постоянные и временные воздействия,
                                                                климатические факторы и подходы к комбинациям для
                                                                предварительных расчетов и сметных оценок.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                Грунты и основания
                                                        </h3>
                                                        <p className="text-gray-700 text-sm">
                                                                СП 24 рассматривает категории грунтов, подземные воды и
                                                                переход от мелких фундаментов к сваям в зависимости от
                                                                условий площадки.
                                                        </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Бетон и арматура</h3>
                                                        <p className="text-gray-700 text-sm">
                                                                СП 63 описывает классы бетона, защитные слои и общие принципы
                                                                расположения арматуры для долговечности и контроля трещин.
                                                        </p>
                                                </div>
                                        </div>
                                </section>

                                <section className="mb-10">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                                Хабы по СП
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <Link
                                                        href="/ru/standards/national/ru/sp20-load-concepts"
                                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                                                                Открыть хаб
                                                        </p>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                СП 20.13330 – концепции нагрузок
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                                Постоянные, временные, климатические воздействия и то, как они
                                                                обсуждаются в ранних оценках.
                                                        </p>
                                                </Link>
                                                <Link
                                                        href="/ru/standards/national/ru/sp24-soil-foundations"
                                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                                                                Открыть хаб
                                                        </p>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                СП 24.13330 – грунты и фундаменты
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                                Классификация грунтов, влияние грунтовых вод и выбор типа
                                                                фундамента в оценочном контексте.
                                                        </p>
                                                </Link>
                                                <Link
                                                        href="/ru/standards/national/ru/sp63-concrete-principles"
                                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                                                                Открыть хаб
                                                        </p>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                СП 63.13330 – принципы бетона
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                                Принципы подбора классов бетона, защитных слоев и армирования
                                                                без ссылок на конкретные проверки.
                                                        </p>
                                                </Link>
                                                <Link
                                                        href="/ru/standards/national/ru/sp-snip-foundations"
                                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                                                                Открыть хаб
                                                        </p>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                СП и СНиП – фундаменты
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                                Соединяем грунтовые исследования, бетон и арматуру с полезными
                                                                калькуляторами для предварительных оценок.
                                                        </p>
                                                </Link>
                                        </div>
                                </section>

                                <section className="mb-10">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                                Практический смысл для оценок
                                        </h2>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 text-blue-900">
                                                <p>
                                                        Нагрузки по СП 20 влияют на размеры фундаментных плит и лент, а
                                                        значит — на объёмы бетона и арматуры в смете.
                                                </p>
                                                <p>
                                                        Грунтовые категории СП 24 задают пределы несущей способности и
                                                        осадок, что помогает выбрать схему основания до геологических
                                                        изысканий.
                                                </p>
                                                <p>
                                                        Принципы СП 63 подсказывают, какие классы бетона и защитные слои
                                                        закладывать при закупках материалов, даже до детального расчёта.
                                                </p>
                                        </div>
                                </section>

                                <section className="mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Оценка против проектирования</h2>
                                        <p className="text-gray-700">
                                                Здесь рассматриваются концепции и типовые связи между СП, которые полезны
                                                для предварительных оценок. Полные проверки и проектные решения выполняют
                                                инженеры с учётом актуальных редакций документов и требований региона.
                                        </p>
                                </section>

                                <section className="mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Что важно помнить</h2>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                                <li>Материал ориентирован на понимание концепций, а не на проверку проектных решений.</li>
                                                <li>Фактические требования могут отличаться по регионам и редакциям СП.</li>
                                                <li>На ранних стадиях лучше фиксировать допущения по нагрузкам, грунтам и классам бетона.</li>
                                        </ul>
                                </section>

                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold text-red-900 mb-3">⚠️ Сильное предупреждение</h2>
                                        <ul className="space-y-2 text-red-800">
                                                <li>Материал носит образовательный и оценочный характер.</li>
                                                <li>Не заменяет инженерное проектирование и местные требования.</li>
                                                <li>Нормативные документы обновляются; обращайтесь к действующим версиям и профильным специалистам.</li>
                                        </ul>
                                </div>
                        </PageContainer>
                </>
        )
}
