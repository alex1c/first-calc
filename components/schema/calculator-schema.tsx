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
		auto: 'FinanceApplication', // Auto calculators are financial tools
		construction: 'EducationalApplication',
		health: 'EducationalApplication',
		geometry: 'EducationalApplication',
	}

	// Determine application subcategory based on calculator category
	const subCategoryMap: Record<string, string> = {
		finance: 'FinancialCalculator',
		auto: 'AutoCalculator',
		construction: 'ConstructionCalculator',
		health: 'HealthCalculator',
		math: 'MathCalculator',
		geometry: 'GeometryCalculator',
	}

	const isFinanceCalculator = calculator.category === 'finance'
	const isAutoCalculator = calculator.category === 'auto'
	const isConstructionCalculator = calculator.category === 'construction'
	const subCategory = subCategoryMap[calculator.category]

	const baseSchema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: calculator.title,
		applicationCategory: categoryMap[calculator.category] || 'EducationalApplication',
		operatingSystem: 'Web',
		url: canonicalUrl,
		description: calculator.shortDescription,
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
		},
		...(subCategory && {
			applicationSubCategory: subCategory,
		}),
		...(isFinanceCalculator && {
			featureList: calculator.inputs?.map((input) => input.label || input.name) || [],
		}),
		...(isAutoCalculator && {
			featureList: calculator.inputs?.map((input) => input.label || input.name) || [],
		}),
		...(isConstructionCalculator && {
			featureList: calculator.inputs?.map((input) => input.label || input.name) || [],
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




