import { enSynonyms } from './en'
import { ruSynonyms } from './ru'
import type { Locale } from '@/lib/i18n'

const localesMap: Record<Locale, Record<string, string[]>> = {
	en: enSynonyms,
	ru: ruSynonyms,
	es: {},
	tr: {},
	hi: {},
}

export function getSynonyms(locale: Locale): Record<string, string[]> {
	return localesMap[locale] || {}
}



