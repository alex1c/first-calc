/**
 * Content generators for legacy pages
 * Provides FAQ and Examples templates
 */

export interface FAQItem {
	question: string
	answer: string
}

export interface Example {
	title: string
	input: string
	output: string
	description?: string
}

/**
 * Get FAQ for chislo-propisyu
 */
export function getFaqForChisloPropisyu(): FAQItem[] {
	return [
		{
			question: 'How does the number to words converter work?',
			answer:
				'The number to words converter transforms Arabic numbers from 0 to 999,999,999 into their text representation in multiple languages. For example, 123 becomes "сто двадцать три" in Russian or "one hundred twenty-three" in English. Supports both integer and decimal numbers with proper declension.',
		},
		{
			question: 'Can I convert decimal numbers to words?',
			answer:
				'Yes, the converter supports decimal numbers and converts them to words with proper handling of fractional parts. For example, 55.8 becomes "пятьдесят пять целых восемь десятых" in Russian. Decimal numbers are converted digit by digit for accuracy.',
		},
		{
			question: 'Can I convert monetary values to words?',
			answer:
				'Yes, the converter supports monetary format conversions for different currencies (RUB, USD, EUR). For example, 555.23-money-usd becomes "five hundred fifty-five dollars and twenty-three cents". Supports decimal monetary values with proper currency declension.',
		},
		{
			question: 'Can I convert a range of numbers?',
			answer:
				'Yes, you can specify a range in the format "from-to" (e.g., 100-199), and the converter will show the word representation for all numbers in that range. Maximum range size is 200 numbers for optimal performance.',
		},
		{
			question: 'What numbers are supported by the converter?',
			answer:
				'The converter supports integers from 0 to 999,999,999 and decimal numbers with fractional parts. For monetary values, it supports decimal amounts with proper currency handling. Numbers beyond this range require other tools.',
		},
		{
			question: 'How are large numbers written in words?',
			answer:
				'Large numbers are written with proper forms: "тысяча" (thousand), "миллион" (million) in Russian, or "thousand", "million" in English. For example, 1000 = "одна тысяча" or "one thousand", 2000 = "две тысячи" or "two thousand".',
		},
		{
			question: 'Why is the range size limited to 200 numbers?',
			answer:
				'The limit of 200 numbers is set to ensure fast server performance and convenient display of results. For larger conversions, you can make multiple requests with smaller ranges. This optimization helps maintain quick response times.',
		},
		{
			question: 'What languages are supported for number to words conversion?',
			answer:
				'The converter supports multiple languages including Russian, English, and others. For monetary values, it automatically selects the appropriate language based on currency (USD/EUR use English, RUB uses Russian). The converter adapts to the selected locale.',
		},
		{
			question: 'Is the number to words converter free to use?',
			answer:
				'Yes, this is a completely free online number to words converter. There are no registration requirements, no fees, and no usage limits. You can convert as many numbers as you need, including single numbers, decimal values, ranges, and money amounts.',
		},
		{
			question: 'What are common use cases for number to words conversion?',
			answer:
				'Number to words conversion is commonly used for writing checks, filling out legal documents, creating invoices, writing formal letters, educational purposes, and financial documentation. Converting numbers to words helps prevent fraud and ensures clarity in important documents.',
		},
	]
}

/**
 * Get examples for chislo-propisyu
 */
export function getExamplesForChisloPropisyu(): Example[] {
	return [
		{
			title: 'Пример 1: Одиночное число',
			input: '/chislo-propisyu/123',
			output: 'сто двадцать три',
			description: 'Конвертация числа 123 в пропись',
		},
		{
			title: 'Пример 2: Диапазон чисел',
			input: '/chislo-propisyu/100-105',
			output: 'Таблица с числами от 100 до 105 и их прописью',
			description: 'Конвертация диапазона чисел в пропись',
		},
	]
}

/**
 * Get FAQ for numbers-to-words
 * 10 questions with keywords for SEO
 */
