'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { SearchButton } from '@/components/search/search-button'
import { Logo } from '@/components/logo'
import { localePath } from '@/lib/site-url'
import { resolveUiLocaleFromPathname } from '@/lib/i18n/resolve-ui-locale'
import { useClientT, type Dictionary } from '@/lib/i18n/useClientT'

const menuItems = [
	{ href: '/calculators', key: 'calculators' },
	{ href: '/standards', key: 'standards' },
	{ href: '/tools', key: 'tools' },
	{ href: '/learn', key: 'learn' },
	{ href: '/about', key: 'about' },
	{ href: '/contact', key: 'contact' },
]

interface HeaderProps {
	/**
	 * SSR-matched UI locale from the request pathname (trusted middleware).
	 * Client navigations re-resolve from usePathname so chrome updates without
	 * waiting for a root-layout remount.
	 */
	initialLocale: Locale
	/** Server-loaded navigation dict for the initial locale (hydration parity). */
	initialNav?: Record<string, unknown>
}

export function Header({ initialLocale, initialNav = {} }: HeaderProps) {
	const pathname = usePathname()
	// Pathname is the single client-nav source of truth (same helper as SSR).
	const currentLocale = resolveUiLocaleFromPathname(pathname) || initialLocale
	const initialDict: Dictionary =
		currentLocale === initialLocale
			? { navigation: initialNav as Dictionary }
			: {}
	// Shared race-safe loader — stale RU completions cannot overwrite EN.
	const t = useClientT(currentLocale, ['navigation'], initialDict)

	const getLocalizedPath = (path: string) => {
		return localePath(currentLocale, path)
	}

	const currentLogicalPath = localePath('en', pathname || '/')

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Logo locale={currentLocale} />

					<nav className="hidden lg:flex items-center gap-6">
						{menuItems.map((item) => (
							<Link
								key={item.href}
								href={getLocalizedPath(item.href)}
								className="text-gray-700 hover:text-gray-900 transition-colors"
							>
								{t(`navigation.menu.${item.key}`)}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-3">
						<SearchButton />
						<select
							aria-label="Language"
							className="px-3 py-1 border border-gray-300 rounded-md text-sm"
							value={currentLocale}
							onChange={(e) => {
								const newLocale = e.target.value as Locale
								window.location.href = localePath(
									newLocale,
									currentLogicalPath,
								)
							}}
						>
							{locales.map((loc) => (
								<option key={loc} value={loc}>
									{loc.toUpperCase()}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</header>
	)
}
