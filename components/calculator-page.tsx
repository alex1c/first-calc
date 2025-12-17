'use client'

import { useState, useCallback } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { CalculatorForm } from './calculators/calculator-form'
import { CalculatorResults } from './calculators/calculator-results'
import { HowToBlock } from './calculators/how-to-block'
import { ExamplesBlock } from './calculators/examples-block'
import { FaqBlock } from './calculators/faq-block'
import { RelatedCalculatorsWrapper } from './calculators/related-calculators-wrapper'

interface CalculatorPageProps {
	calculator: CalculatorDefinitionClient
	locale: string
	calculatorId: string
}

/**
 * Main calculator page component
 * Renders calculator in a standardized format with all required blocks
 */
export function CalculatorPage({
	calculator,
	locale,
	calculatorId,
}: CalculatorPageProps) {
	const [outputs, setOutputs] = useState<Record<string, number | string | null>>(
		{},
	)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Validate input field
	const validateInput = useCallback(
		(name: string, value: number | string): string | null => {
			const inputDef = calculator.inputs.find((inp) => inp.name === name)
			if (!inputDef || !inputDef.validation) return null

			const validation = inputDef.validation

			// Required check
			if (validation.required) {
				if (
					value === '' ||
					value === null ||
					value === undefined ||
					(typeof value === 'string' && value.trim() === '')
				) {
					return validation.message || `${inputDef.label} is required`
				}
			}

			// Type-specific validation
			if (inputDef.type === 'number') {
				const numValue = Number(value)
				if (isNaN(numValue) || !Number.isFinite(numValue)) {
					return validation.message || `${inputDef.label} must be a valid number`
				}

				if (validation.min !== undefined && numValue < validation.min) {
					return (
						validation.message ||
						`${inputDef.label} must be at least ${validation.min}`
					)
				}

				if (validation.max !== undefined && numValue > validation.max) {
					return (
						validation.message ||
						`${inputDef.label} must be at most ${validation.max}`
					)
				}

				// Prevent negative values where not allowed
				if (numValue < 0 && inputDef.validation?.min !== undefined && inputDef.validation.min >= 0) {
					return validation.message || `${inputDef.label} cannot be negative`
				}
			}

			// Custom validation
			if (validation.custom) {
				const result = validation.custom(value)
				if (result !== true) {
					return typeof result === 'string' ? result : 'Invalid value'
				}
			}

			return null
		},
		[calculator],
	)

	// Handle calculation
	const handleCalculate = useCallback(
		(inputs: Record<string, number | string>) => {
			// Validate all inputs
			const newErrors: Record<string, string> = {}
			let hasErrors = false

			calculator.inputs.forEach((input) => {
				const value = inputs[input.name]
				const error = validateInput(input.name, value)
				if (error) {
					newErrors[input.name] = error
					hasErrors = true
				}
			})

			if (hasErrors) {
				setErrors(newErrors)
				return
			}

			// Clear errors
			setErrors({})

			// Convert string inputs to appropriate types
			const processedInputs: Record<string, number | string> = {}
			calculator.inputs.forEach((input) => {
				let value = inputs[input.name]

				if (input.type === 'number') {
					const numValue = value === '' ? 0 : Number(value)
					// Ensure we have a valid number
					if (isNaN(numValue) || !Number.isFinite(numValue)) {
						setErrors({
							_calculation: `Invalid number for ${input.label}`,
						})
						return
					}
					value = numValue
				}

				processedInputs[input.name] = value
			})

			// Calculate via API
			fetch(`/api/calculators/${calculatorId}/calculate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					inputs: processedInputs,
					locale,
				}),
			})
				.then((response) => {
					if (!response.ok) {
						return response.json().then((errorData) => {
							throw new Error(errorData.error || 'Calculation failed')
						})
					}
					return response.json()
				})
				.then((data) => {
					setOutputs(data.results)
				})
				.catch((error) => {
					console.error('Calculation error:', error)
					setErrors({
						_calculation: error instanceof Error ? error.message : 'Calculation failed',
					})
				})
		},
		[calculator, validateInput, calculatorId, locale],
	)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					{calculator.title}
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					{calculator.shortDescription}
				</p>

				{/* Calculator Form */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">
						Calculator
					</h2>

					{/* Global error */}
					{errors._calculation && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
							<div className="flex items-start">
								<svg
									className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
								<p className="text-red-800">{errors._calculation}</p>
							</div>
						</div>
					)}

					<CalculatorForm
						calculator={calculator}
						onCalculate={handleCalculate}
						errors={errors}
					/>
				</div>

				{/* Results */}
				<div className="mb-8">
					<CalculatorResults calculator={calculator} outputs={outputs} />
				</div>

				{/* How to Calculate */}
				<div className="mb-8">
					<HowToBlock calculator={calculator} />
				</div>

				{/* Examples */}
				<div className="mb-8">
					<ExamplesBlock calculator={calculator} />
				</div>

				{/* FAQ */}
				<div className="mb-8">
					<FaqBlock calculator={calculator} />
				</div>

				{/* Related Calculators */}
				<div className="mb-8">
					<RelatedCalculatorsWrapper calculator={calculator} locale={locale} />
				</div>
			</div>
		</div>
	)
}
