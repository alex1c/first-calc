/**
 * Legacy tools/converters block component
 * Displays legacy tools as cards on the calculators page
 */

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { getLegacyTitle, getLegacyDescription } from '@/lib/legacy/content'

interface LegacyTool {
	slug: string
	icon?: string
}

/**
 * Legacy tools to display in the converters block
 */
const legacyTools: LegacyTool[] = [
	{
		slug: 'numbers-to-words',
		icon: '🔤',
	},
	{
		slug: 'chislo-propisyu',
		icon: '📝',
	},
	{
		slug: 'roman-numerals-converter',
		icon: '🔢',
	},
	{
		slug: 'percentage-of-a-number',
		icon: '📊',
	},
	{
		slug: 'add-subtract-percentage',
		icon: '➕',
	},
	{
		slug: 'root-calculator',
		icon: '√',
	},
]

interface LegacyToolsBlockProps {
	locale: Locale
}

/**
 * Legacy tools block component
 * Displays legacy converters as cards
 */
export function LegacyToolsBlock({ locale }: LegacyToolsBlockProps) {
	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{locale === 'ru' ? 'Конвертеры' : 'Converters'}
			</h2>
			<p className="text-gray-600 mb-6">
				{locale === 'ru'
					? 'Специализированные инструменты для конвертации чисел, процентов и других значений'
					: 'Specialized tools for converting numbers, percentages, and other values'}
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
				{legacyTools.map((tool) => {
					const title = getLegacyTitle(tool.slug, locale)
					const description = getLegacyDescription(tool.slug, locale)
					const basePath = locale === 'en' ? '' : `/${locale}`
					const href = `${basePath}/${tool.slug}`

					return (
						<Link
							key={tool.slug}
							href={href}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
						>
							<div className="flex items-start">
								{tool.icon && (
									<div className="text-4xl mr-4 group-hover:scale-110 transition-transform">
										{tool.icon}
									</div>
								)}
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
										{title
											.replace(' - First Calc', '')
											.replace(' – калькулятор', '')
											.replace(' – Calculator', '')
											.replace(' - Конвертер чисел в текст', '')}
									</h3>
									<p className="text-sm text-gray-600 line-clamp-2">
										{description}
									</p>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}

