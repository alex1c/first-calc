/**
 * Historical «База чисел» decade hubs from the pre-Next first-calc.com sitemap
 * (Wayback 2024-11-06): 100 ranges of 10_000 covering 0…999_999.
 *
 * Decade ceiling and converter ceiling are separate: hubs stay 0…999_999 while
 * plain / money conversion still supports up to 999_999_999.
 */

export interface DecadeHub {
	/** Inclusive start of the decade range. */
	start: number
	/** Inclusive end of the decade range. */
	end: number
	/** Path under /chislo-propisyu without leading slash, e.g. "0-9999". */
	slug: string
	/** Public pathname preferred for chislo SEO (GSC / «База чисел»). */
	pathname: string
	/**
	 * Legacy root pathname from the archived sitemap (`/0-9999/`).
	 * Documented only — not mass-redirected.
	 */
	rootPathname: string
}

const DECADE_SIZE = 10_000
const DECADE_COUNT = 100
/** Ceiling for «База чисел» decade hubs and small-range tables. */
const DECADE_MAX = 999_999
/** Ceiling for plain-number / money conversion (pre-E1 RU converter). */
const CONVERTER_MAX = 999_999_999

/**
 * Build the exact historical set of 100 non-overlapping decade hubs.
 */
export function buildDecadeHubs(): DecadeHub[] {
	const hubs: DecadeHub[] = []
	for (let i = 0; i < DECADE_COUNT; i++) {
		const start = i * DECADE_SIZE
		const end = start + DECADE_SIZE - 1
		const slug = `${start}-${end}`
		hubs.push({
			start,
			end,
			slug,
			pathname: `/chislo-propisyu/${slug}`,
			rootPathname: `/${slug}`,
		})
	}
	return hubs
}

/** Memoized hub list — pure and stable for sitemap / navigation. */
export const DECADE_HUBS: DecadeHub[] = buildDecadeHubs()

/**
 * Look up a decade hub by start/end pair.
 */
export function findDecadeHub(
	start: number,
	end: number,
): DecadeHub | undefined {
	return DECADE_HUBS.find((hub) => hub.start === start && hub.end === end)
}

/**
 * True when the pair is exactly one of the 100 historical decade hubs.
 */
export function isDecadeHubRange(start: number, end: number): boolean {
	return Boolean(findDecadeHub(start, end))
}

/**
 * Neighbours for decade hub prev/next navigation (bounded, no infinite chain).
 */
export function getAdjacentDecadeHubs(start: number, end: number): {
	previous: DecadeHub | null
	next: DecadeHub | null
} {
	const index = DECADE_HUBS.findIndex(
		(hub) => hub.start === start && hub.end === end,
	)
	if (index < 0) {
		return { previous: null, next: null }
	}
	return {
		previous: index > 0 ? DECADE_HUBS[index - 1] : null,
		next: index < DECADE_HUBS.length - 1 ? DECADE_HUBS[index + 1] : null,
	}
}

/** @deprecated Prefer PROPISYU_DECADE_MAX — historically meant the decade ceiling. */
export const PROPISYU_MAX_INTEGER = DECADE_MAX
export const PROPISYU_DECADE_MAX = DECADE_MAX
export const PROPISYU_CONVERTER_MAX = CONVERTER_MAX
export const PROPISYU_DECADE_SIZE = DECADE_SIZE
export const PROPISYU_DECADE_COUNT = DECADE_COUNT

/**
 * Locales that may receive index,follow for full propisyu money / decade pages.
 * ES/TR/HI stay reachable but noindex until localization is complete.
 */
export function isPropisyuIndexableLocale(locale: string): boolean {
	return locale === 'en' || locale === 'ru'
}
