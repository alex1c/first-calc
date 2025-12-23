/**
 * Compatibility cluster definitions
 * Used by the compatibility hub page to show themed groups
 */

export type CompatibilityCluster =
	| 'dating'
	| 'zodiac'
	| 'numerology'
	| 'friendship'
	| 'work'

export const compatibilityClusters: Record<
	CompatibilityCluster,
	{
		calculatorIds: string[]
		icon: string
	}
> = {
	dating: {
		calculatorIds: ['birth-date-compatibility', 'love-compatibility'],
		icon: '💘',
	},
	zodiac: {
		calculatorIds: ['zodiac-compatibility'],
		icon: '✨',
	},
	numerology: {
		calculatorIds: ['numerology-compatibility'],
		icon: '🔢',
	},
	friendship: {
		calculatorIds: ['friendship-compatibility'],
		icon: '🤝',
	},
	work: {
		calculatorIds: ['work-compatibility'],
		icon: '💼',
	},
}


