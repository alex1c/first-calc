/**
 * Crawl sitemap + seed pages, collect internal hrefs, report HTTP statuses.
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/crawl-internal-links.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const MAX_PAGES = Number(process.env.CRAWL_MAX || 400)
const OUT = process.env.CRAWL_OUT || 'crawl-internal-links-report.json'

const SEEDS = [
	'/',
	'/ru',
	'/calculators',
	'/ru/calculators',
	'/tools',
	'/ru/tools',
	'/chislo-propisyu',
	'/ru/chislo-propisyu',
	'/numbers-to-words',
	'/roman-numerals-converter',
	'/percentage-of-a-number',
	'/factors/12',
	'/number-format/in/1234567',
	'/ru/calculators/finance/investment-calculator',
	'/ru/calculators/finance/savings-calculator',
	'/ru/calculators/finance/retirement-calculator',
	'/calculators/finance/investment-calculator',
	'/standards',
	'/ru/standards',
	'/learn',
	'/sitemap.xml',
	'/robots.txt',
]

function absolutize(fromPath, href) {
	try {
		const u = new URL(href, `${BASE}${fromPath}`)
		if (u.origin !== new URL(BASE).origin) return null
		return u.pathname + u.search
	} catch {
		return null
	}
}

function extractHrefs(html) {
	const hrefs = []
	const re = /href=["']([^"']+)["']/gi
	let m
	while ((m = re.exec(html))) {
		const h = m[1]
		if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) {
			continue
		}
		hrefs.push(h)
	}
	return hrefs
}

function extractSitemapLocs(xml) {
	const locs = []
	const re = /<loc>([^<]+)<\/loc>/gi
	let m
	while ((m = re.exec(xml))) locs.push(m[1].trim())
	return locs
}

async function fetchStatus(urlPath, { follow = true } = {}) {
	const url = `${BASE}${urlPath}`
	try {
		const res = await fetch(url, {
			redirect: follow ? 'follow' : 'manual',
			headers: { Accept: 'text/html,application/xml,*/*' },
		})
		return {
			path: urlPath,
			status: res.status,
			finalUrl: res.url,
			ok: res.ok,
			headers: Object.fromEntries(res.headers.entries()),
			body: res.ok || res.status < 400 ? await res.text() : '',
		}
	} catch (err) {
		return { path: urlPath, status: 0, ok: false, error: String(err), body: '' }
	}
}

/** Resolve target status; treat intentional 301/308 that land on 2xx as healthy. */
async function resolveTargetStatus(targetPath) {
	const followed = await fetchStatus(targetPath, { follow: true })
	if (followed.ok) return { status: followed.status, finalUrl: followed.finalUrl }
	const manual = await fetchStatus(targetPath, { follow: false })
	if ([301, 302, 307, 308].includes(manual.status)) {
		const loc = manual.headers?.location
		if (loc) {
			const next = absolutize('/', loc) || loc
			const dest = await fetchStatus(next, { follow: true })
			if (dest.ok) {
				return {
					status: dest.status,
					finalUrl: dest.finalUrl,
					viaRedirect: manual.status,
				}
			}
			return { status: dest.status || manual.status, finalUrl: dest.finalUrl }
		}
	}
	return { status: followed.status || manual.status || 0, finalUrl: followed.finalUrl }
}

function pageType(p) {
	if (p === '/' || p === '/ru') return 'home'
	if (p.includes('/calculators/')) return 'calculator'
	if (p.endsWith('/calculators')) return 'catalog'
	if (p.includes('/learn/')) return 'article'
	if (p.includes('/standards')) return 'standards'
	if (p.includes('/tools')) return 'tools'
	if (p.includes('chislo') || p.includes('numbers-to-words') || p.includes('factors') || p.includes('number-format')) {
		return 'legacy'
	}
	if (p === '/sitemap.xml' || p === '/robots.txt') return 'meta'
	return 'other'
}

const visited = new Set()
const queue = [...SEEDS]
const pages = []
const linkEdges = [] // { source, target, status, reason }

// Pull sitemap URLs first
const sm = await fetchStatus('/sitemap.xml')
if (sm.ok && sm.body) {
	for (const loc of extractSitemapLocs(sm.body)) {
		try {
			const u = new URL(loc)
			const p = u.pathname
			if (!queue.includes(p)) queue.push(p)
		} catch {
			/* ignore */
		}
	}
}

