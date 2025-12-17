import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'

// Get locale from pathname
function getLocale(pathname: string): string | null {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length === 0) return null
	const firstSegment = segments[0]
	return locales.includes(firstSegment as any) ? firstSegment : null
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if pathname already has a locale
	const pathnameHasLocale = getLocale(pathname)

	// If no locale in pathname, redirect to default locale
	if (!pathnameHasLocale) {
		const locale = defaultLocale
		const newUrl = new URL(`/${locale}${pathname}`, request.url)
		return NextResponse.redirect(newUrl)
	}

	return NextResponse.next()
}

export const config = {
	// Match all pathnames except files with extensions and API routes
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|).*)',
	],
}





