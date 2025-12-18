import Link from 'next/link'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { calculatorRegistry, standardRegistry } from '@/lib/registry/loader'
import { getLegacyToolsForCalculator } from '@/lib/links/legacyToCalculators'
import { getStandardsForCalculator } from '@/lib/standards/linking'

interface RelatedCalculatorsBlockProps {
	calculator: CalculatorDefinitionClient
	locale: string
}

/**
 * Related calculators block component
 * Shows links to related calculators and legacy tools
 * This is now a server component that fetches data
 */
export async function RelatedCalculatorsBlock({
	calculator,
	locale,
}: RelatedCalculatorsBlockProps) {
	const relatedCalculators = calculator.relatedIds
		? await Promise.all(
				calculator.relatedIds.map((id) =>
					calculatorRegistry.getById(id, locale),
				),
			).then((calcs) => calcs.filter((c): c is NonNullable<typeof c> => c !== undefined))
		: []
	const legacyTools = getLegacyToolsForCalculator(calculator.id)
	const standardIds = await getStandardsForCalculator(calculator.id, locale)
	const standards = standardIds.length > 0
		? await Promise.all(
				standardIds.map((id) => standardRegistry.getById(id, locale)),
			).then((stds) => stds.filter((s): s is NonNullable<typeof s> => s !== undefined))
		: []

	if (
		relatedCalculators.length === 0 &&
		legacyTools.length === 0 &&
		standards.length === 0
	) {
		return null
	}

	// Note: Translation should be passed from parent or loaded via context
	// For now, using hardcoded English (will be replaced with i18n)
	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				Related Calculators
			</h2>

			{/* Related calculators */}
			{relatedCalculators.length > 0 && (
				<div className="mb-4">
					<ul className="space-y-2">
						{relatedCalculators.map((calc) => (
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

			{/* Legacy tools */}
			{legacyTools.length > 0 && (
				<div className="mb-4">
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						Legacy Tools
					</h3>
					<ul className="space-y-2">
						{legacyTools.map((tool) => (
							<li key={tool}>
								<Link
									href={`/${locale}/${tool}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{tool.replace(/-/g, ' ').replace(/\b\w/g, (l) =>
										l.toUpperCase(),
									)}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Standards */}
			{standards.length > 0 && (
				<div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						This calculator is based on:
					</h3>
					<ul className="space-y-2">
						{standards.map((std) => (
							<li key={std.id}>
								<Link
									href={`/${locale}/standards/${std.country}/${std.slug}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{std.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
