/**
 * Unified FAQ and Examples generator for legacy tools
 */

import type { FAQItem, Example } from './contentGenerators'
import {
	getFaqForChisloPropisyu,
	getExamplesForChisloPropisyu,
	getFaqForNumbersToWords,
	getExamplesForNumbersToWords,
	getFaqForRomanNumerals,
	getFaqForPercentage,
	getExamplesForPercentage,
	getFaqForFactors,
	getFaqForIndianFormat,
	getFaqForRange,
	getFaqForRootCalculator,
} from './contentGenerators'

/**
 * Get FAQ for a specific legacy tool
 */
export function getFaqForLegacyTool(type: string): FAQItem[] {
	const faqMap: Record<string, () => FAQItem[]> = {
		'chislo-propisyu': getFaqForChisloPropisyu,
		'numbers-to-words': getFaqForNumbersToWords,
		'roman-numerals-converter': getFaqForRomanNumerals,
		'percentage-of-a-number': getFaqForPercentage,
		'add-subtract-percentage': getFaqForPercentage,
		factors: getFaqForFactors,
		'number-format-in': getFaqForIndianFormat,
		range: getFaqForRange,
		'root-calculator': getFaqForRootCalculator,
	}

	const getter = faqMap[type]
	return getter ? getter() : []
}

/**
 * Get examples for a specific legacy tool
 */
export function getExamplesForLegacyTool(type: string): Example[] {
	const examplesMap: Record<string, () => Example[]> = {
		'chislo-propisyu': getExamplesForChisloPropisyu,
		'numbers-to-words': getExamplesForNumbersToWords,
		'percentage-of-a-number': getExamplesForPercentage,
		'add-subtract-percentage': getExamplesForPercentage,
	}

	const getter = examplesMap[type]
	return getter ? getter() : []
}






