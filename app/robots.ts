import type { MetadataRoute } from 'next'

/**
 * robots.txt configuration
 * Controls search engine crawling and indexing
 * Test environment - blocks all indexing
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				disallow: '/',
			},
		],
	}
}


