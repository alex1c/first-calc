export const calculatorCardTokens = {
	root: 'group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
	icon: 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
	title: 'line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600',
	description: 'mb-3 line-clamp-2 flex-grow text-sm text-gray-600',
	badge: 'rounded-full px-2 py-1 text-xs font-medium',
} as const

export const resultCardTokens = {
	base: 'min-w-0 overflow-hidden rounded-lg border p-4 md:p-6',
	title: 'text-sm font-medium text-gray-600',
	value: 'break-words text-2xl font-bold text-gray-900',
} as const
