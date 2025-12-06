import type { CalculatorDefinition } from '@/lib/calculators/types'

interface CalculatorSchemaProps {
	calculator: CalculatorDefinition
	canonicalUrl: string
}

/**
 * JSON-LD schema for calculator pages
 */
export function CalculatorSchema({
	calculator,
	canonicalUrl,
}: CalculatorSchemaProps) {
	const categoryMap: Record<string, string> = {
		finance: 'FinanceApplication',
		math: 'EducationalApplication',
		everyday: 'EducationalApplication',
		engineering: 'EducationalApplication',
		business: 'FinanceApplication',
	}

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: calculator.title,
		applicationCategory: categoryMap[calculator.category] || 'EducationalApplication',
		operatingSystem: 'Web',
		url: canonicalUrl,
		description: calculator.shortDescription,
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
}

