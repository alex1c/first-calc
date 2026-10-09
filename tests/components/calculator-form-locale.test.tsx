import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalculatorForm } from '@/components/calculators/calculator-form'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

vi.mock('@/lib/i18n/useClientT', () => ({
	useClientT: () => (key: string) => key === 'calculators.ui.form.calculate' ? 'Calculate' : key,
}))

afterEach(() => {
	cleanup()
})

function calculator(id: string, inputNames: string[]): CalculatorDefinitionClient {
	return {
		id,
		slug: id,
		category: id === 'cement-calculator' ? 'construction' : id === 'mortgage-calculator' ? 'finance' : 'math',
		title: id,
		shortDescription: '',
		locale: 'ru',
		inputs: inputNames.map((name) => ({ name, label: name, type: 'number', step: 'any' })),
		outputs: [],
		howToBullets: [],
		examples: [],
		faq: [],
	}
}

describe('representative locale-aware calculator forms', () => {
	it.each([
		['square-root', ['number']],
		['cement-calculator', ['volume', 'waste']],
		['mortgage-calculator', ['amount', 'rate']],
	])('parses decimal comma for %s', async (id, names) => {
		const onCalculate = vi.fn()
		render(<CalculatorForm calculator={calculator(id, names)} locale="ru" errors={{}} onCalculate={onCalculate} />)
		const user = userEvent.setup()
		await act(async () => user.type(screen.getByLabelText(names[0]), '12,5'))
		if (names[1]) await act(async () => user.type(screen.getByLabelText(names[1]), '-1.25'))
		await user.click(screen.getByRole('button', { name: /рассчитать|calculate/i }))

		expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({ [names[0]]: 12.5 }))
		if (names[1]) expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({ [names[1]]: -1.25 }))
	})
})
