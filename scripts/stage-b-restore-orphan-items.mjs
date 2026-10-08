/**
 * Restore EN item files for orphan calculators from historical schemas,
 * and polish existing RU items (English fragment cleanup).
 */
import fs from 'node:fs'
import path from 'node:path'

const orphans = [
	'gcd',
	'lcm',
	'logarithm',
	'exponent',
	'cube-root',
	'area-circle',
	'area-rectangle',
	'inflation-adjustment',
]

const enDir = path.join('locales', 'en', 'calculators', 'items')
const ruDir = path.join('locales', 'ru', 'calculators', 'items')
fs.mkdirSync(enDir, { recursive: true })

function readJson(filePath) {
	let raw = fs.readFileSync(filePath, 'utf8')
	if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1)
	return JSON.parse(raw)
}

function normalizeExamples(examples = []) {
	return examples.slice(0, 3).map((ex, index) => {
		if (ex.title) {
			return {
				title: ex.title || `Example ${index + 1}`,
				description:
					ex.description || ex.inputDescription || 'Calculation example',
				steps:
					ex.steps ||
					(ex.input
						? Object.entries(ex.input).map(([key, value]) => `${key}: ${value}`)
						: []),
				resultDescription:
					ex.resultDescription ||
					(typeof ex.result === 'object'
						? JSON.stringify(ex.result)
						: String(ex.result ?? '')),
			}
		}
		const steps = ex.input
			? Object.entries(ex.input).map(([key, value]) => `${key}: ${value}`)
			: []
		return {
			title: `Example ${index + 1}`,
			description: 'Sample calculation',
			steps,
			resultDescription:
				typeof ex.result === 'object'
					? JSON.stringify(ex.result)
					: String(ex.result ?? ''),
		}
	})
}

for (const slug of orphans) {
	const historical = readJson(path.join('reports', `_hist_${slug}.json`))
	const item = {
		title: historical.title || slug,
		shortDescription:
			historical.description || historical.shortDescription || '',
		longDescription:
			historical.longDescription || historical.description || '',
		inputs: (historical.inputs || []).map((inp) => ({
			label: inp.label || inp.name,
			unitLabel: inp.unit || '',
			placeholder: inp.placeholder || `Enter ${inp.label || inp.name}`,
			helpText: inp.helpText || '',
		})),
		outputs: (historical.outputs || []).map((out) => ({
			label: out.label || out.name,
			unitLabel: out.unit || '',
		})),
		howTo: historical.howTo || [
			'Enter values',
			'Click Calculate',
			'View results',
		],
		examples: normalizeExamples(historical.examples || []),
		faq: (historical.faq || []).map((entry) => ({
			question: entry.question,
			answer: entry.answer,
		})),
		seo: {
			title: historical.title || slug,
			description: historical.description || '',
			keywords: historical.meta?.keywords || historical.keywords || [],
		},
	}
	fs.writeFileSync(
		path.join(enDir, `${slug}.json`),
		`${JSON.stringify(item, null, 2)}\n`,
	)
	console.log(`EN item written: ${slug}`)
}

for (const slug of orphans) {
	const filePath = path.join(ruDir, `${slug}.json`)
	if (!fs.existsSync(filePath)) continue
	const json = readJson(filePath)
	const rewritten = JSON.parse(
		JSON.stringify(json)
			.replaceAll('Result:', 'Результат:')
			.replaceAll('Click \\"Calculate\\"', 'Нажмите «Рассчитать»')
			.replaceAll('Click "Calculate"', 'Нажмите «Рассчитать»'),
	)
	if (!rewritten.seo) rewritten.seo = {}
	if (!rewritten.seo.title) rewritten.seo.title = rewritten.title
	if (!rewritten.seo.description) {
		rewritten.seo.description = rewritten.shortDescription
	}
	fs.writeFileSync(filePath, `${JSON.stringify(rewritten, null, 2)}\n`)
	console.log(`RU item polished: ${slug}`)
}
