import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchProvider } from '@/components/search/search-provider'

const inter = Inter({ subsets: ['latin'] })

// Check if this is test environment
// Test environment is determined by:
// 1. NEXT_PUBLIC_BASE_URL contains 'test.first-calc.com'
// 2. NEXT_PUBLIC_ENV is set to 'test'
// 3. NODE_ENV is development (for local testing)
const isTestEnvironment = 
	process.env.NEXT_PUBLIC_BASE_URL?.includes('test.first-calc.com') ||
	process.env.NEXT_PUBLIC_ENV === 'test' ||
	process.env.NODE_ENV === 'development'

export const metadata: Metadata = {
	title: 'Calculator Portal',
	description: 'Portal for various calculators and tools',
	// Add noindex, nofollow for test environment
	...(isTestEnvironment && {
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
	return (
		<html lang="en">
			<body className={inter.className}>
				<SearchProvider>
					<Header />
					<main className="min-h-screen">{children}</main>
					<Footer />
				</SearchProvider>
			</body>
		</html>
	)
}










