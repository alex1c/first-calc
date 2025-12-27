'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { locales, type Locale } from '@/lib/i18n'
import { SearchButton } from '@/components/search/search-button'

// Navigation menu items (will be replaced with i18n in server component)
const menuItems = [
	{ href: '/calculators', key: 'calculators' },
	{ href: '/standards', key: 'standards' },
	{ href: '/tools', key: 'tools' },
	{ href: '/learn', key: 'learn' },
	{ href: '/about', key: 'about' },
	{ href: '/contact', key: 'contact' },
]

// Client-side translation hook (simplified - in production, use proper i18n context)
function useClientTranslations(locale: Locale) {
	const [dict, setDict] = useState<Record<string, any>>({})

	useEffect(() => {
		// Load navigation namespace on client
		import(`@/locales/${locale}/navigation.json`)
			.then((module) => {
				setDict(module.default || module)
			})
			.catch(() => {
				// Fallback to English
				import(`@/locales/en/navigation.json`)
					.then((module) => {
						setDict(module.default || module)
					})
					.catch(() => {
						// Use fallback labels
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

export function Header() {
	const pathname = usePathname()

	// Extract current locale from pathname
	// Pathname format: /en, /ru/calculators, etc.
	const pathSegments = pathname?.split('/').filter(Boolean) || []
	const currentLocale =
		(pathSegments[0] && locales.includes(pathSegments[0] as Locale))
			? (pathSegments[0] as Locale)
			: 'en'

	// Load translations
	const t = useClientTranslations(currentLocale)

	// Get path without locale for navigation
	const getLocalizedPath = (path: string) => {
		// Ensure path starts with /
		const normalizedPath = path.startsWith('/') ? path : `/${path}`
		return `/${currentLocale}${normalizedPath}`
	}

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo placeholder */}
					<Link
						href={getLocalizedPath('/')}
						className="text-2xl font-bold text-gray-900"
					>
						Calculator Portal
					</Link>

					{/* Navigation menu */}
					<nav className="hidden md:flex items-center gap-6">
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
							className="px-3 py-1 border border-gray-300 rounded-md text-sm"
							value={currentLocale}
							onChange={(e) => {
								const newLocale = e.target.value as Locale
								const pathSegments = pathname?.split('/').filter(Boolean) || []
								const pathWithoutLocale =
									pathSegments.length > 1
										? '/' + pathSegments.slice(1).join('/')
										: '/'
								window.location.href = `/${newLocale}${pathWithoutLocale}`
							}}
						>
							{locales.map((locale) => (
								<option key={locale} value={locale}>
									{locale.toUpperCase()}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</header>
	)
}

