/**
 * SEO metadata for pages that are indexable only in primary locales (EN/RU).
 * Incomplete locales (es/tr/hi) stay reachable with noindex + EN canonical
 * and are omitted from hreflang.
 */

import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { PRIMARY_CONTENT_LOCALES } from '@/lib/i18n/content-availability'
import { localizedContentMetadata } from '@/lib/site-url'

/**
 * Spread into generateMetadata returns for legacy landings, learn/standards
 * hubs, and English informational pages reused under other locale prefixes.
 */
export function primaryLocalePageMetadata(
	locale: Locale,
	pathname: string,
	contentLocales: readonly Locale[] = PRIMARY_CONTENT_LOCALES,
): Pick<Metadata, 'alternates' | 'robots'> {
	return localizedContentMetadata(locale, pathname, contentLocales)
}
