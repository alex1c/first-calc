import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const schemaDir = path.join(root, 'data', 'calculators')
const testFiles = fs.readdirSync(path.join(root, 'tests'), { recursive: true })
	.filter((file) => /\.(test|spec)\.[jt]sx?$/.test(file))
const testText = testFiles.map((file) => fs.readFileSync(path.join(root, 'tests', file), 'utf8')).join('\n')

function loadItem(locale, slug) {
	const file = path.join(root, 'locales', locale, 'calculators', 'items', `${slug}.json`)
	return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null
}

function riskFor(schema) {
	if (schema.category === 'health') return 'health'
	if (schema.category === 'finance' || schema.category === 'business' || schema.category === 'auto') return 'finance'
	if (schema.category === 'construction') return 'construction'
	if (schema.category === 'engineering') return 'engineering'
	if (schema.category === 'time' || /date|age|days-between/.test(schema.id)) return 'date/time'
	if (schema.category === 'converter' || /converter|numbers-to-words|roman/.test(schema.id)) return 'converter'
	return 'general math'
}

const schemas = fs.readdirSync(schemaDir)
	.filter((file) => file.endsWith('.json') && !file.endsWith('.ru.json'))
	.map((file) => ({ file, schema: JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8')) }))
	.filter(({ schema }) => schema.isEnabled !== false)
const canonicalIds = new Set(schemas.map(({ schema }) => schema.id))

const records = schemas.map(({ file, schema }) => {
	const en = loadItem('en', schema.slug)
	const ru = loadItem('ru', schema.slug)
	const related = schema.relatedIds ?? []
	return {
		id: schema.id,
		slug: schema.slug,
		category: schema.category,
		risk: riskFor(schema),
		schemaFile: path.relative(root, path.join(schemaDir, file)).replaceAll('\\', '/'),
		schemaValid: Boolean(schema.id && schema.slug && schema.category && Array.isArray(schema.inputs) && Array.isArray(schema.outputs)),
		calculation: schema.engine === 'function' ? schema.calculationId : 'formula',
		calculationImplementation: schema.engine === 'function'
			? fs.existsSync(path.join(root, 'lib', 'calculations', `${schema.id.replace(/-calculator$/, '')}.ts`)) || Boolean(schema.calculationId)
			: typeof schema.formula === 'string',
		enItem: Boolean(en),
		ruItem: Boolean(ru),
		title: Boolean(en?.title),
		description: Boolean(en?.shortDescription),
		method: Boolean(en?.howTo?.length),
		examples: en?.examples?.length ?? 0,
		faq: en?.faq?.length ?? 0,
		related,
		staleRelated: related.filter((id) => !canonicalIds.has(id)),
		testOwnership: testText.includes(schema.id) || testText.includes(schema.calculationId ?? '__none__'),
	}
})

const summary = {
	enabled: records.length,
	missingEnglishItems: records.filter((record) => !record.enItem).length,
	russianItems: records.filter((record) => record.ruItem).length,
	withoutMethod: records.filter((record) => !record.method).length,
	withoutExamples: records.filter((record) => !record.examples).length,
	withoutFaq: records.filter((record) => !record.faq).length,
	withoutRelated: records.filter((record) => !record.related.length).length,
	withoutOwnedTest: records.filter((record) => !record.testOwnership).length,
	staleRelated: records.flatMap((record) => record.staleRelated.map((id) => `${record.id} -> ${id}`)),
}

if (process.argv.includes('--json')) console.log(JSON.stringify({ summary, records }, null, 2))
else {
	console.log('Calculator content audit')
	console.table(summary)
}
if (summary.staleRelated.length || records.some((record) => !record.schemaValid || !record.enItem)) process.exitCode = 1
