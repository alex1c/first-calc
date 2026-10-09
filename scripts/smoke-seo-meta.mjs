/**
 * Spot-check sitemap, robots, canonical, and hreflang on key pages.
 */
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

async function get(path) {
	const res = await fetch(`${BASE}${path}`)
	return { status: res.status, text: await res.text() }
}

function pickCanonical(html) {
	return (
		html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] ||
		html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] ||
		null
	)
}

function pickHreflang(html) {
	return [...html.matchAll(/hreflang=["']([^"']+)["']/gi)].map((m) => m[1])
}

const checks = []
function note(name, ok, detail) {
	checks.push({ name, ok, detail })
}

const sm = await get('/sitemap.xml')
const locs = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
note('sitemap_ok', sm.status === 200 && locs.length > 50, `${locs.length} urls`)
note(
	'sitemap_no_es_hub',
	!locs.some((u) => /\/es\/calculators(\/|$)/.test(u)),
	'es calculator hubs omitted',
)
note(
	'sitemap_has_ru_en',
	locs.some((u) => u.includes('/ru/')) && locs.some((u) => u.includes('first-calc.com') || u.includes(BASE)),
	'en+ru present',
)

const robots = await get('/robots.txt')
note(
	'robots_ok',
	robots.status === 200 &&
		!/Disallow:\s*\/\s*$/m.test(robots.text) &&
		/Sitemap:/i.test(robots.text),
	robots.text.slice(0, 240),
)

const pages = [
	'/',
	'/ru',
	'/calculators',
	'/ru/calculators',
	'/chislo-propisyu',
	'/ru/chislo-propisyu',
	'/tools',
	'/ru/tools',
	'/calculators/finance/investment-calculator',
	'/ru/calculators/finance/investment-calculator',
]

for (const path of pages) {
	const page = await get(path)
	const canon = pickCanonical(page.text)
	const hreflang = pickHreflang(page.text)
	const noindex = /noindex/i.test(page.text)
	note(
		`page${path}`,
		page.status === 200 && Boolean(canon),
		{ status: page.status, canon, hreflang, noindex },
	)
}

const report = { ok: checks.every((c) => c.ok), checks }
console.log(JSON.stringify(report, null, 2))
process.exit(report.ok ? 0 : 1)