export function getFaqForNumbersToWords(): FAQItem[] {
	return [
		{
			question: 'How does the number to words converter work?',
			answer:
				'The number to words converter transforms Arabic numbers from 0 to 999,999,999,999 into their English word representation. This free online tool converts numeric values to text format. For example, 123 becomes "one hundred twenty-three", and decimal numbers like 44.5 become "forty-four point five".',
		},
		{
			question: 'Can I convert decimal numbers to words?',
			answer:
				'Yes, the converter supports decimal numbers and converts them to words. For example, 44.5 is converted to "forty-four point five". The decimal part is read digit by digit, making it easy to convert fractional values, percentages, and measurements to words.',
		},
		{
			question: 'Can I convert a range of numbers?',
			answer:
				'Yes, you can specify a range in the format "from-to" (e.g., 100-199), and the converter will show the word representation for all numbers in that range. Maximum range size is 200 numbers. This is useful for generating number word lists, educational purposes, and bulk conversions.',
		},
		{
			question: 'What numbers are supported by the converter?',
			answer:
				'The number to words converter supports integers from 0 to 999,999,999,999 (up to one trillion) and decimal numbers with fractional parts. For numbers beyond this range, please use other tools. The converter handles both whole numbers and decimal values accurately.',
		},
		{
			question: 'How are large numbers written in words?',
			answer:
				'Large numbers are written with proper English forms: "thousand", "million", "billion", "trillion". For example, 1000 = "one thousand", 2000 = "two thousand", 1,000,000 = "one million", 1,000,000,000 = "one billion". The converter follows standard English number naming conventions.',
		},
		{
			question: 'Why is the range size limited to 200 numbers?',
			answer:
				'The limit of 200 numbers is set to ensure fast server performance and convenient display of results. For larger conversions, you can make multiple requests with smaller ranges. This optimization helps maintain quick response times and prevents server overload.',
		},
		{
			question: 'Can I convert money amounts to words?',
			answer:
				'Yes, the converter supports money format conversions. You can convert monetary values like 555.23 to words with currency indicators (e.g., "five hundred fifty-five dollars and twenty-three cents"). Use the format: /numbers-to-words/555.23-money-usd for dollar amounts.',
		},
		{
			question: 'What is the difference between number to words and number spelling?',
			answer:
				'Number to words conversion transforms numeric digits into their written English text representation. For example, 123 becomes "one hundred twenty-three". This is also called number spelling or writing numbers in words. Both terms refer to the same process of converting digits to text.',
		},
		{
			question: 'Is the number to words converter free to use?',
			answer:
				'Yes, this is a completely free online number to words converter. There are no registration requirements, no fees, and no usage limits. You can convert as many numbers as you need, including single numbers, decimal values, ranges, and money amounts, all at no cost.',
		},
		{
			question: 'What are common use cases for number to words conversion?',
			answer:
				'Number to words conversion is commonly used for writing checks, filling out legal documents, creating invoices, writing formal letters, educational purposes, and financial documentation. Converting numbers to words helps prevent fraud and ensures clarity in important documents.',
		},
	]
}

/**
 * Get examples for numbers-to-words
 */
export function getExamplesForNumbersToWords(): Example[] {
	return [
		{
			title: 'Example 1: Single number',
			input: '/numbers-to-words/123',
			output: 'one hundred twenty-three',
			description: 'Convert number 123 to words',
		},
		{
			title: 'Example 2: Range of numbers',
			input: '/numbers-to-words/100-105',
			output: 'Table with numbers from 100 to 105 and their word representation',
			description: 'Convert a range of numbers to words',
		},
	]
}

/**
 * Get FAQ for roman numerals
 */
