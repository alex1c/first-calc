/**
 * Helpers for building internal content URLs that respect the locale of the
 * target resource (not the surrounding page locale). Prevents /ru/learn/...
 * links to English-only articles that 404.
 */

import type { Locale } from '@/lib/i18n'
import { localePath } from '@/lib/site-url'

export function learnArticlePath(
	article: { slug: string; locale?: string },
): string {
	const contentLocale = (article.locale || 'en') as Locale
	return localePath(contentLocale, `/learn/${article.slug}`)
}
