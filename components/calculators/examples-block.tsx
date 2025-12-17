import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface ExamplesBlockProps {
	calculator: CalculatorDefinitionClient
}

/**
 * Examples block component
 * Displays calculation examples with step-by-step explanations
 */
export function ExamplesBlock({ calculator }: ExamplesBlockProps) {
	if (!calculator.examples || calculator.examples.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h2>
			<div className="space-y-6">
				{calculator.examples.map((example) => (
					<div
						key={example.id}
						className="border border-gray-200 rounded-lg p-4 bg-gray-50"
					>
						<h3 className="font-semibold text-gray-900 mb-2">{example.title}</h3>
						<p className="text-sm text-gray-600 mb-3">
							{example.inputDescription}
						</p>
						<ol className="space-y-2 mb-3">
							{example.steps.map((step, index) => (
								<li key={index} className="flex items-start">
									<span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
										{index + 1}
									</span>
									<span className="text-sm text-gray-700">{step}</span>
								</li>
							))}
						</ol>
						<div className="mt-3 pt-3 border-t border-gray-200">
							<p className="text-sm font-medium text-gray-900">
								Result: <span className="text-blue-600">{example.resultDescription}</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}




