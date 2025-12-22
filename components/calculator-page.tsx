'use client'

import { useState, useCallback } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { CalculatorForm } from './calculators/calculator-form'
import { CalculatorResults } from './calculators/calculator-results'
import { HowToBlock } from './calculators/how-to-block'
import { ExamplesBlock } from './calculators/examples-block'
import { FaqBlock } from './calculators/faq-block'
import { CalculatorHero } from './calculators/calculator-hero'

interface CalculatorPageProps {
	calculator: CalculatorDefinitionClient
	locale: string
	calculatorId?: string // Optional, will use calculator.id or calculator.slug as fallback
}

/**
 * Main calculator page component
 * Renders calculator in a standardized format with all required blocks
 */
export function CalculatorPage({
	calculator,
	locale,
	calculatorId: propCalculatorId,
}: CalculatorPageProps) {
	// Use calculator.id if calculatorId prop is not provided (fallback)
	const calculatorId = propCalculatorId || calculator.id || calculator.slug
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

			// Type-specific validation - SIMPLIFIED
			if (inputDef.type === 'number') {
				// Skip validation if empty and not required
				if ((value === '' || value === null || value === undefined) && !validation.required) {
					return null
				}
				
				const numValue = Number(value)
				
				// Only check if value is a valid number
				if (isNaN(numValue) || !Number.isFinite(numValue)) {
					return validation.message || `${inputDef.label} must be a valid number`
				}

				// Only prevent negative if explicitly required (min >= 0 in validation)
				// This allows negative values for calculations that need them (e.g., percentage change)
				if (validation.min !== undefined && validation.min >= 0 && numValue < 0) {
					return validation.message || `${inputDef.label} cannot be negative`
				}

				// Only check min/max if explicitly set in validation
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

				// Only require > 0 if explicitly required AND zero would break the calculation
				// Most fields should allow 0 as a valid input
				if (validation.required && validation.min !== undefined && validation.min > 0 && numValue <= 0) {
					return validation.message || `${inputDef.label} must be greater than 0`
				}
			}

			// Date validation
			if (inputDef.type === 'date') {
				if (typeof value === 'string' && value.trim() !== '') {
					const dateValue = new Date(value)
					if (isNaN(dateValue.getTime())) {
						return validation.message || `${inputDef.label} must be a valid date`
					}
					// Date validation is handled in the calculation function for age calculator
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
			// Determine which inputs should be visible based on shape selection
			const shouldShowInput = (input: typeof calculator.inputs[0]): boolean => {
				if (!input.visibleIf) return true
				const { field, value } = input.visibleIf
				const fieldValue = inputs[field]
				return String(fieldValue) === String(value)
			}

			// Validate only visible inputs
			const newErrors: Record<string, string> = {}
			let hasErrors = false

			calculator.inputs
				.filter(shouldShowInput)
				.forEach((input) => {
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
			
			// Always include select fields first (they control visibility and calculation type)
			calculator.inputs
				.filter((input) => input.type === 'select')
				.forEach((input) => {
					if (inputs[input.name] !== undefined && inputs[input.name] !== null && inputs[input.name] !== '') {
						processedInputs[input.name] = inputs[input.name]
					}
				})
			
			// Then process other visible inputs
			calculator.inputs.forEach((input) => {
				// Skip select fields (already processed)
				if (input.type === 'select') {
					return
				}
				
				let value = inputs[input.name]

				// Skip empty values for number inputs (they will be validated separately)
				if (input.type === 'number' && (value === '' || value === null || value === undefined)) {
					return // Skip this input, validation already caught it
				}

				if (input.type === 'number') {
					const numValue = Number(value)
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
			if (!calculatorId) {
				setErrors({_calculation: 'Calculator ID is not defined'})
				return
			}
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
				.then(async (response) => {
					const data = await response.json()
					if (!response.ok) {
						// If there are validation errors, show them
						if (data.errors && typeof data.errors === 'object') {
							const validationErrors: Record<string, string> = {}
							Object.keys(data.errors).forEach((key) => {
								validationErrors[key] = data.errors[key]
							})
							setErrors(validationErrors)
							return
						}
						throw new Error(data.error || data.message || 'Calculation failed')
					}
					return data
				})
				.then((data) => {
					if (!data) return // Skip if error was handled above
					if (data.results) {
						setOutputs(data.results)
						setErrors({}) // Clear any previous errors
					} else {
						setErrors({
							_calculation: 'Calculation completed but no results returned',
						})
					}
				})
				.catch((error) => {
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
				{/* Hero Section */}
				<CalculatorHero calculator={calculator} />

				{/* Migration warning for disabled calculators */}
				{calculator.isEnabled === false && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-yellow-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-yellow-800">
									This calculator is being migrated
								</h3>
								<div className="mt-2 text-sm text-yellow-700">
									<p>
										This calculator is temporarily unavailable while we migrate it to the new system.
										Please check back soon.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Calculator + Results Tool Container */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
					{/* Vertical layout for ALL calculators - results below form */}
					<div className="flex flex-col gap-8">
						{/* Calculator Form - Top */}
						<div className="w-full">
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

						{/* Results - Bottom */}
						{Object.keys(outputs).length > 0 && (
							<div className="w-full border-t border-gray-200 pt-8">
								<CalculatorResults calculator={calculator} outputs={outputs} />
							</div>
						)}
					</div>
				</div>

				{/* How to Calculate */}
				<div className="mb-12">
					<HowToBlock calculator={calculator} howToLabel="How to Calculate" />
				</div>

				{/* Examples */}
				<div className="mb-12">
					<ExamplesBlock calculator={calculator} />
				</div>

				{/* FAQ */}
				<div className="mb-12">
					<FaqBlock calculator={calculator} locale={locale} />
				</div>

				{/* Disclaimer for health calculators */}
				{calculator.category === 'health' && (
					<div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-yellow-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-yellow-800 mb-2">
									Medical Disclaimer
								</h3>
								<div className="text-sm text-yellow-700">
									<p>
										This calculator is for informational and educational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Individual results may vary based on genetics, body composition, medical conditions, medications, and other factors. Always consult with a healthcare provider or registered dietitian before making significant changes to your diet, exercise routine, or health-related decisions.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

			</div>
		</div>
	)
}
