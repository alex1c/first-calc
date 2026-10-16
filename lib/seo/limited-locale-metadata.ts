/**
 * SEO metadata for pages that are indexable only in primary locales (EN/RU).
 * Incomplete locales (es/tr/hi) stay reachable with noindex + EN canonical
 * and are omitted from hreflang.
 *
 * Minimal E1/E2 dependency port: hardcodes primary locales so we do not need
 * the larger content-availability rewrite from earlier feature history.
 */

import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { localizedContentMetadata } from '@/lib/site-url'

/** EN/RU are the only locales with real chislo-propisyu / legacy landings. */
const PRIMARY_CONTENT_LOCALES: readonly Locale[] = ['en', 'ru']

/**
 * Spread into generateMetadata for legacy landings that should not advertise
 * empty es/tr/hi alternates.
 */
export function primaryLocalePageMetadata(
	locale: Locale,
	pathname: string,
	contentLocales: readonly Locale[] = PRIMARY_CONTENT_LOCALES,
): Pick<Metadata, 'alternates' | 'robots'> {
	return localizedContentMetadata(locale, pathname, contentLocales)
}
