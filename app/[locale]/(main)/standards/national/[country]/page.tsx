import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
	locales,
	type Locale,
	loadNamespaces,
	createT,
} from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import {
	getNationalLandingBySlug,
	type NationalStandardLanding,
} from '@/data/national-standards'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

const namespaces = ['common', 'navigation'] as const

interface NationalCountryPageProps {
	params: {
		locale: Locale
		country: string
	}
}

/**
 * Helper that centralizes the fallback lookup logic so both metadata and the
 * page component reuse the same safety checks.
 */
function resolveLanding(
	locale: Locale,
	country: string,
): NationalStandardLanding {
	const landing = getNationalLandingBySlug(locale, country)
	if (!landing) {
		notFound()
	}
	return landing
}

export async function generateMetadata({
	params,
}: NationalCountryPageProps): Promise<Metadata> {
	const { locale, country } = params
	const landing = resolveLanding(locale, country)
	const basePath = locale === 'en' ? '' : `/${locale}`

	// Provide locale-aware canonical metadata so the new routes appear clean in
	// search engines without implying compliance statements.
	return {
		title: landing.seoTitle,
		description: landing.seoDescription,
		alternates: {
			languages: {
				en: `/en/standards/national/${landing.slug}`,
				ru: `/ru/standards/national/${landing.slug}`,
				es: `/es/standards/national/${landing.slug}`,
				tr: `/tr/standards/national/${landing.slug}`,
				hi: `/hi/standards/national/${landing.slug}`,
			},
			canonical: `${basePath}/standards/national/${landing.slug}`,
		},
	}
}

export default async function NationalCountryPage({
	params,
}: NationalCountryPageProps) {
	const { locale, country } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const landing = resolveLanding(locale, country)
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)
	const localePrefix = locale === 'en' ? '' : `/${locale}`
	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		landing.slug,
		landing.countryName,
		t,
	)
	const placeholderTiles = landing.tiles.filter((tile) => !tile.href)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		// CollectionPage keeps parity with the main standards index.
		name: landing.seoTitle,
		description: landing.seoDescription,
		url: `https://first-calc.com/${locale === 'en' ? '' : `${locale}/`}standards/national/${landing.slug}`,
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<header className="mb-10">
					<p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
						National landing
					</p>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{landing.title}
					</h1>
					<div className="space-y-4 text-lg text-gray-700">
						{landing.intro.map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>
				</header>

				<section aria-label="Upcoming standards tiles" className="mb-12">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Upcoming deep dives
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{landing.tiles.map((tile) => (
							// Tiles link to anchored sections within this page so we have
							// zero broken URLs while still providing navigation targets.
							<Link
								key={tile.id}
								href={
									tile.href
										? `${localePrefix}${tile.href}`
										: `${localePrefix}/standards/national/${landing.slug}#${tile.anchor}`
								}
								className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
							>
								<p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
									{tile.href ? 'Open hub' : 'Coming soon'}
								</p>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{tile.title}
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{tile.description}
								</p>
							</Link>
						))}
					</div>
				</section>

				{placeholderTiles.length > 0 && (
					<section aria-label="Placeholder details" className="mb-12 space-y-6">
						{placeholderTiles.map((tile) => (
							<div
								key={`${tile.id}-details`}
								id={tile.anchor}
								className="bg-blue-50 border border-blue-100 rounded-lg p-6"
							>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{tile.title}
								</h3>
								<p className="text-gray-700 mb-2">{tile.description}</p>
								<p className="text-sm text-gray-600 italic">
									Detailed educational article coming soon. This placeholder
									reserves navigation without implying compliance guidance.
								</p>
							</div>
						))}
					</section>
				)}

				{/* Mandatory disclaimer repeated per landing */}
				<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 md:p-8">
					<h2 className="text-xl font-semibold text-yellow-900 mb-3">
						⚠️ Mandatory disclaimer
					</h2>
					<ul className="space-y-2 text-yellow-800">
						<li>
							<strong>Educational content only.</strong>
						</li>
						<li>
							<strong>
								Not a substitute for local codes or professional engineering.
							</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}

