/**
 * Trusted internal request headers set only by middleware from pathname.
 * Client-supplied values for these names must never be honored.
 */

import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'

/** Routing shell locale (may be `en` for unprefixed URLs). */
export const HEADER_ROUTING_LOCALE = 'x-first-calc-locale'
/** Optional html lang override (historical propisyu Russian pages). */
export const HEADER_HTML_LANG = 'x-first-calc-html-lang'
/**
 * UI chrome locale (nav/footer/forms). May differ from routing shell on
 * historical unprefixed Russian money/hub pages.
 */
export const HEADER_UI_LOCALE = 'x-first-calc-ui-locale'

const TRUSTED_INTERNAL_HEADERS = [
	HEADER_ROUTING_LOCALE,
	HEADER_HTML_LANG,
	HEADER_UI_LOCALE,
] as const

/**
 * Remove any client-supplied internal locale / html-lang headers so only
 * middleware-assigned values can affect rendering.
 */
export function stripUntrustedInternalHeaders(headers: Headers): void {
	for (const name of TRUSTED_INTERNAL_HEADERS) {
		headers.delete(name)
	}
}

export function parseLocaleHeader(
	value: string | null | undefined,
	fallback: Locale = 'en',
): Locale {
	if (value && locales.includes(value as Locale)) {
		return value as Locale
	}
	return fallback
}
