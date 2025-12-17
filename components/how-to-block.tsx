interface HowToBlockProps {
	title?: string
	steps: string[]
	locale?: string
}

export function HowToBlock({ title, steps, locale = 'en' }: HowToBlockProps) {
	if (!steps || steps.length === 0) {
		return null
	}

	const defaultTitle = locale === 'ru' ? 'Как рассчитать?' : 'How to calculate?'

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{title || defaultTitle}
			</h2>
			<ul className="space-y-3">
				{steps.map((step, index) => (
					<li key={index} className="flex items-start">
						<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
							{index + 1}
						</span>
						<span className="text-gray-700 flex-1">{step}</span>
					</li>
				))}
			</ul>
		</div>
	)
}




