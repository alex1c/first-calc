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
	// Eurocode 2 - Design of concrete structures (EN)
	{
		id: 'eurocode-2',
		country: 'EU',
		slug: 'eurocode-2',
		locale: 'en',
		title: 'Eurocode 2: Design of concrete structures',
		shortDescription:
			'European standard for the design of concrete structures, including buildings and civil engineering works.',
		longDescription:
			'Eurocode 2 provides rules for the design of concrete, reinforced concrete, and prestressed concrete structures. It covers material properties, structural analysis, design of members, and detailing requirements.',
		formulas: [
			{
				title: 'Concrete compressive strength',
				formula: 'f_cd = α_cc × f_ck / γ_c',
			},
			{
				title: 'Reinforcement yield strength',
				formula: 'f_yd = f_yk / γ_s',
			},
			{
				title: 'Moment capacity',
				formula: 'M_Rd = A_s × f_yd × (d - 0.5 × x)',
			},
		],
		tables: [
			{
				title: 'Partial safety factors for materials',
				rows: [
					['Material', 'Permanent (γ_c or γ_s)', 'Accidental (γ_c or γ_s)'],
					['Concrete', '1.5', '1.2'],
					['Reinforcing steel', '1.15', '1.0'],
					['Prestressing steel', '1.15', '1.0'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle'],
		meta: {
			keywords: ['eurocode', 'concrete', 'structural engineering', 'design'],
			organization: 'CEN',
			year: 2004,
		},
	},
	// Eurocode 2 (RU)
	{
		id: 'eurocode-2',
		country: 'EU',
		slug: 'eurocode-2',
		locale: 'ru',
		title: 'Еврокод 2: Проектирование бетонных конструкций',
		shortDescription:
			'Европейский стандарт для проектирования бетонных конструкций, включая здания и инженерные сооружения.',
		longDescription:
			'Еврокод 2 предоставляет правила для проектирования бетонных, железобетонных и предварительно напряженных бетонных конструкций. Он охватывает свойства материалов, структурный анализ, проектирование элементов и требования к деталировке.',
		formulas: [
			{
				title: 'Прочность бетона на сжатие',
				formula: 'f_cd = α_cc × f_ck / γ_c',
			},
			{
				title: 'Предел текучести арматуры',
				formula: 'f_yd = f_yk / γ_s',
			},
			{
				title: 'Несущая способность по моменту',
				formula: 'M_Rd = A_s × f_yd × (d - 0.5 × x)',
			},
		],
		tables: [
			{
				title: 'Коэффициенты надежности для материалов',
				rows: [
					['Материал', 'Постоянное (γ_c или γ_s)', 'Случайное (γ_c или γ_s)'],
					['Бетон', '1.5', '1.2'],
					['Арматурная сталь', '1.15', '1.0'],
					['Преднапряженная сталь', '1.15', '1.0'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle'],
		meta: {
			keywords: ['еврокод', 'бетон', 'строительная инженерия', 'проектирование'],
			organization: 'CEN',
			year: 2004,
		},
	},
	// Eurocode 3 - Design of steel structures (EN)
	{
		id: 'eurocode-3',
		country: 'EU',
		slug: 'eurocode-3',
		locale: 'en',
		title: 'Eurocode 3: Design of steel structures',
		shortDescription:
			'European standard for the design of steel structures, including buildings, bridges, and industrial structures.',
		longDescription:
			'Eurocode 3 provides rules for the design of steel structures. It covers material properties, structural analysis, design of members (beams, columns, connections), stability, and fire resistance.',
		formulas: [
			{
				title: 'Steel yield strength',
				formula: 'f_yd = f_y / γ_M0',
			},
			{
				title: 'Buckling resistance',
				formula: 'N_b,Rd = χ × A × f_y / γ_M1',
			},
			{
				title: 'Bending moment resistance',
				formula: 'M_c,Rd = W_pl × f_y / γ_M0',
			},
		],
		tables: [
			{
				title: 'Partial safety factors for steel',
				rows: [
					['Design situation', 'γ_M0', 'γ_M1', 'γ_M2'],
					['Persistent and transient', '1.0', '1.0', '1.25'],
					['Accidental', '1.0', '1.0', '1.1'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'exponent'],
		meta: {
			keywords: ['eurocode', 'steel', 'structural engineering', 'design'],
			organization: 'CEN',
			year: 2005,
		},
	},
	// Eurocode 3 (RU)
	{
		id: 'eurocode-3',
		country: 'EU',
		slug: 'eurocode-3',
		locale: 'ru',
		title: 'Еврокод 3: Проектирование стальных конструкций',
		shortDescription:
			'Европейский стандарт для проектирования стальных конструкций, включая здания, мосты и промышленные сооружения.',
		longDescription:
			'Еврокод 3 предоставляет правила для проектирования стальных конструкций. Он охватывает свойства материалов, структурный анализ, проектирование элементов (балки, колонны, соединения), устойчивость и огнестойкость.',
		formulas: [
			{
				title: 'Предел текучести стали',
				formula: 'f_yd = f_y / γ_M0',
			},
			{
				title: 'Устойчивость к продольному изгибу',
				formula: 'N_b,Rd = χ × A × f_y / γ_M1',
			},
			{
				title: 'Сопротивление изгибающему моменту',
				formula: 'M_c,Rd = W_pl × f_y / γ_M0',
			},
		],
		tables: [
			{
				title: 'Коэффициенты надежности для стали',
				rows: [
					['Расчетная ситуация', 'γ_M0', 'γ_M1', 'γ_M2'],
					['Постоянная и временная', '1.0', '1.0', '1.25'],
					['Случайная', '1.0', '1.0', '1.1'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'exponent'],
		meta: {
			keywords: ['еврокод', 'сталь', 'строительная инженерия', 'проектирование'],
			organization: 'CEN',
			year: 2005,
		},
	},
	// SP 20.13330 - Loads and impacts (RU)
	{
		id: 'sp-20-13330',
		country: 'RU',
		slug: 'sp-20-13330',
		locale: 'ru',
		title: 'СП 20.13330: Нагрузки и воздействия',
		shortDescription:
			'Российский строительный стандарт для определения нагрузок и воздействий на здания и сооружения.',
		longDescription:
			'СП 20.13330 устанавливает требования к определению нагрузок и воздействий на здания и сооружения. Стандарт охватывает постоянные, временные, особые нагрузки, а также климатические воздействия (ветер, снег, температура).',
		formulas: [
			{
				title: 'Расчетное значение нагрузки',
				formula: 'F_d = γ_f × F_n',
			},
			{
				title: 'Комбинация нагрузок',
				formula: 'Σ(γ_G × G_k + γ_Q × Q_k + γ_ψ × ψ × Q_k)',
			},
			{
				title: 'Ветровая нагрузка',
				formula: 'W_m = W_0 × k × c',
			},
		],
		tables: [
			{
				title: 'Коэффициенты надежности по нагрузке',
				rows: [
					['Тип нагрузки', 'γ_G (постоянная)', 'γ_Q (временная)'],
					['Неблагоприятная', '1.1', '1.2'],
					['Благоприятная', '0.9', '0'],
					['Особая', '1.0', '1.0'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle'],
		meta: {
			keywords: ['СП', 'нагрузки', 'воздействия', 'строительство', 'Россия'],
			organization: 'Минстрой России',
			year: 2016,
		},
	},
	// ISO 80000 - Quantities and units (EN)
	{
		id: 'iso-80000',
		country: 'ISO',
		slug: 'iso-80000',
		locale: 'en',
		title: 'ISO 80000: Quantities and units',
		shortDescription:
			'International standard defining physical quantities, their units, and mathematical relationships.',
		longDescription:
			'ISO 80000 is a series of international standards defining physical quantities, their units, symbols, and mathematical relationships. It covers space and time, mechanics, thermodynamics, electricity, and other physical quantities.',
		formulas: [
			{
				title: 'Area of rectangle',
				formula: 'A = l × w',
			},
			{
				title: 'Area of circle',
				formula: 'A = π × r²',
			},
			{
				title: 'Volume of cylinder',
				formula: 'V = π × r² × h',
			},
		],
		tables: [
			{
				title: 'SI base units',
				rows: [
					['Quantity', 'Unit', 'Symbol'],
					['Length', 'metre', 'm'],
					['Mass', 'kilogram', 'kg'],
					['Time', 'second', 's'],
					['Electric current', 'ampere', 'A'],
					['Temperature', 'kelvin', 'K'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle', 'square-root'],
		meta: {
			keywords: ['iso', 'quantities', 'units', 'SI', 'measurement'],
			organization: 'ISO',
			year: 2019,
		},
	},
	// ISO 80000 (RU)
	{
		id: 'iso-80000',
		country: 'ISO',
		slug: 'iso-80000',
		locale: 'ru',
		title: 'ISO 80000: Величины и единицы',
		shortDescription:
			'Международный стандарт, определяющий физические величины, их единицы и математические соотношения.',
		longDescription:
			'ISO 80000 — это серия международных стандартов, определяющих физические величины, их единицы, символы и математические соотношения. Он охватывает пространство и время, механику, термодинамику, электричество и другие физические величины.',
		formulas: [
			{
				title: 'Площадь прямоугольника',
				formula: 'A = l × w',
			},
			{
				title: 'Площадь круга',
				formula: 'A = π × r²',
			},
			{
				title: 'Объем цилиндра',
				formula: 'V = π × r² × h',
			},
		],
		tables: [
			{
				title: 'Основные единицы СИ',
				rows: [
					['Величина', 'Единица', 'Символ'],
					['Длина', 'метр', 'м'],
					['Масса', 'килограмм', 'кг'],
					['Время', 'секунда', 'с'],
					['Электрический ток', 'ампер', 'А'],
					['Температура', 'кельвин', 'К'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle', 'square-root'],
		meta: {
			keywords: ['iso', 'величины', 'единицы', 'СИ', 'измерение'],
			organization: 'ISO',
			year: 2019,
		},
	},
	// TSE 500 - Turkish concrete standard (EN)
	{
		id: 'tse-500',
		country: 'TR',
		slug: 'tse-500',
		locale: 'en',
		title: 'TSE 500: Requirements for design and construction of reinforced concrete structures',
		shortDescription:
			'Turkish standard for the design and construction of reinforced concrete structures.',
		longDescription:
			'TSE 500 provides requirements for the design and construction of reinforced concrete structures in Turkey. It covers material properties, structural analysis, design principles, and construction requirements for concrete buildings and civil engineering works.',
		formulas: [
			{
				title: 'Concrete design strength',
				formula: 'f_cd = 0.85 × f_ck / γ_c',
			},
			{
				title: 'Reinforcement design strength',
				formula: 'f_yd = f_yk / γ_s',
			},
			{
				title: 'Ultimate moment capacity',
				formula: 'M_u = A_s × f_yd × (d - a/2)',
			},
		],
		tables: [
			{
				title: 'Material safety factors',
				rows: [
					['Material', 'Safety factor (γ)'],
					['Concrete', '1.5'],
					['Reinforcing steel', '1.15'],
					['Prestressing steel', '1.15'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle'],
		meta: {
			keywords: ['tse', 'concrete', 'turkey', 'structural engineering'],
			organization: 'TSE',
			year: 2000,
		},
	},
	// TSE 500 (RU)
	{
		id: 'tse-500',
		country: 'TR',
		slug: 'tse-500',
		locale: 'ru',
		title: 'TSE 500: Требования к проектированию и строительству железобетонных конструкций',
		shortDescription:
			'Турецкий стандарт для проектирования и строительства железобетонных конструкций.',
		longDescription:
			'TSE 500 предоставляет требования к проектированию и строительству железобетонных конструкций в Турции. Он охватывает свойства материалов, структурный анализ, принципы проектирования и требования к строительству бетонных зданий и инженерных сооружений.',
		formulas: [
			{
				title: 'Расчетная прочность бетона',
				formula: 'f_cd = 0.85 × f_ck / γ_c',
			},
			{
				title: 'Расчетная прочность арматуры',
				formula: 'f_yd = f_yk / γ_s',
			},
			{
				title: 'Предельная несущая способность по моменту',
				formula: 'M_u = A_s × f_yd × (d - a/2)',
			},
		],
		tables: [
			{
				title: 'Коэффициенты надежности материалов',
				rows: [
					['Материал', 'Коэффициент надежности (γ)'],
					['Бетон', '1.5'],
					['Арматурная сталь', '1.15'],
					['Преднапряженная сталь', '1.15'],
				],
			},
		],
		relatedCalculatorIds: ['area-rectangle', 'area-circle'],
		meta: {
			keywords: ['tse', 'бетон', 'турция', 'строительная инженерия'],
			organization: 'TSE',
			year: 2000,
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
