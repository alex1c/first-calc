/**
 * Universal FAQ generator
 * Generates FAQ items based on topic and locale
 */

export interface FaqItem {
	question: string
	answer: string
}

type FaqTemplate = Record<string, FaqItem[]>

/**
 * FAQ templates by topic and locale
 */
const faqTemplates: Record<string, Record<string, FaqItem[]>> = {
	'loan payment': {
		en: [
			{
				question: 'How is the monthly payment calculated?',
				answer:
					'The monthly payment is calculated using the standard loan formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of payments.',
			},
			{
				question: 'What is included in the total payment?',
				answer:
					'The total payment includes both the principal amount and all interest paid over the life of the loan.',
			},
			{
				question: 'Can I use this for mortgages?',
				answer:
					'Yes, this calculator works for any fixed-rate loan including mortgages, auto loans, and personal loans.',
			},
			{
				question: 'Does this calculator include property taxes and insurance?',
				answer:
					'No, this calculator only calculates the principal and interest payment. Property taxes, insurance, and other fees are not included.',
			},
			{
				question: 'What if the interest rate is 0%?',
				answer:
					'If the interest rate is 0%, the monthly payment is simply the principal divided by the number of months.',
			},
		],
		ru: [
			{
				question: 'Как рассчитывается ежемесячный платеж?',
				answer:
					'Ежемесячный платеж рассчитывается по стандартной формуле кредита: M = P × [r(1+r)^n] / [(1+r)^n - 1], где P - основной долг, r - месячная процентная ставка, n - количество платежей.',
			},
			{
				question: 'Что входит в общую сумму выплат?',
				answer:
					'Общая сумма выплат включает как сумму основного долга, так и все проценты, выплаченные за весь срок кредита.',
			},
			{
				question: 'Можно ли использовать это для ипотеки?',
				answer:
					'Да, этот калькулятор работает для любых кредитов с фиксированной ставкой, включая ипотеку, автокредиты и потребительские кредиты.',
			},
		],
	},
	'percent of a number': {
		en: [
			{
				question: 'How do I calculate a percentage of a number?',
				answer:
					'To calculate a percentage of a number, multiply the number by the percentage and divide by 100. For example, 20% of 100 = (100 × 20) / 100 = 20.',
			},
			{
				question: 'Can I use this for discounts?',
				answer:
					'Yes! Enter the original price as the number and the discount percentage. The result will show the discount amount.',
			},
			{
				question: 'What if I want to calculate a tip?',
				answer:
					'Enter the bill amount as the number and the tip percentage (e.g., 15 for 15% tip). The result will show the tip amount.',
			},
			{
				question: 'Can I calculate percentages greater than 100%?',
				answer:
					'Yes, you can enter percentages greater than 100%. For example, 150% of 100 equals 150.',
			},
			{
				question: 'How do I calculate sales tax?',
				answer:
					'Enter the purchase amount as the number and the tax rate as the percentage. The result will show the tax amount.',
			},
		],
		ru: [
			{
				question: 'Как рассчитать процент от числа?',
				answer:
					'Чтобы рассчитать процент от числа, умножьте число на процент и разделите на 100. Например, 20% от 100 = (100 × 20) / 100 = 20.',
			},
			{
				question: 'Можно ли использовать это для скидок?',
				answer:
					'Да! Введите исходную цену как число и процент скидки. Результат покажет сумму скидки.',
			},
			{
				question: 'Что если я хочу рассчитать чаевые?',
				answer:
					'Введите сумму счета как число и процент чаевых (например, 15 для 15% чаевых). Результат покажет сумму чаевых.',
			},
		],
	},
	'roman numerals': {
		en: [
			{
				question: 'Can I write the number 0 in Roman numerals?',
				answer:
					'No, the classical Roman numeral system has no symbol for zero. Roman numerals start with I (1).',
			},
			{
				question: 'What numbers are supported?',
				answer:
					'The converter supports numbers from 1 to 3999. This is the standard range for Roman numerals.',
			},
			{
				question: 'How does bidirectional conversion work?',
				answer:
					'You can enter either an Arabic number (e.g., 123) or a Roman numeral (e.g., CXXIII). The converter will automatically detect the type and perform the conversion.',
			},
			{
				question: 'What is subtractive notation?',
				answer:
					'Subtractive notation is used to simplify writing. For example, IV instead of IIII (4), IX instead of VIIII (9), XL instead of XXXX (40).',
			},
			{
				question: 'Can I convert a range?',
				answer:
					'Yes, you can specify a range in the format "from-to" (e.g., 1-100), and the converter will show a table with Roman numerals for the entire range.',
			},
		],
		ru: [
			{
				question: 'Можно ли записать число 0 в римской системе?',
				answer:
					'Нет, в классической римской системе счисления нет символа для нуля. Римские числа начинаются с I (1).',
			},
			{
				question: 'Какие числа поддерживаются?',
				answer:
					'Конвертер поддерживает числа от 1 до 3999. Это стандартный диапазон для римских чисел.',
			},
		],
	},
	'compound interest': {
		en: [
			{
				question: 'What is compound interest?',
				answer:
					'Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods. This means your investment grows faster over time.',
			},
			{
				question: 'How does compounding frequency affect the result?',
				answer:
					'More frequent compounding (e.g., monthly vs. annually) results in higher returns because interest is calculated and added more often, allowing it to compound on itself.',
			},
			{
				question: 'What is a good compounding frequency?',
				answer:
					'Monthly compounding (12 times per year) is common for most investments. Daily compounding (365 times per year) provides the highest returns but is less common.',
			},
			{
				question: 'How is compound interest different from simple interest?',
				answer:
					'Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus previously earned interest, resulting in exponential growth.',
			},
			{
				question: 'Can I use this for savings accounts?',
				answer:
					'Yes, this calculator works for any investment or savings account that compounds interest, including savings accounts, CDs, and investment accounts.',
			},
		],
	},
}

/**
 * Generate FAQ items for a given topic and locale
 * @param topic - Topic name (e.g., "loan payment", "percent of a number")
 * @param locale - Locale code (e.g., "en", "ru")
 * @returns Array of FAQ items
 */
export function generateFaq(topic: string, locale: string): FaqItem[] {
	const normalizedTopic = topic.toLowerCase().trim()
	const normalizedLocale = locale.toLowerCase()

	// Try exact match first
	if (faqTemplates[normalizedTopic]?.[normalizedLocale]) {
		return faqTemplates[normalizedTopic][normalizedLocale]
	}

	// Try English as fallback
	if (faqTemplates[normalizedTopic]?.['en']) {
		return faqTemplates[normalizedTopic]['en']
	}

	// Return empty array if no template found
	return []
}

