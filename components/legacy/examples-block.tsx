import type { Example } from '@/lib/legacy/contentGenerators'
import Link from 'next/link'

interface LegacyExamplesBlockProps {
	examples: Example[]
	locale: string
}

/**
 * Examples block component for legacy pages
 */
export function LegacyExamplesBlock({
	examples,
	locale,
}: LegacyExamplesBlockProps) {
	if (!examples || examples.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h2>
			<div className="space-y-4">
				{examples.map((example, index) => (
					<div
						key={index}
						className="border border-gray-200 rounded-lg p-4 bg-gray-50"
					>
						<h3 className="font-semibold text-gray-900 mb-2">{example.title}</h3>
						{example.description && (
							<p className="text-sm text-gray-600 mb-2">{example.description}</p>
						)}
						<div className="space-y-1">
							<p className="text-sm">
								<span className="font-medium text-gray-700">Input:</span>{' '}
								<Link
									href={`/${locale}${example.input}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{example.input}
								</Link>
							</p>
							<p className="text-sm">
								<span className="font-medium text-gray-700">Output:</span>{' '}
								<span className="text-gray-900">{example.output}</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}




