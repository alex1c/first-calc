'use client'

import { useState, useCallback } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface CalculatorFormProps {
	calculator: CalculatorDefinitionClient
	onCalculate: (inputs: Record<string, number | string>) => void
	errors: Record<string, string>
}

/**
 * Calculator form component
 * Handles input fields and validation
 */
export function CalculatorForm({
	calculator,
	onCalculate,
	errors,
}: CalculatorFormProps) {
	const [inputs, setInputs] = useState<Record<string, number | string>>(() => {
		const initial: Record<string, number | string> = {}
		calculator.inputs.forEach((input) => {
			// Set default value if available
			if (input.defaultValue !== undefined) {
				initial[input.name] = input.defaultValue
			} else {
				// For text inputs, initialize as empty string
				if (input.type === 'text') {
					initial[input.name] = ''
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
						initial[input.name] = input.defaultValue ?? (input.type === 'text' ? '' : '')
					}
				}
			}
		})
		return initial
	})

	const handleInputChange = useCallback(
		(name: string, value: string | number) => {
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
			onCalculate(inputs)
		},
		[inputs, onCalculate],
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
								type="number"
								id={input.name}
								name={input.name}
								value={inputs[input.name] ?? ''}
								onChange={(e) => {
									const value = e.target.value
									// Allow empty string for clearing, or valid number
									if (value === '' || !isNaN(parseFloat(value))) {
										handleInputChange(
											input.name,
											value === '' ? '' : parseFloat(value),
										)
									}
								}}
							onBlur={(e) => {
								// Prevent negative values where not allowed
								const numValue = parseFloat(e.target.value)
								if (!isNaN(numValue) && numValue < 0 && input.validation?.min !== undefined && input.validation.min >= 0) {
									handleInputChange(input.name, 0)
								}
							}}
							placeholder={input.placeholder}
							min={input.min ?? 0}
							max={input.max}
							step={input.step === 'any' ? 'any' : (input.step ?? 1)}
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
							<option value="">Select...</option>
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
				Calculate
			</button>
		</form>
	)
}

