import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

function walk(dir, acc = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) walk(full, acc)
		else if (entry.name.endsWith('.tsx')) acc.push(full)
	}
	return acc
}

const needle = 'href={`/${locale}/learn/${article.slug}`}'
const files = walk('app')
let n = 0
for (const file of files) {
	let content = readFileSync(file, 'utf8')
	if (!content.includes(needle)) continue
	if (!content.includes('learnArticlePath')) {
		if (content.includes("from '@/lib/site-url'")) {
			content = content.replace(
				"from '@/lib/site-url'",
				"from '@/lib/site-url'\nimport { learnArticlePath } from '@/lib/i18n/content-links'",
			)
		} else {
			content =
				"import { learnArticlePath } from '@/lib/i18n/content-links'\n" +
				content
		}
	}
	content = content.split(needle).join('href={learnArticlePath(article)}')
	writeFileSync(file, content)
	console.log('patched', file)
	n++
}
console.log('total', n)