export function getFaqForRomanNumerals(): FAQItem[] {
	return [
		{
			question: 'Can I write the number 0 in Roman numerals?',
			answer:
				'No, in the classical Roman numeral system there is no symbol for zero. Roman numerals start with I (1). The number 0 cannot be represented in traditional Roman numeral notation.',
		},
		{
			question: 'What numbers are supported by the Roman numerals converter?',
			answer:
				'The converter supports numbers from 1 to 3999. This is the standard range for Roman numerals. Numbers beyond 3999 require special notation that is not commonly used.',
		},
		{
			question: 'Why is there a 3999 limit for Roman numerals?',
			answer:
				'The 3999 limit exists because traditional Roman numerals use specific symbols (I, V, X, L, C, D, M) that represent values up to 1000. To represent numbers larger than 3999, special notations like vinculum or apostrophus are needed, which are not standard.',
		},
		{
			question: 'How does bidirectional conversion work?',
			answer:
				'You can enter either an Arabic number (e.g., 123) or a Roman numeral (e.g., CXXIII). The converter automatically detects the input type and performs the conversion. This makes it easy to convert in both directions without selecting a mode.',
		},
		{
			question: 'What is subtractive notation in Roman numerals?',
			answer:
				'Subtractive notation is used to simplify writing. For example, IV instead of IIII (4), IX instead of VIIII (9), XL instead of XXXX (40), XC instead of LXXXX (90). This notation makes Roman numerals more compact and easier to read.',
		},
		{
			question: 'Can I convert a range of numbers to Roman numerals?',
			answer:
				'Yes, you can specify a range in the format "from-to" (e.g., 1-100), and the converter will show a table with Roman numerals for the entire range. Maximum range size is 200 numbers for optimal performance.',
		},
		{
			question: 'What are the basic Roman numeral symbols?',
			answer:
				'The basic Roman numeral symbols are: I (1), V (5), X (10), L (50), C (100), D (500), M (1000). These symbols can be combined and used with subtractive notation to represent numbers from 1 to 3999.',
		},
		{
			question: 'How do I read large Roman numerals?',
			answer:
				'Large Roman numerals are read from left to right, with values added together. For example, MMXXIV (2024) = M (1000) + M (1000) + X (10) + X (10) + IV (4) = 2024. Subtractive notation (IV, IX, XL, XC, CD, CM) reduces the value.',
		},
		{
			question: 'Is the Roman numerals converter free to use?',
			answer:
				'Yes, this is a completely free online Roman numerals converter. There are no registration requirements, no fees, and no usage limits. You can convert as many numbers as you need, including single numbers and ranges.',
		},
		{
			question: 'What are common use cases for Roman numerals?',
			answer:
				'Roman numerals are commonly used for numbering book chapters, movie sequels, clock faces, building cornerstones, monarch names, and formal documents. The converter helps with educational purposes, historical research, and understanding traditional numbering systems.',
		},
	]
}

/**
 * Get FAQ for percentage calculators
 */
export function getFaqForPercentage(): FAQItem[] {
	return [
		{
			question: 'How do I calculate percentage of a number?',
			answer:
				'To calculate percentage of a number, multiply the number by the percentage and divide by 100. For example, 20% of 100 = (100 × 20) / 100 = 20. This percentage calculator supports both whole numbers and decimal values like 25.5% of 55.2.',
		},
		{
			question: 'How do I add percentage to a number?',
			answer:
				'To add percentage to a number, first calculate the percentage of the number, then add it to the original number. For example, 100 + 20% = 100 + 20 = 120. The calculator supports decimal percentages and values for precise calculations.',
		},
		{
			question: 'How do I subtract percentage from a number?',
			answer:
				'To subtract percentage from a number, first calculate the percentage of the number, then subtract it from the original number. For example, 100 - 20% = 100 - 20 = 80. This is useful for calculating discounts and price reductions.',
		},
		{
			question: 'Can I use this calculator for discount calculations?',
			answer:
				'Yes, this percentage calculator is perfect for calculating discounts, sales prices, and markdowns. Enter the original price and discount percentage to find the final price. Supports decimal values for precise discount calculations.',
		},
		{
			question: 'How do I calculate percentage change?',
			answer:
				'Percentage change = ((new value - old value) / old value) × 100. Use the "percentage of a number" calculator for this calculation. This helps track growth, decline, and changes in values over time.',
		},
		{
			question: 'Can I calculate percentage with decimal numbers?',
			answer:
				'Yes, the percentage calculator fully supports decimal numbers and percentages. For example, you can calculate 2.5% of 55.2 or add 3.7% to 100.5. The calculator provides results with up to 6 decimal places for fractional values.',
		},
		{
			question: 'What is the formula for percentage calculations?',
			answer:
				'The basic formula is: Result = (Value × Percentage) / 100. For adding percentage: Result = Value + (Value × Percentage) / 100. For subtracting: Result = Value - (Value × Percentage) / 100. These formulas work with both whole and decimal numbers.',
		},
		{
			question: 'Is the percentage calculator free to use?',
			answer:
				'Yes, this is a completely free online percentage calculator. There are no registration requirements, no fees, and no usage limits. You can calculate percentages, add percentages, subtract percentages, and work with decimal values all at no cost.',
		},
		{
			question: 'What are common use cases for percentage calculations?',
			answer:
				'Percentage calculations are used for discounts, sales tax, tips, interest rates, growth rates, markups, markdowns, and financial analysis. This calculator helps with shopping discounts, salary increases, investment returns, and business calculations.',
		},
		{
			question: 'How accurate are percentage calculations?',
			answer:
				'The percentage calculator provides highly accurate results with support for decimal numbers and percentages. Results are displayed with up to 6 decimal places for fractional values, ensuring precision for financial, mathematical, and business calculations.',
		},
	]
}

