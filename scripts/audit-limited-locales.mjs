/**
 * Compact ES/TR/HI readiness audit for public launch decision.
 * Usage: BASE_URL=http://localhost:3000 node scripts/audit-limited-locales.mjs
 */
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const LOCALES = ['es', 'tr', 'hi']

async function get(path, { follow = true } = {}) {
	const res = await fetch(`${BASE}${path}`, { redirect: follow ? 'follow' : 'manual' })
	const text = res.ok || res.status < 500 ? await res.text() : ''
	return {
		status: res.status,
		finalUrl: res.url,
		location: res.headers.get('location'),
		text,
	}
}

function meta(html) {
	const canonical =
		html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] ||
		html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] ||
		null
	const robots =
		html.match(/name=["']robots["'][^>]*content=["']([^"']+)/i)?.[1] ||
		html.match(/content=["']([^"']+)["'][^>]*name=["']robots["']/i)?.[1] ||
		null
	const hreflang = [...html.matchAll(/hreflang=["']([^"']+)["']/gi)].map((m) => m[1])
	const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || null
	const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null
	return { canonical, robots, hreflang, title, h1 }
}

function hasNoindex(robots) {
	return /noindex/i.test(robots || '')
}

const report = {
	base: BASE,
	locales: {},
	sitemap: {},
	i18nWarningClasses: {},
	verdict: {},
}

const sm = await get('/sitemap.xml')
const locs = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
report.sitemap = {
	status: sm.status,
	count: locs.length,
	esUrls: locs.filter((u) => /\/es(\/|$)/.test(new URL(u).pathname)).length,
	trUrls: locs.filter((u) => /\/tr(\/|$)/.test(new URL(u).pathname)).length,
	hiUrls: locs.filter((u) => /\/hi(\/|$)/.test(new URL(u).pathname)).length,
	hasEsHome: locs.some((u) => {
		const p = new URL(u).pathname
		return p === '/es' || p === '/es/'
	}),
	hasEsTools: locs.some((u) => new URL(u).pathname === '/es/tools'),
	hasEsCalculators: locs.some((u) =>
		new URL(u).pathname.startsWith('/es/calculators'),
	),
}

for (const locale of LOCALES) {
	const L = {}
	const home = await get(`/${locale}`)
	const homeMeta = meta(home.text)
	L.home = {
		status: home.status,
		...homeMeta,
		noindex: hasNoindex(homeMeta.robots),
		showsFallbackBadge: /content in english|contenido en inglés|ingilizce|अंग्रेज़ी|english/i.test(
			home.text,
		),
		calculatorCardLinks: [
			...home.text.matchAll(
				new RegExp(`href=["']/${locale}/calculators/[^"']+["']`, 'gi'),
			),
		].length,
		englishHeroLikely: /Free online calculators|Browse free|Popular Calculators/i.test(
			home.text,
		),
	}

	const catalog = await get(`/${locale}/calculators`)
	const catalogMeta = meta(catalog.text)
	L.catalog = {
		status: catalog.status,
		...catalogMeta,
		noindex: hasNoindex(catalogMeta.robots),
		calculatorDetailLinks: [
			...catalog.text.matchAll(
				new RegExp(`href=["']/${locale}/calculators/[^"']+/[^"']+["']`, 'gi'),
			),
		].length,
	}

	const category = await get(`/${locale}/calculators/finance`, { follow: false })
	const categoryFollow = await get(`/${locale}/calculators/finance`, { follow: true })
	L.categoryFinance = {
		status: category.status,
		location: category.location,
		finalStatus: categoryFollow.status,
		finalUrl: categoryFollow.finalUrl,
	}

	// Popular EN calculator under locale prefix (expected noindex + EN canonical)
	const mortgageHead = await get(
		`/${locale}/calculators/finance/mortgage-calculator`,
		{ follow: false },
	)
	const mortgage = await get(
		`/${locale}/calculators/finance/mortgage-calculator`,
		{ follow: true },
	)
	const mortgageMeta = meta(mortgage.text)
	L.mortgage = {
		status: mortgageHead.status,
		location: mortgageHead.location,
		finalStatus: mortgage.status,
		finalUrl: mortgage.finalUrl,
		...mortgageMeta,
		noindex: hasNoindex(mortgageMeta.robots),
		canonicalIsEn: (mortgageMeta.canonical || '').includes(
			'/calculators/finance/mortgage-calculator',
		) && !(mortgageMeta.canonical || '').includes(`/${locale}/`),
		hasSubmit: /type=["']submit["']/i.test(mortgage.text),
		currencyHint: {
			hasDollar: /\$/.test(mortgage.text),
			hasEuro: /€|EUR/.test(mortgage.text),
			hasLira: /₺|TRY/.test(mortgage.text),
			hasRupee: /₹|INR/.test(mortgage.text),
		},
	}

	const tools = await get(`/${locale}/tools`)
	const toolsMeta = meta(tools.text)
	L.tools = {
		status: tools.status,
		...toolsMeta,
		noindex: hasNoindex(toolsMeta.robots),
		englishTitle: /Online Tools/i.test(toolsMeta.title || ''),
	}

	const chislo = await get(`/${locale}/chislo-propisyu`)
	L.chislo = { status: chislo.status, ...meta(chislo.text) }

	// Form smoke via API (locale param) for a common finance calc
	const api = await fetch(
		`${BASE}/api/calculators/mortgage-calculator/calculate?locale=${locale}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				homePrice: 300000,
				downPayment: 60000,
				loanTerm: 30,
				interestRate: 6.5,
				propertyTax: 0,
				propertyTaxType: 'amount',
				homeInsurance: 0,
				hoaFees: 0,
				pmi: 0,
				extraPayment: 0,
			}),
		},
	)
	let apiBody = null
	try {
		apiBody = await api.json()
	} catch {
		apiBody = null
	}
	L.apiMortgage = {
		status: api.status,
		ok: api.ok,
		hasMonthly: apiBody?.outputs?.monthlyPayment != null || apiBody?.monthlyPayment != null,
	}

	report.locales[locale] = L

	// Verdict heuristics
	const hardFail =
		home.status >= 500 ||
		catalog.status >= 500 ||
		mortgage.status >= 500 ||
		tools.status >= 500
	const indexLeak =
		(!L.home.noindex && L.home.status === 200) ||
		(!L.catalog.noindex && L.catalog.status === 200) ||
		(!L.mortgage.noindex && L.mortgage.status === 200) ||
		(!L.tools.noindex && L.tools.status === 200)
	const emptyButWorking =
		L.home.status === 200 &&
		L.catalog.calculatorDetailLinks === 0 &&
		L.mortgage.status === 200 &&
		L.apiMortgage.ok

	let status = 'LIMITED'
	if (hardFail) status = 'NOT READY'
	else if (
		emptyButWorking &&
		L.home.noindex &&
		L.catalog.noindex &&
		L.mortgage.noindex &&
		L.tools.noindex &&
		!report.sitemap.hasEsHome
	) {
		// Shells usable, indexing contained — still LIMITED (not a full locale)
		status = 'LIMITED'
	} else if (indexLeak || L.home.englishHeroLikely) {
		status = 'LIMITED'
	}
	// Never READY without item corpus
	report.verdict[locale] = {
		status,
		reasons: [
			'0 calculator item files',
			L.home.englishHeroLikely
				? 'home hero falls back to English copy'
				: 'home shell reachable',
			L.home.noindex ? 'home noindex OK' : 'home still indexable — risk',
			L.tools.noindex ? 'tools noindex OK' : 'tools still indexable — risk',
			L.mortgage.noindex
				? 'calculator routes noindex OK'
				: 'calculator routes indexable — risk',
			L.apiMortgage.ok ? 'mortgage API calculates' : 'mortgage API failed',
		],
	}
}

// Refine verdict after sitemap known for all locales
for (const locale of LOCALES) {
	const inSitemapHome = locs.some(
		(u) => u.includes(`/${locale}`) && (u.endsWith(`/${locale}`) || u.endsWith(`/${locale}/`)),
	)
	const inSitemapTools = locs.some((u) => u.includes(`/${locale}/tools`))
	const v = report.verdict[locale]
	if (inSitemapHome || inSitemapTools) {
		v.reasons.push('still present in sitemap as shell — should exclude')
		v.status = 'LIMITED'
	} else {
		v.reasons.push('shell URLs omitted from sitemap')
	}
	// READY only if native corpus exists (never true today)
	if (v.status !== 'NOT READY') v.status = 'LIMITED'
}

console.log(JSON.stringify(report, null, 2))
process.exit(0)
