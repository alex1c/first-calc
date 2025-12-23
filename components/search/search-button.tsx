'use client'

import { useSearch } from './search-provider'

export function SearchButton() {
	const { openSearch } = useSearch()

	return (
		<button
			type="button"
			onClick={openSearch}
			className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
		>
			<svg
				className="h-4 w-4 text-slate-500"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<circle cx="11" cy="11" r="8" strokeWidth="1.5" />
				<path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
			<span className="hidden sm:inline">Search</span>
			<span className="text-xs text-slate-400 hidden lg:inline">Ctrl / Cmd + K</span>
		</button>
	)
}

