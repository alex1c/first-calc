'use client'

import { useState } from 'react'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface FaqBlockProps {
	calculator: CalculatorDefinitionClient
}

/**
 * FAQ block component (accordion style)
 */
export function FaqBlock({ calculator }: FaqBlockProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	if (!calculator.faq || calculator.faq.length === 0) {
		return null
	}

	const toggleItem = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
			{/* Header with icon and intro text */}
			<div className="flex items-start gap-4 mb-6">
				{/* Icon */}
				<div className="flex-shrink-0">
					<svg
						className="w-8 h-8 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<h2 className="text-2xl font-semibold text-gray-900 mb-3">
						Frequently Asked Questions
					</h2>
					<p className="text-gray-600 leading-relaxed">
						Find answers to common questions about using this calculator. 
						If you have additional questions, feel free to explore the examples above or contact our support team.
					</p>
				</div>
			</div>

			{/* FAQ Items */}
			<div className="space-y-3">
				{calculator.faq.map((item, index) => {
					const isOpen = openIndex === index

					return (
						<div
							key={index}
							className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
						>
							<button
								onClick={() => toggleItem(index)}
								className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
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

							{isOpen && (
								<div className="px-5 pb-4 pt-0">
									<div className="pt-4 border-t border-gray-200">
										<p className="text-gray-700 leading-relaxed">{item.answer}</p>
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




