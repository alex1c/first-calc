'use client'

import { useState, useEffect } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { executeExampleCalculation, formatExampleResult } from '@/lib/calculators/example-calculator'

interface ExamplesBlockEnhancedProps {
	calculator: CalculatorDefinitionClient
}

/**
 * Enhanced Examples Block Component
 * Executes real calculations for examples using the calculator's own calculation logic
 */
export function ExamplesBlockEnhanced({ calculator }: ExamplesBlockEnhancedProps) {
	if (!calculator.examples || calculator.examples.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
			<h2 className="text-2xl font-semibold text-gray-900 mb-6">Calculation Examples</h2>
			<div className="space-y-6">
				{calculator.examples.map((example) => {
					const exampleInputs = (example as any).inputs || {}
					const hasInputs = Object.keys(exampleInputs).length > 0

					return (
						<ExampleCard
							key={example.id || example.title}
							example={example}
							calculator={calculator}
							exampleInputs={exampleInputs}
							hasInputs={hasInputs}
						/>
					)
				})}
			</div>
		</div>
	)
}

/**
 * Individual Example Card Component
 * Handles calculation execution and result display
 */
function ExampleCard({
	example,
	calculator,
	exampleInputs,
	hasInputs,
}: {
	example: any
	calculator: CalculatorDefinitionClient
	exampleInputs: Record<string, number | string>
	hasInputs: boolean
}) {
	const [calculatedResults, setCalculatedResults] = useState<Record<string, number | string | null> | null>(null)
	const [isCalculating, setIsCalculating] = useState(false)
	const [calculationError, setCalculationError] = useState<string | null>(null)

	// Execute calculation when component mounts or inputs change
	useEffect(() => {
		if (hasInputs && calculator.calculate) {
			setIsCalculating(true)
			setCalculationError(null)

			// Execute calculation
			const executeCalc = async () => {
				try {
					const results = await executeExampleCalculation(calculator, exampleInputs)
					setCalculatedResults(results)
				} catch (error) {
					setCalculationError(error instanceof Error ? error.message : 'Calculation failed')
				} finally {
					setIsCalculating(false)
				}
			}

			executeCalc()
		}
	}, [hasInputs, calculator, exampleInputs])

	// Get input labels from calculator definition
	const getInputLabel = (inputName: string): string => {
		const inputDef = calculator.inputs.find((inp) => inp.name === inputName)
		return inputDef?.label || inputName.replace(/([A-Z])/g, ' $1').trim()
	}

	// Get output labels from calculator definition
	const getOutputLabel = (outputName: string): string => {
		const outputDef = calculator.outputs.find((out) => out.name === outputName)
		return outputDef?.label || outputName.replace(/([A-Z])/g, ' $1').trim()
	}

	// Support both 'result' and 'resultDescription' fields for fallback
	const fallbackResultText = (example as any).result || example.resultDescription || ''

	return (
		<div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
			{/* Title */}
			<h3 className="font-semibold text-gray-900 mb-3 text-xl">
				{example.title}
			</h3>

			{/* Description */}
			{example.description && (
				<p className="text-sm text-gray-600 mb-4">
					{example.description}
				</p>
			)}

			{/* Input Values */}
			{hasInputs && (
				<div className="mb-4">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						Input Values
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
						{Object.entries(exampleInputs).map(([key, value]) => {
							const inputDef = calculator.inputs.find((inp) => inp.name === key)
							const isOptional = !inputDef?.validation?.required
							
							return (
								<div
									key={key}
									className={`rounded px-3 py-2 text-sm ${
										isOptional && (value === 0 || value === '' || value === null)
											? 'bg-gray-50 border border-gray-200'
											: 'bg-blue-50 border border-blue-200'
									}`}
								>
									<span className={`font-medium ${
										isOptional && (value === 0 || value === '' || value === null)
											? 'text-gray-600'
											: 'text-blue-700'
									}`}>
										{getInputLabel(key)}
									</span>
									<span className={`ml-1 ${
										isOptional && (value === 0 || value === '' || value === null)
											? 'text-gray-500'
											: 'text-blue-900'
									}`}>
										: {typeof value === 'number' 
											? value.toLocaleString('en-US') 
											: value || (isOptional ? '(optional, default: 0)' : '')}
									</span>
									{inputDef?.unitLabel && (
										<span className="text-gray-500 text-xs ml-1">
											{inputDef.unitLabel}
										</span>
									)}
								</div>
							)
						})}
					</div>
				</div>
			)}

			{/* Calculation Steps (if provided) */}
			{example.steps && example.steps.length > 0 && (
				<div className="mb-4">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						Calculation Steps
					</p>
					<div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
						<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
							{example.steps.map((step: string, index: number) => (
								<li key={index}>{step}</li>
							))}
						</ol>
					</div>
				</div>
			)}

			{/* Calculated Results */}
			{hasInputs && (
				<div className="pt-4 border-t border-gray-200">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
						Calculated Results
					</p>
					{isCalculating ? (
						<div className="text-sm text-gray-500 italic">Calculating...</div>
					) : calculationError ? (
						<div className="text-sm text-red-600">Error: {calculationError}</div>
					) : calculatedResults ? (
						<div className="space-y-3">
							{calculator.outputs.map((output) => {
								const value = calculatedResults[output.name]
								if (value === null || value === undefined) return null

								const formattedValue = formatExampleResult(value, output.name, calculator)
								
								return (
									<div
										key={output.name}
										className="flex items-center justify-between py-2 px-3 bg-green-50 rounded border border-green-200"
									>
										<span className="text-sm font-medium text-green-800">
											{output.label || getOutputLabel(output.name)}
										</span>
										<span className="text-lg font-bold text-green-900">
											{formattedValue}
											{output.unitLabel && (
												<span className="text-sm font-normal text-green-700 ml-1">
													{output.unitLabel}
												</span>
											)}
										</span>
									</div>
								)
							})}
						</div>
					) : null}
				</div>
			)}

			{/* Fallback: Text-based result description */}
			{!hasInputs && fallbackResultText && (
				<div className="pt-4 border-t border-gray-200">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
						Result
					</p>
					<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
							{fallbackResultText}
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

