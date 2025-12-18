'use client'

/**
 * Category navigation menu component
 * Desktop: Sidebar menu
 * Mobile: Dropdown menu
 */

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { Locale } from '@/lib/i18n'

interface CategoryMenuProps {
	locale: Locale
	categories: string[]
	currentCategory?: string
	categoryLabels: Record<string, string>
	allLabel: string
	categoriesLabel: string
	calculatorsLabel: string
}

/**
 * Category menu component
 * Shows categories in sidebar (desktop) or dropdown (mobile)
 */
export function CategoryMenu({
	locale,
	categories,
	currentCategory,
	categoryLabels,
	allLabel,
	categoriesLabel,
	calculatorsLabel,
}: CategoryMenuProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			{/* Mobile dropdown */}
			<div className="lg:hidden mb-4">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
				>
					<span className="font-medium text-gray-900">
						{calculatorsLabel}
					</span>
					<ChevronDownIcon
						className={`h-5 w-5 text-gray-500 transition-transform ${
							isOpen ? 'transform rotate-180' : ''
						}`}
					/>
				</button>
				{isOpen && (
					<div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
						<div className="py-2">
							<Link
								href={`/${locale}/calculators`}
								className={`block px-4 py-2 hover:bg-gray-50 transition-colors ${
									!currentCategory
										? 'bg-blue-50 text-blue-700 font-medium'
										: 'text-gray-700'
								}`}
								onClick={() => setIsOpen(false)}
							>
								{allLabel}
							</Link>
							{categories.map((category) => (
								<Link
									key={category}
									href={`/${locale}/calculators/${category}`}
									className={`block px-4 py-2 hover:bg-gray-50 transition-colors ${
										currentCategory === category
											? 'bg-blue-50 text-blue-700 font-medium'
											: 'text-gray-700'
									}`}
									onClick={() => setIsOpen(false)}
								>
									{categoryLabels[category] || category}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Desktop sidebar */}
			<aside className="hidden lg:block w-64 flex-shrink-0">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
					<h3 className="font-semibold text-gray-900 mb-3">
						{categoriesLabel}
					</h3>
					<nav className="space-y-1">
						<Link
							href={`/${locale}/calculators`}
							className={`block px-3 py-2 rounded-md transition-colors ${
								!currentCategory
									? 'bg-blue-50 text-blue-700 font-medium'
									: 'text-gray-700 hover:bg-gray-50'
							}`}
						>
							{allLabel}
						</Link>
						{categories.map((category) => (
							<Link
								key={category}
								href={`/${locale}/calculators/${category}`}
								className={`block px-3 py-2 rounded-md transition-colors ${
									currentCategory === category
										? 'bg-blue-50 text-blue-700 font-medium'
										: 'text-gray-700 hover:bg-gray-50'
								}`}
							>
								{categoryLabels[category] || category}
							</Link>
						))}
					</nav>
				</div>
			</aside>
		</>
	)
}

