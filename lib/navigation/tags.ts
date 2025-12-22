/**
 * Tags system for calculators
 * Provides tag definitions, top tags, and filtering utilities
 */

/**
 * Allowed tags for calculators
 * Used for validation and filtering
 */
export const allowedTags = [
	'finance',
	'auto',
	'tax',
	'loan',
	'mortgage',
	'percent',
	'area',
	'volume',
	'date',
	'time',
	'health',
	'bmi',
	'pregnancy',
	'converter',
	'temperature',
	'speed',
	'pressure',
	'energy',
	'gpa',
	'random',
	'password',
	'qr',
	'ip',
	'crypto',
	'construction',
	'concrete',
	'paint',
	'wallpaper',
	'roof',
	'electrical',
	'age',
	'calendar',
	'timer',
	'countdown',
	'weight',
	'length',
	'data',
	'angle',
	'fun',
	'generator',
] as const

/**
 * Top tags (most popular/used)
 */
export const topTags: string[] = [
	'finance',
	'loan',
	'mortgage',
	'percent',
	'converter',
	'area',
	'volume',
	'date',
	'time',
	'health',
	'bmi',
	'construction',
	'auto',
	'tax',
	'temperature',
	'speed',
	'random',
	'password',
	'qr',
	'crypto',
]

/**
 * Type for allowed tag values
 */
export type AllowedTag = (typeof allowedTags)[number]

/**
 * Check if a tag is allowed
 */
export function isAllowedTag(tag: string): tag is AllowedTag {
	return allowedTags.includes(tag as AllowedTag)
}

/**
 * Get top tags (limited to top N)
 */
export function getTopTags(limit: number = 20): string[] {
	return topTags.slice(0, limit)
}



