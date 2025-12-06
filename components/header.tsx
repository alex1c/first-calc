'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

// Navigation menu items
const menuItems = [
	{ href: '/calculators', label: 'Calculators' },
	{ href: '/standards', label: 'Standards' },
	{ href: '/tools', label: 'Tools' },
	{ href: '/learn', label: 'Learn' },
	{ href: '/api', label: 'API' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
]

export function Header() {
	const pathname = usePathname()

	// Extract current locale from pathname
	// Pathname format: /en, /ru/calculators, etc.
	const pathSegments = pathname?.split('/').filter(Boolean) || []
	const currentLocale =
		(pathSegments[0] && locales.includes(pathSegments[0] as Locale))
			? (pathSegments[0] as Locale)
			: 'en'

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
								{item.label}
							</Link>
						))}
					</nav>

					{/* Language switcher placeholder */}
					<div className="flex items-center gap-2">
						<select
							className="px-3 py-1 border border-gray-300 rounded-md text-sm"
							value={currentLocale}
							onChange={(e) => {
								const newLocale = e.target.value as Locale
								// Get path segments without locale
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

