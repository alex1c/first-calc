import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { loadNamespaces, createT } from '@/lib/i18n'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { RootCalculatorForm } from '@/components/legacy/root-calculator-form'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { getLegacyBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface RootCalculatorLandingPageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: RootCalculatorLandingPageProps): Promise<Metadata> {
	const { locale } = params

	const title =
		locale === 'ru'
			? 'Калькулятор корней - Квадратный, кубический и другие корни'
			: 'Root Calculator - Square, Cube, and Other Roots'
	const description =
		locale === 'ru'
			? 'Вычислите квадратный, кубический и другие корни чисел. Поддерживает корни любой степени. Бесплатный онлайн калькулятор корней.'
			: 'Calculate square, cube, and other roots of numbers. Supports roots of any degree. Free online root calculator.'

	return {
		title: `${title} - Calculator Portal`,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
		alternates: {
			languages: {
				en: '/root-calculator',
				ru: '/ru/root-calculator',
				es: '/es/root-calculator',
				tr: '/tr/root-calculator',
				hi: '/hi/root-calculator',
			},
			canonical: `/${locale}/root-calculator`,
		},
	}
}

export default async function RootCalculatorLandingPage({
	params,
}: RootCalculatorLandingPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	const title =
		locale === 'ru'
			? 'Калькулятор корней'
			: 'Root Calculator'

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(locale, 'root-calculator', [], t, title)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={false}
			breadcrumbs={breadcrumbs}
		>
			{/* Description */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				{locale === 'ru' ? (
					<>
						<p className="text-gray-700 mb-4">
							Калькулятор корней позволяет вычислить корень любой степени из
							числа. Поддерживаются квадратные корни (√), кубические корни (∛) и
							корни любой другой степени (ⁿ√).
						</p>
						<p className="text-gray-700 mb-4">
							Корень n-й степени из числа a — это такое число b, что bⁿ = a.
							Например, квадратный корень из 16 равен 4, так как 4² = 16.
						</p>
						<p className="text-gray-700">
							Этот инструмент полезен для математических расчетов, решения
							уравнений и выполнения различных вычислений, связанных с корнями.
						</p>
					</>
				) : (
					<>
						<p className="text-gray-700 mb-4">
							Root calculator allows you to calculate the root of any degree from
							a number. Supports square roots (√), cube roots (∛), and roots of
							any other degree (ⁿ√).
						</p>
						<p className="text-gray-700 mb-4">
							The nth root of a number a is a number b such that bⁿ = a. For
							example, the square root of 16 is 4, since 4² = 16.
						</p>
						<p className="text-gray-700">
							This tool is useful for mathematical calculations, solving equations,
							and performing various computations related to roots.
						</p>
					</>
				)}
			</div>

			{/* Form */}
			<RootCalculatorForm
				locale={locale}
				exampleLinks={[
					{ href: '/root-calculator/16/2', label: '/root-calculator/16/2 (√16 = 4)' },
					{ href: '/root-calculator/27/3', label: '/root-calculator/27/3 (∛27 = 3)' },
					{ href: '/root-calculator/32/5', label: '/root-calculator/32/5 (⁵√32 = 2)' },
					{ href: '/root-calculator/45.2/2', label: '/root-calculator/45.2/2 (√45.2)' },
				]}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('root-calculator')} />
		</LegacyPageLayout>
	)
}

