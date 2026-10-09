/**
 * Enforce calculator schema identity: filename, slug, id, and category.
 */
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'

const dir = path.join(process.cwd(), 'data', 'calculators')

describe('calculator schema identity', () => {
	const files = readdirSync(dir).filter(
		(file) => file.endsWith('.json') && !file.includes('.ru.json'),
	)

	it('requires filename stem === slug === id for every base schema', () => {
		const violations: string[] = []
		for (const file of files) {
			const schema = JSON.parse(readFileSync(path.join(dir, file), 'utf8'))
			const stem = file.replace(/\.json$/, '')
			if (schema.slug !== stem) {
				violations.push(`${file}: slug "${schema.slug}" !== filename stem`)
			}
			if (schema.id !== stem) {
				violations.push(`${file}: id "${schema.id}" !== filename stem`)
			}
			if (schema.id !== schema.slug) {
				violations.push(`${file}: id "${schema.id}" !== slug "${schema.slug}"`)
			}
			if (!schema.category || typeof schema.category !== 'string') {
				violations.push(`${file}: missing category`)
			}
		}
		expect(violations, violations.join('\n')).toEqual([])
	})

	it('loads numbers-to-words by slug path used in routing', () => {
		expect(files).toContain('numbers-to-words.json')
		expect(files).not.toContain('numbers-to-words-calculator.json')
		const schema = JSON.parse(
			readFileSync(path.join(dir, 'numbers-to-words.json'), 'utf8'),
		)
		expect(schema.id).toBe('numbers-to-words')
		expect(schema.slug).toBe('numbers-to-words')
		expect(schema.category).toBe('everyday')
	})
})
