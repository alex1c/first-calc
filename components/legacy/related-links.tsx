import Link from 'next/link'
import { getRelatedLegacyTools } from '@/lib/legacy/related'
import { getCalculatorsForLegacyTool } from '@/lib/links/legacyToCalculators'
import { getCalculatorById } from '@/data/calculators'

interface LegacyRelatedLinksProps {
	locale: string
	toolType: string
}

/**
 * Smart related links component for legacy pages
 * Shows both legacy tools and new calculators
 */
export function LegacyRelatedLinks({
	locale,
	toolType,
}: LegacyRelatedLinksProps) {
	const relatedTools = getRelatedLegacyTools(toolType)
	const calculatorIds = getCalculatorsForLegacyTool(toolType)
	const calculators = calculatorIds
		.map((id) => getCalculatorById(id, locale))
		.filter((calc): calc is NonNullable<typeof calc> => calc !== undefined)

	if (relatedTools.length === 0 && calculators.length === 0) {
		return null
	}

	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				Вас может заинтересовать
			</h2>

			{/* Legacy tools */}
			{relatedTools.length > 0 && (
				<div className="mb-4">
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						Legacy Tools
					</h3>
					<ul className="space-y-2">
						{relatedTools.map((tool) => (
							<li key={tool.href}>
								<Link
									href={`/${locale}${tool.href}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{tool.title}
								</Link>
								{tool.description && (
									<p className="text-sm text-gray-600 ml-4">
										{tool.description}
									</p>
								)}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* New calculators */}
			{calculators.length > 0 && (
				<div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						New Calculators
					</h3>
					<ul className="space-y-2">
						{calculators.map((calc) => (
							<li key={calc.id}>
								<Link
									href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{calc.title}
								</Link>
								{calc.shortDescription && (
									<p className="text-sm text-gray-600 ml-4">
										{calc.shortDescription}
									</p>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

