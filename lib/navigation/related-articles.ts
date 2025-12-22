/**
 * Get related articles for a calculator
 * Finds articles that link to the calculator or share similar topics
 */

import type { ArticleDefinition } from '@/lib/learn/types'
import { articleRegistry } from '@/lib/registry/loader'

/**
 * Get articles related to a calculator
 * 
 * @param calculatorId - Calculator ID
 * @param locale - Locale
 * @param limit - Maximum number of articles to return (default: 2)
 * @returns Array of related articles
 */
export async function getRelatedArticlesForCalculator(
	calculatorId: string,
	locale: string,
	limit: number = 2,
): Promise<ArticleDefinition[]> {
	// Get all articles
	const allArticles = await articleRegistry.getAll(locale)
	
	// Find articles that reference this calculator
	const relatedArticles = allArticles
		.filter((article) => 
			article.relatedCalculatorIds?.includes(calculatorId)
		)
		.slice(0, limit)
	
	return relatedArticles
}



