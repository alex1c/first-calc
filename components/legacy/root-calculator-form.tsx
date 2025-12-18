'use client'

/**
 * Root calculator form with all root types
 * Supports: square root, cube root, and any nth root
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { useClientT } from '@/lib/i18n/useClientT'

interface RootCalculatorFormProps {
	locale: Locale
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Root calculator form component
 * Allows users to calculate roots of any degree with validation
 */
export function RootCalculatorForm({
	locale,
	exampleLinks = [],
}: RootCalculatorFormProps) {
	const router = useRouter()
	const t = useClientT(locale, ['legacy/ui', 'errors'])
	const [number, setNumber] = useState('')
	const [degree, setDegree] = useState('2')
	const [errors, setErrors] = useState<{ number?: string; degree?: string }>({})

	const validateInput = (): boolean => {
		const newErrors: { number?: string; degree?: string } = {}

		// Validate number
		if (!number.trim()) {
			newErrors.number = t('errors.validation.enterNumber')
		} else {
			const numValue = parseFloat(number.trim())
			if (isNaN(numValue) || !Number.isFinite(numValue)) {
				newErrors.number = t('errors.validation.enterValidNumber')
			} else if (numValue < 0 && parseFloat(degree) % 2 === 0) {
				// Even roots of negative numbers are not real
				newErrors.number = t('errors.validation.evenRootNegative')
			}
		}

		// Validate degree
		if (!degree.trim()) {
			newErrors.degree = t('errors.validation.enterRootDegree')
		} else {
			const numDegree = parseInt(degree.trim(), 10)
			if (isNaN(numDegree) || !Number.isFinite(numDegree)) {
				newErrors.degree = t('errors.validation.enterValidDegree')
			} else if (numDegree < 2 || numDegree > 100) {
				newErrors.degree = t('errors.validation.degreeRange')
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateInput()) {
			return
		}

		// Build the URL path
		const basePath = locale === 'en' ? '' : `/${locale}`
		const url = `${basePath}/root-calculator/${encodeURIComponent(number.trim())}/${encodeURIComponent(degree.trim())}`

		// Navigate to the result page
		router.push(url)
	}

	const getRootSymbol = (deg: string): string => {
		const d = parseInt(deg, 10)
		if (d === 2) return '√'
		if (d === 3) return '∛'
		return `⁽${d}⁾√`
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Number input */}
				<div>
					<label
						htmlFor="input-number"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{t('legacy/ui.form.rootCalculator.number')}
					</label>
					<input
						type="number"
						id="input-number"
						value={number}
						onChange={(e) => {
							setNumber(e.target.value)
							setErrors((prev) => ({ ...prev, number: undefined }))
						}}
						placeholder={t('legacy/ui.form.rootCalculator.numberPlaceholder')}
						step="any"
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
							errors.number ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
						}`}
					/>
					{errors.number && (
						<p className="mt-2 text-sm text-red-600">{errors.number}</p>
					)}
				</div>

				{/* Degree input */}
				<div>
					<label
						htmlFor="input-degree"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{t('legacy/ui.form.rootCalculator.rootDegree')}
					</label>
					<div className="flex gap-2 mb-2">
						{/* Quick buttons for common roots */}
						<button
							type="button"
							onClick={() => {
								setDegree('2')
								setErrors((prev) => ({ ...prev, degree: undefined }))
							}}
							className={`px-3 py-1 text-sm rounded-md border transition-colors ${
								degree === '2'
									? 'bg-blue-100 border-blue-500 text-blue-700'
									: 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
							}`}
						>
							√ {t('legacy/ui.form.rootCalculator.square')}
						</button>
						<button
							type="button"
							onClick={() => {
								setDegree('3')
								setErrors((prev) => ({ ...prev, degree: undefined }))
							}}
							className={`px-3 py-1 text-sm rounded-md border transition-colors ${
								degree === '3'
									? 'bg-blue-100 border-blue-500 text-blue-700'
									: 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
							}`}
						>
							∛ {t('legacy/ui.form.rootCalculator.cube')}
						</button>
						<button
							type="button"
							onClick={() => {
								setDegree('4')
								setErrors((prev) => ({ ...prev, degree: undefined }))
							}}
							className={`px-3 py-1 text-sm rounded-md border transition-colors ${
								degree === '4'
									? 'bg-blue-100 border-blue-500 text-blue-700'
									: 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
							}`}
						>
							⁽⁴⁾√ 4th
						</button>
					</div>
					<input
						type="number"
						id="input-degree"
						value={degree}
						onChange={(e) => {
							setDegree(e.target.value)
							setErrors((prev) => ({ ...prev, degree: undefined }))
						}}
						placeholder={t('legacy/ui.form.rootCalculator.degreePlaceholder')}
						min="2"
						max="100"
						step="1"
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
							errors.degree ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
						}`}
					/>
					{errors.degree && (
						<p className="mt-2 text-sm text-red-600">{errors.degree}</p>
					)}
					<p className="mt-1 text-xs text-gray-500">
						{t('legacy/ui.form.rootCalculator.degreeRange')}
					</p>
				</div>

				{/* Preview */}
				{number && degree && !errors.number && !errors.degree && (
					<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
						<p className="text-sm text-blue-800">
							<strong>
								{t('legacy/ui.form.rootCalculator.calculating')}
							</strong>{' '}
							{getRootSymbol(degree)}
							{number} = ?
						</p>
					</div>
				)}

				{/* Help text */}
				<div className="bg-gray-50 border border-gray-200 rounded-md p-3">
					<p className="text-sm text-gray-700 mb-2">
						<strong>
							{t('legacy/ui.form.rootCalculator.examples')}
						</strong>
					</p>
					<ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
						<li>{t('legacy/ui.form.rootCalculator.example1')}</li>
						<li>{t('legacy/ui.form.rootCalculator.example2')}</li>
						<li>{t('legacy/ui.form.rootCalculator.example3')}</li>
					</ul>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
				>
					{t('legacy/ui.form.rootCalculator.calculate')}
				</button>
			</form>

			{exampleLinks.length > 0 && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-3">
						{t('legacy/ui.form.common.exampleLinks')}
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

