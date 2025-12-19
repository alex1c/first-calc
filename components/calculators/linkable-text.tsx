/**
 * Linkable text component
 * Parses text and converts link patterns to actual links
 * Supports format: [text](calculator-id)
 * 
 * Note: This is a client component that assumes calculator IDs are valid.
 * Calculator existence should be validated at content creation time.
 */

'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface LinkableTextProps {
	text: string
	locale: Locale
}

/**
 * Link pattern: [text](calculator-id)
 */
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * Linkable text component
 * Converts markdown-like links to Next.js Link components
 * Assumes calculator-id format: "calculator-id" or "category/calculator-id"
 */
export function LinkableText({ text, locale }: LinkableTextProps) {
	const parts: React.ReactNode[] = []
	let lastIndex = 0
	let match: RegExpExecArray | null
	let keyCounter = 0
	
	// Reset regex
	LINK_PATTERN.lastIndex = 0
	
	while ((match = LINK_PATTERN.exec(text)) !== null) {
		// Add text before the link
		if (match.index > lastIndex) {
			parts.push(text.substring(lastIndex, match.index))
		}
		
		// Extract link text and calculator ID
		const linkText = match[1]
		const calculatorIdOrPath = match[2]
		
		// Parse calculator ID (can be "calculator-id" or "category/calculator-id")
		let category = 'math' // Default category for math calculators
		let calculatorId = calculatorIdOrPath
		
		if (calculatorIdOrPath.includes('/')) {
			const parts = calculatorIdOrPath.split('/')
			category = parts[0]
			calculatorId = parts[1]
		}
		
		// Generate link (assume calculator exists - validation should happen at content creation)
		parts.push(
			<Link
				key={`link-${keyCounter++}`}
				href={`/${locale}/calculators/${category}/${calculatorId}`}
				className="text-blue-600 hover:text-blue-800 underline font-medium"
			>
				{linkText}
			</Link>,
		)
		
		lastIndex = match.index + match[0].length
	}
	
	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex))
	}
	
	return <>{parts.length > 0 ? parts : text}</>
}

