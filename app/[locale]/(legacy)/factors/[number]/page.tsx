import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { calculateFactors, getNumberClassification } from '@/lib/legacy/factors'
import { getPrimeFactors } from '@/lib/factors'
import { LegacyPageLayout } from '@/components/legacy/legacy-page-layout'
import { ErrorDisplay } from '@/components/legacy/error-display'
import { LegacyRelatedLinks } from '@/components/legacy/related-links'
import { LegacyFaqBlock } from '@/components/legacy/faq-block'
import { UseCasesBlock } from '@/components/legacy/use-cases-block'
import { getFaqForLegacyTool } from '@/lib/legacy/faqExamples'
import {
	getLegacyTitle,
	getLegacyDescription,
	getLegacyOgTitle,
	getLegacyOgDescription,
	getLegacyContent,
} from '@/lib/legacy/content'

interface FactorsPageProps {
	params: {
		locale: Locale
		number: string
	}
}

export async function generateMetadata({
	params,
}: FactorsPageProps): Promise<Metadata> {
	const { locale, number } = params

	const ogTitle = getLegacyOgTitle('factors', locale)
	const ogDescription = getLegacyOgDescription('factors', locale)
		const content = getLegacyContent('factors', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	return {
		title: `Factors of ${number} – calculator`,
		description: `Find all factors and prime factorization of ${number}. Calculate divisors and prime factors.`,
		keywords: content?.keywords[contentLocale]?.join(', ') || 'factors, divisors, prime factorization, number decomposition',
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
				en: `/en/factors/${number}`,
				ru: `/ru/factors/${number}`,
				es: `/es/factors/${number}`,
				tr: `/tr/factors/${number}`,
				hi: `/hi/factors/${number}`,
			},
			canonical: `/${locale}/factors/${number}`,
		},
	}
}

export default function FactorsPage({ params }: FactorsPageProps) {
	const { locale, number } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const parsedNumber = parseInt(number, 10)

	if (isNaN(parsedNumber) || parsedNumber < 1) {
		return (
			<LegacyPageLayout locale={locale} title="Number Factors" relatedLinks={false}>
				<ErrorDisplay
					error="Number must be a positive integer"
					locale={locale}
					examples={[{ href: '/factors/24', label: 'Example: /factors/24' }]}
				/>
			</LegacyPageLayout>
		)
	}

	const factors = calculateFactors(parsedNumber)
	const classification = getNumberClassification(parsedNumber)
	const primeFactorsRaw = getPrimeFactors(parsedNumber)
	const content = getLegacyContent('factors', locale)

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en'

	return (
		<LegacyPageLayout locale={locale} title={`Factors of ${parsedNumber}`} relatedLinks={false}>
			<div className="space-y-6 mb-8">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-gray-900">
							All Factors ({factors.length})
						</h2>
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${
								classification.type === 'prime'
									? 'bg-green-100 text-green-800'
									: 'bg-blue-100 text-blue-800'
							}`}
						>
							{classification.type === 'prime' ? 'Prime Number' : 'Composite Number'}
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{factors.map((factor) => (
							<span
								key={factor}
								className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium"
							>
								{factor}
							</span>
						))}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Definition</h2>
					<p className="text-gray-700 mb-2">
						Число {parsedNumber} является{' '}
						{classification.type === 'prime' ? 'простым' : 'составным'}.
					</p>
					<p className="text-gray-700 mb-2">
						Количество делителей: {classification.divisorCount}
					</p>
					<p className="text-gray-700">
						Сумма делителей: {classification.sumOfDivisors}
					</p>
				</div>

				{primeFactorsRaw.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Prime Factorization
						</h2>
						<p className="text-lg text-gray-700 mb-4">
							{parsedNumber} ={' '}
							{primeFactorsRaw
								.map(
									({ factor, exponent }) =>
										exponent > 1 ? `${factor}^${exponent}` : `${factor}`,
								)
								.join(' × ')}
						</p>
						<div className="flex flex-wrap gap-2">
							{primeFactorsRaw.map(({ factor, exponent }) => (
								<span
									key={factor}
									className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium"
								>
									{factor}
									{exponent > 1 && <sup className="ml-1">{exponent}</sup>}
								</span>
							))}
						</div>
					</div>
				)}
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

			<LegacyFaqBlock faq={getFaqForLegacyTool('factors')} />
			<LegacyRelatedLinks locale={locale} toolType="factors" />
		</LegacyPageLayout>
	)
}