/**
 * Get examples for percentage calculators
 */
export function getExamplesForPercentage(): Example[] {
	return [
		{
			title: 'Пример 1: Процент от числа',
			input: '/percentage-of-a-number/200-10',
			output: '20 (10% от 200)',
			description: 'Рассчитать 10% от 200',
		},
		{
			title: 'Пример 2: Добавить процент',
			input: '/add-subtract-percentage/100-20-add',
			output: '120 (100 + 20%)',
			description: 'Добавить 20% к 100',
		},
		{
			title: 'Пример 3: Вычесть процент',
			input: '/add-subtract-percentage/100-20-subtract',
			output: '80 (100 - 20%)',
			description: 'Вычесть 20% из 100',
		},
	]
}

/**
 * Get FAQ for factors
 */
export function getFaqForFactors(): FAQItem[] {
	return [
		{
			question: 'Что такое делители числа?',
			answer:
				'Делители числа - это все числа, на которые данное число делится без остатка. Например, делители числа 12: 1, 2, 3, 4, 6, 12.',
		},
		{
			question: 'Как определить, является ли число простым?',
			answer:
				'Простое число имеет ровно два делителя: 1 и само число. Если у числа больше двух делителей, оно называется составным.',
		},
		{
			question: 'Что такое разложение на простые множители?',
			answer:
				'Разложение на простые множители - это представление числа в виде произведения простых чисел. Например, 12 = 2² × 3.',
		},
		{
			question: 'Как найти все делители большого числа?',
			answer:
				'Для нахождения всех делителей нужно проверить все числа от 1 до квадратного корня из данного числа. Калькулятор автоматически выполняет эту проверку.',
		},
		{
			question: 'Что такое сумма делителей?',
			answer:
				'Сумма делителей - это сумма всех делителей числа. Например, для числа 12: 1 + 2 + 3 + 4 + 6 + 12 = 28.',
		},
	]
}

/**
 * Get FAQ for Indian number format
 */
export function getFaqForIndianFormat(): FAQItem[] {
	return [
		{
			question: 'Почему индийская система группирует 2 цифры после первой тройки?',
			answer:
				'Индийская система использует lakhs (1,00,000) и crores (1,00,00,000) как единицы группировки. После первых трех цифр справа числа группируются по две цифры для удобства чтения больших чисел.',
		},
		{
			question: 'В чем разница между индийской и американской системой?',
			answer:
				'Американская система группирует цифры по три (тысячи, миллионы). Индийская система группирует первые три цифры, затем по две (lakhs, crores).',
		},
		{
			question: 'Что такое lakh и crore?',
			answer:
				'Lakh = 100,000 (1,00,000 в индийской системе). Crore = 10,000,000 (1,00,00,000 в индийской системе).',
		},
		{
			question: 'Где используется индийская система?',
			answer:
				'Индийская система используется в Индии, Бангладеш, Пакистане, Непале и Шри-Ланке для записи больших чисел.',
		},
		{
			question: 'Как конвертировать из американской в индийскую систему?',
			answer:
				'Используйте наш конвертер: введите число в американском формате, и он автоматически преобразует его в индийский формат.',
		},
	]
}

