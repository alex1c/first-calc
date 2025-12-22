/**
 * Previous/Next calculator navigation component
 * Shows navigation buttons within a category
 */

import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { Locale } from '@/lib/i18n'
import type { TranslationFunction } from '@/lib/i18n/types'

interface CalculatorNavigationProps {
	locale: Locale
	category: string
	previousCalculator?: {
		slug: string
		title: string
	} | null
	nextCalculator?: {
		slug: string
		title: string
	} | null
	t: TranslationFunction
}

/**
 * Calculator navigation component
 * Shows Previous/Next buttons for navigating within a category
 */
export function CalculatorNavigation({
	locale,
	category,
	previousCalculator,
	nextCalculator,
	t,
}: CalculatorNavigationProps) {
	if (!previousCalculator && !nextCalculator) {
		return null
	}

	return (
		<div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
			{previousCalculator ? (
				<Link
					href={`/${locale}/calculators/${category}/${previousCalculator.slug}`}
					className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
				>
					<ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
					<div className="flex flex-col">
						<span className="text-xs text-gray-500">
							{t('navigation.previous') || 'Previous'}
						</span>
						<span className="font-medium">{previousCalculator.title}</span>
					</div>
				</Link>
			) : (
				<div />
			)}

			{nextCalculator ? (
				<Link
					href={`/${locale}/calculators/${category}/${nextCalculator.slug}`}
					className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group text-right"
				>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500">
							{t('navigation.next') || 'Next'}
						</span>
						<span className="font-medium">{nextCalculator.title}</span>
					</div>
					<ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
				</Link>
			) : (
				<div />
			)}
		</div>
	)
}





