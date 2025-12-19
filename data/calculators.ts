import type { CalculatorDefinition } from '@/lib/calculators/types'
import { calculatePercentageOfNumber } from '@/lib/calculations/percentage'
import { calculateAddPercentage } from '@/lib/calculations/add-percentage'
import { calculateSubtractPercentage } from '@/lib/calculations/subtract-percentage'
import { calculateLoanPayment } from '@/lib/calculations/loan'
import { calculateCompoundInterest } from '@/lib/calculations/compound-interest'

/**
 * Registry of all calculator definitions
 * Add new calculators here to make them available
 * Each calculator can have multiple locale versions with the same id
 */
export const calculators: CalculatorDefinition[] = [
	// Percentage of a Number (EN)
	{
		id: 'percentage-of-a-number',
		slug: 'percentage-of-a-number',
		category: 'math',
		title: 'Percentage of a Number',
		shortDescription:
			'Calculate what a certain percentage of a number is. Useful for discounts, tips, taxes, and other percentage-based calculations.',
		longDescription:
			'This calculator helps you determine what a specific percentage of any number equals. Simply enter the base number and the percentage you want to calculate. Perfect for calculating discounts, tips, taxes, commissions, and any other percentage-based calculations.',
		locale: 'en',
		inputs: [
			{
				name: 'value',
				label: 'Number',
				type: 'number',
				placeholder: 'Enter the number',
				validation: {
					required: true,
					min: 0,
					message: 'Number must be greater than or equal to 0',
				},
			},
			{
				name: 'percent',
				label: 'Percentage',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter the percentage',
				validation: {
					required: true,
					min: 0,
					max: 1000,
					message: 'Percentage must be between 0 and 1000',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
				formatType: 'number',
			},
		],
		calculate: calculatePercentageOfNumber,
		howToBullets: [
			'Enter the number you want to calculate a percentage of',
			'Enter the percentage value (e.g., 20 for 20%)',
			'Click "Calculate" to get the result',
			'The result shows what the percentage of the number is',
			'You can use this for discounts, tips, taxes, and more',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Calculate 20% of 100',
				inputDescription: 'Calculate 20% of 100',
				steps: [
					'Number: 100',
					'Percentage: 20%',
					'Calculation: (100 × 20) / 100',
					'Result: 20',
				],
				resultDescription: '20% of 100 equals 20',
			},
			{
				id: 'example-2',
				title: 'Example 2: Calculate 15% tip',
				inputDescription: 'Calculate 15% tip on a $250 bill',
				steps: [
					'Number: 250',
					'Percentage: 15%',
					'Calculation: (250 × 15) / 100',
					'Result: 37.5',
				],
				resultDescription: 'A 15% tip on $250 is $37.50',
			},
			{
				id: 'example-3',
				title: 'Example 3: Calculate discount',
				inputDescription: 'Calculate 25% discount on $80',
				steps: [
					'Number: 80',
					'Percentage: 25%',
					'Calculation: (80 × 25) / 100',
					'Result: 20',
				],
				resultDescription: 'A 25% discount on $80 is $20',
			},
		],
		faq: [
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
		relatedIds: ['add-percentage', 'subtract-percentage', 'loan-payment'],
		standardIds: [],
		meta: {
			keywords: ['percentage', 'calculation', 'math', 'discount', 'tip', 'tax'],
		},
	},
	// Add Percentage (EN)
	{
		id: 'add-percentage',
		slug: 'add-percentage',
		category: 'math',
		title: 'Add Percentage to Number',
		shortDescription:
			'Increase a number by a certain percentage. Useful for calculating price increases, salary raises, and growth rates.',
		longDescription:
			'This calculator helps you add a percentage to a number. Enter the base number and the percentage you want to add. The result will be the original number plus the percentage increase. Perfect for calculating price increases, salary raises, growth rates, and markups.',
		locale: 'en',
		inputs: [
			{
				name: 'value',
				label: 'Number',
				type: 'number',
				placeholder: 'Enter the number',
				validation: {
					required: true,
					min: 0,
					message: 'Number must be greater than or equal to 0',
				},
			},
			{
				name: 'percent',
				label: 'Percentage to Add',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter the percentage',
				validation: {
					required: true,
					min: 0,
					message: 'Percentage must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
				formatType: 'number',
			},
		],
		calculate: calculateAddPercentage,
		howToBullets: [
			'Enter the base number you want to increase',
			'Enter the percentage you want to add (e.g., 20 for 20%)',
			'Click "Calculate" to get the result',
			'The result shows the original number plus the percentage increase',
			'Formula: Result = Number × (1 + Percentage / 100)',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Add 20% to 100',
				inputDescription: 'Add 20% to 100',
				steps: [
					'Number: 100',
					'Percentage: 20%',
					'Calculation: 100 × (1 + 20/100)',
					'Calculation: 100 × 1.20',
					'Result: 120',
				],
				resultDescription: '100 increased by 20% equals 120',
			},
			{
				id: 'example-2',
				title: 'Example 2: Price increase',
				inputDescription: 'Increase $50 by 15%',
				steps: [
					'Number: 50',
					'Percentage: 15%',
					'Calculation: 50 × (1 + 15/100)',
					'Result: 57.5',
				],
				resultDescription: '$50 increased by 15% equals $57.50',
			},
		],
		faq: [
			{
				question: 'How do I add a percentage to a number?',
				answer:
					'To add a percentage to a number, multiply the number by (1 + percentage/100). For example, 100 + 20% = 100 × 1.20 = 120.',
			},
			{
				question: 'Can I use this for price increases?',
				answer:
					'Yes! Enter the original price and the percentage increase. The result will show the new price.',
			},
			{
				question: 'What if I want to calculate a salary raise?',
				answer:
					'Enter your current salary and the raise percentage. The result will show your new salary.',
			},
			{
				question: 'How is this different from percentage of a number?',
				answer:
					'Adding a percentage increases the original number by that percentage. Calculating a percentage of a number gives you only the percentage amount, not the increased total.',
			},
		],
		relatedIds: ['percentage-of-a-number', 'subtract-percentage'],
		meta: {
			keywords: ['add percentage', 'increase', 'growth', 'raise', 'markup'],
		},
	},
	// Subtract Percentage (EN)
	{
		id: 'subtract-percentage',
		slug: 'subtract-percentage',
		category: 'math',
		title: 'Subtract Percentage from Number',
		shortDescription:
			'Decrease a number by a certain percentage. Useful for calculating discounts, price reductions, and decreases.',
		longDescription:
			'This calculator helps you subtract a percentage from a number. Enter the base number and the percentage you want to subtract. The result will be the original number minus the percentage decrease. Perfect for calculating discounts, price reductions, decreases, and markdowns.',
		locale: 'en',
		inputs: [
			{
				name: 'value',
				label: 'Number',
				type: 'number',
				placeholder: 'Enter the number',
				validation: {
					required: true,
					min: 0,
					message: 'Number must be greater than or equal to 0',
				},
			},
			{
				name: 'percent',
				label: 'Percentage to Subtract',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter the percentage',
				validation: {
					required: true,
					min: 0,
					max: 100,
					message: 'Percentage must be between 0 and 100',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
				formatType: 'number',
			},
		],
		calculate: calculateSubtractPercentage,
		howToBullets: [
			'Enter the base number you want to decrease',
			'Enter the percentage you want to subtract (e.g., 20 for 20%)',
			'Click "Calculate" to get the result',
			'The result shows the original number minus the percentage decrease',
			'Formula: Result = Number × (1 - Percentage / 100)',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Subtract 20% from 100',
				inputDescription: 'Subtract 20% from 100',
				steps: [
					'Number: 100',
					'Percentage: 20%',
					'Calculation: 100 × (1 - 20/100)',
					'Calculation: 100 × 0.80',
					'Result: 80',
				],
				resultDescription: '100 decreased by 20% equals 80',
			},
			{
				id: 'example-2',
				title: 'Example 2: Discount calculation',
				inputDescription: 'Apply 30% discount to $200',
				steps: [
					'Number: 200',
					'Percentage: 30%',
					'Calculation: 200 × (1 - 30/100)',
					'Result: 140',
				],
				resultDescription: '$200 with 30% discount equals $140',
			},
		],
		faq: [
			{
				question: 'How do I subtract a percentage from a number?',
				answer:
					'To subtract a percentage from a number, multiply the number by (1 - percentage/100). For example, 100 - 20% = 100 × 0.80 = 80.',
			},
			{
				question: 'Can I use this for discounts?',
				answer:
					'Yes! Enter the original price and the discount percentage. The result will show the discounted price.',
			},
			{
				question: 'What is the maximum percentage I can subtract?',
				answer:
					'You can subtract up to 100%, which would result in 0. However, in practice, discounts are usually less than 100%.',
			},
			{
				question: 'How is this different from calculating a percentage of a number?',
				answer:
					'Subtracting a percentage decreases the original number by that percentage. Calculating a percentage of a number gives you only the percentage amount, not the decreased total.',
			},
		],
		relatedIds: ['percentage-of-a-number', 'add-percentage'],
		standardIds: [],
		meta: {
			keywords: ['subtract percentage', 'discount', 'decrease', 'reduction', 'markdown'],
		},
	},
	// Loan Payment (EN)
	{
		id: 'loan-payment',
		slug: 'loan-payment',
		category: 'finance',
		title: 'Loan Payment Calculator',
		shortDescription:
			'Calculate your monthly loan payment, total payment amount, and total interest paid over the life of the loan.',
		longDescription:
			'This calculator helps you determine your monthly loan payment using the standard loan formula. Enter the loan amount, annual interest rate, and loan term in years. The calculator will show your monthly payment, total amount paid over the life of the loan, and total interest paid. Works for mortgages, auto loans, personal loans, and any fixed-rate loan.',
		locale: 'en',
		inputs: [
			{
				name: 'principal',
				label: 'Loan Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter loan amount',
				validation: {
					required: true,
					min: 0,
					message: 'Loan amount must be greater than 0',
				},
			},
			{
				name: 'annualRate',
				label: 'Annual Interest Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0,
					max: 100,
					message: 'Interest rate must be between 0 and 100',
				},
			},
			{
				name: 'years',
				label: 'Loan Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term in years',
				step: 0.5,
				validation: {
					required: true,
					min: 0.1,
					max: 100,
					message: 'Loan term must be between 0.1 and 100 years',
				},
			},
		],
		outputs: [
			{
				name: 'monthlyPayment',
				label: 'Monthly Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalPayment',
				label: 'Total Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'steps',
				label: 'Calculation Steps',
			},
		],
		calculate: calculateLoanPayment,
		howToBullets: [
			'Enter the loan amount (principal)',
			'Enter the annual interest rate as a percentage (e.g., 5 for 5%)',
			'Enter the loan term in years',
			'Click "Calculate" to see your monthly payment, total payment, and total interest',
			'The monthly payment is calculated using the standard loan formula',
			'Total payment includes both principal and interest',
			'Total interest shows how much you will pay in interest over the life of the loan',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: $100,000 mortgage at 5% for 30 years',
				inputDescription: '$100,000 loan at 5% annual rate for 30 years',
				steps: [
					'Principal: $100,000',
					'Annual rate: 5% (monthly rate: 5% / 12 = 0.4167%)',
					'Term: 30 years (360 months)',
					'Monthly payment: $536.82',
					'Total payment: $193,255.78',
					'Total interest: $93,255.78',
				],
				resultDescription: 'Monthly payment: $536.82',
			},
			{
				id: 'example-2',
				title: 'Example 2: $25,000 auto loan at 4.5% for 5 years',
				inputDescription: '$25,000 auto loan at 4.5% for 5 years',
				steps: [
					'Principal: $25,000',
					'Annual rate: 4.5% (monthly rate: 4.5% / 12 = 0.375%)',
					'Term: 5 years (60 months)',
					'Monthly payment: $465.75',
					'Total payment: $27,945.00',
					'Total interest: $2,945.00',
				],
				resultDescription: 'Monthly payment: $465.75',
			},
		],
		faq: [
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
			{
				question: 'Can I calculate loans with different payment frequencies?',
				answer:
					'This calculator assumes monthly payments. For other frequencies, you would need to adjust the interest rate and term accordingly.',
			},
		],
		relatedIds: ['percentage-of-a-number', 'compound-interest'],
		standardIds: ['eurocode-1'],
		meta: {
			keywords: ['loan', 'mortgage', 'payment', 'finance', 'interest', 'annuity'],
		},
	},
	// Compound Interest (EN)
	{
		id: 'compound-interest',
		slug: 'compound-interest',
		category: 'finance',
		title: 'Compound Interest Calculator',
		shortDescription:
			'Calculate how much your investment will grow with compound interest. See the final amount and total interest earned over time.',
		longDescription:
			'This calculator helps you determine how much your investment will grow with compound interest. Enter the initial investment amount, annual interest rate, investment period, and compounding frequency. The calculator will show the final amount and total interest earned. Perfect for savings accounts, investments, and retirement planning.',
		locale: 'en',
		inputs: [
			{
				name: 'principal',
				label: 'Principal Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter initial investment',
				validation: {
					required: true,
					min: 0,
					message: 'Principal must be greater than 0',
				},
			},
			{
				name: 'annualRate',
				label: 'Annual Interest Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0,
					max: 100,
					message: 'Interest rate must be between 0 and 100',
				},
			},
			{
				name: 'years',
				label: 'Investment Period',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter number of years',
				step: 0.5,
				validation: {
					required: true,
					min: 0.1,
					max: 100,
					message: 'Investment period must be between 0.1 and 100 years',
				},
			},
			{
				name: 'compoundFrequency',
				label: 'Compounding Frequency',
				type: 'number',
				unitLabel: 'times per year',
				placeholder: 'Enter compounding frequency',
				defaultValue: 12,
				helpText:
					'Common values: 1 (annually), 4 (quarterly), 12 (monthly), 365 (daily)',
				validation: {
					required: true,
					min: 1,
					max: 365,
					message: 'Compounding frequency must be between 1 and 365',
				},
			},
		],
		outputs: [
			{
				name: 'finalAmount',
				label: 'Final Amount',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest Earned',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'steps',
				label: 'Calculation Steps',
			},
		],
		calculate: calculateCompoundInterest,
		howToBullets: [
			'Enter the initial investment amount (principal)',
			'Enter the annual interest rate as a percentage',
			'Enter the investment period in years',
			'Enter how many times per year interest is compounded (12 for monthly, 4 for quarterly, etc.)',
			'Click "Calculate" to see the final amount and total interest earned',
			'The formula used is: A = P(1 + r/n)^(nt)',
			'More frequent compounding results in higher returns',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: $10,000 at 5% for 10 years, compounded monthly',
				inputDescription:
					'$10,000 invested at 5% annual rate for 10 years, compounded monthly',
				steps: [
					'Principal: $10,000',
					'Annual rate: 5%',
					'Period: 10 years',
					'Compounding: 12 times per year (monthly)',
					'Formula: A = P(1 + r/n)^(nt)',
					'Calculation: $10,000 × (1 + 0.05/12)^(12×10)',
					'Final amount: $16,470.09',
					'Total interest: $6,470.09',
				],
				resultDescription: 'Final amount: $16,470.09',
			},
			{
				id: 'example-2',
				title: 'Example 2: $5,000 at 7% for 5 years, compounded quarterly',
				inputDescription: '$5,000 invested at 7% annual rate for 5 years, compounded quarterly',
				steps: [
					'Principal: $5,000',
					'Annual rate: 7%',
					'Period: 5 years',
					'Compounding: 4 times per year (quarterly)',
					'Final amount: $7,081.19',
					'Total interest: $2,081.19',
				],
				resultDescription: 'Final amount: $7,081.19',
			},
		],
		faq: [
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
		relatedIds: ['loan-payment'],
		standardIds: [],
		meta: {
			keywords: ['compound interest', 'investment', 'savings', 'finance', 'growth'],
		},
	},
	// Percentage of a Number (RU)
	{
		id: 'percentage-of-a-number',
		slug: 'percentage-of-a-number',
		category: 'math',
		title: 'Процент от числа',
		shortDescription:
			'Рассчитайте, сколько составляет определенный процент от числа. Полезно для расчета скидок, чаевых, налогов и других процентных вычислений.',
		longDescription:
			'Этот калькулятор помогает определить, сколько составляет определенный процент от любого числа. Просто введите базовое число и процент, который хотите рассчитать. Идеально подходит для расчета скидок, чаевых, налогов, комиссий и любых других процентных вычислений.',
		locale: 'ru',
		inputs: [
			{
				name: 'value',
				label: 'Число',
				type: 'number',
				placeholder: 'Введите число',
				validation: {
					required: true,
					min: 0,
					message: 'Число должно быть больше или равно 0',
				},
			},
			{
				name: 'percent',
				label: 'Процент',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Введите процент',
				validation: {
					required: true,
					min: 0,
					max: 1000,
					message: 'Процент должен быть от 0 до 1000',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Результат',
				formatType: 'number',
			},
		],
		calculate: calculatePercentageOfNumber,
		howToBullets: [
			'Введите число, от которого хотите рассчитать процент',
			'Введите значение процента (например, 20 для 20%)',
			'Нажмите "Рассчитать" для получения результата',
			'Результат показывает, сколько составляет процент от числа',
			'Вы можете использовать это для скидок, чаевых, налогов и многого другого',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Пример 1: Рассчитать 20% от 100',
				inputDescription: 'Рассчитать 20% от 100',
				steps: [
					'Число: 100',
					'Процент: 20%',
					'Расчет: (100 × 20) / 100',
					'Результат: 20',
				],
				resultDescription: '20% от 100 равно 20',
			},
			{
				id: 'example-2',
				title: 'Пример 2: Рассчитать 15% чаевых',
				inputDescription: 'Рассчитать 15% чаевых со счета 250 рублей',
				steps: [
					'Число: 250',
					'Процент: 15%',
					'Расчет: (250 × 15) / 100',
					'Результат: 37.5',
				],
				resultDescription: '15% чаевых с 250 рублей составляет 37.50 рублей',
			},
		],
		faq: [
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
		relatedIds: ['loan-payment'],
		meta: {
			keywords: ['процент', 'расчет', 'математика', 'скидка', 'чаевые', 'налог'],
		},
	},
	// Loan Payment (RU)
	{
		id: 'loan-payment',
		slug: 'loan-payment',
		category: 'finance',
		title: 'Калькулятор платежей по кредиту',
		shortDescription:
			'Рассчитайте ежемесячный платеж по кредиту, общую сумму выплат и общую сумму процентов за весь срок кредита.',
		longDescription:
			'Этот калькулятор помогает определить ежемесячный платеж по кредиту, используя стандартную формулу кредита. Введите сумму кредита, годовую процентную ставку и срок кредита в годах. Калькулятор покажет ежемесячный платеж, общую сумму выплат за весь срок кредита и общую сумму процентов. Работает для ипотеки, автокредитов, потребительских кредитов и любых кредитов с фиксированной ставкой.',
		locale: 'ru',
		inputs: [
			{
				name: 'principal',
				label: 'Сумма кредита',
				type: 'number',
				unitLabel: '₽',
				placeholder: 'Введите сумму кредита',
				validation: {
					required: true,
					min: 0,
					message: 'Сумма кредита должна быть больше 0',
				},
			},
			{
				name: 'annualRate',
				label: 'Годовая процентная ставка',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Введите годовую процентную ставку',
				validation: {
					required: true,
					min: 0,
					max: 100,
					message: 'Процентная ставка должна быть от 0 до 100',
				},
			},
			{
				name: 'years',
				label: 'Срок кредита',
				type: 'number',
				unitLabel: 'лет',
				placeholder: 'Введите срок кредита в годах',
				step: 0.5,
				validation: {
					required: true,
					min: 0.1,
					max: 100,
					message: 'Срок кредита должен быть от 0.1 до 100 лет',
				},
			},
		],
		outputs: [
			{
				name: 'monthlyPayment',
				label: 'Ежемесячный платеж',
				unitLabel: '₽',
				formatType: 'number',
			},
			{
				name: 'totalPayment',
				label: 'Общая сумма выплат',
				unitLabel: '₽',
				formatType: 'number',
			},
			{
				name: 'totalInterest',
				label: 'Общая сумма процентов',
				unitLabel: '₽',
				formatType: 'number',
			},
		],
		calculate: calculateLoanPayment,
		howToBullets: [
			'Введите сумму кредита (основной долг)',
			'Введите годовую процентную ставку в процентах (например, 5 для 5%)',
			'Введите срок кредита в годах',
			'Нажмите "Рассчитать", чтобы увидеть ежемесячный платеж, общую сумму выплат и общую сумму процентов',
			'Ежемесячный платеж рассчитывается по стандартной формуле кредита',
			'Общая сумма выплат включает как основной долг, так и проценты',
			'Общая сумма процентов показывает, сколько вы заплатите процентов за весь срок кредита',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Пример 1: Ипотека 1,000,000 рублей под 5% на 30 лет',
				inputDescription: 'Кредит 1,000,000 рублей под 5% годовых на 30 лет',
				steps: [
					'Основной долг: 1,000,000 рублей',
					'Годовая ставка: 5% (месячная ставка: 5% / 12 = 0.4167%)',
					'Срок: 30 лет (360 месяцев)',
					'Ежемесячный платеж: 5,368.22 рублей',
					'Общая сумма выплат: 1,932,557.80 рублей',
					'Общая сумма процентов: 932,557.80 рублей',
				],
				resultDescription: 'Ежемесячный платеж: 5,368.22 рублей',
			},
		],
		faq: [
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
		relatedIds: ['percentage-of-a-number'],
		meta: {
			keywords: ['кредит', 'ипотека', 'платеж', 'финансы', 'проценты', 'аннуитет'],
		},
	},
]

