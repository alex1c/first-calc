'use client'

import { Suspense, useEffect, useRef } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import {
	getYandexMetrikaBootstrap,
	YANDEX_METRIKA_COUNTER_ID,
} from '@/lib/analytics/yandex-metrika'

declare global {
	interface Window {
		ym?: (...args: unknown[]) => void
	}
}

function NavigationTracker() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const previousUrl = useRef<string | null>(null)
	const search = searchParams.toString()

	useEffect(() => {
		const currentUrl = window.location.href

		if (previousUrl.current === null) {
			previousUrl.current = currentUrl
			return
		}

		if (currentUrl === previousUrl.current || !window.ym) return

		window.ym(YANDEX_METRIKA_COUNTER_ID, 'hit', currentUrl, {
			title: document.title,
			referer: previousUrl.current,
		})
		previousUrl.current = currentUrl
	}, [pathname, search])

	return null
}

export function YandexMetrika() {
	return (
		<>
			<Script
				id="yandex-metrika"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{ __html: getYandexMetrikaBootstrap() }}
			/>
			<Suspense fallback={null}>
				<NavigationTracker />
			</Suspense>
		</>
	)
}
