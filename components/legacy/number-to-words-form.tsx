'use client'

/**
 * Number to words converter form with language and format options.
 * Validation shares strict-number rules with URL/slug parsing.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { useClientT, type Dictionary } from '@/lib/i18n/useClientT'
import { validatePropisyuFormInput } from '@/lib/propisyu/money-input'
import {
	converterMaxForLanguage,
	type PropisyuWordLanguage,
} from '@/lib/propisyu/strict-number'

interface NumberToWordsFormProps {
	locale: Locale
	toolSlug: 'chislo-propisyu' | 'numbers-to-words'
	/** Server-loaded i18n dict so SSR does not flash raw keys */
	initialDict?: Dictionary
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Map validation reasons to existing i18n error keys.
 */
function formErrorKey(reason: string): string {
	switch (reason) {
		case 'empty':
			return 'errors.validation.enterNumber'
		case 'too-many-fraction-digits':
			return 'errors.validation.moneyMaxTwoDecimals'
		case 'out-of-range':
			return 'errors.validation.numberRangeRu'
		case 'signed-not-allowed':
		case 'exponent-not-allowed':
		case 'mixed-decimal-separators':
		case 'multiple-decimal-separators':
		case 'malformed-decimal':
		case 'non-digit-characters':
		case 'non-digit-fraction':
		case 'not-finite':
		case 'not-safe-integer':
			return 'errors.validation.enterValidNumber'
		default:
			return 'errors.validation.enterValidNumber'
	}
}

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
	const [language, setLanguage] = useState<PropisyuWordLanguage>(
		toolSlug === 'chislo-propisyu' ? 'ru' : 'en',
	)
	const [error, setError] = useState('')
	const isChisloPropisyu = toolSlug === 'chislo-propisyu'
	const maxForLanguage = converterMaxForLanguage(language)

	const validateInput = (): boolean => {
		setError('')

		if (!isChisloPropisyu) {
			// Keep a light check for the EN numbers-to-words tool.
			const raw = value.trim()
			if (!raw) {
				setError(t('errors.validation.enterNumber'))
				return false
			}
			const result = validatePropisyuFormInput(raw, {
				format,
				language,
			})
			if (!result.ok) {
				setError(
					t(
						result.reason === 'out-of-range'
							? 'errors.validation.numberRangeEn'
							: formErrorKey(result.reason),
					),
				)
				return false
			}
			return true
		}

		const result = validatePropisyuFormInput(value, {
			format,
			language,
		})
		if (!result.ok) {
			if (result.reason === 'out-of-range') {
				setError(
					t(
						language === 'en'
							? 'errors.validation.numberRangeEn'
							: 'errors.validation.numberRangeRu',
					),
				)
			} else {
				setError(t(formErrorKey(result.reason)))
			}
			return false
		}
		return true
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateInput()) {
			return
		}

		const basePath = locale === 'en' ? '' : `/${locale}`
		let url: string

		if (isChisloPropisyu) {
			const result = validatePropisyuFormInput(value, {
				format,
				language,
			})
			if (!result.ok) {
				setError(t(formErrorKey(result.reason)))
				return
			}
			if (format === 'money') {
				// Historical RU money URLs: /chislo-propisyu/{N}-{KK}
				url = `${basePath}/${toolSlug}/${result.urlSegment}`
			} else {
				url = `${basePath}/${toolSlug}/${result.urlSegment}`
			}
		} else if (format === 'money') {
			const currencySuffix = language === 'ru' ? 'rub' : 'usd'
			const result = validatePropisyuFormInput(value, {
				format: 'money',
				language,
			})
			if (!result.ok) {
				setError(t(formErrorKey(result.reason)))
				return
			}
			url = `${basePath}/${toolSlug}/${result.normalized}-money-${currencySuffix}`
		} else {
			const result = validatePropisyuFormInput(value, {
				format: 'numeric',
				language,
			})
			if (!result.ok) {
				setError(t(formErrorKey(result.reason)))
				return
			}
			url = `${basePath}/${toolSlug}/${result.normalized}`
		}

		router.push(url)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

				<div>
					<label
						htmlFor="input-value"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{t('legacy/ui.form.numberToWords.number')}
					</label>
					{/*
					 * type=text (not number): browsers silently coerce/reject commas,
					 * exponents, and leading zeros. We validate with strict-number instead.
					 */}
					<input
						type="text"
						inputMode="decimal"
						id="input-value"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setError('')
						}}
						placeholder={t('legacy/ui.form.numberToWords.numberPlaceholder')}
						autoComplete="off"
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
						{format === 'money'
							? ' · max 2 decimal places'
							: ` · max ${maxForLanguage.toLocaleString('en-US')}`}
					</p>
				</div>

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
