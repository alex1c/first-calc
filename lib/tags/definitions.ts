/**
 * Centralized tag definitions and taxonomy
 * Tags are organized into 3 logical groups: domain, topic, intent
 */

import type { Locale } from '@/lib/i18n'

export type TagGroup = 'domain' | 'topic' | 'intent'

export interface TagDefinition {
	id: string
	label: Record<Locale, string>
	group: TagGroup
}

/**
 * Domain tags - WHAT category/domain
 */
const domainTags: TagDefinition[] = [
	{
		id: 'math',
		label: { en: 'Math', ru: 'Математика', es: 'Matemáticas', tr: 'Matematik', hi: 'गणित' },
		group: 'domain',
	},
	{
		id: 'finance',
		label: { en: 'Finance', ru: 'Финансы', es: 'Finanzas', tr: 'Finans', hi: 'वित्त' },
		group: 'domain',
	},
	{
		id: 'construction',
		label: { en: 'Construction', ru: 'Строительство', es: 'Construcción', tr: 'İnşaat', hi: 'निर्माण' },
		group: 'domain',
	},
	{
		id: 'auto',
		label: { en: 'Auto', ru: 'Автомобили', es: 'Auto', tr: 'Otomobil', hi: 'ऑटो' },
		group: 'domain',
	},
	{
		id: 'health',
		label: { en: 'Health', ru: 'Здоровье', es: 'Salud', tr: 'Sağlık', hi: 'स्वास्थ्य' },
		group: 'domain',
	},
	{
		id: 'life',
		label: { en: 'Life', ru: 'Жизнь', es: 'Vida', tr: 'Yaşam', hi: 'जीवन' },
		group: 'domain',
	},
	{
		id: 'tools',
		label: { en: 'Tools', ru: 'Инструменты', es: 'Herramientas', tr: 'Araçlar', hi: 'उपकरण' },
		group: 'domain',
	},
	{
		id: 'compatibility',
		label: { en: 'Compatibility', ru: 'Совместимость', es: 'Compatibilidad', tr: 'Uyumluluk', hi: 'अनुकूलता' },
		group: 'domain',
	},
	{
		id: 'statistics',
		label: { en: 'Statistics', ru: 'Статистика', es: 'Estadísticas', tr: 'İstatistik', hi: 'सांख्यिकी' },
		group: 'domain',
	},
]

/**
 * Topic tags - ABOUT WHAT EXACTLY
 */
