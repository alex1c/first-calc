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
	if (!outputs || Object.keys(outputs).length === 0) {
		return null
	}

	// Find main result (usually "area", "volume", "perimeter", "result", or first output)
	const mainOutput = calculator.outputs.find((out) => 
		out.name === 'area' || out.name === 'volume' || out.name === 'perimeter' || out.name === 'result' || out.name === 'value'
	) || calculator.outputs[0]

	// Find formula output
	const formulaOutput = calculator.outputs.find((out) => 
		out.name === 'formula'
	)

	// Other outputs (excluding main and formula)
	const otherOutputs = calculator.outputs.filter((out) => 
		out.name !== mainOutput?.name && out.name !== 'formula' && out.name !== 'shapeName'
	)

	const mainValue = mainOutput ? outputs[mainOutput.name] : null
	const formattedMainValue = mainValue ? formatOutputValue(
		mainValue,
		mainOutput.formatType,
		mainOutput.unitLabel,
	) : null

	const formulaValue = formulaOutput ? outputs[formulaOutput.name] : null

	return (
		<div className="h-full">
			{/* Main Result */}
			{formattedMainValue && (
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
						{mainOutput.label || 'Result'}
					</label>
					<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
						{formattedMainValue}
					</div>
					{mainOutput.unitLabel && (
						<p className="text-sm text-gray-500">{mainOutput.unitLabel}</p>
					)}
				</div>
			)}

			{/* Formula (secondary text) */}
			{formulaValue && typeof formulaValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Formula</p>
					<p className="text-base text-gray-600 font-mono">{formulaValue}</p>
				</div>
			)}

			{/* Other outputs (if any) */}
			{otherOutputs.length > 0 && (
				<div className="space-y-3 pt-4 border-t border-gray-200">
					{otherOutputs.map((output) => {
						const value = outputs[output.name]
						if (value === null || value === undefined) return null
						
						const formattedValue = formatOutputValue(
							value,
							output.formatType,
							output.unitLabel,
						)

						return (
							<div
								key={output.name}
								className="flex items-center justify-between py-2"
							>
								<span className="text-sm text-gray-600">
									{output.label}
								</span>
								<span className="text-lg font-semibold text-gray-900">
									{formattedValue}
								</span>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}




