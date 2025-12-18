import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

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
 */
export function ExamplesBlock({ calculator }: ExamplesBlockProps) {
	if (!calculator.examples || calculator.examples.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
			<h2 className="text-2xl font-semibold text-gray-900 mb-6">Examples</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{calculator.examples.map((example) => {
					const inputs = extractInputsFromSteps(example.steps)
					const formula = extractFormulaFromSteps(example.steps)
					const resultValue = extractResultValue(example.resultDescription, example.steps)

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
									<p className="text-sm text-gray-700">
										{example.resultDescription}
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




