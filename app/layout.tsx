import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchProvider } from '@/components/search/search-provider'
import { YandexMetrika } from '@/components/analytics/yandex-metrika'
import { isIndexingDisabled, PRODUCTION_ORIGIN } from '@/lib/site-url'
import { locales, type Locale } from '@/lib/i18n'
import {
	GOOGLE_SITE_VERIFICATION,
	YANDEX_WEBMASTER_VERIFICATION,
} from '@/lib/analytics/yandex-metrika'

const indexingDisabled = isIndexingDisabled()

export const metadata: Metadata = {
	metadataBase: new URL(PRODUCTION_ORIGIN),
	title: 'First Calc',
	description: 'Portal for various calculators and tools',
	verification: {
		google: GOOGLE_SITE_VERIFICATION,
		other: {
			'yandex-verification': YANDEX_WEBMASTER_VERIFICATION,
		},
	},
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
				<YandexMetrika />
				<noscript>
					<div>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="https://mc.yandex.ru/watch/48325316"
							style={{ position: 'absolute', left: '-9999px' }}
							alt=""
						/>
					</div>
				</noscript>
				<SearchProvider>
					<Header />
					<main className="min-h-screen">{children}</main>
					<Footer />
				</SearchProvider>
			</body>
		</html>
	)
}









