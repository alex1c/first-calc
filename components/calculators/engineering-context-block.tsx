import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { standardRegistry } from '@/lib/registry/loader'

/**
 * Mapping of calculator IDs to their related standard
 * Each calculator should link to only ONE standard
 * 
 * CANONICAL WORDING: "This calculator is based on common engineering principles discussed in [Standard]"
 */
const calculatorToStandard: Record<
	string,
	{ country: string; slug: string }
> = {
	// Eurocode 2 calculators (concrete materials and reinforcement)
	'concrete-volume-calculator': {
		country: 'EU',
		slug: 'eurocode-2',
	},
	'cement-calculator': {
		country: 'EU',
		slug: 'eurocode-2',
	},
	'concrete-mix-ratio-calculator': {
		country: 'EU',
		slug: 'eurocode-2',
	},
	'rebar-calculator': {
		country: 'EU',
		slug: 'eurocode-2',
	},
	'rebar-weight-calculator': {
		country: 'EU',
		slug: 'eurocode-2',
	},
	// Eurocode 1 calculators (structural loads)
	'slab-foundation-calculator': {
		country: 'EU',
		slug: 'eurocode-1',
	},
	'foundation-volume-calculator': {
		country: 'EU',
		slug: 'eurocode-1',
	},
	'stair-calculator': {
		country: 'EU',
		slug: 'eurocode-1',
	},
	// ISO Soil & Foundations calculators (geotechnical)
	'strip-foundation-calculator': {
		country: 'ISO',
		slug: 'soil-and-foundations',
	},
	'pile-foundation-calculator': {
		country: 'ISO',
		slug: 'soil-and-foundations',
	},
}

interface EngineeringContextBlockProps {
	calculatorId: string
	locale: Locale
}

/**
 * Engineering Context Block
 * Displays a small informational block linking calculator to related standard
 * This is informational, not promotional
 */
export async function EngineeringContextBlock({
	calculatorId,
	locale,
}: EngineeringContextBlockProps) {
	const standardInfo = calculatorToStandard[calculatorId]

	if (!standardInfo) {
		return null
	}

	// Get standard to display its title
	const standard = await standardRegistry.getBySlug(
		standardInfo.country,
		standardInfo.slug,
		locale,
	)

	if (!standard) {
		return null
	}

	// Canonical wording for all standards
	const canonicalText = `This calculator is based on common engineering principles discussed in ${standard.title}.`

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
			<h3 className="text-sm font-semibold text-gray-700 mb-2">
				Engineering Context
			</h3>
			<p className="text-sm text-gray-600 mb-2">{canonicalText}</p>
			<Link
				href={`/${locale}/standards/${standardInfo.country}/${standardInfo.slug}`}
				className="text-sm text-blue-600 hover:text-blue-800 underline"
			>
				Learn more about {standard.title}
			</Link>
		</div>
	)
}

