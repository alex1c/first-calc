/**
 * Single pathname → UI locale resolver for chrome (html lang, Header, Footer,
 * Search). Pure and header-free so client navigations stay in sync with SSR.
 *
 * Rules:
 * - Prefixed `/ru|/es|/tr|/hi/...` → that locale
 * - Unprefixed historical chislo money/hub → `ru` (SEO family)
 * - Everything else unprefixed → `en` (default shell)
 */

import { locales, type Locale } from '@/lib/i18n'
import { shouldForceHtmlLangRuForUnprefixedPropisyu } from '@/lib/propisyu/seo-policy'

/**
 * Resolve the UI locale that Header/Footer/html lang must use for `pathname`.
 */
export function resolveUiLocaleFromPathname(
	pathname: string | null | undefined,
): Locale {
	if (!pathname) return 'en'

	const segments = pathname.split('/').filter(Boolean)
	const first = segments[0]
	if (first && locales.includes(first as Locale)) {
		return first as Locale
	}

	// Unprefixed historical «число прописью» money / decade hubs.
	if (
		first === 'chislo-propisyu' &&
		shouldForceHtmlLangRuForUnprefixedPropisyu(segments[1])
	) {
		return 'ru'
	}

	return 'en'
}
