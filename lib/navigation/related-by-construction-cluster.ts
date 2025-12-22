/**
 * Get related calculators based on construction clusters
 * Similar to related-by-cluster but for construction calculators
 */

import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatorRegistry } from '@/lib/registry/loader'
import {
	getClusterForCalculator,
	getCalculatorsForCluster,
	type ConstructionCluster,
} from '@/lib/navigation/construction-clusters'

/**
 * Get related calculators for a construction calculator based on cluster logic
 * 
 * Priority:
 * 1. Same cluster calculators (2-3 items)
 * 2. Upstream inputs (what user calculates first)
 * 3. Downstream next steps (what user does next)
 * 
 * @param calculatorId - Calculator ID
 * @param locale - Locale code
 * @param limit - Maximum number of related calculators to return
 * @returns Array of related calculator definitions
 */
export async function getRelatedByConstructionCluster(
	calculatorId: string,
	locale: string,
	limit: number = 6,
): Promise<CalculatorDefinition[]> {
	const cluster = getClusterForCalculator(calculatorId)
	
	if (!cluster) {
		return []
	}

	// Get calculators in the same cluster
	const sameClusterIds = getCalculatorsForCluster(cluster)
	const sameClusterCalculators = sameClusterIds
		.filter((id) => id !== calculatorId)
		.slice(0, 3) // Limit same cluster to 3

	// Define upstream/downstream flows
	// Priority: Same cluster (2-3) > Upstream inputs (1-2) > Downstream next steps (1-2)
	// FLOW 1: Concrete & Foundation → Cement → Sand → Gravel → Mix Ratio → Foundation → Rebar
	// FLOW 2: Slab Foundation → Concrete Volume → Rebar → Rebar Weight → Cement
	// FLOW 3: Walls → Wall Area → Brick → Mortar → Paint/Putty
	// FLOW 4: Finishing → Wall Area → Primer → Putty → Paint → Tile/Laminate
	// FLOW 5: Engineering → Electrical Load → Cable Size
	// FLOW 6: Plumbing → Pipe Volume → Utilities (future)
	const flows: Record<string, { upstream: string[], downstream: string[] }> = {
		// Materials flow (FLOW 1)
		'concrete-volume-calculator': {
			upstream: [],
			downstream: ['cement-calculator', 'sand-calculator', 'gravel-calculator', 'foundation-volume-calculator'],
		},
		'cement-calculator': {
			upstream: ['concrete-volume-calculator'],
			downstream: ['sand-calculator', 'gravel-calculator', 'concrete-mix-ratio-calculator'],
		},
		'sand-calculator': {
			upstream: ['concrete-volume-calculator', 'cement-calculator'],
			downstream: ['gravel-calculator', 'concrete-mix-ratio-calculator'],
		},
		'gravel-calculator': {
			upstream: ['concrete-volume-calculator', 'cement-calculator', 'sand-calculator'],
			downstream: ['concrete-mix-ratio-calculator'],
		},
		'concrete-mix-ratio-calculator': {
			upstream: ['concrete-volume-calculator', 'cement-calculator', 'sand-calculator', 'gravel-calculator'],
			downstream: ['foundation-volume-calculator'],
		},
		// Foundation flow (FLOW 1 & 2)
		'foundation-volume-calculator': {
			upstream: ['concrete-volume-calculator', 'concrete-mix-ratio-calculator'],
			downstream: ['strip-foundation-calculator', 'slab-foundation-calculator', 'pile-foundation-calculator'],
		},
		'strip-foundation-calculator': {
			upstream: ['foundation-volume-calculator', 'concrete-volume-calculator'],
			downstream: ['cement-calculator', 'rebar-calculator'],
		},
		'slab-foundation-calculator': {
			upstream: ['foundation-volume-calculator', 'concrete-volume-calculator'],
			downstream: ['concrete-volume-calculator', 'rebar-calculator', 'rebar-weight-calculator', 'cement-calculator'],
		},
		'pile-foundation-calculator': {
			upstream: ['foundation-volume-calculator', 'concrete-volume-calculator'],
			downstream: ['cement-calculator', 'rebar-calculator'],
		},
		// Walls flow (FLOW 3)
		'wall-area-calculator': {
			upstream: [],
			downstream: ['brick-calculator', 'paint-calculator', 'primer-calculator', 'putty-calculator'],
		},
		'brick-calculator': {
			upstream: ['wall-area-calculator'],
			downstream: ['paint-calculator', 'primer-calculator'],
		},
		// Finishing flow (FLOW 4)
		'paint-calculator': {
			upstream: ['wall-area-calculator', 'primer-calculator', 'putty-calculator'],
			downstream: ['tile-calculator', 'laminate-calculator'],
		},
		'primer-calculator': {
			upstream: ['wall-area-calculator'],
			downstream: ['putty-calculator', 'paint-calculator'],
		},
		'putty-calculator': {
			upstream: ['wall-area-calculator', 'primer-calculator'],
			downstream: ['paint-calculator'],
		},
		'tile-calculator': {
			upstream: ['wall-area-calculator'],
			downstream: ['laminate-calculator'],
		},
		'laminate-calculator': {
			upstream: ['wall-area-calculator', 'tile-calculator'],
			downstream: [],
		},
		// Reinforcement flow (FLOW 2)
		'rebar-calculator': {
			upstream: ['slab-foundation-calculator', 'foundation-volume-calculator', 'concrete-volume-calculator'],
			downstream: ['rebar-weight-calculator'],
		},
		'rebar-weight-calculator': {
			upstream: ['rebar-calculator'],
			downstream: [],
		},
		// Electrical flow (FLOW 5)
		'electrical-load-calculator': {
			upstream: [],
			downstream: ['cable-size-calculator'],
		},
		'cable-size-calculator': {
			upstream: ['electrical-load-calculator'],
			downstream: [],
		},
		// Plumbing flow (FLOW 6)
		'pipe-volume-calculator': {
			upstream: [],
			downstream: ['electrical-load-calculator'],
		},
		// Stairs flow
		'stair-calculator': {
			upstream: [],
			downstream: ['concrete-volume-calculator'],
		},
	}

	const flow = flows[calculatorId] || { upstream: [], downstream: [] }

	// Combine: same cluster (2-3) + upstream (1-2) + downstream (1-2)
	const relatedIds = [
		...sameClusterCalculators.slice(0, 3),
		...flow.upstream.slice(0, 2),
		...flow.downstream.slice(0, 2),
	].filter((id, index, self) => self.indexOf(id) === index) // Remove duplicates
		.slice(0, limit)

	// Load calculator definitions
	const relatedCalculators = await Promise.all(
		relatedIds.map((id) => calculatorRegistry.getById(id, locale)),
	)

	// Filter out any that failed to load
	return relatedCalculators.filter(
		(calc): calc is CalculatorDefinition => calc !== null,
	)
}

