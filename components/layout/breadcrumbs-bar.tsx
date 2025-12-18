/**
 * BreadcrumbsBar component
 * Global breadcrumbs bar with consistent styling
 * Renders breadcrumbs in a thin navigation bar format
 */

import { Breadcrumbs, type BreadcrumbItem } from '@/components/navigation/breadcrumbs'

interface BreadcrumbsBarProps {
	items: BreadcrumbItem[]
}

/**
 * BreadcrumbsBar - Global breadcrumbs navigation bar
 * Provides consistent styling and layout for breadcrumbs across the portal
 */
export function BreadcrumbsBar({ items }: BreadcrumbsBarProps) {
	if (!items || items.length === 0) {
		return null
	}

	return (
		<div className="w-full border-b border-gray-200 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-3">
					<Breadcrumbs items={items} />
				</div>
			</div>
		</div>
	)
}