while (queue.length && visited.size < MAX_PAGES) {
	const current = queue.shift()
	if (visited.has(current)) continue
	visited.add(current)

	const page = await fetchStatus(current)
	pages.push({
		path: current,
		status: page.status,
		type: pageType(current),
		finalUrl: page.finalUrl,
		canonical: (page.body.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) ||
			page.body.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i) ||
			[])[1] || null,
		robots: (page.body.match(/name=["']robots["'][^>]*content=["']([^"']+)/i) ||
			page.body.match(/content=["']([^"']+)["'][^>]*name=["']robots["']/i) ||
			[])[1] || null,
		hreflang: [...page.body.matchAll(/hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)/gi)].map(
			(m) => ({ hreflang: m[1], href: m[2] }),
		),
	})

	if (!page.ok || !page.body) continue
	if (current === '/sitemap.xml' || current === '/robots.txt') continue

	const hrefs = extractHrefs(page.body)
	for (const raw of hrefs) {
		const target = absolutize(current, raw)
		if (!target) continue
		const clean = target.split('#')[0]
		if (!visited.has(clean) && !queue.includes(clean) && visited.size + queue.length < MAX_PAGES + 50) {
			queue.push(clean)
		}
		linkEdges.push({ source: current, target: clean })
	}
}

// Resolve unique targets (follow redirects so 308→200 is not counted broken)
const uniqueTargets = [...new Set(linkEdges.map((e) => e.target))]
const targetStatus = new Map()
for (const t of uniqueTargets) {
	if (visited.has(t)) {
		const p = pages.find((x) => x.path === t)
		if (p?.status && p.status < 400) {
			targetStatus.set(t, p.status)
			continue
		}
	}
	const r = await resolveTargetStatus(t)
	targetStatus.set(t, r.status)
}

const broken = []
for (const edge of linkEdges) {
	const status = targetStatus.get(edge.target) ?? 0
	if (status >= 400 || status === 0) {
		broken.push({
			source: edge.source,
			target: edge.target,
			status,
			pageType: pageType(edge.target),
			reason:
				status === 404
					? 'not_found'
					: status === 0
						? 'fetch_error'
						: `http_${status}`,
			fix: status === 404 ? 'retarget_or_redirect' : 'investigate',
		})
	}
}

// Dedupe broken by source+target
const seenBroken = new Set()
const brokenUnique = []
for (const b of broken) {
	const key = `${b.source}->${b.target}`
	if (seenBroken.has(key)) continue
	seenBroken.add(key)
	brokenUnique.push(b)
}

const report = {
	base: BASE,
	crawledPages: pages.length,
	uniqueInternalTargets: uniqueTargets.length,
	brokenCount: brokenUnique.length,
	brokenLinks: brokenUnique,
	statusHistogram: pages.reduce((acc, p) => {
		acc[p.status] = (acc[p.status] || 0) + 1
		return acc
	}, {}),
	historicalSpotChecks: {},
}

for (const p of [
	'/chislo-propisyu',
	'/ru/chislo-propisyu',
	'/tools',
	'/ru/tools',
	'/factors',
	'/ru/factors',
	'/number-format/in',
	'/10000-19999',
	'/ru/10000-19999',
	'/add-subtract-percentage/45.2/2.3-add',
	'/ru/add-subtract-percentage/45.2/2.3-add',
	'/percentage-of-a-number/55.2/2.6',
	'/ru/percentage-of-a-number/55.2/2.6',
]) {
	const r = await fetchStatus(p, { follow: false })
	const followed = await fetchStatus(p, { follow: true })
	report.historicalSpotChecks[p] = {
		status: r.status,
		location: r.headers?.location || null,
		finalStatus: followed.status,
		finalUrl: followed.finalUrl,
	}
}

fs.writeFileSync(path.resolve(OUT), JSON.stringify(report, null, 2))
console.log(
	JSON.stringify(
		{
			out: OUT,
			crawledPages: report.crawledPages,
			brokenCount: report.brokenCount,
			statusHistogram: report.statusHistogram,
			brokenSample: brokenUnique.slice(0, 30),
			historicalSpotChecks: report.historicalSpotChecks,
		},
		null,
		2,
	),
)
process.exit(brokenUnique.length > 0 ? 1 : 0)