/**
 * Get FAQ for range calculator
 */
export function getFaqForRange(): FAQItem[] {
	return [
		{
			question: 'Как работает калькулятор диапазонов?',
			answer:
				'Калькулятор диапазонов позволяет работать с большими диапазонами чисел, преобразуя их в различные форматы: пропись на русском, пропись на английском, форматирование.',
		},
		{
			question: 'Можно ли использовать вложенные диапазоны?',
			answer:
				'Да, поддерживается формат вложенных диапазонов, например: /210000-219999/213500-213549. В этом случае обрабатывается первый диапазон.',
		},
		{
			question: 'Какое максимальное количество чисел в диапазоне?',
			answer:
				'Максимальное количество чисел в диапазоне ограничено 500 для обеспечения производительности. Если диапазон больше, он будет автоматически ограничен.',
		},
		{
			question: 'Какие форматы поддерживаются?',
			answer:
				'Калькулятор показывает числа в форматах: оригинальное число, пропись на русском, пропись на английском.',
		},
	]
}

/**
 * Get FAQ for root calculator
 * 10 questions with keywords for SEO
 */
export function getFaqForRootCalculator(): FAQItem[] {
	return [
		{
			question: 'How does the root calculator work?',
			answer:
				'The root calculator calculates the nth root of a number. For example, the square root (2nd root) of 16 is 4, because 4² = 16. The calculator supports roots from degree 2 to 100, including square roots (√), cube roots (∛), and any other nth root.',
		},
		{
			question: 'Can I calculate roots of decimal numbers?',
			answer:
				'Yes, the root calculator supports decimal numbers. You can calculate roots of any positive or negative number (for odd degrees). For example, √45.2 ≈ 6.723, or ∛27.5 ≈ 3.019.',
		},
		{
			question: 'What is the difference between square root and cube root?',
			answer:
				'The square root (2nd root) of a number is a value that, when multiplied by itself, gives the original number. The cube root (3rd root) is a value that, when multiplied by itself three times, gives the original number. For example, √16 = 4 (4 × 4 = 16) and ∛27 = 3 (3 × 3 × 3 = 27).',
		},
		{
			question: 'Can I calculate roots of negative numbers?',
			answer:
				'Yes, but only for odd degrees (3, 5, 7, etc.). Even roots (2, 4, 6, etc.) of negative numbers do not exist in real numbers. For example, ∛(-8) = -2, but √(-16) does not exist in real numbers.',
		},
		{
			question: 'What is the maximum degree supported?',
			answer:
				'The calculator supports roots from degree 2 to 100. This covers most practical use cases, including square roots, cube roots, and higher-degree roots commonly used in mathematics and engineering.',
		},
		{
			question: 'How accurate are the root calculations?',
			answer:
				'The calculator provides results with up to 10 decimal places of precision. For display purposes, results are shown with 6 decimal places, but the internal calculation uses higher precision for accuracy.',
		},
		{
			question: 'What is the formula for calculating roots?',
			answer:
				'The nth root of a number a is calculated as a^(1/n). For example, the square root of 16 is 16^(1/2) = 4, and the cube root of 27 is 27^(1/3) = 3. This formula works for any degree n.',
		},
		{
			question: 'Can I use this calculator for engineering calculations?',
			answer:
				'Yes, the root calculator is suitable for engineering, scientific, and mathematical calculations. It supports decimal numbers and provides precise results for various root calculations needed in technical applications.',
		},
		{
			question: 'Is the root calculator free to use?',
			answer:
				'Yes, this is a completely free online root calculator. There are no registration requirements, no fees, and no usage limits. You can calculate as many roots as you need, including square roots, cube roots, and roots of any degree from 2 to 100.',
		},
		{
			question: 'What are common use cases for root calculations?',
			answer:
				'Root calculations are commonly used in mathematics, engineering, physics, and finance. Examples include calculating square roots for distance formulas, cube roots for volume calculations, and nth roots for various mathematical problems and equations.',
		},
	]
}






