'use client'

/**
 * Bidirectional Roman numerals converter form
 * Supports conversion from Arabic to Roman and vice versa
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

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
	const [inputType, setInputType] = useState<'arabic' | 'roman'>('arabic')
	const [value, setValue] = useState('')
	const [error, setError] = useState('')

	const validateInput = (): boolean => {
		setError('')

		if (!value.trim()) {
			setError(
				locale === 'ru'
					? 'Пожалуйста, введите значение'
					: 'Please enter a value',
			)
			return false
		}

		if (inputType === 'arabic') {
			const num = parseInt(value.trim(), 10)
			if (isNaN(num) || num < 1 || num > 3999) {
				setError(
					locale === 'ru'
						? 'Число должно быть от 1 до 3999'
						: 'Number must be between 1 and 3999',
				)
				return false
			}
		} else {
			// Roman numeral validation (basic check)
			const roman = value.trim().toUpperCase()
			if (!/^[IVXLCDM]+$/.test(roman)) {
				setError(
					locale === 'ru'
						? 'Используйте только символы: I, V, X, L, C, D, M'
						: 'Use only characters: I, V, X, L, C, D, M',
				)
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
						{locale === 'ru' ? 'Тип ввода' : 'Input Type'}
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
								{locale === 'ru' ? 'Арабское число' : 'Arabic Number'}
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
								{locale === 'ru' ? 'Римская цифра' : 'Roman Numeral'}
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
							? locale === 'ru'
								? 'Введите число (1-3999)'
								: 'Enter number (1-3999)'
							: locale === 'ru'
								? 'Введите римскую цифру'
								: 'Enter Roman numeral'}
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
								? locale === 'ru'
									? 'Например: 123'
									: 'e.g., 123'
								: locale === 'ru'
									? 'Например: XII'
									: 'e.g., XII'
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
					{locale === 'ru' ? 'Конвертировать' : 'Convert'}
				</button>
			</form>

			{exampleLinks.length > 0 && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-3">
						{locale === 'ru' ? 'Примеры ссылок:' : 'Example links:'}
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

