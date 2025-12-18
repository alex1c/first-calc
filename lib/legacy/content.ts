/**
 * Legacy pages content module
 * Centralized SEO titles, descriptions, texts, and use cases for all legacy tools
 */

import type { Locale } from '@/lib/i18n';

export interface LegacyContent {
	title: {
		en: string;
		ru: string;
	};
	description: {
		en: string;
		ru: string;
	};
	ogTitle: {
		en: string;
		ru: string;
	};
	ogDescription: {
		en: string;
		ru: string;
	};
	text: {
		en: string[];
		ru: string[];
	};
	useCases: {
		en: string[];
		ru: string[];
	};
	keywords: {
		en: string[];
		ru: string[];
	};
}

/**
 * Get legacy content by tool type and locale
 */
export function getLegacyContent(
	toolType: string,
	locale: Locale
): LegacyContent | null {
	const content = legacyContentMap[toolType];
	if (!content) return null;

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en';

	return {
		title: { en: content.title.en, ru: content.title.ru },
		description: { en: content.description.en, ru: content.description.ru },
		ogTitle: { en: content.ogTitle.en, ru: content.ogTitle.ru },
		ogDescription: {
			en: content.ogDescription.en,
			ru: content.ogDescription.ru,
		},
		text: { en: content.text.en, ru: content.text.ru },
		useCases: { en: content.useCases.en, ru: content.useCases.ru },
		keywords: { en: content.keywords.en, ru: content.keywords.ru },
	};
}

/**
 * Get title for legacy page
 */
export function getLegacyTitle(
	toolType: string,
	locale: Locale,
	dynamicValue?: string | number
): string {
	const content = getLegacyContent(toolType, locale);
	if (!content) return 'Calculator Portal';

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en';
	const title = content.title[contentLocale];
	if (dynamicValue !== undefined) {
		return title.replace('{value}', String(dynamicValue));
	}
	return title;
}

/**
 * Get description for legacy page
 */
export function getLegacyDescription(
	toolType: string,
	locale: Locale,
	dynamicValue?: string | number
): string {
	const content = getLegacyContent(toolType, locale);
	if (!content) return 'Calculator Portal';

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en';
	const description = content.description[contentLocale];
	if (dynamicValue !== undefined) {
		return description.replace('{value}', String(dynamicValue));
	}
	return description;
}

/**
 * Get OG title for legacy page
 */
export function getLegacyOgTitle(
	toolType: string,
	locale: Locale,
	dynamicValue?: string | number
): string {
	const content = getLegacyContent(toolType, locale);
	if (!content) return 'Calculator Portal';

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en';
	const ogTitle = content.ogTitle[contentLocale];
	if (dynamicValue !== undefined) {
		return ogTitle.replace('{value}', String(dynamicValue));
	}
	return ogTitle;
}

/**
 * Get OG description for legacy page
 */
export function getLegacyOgDescription(
	toolType: string,
	locale: Locale,
	dynamicValue?: string | number
): string {
	const content = getLegacyContent(toolType, locale);
	if (!content) return 'Calculator Portal';

	// Use 'en' as fallback for locales that don't have translations
	const contentLocale: 'en' | 'ru' = locale === 'ru' ? 'ru' : 'en';
	const ogDescription = content.ogDescription[contentLocale];
	if (dynamicValue !== undefined) {
		return ogDescription.replace('{value}', String(dynamicValue));
	}
	return ogDescription;
}

/**
 * Legacy content map
 */
