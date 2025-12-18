/**
 * Next.js Middleware for locale routing
 * 
 * Handles locale-based routing with special rules for English (default locale):
 * - English URLs work without /en prefix (e.g., /calculators instead of /en/calculators)
 * - URLs with /en prefix redirect to path without /en (301 redirect)
 * - Other locales (ru, es, tr, hi) require prefix (e.g., /ru/calculators)
 * - Paths without locale prefix are internally rewritten to /en
 * 
 * This ensures clean URLs for English while maintaining locale support for other languages.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'

/**
 * Extract locale from pathname
 * 
 * Checks if the first segment of the pathname matches a supported locale.
 * 
 * @param pathname - The request pathname (e.g., "/en/calculators" or "/ru/calculators")
 * @returns The locale string if found, null otherwise
 * 
 * @example
 * getLocale("/en/calculators") // returns "en"
 * getLocale("/ru/calculators") // returns "ru"
 * getLocale("/calculators") // returns null
 */
function getLocale(pathname: string): string | null {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length === 0) return null
	const firstSegment = segments[0]
	return locales.includes(firstSegment as any) ? firstSegment : null
}

/**
 * Check if path should be excluded from locale processing
 * 
 * Excludes API routes, Next.js internal routes, and static files from locale handling.
 * 
 * @param pathname - The request pathname
 * @returns true if path should be excluded, false otherwise
 */
function shouldExclude(pathname: string): boolean {
	// Exclude API routes (e.g., /api/calculators)
	if (pathname.startsWith('/api')) return true
	
	// Exclude Next.js internal routes (e.g., /_next/static, /_next/image)
	if (pathname.startsWith('/_next')) return true
	
	// Exclude files with extensions at the end (e.g., .js, .css, .png, .ico)
	// But allow decimal numbers in paths (e.g., /45.2/2.3-add, /25.5/2.5)
	// Only exclude if the extension is at the very end and is a known file extension
	const knownExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.xml', '.pdf', '.txt', '.woff', '.woff2', '.ttf', '.eot']
	
	// Check if pathname ends with a known file extension
	// Split by '/' to get the last segment
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length > 0) {
		const lastSegment = segments[segments.length - 1]
		const lastDotIndex = lastSegment.lastIndexOf('.')
		if (lastDotIndex > 0) {
			const extension = lastSegment.substring(lastDotIndex)
			// Only exclude if it's a known extension and the segment ends with it
			// This allows decimal numbers like /45.2/2.3-add where 2.3-add is not a file extension
			if (knownExtensions.includes(extension.toLowerCase()) && lastSegment.endsWith(extension)) {
				return true
			}
		}
	}
	
	return false
}

/**
 * Check if pathname matches numeric range pattern
 * Matches patterns like: /10000-19999 or /210000-219999/213500-213549
 * 
 * @param pathname - The request pathname
 * @returns true if pathname matches numeric range pattern
 */
function isNumericRange(pathname: string): boolean {
	// Remove leading slash and trailing slash if present
	const cleanPath = pathname.replace(/^\/|\/$/g, '')
	// Match pattern: digits-digits optionally followed by /digits-digits (repeated)
	const rangePattern = /^\d+-\d+(\/\d+-\d+)*$/
	return rangePattern.test(cleanPath)
}

/**
 * Next.js middleware function
 * 
 * Processes all incoming requests and handles locale routing according to the rules:
 * 1. If path starts with /en → 301 redirect to path without /en
 * 2. If path starts with other locale (ru, es, tr, hi) → allow through
 * 3. If path has no locale → internally rewrite to /en (preserves URL)
 * 
 * @param request - The incoming Next.js request
 * @returns NextResponse with redirect, rewrite, or next() call
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Skip processing for excluded paths (API, static files, etc.)
	if (shouldExclude(pathname)) {
		return NextResponse.next()
	}

	const detectedLocale = getLocale(pathname)

	// Case 1: Path starts with /en - redirect to path without /en (301 permanent redirect)
	// This ensures clean URLs for English (default locale)
	// Example: /en/calculators → /calculators
	if (detectedLocale === 'en') {
		const pathWithoutLocale = pathname.replace(/^\/en/, '') || '/'
		const newUrl = new URL(pathWithoutLocale, request.url)
		return NextResponse.redirect(newUrl, { status: 301 })
	}

	// Case 2: Path starts with other locale (ru, es, tr, hi) - allow through
	// These locales require prefix for clarity
	// Example: /ru/calculators → allowed as-is
	if (detectedLocale && detectedLocale !== 'en') {
		return NextResponse.next()
	}

	// Case 3: Check if pathname matches numeric range pattern (e.g., /10000-19999)
	// Rewrite to /en/(legacy)/range/... (or with current locale if detected)
	// Example: /10000-19999 → /en/(legacy)/range/10000-19999
	// Example: /210000-219999/213500-213549 → /en/(legacy)/range/210000-219999/213500-213549
	if (isNumericRange(pathname)) {
		const locale = detectedLocale || defaultLocale
		const rewritePath = `/${locale}/(legacy)/range${pathname}`
		const url = request.nextUrl.clone()
		url.pathname = rewritePath
		return NextResponse.rewrite(url)
	}

	// Case 4: Path doesn't start with any locale - rewrite to /en internally
	// This preserves the URL in the browser but routes to /en internally
	// Example: /calculators → internally routes to /en/calculators (URL stays /calculators)
	const rewritePath = `/en${pathname}`
	const url = request.nextUrl.clone()
	url.pathname = rewritePath
	return NextResponse.rewrite(url)
}

export const config = {
	// Match all pathnames except files with extensions and API routes
	// Allow dots in paths for decimal numbers (e.g., /25.5/2.5, /45.2/2.3-add)
	// Only exclude files with extensions at the end (e.g., .js, .css, .png)
	// Pattern explanation:
	// - Exclude /api routes
	// - Exclude /_next/static and /_next/image
	// - Exclude favicon.ico
	// - Exclude files ending with known extensions (but allow dots in middle of path)
	matcher: [
		'/((?!api|_next/static|_next/image|favicon\\.ico).*)',
	],
}





