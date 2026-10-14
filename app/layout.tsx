import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchProvider } from '@/components/search/search-provider'
import { YandexMetrika } from '@/components/analytics/yandex-metrika'
import { isIndexingDisabled, PRODUCTION_ORIGIN } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'
import { loadNamespaces } from '@/lib/i18n'
import {
	GOOGLE_SITE_VERIFICATION,
	YANDEX_WEBMASTER_VERIFICATION,
} from '@/lib/analytics/yandex-metrika'
import {
	HEADER_HTML_LANG,
	HEADER_ROUTING_LOCALE,
	HEADER_UI_LOCALE,
	parseLocaleHeader,
} from '@/lib/request-headers'

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

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const headerList = headers()
	// Values originate from middleware pathname classification only
	// (client-supplied copies are stripped before these are set).
	const routingLocale = parseLocaleHeader(
		headerList.get(HEADER_ROUTING_LOCALE),
		'en',
	)
	const uiLocale = parseLocaleHeader(
		headerList.get(HEADER_UI_LOCALE),
		routingLocale,
	)
	const htmlLangOverride = headerList.get(HEADER_HTML_LANG)
	const htmlLang: Locale =
		htmlLangOverride === 'ru' || htmlLangOverride === 'en'
			? htmlLangOverride
			: routingLocale
	const navDict = await loadNamespaces(uiLocale, ['navigation'])

	return (
		<html lang={htmlLang}>
			<head>
				{/* Yandex Autoplacement 19853636 */}
				<script src="https://yandex.ru/ads/system/context.js" async />
				<script
					data-page-id="19853636"
					src="https://yandex.ru/ads/system/ap-loader.js"
					async
				/>
			</head>
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
					{/* Server-passed UI locale + nav dict: no spoofing, no hydration drift. */}
					<Header
						locale={uiLocale}
						initialNav={
							(navDict.navigation as Record<string, unknown>) || {}
						}
					/>
					<main className="min-h-screen">{children}</main>
					<Footer locale={uiLocale} />
				</SearchProvider>
			</body>
		</html>
	)
}
