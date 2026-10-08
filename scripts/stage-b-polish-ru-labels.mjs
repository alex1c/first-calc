/**
 * Polish RU item input/output labels that are still English.
 */
import fs from 'node:fs'
import path from 'node:path'

const ruDir = path.join('locales', 'ru', 'calculators', 'items')

const map = {
	'Sales Tax': 'Налог с продаж',
	'Registration Fees': 'Регистрационные сборы',
	'Extended Warranty': 'Расширенная гарантия',
	'Gap Insurance': 'GAP-страховка',
	Sex: 'Пол',
	'Height Unit': 'Единица роста',
	Feet: 'Футы',
	Inches: 'Дюймы',
	'Weight Unit': 'Единица веса',
	Duration: 'Длительность',
	Intensity: 'Интенсивность',
	'Calculation Mode': 'Режим расчёта',
	'Income Rule': 'Правило дохода',
	'Loan APR': 'Ставка кредита (APR)',
	'Sales Tax or Fees': 'Налог или сборы',
	'Ownership Period': 'Срок владения',
	'Fuel Consumption': 'Расход топлива',
	'Purchase Type': 'Тип покупки',
	'Depreciation Model': 'Модель амортизации',
	'Mileage Per Year': 'Пробег в год',
	'Apply Mileage Impact': 'Учитывать влияние пробега',
	'Vehicle Age': 'Возраст автомобиля',
	'Vehicle Preset': 'Предустановка автомобиля',
	'Oil Changes Per Year': 'Замены масла в год',
	Condition: 'Состояние',
	'Mileage Baseline Per Year': 'Базовый пробег в год',
	'Mileage Penalty Per Extra Unit': 'Штраф за лишний пробег',
	Mode: 'Режим',
	'Distance Unit': 'Единица расстояния',
	'Fuel Used': 'Израсходовано топлива',
	'Fuel Unit': 'Единица топлива',
	'From Unit': 'Исходная единица',
	'Period Type': 'Тип периода',
	'Consumption Unit': 'Единица расхода',
	'Trip Type': 'Тип поездки',
	Currency: 'Валюта',
	Method: 'Метод',
	'Frame Size': 'Тип телосложения',
	'Investment Period': 'Срок инвестиций',
	'Compounding Frequency': 'Частота капитализации',
	'Interest Type': 'Тип процентов',
	'Comparison Period': 'Период сравнения',
	'Due at Signing': 'Платёж при подписании',
	'Lease Fees': 'Сборы по лизингу',
	'Daily Calories': 'Суточные калории',
	'Macro Distribution': 'Распределение БЖУ',
	'Protein Percentage': 'Доля белков',
	'Carbohydrates Percentage': 'Доля углеводов',
	'Fat Percentage': 'Доля жиров',
	'Origination Fee': 'Комиссия за выдачу',
	'Prepayment Penalty': 'Штраф за досрочное погашение',
	'Slab Length': 'Длина плиты',
	'Slab Width': 'Ширина плиты',
	'Slab Thickness': 'Толщина плиты',
	'Include Thickened Edge': 'Учитывать утолщённый край',
	'Edge Width': 'Ширина края',
	'Preferred Riser Height': 'Желаемая высота ступени',
	'Preferred Tread Depth': 'Желаемая ширина проступи',
	'Max Steps': 'Максимум ступеней',
	'Steps Count': 'Число шагов',
	'Stride Length': 'Длина шага',
	'Stride Unit': 'Единица длины шага',
	'Walking Speed': 'Скорость ходьбы',
	'Building Length': 'Длина здания',
	'Building Width': 'Ширина здания',
	'Strip Width': 'Ширина ленты',
	'Strip Height': 'Высота ленты',
	'Perimeter Only': 'Только периметр',
	'Surface Type': 'Тип поверхности',
	'Surface Length': 'Длина поверхности',
	'Surface Width': 'Ширина поверхности',
	'Tile Length': 'Длина плитки',
	'Tile Width': 'Ширина плитки',
	'Tire Lifespan': 'Ресурс шин',
	'Tire Type': 'Тип шин',
	'Trip Distance': 'Дистанция поездки',
	'Wall Width': 'Ширина стены',
	'Room Height': 'Высота комнаты',
	'Number of Walls': 'Число стен',
	'Subtract Openings': 'Вычесть проёмы',
	'Initial Investment': 'Начальная сумма',
	'Monthly Contribution': 'Ежемесячный взнос',
	'Annual Return Rate': 'Годовая доходность',
	'Time Horizon': 'Горизонт',
	'Extra Payment': 'Дополнительный платёж',
	'Remaining Term': 'Оставшийся срок',
	'Current Balance': 'Текущий остаток',
	'Payment Frequency': 'Частота платежей',
	'Generated Numbers': 'Сгенерированные числа',
	Range: 'Диапазон',
	Breakdown: 'Разбор',
	'Symbols Used': 'Использованные символы',
	Roots: 'Корни',
	Discriminant: 'Дискриминант',
	'Standard Deviation': 'Стандартное отклонение',
	Mean: 'Среднее',
	Variance: 'Дисперсия',
	'Number of Values': 'Число значений',
}

let updated = 0
for (const file of fs.readdirSync(ruDir).filter((f) => f.endsWith('.json'))) {
	const filePath = path.join(ruDir, file)
	const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
	let changed = false
	for (const collection of ['inputs', 'outputs']) {
		if (!Array.isArray(json[collection])) continue
		for (const item of json[collection]) {
			if (item.label && map[item.label]) {
				item.label = map[item.label]
				changed = true
			}
			if (typeof item.helpText === 'string' && /[A-Za-z]{4,}/.test(item.helpText) && !/[А-Яа-я]/.test(item.helpText)) {
				// Drop pure-English help text rather than leave misleading fallback
				item.helpText = ''
				changed = true
			}
			if (typeof item.placeholder === 'string' && /^Enter /i.test(item.placeholder)) {
				item.placeholder = 'Введите значение'
				changed = true
			}
		}
	}
	// Fix English Result: leftovers in nested strings
	const asText = JSON.stringify(json)
	if (asText.includes('Result:') || asText.includes('Click Calculate')) {
		const cleaned = JSON.parse(
			asText
				.replaceAll('Result:', 'Результат:')
				.replaceAll('Click Calculate', 'Нажмите «Рассчитать»')
				.replaceAll('Click the Calculate button', 'Нажмите «Рассчитать»'),
		)
		Object.assign(json, cleaned)
		changed = true
	}
	if (changed) {
		fs.writeFileSync(filePath, `${JSON.stringify(json, null, '\t')}\n`)
		updated += 1
		console.log('polished', file)
	}
}
console.log(JSON.stringify({ updated }, null, 2))
