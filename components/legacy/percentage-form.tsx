'use client'

/**
 * Percentage calculation form with all variants
 * Supports: percentage of, add percentage, subtract percentage
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { useClientT } from '@/lib/i18n/useClientT'

interface PercentageFormProps {
	locale: Locale
	toolSlug: 'percentage-of-a-number' | 'add-subtract-percentage'
	exampleLinks?: Array<{ href: string; label: string }>
}

/**
 * Percentage calculation form component
 * Allows users to calculate percentages with validation
 */
export function PercentageForm({
	locale,
	toolSlug,
	exampleLinks = [],
}: PercentageFormProps) {
	const router = useRouter()
	const t = useClientT(locale, ['legacy/ui', 'errors'])
	const [value, setValue] = useState('')
	const [percent, setPercent] = useState('')
	const [operation, setOperation] = useState<'of' | 'add' | 'subtract'>(
		toolSlug === 'percentage-of-a-number' ? 'of' : 'add',
	)
	const [errors, setErrors] = useState<{ value?: string; percent?: string }>({})

	const validateInput = (): boolean => {
		const newErrors: { value?: string; percent?: string } = {}

		// Validate value
		if (!value.trim()) {
			newErrors.value = t('errors.validation.enterNumber')
		} else {
			const numValue = parseFloat(value.trim())
			if (isNaN(numValue) || !Number.isFinite(numValue)) {
				newErrors.value = t('errors.validation.enterValidNumber')
			}
		}

		// Validate percent
		if (!percent.trim()) {
			newErrors.percent = t('errors.validation.enterPercentage')
		} else {
			const numPercent = parseFloat(percent.trim())
			if (isNaN(numPercent) || !Number.isFinite(numPercent)) {
				newErrors.percent = t('errors.validation.enterValidPercentage')
			} else if (numPercent < 0 || numPercent > 1000) {
				newErrors.percent = t('errors.validation.percentageRange')
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

		// Build the URL path based on operation
		const basePath = locale === 'en' ? '' : `/${locale}`
		let url: string

		if (toolSlug === 'percentage-of-a-number') {
			// Format: /percentage-of-a-number/value/percent
			url = `${basePath}/percentage-of-a-number/${encodeURIComponent(value.trim())}/${encodeURIComponent(percent.trim())}`
		} else {
			// Format: /add-subtract-percentage/value/percent-add or /value/percent-subtract
			const operationSuffix = operation === 'add' ? 'add' : 'subtract'
			url = `${basePath}/add-subtract-percentage/${encodeURIComponent(value.trim())}/${encodeURIComponent(percent.trim())}-${operationSuffix}`
		}

		// Navigate to the result page
		router.push(url)
	}

	const isPercentageOf = toolSlug === 'percentage-of-a-number'

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Operation selector (only for add-subtract-percentage) */}
				{!isPercentageOf && (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('legacy/ui.form.percentage.operation')}
						</label>
						<div className="flex gap-4">
							<label className="flex items-center">
								<input
									type="radio"
									name="operation"
									value="add"
									checked={operation === 'add'}
									onChange={() => setOperation('add')}
									className="mr-2"
								/>
								<span className="text-sm text-gray-700">
									{t('legacy/ui.form.percentage.add')}
								</span>
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									name="operation"
									value="subtract"
									checked={operation === 'subtract'}
									onChange={() => setOperation('subtract')}
									className="mr-2"
								/>
								<span className="text-sm text-gray-700">
									{t('legacy/ui.form.percentage.subtract')}
								</span>
							</label>
						</div>
					</div>
				)}

				{/* Value input */}
				<div>
					<label
						htmlFor="input-value"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{t('legacy/ui.form.percentage.number')}
					</label>
					<input
						type="number"
						id="input-value"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setErrors((prev) => ({ ...prev, value: undefined }))
						}}
						placeholder={t('legacy/ui.form.percentage.numberPlaceholder')}
						step="any"
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
							errors.value ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
						}`}
					/>
					{errors.value && (
						<p className="mt-2 text-sm text-red-600">{errors.value}</p>
					)}
				</div>

				{/* Percentage input */}
				<div>
					<label
						htmlFor="input-percent"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						{t('legacy/ui.form.percentage.percent')}
						<span className="text-gray-500 ml-1">(%)</span>
					</label>
					<input
						type="number"
						id="input-percent"
						value={percent}
						onChange={(e) => {
							setPercent(e.target.value)
							setErrors((prev) => ({ ...prev, percent: undefined }))
						}}
						placeholder={t('legacy/ui.form.percentage.percentPlaceholder')}
						min="0"
						max="1000"
						step="any"
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
							errors.percent ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
						}`}
					/>
					{errors.percent && (
						<p className="mt-2 text-sm text-red-600">{errors.percent}</p>
					)}
					<p className="mt-1 text-xs text-gray-500">
						{t('legacy/ui.form.percentage.percentRange')}
					</p>
				</div>

				{/* Help text */}
				<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
					<p className="text-sm text-blue-800">
						{isPercentageOf
							? t('legacy/ui.form.percentage.helpOf')
							: operation === 'add'
								? t('legacy/ui.form.percentage.helpAdd')
								: t('legacy/ui.form.percentage.helpSubtract')}
					</p>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
				>
					{t('legacy/ui.form.percentage.calculate')}
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

