import { LegacyRelatedLinks } from './related-links'
import { LegacyDiscoveryTiles } from './legacy-discovery-tiles'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import type { BreadcrumbItem } from '@/lib/navigation/breadcrumbs'
import { loadNamespaces, createT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface LegacyPageLayoutProps {
	locale: Locale
	title: string
	children: React.ReactNode
	relatedLinks?: boolean
	toolType?: string
	breadcrumbs?: BreadcrumbItem[]
}

/**
 * Common layout wrapper for legacy pages
 */
export async function LegacyPageLayout({
	locale,
	title,
	children,
	relatedLinks = true,
	toolType,
	breadcrumbs,
}: LegacyPageLayoutProps) {
	const dict = await loadNamespaces(locale, ['navigation', 'legacy/notices'])
	const t = createT(dict)
	const basePath = locale === 'en' ? '' : `/${locale}`

	const resolvedBreadcrumbs =
		breadcrumbs ||
		[
			{
				label: t('navigation.breadcrumb.home'),
				href: basePath || '/',
			},
			{
				label: t('navigation.breadcrumb.tools'),
				href: `${basePath}/tools`,
			},
			{
				label: title,
				href: toolType ? `${basePath}/${toolType}` : '#',
			},
		]

	const badgeLabel = t('legacy/notices.classicBadge.label')
	const badgeHelper = t('legacy/notices.classicBadge.helper')

	return (
		<>
			{resolvedBreadcrumbs && <BreadcrumbsBar items={resolvedBreadcrumbs} />}
			<PageContainer>
				<div className="mb-3">
					<div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
						{badgeLabel}
					</div>
					<p className="mt-2 text-sm text-gray-600">{badgeHelper}</p>
				</div>
				<h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
				{children}
				{relatedLinks && toolType && (
					<LegacyRelatedLinks locale={locale} toolType={toolType} />
				)}
				<LegacyDiscoveryTiles locale={locale} />
			</PageContainer>
		</>
	)
}