const legacyContentMap: Record<string, LegacyContent> = {
	'chislo-propisyu': {
		title: {
			en: 'Number to Words Converter - Calculator Portal',
			ru: 'Число прописью - Конвертер чисел в текст',
		},
		description: {
			en: 'Convert numbers to words. Transform any number from 0 to 999,999,999 into its word representation. Supports multiple languages and currencies. Free online number to text converter.',
			ru: 'Конвертер чисел в пропись. Преобразуйте любое число от 0 до 999,999,999 в его текстовое представление. Поддерживает несколько языков и валют. Бесплатный онлайн конвертер чисел в слова.',
		},
		ogTitle: {
			en: 'Number to Words Converter | Calculator Portal',
			ru: 'Число прописью | Конвертер чисел в текст',
		},
		ogDescription: {
			en: 'Convert numbers to words instantly. Free online tool for converting numbers from 0 to 999,999,999 into text format. Supports multiple languages and currencies.',
			ru: 'Конвертируйте числа в пропись мгновенно. Бесплатный онлайн инструмент для преобразования чисел от 0 до 999,999,999 в текстовый формат. Поддерживает несколько языков и валют.',
		},
		text: {
			en: [
				'Converting numbers to words is essential for various legal, financial, and administrative documents. Our number to words converter helps you transform numeric values into their written form quickly and accurately.',
				'This tool supports numbers from 0 to 999,999,999 and follows standard grammar rules for number declension. Whether you need to write out amounts in contracts, invoices, or official documents, this converter ensures accuracy and compliance with language conventions. Supports multiple languages and currency formats.',
			],
			ru: [
				'Преобразование чисел в пропись необходимо для различных юридических, финансовых и административных документов. Наш конвертер чисел в пропись помогает быстро и точно преобразовать числовые значения в их письменную форму.',
				'Этот инструмент поддерживает числа от 0 до 999,999,999 и следует стандартным правилам грамматики для склонения чисел. Независимо от того, нужно ли вам записать суммы в договорах, счетах или официальных документах, этот конвертер обеспечивает точность и соответствие правилам языка. Поддерживает несколько языков и форматов валют.',
			],
		},
		useCases: {
			en: [
				'Writing amounts in legal contracts and agreements',
				'Filling out invoices and financial documents',
				'Creating official documents requiring number spelling',
				'Educational purposes for learning number names',
				'Banking and financial transactions documentation',
				'Government forms and official paperwork',
			],
			ru: [
				'Написание сумм в юридических договорах и соглашениях',
				'Заполнение счетов и финансовых документов',
				'Создание официальных документов, требующих написания чисел прописью',
				'Образовательные цели для изучения названий чисел',
				'Банковская и финансовая документация',
				'Государственные формы и официальные документы',
			],
		},
		keywords: {
			en: [
				'number to words',
				'number converter',
				'number spelling',
				'text converter',
				'number in words',
			],
			ru: [
				'число прописью',
				'конвертер чисел',
				'написание чисел',
				'число словами',
				'преобразование чисел',
			],
		},
	},
	'numbers-to-words': {
		title: {
			en: 'Numbers to Words Converter - English Number to Text',
			ru: 'Конвертер чисел в слова - Английский',
		},
		description: {
			en: 'Convert numbers to words in English. Transform any number from 0 to 999,999,999,999 into its word representation. Free online number to text converter for English.',
			ru: 'Конвертируйте числа в слова на английском языке. Преобразуйте любое число от 0 до 999,999,999,999 в его текстовое представление. Бесплатный онлайн конвертер чисел в слова для английского языка.',
		},
		ogTitle: {
			en: 'Numbers to Words Converter | English Number to Text',
			ru: 'Конвертер чисел в слова | Английский',
		},
		ogDescription: {
			en: 'Convert numbers to English words instantly. Free online tool for converting numbers from 0 to 999,999,999,999 into text format.',
			ru: 'Конвертируйте числа в слова на английском языке мгновенно. Бесплатный онлайн инструмент для преобразования чисел от 0 до 999,999,999,999 в текстовый формат.',
		},
		text: {
			en: [
				'Converting numbers to words is a common requirement in business, legal, and financial contexts. Our English number to words converter provides accurate conversion of numeric values into their written English form.',
				'This tool handles numbers from 0 to 999,999,999,999 and follows standard English conventions for number naming. Perfect for writing checks, contracts, invoices, and any document where numbers need to be spelled out in words.',
			],
			ru: [
				'Преобразование чисел в слова - это распространенное требование в деловом, юридическом и финансовом контексте. Наш конвертер чисел в слова на английском языке обеспечивает точное преобразование числовых значений в их письменную английскую форму.',
				'Этот инструмент обрабатывает числа от 0 до 999,999,999,999 и следует стандартным английским соглашениям для названия чисел. Идеально подходит для написания чеков, договоров, счетов и любых документов, где числа должны быть написаны словами.',
			],
		},
		useCases: {
			en: [
				'Writing checks and bank documents',
				'Filling out legal contracts and agreements',
				'Creating invoices and financial statements',
				'Educational purposes for learning number names',
				'International business documentation',
				'Academic and research papers',
			],
			ru: [
				'Написание чеков и банковских документов',
				'Заполнение юридических договоров и соглашений',
				'Создание счетов и финансовых отчетов',
				'Образовательные цели для изучения названий чисел',
				'Международная деловая документация',
				'Академические и исследовательские работы',
			],
		},
		keywords: {
			en: [
				'numbers to words',
				'number converter',
				'English number spelling',
				'text converter',
				'number in words',
			],
			ru: [
				'числа в слова',
				'конвертер чисел',
				'английское написание чисел',
				'число словами',
				'преобразование чисел',
			],
		},
	},
	'roman-numerals-converter': {
		title: {
			en: 'Roman Numerals Converter - Arabic to Roman Number Converter',
			ru: 'Конвертер римских цифр - Арабские в римские',
		},
		description: {
			en: 'Convert between Arabic numbers and Roman numerals. Supports numbers from 1 to 3999 with bidirectional conversion. Free online Roman numeral converter tool.',
			ru: 'Конвертируйте между арабскими числами и римскими цифрами. Поддерживает числа от 1 до 3999 с двунаправленным преобразованием. Бесплатный онлайн конвертер римских цифр.',
		},
		ogTitle: {
			en: 'Roman Numerals Converter | Arabic ↔ Roman',
			ru: 'Конвертер римских цифр | Арабские ↔ Римские',
		},
		ogDescription: {
			en: 'Convert Arabic numbers to Roman numerals and vice versa. Free online tool supporting numbers 1-3999 with instant conversion.',
			ru: 'Конвертируйте арабские числа в римские цифры и наоборот. Бесплатный онлайн инструмент, поддерживающий числа 1-3999 с мгновенным преобразованием.',
		},
		text: {
			en: [
				'Roman numerals are an ancient numbering system still used today in various contexts, including book chapters, movie sequels, clock faces, and historical dates. Our Roman numerals converter provides accurate bidirectional conversion between Arabic numbers and Roman numerals.',
				'This tool supports numbers from 1 to 3999, which covers the standard range for most practical applications. Whether you need to convert a year, chapter number, or any other numeric value to Roman numerals, this converter ensures accuracy and follows traditional Roman numeral conventions.',
			],
			ru: [
				'Римские цифры - это древняя система счисления, которая до сих пор используется в различных контекстах, включая главы книг, сиквелы фильмов, циферблаты часов и исторические даты. Наш конвертер римских цифр обеспечивает точное двунаправленное преобразование между арабскими числами и римскими цифрами.',
				'Этот инструмент поддерживает числа от 1 до 3999, что охватывает стандартный диапазон для большинства практических применений. Независимо от того, нужно ли вам преобразовать год, номер главы или любое другое числовое значение в римские цифры, этот конвертер обеспечивает точность и следует традиционным соглашениям римских цифр.',
			],
		},
		useCases: {
			en: [
				'Converting years for historical documents',
				'Numbering book chapters and sections',
				'Creating clock faces and watch designs',
				'Academic and educational purposes',
				'Movie and TV series numbering',
				'Monument and building inscriptions',
			],
			ru: [
				'Преобразование годов для исторических документов',
				'Нумерация глав и разделов книг',
				'Создание циферблатов часов и дизайнов часов',
				'Академические и образовательные цели',
				'Нумерация фильмов и телесериалов',
				'Надписи на памятниках и зданиях',
			],
		},
		keywords: {
			en: [
				'roman numerals',
				'arabic to roman',
				'number converter',
				'roman number converter',
				'I V X L C D M',
			],
			ru: [
				'римские цифры',
				'арабские в римские',
				'конвертер чисел',
				'римские числа',
				'I V X L C D M',
			],
		},
	},
	'percentage-of-a-number': {
		title: {
			en: 'Percentage of a Number Calculator - Calculate Percent',
			ru: 'Калькулятор процента от числа - Вычислить процент',
		},
		description: {
			en: 'Calculate what a certain percentage of a number is. Useful for discounts, tips, taxes, and other percentage-based calculations. Free online percentage calculator.',
			ru: 'Вычислите, сколько составляет определенный процент от числа. Полезно для скидок, чаевых, налогов и других процентных расчетов. Бесплатный онлайн калькулятор процентов.',
		},
		ogTitle: {
			en: 'Percentage of a Number Calculator | Calculate Percent',
			ru: 'Калькулятор процента от числа | Вычислить процент',
		},
		ogDescription: {
			en: 'Calculate percentages instantly. Free online tool for finding what percentage a number represents or calculating a percentage of a value.',
			ru: 'Вычисляйте проценты мгновенно. Бесплатный онлайн инструмент для определения процента числа или вычисления процента от значения.',
		},
		text: {
			en: [
				'Calculating percentages is one of the most common mathematical operations in daily life. Whether you need to determine a discount amount, calculate a tip, or figure out tax, understanding how to calculate a percentage of a number is essential.',
				'Our percentage calculator makes these calculations quick and accurate. Simply enter the base number and the percentage value, and get instant results. This tool is perfect for financial planning, shopping, dining, and any situation where percentage calculations are needed.',
			],
			ru: [
				'Вычисление процентов - одна из самых распространенных математических операций в повседневной жизни. Независимо от того, нужно ли вам определить сумму скидки, рассчитать чаевые или вычислить налог, понимание того, как вычислить процент от числа, является необходимым.',
				'Наш калькулятор процентов делает эти вычисления быстрыми и точными. Просто введите базовое число и процентное значение, и получите мгновенные результаты. Этот инструмент идеально подходит для финансового планирования, покупок, ресторанов и любой ситуации, где необходимы процентные расчеты.',
			],
		},
		useCases: {
			en: [
				'Calculating discounts and sale prices',
				'Determining tip amounts at restaurants',
				'Computing tax amounts and totals',
				'Financial planning and budgeting',
				'Grade calculations and academic scores',
				'Business markup and profit margin calculations',
			],
			ru: [
				'Вычисление скидок и цен на распродажах',
				'Определение сумм чаевых в ресторанах',
				'Вычисление сумм налогов и итогов',
				'Финансовое планирование и бюджетирование',
				'Расчет оценок и академических баллов',
				'Бизнес-наценки и расчет маржи прибыли',
			],
		},
		keywords: {
			en: [
				'percentage calculator',
				'percent of number',
				'percentage calculation',
				'discount calculator',
				'tip calculator',
			],
			ru: [
				'калькулятор процентов',
				'процент от числа',
				'вычисление процента',
				'калькулятор скидок',
				'калькулятор чаевых',
			],
		},
	},
	'add-subtract-percentage': {
		title: {
			en: 'Add/Subtract Percentage Calculator - Increase or Decrease by Percent',
			ru: 'Калькулятор прибавления/вычитания процента - Увеличить или уменьшить',
		},
		description: {
			en: 'Add or subtract a percentage from a number. Calculate increases and decreases by percentage. Free online percentage addition and subtraction calculator.',
			ru: 'Прибавьте или вычтите процент от числа. Вычислите увеличения и уменьшения на процент. Бесплатный онлайн калькулятор прибавления и вычитания процентов.',
		},
		ogTitle: {
			en: 'Add/Subtract Percentage Calculator | Increase/Decrease by %',
			ru: 'Калькулятор прибавления/вычитания процента | Увеличить/Уменьшить',
		},
		ogDescription: {
			en: 'Add or subtract percentages from numbers instantly. Calculate price increases, salary raises, discounts, and more with our free percentage calculator.',
			ru: 'Прибавляйте или вычитайте проценты от чисел мгновенно. Вычисляйте повышения цен, увеличение зарплаты, скидки и многое другое с помощью нашего бесплатного калькулятора процентов.',
		},
		text: {
			en: [
				'Adding or subtracting percentages is essential for calculating price changes, salary adjustments, interest rates, and many other real-world scenarios. Our calculator simplifies these operations by allowing you to quickly determine the result of increasing or decreasing a value by a certain percentage.',
				'Whether you need to calculate a price increase, determine a discounted price, or adjust values based on percentage changes, this tool provides accurate results instantly. Perfect for financial planning, business calculations, and everyday percentage adjustments.',
			],
			ru: [
				'Прибавление или вычитание процентов необходимо для расчета изменений цен, корректировок зарплаты, процентных ставок и многих других реальных сценариев. Наш калькулятор упрощает эти операции, позволяя быстро определить результат увеличения или уменьшения значения на определенный процент.',
				'Независимо от того, нужно ли вам рассчитать повышение цены, определить цену со скидкой или скорректировать значения на основе процентных изменений, этот инструмент обеспечивает точные результаты мгновенно. Идеально подходит для финансового планирования, бизнес-расчетов и повседневных процентных корректировок.',
			],
		},
		useCases: {
			en: [
				'Calculating price increases and decreases',
				'Determining salary raises and adjustments',
				'Computing interest rate changes',
				'Calculating markup and markdown prices',
				'Budget adjustments and financial planning',
				'Stock price change calculations',
			],
			ru: [
				'Вычисление повышений и снижений цен',
				'Определение повышений и корректировок зарплаты',
				'Вычисление изменений процентных ставок',
				'Расчет цен с наценкой и уценкой',
				'Корректировки бюджета и финансовое планирование',
				'Расчет изменений цен на акции',
			],
		},
		keywords: {
			en: [
				'add percentage',
				'subtract percentage',
				'percentage increase',
				'percentage decrease',
				'percent calculator',
			],
			ru: [
				'прибавить процент',
				'вычесть процент',
				'увеличение на процент',
				'уменьшение на процент',
				'калькулятор процентов',
			],
		},
	},
	'number-format': {
		title: {
			en: 'Number Format Converter - Indian Number Format',
			ru: 'Конвертер формата чисел - Индийский формат',
		},
		description: {
			en: 'Convert numbers to Indian number format (lakhs and crores). Compare with US format. Free online number formatting tool.',
			ru: 'Конвертируйте числа в индийский формат чисел (лакхи и кроры). Сравните с американским форматом. Бесплатный онлайн инструмент форматирования чисел.',
		},
		ogTitle: {
			en: 'Number Format Converter | Indian Format (Lakhs & Crores)',
			ru: 'Конвертер формата чисел | Индийский формат (Лакхи и Кроры)',
		},
		ogDescription: {
			en: 'Convert numbers to Indian numbering system with lakhs and crores. Compare Indian and US number formats side by side.',
			ru: 'Конвертируйте числа в индийскую систему счисления с лакхами и крорами. Сравните индийский и американский форматы чисел рядом.',
		},
		text: {
			en: [
				'The Indian numbering system uses a unique format with lakhs (100,000) and crores (10,000,000) as grouping units, which differs from the Western system that uses thousands, millions, and billions. Understanding and converting between these formats is essential for international business, finance, and communication.',
				'Our number format converter helps you transform numbers between Indian and US formats instantly. This tool is particularly useful for financial transactions, business documents, and any situation where you need to work with numbers in different regional formats.',
			],
			ru: [
				'Индийская система счисления использует уникальный формат с лакхами (100,000) и крорами (10,000,000) в качестве единиц группировки, что отличается от западной системы, которая использует тысячи, миллионы и миллиарды. Понимание и преобразование между этими форматами необходимо для международного бизнеса, финансов и общения.',
				'Наш конвертер формата чисел помогает мгновенно преобразовывать числа между индийским и американским форматами. Этот инструмент особенно полезен для финансовых транзакций, деловых документов и любой ситуации, где вам нужно работать с числами в разных региональных форматах.',
			],
		},
		useCases: {
			en: [
				'International business and finance',
				'Converting currency amounts',
				'Financial reporting and documentation',
				'Cross-cultural communication',
				'Educational purposes',
				'Banking and accounting',
			],
			ru: [
				'Международный бизнес и финансы',
				'Конвертация денежных сумм',
				'Финансовая отчетность и документация',
				'Межкультурная коммуникация',
				'Образовательные цели',
				'Банковское дело и бухгалтерия',
			],
		},
		keywords: {
			en: [
				'number format',
				'Indian number format',
				'lakh crore',
				'number converter',
				'formatting numbers',
			],
			ru: [
				'формат чисел',
				'индийский формат',
				'лакх крора',
				'конвертер чисел',
				'форматирование чисел',
			],
		},
	},
	factors: {
		title: {
			en: 'Number Factors Calculator - Find All Factors and Prime Factorization',
			ru: 'Калькулятор делителей числа - Найти все делители и разложение',
		},
		description: {
			en: 'Find all factors and prime factorization of any number. Calculate divisors and determine if a number is prime or composite. Free online factors calculator.',
			ru: 'Найдите все делители и разложение на простые множители любого числа. Вычислите делители и определите, является ли число простым или составным. Бесплатный онлайн калькулятор делителей.',
		},
		ogTitle: {
			en: 'Number Factors Calculator | Find Divisors & Prime Factors',
			ru: 'Калькулятор делителей числа | Найти делители и простые множители',
		},
		ogDescription: {
			en: 'Find all factors, prime factorization, and number classification instantly. Free online tool for analyzing number properties and divisors.',
			ru: 'Найдите все делители, разложение на простые множители и классификацию числа мгновенно. Бесплатный онлайн инструмент для анализа свойств чисел и делителей.',
		},
		text: {
			en: [
				'Understanding the factors of a number is fundamental in mathematics, especially in number theory, algebra, and cryptography. Factors are the numbers that divide evenly into a given number, and prime factorization breaks down a number into its prime components.',
				'Our factors calculator helps you find all divisors of a number, determine whether it is prime or composite, and provides the prime factorization. This tool is essential for students, mathematicians, and anyone working with number properties and divisibility.',
			],
			ru: [
				'Понимание делителей числа является фундаментальным в математике, особенно в теории чисел, алгебре и криптографии. Делители - это числа, которые делятся нацело на данное число, а разложение на простые множители разбивает число на его простые компоненты.',
				'Наш калькулятор делителей помогает найти все делители числа, определить, является ли оно простым или составным, и предоставляет разложение на простые множители. Этот инструмент необходим для студентов, математиков и всех, кто работает со свойствами чисел и делимостью.',
			],
		},
		useCases: {
			en: [
				'Mathematics and number theory studies',
				'Prime number identification',
				'Cryptography and security applications',
				'Educational purposes for learning divisibility',
				'Algorithm design and optimization',
				'Mathematical problem solving',
			],
			ru: [
				'Изучение математики и теории чисел',
				'Идентификация простых чисел',
				'Криптография и приложения безопасности',
				'Образовательные цели для изучения делимости',
				'Проектирование и оптимизация алгоритмов',
				'Решение математических задач',
			],
		},
		keywords: {
			en: [
				'factors calculator',
				'prime factorization',
				'divisors',
				'prime number',
				'number factors',
			],
			ru: [
				'калькулятор делителей',
				'разложение на множители',
				'делители',
				'простое число',
				'делители числа',
			],
		},
	},
	'root-calculator': {
		title: {
			en: 'Root Calculator - Square, Cube, and Other Roots',
			ru: 'Калькулятор корней - Квадратный, кубический и другие корни',
		},
		description: {
			en: 'Calculate square, cube, and other roots of numbers. Supports roots of any degree from 2 to 100. Free online root calculator.',
			ru: 'Вычислите квадратный, кубический и другие корни чисел. Поддерживает корни любой степени от 2 до 100. Бесплатный онлайн калькулятор корней.',
		},
		ogTitle: {
			en: 'Root Calculator | Square, Cube, and Other Roots',
			ru: 'Калькулятор корней | Квадратный, кубический и другие корни',
		},
		ogDescription: {
			en: 'Calculate roots of any degree instantly. Free online tool for calculating square roots, cube roots, and nth roots.',
			ru: 'Вычисляйте корни любой степени мгновенно. Бесплатный онлайн инструмент для расчета квадратных, кубических и корней n-й степени.',
		},
		text: {
			en: [
				'Root calculator allows you to calculate the root of any degree from a number. Supports square roots (√), cube roots (∛), and roots of any other degree (ⁿ√).',
				'This tool is useful for mathematical calculations, solving equations, and performing various computations related to roots.',
			],
			ru: [
				'Калькулятор корней позволяет вычислить корень любой степени из числа. Поддерживаются квадратные корни (√), кубические корни (∛) и корни любой другой степени (ⁿ√).',
				'Этот инструмент полезен для математических расчетов, решения уравнений и выполнения различных вычислений, связанных с корнями.',
			],
		},
		useCases: {
			en: [
				'Mathematical calculations and problem solving',
				'Solving equations with roots',
				'Engineering and scientific computations',
				'Educational purposes for learning roots',
				'Financial calculations involving roots',
				'Academic and research applications',
			],
			ru: [
				'Математические расчеты и решение задач',
				'Решение уравнений с корнями',
				'Инженерные и научные вычисления',
				'Образовательные цели для изучения корней',
				'Финансовые расчеты с корнями',
				'Академические и исследовательские приложения',
			],
		},
		keywords: {
			en: [
				'root calculator',
				'square root',
				'cube root',
				'nth root',
				'root calculation',
			],
			ru: [
				'калькулятор корней',
				'квадратный корень',
				'кубический корень',
				'корень n-й степени',
				'вычисление корня',
			],
		},
	},
};
