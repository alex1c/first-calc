'use client'

/**
 * Keeps <html lang> aligned with the same pathname-derived UI locale used by
 * Header/Footer/Search. Runs in useLayoutEffect so lang updates with chrome
 * on soft navigations (root layout does not remount).
 */

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { resolveUiLocaleFromPathname } from '@/lib/i18n/resolve-ui-locale'

export function HtmlLangSync() {
	const pathname = usePathname()
	const locale = resolveUiLocaleFromPathname(pathname)

	useLayoutEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = locale
		}
	}, [locale])

	return null
}
