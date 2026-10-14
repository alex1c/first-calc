/**
 * Historical Russian money-proпись helpers for /chislo-propisyu/{N}-{KK}.
 *
 * All money math uses integer kopecks. VAT is treated as included in the amount
 * (выделение НДС 20%): vat = round(total * 20 / 120), matching archived examples
 * such as 5788 → 964.67.
 *
 * Seven copy variants are restored from Wayback HTML for 199-00 / 5788-00 pages.
 */

import { numberToWordsRu } from '@/lib/numberToWordsRu'

export interface MoneyAmount {
	rubles: number
	kopecks: number
	totalKopecks: number
}

export interface MoneyWords {
	/** Lowercase rubles words without currency noun, e.g. "сто девяносто девять". */
	rublesWords: string
	/** Lowercase kopecks words without noun, e.g. "ноль" / "тридцать девять". */
	kopecksWords: string
	rubleNoun: string
	kopeckNoun: string
}

export interface VatBreakdown {
	/** VAT portion in integer kopecks. */
	vatKopecks: number
	vatRubles: number
	vatKopecksPart: number
	/** Display like "964.67". */
	vatDisplay: string
	vatWordsLower: string
	vatRubleNoun: string
	vatKopeckNoun: string
}

export type MoneyCopyVariantId =
	| 'lower'
	| 'capitalized'
	| 'kopecks-digits'
	| 'with-vat'
	| 'with-vat-words'
	| 'amount-paren-vat'
	| 'amount-paren-vat-capitalized'

export interface MoneyCopyVariant {
	id: MoneyCopyVariantId
	/** Short RU label for the UI. */
	label: string
	/** Full copyable text (archive-faithful wording). */
	text: string
}

/**
 * Russian plural form helper for рубль / копейка style nouns.
 */
export function russianPluralForm(
	n: number,
): 'one' | 'few' | 'many' {
	const abs = Math.abs(Math.trunc(n))
	const mod100 = abs % 100
	const mod10 = abs % 10
	if (mod100 >= 11 && mod100 <= 19) return 'many'
	if (mod10 === 1) return 'one'
	if (mod10 >= 2 && mod10 <= 4) return 'few'
	return 'many'
}

export function rubleNoun(rubles: number): string {
	const form = russianPluralForm(rubles)
	if (form === 'one') return 'рубль'
	if (form === 'few') return 'рубля'
	return 'рублей'
}

export function kopeckNoun(kopecks: number): string {
	const form = russianPluralForm(kopecks)
	if (form === 'one') return 'копейка'
	if (form === 'few') return 'копейки'
	return 'копеек'
}

/**
 * Convert 0…99 for feminine kopeck context.
 * 1 → «одна», 2 → «две», 21 → «двадцать одна», 22 → «двадцать две».
 * Teens (11–19) stay the standard forms from numberToWordsRu.
 */
export function numberToWordsRuKopecks(kopecks: number): string {
	if (kopecks < 0 || kopecks > 99 || !Number.isInteger(kopecks)) {
		throw new Error(`Invalid kopecks: ${kopecks}`)
	}
	if (kopecks === 0) return 'ноль'
	if (kopecks === 1) return 'одна'
	if (kopecks === 2) return 'две'
	if (kopecks >= 3 && kopecks <= 19) {
		return numberToWordsRu(kopecks)
	}
	const tens = Math.floor(kopecks / 10) * 10
	const ones = kopecks % 10
	const tensWord = numberToWordsRu(tens)
	if (ones === 0) return tensWord
	if (ones === 1) return `${tensWord} одна`
	if (ones === 2) return `${tensWord} две`
	return `${tensWord} ${numberToWordsRu(ones)}`
}

/**
 * Display amount with a Russian decimal comma so numeric and verbal
 * sides stay consistent (e.g. «1,50 руб.» for 1-50).
 */
export function formatMoneyAmountComma(amount: MoneyAmount): string {
	return `${amount.rubles},${String(amount.kopecks).padStart(2, '0')}`
}

/**
 * Ruble integer words. Uses standard masculine forms from numberToWordsRu.
 */
export function numberToWordsRuRubles(rubles: number): string {
	if (rubles < 0 || !Number.isInteger(rubles)) {
		throw new Error(`Invalid rubles: ${rubles}`)
	}
	return numberToWordsRu(rubles)
}

export function buildMoneyWords(amount: MoneyAmount): MoneyWords {
	return {
		rublesWords: numberToWordsRuRubles(amount.rubles),
		kopecksWords: numberToWordsRuKopecks(amount.kopecks),
		rubleNoun: rubleNoun(amount.rubles),
		kopeckNoun: kopeckNoun(amount.kopecks),
	}
}

/**
 * Capitalize only the first Unicode letter (archive titles / variant 2).
 */
