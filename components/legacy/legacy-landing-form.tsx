'use client'

/**
 * Form component for legacy tool landing pages
 * Generates links to the tool's [...slug] route
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

interface LegacyLandingFormProps {
	locale: Locale
	toolSlug: string
	inputLabel: string
	inputPlaceholder: string
	inputType?: 'number' | 'text'
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Legacy landing form component
 * Allows users to enter a value and navigate to the tool's result page
 */
export function LegacyLandingForm({
	locale,
	toolSlug,
	inputLabel,
	inputPlaceholder,
	inputType = 'number',
	exampleLinks = [],
}: LegacyLandingFormProps) {
	const router = useRouter()
	const [value, setValue] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (!value.trim()) {
			setError('Please enter a value')
			return
		}

		// Build the URL path
		const basePath = locale === 'en' ? '' : `/${locale}`
		const url = `${basePath}/${toolSlug}/${encodeURIComponent(value.trim())}`

		// Navigate to the result page
		router.push(url)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="input-value"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{inputLabel}
					</label>
					<input
						type={inputType}
						id="input-value"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setError('')
						}}
						placeholder={inputPlaceholder}
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
							error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
						}`}
					/>
					{error && (
						<p className="mt-2 text-sm text-red-600">{error}</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
				>
					Convert
				</button>
			</form>

			{exampleLinks.length > 0 && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-3">
						Example links:
					</p>
					<ul className="space-y-2">
						{exampleLinks.map((link, index) => {
							const basePath = locale === 'en' ? '' : `/${locale}`
							const fullHref = `${basePath}${link.href}`
							return (
								<li key={index}>
									<a
										href={fullHref}
										className="text-blue-600 hover:text-blue-800 underline text-sm"
									>
										{link.label}
									</a>
								</li>
							)
						})}
					</ul>
				</div>
			)}
		</div>
	)
}

