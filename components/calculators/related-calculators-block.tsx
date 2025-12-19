import Link from 'next/link'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { calculatorRegistry, standardRegistry } from '@/lib/registry/loader'
import { getLegacyToolsForCalculator } from '@/lib/links/legacyToCalculators'
import { getStandardsForCalculator } from '@/lib/standards/linking'
import { getRelatedByTags } from '@/lib/navigation/related-by-tags'
import { getRelatedByCluster } from '@/lib/navigation/related-by-cluster'
import { getClusterForCalculator } from '@/lib/navigation/math-clusters'
import { getRelatedByFinanceCluster } from '@/lib/navigation/related-by-finance-cluster'

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
	// Get related calculators with priority: tags > cluster > manual > category
	let relatedCalculators: Awaited<ReturnType<typeof calculatorRegistry.getById>>[] = []
	
	// Priority 1: Tag-based related calculators (for math and finance categories)
	if ((calculator.category === 'math' || calculator.category === 'finance') && calculator.tags && calculator.tags.length > 0) {
		const tagRelated = await getRelatedByTags(calculator.id, locale, 6)
		relatedCalculators = tagRelated
	}
	
	// Priority 2: Cluster-based related calculators
	if (calculator.category === 'math' && relatedCalculators.length < 6) {
		const clusterRelated = await getRelatedByCluster(calculator.id, locale, 6)
		// Merge with tag-based, avoiding duplicates
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCluster = clusterRelated.filter((c) => !existingIds.has(c.id))
		relatedCalculators = [...relatedCalculators, ...newFromCluster].slice(0, 8)
	}
	
	// Priority 2b: Finance cluster-based related calculators
	if (calculator.category === 'finance' && relatedCalculators.length < 6) {
		const financeClusterRelated = await getRelatedByFinanceCluster(calculator.id, locale)
		// Merge with tag-based, avoiding duplicates
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCluster = financeClusterRelated.filter((c) => !existingIds.has(c.id))
		relatedCalculators = [...relatedCalculators, ...newFromCluster].slice(0, 8)
	}
	
	// Priority 3: Manual relatedIds
	if (relatedCalculators.length < 6 && calculator.relatedIds && calculator.relatedIds.length > 0) {
		const manualRelated = await Promise.all(
			calculator.relatedIds.map((id) =>
				calculatorRegistry.getById(id, locale),
			),
		).then((calcs) => calcs.filter((c): c is NonNullable<typeof c> => c !== undefined))
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromManual = manualRelated.filter((c) => !existingIds.has(c.id))
		relatedCalculators = [...relatedCalculators, ...newFromManual].slice(0, 8)
	}
	
	// Priority 4: Same category fallback
	if (relatedCalculators.length < 6) {
		const categoryCalcs = await calculatorRegistry.getByCategory(
			calculator.category,
			locale,
		)
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCategory = categoryCalcs
			.filter((calc) => calc.id !== calculator.id && !existingIds.has(calc.id))
			.slice(0, 8 - relatedCalculators.length)
		relatedCalculators = [...relatedCalculators, ...newFromCategory]
	}
	
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
	const isMathCategory = calculator.category === 'math'
	const cluster = isMathCategory ? getClusterForCalculator(calculator.id) : null
	
	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{isMathCategory ? 'Related Math Calculators' : 'Related Calculators'}
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
