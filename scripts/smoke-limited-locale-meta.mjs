const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

function pick(html, re) {
	return html.match(re)?.[1] || null
}

const en = await (await fetch(`${BASE}/`)).text()
const es = await (await fetch(`${BASE}/es`)).text()
const toolsEs = await (await fetch(`${BASE}/es/tools`)).text()

console.log(
	JSON.stringify(
		{
			enHomeHreflang: [...en.matchAll(/hreflang=["']([^"']+)/gi)].map((m) => m[1]),
			esHomeRobots:
				pick(es, /name=["']robots["'][^>]*content=["']([^"']+)/i) ||
				pick(es, /content=["']([^"']+)["'][^>]*name=["']robots["']/i),
			esHomeCanonical: pick(es, /rel=["']canonical["'][^>]*href=["']([^"']+)/i),
			esToolsRobots:
				pick(toolsEs, /name=["']robots["'][^>]*content=["']([^"']+)/i) ||
				pick(toolsEs, /content=["']([^"']+)["'][^>]*name=["']robots["']/i),
			esToolsCanonical: pick(toolsEs, /rel=["']canonical["'][^>]*href=["']([^"']+)/i),
		},
		null,
		2,
	),
)
