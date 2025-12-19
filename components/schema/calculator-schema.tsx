import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface CalculatorSchemaProps {
	calculator: CalculatorDefinitionClient
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

	// Enhanced schema for finance calculators
	const isFinanceCalculator = calculator.category === 'finance'
	
	const baseSchema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: calculator.title,
		applicationCategory: categoryMap[calculator.category] || 'EducationalApplication',
		operatingSystem: 'Web',
		url: canonicalUrl,
		description: calculator.shortDescription,
		...(isFinanceCalculator && {
			applicationSubCategory: 'FinancialCalculator',
			featureList: calculator.inputs?.map((input) => input.label || input.name) || [],
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD',
			},
		}),
	}

	const schema = baseSchema

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
}




