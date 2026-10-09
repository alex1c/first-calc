/**
 * Convert numbers to words (English or Russian).
 * Inputs: number, language (optional), locale (injected by API), currencyMode (optional)
 * Outputs: words, breakdown, currencyWords, explanation
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'
import { CalculationDomainError } from '@/lib/calculations/domain-error'
import { numberToWordsRu } from '@/lib/numberToWordsRu'
import { numberToWordsRuDecimal } from '@/lib/legacy/decimalToWords'
import { numberToWordsEn } from '@/lib/numberToWordsEn'

/**
 * Convert a number less than 1000 to English words
 */
function convertHundreds(num: number): string {
	const ones = [
		'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
		'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
		'seventeen', 'eighteen', 'nineteen',
	]
	const tens = [
		'', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
		'ninety',
	]

	if (num === 0) return ''
	if (num < 20) return ones[num]
	if (num < 100) {
		const ten = Math.floor(num / 10)
		const one = num % 10
		return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`
	}
	if (num < 1000) {
		const hundred = Math.floor(num / 100)
		const remainder = num % 100
		if (remainder === 0) {
			return `${ones[hundred]} hundred`
		}
		return `${ones[hundred]} hundred ${convertHundreds(remainder)}`
	}
	return ''
}

/**
 * Convert number to English words
 */
function numberToWordsEnglish(num: number): string {
	if (num === 0) return 'zero'

	const isNegative = num < 0
	const absNum = Math.abs(num)
	const integerPart = Math.floor(absNum)
	const decimalPart = absNum - integerPart

	if (integerPart > 999999999999999) {
		throw new CalculationDomainError(
			'Number is too large. Maximum supported: 999,999,999,999,999',
		)
	}

	const scales = ['', 'thousand', 'million', 'billion', 'trillion']
	const parts: string[] = []

	let remaining = integerPart
	let scaleIndex = 0

	if (remaining === 0) {
		parts.push('zero')
	} else {
		while (remaining > 0) {
			const chunk = remaining % 1000
			if (chunk !== 0) {
				const chunkWords = convertHundreds(chunk)
				if (scaleIndex > 0) {
					parts.unshift(`${chunkWords} ${scales[scaleIndex]}`)
				} else {
					parts.unshift(chunkWords)
				}
			}
			remaining = Math.floor(remaining / 1000)
			scaleIndex++
		}
	}

	let result = parts.join(' ')

	if (isNegative) {
		result = `negative ${result}`
	}

	if (decimalPart > 0) {
		const decimalStr = decimalPart.toString().substring(2)
		const decimalWords = decimalStr
			.split('')
			.map((digit) => {
				const d = parseInt(digit, 10)
				return [
					'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
					'eight', 'nine',
				][d]
			})
			.join(' ')
		result = `${result} point ${decimalWords}`
	}

	return result
}

/**
 * Convert number to English currency words (USD)
 */
function numberToCurrencyWordsEn(num: number): string {
	const integerPart = Math.floor(Math.abs(num))
	const decimalPart = Math.abs(num) - integerPart
	const cents = Math.round(decimalPart * 100)

	const dollars = numberToWordsEnglish(integerPart)
	const dollarsText = integerPart === 1 ? 'dollar' : 'dollars'

	if (cents === 0) {
		return `${dollars} ${dollarsText}`
	}

	const centsWords = numberToWordsEnglish(cents)
	const centsText = cents === 1 ? 'cent' : 'cents'

	return `${dollars} ${dollarsText} and ${centsWords} ${centsText}`
}

/**
 * Convert number to Russian words (reuses legacy converters)
 */
function numberToWordsRussian(num: number): string {
	const isNegative = num < 0
	const absNum = Math.abs(num)
	const integerPart = Math.floor(absNum)
	const hasFraction = absNum - integerPart > 1e-9

	if (integerPart > 999_999_999) {
		throw new CalculationDomainError(
			'Для русского языка поддерживаются числа до 999 999 999',
		)
	}

	let words: string
	if (hasFraction) {
		words = numberToWordsRuDecimal(absNum, { format: 'numeric' })
	} else {
		words = numberToWordsRu(integerPart)
	}

	return isNegative ? `минус ${words}` : words
}

/**
 * Convert number to Russian currency words (RUB)
 */
function numberToCurrencyWordsRu(num: number): string {
	return numberToWordsRuDecimal(Math.abs(num), { format: 'money', currency: 'rub' })
}

/**
 * Get breakdown by scale
 */
function getBreakdown(num: number): {
	millions: number
	thousands: number
	hundreds: number
} {
	const absNum = Math.abs(Math.floor(num))
	return {
		millions: Math.floor(absNum / 1000000) % 1000,
		thousands: Math.floor(absNum / 1000) % 1000,
		hundreds: absNum % 1000,
	}
}

/**
 * Calculate numbers to words
 */
export const calculateNumbersToWords: CalculationFunction = (inputs) => {
	const numberStr = String(inputs.number || '')
	const currencyMode =
		inputs.currencyMode === true ||
		(typeof inputs.currencyMode === 'string' &&
			inputs.currencyMode.toLowerCase() === 'true') ||
		inputs.currencyMode === 'true' ||
		String(inputs.currencyMode).toLowerCase() === 'true'
	// Prefer explicit language; fall back to request locale injected by the API
	const language = String(
		inputs.language || inputs.locale || 'en',
	).toLowerCase()
	const isRu = language === 'ru' || language.startsWith('ru')

	if (!numberStr || numberStr.trim() === '') {
		throw new CalculationDomainError(
			isRu ? 'Число обязательно.' : 'Number is required.',
		)
	}

	const number = parseFloat(numberStr)
	if (isNaN(number) || !Number.isFinite(number)) {
		throw new CalculationDomainError(
			isRu
				? 'Некорректное число. Введите допустимое значение.'
				: 'Invalid number. Please enter a valid number.',
		)
	}

	if (Math.abs(number) > 999999999999999) {
		throw new CalculationDomainError(
			isRu
				? 'Число слишком большое.'
				: 'Number is too large. Maximum supported: 999,999,999,999,999',
		)
	}

	let words = ''
	let currencyWords = ''

	if (isRu) {
		if (currencyMode) {
			currencyWords = numberToCurrencyWordsRu(number)
			words = numberToWordsRussian(number)
		} else {
			words = numberToWordsRussian(number)
		}
	} else if (currencyMode) {
		currencyWords = numberToCurrencyWordsEn(number)
		words = numberToWordsEnglish(number)
	} else {
		// Prefer shared EN helper when available for integer paths
		const integerPart = Math.floor(Math.abs(number))
		const hasFraction = Math.abs(number) - integerPart > 1e-9
		if (!hasFraction && integerPart <= 999_999_999 && number >= 0) {
			try {
				words = numberToWordsEn(integerPart)
			} catch {
				words = numberToWordsEnglish(number)
			}
		} else {
			words = numberToWordsEnglish(number)
		}
	}

	const breakdown = getBreakdown(number)

	let explanation = ''
	if (isRu) {
		explanation = currencyMode
			? `Число ${number.toLocaleString('ru-RU')} прописью (валюта): «${currencyWords}».`
			: `Число ${number.toLocaleString('ru-RU')} прописью: «${words}».`
	} else if (currencyMode) {
		explanation = `The number ${number.toLocaleString()} is written as "${currencyWords}" in currency format.`
	} else {
		explanation = `The number ${number.toLocaleString()} is written as "${words}" in words.`
	}

	const breakdownParts: string[] = []
	if (isRu) {
		if (breakdown.millions > 0) {
			breakdownParts.push(`${breakdown.millions.toLocaleString('ru-RU')} млн`)
		}
		if (breakdown.thousands > 0) {
			breakdownParts.push(`${breakdown.thousands.toLocaleString('ru-RU')} тыс`)
		}
		if (breakdown.hundreds > 0) {
			breakdownParts.push(`${breakdown.hundreds.toLocaleString('ru-RU')}`)
		}
	} else {
		if (breakdown.millions > 0) {
			breakdownParts.push(
				`${breakdown.millions.toLocaleString()} million${breakdown.millions !== 1 ? 's' : ''}`,
			)
		}
		if (breakdown.thousands > 0) {
			breakdownParts.push(
				`${breakdown.thousands.toLocaleString()} thousand${breakdown.thousands !== 1 ? 's' : ''}`,
			)
		}
		if (breakdown.hundreds > 0) {
			breakdownParts.push(
				`${breakdown.hundreds.toLocaleString()} hundred${breakdown.hundreds !== 1 ? 's' : ''}`,
			)
		}
	}
	const breakdownText =
		breakdownParts.length > 0
			? breakdownParts.join(', ')
			: Math.abs(number) < 1
				? isRu
					? 'Меньше 1'
					: 'Less than 1'
				: '0'

	return {
		words,
		currencyWords: currencyMode ? currencyWords : '',
		breakdown: breakdownText,
		millions: breakdown.millions,
		thousands: breakdown.thousands,
		hundreds: breakdown.hundreds,
		explanation,
		originalNumber: isRu
			? number.toLocaleString('ru-RU')
			: number.toLocaleString(),
		language: isRu ? 'ru' : 'en',
	}
}

registerCalculation('calculateNumbersToWords', calculateNumbersToWords)
