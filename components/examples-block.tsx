import type { Example } from '@/lib/calculator-types'

interface ExamplesBlockProps {
	examples: Example[]
	calculatorInputs?: Array<{ name: string; label: string; units?: string }>
	calculatorOutputs?: Array<{ name: string; label: string; units?: string }>
}

export function ExamplesBlock({
	examples,
	calculatorInputs = [],
	calculatorOutputs = [],
}: ExamplesBlockProps) {
	if (!examples || examples.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h2>
			<div className="space-y-6">
				{examples.map((example, index) => (
					<div
						key={index}
						className="border border-gray-200 rounded-lg p-4 bg-gray-50"
					>
						{/* Input description */}
						{example.inputDescription && (
							<p className="font-medium text-gray-900 mb-3">
								{example.inputDescription}
							</p>
						)}

						{/* Legacy support: show inputs/outputs if provided */}
						{example.inputs && Object.keys(example.inputs).length > 0 && (
							<div className="mb-3">
								<p className="text-sm font-medium text-gray-500 mb-2">
									Inputs:
								</p>
								<ul className="space-y-1">
									{Object.entries(example.inputs).map(([key, value]) => {
										const inputDef = calculatorInputs.find(
											(inp) => inp.name === key,
										)
										return (
											<li key={key} className="text-sm text-gray-700">
												{inputDef?.label || key}:{' '}
												<span className="font-medium">{value}</span>
												{inputDef?.units && ` ${inputDef.units}`}
											</li>
										)
									})}
								</ul>
							</div>
						)}

						{/* Steps */}
						{example.steps && example.steps.length > 0 && (
							<div className="mb-3">
								<p className="text-sm font-medium text-gray-500 mb-2">
									Calculation steps:
								</p>
								<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
									{example.steps.map((step, stepIndex) => (
										<li key={stepIndex}>{step}</li>
									))}
								</ol>
							</div>
						)}

						{/* Result */}
						<div className="mt-3 pt-3 border-t border-gray-200">
							<p className="text-sm font-medium text-gray-500 mb-1">
								Result:
							</p>
							<p className="text-lg font-semibold text-blue-600">
								{typeof example.result === 'string'
									? example.result
									: String(example.result)}
							</p>
						</div>

						{/* Legacy support: show outputs if provided */}
						{example.outputs && Object.keys(example.outputs).length > 0 && (
							<div className="mt-3 pt-3 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-500 mb-2">
									Outputs:
								</p>
								<ul className="space-y-1">
									{Object.entries(example.outputs).map(([key, value]) => {
										const outputDef = calculatorOutputs.find(
											(out) => out.name === key,
										)
										return (
											<li key={key} className="text-sm text-gray-700">
												{outputDef?.label || key}:{' '}
												<span className="font-medium">{String(value)}</span>
												{outputDef?.units && ` ${outputDef.units}`}
											</li>
										)
									})}
								</ul>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}








