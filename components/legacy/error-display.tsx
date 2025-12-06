import Link from 'next/link'

interface ErrorDisplayProps {
	error: string
	locale: string
	examples?: Array<{ href: string; label: string }>
}

/**
 * Error display component for legacy pages
 */
export function ErrorDisplay({ error, locale, examples }: ErrorDisplayProps) {
	return (
		<div className="bg-red-50 border border-red-200 rounded-lg p-6">
			<div className="flex items-start">
				<div className="flex-shrink-0">
					<svg
						className="h-5 w-5 text-red-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-red-800">Error</h3>
					<div className="mt-2 text-sm text-red-700">
						<p>{error}</p>
					</div>
					{examples && examples.length > 0 && (
						<div className="mt-4">
							<p className="text-sm font-medium text-red-800 mb-2">
								Valid examples:
							</p>
							<ul className="list-disc list-inside space-y-1">
								{examples.map((example, index) => (
									<li key={index}>
										<Link
											href={`/${locale}${example.href}`}
											className="text-blue-600 hover:text-blue-800 underline"
										>
											{example.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
