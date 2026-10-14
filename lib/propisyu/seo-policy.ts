/**
 * Propisyu SEO policy for money / decade hubs / plain numbers.
 *
 * Chosen scheme (research-backed, no mass 301s):
 *
 * 1. Historical money (`{N}-{KK}`) and «База чисел» hubs are factually Russian
 *    content (ruble wording / RU number-base navigation). They must not claim
 *    English via canonical or hreflang.
 * 2. Indexable surface is `/ru/chislo-propisyu/...` with a self-canonical URL.
 * 3. Unprefixed `/chislo-propisyu/...` stays reachable for historical GSC/bookmarks
 *    but is `noindex,follow` with a self-canonical (no cross-language canonical,
 *    no redirect chains).
 * 4. ES/TR/HI stay `noindex,follow` + self-canonical (incomplete localization).
 * 5. Hreflang for Russian-only money/hubs advertises `ru` + `x-default` → RU only.
 * 6. Plain numbers follow the page locale / `-en|-ru` suffix for content language;
 *    dynamic plain pages stay noindex; self-canonical.
 * 7. Global calculator locale architecture is unchanged.
 */

import type { Locale } from '@/lib/i18n'
import { languageAlternates, localeUrl } from '@/lib/site-url'
import { isMoneySlugIndexable } from '@/lib/propisyu/seo-allowlist'
import type { PropisyuSlugParseResult } from '@/lib/propisyu/parse-slug'

export type PropisyuContentLanguage = 'ru' | 'en'

export interface PropisyuSeoDecision {
	robots: string
	canonicalUrl: string
	/** Locales advertised in hreflang (subset of real language alternates). */
	hreflangLocales: readonly Locale[]
	/** Actual human language of the primary content block. */
	contentLanguage: PropisyuContentLanguage
	/** True when the route may be indexed. */
	indexable: boolean
}

function selfCanonical(locale: Locale, pathname: string): string {
	return localeUrl(locale, pathname)
}

/**
 * Resolve robots / canonical / hreflang / content language for a parsed slug.
 */
export function resolvePropisyuSeo(
	parsed: PropisyuSlugParseResult,
	locale: Locale,
	pathname: string,
): PropisyuSeoDecision {
	// Incomplete localizations never index.
	if (locale === 'es' || locale === 'tr' || locale === 'hi') {
		return {
			robots: 'noindex, follow',
			canonicalUrl: selfCanonical(locale, pathname),
			hreflangLocales: [],
			contentLanguage: 'ru',
			indexable: false,
		}
	}

	if (parsed.kind === 'money') {
		const pathnameNorm = `/chislo-propisyu/${parsed.canonicalSlug}`
		const allowlisted = isMoneySlugIndexable(parsed.canonicalSlug)
		// Only the Russian URL is the indexable owner of Russian money content.
		if (locale === 'ru' && allowlisted) {
			return {
				robots: 'index, follow',
				canonicalUrl: selfCanonical('ru', pathnameNorm),
				hreflangLocales: ['ru'],
				contentLanguage: 'ru',
				indexable: true,
			}
		}
		return {
			robots: 'noindex, follow',
			canonicalUrl: selfCanonical(locale, pathnameNorm),
			hreflangLocales: [],
			contentLanguage: 'ru',
			indexable: false,
		}
	}

	if (parsed.kind === 'decade-hub') {
		const pathnameNorm = `/chislo-propisyu/${parsed.slug}`
		if (locale === 'ru') {
			return {
				robots: 'index, follow',
				canonicalUrl: selfCanonical('ru', pathnameNorm),
				hreflangLocales: ['ru'],
				contentLanguage: 'ru',
				indexable: true,
			}
		}
		// Unprefixed / en shell: reachable historical URL, not claimed as EN content.
		return {
			robots: 'noindex, follow',
			canonicalUrl: selfCanonical(locale, pathnameNorm),
			hreflangLocales: [],
			contentLanguage: locale === 'en' ? 'en' : 'ru',
			indexable: false,
		}
	}

	if (parsed.kind === 'plain-number') {
		const contentLanguage: PropisyuContentLanguage =
			parsed.language === 'en' ? 'en' : 'ru'
		const pathnameNorm = `/chislo-propisyu/${parsed.canonicalSlug}`
		return {
			robots: 'noindex, follow',
			canonicalUrl: selfCanonical(locale, pathnameNorm),
			hreflangLocales: [],
			contentLanguage,
			indexable: false,
		}
	}

	// Ranges / legacy / invalid — never index; self-canonical when rendered.
	return {
		robots: 'noindex, follow',
		canonicalUrl: selfCanonical(locale, pathname),
		hreflangLocales: [],
		contentLanguage: locale === 'en' ? 'en' : 'ru',
		indexable: false,
	}
}

/**
 * Build Next metadata alternates from a SEO decision.
 */
export function propisyuAlternates(decision: PropisyuSeoDecision, pathname: string) {
	if (decision.hreflangLocales.length === 0) {
		return {
			canonical: decision.canonicalUrl,
		}
	}
	return {
		canonical: decision.canonicalUrl,
		languages: languageAlternates(pathname, decision.hreflangLocales),
	}
}
