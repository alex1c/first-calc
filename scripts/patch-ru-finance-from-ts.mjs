/**
 * Rebuild RU item input/output overlays for TypeScript-backed finance
 * calculators so names, select options, and units match the live engines.
 * Labels are Russian; option values stay engine-compatible.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

// Invoked with: npx tsx scripts/patch-ru-finance-from-ts.mjs
const { calculators } = await import('../data/calculators.ts')

const OPTION_RU = {
	monthly: 'Ежемесячно',
	biweekly: 'Раз в две недели',
	'bi-weekly': 'Раз в две недели',
	weekly: 'Еженедельно',
	annually: 'Ежегодно',
	annual: 'Ежегодно',
	yearly: 'Ежегодно',
	quarterly: 'Ежеквартально',
	daily: 'Ежедневно',
	semiannually: 'Раз в полгода',
	'semi-annually': 'Раз в полгода',
	amount: 'Сумма (₽)',
	percentage: 'Процент (%)',
	annuity: 'Аннуитет (фиксированный платёж)',
	differentiated: 'Дифференцированный (снижающийся платёж)',
	amortizing: 'Аннуитет (амортизация)',
	'interest-only': 'Только проценты',
	compound: 'Сложные проценты',
	simple: 'Простые проценты',
	years: 'Годы',
	months: 'Месяцы',
	continuous: 'Непрерывно',
	beginning: 'В начале периода',
	end: 'В конце периода',
	true: 'Да',
	false: 'Нет',
	'one-time': 'Разовый',
	onetime: 'Разовый',
	recurring: 'Регулярный',
	fixed: 'Фиксированная сумма (₽)',
}

const LABEL_HINTS = {
	homePrice: 'Стоимость жилья',
	downPayment: 'Первоначальный взнос',
	downPaymentType: 'Тип первоначального взноса',
	loanTermYears: 'Срок кредита',
	interestRateAPR: 'Процентная ставка (годовая)',
	paymentFrequency: 'Периодичность платежей',
	propertyTax: 'Налог на имущество',
	propertyTaxType: 'Тип налога на имущество',
	homeInsurance: 'Страхование жилья',
	HOA: 'Взносы ТСЖ',
	extraMonthlyPayment: 'Дополнительный ежемесячный платёж',
	startDate: 'Дата начала',
	loanAmount: 'Сумма кредита',
	interestRate: 'Процентная ставка',
	loanTerm: 'Срок кредита',
	vehiclePrice: 'Цена автомобиля',
	tradeInValue: 'Стоимость trade-in',
	salesTax: 'Налог с продажи',
	fees: 'Комиссии',
	principal: 'Основная сумма',
	termMonths: 'Срок (месяцы)',
	termYears: 'Срок (годы)',
	extraPayment: 'Дополнительный платёж',
	monthlyPayment: 'Ежемесячный платёж',
	initialDeposit: 'Начальный вклад',
	monthlyContribution: 'Ежемесячный взнос',
	annualContribution: 'Ежегодный взнос',
	years: 'Срок (лет)',
	compoundingFrequency: 'Частота капитализации',
	interestType: 'Тип процентов',
	contributionTiming: 'Момент взноса',
	initialInvestment: 'Начальные инвестиции',
	monthlyAddition: 'Ежемесячное пополнение',
	expectedReturn: 'Ожидаемая доходность',
	investmentGain: 'Прибыль от инвестиций',
	costOfInvestment: 'Стоимость инвестиций',
	finalValue: 'Итоговая стоимость',
	amountInvested: 'Вложенная сумма',
	netProfit: 'Чистая прибыль',
	totalCost: 'Общая стоимость',
	gain: 'Прирост',
	investmentCost: 'Затраты на инвестиции',
	returnAmount: 'Сумма возврата',
	paymentType: 'Тип платежа',
	loanType: 'Тип кредита',
}

const PLACEHOLDER_RU = {
	number: 'Введите значение',
	select: 'Выберите вариант',
	date: 'Выберите дату',
}

const OUTPUT_LABEL_HINTS = {
	monthlyMortgagePayment: 'Ежемесячный платёж по ипотеке',
	totalMonthlyPayment: 'Общий ежемесячный платёж',
	loanAmount: 'Сумма кредита',
	totalInterest: 'Общие проценты',
	totalCost: 'Полная стоимость',
	payoffDate: 'Дата погашения',
	paymentBreakdown: 'Структура платежа',
	extraPaymentImpact: 'Эффект досрочных платежей',
	amortizationSchedule: 'График амортизации',
	formulaExplanation: 'Пояснение формулы',
	monthlyPayment: 'Ежемесячный платёж',
	totalPayments: 'Всего выплат',
	totalInterestPaid: 'Всего процентов',
	roi: 'ROI',
	roiPercentage: 'ROI (%)',
	netProfit: 'Чистая прибыль',
	finalBalance: 'Итоговый баланс',
	totalContributions: 'Сумма взносов',
	interestEarned: 'Начисленные проценты',
	futureValue: 'Будущая стоимость',
	totalInvested: 'Всего вложено',
	gain: 'Прирост',
}

function translateOption(value, enLabel) {
	const key = String(value)
	if (OPTION_RU[key] !== undefined) return OPTION_RU[key]
	if (OPTION_RU[key.toLowerCase()] !== undefined) {
		return OPTION_RU[key.toLowerCase()]
	}
	// Keep year labels like "15 years" → "15 лет"
	const yearsMatch = /^(\d+)\s*years?$/i.exec(enLabel || key)
	if (yearsMatch) return `${yearsMatch[1]} лет`
	const monthsMatch = /^(\d+)\s*months?$/i.exec(enLabel || key)
	if (monthsMatch) return `${monthsMatch[1]} мес.`
	// Dollar amount labels → rubles
	if (/\$/.test(enLabel || '')) {
		return (enLabel || key).replace(/\$/g, '₽')
	}
	return enLabel || key
}

function unitToRub(unit) {
	if (!unit) return unit
	return String(unit).replace(/\$/g, '₽')
}

function buildInputOverlay(input) {
	const overlay = {
		name: input.name,
		label: LABEL_HINTS[input.name] || input.label,
		unitLabel: unitToRub(input.unitLabel || ''),
		placeholder:
			input.type === 'select'
				? PLACEHOLDER_RU.select
				: input.type === 'date'
					? PLACEHOLDER_RU.date
					: PLACEHOLDER_RU.number,
		helpText: input.helpText || '',
	}
	if (input.options?.length) {
		overlay.options = input.options.map((opt) => ({
			value: opt.value,
			label: translateOption(opt.value, opt.label),
		}))
	}
	return overlay
}

function buildOutputOverlay(output) {
	return {
		name: output.name,
		label: OUTPUT_LABEL_HINTS[output.name] || output.label,
		unitLabel: unitToRub(output.unitLabel || ''),
	}
}

const SLUGS = [
	'mortgage-calculator',
	'auto-loan-calculator',
	'personal-loan-calculator',
	'loan-overpayment-calculator',
	'savings-calculator',
	'investment-calculator',
	'roi-calculator',
]

for (const slug of SLUGS) {
	const def = calculators.find((c) => c.slug === slug)
	if (!def) {
		console.warn('missing TS def', slug)
		continue
	}
	const itemPath = path.join('locales', 'ru', 'calculators', 'items', `${slug}.json`)
	if (!existsSync(itemPath)) {
		console.warn('missing RU item', slug)
		continue
	}
	const item = JSON.parse(readFileSync(itemPath, 'utf8'))
	const prevByName = new Map(
		(item.inputs || [])
			.filter((entry) => entry.name)
			.map((entry) => [entry.name, entry]),
	)
	const prevOutByName = new Map(
		(item.outputs || [])
			.filter((entry) => entry.name)
			.map((entry) => [entry.name, entry]),
	)

	item.inputs = def.inputs.map((input) => {
		const overlay = buildInputOverlay(input)
		const prev = prevByName.get(input.name)
		// Preserve previously translated RU strings when the field name matches.
		if (prev?.label) overlay.label = prev.label
		if (prev?.placeholder) overlay.placeholder = prev.placeholder
		if (prev?.helpText) overlay.helpText = prev.helpText
		if (prev?.unitLabel) overlay.unitLabel = unitToRub(prev.unitLabel)
		return overlay
	})
	item.outputs = def.outputs.map((output) => {
		const overlay = buildOutputOverlay(output)
		const prev = prevOutByName.get(output.name)
		if (prev?.label) overlay.label = prev.label
		if (prev?.unitLabel) overlay.unitLabel = unitToRub(prev.unitLabel)
		return overlay
	})
	writeFileSync(itemPath, JSON.stringify(item, null, '\t') + '\n', 'utf8')
	console.log(
		'patched',
		slug,
		'inputs',
		item.inputs.length,
		'selects',
		item.inputs.filter((i) => i.options).length,
	)
}
