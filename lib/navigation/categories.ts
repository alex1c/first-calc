/**
 * Calculator categories configuration
 * 
 * Defines stable categories with icons, order, and i18n support
 * Category names are loaded from locales/{locale}/navigation.json
 */

export interface CategoryConfig {
	id: string
	iconKey: string
	order: number
}

/**
 * Stable category list with order and icons
 * Display names come from navigation.json translations
 */
export const CATEGORIES: CategoryConfig[] = [
	{
		id: 'math',
		iconKey: '🔢',
		order: 1,
	},
	{
		id: 'finance',
		iconKey: '💰',
		order: 2,
	},
	{
		id: 'geometry',
		iconKey: '📐',
		order: 3,
	},
	{
		id: 'everyday',
		iconKey: '📱',
		order: 4,
	},
	{
		id: 'engineering',
		iconKey: '⚙️',
		order: 5,
	},
	{
		id: 'business',
		iconKey: '📊',
		order: 6,
	},
]

/**
 * Get category by ID
 */
export function getCategory(id: string): CategoryConfig | undefined {
	return CATEGORIES.find((cat) => cat.id === id)
}

/**
 * Get all category IDs in order
 */
export function getCategoryIds(): string[] {
	return CATEGORIES.sort((a, b) => a.order - b.order).map((cat) => cat.id)
}

/**
 * Get category icon
 */
export function getCategoryIcon(categoryId: string): string {
	const category = getCategory(categoryId)
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
	name: string
	description: string
} {
	const category = getCategory(categoryId)
	if (!category) {
		return {
			id: categoryId,
			iconKey: '📋',
			order: 999,
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
		name,
		description,
	}
}

