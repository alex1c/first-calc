export type ToolGroupId = 'numbers-text' | 'converters' | 'utilities'

export interface ToolGroupConfig {
	id: ToolGroupId
	titleKey: string
	descriptionKey: string
}

export interface ToolConfig {
	path: string
	group: ToolGroupId
	icon: string
	slug?: string
	title?: string
	description?: string
}

export const toolGroups: ToolGroupConfig[] = [
	{
		id: 'numbers-text',
		titleKey: 'tools/ui.groups.numbersText.title',
		descriptionKey: 'tools/ui.groups.numbersText.description',
	},
	{
		id: 'converters',
		titleKey: 'tools/ui.groups.converters.title',
		descriptionKey: 'tools/ui.groups.converters.description',
	},
	{
		id: 'utilities',
		titleKey: 'tools/ui.groups.utilities.title',
		descriptionKey: 'tools/ui.groups.utilities.description',
	},
]

export const legacyTools: ToolConfig[] = [
	{
		path: '/numbers-to-words',
		group: 'numbers-text',
		icon: '🔤',
		slug: 'numbers-to-words',
	},
	{
		path: '/chislo-propisyu',
		group: 'numbers-text',
		icon: '📝',
		slug: 'chislo-propisyu',
	},
	{
		path: '/roman-numerals-converter',
		group: 'converters',
		icon: '🔢',
		slug: 'roman-numerals-converter',
	},
	{
		path: '/percentage-of-a-number',
		group: 'converters',
		icon: '📊',
		slug: 'percentage-of-a-number',
	},
	{
		path: '/add-subtract-percentage',
		group: 'converters',
		icon: '➗',
		slug: 'add-subtract-percentage',
	},
	{
		path: '/root-calculator',
		group: 'utilities',
		icon: '√',
		slug: 'root-calculator',
	},
	{
		path: '/range/1-100',
		group: 'numbers-text',
		icon: '📈',
		title: 'Range Table Generator',
		description: 'Generate number-to-word tables for any numeric range.',
	},
	{
		path: '/factors/360',
		group: 'utilities',
		icon: '⚙️',
		title: 'Factors Finder',
		description: 'Quickly factorize numbers like 360 into prime factors.',
	},
	{
		path: '/number-format/in/1234567',
		group: 'converters',
		icon: '💱',
		title: 'Number Format Helper',
		description: 'Format large numbers with regional separators and spacing.',
	},
]





