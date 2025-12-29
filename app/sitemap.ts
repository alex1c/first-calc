import type { MetadataRoute } from 'next';

/**
 * Sitemap configuration
 * Generates sitemap.xml for search engines
 * For test environment, returns empty sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
	// Check if this is test environment
	const isTestEnvironment =
		process.env.NEXT_PUBLIC_BASE_URL?.includes('test.first-calc.com') ||
		process.env.NEXT_PUBLIC_ENV === 'test' ||
		process.env.NODE_ENV === 'development';

	// For test environment, return empty sitemap
	if (isTestEnvironment) {
		return [];
	}

	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || 'https://first-calc.com';
	const locales = ['en', 'ru', 'es', 'tr', 'hi'];

	// Generate sitemap entries for main pages
	const entries: MetadataRoute.Sitemap = [];

	// Home pages for each locale
	locales.forEach((locale) => {
		const path = locale === 'en' ? '' : `/${locale}`;
		entries.push({
			url: `${baseUrl}${path}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		});
	});

	// Add other main pages (calculators, standards, learn, tools)
	// These would be populated from your data sources
	// For now, returning basic structure

	return entries;
}
