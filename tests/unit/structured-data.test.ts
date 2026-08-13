import { describe, expect, it } from 'vitest'
import { serializeStructuredData } from '@/lib/structured-data'

describe('serializeStructuredData', () => {
	it('escapes less-than characters without changing parsed data', () => {
		const value = { name: '</script><script>alert(1)</script>' }
		const serialized = serializeStructuredData(value)

		expect(serialized).not.toContain('<')
		expect(JSON.parse(serialized)).toEqual(value)
	})
})
