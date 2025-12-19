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

	// Find main result (usually "area", "volume", "perimeter", "percentageChange", "roots", "result", "value", "mean", "standardDeviation", or first output)
	const mainOutput = calculator.outputs.find((out) => 
		out.name === 'area' || out.name === 'volume' || out.name === 'perimeter' || out.name === 'percentageChange' || out.name === 'roots' || out.name === 'result' || out.name === 'value' || out.name === 'mean' || out.name === 'standardDeviation'
	) || calculator.outputs[0]

	// Find formula output
	const formulaOutput = calculator.outputs.find((out) => 
		out.name === 'formula'
	)

	// Find explanation output (for pythagorean calculator)
	const explanationOutput = calculator.outputs.find((out) => 
		out.name === 'explanation'
	)

	// Find direction output (for percentage change calculator)
	const directionOutput = calculator.outputs.find((out) => 
		out.name === 'direction'
	)
	const directionValue = directionOutput ? outputs[directionOutput.name] : null

	// Find discriminant output (for quadratic calculator)
	const discriminantOutput = calculator.outputs.find((out) => 
		out.name === 'discriminant'
	)
	const discriminantValue = discriminantOutput ? outputs[discriminantOutput.name] : null

	// Find steps output (for equation solver)
	const stepsOutput = calculator.outputs.find((out) => 
		out.name === 'steps'
	)
	const stepsValue = stepsOutput ? outputs[stepsOutput.name] : null

	// Find normalized form output (for equation solver)
	const normalizedFormOutput = calculator.outputs.find((out) => 
		out.name === 'normalizedForm'
	)
	const normalizedFormValue = normalizedFormOutput ? outputs[normalizedFormOutput.name] : null

	// Find roots output (for equation solver and quadratic calculator)
	const rootsOutput = calculator.outputs.find((out) => 
		out.name === 'roots'
	)
	const rootsValue = rootsOutput ? outputs[rootsOutput.name] : null

	// Find sortedData output (for descriptive statistics)
	const sortedDataOutput = calculator.outputs.find((out) => 
		out.name === 'sortedData'
	)
	const sortedDataValue = sortedDataOutput ? outputs[sortedDataOutput.name] : null

	// Other outputs (excluding main, formula, explanation, direction, discriminant, steps, normalizedForm, roots, sortedData, and shapeName)
	const otherOutputs = calculator.outputs.filter((out) => 
		out.name !== mainOutput?.name && out.name !== 'formula' && out.name !== 'explanation' && out.name !== 'direction' && out.name !== 'discriminant' && out.name !== 'steps' && out.name !== 'normalizedForm' && out.name !== 'roots' && out.name !== 'sortedData' && out.name !== 'shapeName'
	)

	const mainValue = mainOutput ? outputs[mainOutput.name] : null
	// Format different output types
	let formattedMainValue = null
	if (mainValue !== null && mainOutput) {
		if (mainOutput.name === 'result' && calculator.id === 'equation-solver') {
			// Format result for equation solver (can be string or number)
			if (typeof mainValue === 'string') {
				formattedMainValue = mainValue
			} else if (typeof mainValue === 'number') {
				formattedMainValue = `x = ${mainValue.toFixed(6)}`
			} else if (Array.isArray(mainValue)) {
				// Array of roots
				if (mainValue.length === 0) {
					formattedMainValue = 'No real roots'
				} else {
					formattedMainValue = mainValue.map((r: number) => `x = ${r.toFixed(6)}`).join(', ')
				}
			} else {
				formattedMainValue = String(mainValue)
			}
		} else if (mainOutput.name === 'roots') {
			// Format roots array for quadratic calculator
			if (Array.isArray(mainValue)) {
				if (mainValue.length === 0) {
					formattedMainValue = 'No real roots'
				} else if (mainValue.length === 1 && typeof mainValue[0] === 'string') {
					formattedMainValue = mainValue[0]
				} else {
					formattedMainValue = mainValue.map((r: number) => r.toFixed(6)).join(', ')
				}
			} else if (typeof mainValue === 'string') {
				formattedMainValue = mainValue
			} else {
				formattedMainValue = String(mainValue)
			}
		} else if (mainOutput.name === 'percentageChange') {
			const numValue = Number(mainValue)
			const sign = numValue >= 0 ? '+' : ''
			formattedMainValue = `${sign}${numValue.toFixed(6)}%`
		} else {
			formattedMainValue = formatOutputValue(
				mainValue,
				mainOutput.formatType,
				mainOutput.unitLabel,
			)
		}
	}

	const formulaValue = formulaOutput ? outputs[formulaOutput.name] : null
	const explanationValue = explanationOutput ? outputs[explanationOutput.name] : null

	return (
		<div className="h-full">
			{/* Main Result */}
			{formattedMainValue && (
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
						{mainOutput.label || 'Result'}
					</label>
					{/* Special formatting for equation solver result */}
					{calculator.id === 'equation-solver' ? (
						<div className={`text-3xl md:text-4xl font-bold mb-2 ${
							typeof formattedMainValue === 'string' && (
								formattedMainValue.includes('no solutions') || formattedMainValue.includes('no real roots')
							)
								? 'text-red-600'
								: typeof formattedMainValue === 'string' && formattedMainValue.includes('infinite solutions')
								? 'text-orange-600'
								: 'text-green-600'
						}`}>
							{formattedMainValue}
						</div>
					) : (
						<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
							{formattedMainValue}
						</div>
					)}
					{/* Direction badge (for percentage change) */}
					{directionValue && typeof directionValue === 'string' && (
						<div className="mt-3">
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
								directionValue === 'Increase' 
									? 'bg-green-100 text-green-800' 
									: directionValue === 'Decrease'
									? 'bg-red-100 text-red-800'
									: 'bg-gray-100 text-gray-800'
							}`}>
								{directionValue}
							</span>
						</div>
					)}
					{mainOutput.unitLabel && !directionValue && calculator.id !== 'equation-solver' && (
						<p className="text-sm text-gray-500">{mainOutput.unitLabel}</p>
					)}
				</div>
			)}

			{/* Discriminant (for quadratic calculator) */}
			{discriminantValue !== null && discriminantValue !== undefined && (
				<div className="mb-4">
					<p className="text-sm text-gray-500 mb-1">Discriminant</p>
					<p className="text-lg font-semibold text-gray-900">
						D = {Number(discriminantValue).toFixed(6)}
					</p>
				</div>
			)}

			{/* Roots (for quadratic calculator and equation solver) */}
			{rootsValue !== null && rootsValue !== undefined && (
				<div className="mb-4">
					<p className="text-sm text-gray-500 mb-1">Roots</p>
					<p className="text-lg font-semibold text-gray-900">
						{Array.isArray(rootsValue) ? (
							rootsValue.length === 0 ? (
								'No real roots'
							) : (
								rootsValue.map((r: number, idx: number) => {
									if (typeof r === 'number' && !isNaN(r)) {
										return <span key={idx}>{idx > 0 && ', '}x = {r.toFixed(6)}</span>
									}
									return null
								})
							)
						) : typeof rootsValue === 'string' ? (
							rootsValue
						) : (
							'No real roots'
						)}
					</p>
				</div>
			)}

			{/* Formula (secondary text) */}
			{formulaValue && typeof formulaValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Formula</p>
					<p className="text-base text-gray-600 font-mono whitespace-pre-line">{formulaValue}</p>
				</div>
			)}

			{/* Normalized form (for equation solver) */}
			{normalizedFormValue && typeof normalizedFormValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Normalized Form</p>
					<p className="text-base text-gray-700 font-mono">{normalizedFormValue}</p>
				</div>
			)}

			{/* Steps (for equation solver) */}
			{stepsValue && Array.isArray(stepsValue) && stepsValue.length > 0 && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-4">Solution Steps</p>
					<div className="space-y-4">
						{stepsValue.map((step: any, index: number) => (
							<div key={index} className="bg-gray-50 rounded-lg p-4">
								<p className="text-sm font-semibold text-gray-900 mb-2">
									{step.title || `Step ${index + 1}`}
								</p>
								{step.math && (
									<p className="text-base text-gray-800 font-mono whitespace-pre-line mb-2">
										{step.math}
									</p>
								)}
								{step.explanation && (
									<p className="text-sm text-gray-600 leading-relaxed">
										{step.explanation}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Explanation (for pythagorean calculator) */}
			{explanationValue && typeof explanationValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Explanation</p>
					<p className="text-base text-gray-700 leading-relaxed">{explanationValue}</p>
				</div>
			)}

			{/* Statistics table (for descriptive statistics, average, and standard deviation calculators) */}
			{(calculator.id === 'descriptive-statistics-calculator' || calculator.id === 'average-calculator' || calculator.id === 'standard-deviation-calculator') && otherOutputs.length > 0 && (
				<div className="pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-4">Statistics</p>
					<div className="bg-gray-50 rounded-lg overflow-hidden">
						<table className="w-full">
							<tbody className="divide-y divide-gray-200">
								{otherOutputs.map((output) => {
									const value = outputs[output.name]
									if (value === null || value === undefined) return null
									
									// Special handling for mode (can be string "No mode" or array)
									let displayValue: string
									if (output.name === 'mode') {
										if (typeof value === 'string') {
											displayValue = value
										} else if (Array.isArray(value)) {
											displayValue = value.length > 0 ? value.join(', ') : 'No mode'
										} else {
											displayValue = String(value)
										}
									} else {
										displayValue = formatOutputValue(
											value,
											output.formatType,
											output.unitLabel,
										)
									}

									// Highlight important statistics
									const isImportant = output.name === 'mean' || output.name === 'median' || output.name === 'standardDeviation'
									
									// For average calculator, all outputs are important
									const isAverageCalc = calculator.id === 'average-calculator'
									
									// For standard deviation calculator, standardDeviation is most important
									const isStdDevCalc = calculator.id === 'standard-deviation-calculator'
									const isStdDevImportant = isStdDevCalc && output.name === 'standardDeviation'

									return (
										<tr key={output.name} className={(isImportant || isAverageCalc || isStdDevImportant) ? 'bg-blue-50' : ''}>
											<td className="px-4 py-3 text-sm font-medium text-gray-700">
												{output.label}
											</td>
											<td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
												{displayValue}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
					{/* Sorted data */}
					{sortedDataValue && Array.isArray(sortedDataValue) && sortedDataValue.length > 0 && (
						<div className="mt-4">
							<p className="text-sm font-medium text-gray-700 mb-2">Sorted Data (Ascending)</p>
							<div className="bg-gray-50 rounded-lg p-3">
								<p className="text-sm text-gray-800 font-mono">
									{sortedDataValue.map((n: number, idx: number) => (
										<span key={idx}>
											{idx > 0 && ', '}
											{n.toFixed(6).replace(/\.?0+$/, '')}
										</span>
									))}
								</p>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Other outputs (if any, for non-statistics calculators) */}
			{calculator.id !== 'descriptive-statistics-calculator' && calculator.id !== 'average-calculator' && calculator.id !== 'standard-deviation-calculator' && otherOutputs.length > 0 && (
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




