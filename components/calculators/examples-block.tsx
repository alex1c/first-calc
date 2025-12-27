'use client'

import { useState, useEffect } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { executeExampleCalculation, formatExampleResult } from '@/lib/calculators/example-calculator'

interface ExamplesBlockProps {
	calculator: CalculatorDefinitionClient
}

/**
 * Extract inputs from steps (e.g., "Enter radius: 5" -> { radius: 5 })
 */
function extractInputsFromSteps(steps: string[]): Record<string, string> {
	const inputs: Record<string, string> = {}
	steps.forEach((step) => {
		// Match patterns like "Enter radius: 5", "radius: 5", "Number: 100", "Percentage: 20%"
		const match = step.match(/(?:Enter|Number|Percentage|Base|Height|Length|Width|Side|Radius)\s+(\w+):\s*([\d.]+)/i) ||
			step.match(/(\w+):\s*([\d.]+)/i)
		if (match) {
			const [, key, value] = match
			const normalizedKey = key.toLowerCase()
			// Skip common non-input words
			if (!['result', 'calculation', 'formula', 'area'].includes(normalizedKey)) {
				inputs[normalizedKey] = value
			}
		}
	})
	return inputs
}

/**
 * Extract formula from steps
 */
function extractFormulaFromSteps(steps: string[]): string | null {
	const formulaStep = steps.find((step) => 
		step.toLowerCase().includes('formula:') || step.includes('=')
	)
	if (formulaStep) {
		// Extract formula part after "Formula:"
		const match = formulaStep.match(/[Ff]ormula:\s*(.+)/i) || formulaStep.match(/(.+=.*)/)
		return match ? match[1].trim() : null
	}
	return null
}

/**
 * Extract result value from resultDescription or steps
 */
function extractResultValue(resultDescription: string, steps: string[]): string | null {
	// First try to find in resultDescription
	let match = resultDescription.match(/([\d.]+(?:\s+square\s+units)?)/i)
	if (match) {
		return match[1]
	}
	
	// Then try to find in steps (e.g., "Result: Area ≈ 78.5398 square units")
	const resultStep = steps.find((step) => 
		step.toLowerCase().includes('result:') && step.match(/[\d.]+/)
	)
	if (resultStep) {
		match = resultStep.match(/([\d.]+(?:\s+square\s+units)?)/i)
		if (match) {
			return match[1]
		}
	}
	
	return null
}

/**
 * Examples block component
 * Displays calculation examples as case cards
 * For equation-solver, groups examples by type (linear/quadratic)
 */
