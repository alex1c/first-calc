import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import {
	getCalculatorsByLocale,
	getCategories,
} from '@/data/calculators'
import { getStandardsByLocale, getCountries } from '@/data/standards'
import { getArticlesByLocale } from '@/data/articles'

/**
 * Generate sitemap with all pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://first-calc.com'
	const sitemapEntries: MetadataRoute.Sitemap = []

	// Main pages
	for (const locale of locales) {
		sitemapEntries.push({
			url: `${baseUrl}/${locale}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [l, `${baseUrl}/${l}`]),
				),
			},
		})

		sitemapEntries.push({
			url: `${baseUrl}/${locale}/calculators`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [l, `${baseUrl}/${l}/calculators`]),
				),
			},
		})

		sitemapEntries.push({
			url: `${baseUrl}/${locale}/standards`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [l, `${baseUrl}/${l}/standards`]),
				),
			},
		})

		sitemapEntries.push({
			url: `${baseUrl}/${locale}/learn`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [l, `${baseUrl}/${l}/learn`]),
				),
			},
		})

		// Calculators
		const calculators = getCalculatorsByLocale(locale)
		for (const calc of calculators) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/calculators/${calc.category}/${calc.slug}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l}/calculators/${calc.category}/${calc.slug}`,
						]),
					),
				},
			})
		}

		// Calculator categories
		const categories = getCategories(locale)
		for (const category of categories) {
		sitemapEntries.push({
			url: `${baseUrl}/${locale}/calculators/${category}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.6,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [l, `${baseUrl}/${l}/calculators/${category}`]),
				),
			},
		})
		}

		// Standards
		const standards = getStandardsByLocale(locale)
		for (const std of standards) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/standards/${std.country}/${std.slug}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l}/standards/${std.country}/${std.slug}`,
						]),
					),
				},
			})
		}

		// Standard countries
		const countries = getCountries(locale)
		for (const country of countries) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/standards/${country}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.5,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [l, `${baseUrl}/${l}/standards/${country}`]),
					),
				},
			})
		}

		// Articles
		const articles = getArticlesByLocale(locale)
		for (const article of articles) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/learn/${article.slug}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [l, `${baseUrl}/${l}/learn/${article.slug}`]),
					),
				},
			})
		}

		// Legacy routes (limited, without huge ranges)
		const legacyRoutes = [
			'/chislo-propisyu/123',
			'/numbers-to-words/123',
			'/roman-numerals-converter/123',
			'/percentage-of-a-number/100-20',
			'/add-subtract-percentage/100-20-add',
			'/factors/24',
			'/number-format/in/1234567',
		]

		for (const route of legacyRoutes) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}${route}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.4,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [l, `${baseUrl}/${l}${route}`]),
					),
				},
			})
		}
	}

	return sitemapEntries
}
