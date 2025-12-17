'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
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
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')

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

	// Handle search form submission
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/${currentLocale}/search?q=${encodeURIComponent(searchQuery.trim())}`)
		}
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

					{/* Search */}
					<div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
						<form onSubmit={handleSearch} className="flex-1 flex gap-2">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search..."
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</form>
					</div>

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

