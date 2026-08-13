import { describe, expect, it } from 'vitest'
import { getDocumentsForLocale } from '@/lib/search/documents'
import { searchPortal } from '@/lib/search/search'

describe('locale-aware search inventory', () => {
	it('does not present English fallback calculators as Spanish documents', async () => {
		const documents = await getDocumentsForLocale('es')
		expect(documents.filter((document) => document.type === 'calculator')).toHaveLength(0)
	})

	it('marks explicit English fallback results', async () => {
		const results = await searchPortal('mortgage', 'es', { limitPerType: 3 })
		expect(results.fallbackLocaleUsed).toBe(true)
		expect(results.usedLocale).toBe('en')
		expect(results.calculators.items[0]?.url).not.toContain('/en/')
	})

})
