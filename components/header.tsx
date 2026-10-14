'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { locales, type Locale } from '@/lib/i18n'
import { SearchButton } from '@/components/search/search-button'
import { Logo } from '@/components/logo'
import { localePath } from '@/lib/site-url'

// Navigation menu items (will be replaced with i18n in server component)
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
	 * Trusted UI locale from root layout (middleware pathname classification).
	 * Prefer this over pathname guessing so historical unprefixed Russian
	 * money/hub pages render Russian chrome without hydration drift.
	 */
	locale: Locale
	/** Server-loaded navigation dict (same locale) for SSR + hydration parity. */
	initialNav?: Record<string, unknown>
}

// Client-side translation hook (simplified - in production, use proper i18n context)
function useClientTranslations(
	locale: Locale,
	initialDict: Record<string, unknown> = {},
) {
	const [dict, setDict] = useState<Record<string, any>>(initialDict)

	useEffect(() => {
		// Keep client dict aligned when the trusted UI locale changes.
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

export function Header({ locale, initialNav = {} }: HeaderProps) {
	const pathname = usePathname()
	const currentLocale = locale

	// SSR and first client paint share initialNav to avoid hydration mismatch.
	const t = useClientTranslations(currentLocale, initialNav)

	const getLocalizedPath = (path: string) => {
		return localePath(currentLocale, path)
	}

	const currentLogicalPath = localePath('en', pathname || '/')

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Logo locale={currentLocale} />

					{/* Navigation menu */}
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
