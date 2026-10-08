/**
 * Machine-checkable inventory for Russian catalog recovery (Stage A).
 * Writes reports/ru-catalog-inventory.json and .csv
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const schemaDir = path.join(root, 'data', 'calculators')
const baseFiles = fs
	.readdirSync(schemaDir)
	.filter((f) => f.endsWith('.json') && !f.includes('.ru.json'))
const ruOverlays = fs
	.readdirSync(schemaDir)
	.filter((f) => f.includes('.ru.json'))
const ruItems = fs
	.readdirSync(path.join(root, 'locales/ru/calculators/items'))
	.filter((f) => f.endsWith('.json'))
	.map((f) => f.replace(/\.json$/, ''))
const enItems = new Set(
	fs
		.readdirSync(path.join(root, 'locales/en/calculators/items'))
		.filter((f) => f.endsWith('.json'))
		.map((f) => f.replace(/\.json$/, '')),
)
const locales = ['en', 'ru', 'es', 'tr', 'hi']

function loadItem(locale, slug) {
	const p = path.join(
		root,
		'locales',
		locale,
		'calculators',
		'items',
		`${slug}.json`,
	)
	if (!fs.existsSync(p)) return null
	return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function quality(item) {
	if (!item) return { exists: false }
	const text = JSON.stringify(item)
	return {
		exists: true,
		title: Boolean(item.title),
		shortDescription: Boolean(item.shortDescription),
		longDescription: Boolean(item.longDescription),
		howTo: item.howTo?.length || 0,
		examples: item.examples?.length || 0,
		faq: item.faq?.length || 0,
		fields: item.fields ? Object.keys(item.fields).length : 0,
		results: item.results ? Object.keys(item.results).length : 0,
		seoTitle: Boolean(item.seo?.title),
		seoDescription: Boolean(item.seo?.description),
		englishFragments: (
			text.match(
				/\b(Calculate|Enter values|Click Calculate|Result:|Example \d)\b/g,
			) || []
		).slice(0, 5),
	}
}

const ts = fs.readFileSync(path.join(root, 'data/calculators.ts'), 'utf8')
const tsDefs = []
const localeRe = /locale:\s*'(en|ru|es|tr|hi)'/g
let match
while ((match = localeRe.exec(ts))) {
	const chunk = ts.slice(Math.max(0, match.index - 900), match.index + 20)
	const id = (chunk.match(/id:\s*'([^']+)'/g) || [])
		.pop()
		?.match(/'([^']+)'/)?.[1]
	const slug = (chunk.match(/slug:\s*'([^']+)'/g) || [])
		.pop()
		?.match(/'([^']+)'/)?.[1]
	const category = (chunk.match(/category:\s*'([^']+)'/g) || [])
		.pop()
		?.match(/'([^']+)'/)?.[1]
	if (id && slug) {
		tsDefs.push({ id, slug, category, locale: match[1] })
	}
}

const schemas = baseFiles.map((file) => {
	const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8'))
	return { file, ...schema, enabled: schema.isEnabled !== false }
})
const bySlug = new Map(schemas.map((s) => [s.slug, s]))

const liveSchemas = schemas.map((schema) => {
	const slug = schema.slug
	const items = Object.fromEntries(locales.map((l) => [l, loadItem(l, slug)]))
	const tsLocales = tsDefs
		.filter((d) => d.id === schema.id || d.slug === slug)
		.map((d) => d.locale)
	const hasRuOverlay =
		ruOverlays.includes(`${slug}.ru.json`) ||
		ruOverlays.includes(`${schema.id}.ru.json`)
	const engineOk =
		schema.engine === 'function'
			? Boolean(schema.calculationId)
			: typeof schema.formula === 'string'
	const inRuCatalog = schema.enabled && Boolean(items.ru)
	const reasons = []
	if (!schema.enabled) reasons.push('schema_disabled')
	if (!items.ru) reasons.push('missing_locales_ru_items_file')
	if (!items.en && schema.enabled) reasons.push('missing_en_item_warn_risk')
	if (tsLocales.includes('ru') && !items.ru) {
		reasons.push('has_ts_ru_definition_but_filtered')
	}
	if (hasRuOverlay) reasons.push('has_unused_ru_json_overlay')

	return {
		id: schema.id,
		slug,
		category: schema.category,
		definitionSource: tsLocales.length
			? 'typescript_precedence_plus_json'
			: 'json',
		tsLocales,
		enabled: schema.enabled,
		engine: schema.engine || 'formula',
		calculationId: schema.calculationId || null,
		enginePresent: engineOk,
		localesPresent: Object.fromEntries(
			locales.map((l) => [l, Boolean(items[l])]),
		),
		ruContent: quality(items.ru),
		enContent: quality(items.en),
		hasRuOverlayUnused: hasRuOverlay,
		inRuCatalog,
		directUrlAvailable: schema.enabled,
		indexableRu: inRuCatalog,
		inSearchRu: inRuCatalog,
		inSitemapRu: inRuCatalog,
		absenceReasons: reasons.length ? reasons : ['ok_in_ru_catalog'],
	}
})

const tsOnlySlugs = new Set(tsDefs.map((d) => d.slug))
const orphanRuItems = []
for (const slug of ruItems) {
	if (bySlug.has(slug)) continue
	// TypeScript-only calculators with RU items are not schema orphans
	if (tsOnlySlugs.has(slug)) continue
	const overlayPath = path.join(schemaDir, `${slug}.ru.json`)
	const overlay = fs.existsSync(overlayPath)
		? JSON.parse(fs.readFileSync(overlayPath, 'utf8'))
		: null
	const possibleModernAnalogs = []
	if (slug.includes('area')) possibleModernAnalogs.push('area')
	if (['cube-root', 'exponent', 'logarithm'].includes(slug)) {
		possibleModernAnalogs.push('square-root', 'power-root(disabled)')
	}
	orphanRuItems.push({
		id: overlay?.id || slug,
		slug,
		category: overlay?.category || null,
		definitionSource: overlay
			? 'orphan_ru_json_overlay_only'
			: 'orphan_ru_item_only',
		enabled: false,
		enginePresent: Boolean(overlay?.formula || overlay?.calculationId),
		localesPresent: {
			en: enItems.has(slug),
			ru: true,
			es: false,
			tr: false,
			hi: false,
		},
		ruContent: quality(loadItem('ru', slug)),
		hasRuOverlayUnused: Boolean(overlay),
		inRuCatalog: false,
		directUrlAvailable: false,
		indexableRu: false,
		inSearchRu: false,
		inSitemapRu: false,
		absenceReasons: [
			'base_schema_deleted',
			'ru_item_orphaned',
			overlay ? 'ru_overlay_not_loaded_by_registry' : 'no_overlay',
			'direct_url_404',
		],
		possibleModernAnalogs,
		deletedInCommit: 'caad87e',
	})
}

const jsonIds = new Set(schemas.map((s) => s.id))
const tsOnly = []
for (const d of tsDefs) {
	if (jsonIds.has(d.id)) continue
	if (d.locale !== 'en' && d.locale !== 'ru') continue
	let row = tsOnly.find((x) => x.id === d.id)
	if (!row) {
		const hasRuItem = Boolean(loadItem('ru', d.slug))
		const hasTsRu = tsDefs.some((x) => x.id === d.id && x.locale === 'ru')
		const hasTsEn = tsDefs.some((x) => x.id === d.id && x.locale === 'en')
		row = {
			id: d.id,
			slug: d.slug,
			category: d.category,
			definitionSource: 'typescript_only',
			tsLocales: [],
			enabled: true,
			enginePresent: true,
			localesPresent: {
				en: Boolean(loadItem('en', d.slug)) || hasTsEn,
				ru: hasRuItem || hasTsRu,
				es: false,
				tr: false,
				hi: false,
			},
			ruContent: quality(loadItem('ru', d.slug)),
			hasFullTsRu: hasTsRu,
			inRuCatalog: hasRuItem,
			directUrlAvailable: true,
			indexableRu: hasRuItem,
			inSearchRu: hasRuItem,
			inSitemapRu: hasRuItem,
			absenceReasons: hasRuItem
				? ['ok_if_item_exists']
				: [
						'missing_locales_ru_items_file',
						hasTsRu
							? 'has_full_ts_ru_content_ignored_by_filter'
							: 'no_ru_content',
						'filtered_from_ru_catalog_search_sitemap',
					],
		}
		tsOnly.push(row)
	}
	if (!row.tsLocales.includes(d.locale)) row.tsLocales.push(d.locale)
}

const summary = {
	baseline: {
		branch: 'fix/ru-catalog-seo-recovery',
		sha: '0320ad1c3c34424088526774ad6ac28875bebe71',
		date: '2026-10-08',
	},
	counts: {
		jsonSchemaFilesTotal: baseFiles.length + ruOverlays.length,
		jsonBaseSchemas: baseFiles.length,
		jsonRuOverlays: ruOverlays.length,
		enabledBaseSchemas: schemas.filter((s) => s.enabled).length,
		disabledBaseSchemas: schemas.filter((s) => !s.enabled).map((s) => s.slug),
		enItemFiles: enItems.size,
		ruItemFiles: ruItems.length,
		ruItemsMatchingLiveSlug: liveSchemas.filter((r) => r.localesPresent.ru)
			.length,
		orphanRuItemFiles: orphanRuItems.length,
		ruCatalogVisibleEnabled: liveSchemas.filter((r) => r.inRuCatalog).length,
		enabledMissingRuItem: liveSchemas.filter(
			(r) => r.enabled && !r.localesPresent.ru,
		).length,
		tsOnlyCalculators: tsOnly.length,
		tsRuFullDefinitions: tsDefs
			.filter((d) => d.locale === 'ru')
			.map((d) => d.slug),
	},
	rootCauses: [
		{
			id: 'RC1',
			title: 'content-availability filters by item file only',
			detail:
				'filterLocalizedCalculators/hasLocalizedCalculatorContent require locales/<locale>/calculators/items/<slug>.json. Used by catalog hubs, search, related block, sitemap.',
		},
		{
			id: 'RC2',
			title: 'Most RU item files are orphaned after schema deletion',
			detail:
				'Commit caad87e deleted base EN schemas for area-circle, area-rectangle, cube-root, exponent, gcd, lcm, logarithm, inflation-adjustment (and others). RU item files and .ru.json overlays remained but are not registered.',
		},
		{
			id: 'RC3',
			title: '.ru.json overlays are never loaded',
			detail:
				'lib/registry/loader.ts explicitly excludes files containing .ru.json.',
		},
		{
			id: 'RC4',
			title: 'TypeScript RU definitions ignored by availability filter',
			detail:
				'percentage-of-a-number and loan-payment have full RU CalculatorDefinition in data/calculators.ts but no locales/ru items file, so they are hidden from RU catalog/search/sitemap.',
		},
		{
			id: 'RC5',
			title: 'Silent catch in registry loader',
			detail:
				'JSON read/parse failures in LocalCalculatorLoader.getAll/getByCategory are swallowed, masking broken schemas.',
		},
		{
			id: 'RC6',
			title:
				'Direct RU URLs for missing items still 200 with English fallback + noindex',
			detail:
				'Confirmed on production for mortgage-calculator; orphans like /ru/calculators/math/gcd return 404.',
		},
	],
	productionSpotCheck: {
		ruCatalogLinks: [
			'calculators/construction/cement-calculator',
			'calculators/construction/concrete-volume-calculator',
			'calculators/construction/sand-calculator',
			'calculators/finance/roi-calculator',
			'calculators/math/square-root',
		],
		orphanGcd: '404',
		mortgageRu: '200 with EN fallback expected',
		percentageRu: '200 (TS RU content; not in catalog)',
		loanPaymentRu: '200 (TS RU content; not in catalog)',
		chisloPropisyu: '200',
		tools: '200',
		sitemapRuCalculators: 5,
	},
}

fs.mkdirSync(path.join(root, 'reports'), { recursive: true })
const report = {
	summary,
	liveSchemas,
	orphanRuItems,
	tsOnlyCalculators: tsOnly,
	ruOverlays,
}
fs.writeFileSync(
	path.join(root, 'reports/ru-catalog-inventory.json'),
	JSON.stringify(report, null, 2),
)

const csvEscape = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`
const all = [
	...liveSchemas.map((r) => ({ ...r, kind: 'live_schema' })),
	...orphanRuItems.map((r) => ({ ...r, kind: 'orphan_ru' })),
	...tsOnly.map((r) => ({ ...r, kind: 'ts_only' })),
]
const header = [
	'kind',
	'id',
	'slug',
	'category',
	'definitionSource',
	'enabled',
	'enginePresent',
	'ruItem',
	'enItem',
	'inRuCatalog',
	'directUrlAvailable',
	'indexableRu',
	'inSitemapRu',
	'absenceReasons',
]
const lines = [header.join(',')]
for (const r of all) {
	lines.push(
		[
			r.kind,
			r.id,
			r.slug,
			r.category,
			r.definitionSource,
			r.enabled,
			r.enginePresent,
			r.localesPresent?.ru,
			r.localesPresent?.en,
			r.inRuCatalog,
			r.directUrlAvailable,
			r.indexableRu,
			r.inSitemapRu,
			(r.absenceReasons || []).join('|'),
		]
			.map(csvEscape)
			.join(','),
	)
}
fs.writeFileSync(
	path.join(root, 'reports/ru-catalog-inventory.csv'),
	`${lines.join('\n')}\n`,
)

console.log(JSON.stringify(summary, null, 2))
