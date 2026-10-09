/**
 * Isolated C1 probe: hostile yearsOwned must fail fast under a low heap.
 * Invoked by tests/unit/b3-computation-bounds.test.ts via spawnSync.
 * Do not call this with unbounded loops — the engine must reject first.
 */
const { calculateCarDepreciation } = await import(
	'../lib/calculations/car-depreciation.ts'
)

try {
	calculateCarDepreciation({
		purchasePrice: 25000,
		purchaseType: 'new',
		yearsOwned: 1e9,
		depreciationModel: 'simpleAnnualPercent',
		annualDepreciationRate: 15,
	})
	console.error('UNEXPECTED_SUCCESS')
	process.exit(2)
} catch (error) {
	const message = error instanceof Error ? error.message : String(error)
	if (!/exceeds the maximum|Years owned/i.test(message)) {
		console.error('UNEXPECTED_ERROR', message)
		process.exit(3)
	}
	console.log('BOUNDED_OK')
	process.exit(0)
}
