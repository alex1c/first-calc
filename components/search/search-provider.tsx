'use client'

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from 'react'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'
import { SearchModal } from './search-modal'

interface SearchContextValue {
	openSearch: () => void
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

function deriveLocale(pathname: string | null): Locale {
	if (!pathname) return 'en'
	const segments = pathname.split('/').filter(Boolean)
	const candidate = segments[0]
	if (candidate && locales.includes(candidate as Locale)) {
		return candidate as Locale
	}
	return 'en'
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	const locale = useMemo(() => deriveLocale(pathname), [pathname])

	const openSearch = useCallback(() => setIsOpen(true), [])
	const closeSearch = useCallback(() => setIsOpen(false), [])

	useEffect(() => {
		function handleShortcut(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				setIsOpen(true)
			}
		}

		window.addEventListener('keydown', handleShortcut)
		return () => window.removeEventListener('keydown', handleShortcut)
	}, [])

	return (
		<SearchContext.Provider value={{ openSearch }}>
			{children}
			<SearchModal isOpen={isOpen} locale={locale} onClose={closeSearch} />
		</SearchContext.Provider>
	)
}

export function useSearch() {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error('useSearch must be used within SearchProvider')
	}
	return context
}



