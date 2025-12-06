import Link from 'next/link'

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

// Default related links for new calculators
const defaultCalculatorLinks: RelatedLink[] = [
	{ href: '/number-format/in', label: 'Indian Number Format' },
	{ href: '/factors', label: 'Number Factors' },
]

// Common links for all pages
const commonLinks: RelatedLink[] = [
	{ href: '/calculators', label: 'All Calculators' },
]

export function RelatedLinks({ locale, links }: RelatedLinksProps) {
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
							href={`/${locale}${link.href}`}
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

