'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { locales, type Locale } from '@/lib/i18n'
import { SearchButton } from '@/components/search/search-button'
import { Logo } from '@/components/logo'
import { localePath } from '@/lib/site-url'
import { resolveUiLocaleFromPathname } from '@/lib/i18n/resolve-ui-locale'

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

function useClientTranslations(
	locale: Locale,
	initialDict: Record<string, unknown> = {},
	initialLocale: Locale,
) {
	const [dict, setDict] = useState<Record<string, any>>(
		locale === initialLocale ? initialDict : {},
	)

	useEffect(() => {
		import(`@/locales/${locale}/navigation.json`)
			.then((module) => {
				setDict(module.default || module)
			})
			.catch(() => {
				import(`@/locales/en/navigation.json`)
					.then((module) => {
						setDict(module.default || module)
					})
					.catch(() => {
						setDict({
							menu: {
								calculators: 'Calculators',
								standards: 'Standards',
								tools: 'Tools',
								learn: 'Learn',
								about: 'About',
								contact: 'Contact',
							},
						})
					})
			})
	}, [locale])

	return (key: string) => {
		const keys = key.split('.')
		let value: any = dict
		for (const k of keys) {
			value = value?.[k]
		}
		return typeof value === 'string' ? value : key
	}
}

export function Header({ initialLocale, initialNav = {} }: HeaderProps) {
	const pathname = usePathname()
	// Pathname is the single client-nav source of truth (same helper as SSR).
	const currentLocale = resolveUiLocaleFromPathname(pathname) || initialLocale
	const t = useClientTranslations(currentLocale, initialNav, initialLocale)

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
								{t(`menu.${item.key}`)}
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
								window.location.href = localePath(newLocale, currentLogicalPath)
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
