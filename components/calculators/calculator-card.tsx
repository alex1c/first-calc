/**
 * Enhanced calculator card component with icons, tags, and improved UI
 */

import Link from 'next/link'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface CalculatorCardProps {
	calculator: CalculatorDefinitionClient
	locale: string
	isPopular?: boolean
	isNew?: boolean
	hasStandard?: boolean
}

/**
 * Get category icon component
 */
function getCategoryIcon(category: string) {
	const iconClass = 'h-5 w-5'
	
	switch (category) {
		case 'math':
			return (
				<svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
				</svg>
			)
		case 'finance':
			return (
				<svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			)
		case 'geometry':
			return (
				<svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
				</svg>
			)
		default:
			return (
				<svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
				</svg>
			)
	}
}

/**
 * Get category color
 */
function getCategoryColor(category: string) {
	switch (category) {
		case 'math':
			return 'bg-blue-100 text-blue-700'
		case 'finance':
			return 'bg-green-100 text-green-700'
		case 'geometry':
			return 'bg-purple-100 text-purple-700'
		default:
			return 'bg-gray-100 text-gray-700'
	}
}

export function CalculatorCard({
	calculator,
	locale,
	isPopular = false,
	isNew = false,
	hasStandard = false,
}: CalculatorCardProps) {
	const categoryColor = getCategoryColor(calculator.category)
	const categoryIcon = getCategoryIcon(calculator.category)
	const howToPreview = calculator.howToBullets?.[0] || ''

	return (
		<Link
			href={`/${locale}/calculators/${calculator.category}/${calculator.slug}`}
			className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col h-full"
		>
			{/* Header with icon and tags */}
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-2">
					<div className={`p-2 rounded-lg ${categoryColor}`}>
						{categoryIcon}
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
							{calculator.title}
						</h3>
					</div>
				</div>
			</div>

			{/* Tags */}
			<div className="flex flex-wrap gap-2 mb-3">
				{isPopular && (
					<span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
						Popular
					</span>
				)}
				{isNew && (
					<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
						New
					</span>
				)}
				{hasStandard && (
					<span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
						Based on Standard
					</span>
				)}
				<span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${categoryColor}`}>
					{calculator.category}
				</span>
			</div>

			{/* Description */}
			<p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
				{calculator.shortDescription}
			</p>

			{/* How-to preview */}
			{howToPreview && (
				<div className="mt-auto pt-3 border-t border-gray-100">
					<p className="text-xs text-gray-500 line-clamp-1">
						<span className="font-medium">How to:</span> {howToPreview}
					</p>
				</div>
			)}
		</Link>
	)
}

