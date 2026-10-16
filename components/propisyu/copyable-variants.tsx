'use client'

/**
 * Client-only copy UI for the seven historical money text variants.
 * SEO text is already rendered by the server; this only handles clipboard.
 */

import { useState } from 'react'
import type { MoneyCopyVariant } from '@/lib/propisyu/money'

interface CopyableVariantsProps {
	variants: MoneyCopyVariant[]
}

export function CopyableVariants({ variants }: CopyableVariantsProps) {
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const handleCopy = async (variant: MoneyCopyVariant) => {
		try {
			await navigator.clipboard.writeText(variant.text)
			setCopiedId(variant.id)
			window.setTimeout(() => {
				setCopiedId((current) => (current === variant.id ? null : current))
			}, 2000)
		} catch {
			// Fallback for older browsers / denied permissions
			const area = document.createElement('textarea')
			area.value = variant.text
			area.setAttribute('readonly', '')
			area.style.position = 'absolute'
			area.style.left = '-9999px'
			document.body.appendChild(area)
			area.select()
			document.execCommand('copy')
			document.body.removeChild(area)
			setCopiedId(variant.id)
			window.setTimeout(() => {
				setCopiedId((current) => (current === variant.id ? null : current))
			}, 2000)
		}
	}

	return (
		<div className="space-y-3">
			{variants.map((variant) => (
				<div
					key={variant.id}
					className="rounded-lg border border-slate-200 bg-white p-4"
				>
					<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
						<p className="text-sm font-medium text-slate-700">
							{variant.label}
						</p>
						<button
							type="button"
							onClick={() => handleCopy(variant)}
							className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-blue-400 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
							aria-label={`Копировать вариант: ${variant.label}`}
						>
							{copiedId === variant.id ? 'Скопировано' : 'Копировать'}
						</button>
					</div>
					<p className="whitespace-pre-wrap break-words text-sm text-slate-900">
						{variant.text}
					</p>
				</div>
			))}
		</div>
	)
}
