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
			question: 'Как работает конвертер чисел в пропись?',
			answer:
				'Конвертер преобразует арабские числа от 0 до 999,999,999 в их текстовое представление на русском языке. Например, число 123 преобразуется в "сто двадцать три".',
		},
		{
			question: 'Можно ли конвертировать диапазон чисел?',
			answer:
				'Да, вы можете указать диапазон в формате "от-до" (например, 100-199), и конвертер покажет пропись для всех чисел в этом диапазоне. Максимальный размер диапазона - 200 чисел.',
		},
		{
			question: 'Какие числа поддерживаются?',
			answer:
				'Конвертер поддерживает числа от 0 до 999,999,999. Для чисел больше этого диапазона используйте другие инструменты.',
		},
		{
			question: 'Почему ограничен размер диапазона?',
			answer:
				'Ограничение в 200 чисел установлено для обеспечения быстрой работы сервера и удобства отображения результатов.',
		},
		{
			question: 'Как правильно записываются большие числа?',
			answer:
				'Большие числа записываются с правильными формами слов "тысяча", "миллион". Например, 1000 = "одна тысяча", 2000 = "две тысячи", 5000 = "пять тысяч".',
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
 */
export function getFaqForNumbersToWords(): FAQItem[] {
	return [
		{
			question: 'How does the number to words converter work?',
			answer:
				'The converter transforms Arabic numbers from 0 to 999,999,999,999 into their English word representation. For example, 123 becomes "one hundred twenty-three".',
		},
		{
			question: 'Can I convert a range of numbers?',
			answer:
				'Yes, you can specify a range in the format "from-to" (e.g., 100-199), and the converter will show the word representation for all numbers in that range. Maximum range size is 200 numbers.',
		},
		{
			question: 'What numbers are supported?',
			answer:
				'The converter supports numbers from 0 to 999,999,999,999 (up to one trillion). For numbers beyond this range, please use other tools.',
		},
		{
			question: 'Why is the range size limited?',
			answer:
				'The limit of 200 numbers is set to ensure fast server performance and convenient display of results.',
		},
		{
			question: 'How are large numbers written?',
			answer:
				'Large numbers are written with proper forms: "thousand", "million", "billion". For example, 1000 = "one thousand", 2000 = "two thousand", 1,000,000 = "one million".',
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
			question: 'Можно ли записать число 0 в римской системе?',
			answer:
				'Нет, в классической римской системе счисления нет символа для нуля. Римские числа начинаются с I (1).',
		},
		{
			question: 'Какие числа поддерживаются?',
			answer:
				'Конвертер поддерживает числа от 1 до 3999. Это стандартный диапазон для римских чисел.',
		},
		{
			question: 'Как работает двунаправленная конвертация?',
			answer:
				'Вы можете ввести как арабское число (например, 123), так и римское (например, CXXIII). Конвертер автоматически определит тип и выполнит преобразование.',
		},
		{
			question: 'Что такое вычитающая нотация?',
			answer:
				'Вычитающая нотация используется для упрощения записи. Например, IV вместо IIII (4), IX вместо VIIII (9), XL вместо XXXX (40).',
		},
		{
			question: 'Можно ли конвертировать диапазон?',
			answer:
				'Да, вы можете указать диапазон в формате "от-до" (например, 1-100), и конвертер покажет таблицу с римскими числами для всего диапазона.',
		},
	]
}

/**
 * Get FAQ for percentage calculators
 */
export function getFaqForPercentage(): FAQItem[] {
	return [
		{
			question: 'Как рассчитать процент от числа?',
			answer:
				'Чтобы рассчитать процент от числа, умножьте число на процент и разделите на 100. Например, 20% от 100 = (100 × 20) / 100 = 20.',
		},
		{
			question: 'Как добавить процент к числу?',
			answer:
				'Чтобы добавить процент к числу, сначала рассчитайте процент от числа, затем прибавьте его к исходному числу. Например, 100 + 20% = 100 + 20 = 120.',
		},
		{
			question: 'Как вычесть процент из числа?',
			answer:
				'Чтобы вычесть процент из числа, сначала рассчитайте процент от числа, затем вычтите его из исходного числа. Например, 100 - 20% = 100 - 20 = 80.',
		},
		{
			question: 'Можно ли использовать для расчета скидок?',
			answer:
				'Да, этот калькулятор идеально подходит для расчета скидок. Введите исходную цену и процент скидки, чтобы узнать итоговую цену.',
		},
		{
			question: 'Как рассчитать процентное изменение?',
			answer:
				'Процентное изменение = ((новое значение - старое значение) / старое значение) × 100. Используйте калькулятор "процент от числа" для этого расчета.',
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




