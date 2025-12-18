'use client'

/**
 * Breadcrumbs navigation component
 * Displays hierarchical navigation path
 */

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

export interface BreadcrumbItem {
	label: string
	href: string
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
	className?: string
}

/**
 * Breadcrumbs component
 * Renders a navigation path with separators
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
	if (!items || items.length === 0) {
		return null
	}

	return (
		<nav
			aria-label="Breadcrumb"
			className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
		>
			<ol className="flex items-center space-x-2">
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li key={item.href} className="flex items-center">
							{index === 0 ? (
								<Link
									href={item.href}
									className="flex items-center hover:text-gray-900 transition-colors"
									aria-label={item.label}
								>
									<HomeIcon className="h-4 w-4" />
									<span className="sr-only">{item.label}</span>
								</Link>
							) : (
								<>
									<ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
									{isLast ? (
										<span className="font-medium text-gray-900" aria-current="page">
											{item.label}
										</span>
									) : (
										<Link
											href={item.href}
											className="hover:text-gray-900 transition-colors"
										>
											{item.label}
										</Link>
									)}
								</>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}



