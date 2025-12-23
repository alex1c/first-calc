import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchProvider } from '@/components/search/search-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Calculator Portal',
	description: 'Portal for various calculators and tools',
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










