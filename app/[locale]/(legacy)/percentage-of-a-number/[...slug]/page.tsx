import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { parsePercentage } from '@/lib/legacy/slugParser'
import { percentOf, getPercentageSteps } from '@/lib/legacy/percentage'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyExamplesBlock } from '@/components/legacy/examples-block'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import {
	getFaqForLegacyTool,
	getExamplesForLegacyTool,
} from '@/lib/legacy/faqExamples'

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

	let title = 'Percentage of a Number - Calculator Portal'
	let description = 'Calculate what a certain percentage of a number is. Step-by-step percent calculator.'

	if (parsed && parsed.type === 'of') {
		const result = percentOf(parsed.value, parsed.percent)
		title = `${parsed.percent} percent of ${parsed.value} – calculator`
		description = `How to calculate ${parsed.percent}% of ${parsed.value}? Step-by-step percent calculator. Result: ${result.toFixed(2)}.`
	}

	return {
		title,
		description,
		keywords: 'percentage, calculation, math, number, percent',
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
					error="Invalid format. Use: /value-percent (e.g., /100-20 for 20% of 100)"
					locale={locale}
					examples={[
						{
							href: '/percentage-of-a-number/100-20',
							label: 'Example: /percentage-of-a-number/100-20 (20% of 100)',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	const result = percentOf(parsed.value, parsed.percent)
	const steps = getPercentageSteps(parsed.value, parsed.percent, 'of')
	const title = `${parsed.percent}% of ${parsed.value}`

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			{/* Formula */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">Formula</h2>
				<p className="text-lg text-gray-700 font-mono">
					Result = (Value × Percentage) / 100
				</p>
				<p className="text-lg text-gray-700 font-mono mt-2">
					Result = ({parsed.value} × {parsed.percent}) / 100 = {result.toFixed(2)}
				</p>
			</div>

			{/* Result */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div className="text-center">
					<p className="text-sm text-gray-500 mb-2">Result</p>
					<p className="text-4xl font-bold text-blue-600">
						{result.toFixed(2)}
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
