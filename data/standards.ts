import type { StandardDefinition } from '@/lib/standards/types'

/**
 * Registry of all standard definitions
 * Add new standards here to make them available
 * Each standard can have multiple locale versions with the same id
 */
export const standards: StandardDefinition[] = [
	// Eurocode 1 - Actions on structures (EN)
	{
		id: 'eurocode-1',
		country: 'EU',
		slug: 'eurocode-1',
		locale: 'en',
		title: 'Eurocode 1: Actions on structures',
		shortDescription:
			'European standard for determining actions on structures, including loads and impacts.',
		longDescription:
			'Eurocode 1 provides design values of actions (imposed loads) for buildings and civil engineering works. It covers permanent actions, variable actions, accidental actions, and seismic actions.',
		formulas: [
			{
				title: 'Design value of actions',
				formula: 'F_d = γ_F × F_k',
			},
			{
				title: 'Combination of actions',
				formula: 'Σ(γ_G × G_k + γ_Q × Q_k)',
			},
		],
		tables: [
			{
				title: 'Partial safety factors for actions',
				rows: [
					['Action type', 'Permanent (γ_G)', 'Variable (γ_Q)'],
					['Unfavorable', '1.35', '1.5'],
					['Favorable', '1.0', '0'],
				],
			},
		],
		relatedCalculatorIds: ['loan-payment'],
		meta: {
			keywords: ['eurocode', 'structural engineering', 'loads', 'actions'],
			organization: 'CEN',
			year: 2002,
		},
	},
	// Eurocode 1 (RU)
	{
		id: 'eurocode-1',
		country: 'EU',
		slug: 'eurocode-1',
		locale: 'ru',
		title: 'Еврокод 1: Воздействия на конструкции',
		shortDescription:
			'Европейский стандарт для определения воздействий на конструкции, включая нагрузки и воздействия.',
		longDescription:
			'Еврокод 1 предоставляет расчетные значения воздействий (приложенных нагрузок) для зданий и инженерных сооружений. Он охватывает постоянные воздействия, переменные воздействия, случайные воздействия и сейсмические воздействия.',
		formulas: [
			{
				title: 'Расчетное значение воздействий',
				formula: 'F_d = γ_F × F_k',
			},
			{
				title: 'Комбинация воздействий',
				formula: 'Σ(γ_G × G_k + γ_Q × Q_k)',
			},
		],
		tables: [
			{
				title: 'Коэффициенты надежности по нагрузке',
				rows: [
					['Тип воздействия', 'Постоянное (γ_G)', 'Переменное (γ_Q)'],
					['Неблагоприятное', '1.35', '1.5'],
					['Благоприятное', '1.0', '0'],
				],
			},
		],
		relatedCalculatorIds: ['loan-payment'],
		meta: {
			keywords: ['еврокод', 'строительная инженерия', 'нагрузки', 'воздействия'],
			organization: 'CEN',
			year: 2002,
		},
	},
	// ISO 8601 - Date and time format (EN)
	{
		id: 'iso-8601',
		country: 'ISO',
		slug: 'iso-8601',
		locale: 'en',
		title: 'ISO 8601: Date and time representation',
		shortDescription:
			'International standard for date and time representation in data interchange.',
		longDescription:
			'ISO 8601 is an international standard covering the exchange of date and time-related data. It provides unambiguous date and time representations.',
		formulas: [
			{
				title: 'Date format',
				formula: 'YYYY-MM-DD',
			},
			{
				title: 'DateTime format',
				formula: 'YYYY-MM-DDTHH:mm:ss',
			},
		],
		relatedCalculatorIds: [],
		meta: {
			keywords: ['iso', 'date', 'time', 'format', 'standard'],
			organization: 'ISO',
			year: 2019,
		},
	},
]

/**
 * Get standard by ID and locale
 */
export function getStandardById(
	id: string,
	locale: string = 'en',
): StandardDefinition | undefined {
	return standards.find((std) => std.id === id && std.locale === locale)
}

/**
 * Get standard by country, slug, and locale
 */
export function getStandardBySlug(
	country: string,
	slug: string,
	locale: string = 'en',
): StandardDefinition | undefined {
	return standards.find(
		(std) =>
			std.country === country &&
			std.slug === slug &&
			std.locale === locale,
	)
}

/**
 * Get all standards for a specific locale
 */
export function getStandardsByLocale(
	locale: string = 'en',
): StandardDefinition[] {
	return standards.filter((std) => std.locale === locale)
}

/**
 * Get standards by country and locale
 */
export function getStandardsByCountry(
	country: string,
	locale: string = 'en',
): StandardDefinition[] {
	return standards.filter(
		(std) => std.country === country && std.locale === locale,
	)
}

/**
 * Get all unique countries for a locale
 */
export function getCountries(locale: string = 'en'): string[] {
	const countries = new Set<string>()
	standards
		.filter((std) => std.locale === locale)
		.forEach((std) => countries.add(std.country))
	return Array.from(countries).sort()
}