/**
 * Get calculator by ID and locale
 * @deprecated Use getCalculatorById from @/lib/calculators/loader instead
 */
export function getCalculatorById(
	id: string,
	locale: string = 'en',
): CalculatorDefinition | undefined {
	return calculators.find((calc) => calc.id === id && calc.locale === locale)
}

/**
 * Get calculator by slug, category, and locale
 * @deprecated Use getCalculatorBySlug from @/lib/calculators/loader instead
 */
export function getCalculatorBySlug(
	category: string,
	slug: string,
	locale: string = 'en',
): CalculatorDefinition | undefined {
	return calculators.find(
		(calc) =>
			calc.category === category &&
			calc.slug === slug &&
			calc.locale === locale,
	)
}

/**
 * Get all calculators for a specific locale
 */
export function getCalculatorsByLocale(
	locale: string = 'en',
): CalculatorDefinition[] {
	return calculators.filter((calc) => calc.locale === locale)
}

/**
 * Get calculators by category and locale
 */
export function getCalculatorsByCategory(
	category: string,
	locale: string = 'en',
): CalculatorDefinition[] {
	return calculators.filter(
		(calc) => calc.category === category && calc.locale === locale,
	)
}

/**
 * Get related calculators by IDs and locale
 */
export function getRelatedCalculators(
	relatedIds: string[],
	locale: string = 'en',
): CalculatorDefinition[] {
	return calculators.filter(
		(calc) => relatedIds.includes(calc.id) && calc.locale === locale,
	)
}

/**
 * Get all unique categories for a locale
 */
export function getCategories(locale: string = 'en'): string[] {
	const categories = new Set<string>()
	calculators
		.filter((calc) => calc.locale === locale)
		.forEach((calc) => categories.add(calc.category))
	return Array.from(categories).sort()
}
