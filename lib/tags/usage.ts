/**
 * Tag usage analysis
 * Scans calculators to find which tags are actually used
 * and provides utilities for displaying tags in UI
 */

import { calculatorRegistry } from '@/lib/registry/loader'
import { tagDefinitions, getTagDefinition, getTagLabel, type TagDefinition } from './definitions'
import type { Locale } from '@/lib/i18n'
import type { CalculatorDefinition } from '@/lib/calculators/types'

/**
 * Get all tag IDs that are actually used by calculators
 */
export async function getUsedTagIds(locale: Locale = 'en'): Promise<string[]> {
	const calculators = await calculatorRegistry.getAll(locale)
	const tagSet = new Set<string>()

	for (const calc of calculators) {
		if (calc.tags && calc.tags.length > 0) {
			for (const tag of calc.tags) {
				// Only include tags that exist in definitions
				if (getTagDefinition(tag)) {
					tagSet.add(tag)
				}
			}
		}
	}

	return Array.from(tagSet)
}

/**
 * Get tag definitions for tags that are actually used
 * Returns array with id, label, and group
 */
export async function getUsedTags(
	locale: Locale = 'en',
): Promise<Array<{ id: string; label: string; group: 'domain' | 'topic' | 'intent' }>> {
	const usedIds = await getUsedTagIds(locale)
	const tags: Array<{ id: string; label: string; group: 'domain' | 'topic' | 'intent' }> = []

	for (const tagId of usedIds) {
		const definition = getTagDefinition(tagId)
		if (definition) {
			tags.push({
				id: tagId,
				label: getTagLabel(tagId, locale),
				group: definition.group,
			})
		}
	}

	return tags
}

/**
 * Count tag frequency across calculators
 */
export async function getTagFrequency(
	locale: Locale = 'en',
): Promise<Record<string, number>> {
	const calculators = await calculatorRegistry.getAll(locale)
	const frequency: Record<string, number> = {}

	for (const calc of calculators) {
		if (calc.tags && calc.tags.length > 0) {
			for (const tag of calc.tags) {
				if (getTagDefinition(tag)) {
					frequency[tag] = (frequency[tag] || 0) + 1
				}
			}
		}
	}

	return frequency
}

/**
 * Get top used tags sorted by frequency
 * Excludes intent tags by default (for UI display)
 * 
 * @param locale - Locale for labels
 * @param limit - Maximum number of tags to return
 * @param includeIntent - Whether to include intent tags (default: false)
 */
export async function getTopUsedTags(
	locale: Locale = 'en',
	limit: number = 20,
	includeIntent: boolean = false,
): Promise<Array<{ id: string; label: string; count: number; group: 'domain' | 'topic' | 'intent' }>> {
	const frequency = await getTagFrequency(locale)
	const usedTags = await getUsedTags(locale)

	// Filter out intent tags unless explicitly requested
	const filteredTags = includeIntent
		? usedTags
		: usedTags.filter((tag) => tag.group !== 'intent')

	// Map to include frequency and sort
	const tagsWithCount = filteredTags
		.map((tag) => ({
			...tag,
			count: frequency[tag.id] || 0,
		}))
		.filter((tag) => tag.count > 0) // Only tags that are actually used
		.sort((a, b) => {
			// Primary sort: frequency (descending)
			if (b.count !== a.count) {
				return b.count - a.count
			}

			// Tie-break: domain tags first, then topic, then intent
			const groupOrder: Record<'domain' | 'topic' | 'intent', number> = {
				domain: 0,
				topic: 1,
				intent: 2,
			}
			const aOrder = groupOrder[a.group] ?? 999
			const bOrder = groupOrder[b.group] ?? 999

			if (aOrder !== bOrder) {
				return aOrder - bOrder
			}

			// Final tie-break: alphabetical by label
			return a.label.localeCompare(b.label)
		})
		.slice(0, limit)

	return tagsWithCount
}

/**
 * Get tags used by calculators in a specific category
 */
export async function getUsedTagsForCategory(
	category: string,
	locale: Locale = 'en',
): Promise<Array<{ id: string; label: string; count: number }>> {
	const calculators = await calculatorRegistry.getByCategory(category, locale)
	const frequency: Record<string, number> = {}

	for (const calc of calculators) {
		if (calc.tags && calc.tags.length > 0) {
			for (const tag of calc.tags) {
				if (getTagDefinition(tag)) {
					frequency[tag] = (frequency[tag] || 0) + 1
				}
			}
		}
	}

	const tags = Object.entries(frequency)
		.map(([id, count]) => ({
			id,
			label: getTagLabel(id, locale),
			count,
		}))
		.sort((a, b) => {
			// Sort by frequency descending, then alphabetically
			if (b.count !== a.count) {
				return b.count - a.count
			}
			return a.label.localeCompare(b.label)
		})

	return tags
}


