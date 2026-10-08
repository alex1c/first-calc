import fs from 'node:fs'
import path from 'node:path'

const schemaDir = 'data/calculators'
const schemas = fs
	.readdirSync(schemaDir)
	.filter((f) => f.endsWith('.json') && !f.includes('.ru.json'))
	.map((f) =>
		JSON.parse(fs.readFileSync(path.join(schemaDir, f), 'utf8')),
	)
	.filter((s) => s.isEnabled !== false)

const ru = new Set(
	fs
		.readdirSync('locales/ru/calculators/items')
		.filter((f) => f.endsWith('.json'))
		.map((f) => f.replace(/\.json$/, '')),
)

const missing = schemas.filter((s) => !ru.has(s.slug)).map((s) => s.slug).sort()
const present = schemas.filter((s) => ru.has(s.slug)).map((s) => s.slug).sort()

console.log(
	JSON.stringify(
		{
			enabled: schemas.length,
			ruItemFiles: ru.size,
			presentInCatalogGate: present.length,
			missingRuItem: missing.length,
			present,
			missing,
		},
		null,
		2,
	),
)
