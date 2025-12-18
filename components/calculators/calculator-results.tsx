import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { formatOutputValue } from '@/lib/calculators/format'

interface CalculatorResultsProps {
	calculator: CalculatorDefinitionClient
	outputs: Record<string, number | string | null>
}

/**
 * Calculator results component
 * Displays calculation results in a clean format
 */
export function CalculatorResults({
	calculator,
	outputs,
}: CalculatorResultsProps) {
	if (Object.keys(outputs).length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-6">
				{/* Results label - will be passed via props or use i18n context */}
				Results
			</h2>
			<div className="space-y-4">
				{calculator.outputs.map((output) => {
					const value = outputs[output.name]
					const formattedValue = formatOutputValue(
						value,
						output.formatType,
						output.unitLabel,
					)

					return (
						<div
							key={output.name}
							className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
						>
							<span className="text-gray-700 font-medium">
								{output.label}
								{output.unitLabel && (
									<span className="text-gray-500 ml-1">
										({output.unitLabel})
									</span>
								)}
							</span>
							<span className="text-2xl font-bold text-blue-600">
								{formattedValue}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}




