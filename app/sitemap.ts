import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import {
	getCalculatorsByLocale,
	getCategories,
} from '@/data/calculators'
import { getStandardsByLocale, getCountries } from '@/data/standards'
import { getNationalLandingList } from '@/data/national-standards'
import { getArticlesByLocale } from '@/data/articles'

/**
 * Generate sitemap with all pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://first-calc.com'
	const sitemapEntries: MetadataRoute.Sitemap = []

	// Main pages - Home
	for (const locale of locales) {
		const homePath = locale === 'en' ? '' : `/${locale}`
		sitemapEntries.push({
			url: `${baseUrl}${homePath || '/'}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [l, `${baseUrl}/${l === 'en' ? '' : l}`]),
				),
			},
		})

		// Calculators list page
		const calculatorsPath = locale === 'en' ? '/calculators' : `/${locale}/calculators`
		sitemapEntries.push({
			url: `${baseUrl}${calculatorsPath}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [
						l,
						`${baseUrl}/${l === 'en' ? '' : l}/calculators`,
					]),
				),
			},
		})

		// Standards pages
		const standardsPath = locale === 'en' ? '/standards' : `/${locale}/standards`
		sitemapEntries.push({
			url: `${baseUrl}${standardsPath}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [
						l,
						`${baseUrl}/${l === 'en' ? '' : l}/standards`,
					]),
				),
			},
		})

		const nationalStandardsPath =
			locale === 'en'
				? '/standards/national'
				: `/${locale}/standards/national`
		sitemapEntries.push({
			url: `${baseUrl}${nationalStandardsPath}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.7,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [
						l,
						`${baseUrl}/${l === 'en' ? '' : l}/standards/national`,
					]),
				),
			},
		})

		// Learn page
		const learnPath = locale === 'en' ? '/learn' : `/${locale}/learn`
		sitemapEntries.push({
			url: `${baseUrl}${learnPath}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
			alternates: {
				languages: Object.fromEntries(
					locales.map((l) => [
						l,
						`${baseUrl}/${l === 'en' ? '' : l}/learn`,
					]),
				),
			},
		})

		// Calculators
		const calculators = getCalculatorsByLocale(locale)
		for (const calc of calculators) {
			const calcPath =
				locale === 'en'
					? `/calculators/${calc.category}/${calc.slug}`
					: `/${locale}/calculators/${calc.category}/${calc.slug}`
			sitemapEntries.push({
				url: `${baseUrl}${calcPath}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/calculators/${calc.category}/${calc.slug}`,
						]),
					),
				},
			})
		}

		// Calculator categories
		const categories = getCategories(locale)
		for (const category of categories) {
			const categoryPath =
				locale === 'en'
					? `/calculators/${category}`
					: `/${locale}/calculators/${category}`
			sitemapEntries.push({
				url: `${baseUrl}${categoryPath}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/calculators/${category}`,
						]),
					),
				},
			})
		}

		// Standards
		const standards = getStandardsByLocale(locale)
		for (const std of standards) {
			const stdPath =
				locale === 'en'
					? `/standards/${std.country}/${std.slug}`
					: `/${locale}/standards/${std.country}/${std.slug}`
			sitemapEntries.push({
				url: `${baseUrl}${stdPath}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/standards/${std.country}/${std.slug}`,
						]),
					),
				},
			})
		}

		// National standards hub routes
		const nationalEntries = getNationalLandingList(locale)
		for (const landing of nationalEntries) {
			const nationalPath =
				locale === 'en'
					? `/standards/national/${landing.slug}`
					: `/${locale}/standards/national/${landing.slug}`
			sitemapEntries.push({
				url: `${baseUrl}${nationalPath}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/standards/national/${landing.slug}`,
						]),
					),
				},
			})
		}

		// National standard detail pages (US, EU, RU)
		const nationalDetailPages = [
			{
				country: 'us',
				slug: 'aci-concrete',
			},
			{
				country: 'us',
				slug: 'asce-loads',
			},
			{
				country: 'eu',
				slug: 'ec1-load-concepts',
			},
			{
				country: 'eu',
				slug: 'ec2-concrete-principles',
			},
			{
				country: 'eu',
				slug: 'ec7-soil-foundations',
			},
			{
				country: 'ru',
				slug: 'sp20-load-concepts',
			},
			{
				country: 'ru',
				slug: 'sp24-soil-foundations',
			},
			{
				country: 'ru',
				slug: 'sp63-concrete-principles',
			},
			{
				country: 'ru',
				slug: 'sp-snip-foundations',
			},
		]

		for (const page of nationalDetailPages) {
			const pagePath =
				locale === 'en'
					? `/standards/national/${page.country}/${page.slug}`
					: `/${locale}/standards/national/${page.country}/${page.slug}`
			sitemapEntries.push({
				url: `${baseUrl}${pagePath}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/standards/national/${page.country}/${page.slug}`,
						]),
					),
				},
			})
		}

		// Standard countries
		const countries = getCountries(locale)
		for (const country of countries) {
			const countryPath =
				locale === 'en'
					? `/standards/${country}`
					: `/${locale}/standards/${country}`
			sitemapEntries.push({
				url: `${baseUrl}${countryPath}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.5,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/standards/${country}`,
						]),
					),
				},
			})
		}

		// Articles
		const articles = getArticlesByLocale(locale)
		for (const article of articles) {
			const articlePath =
				locale === 'en' ? `/learn/${article.slug}` : `/${locale}/learn/${article.slug}`
			sitemapEntries.push({
				url: `${baseUrl}${articlePath}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}/learn/${article.slug}`,
						]),
					),
				},
			})
		}

		// Legacy landing pages only (no dynamic routes)
		// These are the main landing pages that should be indexed
		const legacyLandingPages = [
			'/numbers-to-words',
			'/chislo-propisyu',
			'/roman-numerals-converter',
			'/percentage-of-a-number',
			'/add-subtract-percentage',
			'/factors',
			'/number-format',
			'/root-calculator',
		]

		for (const route of legacyLandingPages) {
			const legacyPath =
				locale === 'en' ? route : `/${locale}${route}`
			sitemapEntries.push({
				url: `${baseUrl}${legacyPath}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.4,
				alternates: {
					languages: Object.fromEntries(
						locales.map((l) => [
							l,
							`${baseUrl}/${l === 'en' ? '' : l}${route}`,
						]),
					),
				},
			})
		}
	}

	return sitemapEntries
}
