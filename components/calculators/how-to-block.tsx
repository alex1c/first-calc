import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface HowToBlockProps {
	calculator: CalculatorDefinitionClient
	howToLabel?: string
}

/**
 * How to calculate block component
 * Displays step-by-step instructions
 */
export function HowToBlock({
	calculator,
	howToLabel = 'How to Calculate',
}: HowToBlockProps) {
	if (!calculator.howToBullets || calculator.howToBullets.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{howToLabel}
			</h2>
			<ul className="space-y-3">
				{calculator.howToBullets.map((bullet, index) => (
					<li key={index} className="flex items-start">
						<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
							{index + 1}
						</span>
						<span className="text-gray-700">{bullet}</span>
					</li>
				))}
			</ul>
		</div>
	)
}




