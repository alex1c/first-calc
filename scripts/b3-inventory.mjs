/**
 * Inventory enabled calculators vs RU item coverage.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const calcDir = path.join(root, 'data', 'calculators')
const schemas = []

for (const file of readdirSync(calcDir)) {
	if (!file.endsWith('.json') || file.includes('.ru.')) continue
	const j = JSON.parse(readFileSync(path.join(calcDir, file), 'utf8'))
	schemas.push({
		id: j.id,
		slug: j.slug,
		category: j.category,
		enabled: j.isEnabled !== false,
		engine: j.engine,
		calculationId: j.calculationId,
		file,
	})
}

const enabled = schemas.filter((s) => s.enabled)
const bySlug = new Map()
for (const s of enabled) bySlug.set(s.slug, s)

function itemSlugs(locale) {
	const dir = path.join(root, 'locales', locale, 'calculators', 'items')
	if (!existsSync(dir)) return new Set()
	return new Set(
		readdirSync(dir)
			.filter((f) => f.endsWith('.json'))
			.map((f) => f.replace(/\.json$/, '')),
	)
}

const enItems = itemSlugs('en')
const ruItems = itemSlugs('ru')

const finance = [...bySlug.values()].filter((s) => s.category === 'finance')
const financeMissingRu = finance.filter((s) => !ruItems.has(s.slug))
const allMissingRu = [...bySlug.values()].filter((s) => !ruItems.has(s.slug))

console.log(JSON.stringify({
	jsonEnabledUnique: bySlug.size,
	enItems: enItems.size,
	ruItems: ruItems.size,
	financeCount: finance.length,
	financeMissingRu: financeMissingRu.map((s) => s.slug),
	allMissingRu: allMissingRu.map((s) => `${s.category}/${s.slug}`),
}, null, 2))
