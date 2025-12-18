import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { RootCalculatorForm } from '@/components/legacy/root-calculator-form'
import { loadNamespaces, createT } from '@/lib/i18n'
import { getLegacyBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'

// Helper to decode URL segments
function decodeURIComponentSafe(str: string): string {
	try {
		return decodeURIComponent(str)
	} catch {
		return str
	}
}

// Declare required namespaces for this page
const namespaces = ['common', 'navigation'] as const

interface RootCalculatorPageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

/**
 * Calculate nth root of a number
 */
function calculateRoot(number: number, degree: number): number {
	if (degree < 2) {
		throw new Error('Degree must be at least 2')
	}

	if (number < 0 && degree % 2 === 0) {
		throw new Error('Even root of negative number does not exist')
	}

	// Use Math.pow for positive numbers, handle negative for odd degrees
	if (number < 0) {
		return -Math.pow(-number, 1 / degree)
	}

	return Math.pow(number, 1 / degree)
}

export async function generateMetadata({
	params,
}: RootCalculatorPageProps): Promise<Metadata> {
	const { locale, slug } = params

	if (slug.length < 2) {
		return {
			title: 'Root Calculator - Calculator Portal',
			description: 'Calculate square, cube, and other roots',
		}
	}

	// Decode URL-encoded values (handles dots in decimals)
	const firstSegment = decodeURIComponentSafe(slug[0])
	const secondSegment = decodeURIComponentSafe(slug[1])
	
	const number = parseFloat(firstSegment)
	const degree = parseInt(secondSegment, 10)

	let title = 'Root Calculator'
	let description = 'Calculate roots'

	if (!isNaN(number) && !isNaN(degree) && degree >= 2) {
		try {
			const result = calculateRoot(number, degree)
			const rootSymbol = degree === 2 ? '√' : degree === 3 ? '∛' : `⁽${degree}⁾√`
			title = `${rootSymbol}${number} = ${result.toFixed(6)} – Root Calculator`
			description = `Calculate ${degree}${degree === 2 ? 'nd' : degree === 3 ? 'rd' : 'th'} root of ${number}. Result: ${result.toFixed(6)}.`
		} catch {
			// Keep default
		}
	}

	return {
		title: `${title} - Calculator Portal`,
		description,
		alternates: {
			languages: {
				en: `/root-calculator/${slug.join('/')}`,
				ru: `/ru/root-calculator/${slug.join('/')}`,
				es: `/es/root-calculator/${slug.join('/')}`,
				tr: `/tr/root-calculator/${slug.join('/')}`,
				hi: `/hi/root-calculator/${slug.join('/')}`,
			},
			canonical: `/${locale}/root-calculator/${slug.join('/')}`,
		},
	}
}

export default async function RootCalculatorPage({
	params,
}: RootCalculatorPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations for breadcrumbs
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)

	if (slug.length < 2) {
		return (
			<LegacyPageLayout
				locale={locale}
				title={locale === 'ru' ? 'Калькулятор корней' : 'Root Calculator'}
				relatedLinks={false}
			>
				<ErrorDisplay
					error={
						locale === 'ru'
							? 'Неверный формат. Используйте: /число/степень (например: /16/2)'
							: 'Invalid format. Use: /number/degree (e.g., /16/2)'
					}
					locale={locale}
					examples={[
						{
							href: '/root-calculator/16/2',
							label: '/root-calculator/16/2 (√16 = 4)',
						},
						{
							href: '/root-calculator/27/3',
							label: '/root-calculator/27/3 (∛27 = 3)',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	// Decode URL-encoded values (handles dots in decimals)
	const firstSegment = decodeURIComponentSafe(slug[0])
	const secondSegment = decodeURIComponentSafe(slug[1])
	
	const number = parseFloat(firstSegment)
	const degree = parseInt(secondSegment, 10)

	// Validate inputs
	if (isNaN(number) || isNaN(degree)) {
		return (
			<LegacyPageLayout
				locale={locale}
				title={locale === 'ru' ? 'Калькулятор корней' : 'Root Calculator'}
				relatedLinks={false}
			>
				<ErrorDisplay
					error={
						locale === 'ru'
							? 'Неверный формат чисел'
							: 'Invalid number format'
					}
					locale={locale}
					examples={[
						{
							href: '/root-calculator/16/2',
							label: '/root-calculator/16/2',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	if (degree < 2 || degree > 100) {
		return (
			<LegacyPageLayout
				locale={locale}
				title={locale === 'ru' ? 'Калькулятор корней' : 'Root Calculator'}
				relatedLinks={false}
			>
				<ErrorDisplay
					error={
						locale === 'ru'
							? 'Степень должна быть от 2 до 100'
							: 'Degree must be between 2 and 100'
					}
					locale={locale}
					examples={[
						{
							href: '/root-calculator/16/2',
							label: '/root-calculator/16/2',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	// Calculate root
	let result: number
	let error: string | null = null

	try {
		result = calculateRoot(number, degree)
	} catch (err) {
		error =
			err instanceof Error
				? err.message
				: locale === 'ru'
					? 'Ошибка вычисления'
					: 'Calculation error'
	}

	if (error) {
		return (
			<LegacyPageLayout
				locale={locale}
				title={locale === 'ru' ? 'Калькулятор корней' : 'Root Calculator'}
				relatedLinks={false}
			>
				<ErrorDisplay
					error={error}
					locale={locale}
					examples={[
						{
							href: '/root-calculator/16/2',
							label: '/root-calculator/16/2',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	const rootSymbol = degree === 2 ? '√' : degree === 3 ? '∛' : `⁽${degree}⁾√`
	const title = `${rootSymbol}${number} = ${result!.toFixed(6)}`

	// Generate breadcrumbs
	const breadcrumbs = getLegacyBreadcrumbs(
		locale,
		'root-calculator',
		[String(number), String(degree)],
		t,
		locale === 'ru' ? 'Калькулятор корней' : 'Root Calculator',
	)

	return (
		<LegacyPageLayout
			locale={locale}
			title={title}
			relatedLinks={false}
			breadcrumbs={breadcrumbs}
		>
			{/* Form for new calculation - at the top */}
			<div className="mb-8">
				<RootCalculatorForm
					locale={locale}
					exampleLinks={[
						{ href: '/root-calculator/16/2', label: '/root-calculator/16/2 (√16 = 4)' },
						{ href: '/root-calculator/27/3', label: '/root-calculator/27/3 (∛27 = 3)' },
						{ href: '/root-calculator/32/5', label: '/root-calculator/32/5 (⁵√32 = 2)' },
					]}
				/>
			</div>

			{/* Formula */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">
					{locale === 'ru' ? 'Формула' : 'Formula'}
				</h2>
				<p className="text-lg text-gray-700 font-mono">
					{rootSymbol}
					{number} = {number}
					<sup>1/{degree}</sup> = {result!.toFixed(10)}
				</p>
			</div>

			{/* Result */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div className="text-center">
					<p className="text-sm text-gray-500 mb-2">
						{locale === 'ru' ? 'Результат' : 'Result'}
					</p>
					<p className="text-4xl font-bold text-blue-600">
						{result!.toFixed(6)}
					</p>
					<p className="text-sm text-gray-500 mt-2">
						{rootSymbol}
						{number} = {result!.toFixed(6)}
					</p>
				</div>
			</div>

			{/* Step-by-step calculation */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					{locale === 'ru' ? 'Расчёт по шагам' : 'Step-by-step Calculation'}
				</h2>
				<ol className="space-y-2">
					<li className="flex items-start">
						<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
							1
						</span>
						<span className="text-gray-700">
							{locale === 'ru'
								? `Ищем корень ${degree}-й степени из ${number}`
								: `Find the ${degree}${degree === 2 ? 'nd' : degree === 3 ? 'rd' : 'th'} root of ${number}`}
						</span>
					</li>
					<li className="flex items-start">
						<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
							2
						</span>
						<span className="text-gray-700">
							{locale === 'ru'
								? `Формула: ${number}^(1/${degree})`
								: `Formula: ${number}^(1/${degree})`}
						</span>
					</li>
					<li className="flex items-start">
						<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
							3
						</span>
						<span className="text-gray-700">
							{locale === 'ru'
								? `Результат: ${result!.toFixed(6)}`
								: `Result: ${result!.toFixed(6)}`}
						</span>
					</li>
				</ol>
			</div>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('root-calculator')} />

			{/* Related links */}
			<LegacyRelatedLinks locale={locale} toolType="root-calculator" />
		</LegacyPageLayout>
	)
}

