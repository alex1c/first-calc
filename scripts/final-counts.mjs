import { calculatorRegistry } from '../lib/registry/loader.ts'
import { hasLocalizedCalculatorContent } from '../lib/i18n/content-availability.ts'

async function main() {
	const en = (await calculatorRegistry.getAll('en')).filter(
		(c) => c.isEnabled !== false,
	)
	const ru = (await calculatorRegistry.getAll('ru')).filter(
		(c) =>
			c.isEnabled !== false && hasLocalizedCalculatorContent('ru', c.slug),
	)
	const enOnly = en.filter(
		(c) => !hasLocalizedCalculatorContent('ru', c.slug),
	)
	console.log(
		JSON.stringify(
			{
				enActive: en.length,
				ruWorking: ru.length,
				enOnlyCount: enOnly.length,
				enOnly: enOnly.map((c) => `${c.category}/${c.slug}`),
				ruFinanceCount: ru.filter((c) => c.category === 'finance').length,
				ruFinance: ru
					.filter((c) => c.category === 'finance')
					.map((c) => c.slug)
					.sort(),
			},
			null,
			2,
		),
	)
}

await main()