const topicTags: TagDefinition[] = [
	// Finance topics
	{
		id: 'loan',
		label: { en: 'Loan', ru: 'Кредит', es: 'Préstamo', tr: 'Kredi', hi: 'ऋण' },
		group: 'topic',
	},
	{
		id: 'mortgage',
		label: { en: 'Mortgage', ru: 'Ипотека', es: 'Hipoteca', tr: 'Mortgage', hi: 'बंधक' },
		group: 'topic',
	},
	{
		id: 'auto-loan',
		label: { en: 'Auto Loan', ru: 'Автокредит', es: 'Préstamo de Auto', tr: 'Araç Kredisi', hi: 'ऑटो लोन' },
		group: 'topic',
	},
	{
		id: 'investment',
		label: { en: 'Investment', ru: 'Инвестиции', es: 'Inversión', tr: 'Yatırım', hi: 'निवेश' },
		group: 'topic',
	},
	{
		id: 'savings',
		label: { en: 'Savings', ru: 'Накопления', es: 'Ahorros', tr: 'Tasarruf', hi: 'बचत' },
		group: 'topic',
	},
	{
		id: 'interest',
		label: { en: 'Interest', ru: 'Процент', es: 'Interés', tr: 'Faiz', hi: 'ब्याज' },
		group: 'topic',
	},
	{
		id: 'compound-interest',
		label: { en: 'Compound Interest', ru: 'Сложный процент', es: 'Interés Compuesto', tr: 'Bileşik Faiz', hi: 'चक्रवृद्धि ब्याज' },
		group: 'topic',
	},
	{
		id: 'roi',
		label: { en: 'ROI', ru: 'ROI', es: 'ROI', tr: 'ROI', hi: 'ROI' },
		group: 'topic',
	},
	{
		id: 'tax',
		label: { en: 'Tax', ru: 'Налог', es: 'Impuesto', tr: 'Vergi', hi: 'कर' },
		group: 'topic',
	},
	{
		id: 'retirement',
		label: { en: 'Retirement', ru: 'Пенсия', es: 'Jubilación', tr: 'Emeklilik', hi: 'सेवानिवृत्ति' },
		group: 'topic',
	},
	{
		id: 'salary',
		label: { en: 'Salary', ru: 'Зарплата', es: 'Salario', tr: 'Maaş', hi: 'वेतन' },
		group: 'topic',
	},
	{
		id: 'net-worth',
		label: { en: 'Net Worth', ru: 'Чистые активы', es: 'Patrimonio Neto', tr: 'Net Değer', hi: 'कुल संपत्ति' },
		group: 'topic',
	},
	{
		id: 'emergency-fund',
		label: { en: 'Emergency Fund', ru: 'Резервный фонд', es: 'Fondo de Emergencia', tr: 'Acil Durum Fonu', hi: 'आपातकालीन निधि' },
		group: 'topic',
	},
	// Math topics
	{
		id: 'percent',
		label: { en: 'Percent', ru: 'Процент', es: 'Porcentaje', tr: 'Yüzde', hi: 'प्रतिशत' },
		group: 'topic',
	},
	{
		id: 'area',
		label: { en: 'Area', ru: 'Площадь', es: 'Área', tr: 'Alan', hi: 'क्षेत्र' },
		group: 'topic',
	},
	{
		id: 'volume',
		label: { en: 'Volume', ru: 'Объём', es: 'Volumen', tr: 'Hacim', hi: 'आयतन' },
		group: 'topic',
	},
	{
		id: 'equation',
		label: { en: 'Equation', ru: 'Уравнение', es: 'Ecuación', tr: 'Denklem', hi: 'समीकरण' },
		group: 'topic',
	},
	{
		id: 'quadratic',
		label: { en: 'Quadratic', ru: 'Квадратное', es: 'Cuadrático', tr: 'İkinci Dereceden', hi: 'द्विघात' },
		group: 'topic',
	},
	{
		id: 'probability',
		label: { en: 'Probability', ru: 'Вероятность', es: 'Probabilidad', tr: 'Olasılık', hi: 'संभावना' },
		group: 'topic',
	},
	{
		id: 'pythagorean',
		label: { en: 'Pythagorean', ru: 'Пифагор', es: 'Pitagórico', tr: 'Pisagor', hi: 'पाइथागोरस' },
		group: 'topic',
	},
	// Construction topics
	{
		id: 'paint',
		label: { en: 'Paint', ru: 'Краска', es: 'Pintura', tr: 'Boya', hi: 'पेंट' },
		group: 'topic',
	},
	{
		id: 'primer',
		label: { en: 'Primer', ru: 'Грунтовка', es: 'Imprimación', tr: 'Astar', hi: 'प्राइमर' },
		group: 'topic',
	},
	{
		id: 'putty',
		label: { en: 'Putty', ru: 'Шпаклёвка', es: 'Masilla', tr: 'Macun', hi: 'पुट्टी' },
		group: 'topic',
	},
	{
		id: 'tile',
		label: { en: 'Tile', ru: 'Плитка', es: 'Azulejo', tr: 'Karo', hi: 'टाइल' },
		group: 'topic',
	},
	{
		id: 'laminate',
		label: { en: 'Laminate', ru: 'Ламинат', es: 'Laminado', tr: 'Laminat', hi: 'लैमिनेट' },
		group: 'topic',
	},
	{
		id: 'concrete',
		label: { en: 'Concrete', ru: 'Бетон', es: 'Hormigón', tr: 'Beton', hi: 'कंक्रीट' },
		group: 'topic',
	},
	{
		id: 'bricks',
		label: { en: 'Bricks', ru: 'Кирпич', es: 'Ladrillos', tr: 'Tuğla', hi: 'ईंटें' },
		group: 'topic',
	},
	{
		id: 'insulation',
		label: { en: 'Insulation', ru: 'Утеплитель', es: 'Aislamiento', tr: 'Yalıtım', hi: 'इन्सुलेशन' },
		group: 'topic',
	},
	{
		id: 'foundation',
		label: { en: 'Foundation', ru: 'Фундамент', es: 'Fundación', tr: 'Temel', hi: 'नींव' },
		group: 'topic',
	},
	{
		id: 'rebar',
		label: { en: 'Rebar', ru: 'Арматура', es: 'Refuerzo', tr: 'Donatı', hi: 'रिबार' },
		group: 'topic',
	},
	{
		id: 'stairs',
		label: { en: 'Stairs', ru: 'Лестница', es: 'Escaleras', tr: 'Merdiven', hi: 'सीढ़ियां' },
		group: 'topic',
	},
	{
		id: 'pipes',
		label: { en: 'Pipes', ru: 'Трубы', es: 'Tuberías', tr: 'Borular', hi: 'पाइप' },
		group: 'topic',
	},
	{
		id: 'electrical',
		label: { en: 'Electrical', ru: 'Электрика', es: 'Eléctrico', tr: 'Elektrik', hi: 'विद्युत' },
		group: 'topic',
	},
	// Health topics
	{
		id: 'bmi',
		label: { en: 'BMI', ru: 'ИМТ', es: 'IMC', tr: 'VKİ', hi: 'BMI' },
		group: 'topic',
	},
	{
		id: 'calories',
		label: { en: 'Calories', ru: 'Калории', es: 'Calorías', tr: 'Kalori', hi: 'कैलोरी' },
		group: 'topic',
	},
	{
		id: 'pregnancy',
		label: { en: 'Pregnancy', ru: 'Беременность', es: 'Embarazo', tr: 'Hamilelik', hi: 'गर्भावस्था' },
		group: 'topic',
	},
	{
		id: 'due-date',
		label: { en: 'Due Date', ru: 'Дата родов', es: 'Fecha de Parto', tr: 'Doğum Tarihi', hi: 'नियत तारीख' },
		group: 'topic',
	},
	{
		id: 'body-fat',
		label: { en: 'Body Fat', ru: 'Жировая масса', es: 'Grasa Corporal', tr: 'Vücut Yağı', hi: 'शरीर की चर्बी' },
		group: 'topic',
	},
	{
		id: 'heart-rate',
		label: { en: 'Heart Rate', ru: 'Пульс', es: 'Frecuencia Cardíaca', tr: 'Kalp Atışı', hi: 'हृदय गति' },
		group: 'topic',
	},
	// Auto topics
	{
		id: 'fuel',
		label: { en: 'Fuel', ru: 'Топливо', es: 'Combustible', tr: 'Yakıt', hi: 'ईंधन' },
		group: 'topic',
	},
	{
		id: 'fuel-consumption',
		label: { en: 'Fuel Consumption', ru: 'Расход топлива', es: 'Consumo de Combustible', tr: 'Yakıt Tüketimi', hi: 'ईंधन खपत' },
		group: 'topic',
	},
	{
		id: 'car-loan',
		label: { en: 'Car Loan', ru: 'Автокредит', es: 'Préstamo de Auto', tr: 'Araç Kredisi', hi: 'कार लोन' },
		group: 'topic',
	},
	{
		id: 'car-tax',
		label: { en: 'Car Tax', ru: 'Налог на авто', es: 'Impuesto de Auto', tr: 'Araç Vergisi', hi: 'कार कर' },
		group: 'topic',
	},
	{
		id: 'depreciation',
		label: { en: 'Depreciation', ru: 'Амортизация', es: 'Depreciación', tr: 'Amortisman', hi: 'मूल्यह्रास' },
		group: 'topic',
	},
	{
		id: 'maintenance',
		label: { en: 'Maintenance', ru: 'Обслуживание', es: 'Mantenimiento', tr: 'Bakım', hi: 'रखरखाव' },
		group: 'topic',
	},
	// Tools/Utilities topics
	{
		id: 'converter',
		label: { en: 'Converter', ru: 'Конвертер', es: 'Convertidor', tr: 'Dönüştürücü', hi: 'कनवर्टर' },
		group: 'topic',
	},
	{
		id: 'temperature',
		label: { en: 'Temperature', ru: 'Температура', es: 'Temperatura', tr: 'Sıcaklık', hi: 'तापमान' },
		group: 'topic',
	},
	{
		id: 'speed',
		label: { en: 'Speed', ru: 'Скорость', es: 'Velocidad', tr: 'Hız', hi: 'गति' },
		group: 'topic',
	},
	{
		id: 'length',
		label: { en: 'Length', ru: 'Длина', es: 'Longitud', tr: 'Uzunluk', hi: 'लंबाई' },
		group: 'topic',
	},
	{
		id: 'weight',
		label: { en: 'Weight', ru: 'Вес', es: 'Peso', tr: 'Ağırlık', hi: 'वजन' },
		group: 'topic',
	},
	{
		id: 'time',
		label: { en: 'Time', ru: 'Время', es: 'Tiempo', tr: 'Zaman', hi: 'समय' },
		group: 'topic',
	},
	{
		id: 'date',
		label: { en: 'Date', ru: 'Дата', es: 'Fecha', tr: 'Tarih', hi: 'तारीख' },
		group: 'topic',
	},
	{
		id: 'random',
		label: { en: 'Random', ru: 'Случайный', es: 'Aleatorio', tr: 'Rastgele', hi: 'यादृच्छिक' },
		group: 'topic',
	},
	{
		id: 'password',
		label: { en: 'Password', ru: 'Пароль', es: 'Contraseña', tr: 'Şifre', hi: 'पासवर्ड' },
		group: 'topic',
	},
	{
		id: 'qr',
		label: { en: 'QR Code', ru: 'QR-код', es: 'Código QR', tr: 'QR Kod', hi: 'QR कोड' },
		group: 'topic',
	},
	{
		id: 'crypto',
		label: { en: 'Crypto', ru: 'Криптовалюта', es: 'Cripto', tr: 'Kripto', hi: 'क्रिप्टो' },
		group: 'topic',
	},
	{
		id: 'number-to-words',
		label: { en: 'Number to Words', ru: 'Число прописью', es: 'Número a Palabras', tr: 'Sayıyı Kelimeye', hi: 'संख्या को शब्दों में' },
		group: 'topic',
	},
	{
		id: 'roman-numerals',
		label: { en: 'Roman Numerals', ru: 'Римские цифры', es: 'Números Romanos', tr: 'Roma Rakamları', hi: 'रोमन अंक' },
		group: 'topic',
	},
]

