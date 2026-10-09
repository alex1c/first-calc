/**
 * Final UI + SEO recovery regressions:
 * - Investment/Savings % fields must accept fractional rates (step ≠ 1)
 * - Legacy related links must not target bare /factors or /number-format/in
 * - formatOutputValue(locale) drives currency symbol
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { CalculatorForm } from '@/components/calculators/calculator-form'
import { getCalculatorById } from '@/data/calculators'
import { formatOutputValue } from '@/lib/calculators/format'
import {
	getRelatedLegacyTools,
	LEGACY_FACTORS_EXAMPLE,
	LEGACY_NUMBER_FORMAT_IN_EXAMPLE,
} from '@/lib/legacy/related'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

vi.mock('@/lib/i18n/useClientT', () => ({
	useClientT: () => (key: string) =>
		key === 'calculators.ui.form.calculate' ? 'Calculate' : key,
}))

afterEach(() => {
	cleanup()
})

describe('fractional rate step on finance forms', () => {
	it.each([
		['investment-calculator', 'expectedAnnualReturn'],
		['savings-calculator', 'annualInterestRate'],
	] as const)('%s %s step is fractional (not 1)', (id, fieldName) => {
		const calc = getCalculatorById(id, 'en')
		expect(calc).toBeTruthy()
		const rateInput = calc!.inputs.find((i) => i.name === fieldName)
		expect(rateInput, `${id} ${fieldName}`).toBeTruthy()
		expect(rateInput!.unitLabel).toBe('%')

		const clientCalc = {
			...calc!,
			howToBullets: calc!.howToBullets || [],
			examples: calc!.examples || [],
			faq: calc!.faq || [],
		} as CalculatorDefinitionClient

		const { container } = render(
			<CalculatorForm
				calculator={clientCalc}
				locale="en"
				errors={{}}
				onCalculate={() => {}}
			/>,
		)
		const input = container.querySelector(
			`[name="${fieldName}"]`,
		) as HTMLInputElement | null
		expect(input).toBeTruthy()
		const step = input!.getAttribute('step')
		expect(step).not.toBe('1')
		expect(Number(step) === 0.01 || step === 'any').toBe(true)
	})
})

describe('formatOutputValue locale currency', () => {
	it('formats RUB for ru and USD for en on currency outputs', () => {
		const ru = formatOutputValue(94111.23, 'currency', '$', 'ru')
		const en = formatOutputValue(94111.23, 'currency', '$', 'en')
		expect(ru).toMatch(/₽|RUB/)
		expect(ru).not.toMatch(/\$/)
		expect(en).toMatch(/\$|USD/)
	})
})

describe('legacy related links use concrete number paths', () => {
	it('never emits bare /factors or /number-format/in hubs', () => {
		const types = [
			'chislo-propisyu',
			'numbers-to-words',
			'roman-numerals-converter',
			'factors',
			'number-format-in',
			'percentage-of-a-number',
			'add-subtract-percentage',
			'range',
		]
		const hrefs = types.flatMap((t) =>
			getRelatedLegacyTools(t).map((tool) => tool.href),
		)
		expect(hrefs).not.toContain('/factors')
		expect(hrefs).not.toContain('/number-format/in')
		expect(hrefs.some((h) => h === LEGACY_FACTORS_EXAMPLE)).toBe(true)
		expect(hrefs.some((h) => h === LEGACY_NUMBER_FORMAT_IN_EXAMPLE)).toBe(
			true,
		)
	})
})
