import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { parsePercentage } from '@/lib/legacy/slugParser'
import { percentOf, getPercentageSteps } from '@/lib/legacy/percentage'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { PercentageForm } from '@/components/legacy/percentage-form'
import { LegacyExamplesBlock } from '@/components/legacy/examples-block'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import {
	getFaqForLegacyTool,
	getExamplesForLegacyTool,
} from '@/lib/legacy/faqExamples'
import { UseCasesBlock } from '@/components/legacy/use-cases-block'
import {
	getLegacyTitle,
	getLegacyDescription,
	getLegacyOgTitle,
	getLegacyOgDescription,
	getLegacyContent,
} from '@/lib/legacy/content'

interface PercentageOfANumberPageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

export async function generateMetadata({
	params,
}: PercentageOfANumberPageProps): Promise<Metadata> {
	const { locale, slug } = params

	const parsed = parsePercentage(slug)

	// Get base content from module
	const baseTitle = getLegacyTitle('percentage-of-a-number', locale)
	const baseDescription = getLegacyDescription('percentage-of-a-number', locale)
	const ogTitle = getLegacyOgTitle('percentage-of-a-number', locale)
	const ogDescription = getLegacyOgDescription('percentage-of-a-number', locale)
	const content = getLegacyContent('percentage-of-a-number', locale)

	let title = baseTitle
	let description = baseDescription

	if (parsed && parsed.type === 'of') {
		const result = percentOf(parsed.value, parsed.percent)
		title = `${parsed.percent} percent of ${parsed.value} – calculator`
		const resultStr = result % 1 === 0 ? result.toFixed(0) : result.toFixed(6)
		description = `How to calculate ${parsed.percent}% of ${parsed.value}? Step-by-step percent calculator. Result: ${resultStr}.`
	}

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	return {
		title,
		description,
		keywords: content?.keywords[contentLocale]?.join(', ') || 'percentage, calculation, math, number, percent',
		openGraph: {
			title: ogTitle,
			description: ogDescription,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: ogTitle,
			description: ogDescription,
		},
		alternates: {
			languages: {
				en: `/en/percentage-of-a-number/${slug.join('/')}`,
				ru: `/ru/percentage-of-a-number/${slug.join('/')}`,
				es: `/es/percentage-of-a-number/${slug.join('/')}`,
				tr: `/tr/percentage-of-a-number/${slug.join('/')}`,
				hi: `/hi/percentage-of-a-number/${slug.join('/')}`,
			},
			canonical: `/${locale}/percentage-of-a-number/${slug.join('/')}`,
		},
	}
}

export default function PercentageOfANumberPage({
	params,
}: PercentageOfANumberPageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const parsed = parsePercentage(slug)

	if (!parsed || parsed.type !== 'of') {
		return (
			<LegacyPageLayout
				locale={locale}
				title="Percentage of a Number"
				relatedLinks={false}
			>
				<ErrorDisplay
					error="Invalid format. Use: /value/percent (e.g., /100/20 for 20% of 100, supports decimals like /55.2/2.6)"
					locale={locale}
					examples={[
						{
							href: '/percentage-of-a-number/100/20',
							label: 'Example: /percentage-of-a-number/100/20 (20% of 100)',
						},
						{
							href: '/percentage-of-a-number/55.2/2.6',
							label: 'Example: /percentage-of-a-number/55.2/2.6 (2.6% of 55.2)',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	const result = percentOf(parsed.value, parsed.percent)
	const steps = getPercentageSteps(parsed.value, parsed.percent, 'of')
	const title = `${parsed.percent}% of ${parsed.value}`
	const content = getLegacyContent('percentage-of-a-number', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			{/* Form for new calculation - at the top */}
			<div className="mb-8">
				<PercentageForm
					locale={locale}
					toolSlug="percentage-of-a-number"
					exampleLinks={[
						{ href: '/percentage-of-a-number/100/20', label: '/percentage-of-a-number/100/20' },
						{ href: '/percentage-of-a-number/500/15', label: '/percentage-of-a-number/500/15' },
						{ href: '/percentage-of-a-number/1000/25', label: '/percentage-of-a-number/1000/25' },
					]}
				/>
			</div>

			{/* Formula */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">Formula</h2>
				<p className="text-lg text-gray-700 font-mono">
					Result = (Value × Percentage) / 100
				</p>
				<p className="text-lg text-gray-700 font-mono mt-2">
					Result = ({parsed.value} × {parsed.percent}) / 100 = {result % 1 === 0 ? result.toFixed(0) : result.toFixed(6)}
				</p>
			</div>

			{/* Result */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div className="text-center">
					<p className="text-sm text-gray-500 mb-2">Result</p>
					<p className="text-4xl font-bold text-blue-600">
						{result % 1 === 0 ? result.toFixed(0) : result.toFixed(6)}
					</p>
				</div>
			</div>

			{/* Step-by-step calculation */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Расчёт по шагам
				</h2>
				<ol className="space-y-2">
					{steps.map((step, index) => (
						<li key={index} className="flex items-start">
							<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
								{index + 1}
							</span>
							<span className="text-gray-700">{step}</span>
						</li>
					))}
				</ol>
			</div>

			{/* Text content */}
			{content && content.text[contentLocale] && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					{content.text[contentLocale].map((paragraph, index) => (
						<p key={index} className="text-gray-700 mb-4 last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			)}

			{/* Use cases */}
			{content && content.useCases[contentLocale] && (
				<UseCasesBlock useCases={content.useCases[contentLocale]} locale={locale} />
			)}

			{/* Examples */}
			<LegacyExamplesBlock
				examples={getExamplesForLegacyTool('percentage-of-a-number')}
				locale={locale}
			/>

			{/* FAQ */}
			<LegacyFaqBlock faq={getFaqForLegacyTool('percentage-of-a-number')} />

			{/* Related links */}
			<LegacyRelatedLinks locale={locale} toolType="percentage-of-a-number" />
		</LegacyPageLayout>
	)
}
