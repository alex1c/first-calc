'use client'

import { useState, useCallback } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { getSensibleDefault } from '@/lib/calculators/defaults'
import type { CalculatorLocale } from '@/lib/calculators/types'
import { parseLocalizedNumber } from '@/lib/numberFormat'
import { useClientT } from '@/lib/i18n/useClientT'

interface CalculatorFormProps {
	calculator: CalculatorDefinitionClient
	onCalculate: (inputs: Record<string, number | string | boolean>) => void
	errors: Record<string, string>
	locale: CalculatorLocale
}

const FORM_NAMESPACES = ['calculators/ui'] as const
const LOCALE_DECIMAL_PILOT = new Set([
	'square-root',
	'cement-calculator',
	'mortgage-calculator',
])

/**
 * Calculator form component
 * Handles input fields and validation
 */
export function CalculatorForm({
	calculator,
	onCalculate,
	errors,
	locale,
}: CalculatorFormProps) {
	const t = useClientT(locale, FORM_NAMESPACES)
	const usesLocaleDecimalInput = LOCALE_DECIMAL_PILOT.has(calculator.id)
	const [inputs, setInputs] = useState<Record<string, number | string | boolean>>(() => {
		const initial: Record<string, number | string | boolean> = {}
		calculator.inputs.forEach((input) => {
			// Set default value: use schema defaultValue OR sensible default OR empty
			let defaultValue = input.defaultValue
			if (defaultValue === undefined) {
				defaultValue = getSensibleDefault(input, calculator.id)
			}
			// For date inputs, if no default in schema, getSensibleDefault will provide today's date
			if (defaultValue !== undefined) {
				initial[input.name] = defaultValue
			} else {
				// For select inputs without default: use first option value (not empty)
				if (input.type === 'select' && input.options && input.options.length > 0) {
					initial[input.name] = input.options[0].value
				} else if (input.type === 'text') {
					initial[input.name] = ''
				} else if (input.type === 'date') {
					// Date inputs should have a default from getSensibleDefault (today or reasonable date)
					// If somehow undefined, use today as fallback
					const dateDefault = getSensibleDefault(input, calculator.id)
					initial[input.name] = dateDefault || new Date().toISOString().split('T')[0]
				} else {
					initial[input.name] = ''
				}
			}
		})
		// Initialize conditional fields based on their visibility
		calculator.inputs.forEach((input) => {
			if (input.visibleIf) {
				const { field, value } = input.visibleIf
				const fieldValue = initial[field]
				if (String(fieldValue) === String(value)) {
					// Field should be visible, initialize if not already set
					if (initial[input.name] === undefined) {
						const defaultValue = input.defaultValue ?? getSensibleDefault(input, calculator.id)
						initial[input.name] = defaultValue ?? (input.type === 'text' ? '' : '')
					}
				}
			}
		})
		return initial
	})

	const handleInputChange = useCallback(
		(name: string, value: string | number | boolean) => {
			setInputs((prev) => {
				const updated = { ...prev, [name]: value }
				// If shape changes, clear shape-specific inputs
				if (name === 'shape') {
					// Clear all shape-specific inputs
					calculator.inputs.forEach((input) => {
						if (input.visibleIf && input.visibleIf.field === 'shape') {
							delete updated[input.name]
						}
					})
				}
				// If inputMode changes, clear mode-specific inputs
				if (name === 'inputMode') {
					calculator.inputs.forEach((input) => {
						if (input.visibleIf && input.visibleIf.field === 'inputMode') {
							delete updated[input.name]
						}
					})
				}
				return updated
			})
		},
		[calculator.inputs],
	)

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			const normalizedInputs = { ...inputs }
			if (usesLocaleDecimalInput) {
				calculator.inputs
					.filter((input) => input.type === 'number')
					.forEach((input) => {
						const value = normalizedInputs[input.name]
						if (typeof value === 'string' && value.trim() !== '') {
							const parsed = parseLocalizedNumber(value, locale)
							if (parsed !== null) normalizedInputs[input.name] = parsed
						}
					})
			}
			onCalculate(normalizedInputs)
		},
		[calculator.inputs, inputs, locale, onCalculate, usesLocaleDecimalInput],
	)

	// Determine which inputs should be visible based on shape selection
	const shouldShowInput = (input: typeof calculator.inputs[0]): boolean => {
		if (!input.visibleIf) return true
		const { field, value } = input.visibleIf
		const fieldValue = inputs[field]
		return String(fieldValue) === String(value)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{calculator.inputs
				.filter(shouldShowInput)
				.map((input) => (
				<div key={input.name}>
					<label
						htmlFor={input.name}
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{input.label}
						{input.validation?.required && (
							<span className="text-red-500 ml-1">*</span>
						)}
						{input.unitLabel && (
							<span className="text-gray-500 ml-1">({input.unitLabel})</span>
						)}
					</label>

					{input.type === 'number' && (
						<>
							<input
								type={usesLocaleDecimalInput ? 'text' : 'number'}
								inputMode={usesLocaleDecimalInput ? 'decimal' : undefined}
								id={input.name}
								name={input.name}
								value={(() => {
									const val = inputs[input.name]
									if (typeof val === 'number') return val
									if (typeof val === 'string') return val
									return ''
								})()}
						onChange={(e) => {
								const value = e.target.value
								if (usesLocaleDecimalInput) {
									handleInputChange(input.name, value)
									return
								}
								// Allow empty string for clearing, or valid number
								if (value === '' || !isNaN(parseFloat(value))) {
									handleInputChange(
										input.name,
										value === '' ? '' : parseFloat(value),
									)
								}
							}}
							placeholder={input.placeholder}
							min={input.validation?.min !== undefined ? input.validation.min : (input.min !== undefined ? input.min : undefined)}
							max={input.validation?.max !== undefined ? input.validation.max : (input.max !== undefined ? input.max : undefined)}
							step={(() => {
								// Explicit step wins; 'any' disables HTML5 stepMismatch
								if (input.step === 'any') return 'any'
								if (input.step !== undefined) return input.step
								// When min is fractional (e.g. 0.01) and step defaults to 1,
								// integers like 5 fail (5 - 0.01) / 1 — match min precision
								const minBound =
									input.validation?.min !== undefined
										? input.validation.min
										: input.min
								if (
									typeof minBound === 'number' &&
									!Number.isInteger(minBound)
								) {
									const decimals = String(minBound).split('.')[1]?.length ?? 2
									return Number(`0.${'0'.repeat(Math.max(0, decimals - 1))}1`)
								}
								return 1
							})()}
							className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
								errors[input.name]
									? 'border-red-500 bg-red-50'
									: 'border-gray-300 bg-white'
							}`}
						/>
						</>
					)}

					{input.type === 'text' && (
						<>
							{input.name === 'dataset' ? (
								<textarea
									id={input.name}
									name={input.name}
									value={String(inputs[input.name] ?? '')}
									onChange={(e) => {
										handleInputChange(input.name, e.target.value)
									}}
									placeholder={input.placeholder}
									rows={4}
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y ${
										errors[input.name]
											? 'border-red-500 bg-red-50'
											: 'border-gray-300 bg-white'
									}`}
								/>
							) : (
								<input
									type="text"
									id={input.name}
									name={input.name}
									value={String(inputs[input.name] ?? '')}
									onChange={(e) => {
										handleInputChange(input.name, e.target.value)
									}}
									onKeyDown={() => {}}
									placeholder={input.placeholder}
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
										errors[input.name]
											? 'border-red-500 bg-red-50'
											: 'border-gray-300 bg-white'
									}`}
								/>
							)}
						</>
					)}

					{input.type === 'date' && (
						<input
							type="date"
							id={input.name}
							name={input.name}
							value={String(inputs[input.name] ?? '')}
							onChange={(e) => handleInputChange(input.name, e.target.value)}
							min={typeof input.min === 'string' ? input.min : undefined}
							max={typeof input.max === 'string' ? input.max : undefined}
							className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
								errors[input.name]
									? 'border-red-500 bg-red-50'
									: 'border-gray-300 bg-white'
							}`}
						/>
					)}

					{input.type === 'checkbox' && (
						<input
							type="checkbox"
							id={input.name}
							name={input.name}
							checked={inputs[input.name] === true}
							onChange={(e) => handleInputChange(input.name, e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
					)}

					{input.type === 'select' && input.options && (
						<select
							id={input.name}
							name={input.name}
							value={String(inputs[input.name] ?? '')}
							onChange={(e) => handleInputChange(input.name, e.target.value)}
							className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors[input.name]
									? 'border-red-500'
									: 'border-gray-300'
							}`}
						>
							{/* Only show placeholder if no default value and field is not required */}
							{(!input.defaultValue && !input.validation?.required && !inputs[input.name]) && (
								<option value="">{t('calculators/ui.form.select')}</option>
							)}
							{input.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					)}

					{input.helpText && (
						<p className="mt-1 text-sm text-gray-500">{input.helpText}</p>
					)}

					{errors[input.name] && (
						<p className="mt-1 text-sm text-red-600">{errors[input.name]}</p>
					)}
				</div>
			))}

			<button
				type="submit"
				className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{t('calculators/ui.form.calculate')}
			</button>
		</form>
	)
}
