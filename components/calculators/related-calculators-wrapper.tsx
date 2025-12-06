import { RelatedCalculatorsBlock } from './related-calculators-block'
import type { CalculatorDefinition } from '@/lib/calculators/types'

interface RelatedCalculatorsWrapperProps {
	calculator: CalculatorDefinition
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

