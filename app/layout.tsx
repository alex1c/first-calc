import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchProvider } from '@/components/search/search-provider'
import { isIndexingDisabled, PRODUCTION_ORIGIN } from '@/lib/site-url'
import { locales, type Locale } from '@/lib/i18n'

const indexingDisabled = isIndexingDisabled()

export const metadata: Metadata = {
	metadataBase: new URL(PRODUCTION_ORIGIN),
	title: 'Calculator Portal',
	description: 'Portal for various calculators and tools',
	// Add noindex, nofollow for test environment
	...(indexingDisabled && {
		robots: {
			index: false,
			follow: false,
		},
	}),
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const requestedLocale = headers().get('x-first-calc-locale')
	const locale: Locale = locales.includes(requestedLocale as Locale)
		? (requestedLocale as Locale)
		: 'en'
	return (
		<html lang={locale}>
			<body>
				<SearchProvider>
					<Header />
					<main className="min-h-screen">{children}</main>
					<Footer />
				</SearchProvider>
			</body>
		</html>
	)
}









