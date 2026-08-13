import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('calculator related IDs', () => {
	it('reference enabled canonical base schemas only', () => {
		const directory = path.join(process.cwd(), 'data', 'calculators')
		const schemas = fs.readdirSync(directory)
			.filter((file) => file.endsWith('.json') && !file.endsWith('.ru.json'))
			.map((file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')))
			.filter((schema) => schema.isEnabled !== false)
		const ids = new Set(schemas.map((schema) => schema.id))
		const stale = schemas.flatMap((schema) =>
			(schema.relatedIds ?? [])
				.filter((relatedId: string) => !ids.has(relatedId))
				.map((relatedId: string) => `${schema.id} -> ${relatedId}`),
		)

		expect(stale).toEqual([])
	})
})
