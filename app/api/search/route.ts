import { NextResponse } from 'next/server'
import { searchPortal } from '@/lib/search'
import type { Locale } from '@/lib/i18n'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q') || ''
	const locale = (searchParams.get('locale') || 'en') as Locale
	const limitParam = searchParams.get('limit')
	const limit = limitParam ? Number(limitParam) : undefined

	if (query.trim().length < 2) {
		return NextResponse.json({
			calculators: { items: [], total: 0 },
			articles: { items: [], total: 0 },
			standards: { items: [], total: 0 },
			fallbackLocaleUsed: false,
			usedLocale: locale,
		})
	}

	const results = await searchPortal(query, locale, {
		limitPerType: limit,
	})

	return NextResponse.json(results)
}