export function ExamplesBlock({ calculator }: ExamplesBlockProps) {
	if (!calculator.examples || calculator.examples.length === 0) {
		return null
	}

	// For equation-solver, group examples by type
	if (calculator.id === 'equation-solver') {
		const linearExamples = calculator.examples.filter((ex) =>
			ex.title?.toLowerCase().includes('linear') || ex.inputDescription?.toLowerCase().includes('linear')
		)
		const quadraticExamples = calculator.examples.filter((ex) =>
			ex.title?.toLowerCase().includes('quadratic') || ex.inputDescription?.toLowerCase().includes('quadratic')
		)
		const otherExamples = calculator.examples.filter((ex) => 
			!linearExamples.includes(ex) && !quadraticExamples.includes(ex)
		)

		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">Examples</h2>
				
				{/* Linear equations section */}
				{linearExamples.length > 0 && (
					<div className="mb-8">
						<h3 className="text-xl font-semibold text-gray-800 mb-4">Examples of Linear Equations</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{linearExamples.map((example) => {
								const inputs = extractInputsFromSteps(example.steps)
								const formula = extractFormulaFromSteps(example.steps)
								const resultValue = extractResultValue(example.resultDescription, example.steps)

								return (
									<div
										key={example.id}
										className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow cursor-pointer"
										onClick={() => {
											// Extract equation text from example
											const equationMatch = example.title.match(/([\d\sx+\-=^²]+)/) || 
												example.inputDescription?.match(/([\d\sx+\-=^²]+)/)
											if (equationMatch) {
												// This would need to be handled by parent component
												// For now, just log
												console.log('Example clicked:', equationMatch[1])
											}
										}}
									>
										<h4 className="font-semibold text-gray-900 mb-3 text-base">
											{example.title}
										</h4>
										{formula && (
											<div className="mb-3">
												<p className="text-xs text-gray-500 mb-1">Equation</p>
												<p className="text-sm text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">
													{formula}
												</p>
											</div>
										)}
										<div className="pt-3 border-t border-gray-200">
											<p className="text-xs text-gray-500 mb-1">Solution</p>
											<p className="text-lg font-bold text-green-600">
												{resultValue || example.resultDescription}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}

				{/* Quadratic equations section */}
				{quadraticExamples.length > 0 && (
					<div className="mb-8">
						<h3 className="text-xl font-semibold text-gray-800 mb-4">Examples of Quadratic Equations</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{quadraticExamples.map((example) => {
								const inputs = extractInputsFromSteps(example.steps)
								const formula = extractFormulaFromSteps(example.steps)
								const resultValue = extractResultValue(example.resultDescription, example.steps)

								return (
									<div
										key={example.id}
										className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow cursor-pointer"
										onClick={() => {
											const equationMatch = example.title.match(/([\d\sx+\-=^²]+)/) || 
												example.inputDescription?.match(/([\d\sx+\-=^²]+)/)
											if (equationMatch) {
												console.log('Example clicked:', equationMatch[1])
											}
										}}
									>
										<h4 className="font-semibold text-gray-900 mb-3 text-base">
											{example.title}
										</h4>
										{formula && (
											<div className="mb-3">
												<p className="text-xs text-gray-500 mb-1">Equation</p>
												<p className="text-sm text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">
													{formula}
												</p>
											</div>
										)}
										<div className="pt-3 border-t border-gray-200">
											<p className="text-xs text-gray-500 mb-1">Solution</p>
											<p className="text-lg font-bold text-green-600">
												{resultValue || example.resultDescription}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}

				{/* Other examples */}
				{otherExamples.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{otherExamples.map((example) => {
							const inputs = extractInputsFromSteps(example.steps)
							const formula = extractFormulaFromSteps(example.steps)
							const resultValue = extractResultValue(example.resultDescription, example.steps)

							return (
								<div
									key={example.id}
									className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
								>
									<h4 className="font-semibold text-gray-900 mb-4 text-lg">
										{example.title}
									</h4>
									{Object.keys(inputs).length > 0 && (
										<div className="mb-4">
											<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
												Inputs
											</p>
											<div className="flex flex-wrap gap-2">
												{Object.entries(inputs).map(([key, value]) => (
													<span
														key={key}
														className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium"
													>
														{key}: {value}
													</span>
												))}
											</div>
										</div>
									)}
									{formula && (
										<div className="mb-4">
											<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
												Formula
											</p>
											<p className="text-sm text-gray-700 font-mono bg-gray-100 px-3 py-2 rounded">
												{formula}
											</p>
										</div>
									)}
									<div className="pt-4 border-t border-gray-200">
										<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
											Result
										</p>
										{resultValue ? (
											<div className="flex items-baseline gap-2">
												<span className="text-3xl font-bold text-blue-600">
													{resultValue}
												</span>
											</div>
										) : (
											<p className="text-sm text-gray-700">
												{example.resultDescription}
											</p>
										)}
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		)
	}

	// Enhanced examples with real calculations
	// Use enhanced display for calculators with example inputs OR for Finance/Auto calculators
	const hasExamplesWithInputs = calculator.examples.some((ex) => {
		const inputs = (ex as any).inputs
		return inputs && Object.keys(inputs).length > 0
	})
	
	// Use detailed format for Finance and Auto calculators, or if examples have inputs
	const useDetailedFormat = calculator.category === 'finance' || calculator.category === 'auto' || hasExamplesWithInputs

	if (useDetailedFormat) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">Calculation Examples</h2>
				<div className="space-y-6">
					{calculator.examples.map((example) => {
						const exampleInputs = (example as any).inputs || {}
						const fallbackResultText = (example as any).result || example.resultDescription || ''

						return (
							<ExampleCardWithCalculation
								key={example.id || example.title}
								example={example}
								calculator={calculator}
								exampleInputs={exampleInputs}
								fallbackResultText={fallbackResultText}
							/>
						)
					})}
				</div>
			</div>
		)
	}

	// Default layout for Math calculators (compact format)
	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
			<h2 className="text-2xl font-semibold text-gray-900 mb-6">Examples</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{calculator.examples.map((example) => {
					const inputs = extractInputsFromSteps(example.steps || [])
					const formula = extractFormulaFromSteps(example.steps || [])
					// Support both 'result' and 'resultDescription' fields
					const resultText = (example as any).result || example.resultDescription || ''
					const resultValue = extractResultValue(resultText, example.steps || [])

					return (
						<div
							key={example.id}
							className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
						>
							{/* Title with parameters */}
							<h3 className="font-semibold text-gray-900 mb-4 text-lg">
								{example.title}
							</h3>

							{/* Inputs (brief) */}
							{Object.keys(inputs).length > 0 && (
								<div className="mb-4">
									<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
										Inputs
									</p>
									<div className="flex flex-wrap gap-2">
										{Object.entries(inputs).map(([key, value]) => (
											<span
												key={key}
												className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium"
											>
												{key}: {value}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Formula */}
							{formula && (
								<div className="mb-4">
									<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
										Formula
									</p>
									<p className="text-sm text-gray-700 font-mono bg-gray-100 px-3 py-2 rounded">
										{formula}
									</p>
								</div>
							)}

							{/* Result (visually highlighted) */}
							<div className="pt-4 border-t border-gray-200">
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
									Result
								</p>
								{resultValue ? (
									<div className="flex items-baseline gap-2">
										<span className="text-3xl font-bold text-blue-600">
											{resultValue}
										</span>
									</div>
								) : (
									<p className="text-sm text-gray-700 whitespace-pre-wrap">
										{resultText}
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

/**
 * Example Card Component with Real Calculation
 * Executes the calculator's calculation function for example inputs
 */
function ExampleCardWithCalculation({
	example,
	calculator,
	exampleInputs,
	fallbackResultText,
}: {
	example: any
	calculator: CalculatorDefinitionClient
	exampleInputs: Record<string, number | string>
	fallbackResultText: string
}) {
	const [calculatedResults, setCalculatedResults] = useState<Record<string, number | string | null> | null>(null)
	const [isCalculating, setIsCalculating] = useState(false)
	const [calculationError, setCalculationError] = useState<string | null>(null)
	const hasInputs = Object.keys(exampleInputs).length > 0

	// Execute calculation when component mounts
	useEffect(() => {
		if (hasInputs && 'calculate' in calculator && calculator.calculate) {
			setIsCalculating(true)
			setCalculationError(null)

			const executeCalc = async () => {
				try {
					const results = await executeExampleCalculation(calculator, exampleInputs)
					if (results) {
						console.log(`Example calculation results for ${calculator.id}:`, results)
						setCalculatedResults(results)
					} else {
						console.warn(`No results returned for ${calculator.id} example`)
						setCalculatedResults(null)
					}
				} catch (error) {
					console.error(`Calculation error for ${calculator.id}:`, error)
					setCalculationError(error instanceof Error ? error.message : 'Calculation failed')
					setCalculatedResults(null)
				} finally {
					setIsCalculating(false)
				}
			}

			executeCalc()
		}
	}, [hasInputs, calculator, exampleInputs])

	// Get input labels
	const getInputLabel = (inputName: string): string => {
		const inputDef = calculator.inputs.find((inp) => inp.name === inputName)
		return inputDef?.label || inputName.replace(/([A-Z])/g, ' $1').trim()
	}

	// Get output labels
	const getOutputLabel = (outputName: string): string => {
		const outputDef = calculator.outputs.find((out) => out.name === outputName)
		return outputDef?.label || outputName.replace(/([A-Z])/g, ' $1').trim()
	}

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
											: value || (isOptional ? '(optional)' : '')}
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
						<div className="text-sm text-red-600 mb-2">Error: {calculationError}</div>
					) : calculatedResults ? (
						<div className="space-y-2">
							{calculator.outputs.map((output) => {
								const value = calculatedResults[output.name]
								// Skip only if value is explicitly null/undefined AND it's not a valid zero
								if (value === null || value === undefined) {
									// Check if this is a required output - if so, show N/A
									return null
								}

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
							{/* Show message if no results were displayed */}
							{calculator.outputs.every((output) => {
								const value = calculatedResults[output.name]
								return value === null || value === undefined
							}) && (
								<div className="text-sm text-gray-500 italic">
									No results available. Showing fallback result below.
								</div>
							)}
						</div>
					) : (
						<div className="text-sm text-gray-500 italic mb-2">
							Calculation not available. Showing fallback result below.
						</div>
					)}
					{/* Always show fallback if calculation failed, no results, or all results are null */}
					{((!calculatedResults || calculationError || 
						(calculatedResults && calculator.outputs.every((output) => {
							const value = calculatedResults[output.name]
							return value === null || value === undefined
						}))
					)) && fallbackResultText && (
						<div className="mt-3 pt-3 border-t border-gray-200">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
								Expected Result
							</p>
							<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
								<pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
									{fallbackResultText}
								</pre>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Fallback: Text-based result description */}
			{!hasInputs && fallbackResultText && (
				<div className="pt-4 border-t border-gray-200">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
						Result
					</p>
					<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
							{fallbackResultText}
						</pre>
					</div>
				</div>
			)}
		</div>
	)
}




