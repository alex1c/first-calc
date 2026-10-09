import Link from 'next/link'
import {
	LEGACY_FACTORS_EXAMPLE,
	LEGACY_NUMBER_FORMAT_IN_EXAMPLE,
} from '@/lib/legacy/related'
import { localePath } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'

interface RelatedLink {
	href: string
	label: string
}

interface RelatedLinksProps {
	locale: string
	links?: RelatedLink[]
}

// Default related links for legacy services
const defaultLegacyLinks: RelatedLink[] = [
	{ href: '/chislo-propisyu', label: 'Число прописью (русский)' },
	{ href: '/numbers-to-words', label: 'Numbers to Words (English)' },
	{ href: '/roman-numerals-converter', label: 'Roman Numerals Converter' },
	{ href: '/percentage-of-a-number', label: 'Percentage of a Number' },
	{ href: '/add-subtract-percentage', label: 'Add/Subtract Percentage' },
]

// Dynamic legacy tools need a concrete number segment (bare hubs 404)
const defaultCalculatorLinks: RelatedLink[] = [
	{ href: LEGACY_NUMBER_FORMAT_IN_EXAMPLE, label: 'Indian Number Format' },
	{ href: LEGACY_FACTORS_EXAMPLE, label: 'Number Factors' },
]

// Common links for all pages
const commonLinks: RelatedLink[] = [
	{ href: '/calculators', label: 'All Calculators' },
]

/**
 * Generic related links list used on legacy and calculator pages.
 *
 * Accepts explicit links or falls back to curated defaults while prefixing
 * locale-aware paths.
 */
export function RelatedLinks({ locale, links }: RelatedLinksProps) {
	const siteLocale = locale as Locale
	// Use provided links or default based on context
	const displayLinks =
		links ||
		[
			...defaultLegacyLinks,
			...defaultCalculatorLinks,
			...commonLinks,
		]

	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				Вас может заинтересовать
			</h2>
			<ul className="space-y-2">
				{displayLinks.map((link) => (
					<li key={link.href}>
						<Link
							href={localePath(siteLocale, link.href)}
							className="text-blue-600 hover:text-blue-800 underline"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

