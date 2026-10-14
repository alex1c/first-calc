'use client'

/**
 * Number to words converter form with language and format options
 * Supports: numeric, money formats, different languages
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { useClientT, type Dictionary } from '@/lib/i18n/useClientT'
import { isValidMoneyFractionalInput } from '@/lib/propisyu/money-input'

interface NumberToWordsFormProps {
	locale: Locale
	toolSlug: 'chislo-propisyu' | 'numbers-to-words'
	/** Server-loaded i18n dict so SSR does not flash raw keys */
	initialDict?: Dictionary
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Number to words converter form component
 * Allows users to convert numbers to words with language and format options
 */
export function NumberToWordsForm({
	locale,
	toolSlug,
	initialDict,
	exampleLinks = [],
}: NumberToWordsFormProps) {
	const router = useRouter()
	const t = useClientT(locale, ['legacy/ui', 'errors'], initialDict)
	const [value, setValue] = useState('')
	const [format, setFormat] = useState<'numeric' | 'money'>('numeric')
	const [language, setLanguage] = useState<'ru' | 'en'>(
		toolSlug === 'chislo-propisyu' ? 'ru' : 'en',
	)
	const [error, setError] = useState('')
	const isChisloPropisyu = toolSlug === 'chislo-propisyu'

	const validateInput = (): boolean => {
		setError('')

		const raw = value.trim()
		if (!raw) {
			setError(t('errors.validation.enterNumber'))
			return false
		}

		// Normalize decimal comma for validation (RU users often type 1,50).
		const normalized = raw.replace(',', '.')
		const num = Number.parseFloat(normalized)
		if (Number.isNaN(num) || !Number.isFinite(num)) {
			setError(t('errors.validation.enterValidNumber'))
			return false
		}

		if (num < 0) {
			setError(t('errors.validation.enterValidNumber'))
			return false
		}

		// Validate range based on language
		if (language === 'ru') {
			if (num > 999_999_999) {
				setError(t('errors.validation.numberRangeRu'))
				return false
			}
		} else {
			if (num > 999_999_999_999) {
				setError(t('errors.validation.numberRangeEn'))
				return false
			}
		}

		// Money format: reject more than two fractional digits explicitly
		// (never silently truncate 123.456 → 123.45).
		if (format === 'money' && !isValidMoneyFractionalInput(raw)) {
			setError(t('errors.validation.moneyMaxTwoDecimals'))
			return false
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
			// Historical RU money URLs: /chislo-propisyu/{N}-{KK} (exactly two kopeck digits).
			// Keep the older `-money-currency` shape for EN / non-chislo tools.
			if (isChisloPropisyu && language === 'ru') {
				const raw = value.trim().replace(',', '.')
				const parts = raw.split('.')
				// Strip leading zeros from rubles except a lone "0".
				const rublesNum = Number.parseInt(parts[0] || '0', 10)
				const rubles = String(Number.isFinite(rublesNum) ? rublesNum : 0)
				const frac = parts[1] || '0'
				// Validated ≤2 digits above; pad to exactly two kopeck digits.
				const kopecksRaw = frac.padEnd(2, '0')
				url = `${basePath}/${toolSlug}/${rubles}-${kopecksRaw}`
			} else {
				const currencySuffix = language === 'ru' ? 'rub' : 'usd'
				const valueStr = value.trim().replace(',', '.')
				url = `${basePath}/${toolSlug}/${valueStr}-money-${currencySuffix}`
			}
		} else {
			// Numeric format: keep decimals; append -en when English output is selected.
			const valueStr = value.trim().replace(',', '.')
			if (isChisloPropisyu && language === 'en') {
				url = `${basePath}/${toolSlug}/${valueStr}-en`
			} else {
				url = `${basePath}/${toolSlug}/${valueStr}`
			}
		}

		// Navigate to the result page
		router.push(url)
	}

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

