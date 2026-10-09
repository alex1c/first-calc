/**
 * Smoke: POST calculate for every enabled calculator with defaults.
 * Fails on HTTP 200 with null required numeric outputs, or 5xx.
 * Usage: npx tsx scripts/smoke-all-calculators.mjs
 */
import { calculatorRegistry } from '../lib/registry/loader.ts'
import { POST } from '../app/api/calculators/[id]/calculate/route.ts'

// Side-effect: register engines via schema loading / imports
await import('../lib/calculations/registry.ts')

const OPTIONAL = new Set([
	'formulaExplanation',
	'steps',
	'insights',
	'yearByYearTable',
	'yearlyBreakdown',
	'amortizationSchedule',
	'paymentBreakdown',
	'extraPaymentImpact',
	'breakdown',
	'explanation',
	'recommendations',
	'interpretation',
	'matchSummary',
	'insight',
	'timeToTarget',
	'payoffDate',
	'currencyWords',
])

async function smoke(locale) {
	const calcs = (await calculatorRegistry.getAll(locale)).filter(
		(c) => c.isEnabled !== false,
	)
	const failures = []
	let ok = 0

	for (const calc of calcs) {
		const inputs = {}
		for (const input of calc.inputs) {
			if (input.defaultValue !== undefined && input.defaultValue !== null) {
				inputs[input.name] = input.defaultValue
			} else if (input.type === 'number') {
				const min =
					typeof input.validation?.min === 'number'
						? input.validation.min
						: typeof input.min === 'number'
							? input.min
							: 1
				inputs[input.name] = Math.max(min, 1)
			} else if (input.type === 'select' && input.options?.[0]) {
				inputs[input.name] = input.options[0].value
			} else if (input.type === 'text') {
				inputs[input.name] = 'test'
			} else if (input.type === 'date') {
				inputs[input.name] = '1990-01-01'
			}
		}

		const request = new Request(
			`http://localhost:3000/api/calculators/${calc.id}/calculate?locale=${locale}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ locale, inputs }),
			},
		)

		try {
			const response = await POST(request, { params: { id: calc.id } })
			const data = await response.json()
			if (response.status >= 500) {
				failures.push({
					id: calc.id,
					status: response.status,
					error: data.error,
				})
				continue
			}
			if (response.status === 200) {
				const results = data.results || {}
				for (const output of calc.outputs) {
					if (OPTIONAL.has(output.name)) continue
					const value = results[output.name]
					if (value === null || value === undefined) {
						failures.push({
							id: calc.id,
							status: 200,
							error: `null required output: ${output.name}`,
						})
						break
					}
					if (typeof value === 'number' && !Number.isFinite(value)) {
						failures.push({
							id: calc.id,
							status: 200,
							error: `non-finite: ${output.name}`,
						})
						break
					}
				}
				ok++
			} else {
				// 4xx with defaults may be domain-valid (missing required combos)
				ok++
			}
		} catch (error) {
			failures.push({
				id: calc.id,
				status: 'throw',
				error: error instanceof Error ? error.message : String(error),
			})
		}
	}

	return { locale, total: calcs.length, ok, failures }
}

const en = await smoke('en')
const ru = await smoke('ru')
console.log(JSON.stringify({ en, ru }, null, 2))
if (en.failures.length || ru.failures.length) process.exit(1)
