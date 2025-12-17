import { RelatedCalculatorsBlock } from './related-calculators-block'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface RelatedCalculatorsWrapperProps {
	calculator: CalculatorDefinitionClient
	locale: string
}

/**
 * Wrapper component for RelatedCalculatorsBlock
 * Handles async data loading in server component context
 */
export async function RelatedCalculatorsWrapper({
	calculator,
	locale,
}: RelatedCalculatorsWrapperProps) {
	return <RelatedCalculatorsBlock calculator={calculator} locale={locale} />
}




