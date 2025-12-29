import type { MetadataRoute } from 'next'

/**
 * robots.txt configuration
 * Controls search engine crawling and indexing
 */
export default function robots(): MetadataRoute.Robots {
	const baseUrl = 'https://first-calc.com'

	return {
		rules: [
			{
				userAgent: '*',
				allow: [
					'/',
					'/calculators/',
					'/learn/',
					'/standards/',
					'/tools/',
				],
				disallow: [
					'/api/',
					'/admin/',
					'/_next/',
					'/*?*',
					'/*debug*',
					'/*preview*',
					// Legacy dynamic routes - prevent infinite indexing
					'/numbers-to-words/*/',
					'/chislo-propisyu/*/',
					'/range/',
					'/roman-numerals-converter/*/',
					'/percentage-of-a-number/*/',
					'/add-subtract-percentage/*/',
					'/factors/*/',
					'/number-format/*/',
					'/root-calculator/*/',
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	}
}


