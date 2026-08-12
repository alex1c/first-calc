import type { MetadataRoute } from 'next'
import { getSiteOrigin, isIndexingDisabled } from '@/lib/site-url'

/**
 * robots.txt configuration
 * Controls search engine crawling and indexing
 * Test environment - blocks all indexing
 */
export default function robots(): MetadataRoute.Robots {
	const origin = getSiteOrigin()
	if (isIndexingDisabled()) {
		return {
			rules: [{ userAgent: '*', disallow: '/' }],
			sitemap: `${origin}/sitemap.xml`,
		}
	}

	return {
		rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
		sitemap: `${origin}/sitemap.xml`,
	}
}

