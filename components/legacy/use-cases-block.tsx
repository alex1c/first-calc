/**
 * Use cases block component for legacy pages
 */

interface UseCasesBlockProps {
	useCases: string[]
	locale: string
}

export function UseCasesBlock({ useCases, locale }: UseCasesBlockProps) {
	if (!useCases || useCases.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{locale === 'ru' ? 'Применение' : 'Use Cases'}
			</h2>
			<ul className="space-y-3">
				{useCases.map((useCase, index) => (
					<li key={index} className="flex items-start">
						<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
							{index + 1}
						</span>
						<span className="text-gray-700">{useCase}</span>
					</li>
				))}
			</ul>
		</div>
	)
}





