import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getLegacyDescription, getLegacyTitle } from '@/lib/legacy/content'
import { PageContainer } from '@/components/layout/page-container'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { getToolsBreadcrumbs } from '@/lib/navigation/breadcrumbs'
import { toolGroups, legacyTools } from '@/lib/tools/registry'

interface ToolsPageProps {
	params: {
		locale: Locale
	}
}

const namespaces = ['common', 'navigation', 'tools/ui'] as const

function cleanLegacyTitle(title: string): string {
	return title
		.replace(' - Calculator Portal', '')
		.replace(' – калькулятор', '')
		.replace(' – Calculator', '')
		.replace(' - Конвертер чисел в текст', '')
		.trim()
}

export default async function ToolsPage({ params }: ToolsPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)
	const breadcrumbs = getToolsBreadcrumbs(locale, t)
	const basePath = locale === 'en' ? '' : `/${locale}`

	const groupedTools = toolGroups
		.map((group) => {
			const tools = legacyTools
				.filter((tool) => tool.group === group.id)
				.map((tool) => {
					const legacyTitle = tool.slug
						? cleanLegacyTitle(getLegacyTitle(tool.slug, locale))
						: tool.title
					const legacyDescription = tool.slug
						? getLegacyDescription(tool.slug, locale)
						: tool.description

					const path = tool.path.startsWith('/') ? tool.path : `/${tool.path}`
					const href = `${basePath}${path}`

					return {
						icon: tool.icon,
						title: legacyTitle || 'Tool',
						description: legacyDescription || '',
						href,
					}
				})

			return {
				id: group.id,
				title: t(`tools/ui.groups.${group.id}.title`),
				description: t(`tools/ui.groups.${group.id}.description`),
				tools: tools.filter((tool) => !!tool.title),
			}
		})
		.filter((group) => group.tools.length > 0)

	const toolsCta = {
		title: t('tools/ui.page.ctaCalculators'),
		label: t('tools/ui.page.ctaCalculatorsLabel'),
		href: `${basePath}/calculators`,
	}

	return (
		<>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<div className="max-w-4xl">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{t('tools/ui.page.title')}
					</h1>
					<p className="text-lg text-gray-600 mb-6">
						{t('tools/ui.page.subtitle')}
					</p>
					<div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
						{t('tools/ui.page.ctaToolsFromCalculators')}
					</div>
				</div>

				<div className="space-y-12">
					{groupedTools.map((group) => (
						<section key={group.id}>
							<div className="mb-4">
								<h2 className="text-2xl font-semibold text-gray-900">
									{group.title}
								</h2>
								<p className="text-gray-600 mt-1">{group.description}</p>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
								{group.tools.map((tool) => (
									<Link
										key={tool.href}
										href={tool.href}
										className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
									>
										<div className="flex items-start gap-3">
											<div className="text-3xl">{tool.icon}</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900 mb-1">
													{tool.title}
												</h3>
												<p className="text-sm text-gray-600 line-clamp-3">
													{tool.description}
												</p>
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					))}
				</div>

				<div className="mt-12">
					<div className="rounded-xl border border-blue-200 bg-blue-50 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-blue-900">{toolsCta.title}</p>
						<Link
							href={toolsCta.href}
							className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
						>
							{toolsCta.label}
						</Link>
					</div>
				</div>
			</PageContainer>
		</>
	)
}