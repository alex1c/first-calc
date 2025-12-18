'use client'

/**
 * Bidirectional Roman numerals converter form
 * Supports conversion from Arabic to Roman and vice versa
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { useClientT } from '@/lib/i18n/useClientT'

interface RomanNumeralsFormProps {
	locale: Locale
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Roman numerals converter form component
 * Allows users to enter either Arabic number or Roman numeral and navigate to result
 */
export function RomanNumeralsForm({
	locale,
	exampleLinks = [],
}: RomanNumeralsFormProps) {
	const router = useRouter()
	const t = useClientT(locale, ['legacy/ui', 'errors'])
	const [inputType, setInputType] = useState<'arabic' | 'roman'>('arabic')
	const [value, setValue] = useState('')
	const [error, setError] = useState('')

	const validateInput = (): boolean => {
		setError('')

		if (!value.trim()) {
			setError(t('errors.validation.enterValue'))
			return false
		}

		if (inputType === 'arabic') {
			const num = parseInt(value.trim(), 10)
			if (isNaN(num) || num < 1 || num > 3999) {
				setError(t('errors.validation.numberRangeRoman'))
				return false
			}
		} else {
			// Roman numeral validation (basic check)
			const roman = value.trim().toUpperCase()
			if (!/^[IVXLCDM]+$/.test(roman)) {
				setError(t('errors.validation.romanCharacters'))
				return false
			}
		}

		return true
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateInput()) {
			return
		}

		// Build the URL path
		const basePath = locale === 'en' ? '' : `/${locale}`
		// Normalize Roman numerals to uppercase before encoding
		const normalizedValue = inputType === 'roman' 
			? value.trim().toUpperCase() 
			: value.trim()
		const url = `${basePath}/roman-numerals-converter/${encodeURIComponent(normalizedValue)}`

		// Navigate to the result page
		router.push(url)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Input type selector */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t('legacy/ui.form.romanNumerals.inputType')}
					</label>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="radio"
								name="inputType"
								value="arabic"
								checked={inputType === 'arabic'}
								onChange={() => {
									setInputType('arabic')
									setValue('')
									setError('')
								}}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">
								{t('legacy/ui.form.romanNumerals.arabicNumber')}
							</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="inputType"
								value="roman"
								checked={inputType === 'roman'}
								onChange={() => {
									setInputType('roman')
									setValue('')
									setError('')
								}}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">
								{t('legacy/ui.form.romanNumerals.romanNumeral')}
							</span>
						</label>
					</div>
				</div>

				{/* Input field */}
				<div>
					<label
						htmlFor="input-value"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{inputType === 'arabic'
							? t('legacy/ui.form.romanNumerals.enterArabic')
							: t('legacy/ui.form.romanNumerals.enterRoman')}
					</label>
					<input
						type={inputType === 'arabic' ? 'number' : 'text'}
						id="input-value"
						value={value}
						onChange={(e) => {
							// Auto-uppercase Roman numerals as user types
							const newValue = inputType === 'roman' 
								? e.target.value.toUpperCase() 
								: e.target.value
							setValue(newValue)
							setError('')
						}}
						placeholder={
							inputType === 'arabic'
								? t('legacy/ui.form.romanNumerals.arabicPlaceholder')
								: t('legacy/ui.form.romanNumerals.romanPlaceholder')
						}
						min={inputType === 'arabic' ? 1 : undefined}
						max={inputType === 'arabic' ? 3999 : undefined}
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
					{t('legacy/ui.form.romanNumerals.convert')}
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