/**
 * Intent tags - WHY / PURPOSE
 */
const intentTags: TagDefinition[] = [
	{
		id: 'calculator',
		label: { en: 'Calculator', ru: 'Калькулятор', es: 'Calculadora', tr: 'Hesap Makinesi', hi: 'कैलकुलेटर' },
		group: 'intent',
	},
	{
		id: 'converter',
		label: { en: 'Converter', ru: 'Конвертер', es: 'Convertidor', tr: 'Dönüştürücü', hi: 'कनवर्टर' },
		group: 'intent',
	},
	{
		id: 'estimator',
		label: { en: 'Estimator', ru: 'Оценщик', es: 'Estimador', tr: 'Tahminci', hi: 'अनुमानक' },
		group: 'intent',
	},
	{
		id: 'planner',
		label: { en: 'Planner', ru: 'Планировщик', es: 'Planificador', tr: 'Planlayıcı', hi: 'योजनाकार' },
		group: 'intent',
	},
	{
		id: 'checker',
		label: { en: 'Checker', ru: 'Проверка', es: 'Verificador', tr: 'Kontrolcü', hi: 'चेकर' },
		group: 'intent',
	},
	{
		id: 'generator',
		label: { en: 'Generator', ru: 'Генератор', es: 'Generador', tr: 'Jeneratör', hi: 'जनरेटर' },
		group: 'intent',
	},
	{
		id: 'educational',
		label: { en: 'Educational', ru: 'Образовательный', es: 'Educativo', tr: 'Eğitici', hi: 'शैक्षिक' },
		group: 'intent',
	},
]

