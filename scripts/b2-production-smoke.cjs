/**
 * Stage B2 local production smoke:
 * - sitemap URLs must not 404 / must not noindex incorrectly for RU calculators
 * - calculate API must return expected numeric values (not mere HTTP 200)
 */
const http = require('http')

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:3000'

function request(method, urlPath, body) {
	return new Promise((resolve, reject) => {
		const url = new URL(urlPath, BASE)
		const payload = body ? JSON.stringify(body) : null
		const req = http.request(
			{
				hostname: url.hostname,
				port: url.port,
				path: url.pathname + url.search,
				method,
				headers: {
					'Content-Type': 'application/json',
					...(payload
						? { 'Content-Length': Buffer.byteLength(payload) }
						: {}),
				},
			},
			(res) => {
				const chunks = []
				res.on('data', (chunk) => chunks.push(chunk))
				res.on('end', () => {
					resolve({
						status: res.statusCode,
						headers: res.headers,
						body: Buffer.concat(chunks).toString('utf8'),
					})
				})
			},
		)
		req.on('error', reject)
		if (payload) req.write(payload)
		req.end()
	})
}

function assert(condition, message) {
	if (!condition) throw new Error(message)
}

async function main() {
	const failures = []
	const report = {
		base: BASE,
		sitemapUrlsChecked: 0,
		sitemap404: 0,
		sitemapUnexpectedNoindex: 0,
		apiChecks: [],
	}

	// Wait for server
	for (let i = 0; i < 30; i++) {
		try {
			const health = await request('GET', '/')
			if (health.status && health.status < 500) break
		} catch {
			await new Promise((r) => setTimeout(r, 1000))
		}
	}

	const sitemap = await request('GET', '/sitemap.xml')
	assert(sitemap.status === 200, `sitemap status ${sitemap.status}`)
	const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
	assert(locs.length > 0, 'sitemap empty')

	// Prefer checking RU calculator URLs + a sample of EN
	const sample = locs.filter(
		(loc) =>
			loc.includes('/ru/calculators/') ||
			loc.includes('/calculators/math/') ||
			loc.includes('/calculators/finance/'),
	)
	const toCheck = sample.length > 0 ? sample : locs.slice(0, 40)

	for (const loc of toCheck) {
		const path = loc.replace('https://first-calc.com', '').replace(BASE, '') || '/'
		const res = await request('GET', path)
		report.sitemapUrlsChecked += 1
		if (res.status === 404) {
			report.sitemap404 += 1
			failures.push(`404 ${path}`)
			continue
		}
		const robots = `${res.headers['x-robots-tag'] || ''} ${res.body}`
		const isRuCalculator = path.includes('/ru/calculators/')
		if (isRuCalculator && /noindex/i.test(robots) && /<meta[^>]+noindex/i.test(res.body)) {
			report.sitemapUnexpectedNoindex += 1
			failures.push(`unexpected noindex ${path}`)
		}
	}

	const apiCases = [
		{
			id: 'loan-payment',
			locale: 'ru',
			inputs: { principal: 10000, annualRate: 8, years: 5 },
			expect: (data) =>
				typeof data.results?.monthlyPayment === 'number' &&
				Math.abs(data.results.monthlyPayment - 202.76) < 0.5,
		},
		{
			id: 'mortgage-calculator',
			locale: 'ru',
			inputs: {
				loanAmount: 300000,
				downPayment: 60000,
				interestRate: 4.5,
				loanTerm: 30,
				paymentFrequency: 'monthly',
			},
			expect: (data) =>
				Math.abs((data.results?.monthlyPayment || 0) - 1216.04) < 0.05,
		},
		{
			id: 'logarithm',
			locale: 'en',
			inputs: { number: 100, base: 1 },
			expectStatus: (status) => status !== 200,
			expect: (data) => data.results?.result !== 100,
		},
	]

	for (const testCase of apiCases) {
		const res = await request(
			'POST',
			`/api/calculators/${testCase.id}/calculate?locale=${testCase.locale}`,
			{ locale: testCase.locale, inputs: testCase.inputs },
		)
		let data = {}
		try {
			data = JSON.parse(res.body)
		} catch {
			data = {}
		}
		const statusOk = testCase.expectStatus
			? testCase.expectStatus(res.status)
			: res.status === 200
		const valueOk = testCase.expect(data)
		report.apiChecks.push({
			id: testCase.id,
			status: res.status,
			ok: statusOk && valueOk,
		})
		if (!statusOk || !valueOk) {
			failures.push(
				`API ${testCase.id} status=${res.status} body=${res.body.slice(0, 200)}`,
			)
		}
	}

	console.log(JSON.stringify({ report, failures }, null, 2))
	if (failures.length) {
		process.exit(1)
	}
	console.log('B2 production smoke PASSED')
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
