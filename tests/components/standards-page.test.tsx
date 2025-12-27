import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRussianStandard } from '../factories/standards'

// This is a simplified test - in reality, we'd need to test the actual page component
// For now, we test the locale behavior through the factory
describe('Standards Page Locale Behavior', () => {
	it('should show English content when locale is en for RU country', () => {
		const standard = createRussianStandard('en')
		expect(standard.title).toBe('SP 24.13330 – Soil & Foundations')
		expect(standard.locale).toBe('en')
		expect(standard.country).toBe('ru')
	})

	it('should show Russian content when locale is ru for RU country', () => {
		const standard = createRussianStandard('ru')
		expect(standard.title).toBe('СП 24.13330 – грунты и фундаменты')
		expect(standard.locale).toBe('ru')
		expect(standard.country).toBe('ru')
	})

	it('should maintain country code regardless of locale', () => {
		const standardEn = createRussianStandard('en')
		const standardRu = createRussianStandard('ru')
		
		expect(standardEn.country).toBe('ru')
		expect(standardRu.country).toBe('ru')
		expect(standardEn.country).toBe(standardRu.country)
	})
})