export function capitalizeFirst(text: string): string {
	if (!text) return text
	return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Format integer kopecks as "R.KK" with exactly two fractional digits.
 */
export function formatRubKopecks(totalKopecks: number): string {
	const sign = totalKopecks < 0 ? '-' : ''
	const abs = Math.abs(totalKopecks)
	const rub = Math.floor(abs / 100)
	const kop = abs % 100
	return `${sign}${rub}.${String(kop).padStart(2, '0')}`
}

/**
 * VAT included in the stated amount (20% ставка, выделение из суммы).
 * Uses integer kopecks: round(total * 20 / 120).
 */
export function calculateIncludedVat(totalKopecks: number): VatBreakdown {
	if (!Number.isInteger(totalKopecks) || totalKopecks < 0) {
		throw new Error(`Invalid totalKopecks: ${totalKopecks}`)
	}
	const vatKopecks = Math.round((totalKopecks * 20) / 120)
	const vatRubles = Math.floor(vatKopecks / 100)
	const vatKopecksPart = vatKopecks % 100
	const vatWordsLower = [
		numberToWordsRuRubles(vatRubles),
		rubleNoun(vatRubles),
		numberToWordsRuKopecks(vatKopecksPart),
		kopeckNoun(vatKopecksPart),
	].join(' ')

	return {
		vatKopecks,
		vatRubles,
		vatKopecksPart,
		vatDisplay: formatRubKopecks(vatKopecks),
		vatWordsLower,
		vatRubleNoun: rubleNoun(vatRubles),
		vatKopeckNoun: kopeckNoun(vatKopecksPart),
	}
}

/**
 * Build the seven archive copy variants for a money amount.
 * Wording mirrors Wayback snapshots for 199-00 / 380-00 / 5788-00.
 */
export function buildMoneyCopyVariants(amount: MoneyAmount): MoneyCopyVariant[] {
	const words = buildMoneyWords(amount)
	const vat = calculateIncludedVat(amount.totalKopecks)
	const kopDigits = String(amount.kopecks).padStart(2, '0')

	const lower = `${words.rublesWords} ${words.rubleNoun} ${words.kopecksWords} ${words.kopeckNoun}`
	const capitalized = capitalizeFirst(lower)
	const withDigits = `${words.rublesWords} ${words.rubleNoun} ${kopDigits} ${words.kopeckNoun}`
	const withVat = `${capitalized}, в т.ч. НДС (20%) ${vat.vatDisplay} руб.`
	const withVatWords = `${withVat} (${vat.vatWordsLower})`
	// Variants 6–7: keep kopecks in the numeric prefix («1,50 руб.» not «1 руб.»).
	const amountDisplay = formatMoneyAmountComma(amount)
	const amountLower = `${amountDisplay} руб. (${lower}), в т.ч. НДС (20%) ${vat.vatDisplay} руб. (${vat.vatWordsLower})`
	const amountCap = `${amountDisplay} руб. (${capitalized}, в т.ч. НДС (20%) ${vat.vatDisplay} руб. ${capitalizeFirst(vat.vatWordsLower)})`

	return [
		{ id: 'lower', label: 'Строчными', text: lower },
		{ id: 'capitalized', label: 'С заглавной', text: capitalized },
		{ id: 'kopecks-digits', label: 'Копейки цифрами', text: withDigits },
		{ id: 'with-vat', label: 'С НДС', text: withVat },
		{ id: 'with-vat-words', label: 'НДС прописью', text: withVatWords },
		{
			id: 'amount-paren-vat',
			label: 'Сумма и НДС',
			text: amountLower,
		},
		{
			id: 'amount-paren-vat-capitalized',
			label: 'Сумма и НДС (заглавные)',
			text: amountCap,
		},
	]
}

/**
 * Historical money page title:
 * "{N} прописью, {сумма словами} рублей {копейки словами}"
 * Grammar uses computed nouns (not a fixed "рублей").
 */
export function buildMoneySeoTitle(amount: MoneyAmount): string {
	const words = buildMoneyWords(amount)
	return `${amount.rubles} прописью, ${words.rublesWords} ${words.rubleNoun} ${words.kopecksWords} ${words.kopeckNoun}`
}

export function buildMoneySeoH1(amount: MoneyAmount): string {
	return `Как пишется сумма или число ${amount.rubles} прописью на русском языке`
}

export function buildMoneySeoDescription(amount: MoneyAmount): string {
	return `Написать ${amount.rubles} рублей прописью онлайн. Перевод числа ${amount.rubles} в пропись с копейками, НДС, сотыми по правилам русского языка.`
}

export function moneyAmountFromParts(
	rubles: number,
	kopecks: number,
): MoneyAmount {
	if (!Number.isInteger(rubles) || rubles < 0) {
		throw new Error('rubles must be a non-negative integer')
	}
	if (!Number.isInteger(kopecks) || kopecks < 0 || kopecks > 99) {
		throw new Error('kopecks must be an integer 0…99')
	}
	return {
		rubles,
		kopecks,
		totalKopecks: rubles * 100 + kopecks,
	}
}
