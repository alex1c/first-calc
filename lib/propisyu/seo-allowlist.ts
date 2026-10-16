/**
 * Controlled indexation allowlist for historical money URLs.
 *
 * E1 does NOT flip all dynamic money pages to index — only entries listed here
 * (plus decade hubs handled separately) receive index,follow.
 */

export interface MoneyIndexAllowlistEntry {
	/** Canonical slug, e.g. "420-00". */
	slug: string
	/** Short note for maintainers / Codex audit. */
	reason: string
}

/**
 * Seed allowlist from owner GSC winners + Wayback-verified money pages.
 * Extend deliberately after measuring Stage E1/E2 in Search Console.
 */
export const MONEY_INDEX_ALLOWLIST: readonly MoneyIndexAllowlistEntry[] = [
	{ slug: '199-00', reason: 'Wayback-verified archive snapshot' },
	{ slug: '380-00', reason: 'Wayback-verified archive snapshot' },
	{ slug: '5788-00', reason: 'Wayback-verified archive snapshot' },
	{ slug: '420-00', reason: 'GSC historical demand (owner list)' },
	{ slug: '7500-00', reason: 'GSC historical demand (owner list)' },
	{ slug: '210-00', reason: 'GSC historical demand (owner list)' },
	{ slug: '34482-00', reason: 'GSC historical demand (owner list)' },
	{ slug: '27093-00', reason: 'GSC historical demand (owner list)' },
] as const

const allowlistSet = new Set(
	MONEY_INDEX_ALLOWLIST.map((entry) => entry.slug),
)

/**
 * Whether a money canonical slug should be index,follow.
 */
export function isMoneySlugIndexable(canonicalSlug: string): boolean {
	return allowlistSet.has(canonicalSlug)
}

/**
 * Canonical pathname for a money slug under English-default URL rules
 * (no /en prefix). Russian locale uses /ru prefix via localeUrl elsewhere.
 */
export function moneyCanonicalPath(canonicalSlug: string): string {
	return `/chislo-propisyu/${canonicalSlug}`
}
