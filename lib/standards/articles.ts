import type { ArticleDefinition } from '@/lib/learn/types'
import { articleRegistry } from '@/lib/registry/loader'

/**
 * Get articles related to a standard
 * 
 * @param standardId - Standard ID
 * @param locale - Locale
 * @returns Array of articles that reference this standard
 */
export async function getArticlesByStandard(
	standardId: string,
	locale: string = 'en',
): Promise<ArticleDefinition[]> {
	// Get all articles
	const allArticles = await articleRegistry.getAll(locale)
	
	// Find articles that reference this standard
	const relatedArticles = allArticles.filter((article) => 
		article.relatedStandardIds?.includes(standardId)
	)
	
	return relatedArticles
}

