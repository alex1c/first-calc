/**
 * Propisyu SEO policy for money / decade hubs / plain numbers.
 *
 * Historical recovery scheme (no mass 301s, no global locale rewrite):
 *
 * 1. Primary indexable family = unprefixed historical URLs
 *    (`/chislo-propisyu/420-00`, `/chislo-propisyu/0-9999`) with Russian content.
 * 2. Those pages self-canonicalize; robots follow money allowlist / 100 hubs.
 * 3. Hreflang advertises only `ru` + `x-default` pointing at the unprefixed URL
 *    (content is Russian; do not invent an English alternate).
 * 4. `/ru/...` duplicates stay reachable but noindex with canonical → unprefixed.
 * 5. ES/TR/HI stay noindex + self-canonical.
 * 6. Plain / legacy pages stay noindex; self-canonical.
 * 7. Global calculator locale routing is unchanged. HTML `lang` for unprefixed
 *    Russian money/hubs is set via middleware header `x-first-calc-html-lang`
 *    (route-local; does not change i18n locale loading).
 */

import type { Locale } from '@/lib/i18n'
import { getSiteOrigin, localeUrl } from '@/lib/site-url'
import { isMoneySlugIndexable } from '@/lib/propisyu/seo-allowlist'
import type { PropisyuSlugParseResult } from '@/lib/propisyu/parse-slug'

export type PropisyuContentLanguage = 'ru' | 'en'

export interface PropisyuSeoDecision {
	robots: string
	canonicalUrl: string
	/** Absolute hreflang map; empty means omit language alternates. */
	languages: Record<string, string> | null
	contentLanguage: PropisyuContentLanguage
	indexable: boolean
}

function unprefixedAbsolute(pathname: string): string {
	return new URL(pathname, `${getSiteOrigin()}/`).toString()
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
	if (locale === 'es' || locale === 'tr' || locale === 'hi') {
		return {
			robots: 'noindex, follow',
			canonicalUrl: selfCanonical(locale, pathname),
			languages: null,
			contentLanguage: 'ru',
			indexable: false,
		}
	}

	if (parsed.kind === 'money') {
		const pathnameNorm = `/chislo-propisyu/${parsed.canonicalSlug}`
		const primary = unprefixedAbsolute(pathnameNorm)
		const allowlisted = isMoneySlugIndexable(parsed.canonicalSlug)

		// Unprefixed (default-locale shell) owns the historical indexable URL.
		if (locale === 'en' && allowlisted) {
			return {
				robots: 'index, follow',
				canonicalUrl: primary,
				languages: {
					ru: primary,
					'x-default': primary,
				},
				contentLanguage: 'ru',
				indexable: true,
			}
		}

		// /ru and non-allowlisted: reachable; point canonical at historical URL.
		return {
			robots: 'noindex, follow',
			canonicalUrl: primary,
			languages: null,
			contentLanguage: 'ru',
			indexable: false,
		}
	}

	if (parsed.kind === 'decade-hub') {
		const pathnameNorm = `/chislo-propisyu/${parsed.slug}`
		const primary = unprefixedAbsolute(pathnameNorm)

		if (locale === 'en') {
			return {
				robots: 'index, follow',
				canonicalUrl: primary,
				languages: {
					ru: primary,
					'x-default': primary,
				},
				contentLanguage: 'ru',
				indexable: true,
			}
		}

		return {
			robots: 'noindex, follow',
			canonicalUrl: primary,
			languages: null,
			contentLanguage: 'ru',
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
			languages: null,
			contentLanguage,
			indexable: false,
		}
	}

	return {
		robots: 'noindex, follow',
		canonicalUrl: selfCanonical(locale, pathname),
		languages: null,
		contentLanguage: locale === 'en' ? 'en' : 'ru',
		indexable: false,
	}
}

export function propisyuAlternates(decision: PropisyuSeoDecision) {
	if (!decision.languages) {
		return { canonical: decision.canonicalUrl }
	}
	return {
		canonical: decision.canonicalUrl,
		languages: decision.languages,
	}
}

/**
 * True when an unprefixed chislo slug should advertise Russian HTML lang
 * despite the default-locale shell being `en`.
 */
export function shouldForceHtmlLangRuForUnprefixedPropisyu(
	slugSegment: string | undefined,
): boolean {
	if (!slugSegment) return false
	// Avoid importing the full parser into every call site — lightweight shapes.
	if (/^\d+-\d{2}$/.test(slugSegment)) return true // money N-KK
	if (/^\d+-\d+$/.test(slugSegment) && !/^\d+-(en|ru)$/i.test(slugSegment)) {
		// decade hubs and small ranges are Russian tables / navigation
		return true
	}
	return false
}
