/**
 * Historical «База чисел» decade hubs from the pre-Next first-calc.com sitemap
 * (Wayback 2024-11-06): 100 ranges of 10_000 covering 0…999_999.
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
	 * Kept for documentation and future redirect decisions — not mass-redirected in E2.
	 */
	rootPathname: string
}

const DECADE_SIZE = 10_000
const DECADE_COUNT = 100
const MAX_NUMBER = 999_999

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

export const PROPISYU_MAX_INTEGER = MAX_NUMBER
export const PROPISYU_DECADE_SIZE = DECADE_SIZE
export const PROPISYU_DECADE_COUNT = DECADE_COUNT
