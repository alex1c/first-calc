/**
 * Tags system for calculators
 * Provides tag definitions, top tags, and filtering utilities
 * 
 * @deprecated Use lib/tags/definitions.ts for tag definitions
 * This file is kept for backward compatibility
 */

import { tagDefinitions, getTagLabel } from '@/lib/tags/definitions'

/**
 * Allowed tags for calculators (from centralized definitions)
 * Used for validation and filtering
 */
export const allowedTags = tagDefinitions.map((tag) => tag.id) as readonly string[]

/**
 * Type for allowed tag values
 */
export type AllowedTag = (typeof allowedTags)[number]

/**
 * Check if a tag is allowed
 */
export function isAllowedTag(tag: string): tag is AllowedTag {
	return allowedTags.includes(tag)
}

/**
 * Get top tags (limited to top N)
 * 
 * @deprecated Use lib/tags/usage.ts getTopUsedTags() instead
 * This function is kept for backward compatibility but now uses dynamic data
 */
export async function getTopTags(limit: number = 20): Promise<string[]> {
	const { getTopUsedTags } = await import('@/lib/tags/usage')
	const tags = await getTopUsedTags('en', limit, false)
	return tags.map((tag) => tag.id)
}




