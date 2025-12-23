/**
 * Smart related links system for legacy tools
 */

export interface RelatedTool {
	title: string
	href: string
	description?: string
}

/**
 * Get related legacy tools based on tool type
 * @param type - Type of legacy tool
 * @returns Array of related tools
 */
export function getRelatedLegacyTools(type: string): RelatedTool[] {
	const toolMap: Record<string, RelatedTool[]> = {
		'chislo-propisyu': [
			{
				title: 'Roman Numerals Converter',
				href: '/roman-numerals-converter',
				description: 'Convert between Arabic and Roman numerals',
			},
			{
				title: 'Indian Number Format',
				href: '/number-format/in',
				description: 'Format numbers in Indian numbering system',
			},
			{
				title: 'Percentage Calculator',
				href: '/percentage-of-a-number',
				description: 'Calculate percentages',
			},
			{
				title: 'Numbers to Words (English)',
				href: '/numbers-to-words',
				description: 'Convert numbers to English words',
			},
		],
		'numbers-to-words': [
			{
				title: 'Число прописью (русский)',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
			{
				title: 'Roman Numerals Converter',
				href: '/roman-numerals-converter',
				description: 'Convert between Arabic and Roman numerals',
			},
			{
				title: 'Number Factors',
				href: '/factors',
				description: 'Find all factors of a number',
			},
		],
		'roman-numerals-converter': [
			{
				title: 'Число прописью',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
			{
				title: 'Number Factors',
				href: '/factors',
				description: 'Find all factors of a number',
			},
			{
				title: 'Numbers to Words',
				href: '/numbers-to-words',
				description: 'Convert numbers to English words',
			},
		],
		'percentage-of-a-number': [
			{
				title: 'Add/Subtract Percentage',
				href: '/add-subtract-percentage',
				description: 'Add or subtract percentage from a number',
			},
			{
				title: 'Число прописью',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
		],
		'add-subtract-percentage': [
			{
				title: 'Percentage of a Number',
				href: '/percentage-of-a-number',
				description: 'Calculate percentage of a number',
			},
			{
				title: 'Число прописью',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
		],
		factors: [
			{
				title: 'Indian Number Format',
				href: '/number-format/in',
				description: 'Format numbers in Indian numbering system',
			},
			{
				title: 'Число прописью',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
			{
				title: 'Roman Numerals',
				href: '/roman-numerals-converter',
				description: 'Convert between Arabic and Roman numerals',
			},
		],
		'number-format-in': [
			{
				title: 'Number Factors',
				href: '/factors',
				description: 'Find all factors of a number',
			},
			{
				title: 'Число прописью',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
		],
		range: [
			{
				title: 'Число прописью',
				href: '/chislo-propisyu',
				description: 'Convert numbers to Russian words',
			},
			{
				title: 'Numbers to Words',
				href: '/numbers-to-words',
				description: 'Convert numbers to English words',
			},
		],
	}

	return toolMap[type] || []
}









