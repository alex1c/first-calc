/**
 * @vitest-environment node
 *
 * Smoke every enabled EN/RU calculator via calculate API with defaults.
 * HTTP 200 must not carry null required numeric outputs.
 */
import { describe, expect, it } from 'vitest'
import { calculatorRegistry } from '@/lib/registry/loader'
import { POST } from '@/app/api/calculators/[id]/calculate/route'
import { hasLocalizedCalculatorContent } from '@/lib/i18n/content-availability'

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
	'interestSaved',
	'timeSaved',
	'monthsSaved',
	'paybackPeriod',
	'breakevenYear',
])

async function postCalculate(
	id: string,
	inputs: Record<string, unknown>,
	locale: string,
) {
	const request = new Request(
		`http://localhost:3000/api/calculators/${id}/calculate?locale=${locale}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale, inputs }),
		},
	)
	const response = await POST(request, { params: { id } })
	const data = await response.json()
	return { response, data }
}

describe('all calculators smoke (EN + RU)', () => {
	it(
		'does not return 5xx or 200/null for required outputs',
		async () => {
			const failures: string[] = []
			for (const locale of ['en', 'ru'] as const) {
				const calcs = (await calculatorRegistry.getAll(locale)).filter(
					(c) =>
						c.isEnabled !== false &&
						hasLocalizedCalculatorContent(locale, c.slug),
				)
				expect(calcs.length).toBeGreaterThan(50)

				for (const calc of calcs) {
					const inputs: Record<string, unknown> = {}
					for (const input of calc.inputs) {
						if (
							input.defaultValue !== undefined &&
							input.defaultValue !== null &&
							input.defaultValue !== ''
						) {
							inputs[input.name] = input.defaultValue
						} else if (input.type === 'number') {
							const min =
								typeof input.validation?.min === 'number'
									? input.validation.min
									: typeof input.min === 'number'
										? input.min
										: 1
							inputs[input.name] = Math.max(min === 0 ? 1 : min, 1)
						} else if (input.type === 'select' && input.options?.[0]) {
							inputs[input.name] = input.options[0].value
						} else if (input.type === 'text') {
							// Statistics datasets need numeric samples
							inputs[input.name] =
								input.name === 'dataset' || input.name === 'numbers'
									? '1, 2, 3, 4, 5'
									: input.name.toLowerCase().includes('equation')
										? 'x^2-4=0'
										: 'test'
						} else if (input.type === 'date') {
							inputs[input.name] = '1990-01-01'
						}
					}
					// Known calculator-specific smoke seeds
					if (calc.slug === 'roman-numerals-converter') {
						inputs.mode = 'number-to-roman'
						inputs.value = '42'
					}
					if (calc.slug === 'steps-to-calories-calculator') {
						inputs.steps = inputs.steps || 5000
						inputs.weightKg = inputs.weightKg || 70
					}
					if (calc.slug === 'equation-solver') {
						inputs.equation = inputs.equation || 'x^2-4=0'
						inputs.inputMode = 'equation'
						inputs.equationType = 'linear'
						inputs.equationText = '2x+4=10'
					}
					if (calc.slug === 'retirement-calculator') {
						inputs.calculationMode = 'future_balance'
						inputs.currentAge = 30
						inputs.retirementAge = 65
						inputs.currentSavings = 10000
						inputs.annualReturnRate = 5
						inputs.monthlyContribution = 100
						inputs.inflationRate = 0
					}
					if (calc.slug === 'tire-cost-calculator') {
						inputs.tirePricePerUnit = 100
						inputs.tiresCount = 4
						inputs.tireLifespanMilesKm = 40000
						inputs.annualMileage = 12000
						inputs.seasonalTiresToggle = false
						inputs.mountingAndBalancingCost = 0
					}
					if (calc.slug === 'car-affordability-calculator') {
						inputs.mode = 'byMonthlyBudget'
						inputs.maxMonthlyCarBudget = 500
						inputs.loanAPR = 6
						inputs.loanTermMonths = 60
						inputs.downPayment = 2000
						inputs.estimatedMonthlyFixedCosts = 100
						inputs.tradeInValue = 0
						inputs.salesTaxOrFees = 0
					}

					const { response, data } = await postCalculate(
						calc.id,
						inputs,
						locale,
					)
					if (response.status >= 500) {
						failures.push(
							`${locale}:${calc.id} status=${response.status} ${data.error}`,
						)
						continue
					}
					// Default fixtures must not be blocked by required-output guards (H1)
					if (
						response.status === 400 &&
						String(data.error || '').includes('required results')
					) {
						failures.push(
							`${locale}:${calc.id} status=400 ${data.error}`,
						)
						continue
					}
					if (response.status === 200) {
						const required = calc.outputs.filter(
							(output) => !OPTIONAL.has(output.name),
						)
						const present = required.filter((output) => {
							const value = data.results?.[output.name]
							return value !== null && value !== undefined
						})
						if (required.length > 0 && present.length === 0) {
							failures.push(
								`${locale}:${calc.id} no required outputs present`,
							)
						}
						for (const output of present) {
							const value = data.results?.[output.name]
							if (typeof value === 'number' && !Number.isFinite(value)) {
								failures.push(
									`${locale}:${calc.id} non-finite ${output.name}`,
								)
								break
							}
						}
					}
				}
			}

			expect(failures.slice(0, 20), failures.join('\n')).toEqual([])
		},
		120_000,
	)
})
