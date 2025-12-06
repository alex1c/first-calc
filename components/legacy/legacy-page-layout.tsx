import { LegacyRelatedLinks } from './related-links'

interface LegacyPageLayoutProps {
	locale: string
	title: string
	children: React.ReactNode
	relatedLinks?: boolean
	toolType?: string
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
}: LegacyPageLayoutProps) {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
				{children}
				{relatedLinks && toolType && (
					<LegacyRelatedLinks locale={locale} toolType={toolType} />
				)}
			</div>
		</div>
	)
}