/**
 * All tag definitions
 */
export const tagDefinitions: TagDefinition[] = [
	...domainTags,
	...topicTags,
	...intentTags,
]

/**
 * Get tag definition by ID
 */
export function getTagDefinition(tagId: string): TagDefinition | undefined {
	return tagDefinitions.find((tag) => tag.id === tagId)
}

/**
 * Get tag label for a locale
 */
export function getTagLabel(tagId: string, locale: Locale = 'en'): string {
	const tag = getTagDefinition(tagId)
	if (!tag) return tagId
	return tag.label[locale] || tag.label.en
}

/**
 * Get all tags by group
 */
export function getTagsByGroup(group: TagGroup): TagDefinition[] {
	return tagDefinitions.filter((tag) => tag.group === group)
}

/**
 * Get domain tag for a category
 */
export function getDomainTagForCategory(category: string): string | undefined {
	const categoryToDomain: Record<string, string> = {
		finance: 'finance',
		math: 'math',
		construction: 'construction',
		auto: 'auto',
		health: 'health',
		everyday: 'life',
		business: 'finance',
		engineering: 'construction',
		tools: 'tools',
		compatibility: 'compatibility',
		statistics: 'statistics',
	}
	return categoryToDomain[category]
}

/**
 * Validate tag IDs
 */
export function validateTags(tagIds: string[]): { valid: boolean; invalid: string[] } {
	const validTagIds = new Set(tagDefinitions.map((tag) => tag.id))
	const invalid = tagIds.filter((id) => !validTagIds.has(id))
	return {
		valid: invalid.length === 0,
		invalid,
	}
}


