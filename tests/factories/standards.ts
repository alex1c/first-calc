import type { StandardDefinition } from '@/lib/standards/types'

/**
 * Factory for creating test standard definitions
 */
export function createTestStandard(
	overrides?: Partial<StandardDefinition>,
): StandardDefinition {
	return {
		id: 'test-standard',
		title: 'Test Standard',
		shortDescription: 'A test standard',
		longDescription: 'A test standard for testing purposes.',
		country: 'us',
		slug: 'test-standard',
		locale: 'en',
		...overrides,
	}
}

/**
 * Create a Russian standard for testing locale behavior
 */
export function createRussianStandard(
	locale: 'en' | 'ru' = 'en',
): StandardDefinition {
	return createTestStandard({
		id: 'sp24-soil-foundations',
		title: locale === 'ru' ? 'СП 24.13330 – грунты и фундаменты' : 'SP 24.13330 – Soil & Foundations',
		shortDescription: locale === 'ru' 
			? 'Образовательный обзор СП 24.13330'
			: 'Educational overview of SP 24.13330',
		longDescription: locale === 'ru'
			? 'Подробное описание стандарта СП 24.13330'
			: 'Detailed description of SP 24.13330 standard',
		country: 'ru',
		slug: 'sp24-soil-foundations',
		locale,
	})
}

