import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const locales = ['en', 'ru', 'es', 'tr', 'hi']
const errors = []
const warnings = []
const titles = new Map()
const descriptions = new Map()
const schemaDirectory = path.join(root, 'data', 'calculators')
const enabledSlugs = new Set(
	fs.readdirSync(schemaDirectory)
		.filter((name) => name.endsWith('.json') && !name.endsWith('.ru.json'))
		.map((name) => JSON.parse(fs.readFileSync(path.join(schemaDirectory, name), 'utf8')))
		.filter((schema) => schema.isEnabled !== false)
		.map((schema) => schema.slug),
)

function add(map, value, route) {
	map.set(value, [...(map.get(value) ?? []), route])
}

for (const locale of locales) {
	const directory = path.join(root, 'locales', locale, 'calculators', 'items')
	if (!fs.existsSync(directory)) continue
	for (const file of fs.readdirSync(directory).filter((name) => name.endsWith('.json'))) {
		const slug = file.slice(0, -5)
		if (!enabledSlugs.has(slug)) continue
		const route = `${locale === 'en' ? '' : `/${locale}`}/calculators/*/${slug}`
		const item = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'))
		const title = item.meta?.title?.trim() || item.title?.trim() || ''
		const description = item.meta?.description?.trim() || item.shortDescription?.trim() || ''
		if (!title) errors.push(`${route}: missing title`)
		if (!description) errors.push(`${route}: missing description`)
		if (title) add(titles, `${locale}:${title}`, route)
		if (description) add(descriptions, `${locale}:${description}`, route)
		if (title === slug || title === slug.replaceAll('-', ' ')) errors.push(`${route}: generic raw-slug title`)
		if (title.length > 65 || title.length < 20) warnings.push(`${route}: review title length (${title.length})`)
		if (description.length > 170 || (description && description.length < 60)) warnings.push(`${route}: review description length (${description.length})`)
		if (route.startsWith('/en/')) errors.push(`${route}: /en/ leakage`)
	}
}

for (const [key, routes] of titles) if (routes.length > 1) errors.push(`duplicate title: ${key} -> ${routes.join(', ')}`)
for (const [key, routes] of descriptions) if (routes.length > 1) warnings.push(`duplicate description: ${key} -> ${routes.join(', ')}`)

console.log(`Metadata audit: ${errors.length} errors, ${warnings.length} review warnings.`)
for (const message of errors) console.error(`ERROR ${message}`)
for (const message of warnings) console.warn(`WARN ${message}`)
if (errors.length) process.exitCode = 1
