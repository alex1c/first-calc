/**
 * Generate RU item overlays for the eight EN-only TS finance calculators.
 * Field names/option values stay identical to EN; labels/copy are Russian.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// Load via tsx-compatible dynamic import of the TS module
const { calculators } = await import('../data/calculators.ts')

const SLUGS = [
	'compound-interest',
	'loan-comparison-calculator',
	'mortgage-comparison-calculator',
	'retirement-calculator',
	'investment-vs-savings-calculator',
	'take-home-pay-calculator',
	'emergency-fund-calculator',
	'net-worth-calculator',
]

const TITLE_RU = {
	'compound-interest': 'Калькулятор сложных процентов',
	'loan-comparison-calculator': 'Сравнение кредитов',
	'mortgage-comparison-calculator': 'Сравнение ипотечных предложений',
	'retirement-calculator': 'Калькулятор пенсии и накоплений',
	'investment-vs-savings-calculator': 'Инвестиции против сбережений',
	'take-home-pay-calculator': 'Калькулятор зарплаты на руки',
	'emergency-fund-calculator': 'Калькулятор финансовой подушки',
	'net-worth-calculator': 'Калькулятор чистого капитала',
}

const SHORT_RU = {
	'compound-interest':
		'Рассчитайте рост вложений со сложными процентами: итоговая сумма, взносы и начисленные проценты.',
	'loan-comparison-calculator':
		'Сравните предложения кредитов рядом: платёж, проценты, комиссии и полную стоимость.',
	'mortgage-comparison-calculator':
		'Сравните варианты ипотеки и выберите лучший по платежу, процентам или общей стоимости.',
	'retirement-calculator':
		'Спланируйте пенсионные накопления: сколько будет к пенсии и сколько нужно откладывать.',
	'investment-vs-savings-calculator':
		'Сравните стратегию сбережений и инвестиций на одном горизонте с учётом инфляции.',
	'take-home-pay-calculator':
		'Оцените зарплату «на руки» после налогов и обязательных удержаний.',
	'emergency-fund-calculator':
		'Рассчитайте размер финансовой подушки и срок её накопления.',
	'net-worth-calculator':
		'Посчитайте чистый капитал: активы минус обязательства.',
}

/** Common label translations for finance field names */
const LABEL_RU = {
	initialAmount: 'Начальная сумма',
	monthlyContribution: 'Ежемесячный взнос',
	annualInterestRate: 'Годовая процентная ставка',
	investmentPeriod: 'Срок инвестирования',
	compoundingFrequency: 'Частота капитализации',
	comparisonMetric: 'Критерий сравнения',
	paymentFrequency: 'Частота платежей',
	calculationMode: 'Режим расчёта',
	currentAge: 'Текущий возраст',
	retirementAge: 'Возраст выхода на пенсию',
	currentSavings: 'Текущие накопления',
	annualReturnRate: 'Годовая доходность',
	contributionGrowthRate: 'Рост взносов (необязательно)',
	inflationRate: 'Инфляция (необязательно)',
	compoundFrequency: 'Частота капитализации',
	desiredMonthlyIncome: 'Желаемый месячный доход',
	withdrawalRate: 'Ставка снятия',
	timeHorizonYears: 'Горизонт (лет)',
	savingsInterestRate: 'Ставка сбережений',
	savingsCompoundingFrequency: 'Капитализация сбережений',
	expectedInvestmentReturn: 'Ожидаемая доходность инвестиций',
	investmentCompoundingFrequency: 'Капитализация инвестиций',
	grossSalary: 'Валовая зарплата',
	payFrequency: 'Периодичность выплат',
	taxRate: 'Налоговая ставка',
	otherDeductions: 'Прочие удержания',
	monthlyExpenses: 'Ежемесячные расходы',
	monthsOfCoverage: 'Месяцев покрытия',
	currentEmergencyFund: 'Текущая подушка',
	monthlySavings: 'Ежемесячные отложения',
	totalAssets: 'Сумма активов',
	totalLiabilities: 'Сумма обязательств',
	cash: 'Наличные и счета',
	investments: 'Инвестиции',
	realEstate: 'Недвижимость',
	otherAssets: 'Прочие активы',
	mortgageDebt: 'Ипотечный долг',
	otherDebts: 'Прочие долги',
	finalAmount: 'Итоговая сумма',
	totalContributions: 'Всего взносов',
	totalInterestEarned: 'Начисленные проценты',
	effectiveAnnualRate: 'Эффективная годовая ставка',
	yearBreakdown: 'Разбивка по годам',
	formulaExplanation: 'Пояснение формулы',
}

const OPTION_LABEL_RU = {
	annually: 'Ежегодно',
	quarterly: 'Ежеквартально',
	monthly: 'Ежемесячно',
	daily: 'Ежедневно',
	'bi-weekly': 'Раз в две недели',
	biweekly: 'Раз в две недели',
	weekly: 'Еженедельно',
	'lowest-monthly-payment': 'Минимальный ежемесячный платёж',
	'lowest-total-interest': 'Минимальные проценты',
	'lowest-total-cost': 'Минимальная полная стоимость',
	future_balance: 'Сколько будет к пенсии?',
	required_savings: 'Сколько нужно накопить?',
	annual: 'Ежегодно',
	semimonthly: 'Дважды в месяц',
}

