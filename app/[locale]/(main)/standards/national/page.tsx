import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { PageContainer } from '@/components/layout/page-container'
import { getNationalLandingList } from '@/data/national-standards'
import { getNationalStandardsBreadcrumbs } from '@/lib/navigation/breadcrumbs'

const namespaces = ['common', 'navigation'] as const

interface NationalStandardsIndexProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: NationalStandardsIndexProps): Promise<Metadata> {
	const { locale } = params
	const basePath = locale === 'en' ? '' : `/${locale}`

	// The national index shares the same metadata for every locale because the
	// content is purely educational and identical at launch.
	return {
		title: 'National Engineering Standards Overview',
		description:
			'Educational navigation hub for country-level standards references. No calculators, no compliance claims.',
		alternates: {
			languages: {
				en: '/standards/national',
				ru: '/ru/standards/national',
				es: '/es/standards/national',
				tr: '/tr/standards/national',
				hi: '/hi/standards/national',
			},
			canonical: `${basePath}/standards/national`,
		},
	}
}

export default async function NationalStandardsIndex({
	params,
}: NationalStandardsIndexProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)
	const entries = getNationalLandingList(locale)
	const breadcrumbs = getNationalStandardsBreadcrumbs(
		locale,
		undefined,
		undefined,
		t,
	)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		// Schema uses a descriptive summary so search engines understand this is
		// a curated list of sub-landing pages.
		name: 'National Engineering Standards Overview',
		description:
			'Country landing pages that explain how national references relate conceptually to standards.',
		url: `https://first-calc.com/${locale === 'en' ? '' : `${locale}/`}standards/national`,
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<div className="mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						National Standards Overview
					</h1>
					<p className="text-lg text-gray-700">
						This area introduces country hubs that explain how local reference
						documents relate conceptually to the broader standards library.
						Content is educational only and keeps navigation ready for the next
						phase where detailed pages will be added.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					{entries.map((entry) => (
						// Each tile points to the new country-specific landing page so
						// navigation is ready before content ships.
						<Link
							key={entry.id}
							href={`/${locale}/standards/national/${entry.slug}`}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
						>
							<p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
								National landing
							</p>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								{entry.countryName}
							</h2>
							<p className="text-gray-600 text-sm leading-relaxed">
								{entry.intro[0]}
							</p>
						</Link>
					))}
				</div>

				{/* Mandatory legal disclaimer to restate the educational-only scope */}
				<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 md:p-8">
					<h2 className="text-xl font-semibold text-yellow-900 mb-3">
						⚠️ Mandatory disclaimer
					</h2>
					<ul className="space-y-2 text-yellow-800">
						<li>
							<strong>Educational content only.</strong>
						</li>
						<li>
							<strong>Not a substitute for local codes or professional engineering.</strong>
						</li>
					</ul>
				</div>
			</PageContainer>
		</>
	)
}

