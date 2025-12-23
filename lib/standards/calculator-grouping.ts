import type { CalculatorDefinition } from '@/lib/calculators/types'
import { getClusterForCalculator } from '@/lib/navigation/construction-clusters'

/**
 * Calculator type groups for standards pages
 */
export type CalculatorGroup = 'Foundations' | 'Concrete' | 'Reinforcement' | 'Other'

/**
 * Map construction clusters to calculator groups
 */
const clusterToGroup: Record<string, CalculatorGroup> = {
	foundation: 'Foundations',
	materials: 'Concrete',
	reinforcement: 'Reinforcement',
}

/**
 * Direct calculator ID to group mapping for specific cases
 */
const calculatorToGroup: Record<string, CalculatorGroup> = {
	'concrete-volume-calculator': 'Concrete',
	'cement-calculator': 'Concrete',
	'concrete-mix-ratio-calculator': 'Concrete',
	'foundation-volume-calculator': 'Foundations',
	'slab-foundation-calculator': 'Foundations',
	'strip-foundation-calculator': 'Foundations',
	'pile-foundation-calculator': 'Foundations',
	'rebar-calculator': 'Reinforcement',
	'rebar-weight-calculator': 'Reinforcement',
	'stair-calculator': 'Other',
}

/**
 * Get calculator group for a calculator
 */
export function getCalculatorGroup(calculator: CalculatorDefinition): CalculatorGroup {
	// First check direct mapping
	if (calculatorToGroup[calculator.id]) {
		return calculatorToGroup[calculator.id]
	}

	// Then check cluster
	const cluster = getClusterForCalculator(calculator.id)
	if (cluster && clusterToGroup[cluster]) {
		return clusterToGroup[cluster]
	}

	return 'Other'
}

/**
 * Group calculators by type
 */
export function groupCalculators(
	calculators: CalculatorDefinition[],
): Record<CalculatorGroup, CalculatorDefinition[]> {
	const groups: Record<CalculatorGroup, CalculatorDefinition[]> = {
		Foundations: [],
		Concrete: [],
		Reinforcement: [],
		Other: [],
	}

	for (const calc of calculators) {
		const group = getCalculatorGroup(calc)
		groups[group].push(calc)
	}

	return groups
}

/**
 * Calculator descriptions in the context of standards
 */
export const calculatorDescriptions: Record<
	string,
	Record<string, string>
> = {
	// Eurocode 2 descriptions
	'eurocode-2': {
		'concrete-volume-calculator':
			'Estimate concrete volume for slabs, footings, and columns based on dimensions.',
		'cement-calculator':
			'Calculate cement quantity needed based on concrete volume and mix ratio.',
		'concrete-mix-ratio-calculator':
			'Determine proper mix proportions for different concrete strength grades.',
		'slab-foundation-calculator':
			'Calculate slab foundation dimensions and material requirements.',
		'rebar-calculator':
			'Estimate reinforcement quantity and spacing for concrete slabs.',
		'rebar-weight-calculator':
			'Calculate total weight of reinforcement bars for ordering and cost estimation.',
	},
	// Eurocode 1 descriptions
	'eurocode-1': {
		'slab-foundation-calculator':
			'Estimate slab size affected by structural loads and load combinations.',
		'foundation-volume-calculator':
			'Calculate foundation volume based on load-dependent sizing requirements.',
		'rebar-calculator':
			'Estimate reinforcement quantity based on load requirements and structural design.',
		'stair-calculator':
			'Calculate stair dimensions considering live load requirements and safety factors.',
	},
	// ISO Soil & Foundations descriptions
	'iso-soil-foundations': {
		'foundation-volume-calculator':
			'Foundation sizing depends on soil bearing capacity and ground conditions.',
		'strip-foundation-calculator':
			'Estimate continuous footing dimensions based on load and soil assumptions.',
		'slab-foundation-calculator':
			'Slab thickness and area depend on soil bearing capacity and settlement considerations.',
		'pile-foundation-calculator':
			'Pile design depends on soil conditions and load transfer requirements.',
		'concrete-volume-calculator':
			'Estimate concrete volume for foundation elements based on soil-dependent dimensions.',
		'rebar-calculator':
			'Estimate reinforcement quantity for foundation elements based on soil conditions.',
	},
}

/**
 * Get description for a calculator in the context of a standard
 */
export function getCalculatorDescription(
	calculatorId: string,
	standardId: string,
): string | undefined {
	return calculatorDescriptions[standardId]?.[calculatorId]
}