const UNIT_RU = {
	$: '₽',
	'%': '%',
	years: 'лет',
	year: 'год',
	months: 'мес.',
	'/year': '₽/год',
	'/month': '₽/мес.',
}

function translateLabel(name, enLabel) {
	if (LABEL_RU[name]) return LABEL_RU[name]
	// Loan comparison dynamic fields
	const loanMatch = name.match(/^loan(\d)(.+)$/)
	if (loanMatch) {
		const letter = String.fromCharCode(64 + Number(loanMatch[1])) // 1->A
		const rest = loanMatch[2]
		const restRu = {
			Name: 'Название',
			Amount: 'Сумма',
			AnnualInterestRate: 'Годовая ставка (APR)',
			TermYears: 'Срок',
			OriginationFee: 'Комиссия за выдачу',
			OtherFees: 'Прочие комиссии',
		}[rest]
		if (restRu) return `Кредит ${letter}: ${restRu}`
	}
	const scenarioMatch = name.match(/^scenario(\d)(.+)$/)
	if (scenarioMatch) {
		const n = scenarioMatch[1]
		const rest = scenarioMatch[2]
		const restRu = {
			Name: 'Название',
			HomePrice: 'Цена жилья',
			DownPayment: 'Первоначальный взнос',
			AnnualInterestRate: 'Годовая ставка',
			TermYears: 'Срок',
			PropertyTax: 'Налог на недвижимость',
			Insurance: 'Страховка',
			HOA: 'Взносы ТСЖ',
			PMI: 'PMI',
		}[rest]
		if (restRu) return `Вариант ${n}: ${restRu}`
	}
	return enLabel
}

function translateUnit(unit) {
	if (!unit) return unit
	return UNIT_RU[unit] || unit.replace(/\$/g, '₽')
}

function translateOption(value, enLabel) {
	return OPTION_LABEL_RU[value] || OPTION_LABEL_RU[String(value).toLowerCase()] || enLabel
}

const outDir = path.join(process.cwd(), 'locales', 'ru', 'calculators', 'items')
mkdirSync(outDir, { recursive: true })

for (const slug of SLUGS) {
	const en = calculators.find((c) => c.slug === slug && c.locale === 'en')
	if (!en) {
		console.error('Missing EN definition:', slug)
		continue
	}

	const item = {
		title: TITLE_RU[slug],
		shortDescription: SHORT_RU[slug],
		longDescription: SHORT_RU[slug],
		inputs: en.inputs.map((input) => {
			const entry = {
				name: input.name,
				label: translateLabel(input.name, input.label),
			}
			if (input.placeholder) {
				entry.placeholder = 'Введите значение'
			}
			if (input.unitLabel) {
				entry.unitLabel = translateUnit(input.unitLabel)
			}
			if (input.helpText) {
				entry.helpText = input.helpText // keep brief; UI primarily uses label
			}
			if (input.options?.length) {
				entry.options = input.options.map((opt) => ({
					value: opt.value,
					label: translateOption(opt.value, opt.label),
				}))
			}
			return entry
		}),
		outputs: en.outputs.map((output) => ({
			name: output.name,
			label: translateLabel(output.name, output.label),
			...(output.unitLabel
				? { unitLabel: translateUnit(output.unitLabel) }
				: {}),
		})),
		howTo: [
			'Заполните поля формы',
			'Проверьте единицы измерения (₽, %, годы)',
			'Нажмите «Рассчитать»',
			'Сверьте основные и дополнительные результаты',
		],
		examples: (en.examples || []).slice(0, 2).map((ex, i) => ({
			title: `Пример ${i + 1}`,
			description: ex.inputDescription || ex.title || '',
			steps: ex.steps?.length
				? ex.steps.slice(0, 4).map((s) => String(s))
				: ['Введите исходные данные', 'Нажмите «Рассчитать»'],
			resultDescription: ex.resultDescription || 'См. результаты расчёта',
		})),
		faq: [
			{
				question: 'Насколько точен расчёт?',
				answer:
					'Калькулятор использует стандартные финансовые формулы. Реальные условия банка или брокера могут отличаться.',
			},
			{
				question: 'В какой валюте считаются суммы?',
				answer:
					'Подписи показывают рубли (₽); формула универсальна для любой валюты при согласованных единицах.',
			},
		],
		seo: {
			title: `${TITLE_RU[slug]} – First Calc`,
			description: SHORT_RU[slug],
			keywords: [TITLE_RU[slug], 'калькулятор', 'финансы', slug],
		},
	}

	const outPath = path.join(outDir, `${slug}.json`)
	writeFileSync(outPath, JSON.stringify(item, null, 2) + '\n', 'utf8')
	console.log('Wrote', outPath)
}

console.log('Done')
