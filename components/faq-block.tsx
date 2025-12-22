'use client'

import { useState } from 'react'
import type { FAQItem } from '@/lib/calculator-types'

interface FaqBlockProps {
	faq: FAQItem[]
	title?: string
}

export function FaqBlock({ faq, title = 'Frequently Asked Questions' }: FaqBlockProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	if (!faq || faq.length === 0) {
		return null
	}

	const toggleItem = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
			<div className="space-y-2">
				{faq.map((item, index) => {
					const isOpen = openIndex === index

					return (
						<div
							key={index}
							className="border border-gray-200 rounded-lg overflow-hidden"
						>
							{/* Question button */}
							<button
								onClick={() => toggleItem(index)}
								className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
								aria-expanded={isOpen}
							>
								<span className="font-medium text-gray-900 pr-4">
									{item.question}
								</span>
								<svg
									className={`flex-shrink-0 w-5 h-5 text-gray-500 transition-transform ${
										isOpen ? 'transform rotate-180' : ''
									}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{/* Answer content */}
							{isOpen && (
								<div className="px-4 pb-3 pt-0">
									<div className="pt-3 border-t border-gray-200">
										<p className="text-gray-700">{item.answer}</p>
									</div>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}








