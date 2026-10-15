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
import { SearchModal } from './search-modal'
import { resolveUiLocaleFromPathname } from '@/lib/i18n/resolve-ui-locale'

interface SearchContextValue {
	openSearch: () => void
	locale: Locale
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	// Same pathname→locale rules as Header/Footer/html lang (incl. historical RU).
	const locale = useMemo(
		() => resolveUiLocaleFromPathname(pathname),
		[pathname],
	)

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
		<SearchContext.Provider value={{ openSearch, locale }}>
			<div
				className="contents"
				aria-hidden={isOpen || undefined}
				{...({ inert: isOpen ? '' : undefined } as Record<string, string | undefined>)}
			>
				{children}
			</div>
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






