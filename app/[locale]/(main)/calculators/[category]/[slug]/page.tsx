import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { getCalculatorBySlug } from '@/lib/calculators/loader'
import { CalculatorPage } from '@/components/calculator-page'
import { CalculatorSchema } from '@/components/schema/calculator-schema'

interface CalculatorRoutePageProps {
	params: {
		locale: Locale
		category: string
		slug: string
	}
}

export async function generateMetadata({
	params,
}: CalculatorRoutePageProps): Promise<Metadata> {
	const { locale, category, slug } = params

	const calculator = await getCalculatorBySlug(category, slug, locale)

	if (!calculator) {
		return {
			title: 'Calculator Not Found',
		}
	}

	const keywords = calculator.meta?.keywords || []
	const keywordsString = keywords.join(', ')

	return {
		title: `${calculator.title} - Calculator Portal`,
		description: calculator.longDescription || calculator.shortDescription,
		keywords: keywordsString,
		alternates: {
			languages: {
				en: `/en/calculators/${category}/${slug}`,
				ru: `/ru/calculators/${category}/${slug}`,
				es: `/es/calculators/${category}/${slug}`,
				tr: `/tr/calculators/${category}/${slug}`,
				hi: `/hi/calculators/${category}/${slug}`,
			},
			canonical: `/${locale}/calculators/${category}/${slug}`,
		},
		openGraph: {
			title: calculator.title,
			description: calculator.longDescription || calculator.shortDescription,
			type: 'website',
			locale: locale,
		},
	}
}

export default function CalculatorRoutePage({
	params,
}: CalculatorRoutePageProps) {
	const { locale, category, slug } = params

	// Validate locale
	if (!locales.includes(locale)) {
		notFound()
	}

	// Get calculator definition
	const calculator = await calculatorRegistry.getBySlug(category, slug, locale)

	if (!calculator) {
		notFound()
	}

	const canonicalUrl = `https://first-calc.com/${locale}/calculators/${category}/${slug}`

	return (
		<>
			<CalculatorSchema calculator={calculator} canonicalUrl={canonicalUrl} />
			<CalculatorPage calculator={calculator} locale={locale} />
		</>
	)
}
