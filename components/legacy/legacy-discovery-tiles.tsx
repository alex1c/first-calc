import Link from 'next/link'
import { calculatorRegistry } from '@/lib/registry/loader'
import type { Locale } from '@/lib/i18n'
import { hasLocalizedCalculatorContent } from '@/lib/i18n/content-availability'
import { localePath } from '@/lib/site-url'

const candidateCalculators = [
	{
		id: 'birth-date-compatibility',
		icon: '💞',
		fallbackDescription: 'Pair two birthdays for an instant compatibility score.',
	},
	{
		id: 'zodiac-compatibility',
		icon: '♊',
		fallbackDescription: 'Check how two zodiac signs line up.',
	},
	{
		id: 'age-calculator',
		icon: '⏳',
		fallbackDescription: 'See the exact age between a birth date and today.',
	},
	{
		id: 'date-difference-calculator',
		icon: '📅',
		fallbackDescription: 'Count days, weeks, or months between any two dates.',
	},
	{
		id: 'bmi-calculator',
		icon: '💡',
		fallbackDescription: 'Estimate body mass index with a quick check.',
	},
	{
		id: 'daily-calorie-needs-calculator',
		icon: '🔥',
		fallbackDescription: 'Approximate daily calorie targets based on activity.',
	},
] as const

interface DiscoveryItem {
	id: string
	title: string
	description: string
	icon: string
	url: string
}

async function loadCalculator(
	id: string,
	locale: Locale,
): Promise<DiscoveryItem | null> {
	const candidate = candidateCalculators.find((c) => c.id === id)
	if (!candidate) return null

	const enCalculator = await calculatorRegistry.getById(id, 'en')
	if (!enCalculator) return null

	const slug = enCalculator.slug
	const hasLocaleContent = hasLocalizedCalculatorContent(locale, slug)
	const calculator = hasLocaleContent
		? (await calculatorRegistry.getById(id, locale)) || enCalculator
		: enCalculator

	// Incomplete locales (es/tr/hi) must not get /es/calculators/... that 404 —
	// point discovery tiles at the English page that actually exists.
	const linkLocale: Locale = hasLocaleContent ? locale : 'en'

	return {
		id,
		title: calculator.title || id,
		description:
			calculator.shortDescription?.slice(0, 120) ||
			candidate.fallbackDescription,
		icon: candidate.icon,
		url: localePath(
			linkLocale,
			`/calculators/${calculator.category}/${calculator.slug}`,
		),
	}
}

export async function LegacyDiscoveryTiles({ locale }: { locale: Locale }) {
	const items: DiscoveryItem[] = []
	for (const candidate of candidateCalculators) {
		const calculator = await loadCalculator(candidate.id, locale)
		if (calculator) {
			items.push(calculator)
		}
		if (items.length >= 6) {
			break
		}
	}

	if (items.length === 0) {
		return null
	}

	const hasCompatibility = items.some((item) =>
		item.id.includes('compatibility'),
	)

	if (!hasCompatibility) {
		return null
	}

	return (
		<div className="mt-12 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-6 shadow-sm">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
					Try Something Interesting
				</p>
				<h2 className="text-2xl font-bold text-slate-900">
					Just for fun, you can also check:
				</h2>
			</div>
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				{items.slice(0, 6).map((item) => (
					<Link
						key={item.id}
						href={item.url}
						className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50"
					>
						<div className="text-2xl" aria-hidden>
							{item.icon}
						</div>
						<div>
							<p className="font-semibold text-slate-900 group-hover:text-indigo-700">
								{item.title}
							</p>
							<p className="text-sm text-slate-600">{item.description}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
