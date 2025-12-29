'use client'

import { useSearch } from '@/components/search/search-provider'

interface SearchInputProps {
	placeholder: string
}

export function SearchInput({ placeholder }: SearchInputProps) {
	const { openSearch } = useSearch()

	return (
		<button
			type="button"
			onClick={openSearch}
			className="w-full max-w-2xl mx-auto flex items-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-left shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
		>
			<svg
				className="h-5 w-5 text-gray-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<circle cx="11" cy="11" r="8" strokeWidth="1.5" />
				<path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
			<span className="flex-1 text-gray-500">{placeholder}</span>
			<span className="hidden sm:inline text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">
				Ctrl / Cmd + K
			</span>
		</button>
	)
}



