/**
 * Patch RU calculator items: ensure input.name matches schema and select
 * options have Russian labels (P0 from RU i18n gap scan).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const OPTION_RU = {
	monthly: 'Ежемесячно',
	biweekly: 'Раз в две недели',
	'bi-weekly': 'Раз в две недели',
	weekly: 'Еженедельно',
	annually: 'Ежегодно',
	quarterly: 'Ежеквартально',
	daily: 'Ежедневно',
	annuity: 'Аннуитет (фиксированный платёж)',
	differentiated: 'Дифференцированный (снижающийся платёж)',
	compound: 'Сложные проценты',
	simple: 'Простые проценты',
	years: 'Годы',
	months: 'Месяцы',
	true: 'Да (валютный формат)',
	false: 'Нет (обычный)',
	'one-time': 'Разовый',
	onetime: 'Разовый',
}

const SLUGS = [
	'mortgage-calculator',
	'auto-loan-calculator',
	'personal-loan-calculator',
	'loan-overpayment-calculator',
	'savings-calculator',
	'investment-calculator',
	'roi-calculator',
	'numbers-to-words',
]

function translateOption(value, enLabel) {
	const key = String(value)
	return OPTION_RU[key] || OPTION_RU[key.toLowerCase()] || enLabel
}

for (const slug of SLUGS) {
	const schemaPath = path.join('data', 'calculators', `${slug}.json`)
	const itemPath = path.join('locales', 'ru', 'calculators', 'items', `${slug}.json`)
	if (!existsSync(schemaPath) || !existsSync(itemPath)) {
		console.warn('skip missing', slug)
		continue
	}
	const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
	const item = JSON.parse(readFileSync(itemPath, 'utf8'))
	const inputs = item.inputs || []

	schema.inputs.forEach((schemaInput, index) => {
		let entry = inputs.find((i) => i.name === schemaInput.name)
		if (!entry) {
			entry = inputs[index]
		}
		if (!entry) {
			entry = { name: schemaInput.name, label: schemaInput.name }
			inputs[index] = entry
		}
		entry.name = schemaInput.name
		if (schemaInput.options?.length) {
			entry.options = schemaInput.options.map((opt) => ({
				value: opt.value,
				label: translateOption(opt.value, opt.label),
			}))
		}
	})

	item.inputs = inputs
	writeFileSync(itemPath, JSON.stringify(item, null, '\t') + '\n', 'utf8')
	console.log('patched', slug)
}
