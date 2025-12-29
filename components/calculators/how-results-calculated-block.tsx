'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface HowResultsCalculatedBlockProps {
	locale: Locale
}

/**
 * Translations for the "How results are calculated" block
 */
const translations: Record<Locale, {
	title: string
	point1: string
	point2: string
	point3: string
	learnMore: string
	learnMoreLink: string
	whyDiffer: string
	whyDifferLink: string
}> = {
	en: {
		title: 'How results are calculated',
		point1: 'Results are based on simplified formulas and typical assumptions',
		point2: 'Inputs represent common scenarios, not site-specific conditions',
		point3: 'Outputs are estimates for learning and planning only',
		learnMore: 'Learn more about how calculators work',
		learnMoreLink: '/learn/how-calculators-abstract-standards-safely',
		whyDiffer: 'Why calculators differ by region',
		whyDifferLink: '/learn/why-construction-calculators-differ-by-region',
	},
	ru: {
		title: 'Как рассчитываются результаты',
		point1: 'Результаты основаны на упрощенных формулах и типичных допущениях',
		point2: 'Входные данные представляют общие сценарии, а не условия конкретного участка',
		point3: 'Выходные данные являются оценками только для обучения и планирования',
		learnMore: 'Узнайте больше о том, как работают калькуляторы',
		learnMoreLink: '/learn/how-calculators-abstract-standards-safely',
		whyDiffer: 'Почему калькуляторы различаются по регионам',
		whyDifferLink: '/learn/why-construction-calculators-differ-by-region',
	},
	es: {
		title: 'How results are calculated',
		point1: 'Results are based on simplified formulas and typical assumptions',
		point2: 'Inputs represent common scenarios, not site-specific conditions',
		point3: 'Outputs are estimates for learning and planning only',
		learnMore: 'Learn more about how calculators work',
		learnMoreLink: '/learn/how-calculators-abstract-standards-safely',
		whyDiffer: 'Why calculators differ by region',
		whyDifferLink: '/learn/why-construction-calculators-differ-by-region',
	},
	tr: {
		title: 'How results are calculated',
		point1: 'Results are based on simplified formulas and typical assumptions',
		point2: 'Inputs represent common scenarios, not site-specific conditions',
		point3: 'Outputs are estimates for learning and planning only',
		learnMore: 'Learn more about how calculators work',
		learnMoreLink: '/learn/how-calculators-abstract-standards-safely',
		whyDiffer: 'Why calculators differ by region',
		whyDifferLink: '/learn/why-construction-calculators-differ-by-region',
	},
	hi: {
		title: 'How results are calculated',
		point1: 'Results are based on simplified formulas and typical assumptions',
		point2: 'Inputs represent common scenarios, not site-specific conditions',
		point3: 'Outputs are estimates for learning and planning only',
		learnMore: 'Learn more about how calculators work',
		learnMoreLink: '/learn/how-calculators-abstract-standards-safely',
		whyDiffer: 'Why calculators differ by region',
		whyDifferLink: '/learn/why-construction-calculators-differ-by-region',
	},
}

/**
 * Universal informational block explaining how calculator results are calculated
 * Appears on all calculator pages below results, above Examples block
 */
export function HowResultsCalculatedBlock({ locale }: HowResultsCalculatedBlockProps) {
	const t = translations[locale] || translations.en
	const localePrefix = locale === 'en' ? '' : `/${locale}`

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-5 mb-12">
			<div className="flex items-start">
				{/* Info icon */}
				<svg
					className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5 mr-3"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clipRule="evenodd"
					/>
				</svg>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-gray-900 mb-2">
						{t.title}
					</h3>
					<ul className="text-sm text-gray-700 space-y-1.5 mb-3">
						<li className="flex items-start">
							<span className="text-gray-400 mr-2">•</span>
							<span>{t.point1}</span>
						</li>
						<li className="flex items-start">
							<span className="text-gray-400 mr-2">•</span>
							<span>{t.point2}</span>
						</li>
						<li className="flex items-start">
							<span className="text-gray-400 mr-2">•</span>
							<span>{t.point3}</span>
						</li>
					</ul>
					<div className="flex flex-wrap gap-3 text-sm">
						<Link
							href={`${localePrefix}${t.learnMoreLink}`}
							className="text-blue-600 hover:text-blue-800 underline"
						>
							{t.learnMore} →
						</Link>
						<Link
							href={`${localePrefix}${t.whyDifferLink}`}
							className="text-blue-600 hover:text-blue-800 underline"
						>
							{t.whyDiffer} →
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}



