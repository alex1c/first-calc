/**
 * Calculator categories configuration
 * Generated from docs/export-calc1.json
 * 
 * Defines stable categories with icons, order, and calculator counts
 * Category names are loaded from locales/{locale}/navigation.json
 */

/**
 * Category ID type - union of all category IDs
 */
export type CategoryId =
	| 'finance'
	| 'math'
	| 'life'
	| 'construction'
	| 'auto'
	| 'time'
	| 'health'
	| 'science'
	| 'converter'
	| 'fun'
	| 'it'

/**
 * Category configuration interface
 */
export interface CategoryConfig {
	id: CategoryId
	order: number
	iconKey: string
	calcCount: number
}

/**
 * Category list with order, icons, and calculator counts
 * Display names come from navigation.json translations
 */
export const categories: CategoryConfig[] = [
	{
		id: 'finance',
		order: 1,
		iconKey: '💰',
		calcCount: 12,
	},
	{
		id: 'math',
		order: 2,
		iconKey: '🔢',
		calcCount: 8,
	},
	{
		id: 'life',
		order: 3,
		iconKey: '📱',
		calcCount: 14,
	},
	{
		id: 'construction',
		order: 4,
		iconKey: '🏗️',
		calcCount: 20,
	},
	{
		id: 'auto',
		order: 5,
		iconKey: '🚗',
		calcCount: 11,
	},
	{
		id: 'time',
		order: 6,
		iconKey: '⏰',
		calcCount: 9,
	},
	{
		id: 'health',
		order: 7,
		iconKey: '🏥',
		calcCount: 8,
	},
	{
		id: 'science',
		order: 8,
		iconKey: '🔬',
		calcCount: 1,
	},
	{
		id: 'converter',
		order: 9,
		iconKey: '🔄',
		calcCount: 9,
	},
	{
		id: 'fun',
		order: 10,
		iconKey: '🎮',
		calcCount: 12,
	},
	{
		id: 'it',
		order: 11,
		iconKey: '💻',
		calcCount: 3,
	},
]

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryConfig | undefined {
	return categories.find((cat) => cat.id === id)
}

/**
 * Get all category IDs in order
 */
export function getCategoryIds(): CategoryId[] {
	return categories.sort((a, b) => a.order - b.order).map((cat) => cat.id)
}

/**
 * Get category icon
 */
export function getCategoryIcon(categoryId: string): string {
	const category = getCategoryById(categoryId)
	return category?.iconKey || '📋'
}

/**
 * Get category metadata with i18n support
 * 
 * @param categoryId - Category ID
 * @param locale - Locale code
 * @param t - Translation function from createT()
 * @returns Category metadata with translated name and description
 */
export function getCategoryMeta(
	categoryId: string,
	locale: string,
	t: (key: string) => string,
): {
	id: string
	iconKey: string
	order: number
	calcCount: number
	name: string
	description: string
} {
	const category = getCategoryById(categoryId)
	if (!category) {
		return {
			id: categoryId,
			iconKey: '📋',
			order: 999,
			calcCount: 0,
			name: categoryId,
			description: '',
		}
	}

	const name = t(`navigation.categories.${categoryId}`) || categoryId
	const description =
		t(`navigation.categoryDescriptions.${categoryId}`) || ''

	return {
		id: category.id,
		iconKey: category.iconKey,
		order: category.order,
		calcCount: category.calcCount,
		name,
		description,
	}
}
