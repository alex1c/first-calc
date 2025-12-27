import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { parsePercentage } from '@/lib/legacy/slugParser'
import { increaseBy, decreaseBy, getPercentageSteps } from '@/lib/legacy/percentage'
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

interface AddSubtractPercentagePageProps {
	params: {
		locale: Locale
		slug: string[]
	}
}

export async function generateMetadata({
	params,
}: AddSubtractPercentagePageProps): Promise<Metadata> {
	const { locale, slug } = params
	const parsed = parsePercentage(slug)

	// Get base content from module
	const baseTitle = getLegacyTitle('add-subtract-percentage', locale)
	const baseDescription = getLegacyDescription('add-subtract-percentage', locale)
	const ogTitle = getLegacyOgTitle('add-subtract-percentage', locale)
	const ogDescription = getLegacyOgDescription('add-subtract-percentage', locale)
	const content = getLegacyContent('add-subtract-percentage', locale)

	let title = baseTitle
	let description = baseDescription

	if (parsed) {
		const result =
			parsed.type === 'add'
				? increaseBy(parsed.value, parsed.percent)
				: decreaseBy(parsed.value, parsed.percent)
		const operation = parsed.type === 'add' ? 'add' : 'subtract'
		title = `${parsed.percent} percent ${operation} ${parsed.value} – calculator`
		description = `How to ${operation} ${parsed.percent}% ${parsed.type === 'add' ? 'to' : 'from'} ${parsed.value}? Result: ${result.toFixed(2)}.`
	}

	return {
		title,
		description,
		keywords: (content?.keywords && locale in content.keywords ? content.keywords[locale as keyof typeof content.keywords]?.join(', ') : null) || 'percentage, add, subtract, increase, decrease, calculation',
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
				en: `/en/add-subtract-percentage/${slug.join('/')}`,
				ru: `/ru/add-subtract-percentage/${slug.join('/')}`,
				es: `/es/add-subtract-percentage/${slug.join('/')}`,
				tr: `/tr/add-subtract-percentage/${slug.join('/')}`,
				hi: `/hi/add-subtract-percentage/${slug.join('/')}`,
			},
			canonical: `/${locale}/add-subtract-percentage/${slug.join('/')}`,
		},
	}
}

export default function AddSubtractPercentagePage({
	params,
}: AddSubtractPercentagePageProps) {
	const { locale, slug } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const parsed = parsePercentage(slug)

	if (!parsed || parsed.type === 'of') {
		return (
			<LegacyPageLayout
				locale={locale}
				title="Add/Subtract Percentage"
				relatedLinks={false}
			>
				<ErrorDisplay
					error="Invalid format. Use: /value/percent-add or /value/percent-subtract (supports decimals, e.g., /45.2/2.3-add)"
					locale={locale}
					examples={[
						{
							href: '/add-subtract-percentage/100/20-add',
							label: 'Example: /add-subtract-percentage/100/20-add',
						},
						{
							href: '/add-subtract-percentage/45.2/2.3-add',
							label: 'Example: /add-subtract-percentage/45.2/2.3-add',
						},
					]}
				/>
			</LegacyPageLayout>
		)
	}

	const result =
		parsed.type === 'add'
			? increaseBy(parsed.value, parsed.percent)
			: decreaseBy(parsed.value, parsed.percent)
	const steps = getPercentageSteps(parsed.value, parsed.percent, parsed.type)
	const title = `${parsed.type === 'add' ? 'Add' : 'Subtract'} ${parsed.percent}% ${parsed.type === 'add' ? 'to' : 'from'} ${parsed.value}`
	const content = getLegacyContent('add-subtract-percentage', locale)

	return (
		<LegacyPageLayout locale={locale} title={title} relatedLinks={false}>
			{/* Form for new calculation - at the top */}
			<div className="mb-8">
				<PercentageForm
					locale={locale}
					toolSlug="add-subtract-percentage"
					exampleLinks={[
						{ href: '/add-subtract-percentage/100/20-add', label: '/add-subtract-percentage/100/20-add' },
						{ href: '/add-subtract-percentage/500/15-subtract', label: '/add-subtract-percentage/500/15-subtract' },
						{ href: '/add-subtract-percentage/1000/25-add', label: '/add-subtract-percentage/1000/25-add' },
					]}
				/>
			</div>

			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">Formula</h2>
				<p className="text-lg text-gray-700 font-mono">
					{parsed.type === 'add'
						? `Result = Value + (Value × Percentage) / 100`
						: `Result = Value - (Value × Percentage) / 100`}
				</p>
			</div>

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div className="text-center">
					<p className="text-sm text-gray-500 mb-2">Result</p>
					<p className="text-4xl font-bold text-blue-600">
						{result % 1 === 0 ? result.toFixed(0) : result.toFixed(6)}
					</p>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Расчёт по шагам</h2>
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
		{content && locale in content.text && content.text[locale as keyof typeof content.text] && (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				{(content.text[locale as keyof typeof content.text] as string[]).map((paragraph, index) => (
						<p key={index} className="text-gray-700 mb-4 last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			)}

		{/* Use cases */}
		{content && locale in content.useCases && content.useCases[locale as keyof typeof content.useCases] && (
			<UseCasesBlock useCases={content.useCases[locale as keyof typeof content.useCases] as any} locale={locale} />
		)}

			<LegacyExamplesBlock
				examples={getExamplesForLegacyTool('add-subtract-percentage')}
				locale={locale}
			/>
			<LegacyFaqBlock faq={getFaqForLegacyTool('add-subtract-percentage')} />

			<LegacyRelatedLinks locale={locale} toolType="add-subtract-percentage" />
		</LegacyPageLayout>
	)
}
