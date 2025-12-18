import { LegacyRelatedLinks } from './related-links'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import type { BreadcrumbItem } from '@/lib/navigation/breadcrumbs'

interface LegacyPageLayoutProps {
	locale: string
	title: string
	children: React.ReactNode
	relatedLinks?: boolean
	toolType?: string
	breadcrumbs?: BreadcrumbItem[]
}

/**
 * Common layout wrapper for legacy pages
 */
export function LegacyPageLayout({
	locale,
	title,
	children,
	relatedLinks = true,
	toolType,
	breadcrumbs,
}: LegacyPageLayoutProps) {
	return (
		<>
			{breadcrumbs && <BreadcrumbsBar items={breadcrumbs} />}
			<PageContainer>
				<h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
				{children}
				{relatedLinks && toolType && (
					<LegacyRelatedLinks locale={locale} toolType={toolType} />
				)}
			</PageContainer>
		</>
	)
}
