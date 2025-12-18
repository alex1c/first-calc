'use client'

/**
 * Number to words converter form with language and format options
 * Supports: numeric, money formats, different languages
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { useClientT } from '@/lib/i18n/useClientT'

interface NumberToWordsFormProps {
	locale: Locale
	toolSlug: 'chislo-propisyu' | 'numbers-to-words'
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Number to words converter form component
 * Allows users to convert numbers to words with language and format options
 */
export function NumberToWordsForm({
	locale,
	toolSlug,
	exampleLinks = [],
}: NumberToWordsFormProps) {
	const router = useRouter()
	const t = useClientT(locale, ['legacy/ui', 'errors'])
	const [value, setValue] = useState('')
	const [format, setFormat] = useState<'numeric' | 'money'>('numeric')
	const [language, setLanguage] = useState<'ru' | 'en'>(
		toolSlug === 'chislo-propisyu' ? 'ru' : 'en',
	)
	const [error, setError] = useState('')

	const validateInput = (): boolean => {
		setError('')

		if (!value.trim()) {
			setError(t('errors.validation.enterNumber'))
			return false
		}

		const num = parseFloat(value.trim())
		if (isNaN(num) || !Number.isFinite(num)) {
			setError(t('errors.validation.enterValidNumber'))
			return false
		}

		// Validate range based on language
		if (language === 'ru') {
			if (num < 0 || num > 999_999_999) {
				setError(t('errors.validation.numberRangeRu'))
				return false
			}
		} else {
			if (num < 0 || num > 999_999_999_999) {
				setError(t('errors.validation.numberRangeEn'))
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
		let url: string

		// Handle money format with proper encoding
		if (format === 'money') {
			// For money format, append currency indicator
			// Format: /toolSlug/value-money-currency
			const currencySuffix = language === 'ru' ? 'rub' : 'usd'
			// Replace dot with dot in URL (keep as is for proper parsing)
			const valueStr = value.trim().replace(/\./g, '.')
			url = `${basePath}/${toolSlug}/${valueStr}-money-${currencySuffix}`
		} else {
			// For numeric format, append language suffix for chislo-propisyu
			// Format: /toolSlug/value or /toolSlug/value-lang
			const valueStr = value.trim()
			if (isChisloPropisyu && language === 'en') {
				// Add language suffix for English (Russian is default, no suffix needed)
				url = `${basePath}/${toolSlug}/${valueStr}-en`
			} else {
				url = `${basePath}/${toolSlug}/${valueStr}`
			}
		}

		// Navigate to the result page
		router.push(url)
	}

	const isChisloPropisyu = toolSlug === 'chislo-propisyu'

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Language selector (only for chislo-propisyu) */}
				{isChisloPropisyu && (
					<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t('legacy/ui.form.numberToWords.language')}
					</label>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="radio"
								name="language"
								value="ru"
								checked={language === 'ru'}
								onChange={() => setLanguage('ru')}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">
								{t('legacy/ui.form.numberToWords.languageRu')}
							</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="language"
								value="en"
								checked={language === 'en'}
								onChange={() => setLanguage('en')}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">
								{t('legacy/ui.form.numberToWords.languageEn')}
							</span>
						</label>
					</div>
					</div>
				)}

				{/* Format selector */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t('legacy/ui.form.numberToWords.format')}
					</label>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="radio"
								name="format"
								value="numeric"
								checked={format === 'numeric'}
								onChange={() => setFormat('numeric')}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">
								{t('legacy/ui.form.numberToWords.formatNumeric')}
							</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="format"
								value="money"
								checked={format === 'money'}
								onChange={() => setFormat('money')}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">
								{t('legacy/ui.form.numberToWords.formatMoney')}
							</span>
						</label>
					</div>
				</div>

				{/* Value input */}
				<div>
					<label
						htmlFor="input-value"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{t('legacy/ui.form.numberToWords.number')}
					</label>
					<input
						type="number"
						id="input-value"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setError('')
						}}
						placeholder={t('legacy/ui.form.numberToWords.numberPlaceholder')}
						min="0"
						max={language === 'ru' ? 999_999_999 : 999_999_999_999}
						step="0.01"
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
							error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
						}`}
					/>
					{error && (
						<p className="mt-2 text-sm text-red-600">{error}</p>
					)}
					<p className="mt-1 text-xs text-gray-500">
						{language === 'ru'
							? t('legacy/ui.form.numberToWords.rangeRu')
							: t('legacy/ui.form.numberToWords.rangeEn')}
					</p>
				</div>

				{/* Help text */}
				<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
					<p className="text-sm text-blue-800">
						{format === 'numeric'
							? t('legacy/ui.form.numberToWords.helpNumeric')
							: t('legacy/ui.form.numberToWords.helpMoney')}
					</p>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
				>
					{t('legacy/ui.form.numberToWords.convert')}
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

