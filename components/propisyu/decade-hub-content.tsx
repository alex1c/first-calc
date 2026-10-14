/**
 * Decade hub body: purpose, adjacent navigation, and server-rendered
 * sample spellings inside the range (not 10_000 links, not E3 chunks).
 */

import Link from 'next/link'
import {
	getAdjacentDecadeHubs,
	type DecadeHub,
} from '@/lib/propisyu/decades'
import { NumberBaseNav } from '@/components/propisyu/number-base-nav'
import { localePath } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'
import { numberToWordsRu } from '@/lib/numberToWordsRu'

interface DecadeHubContentProps {
	locale: Locale
	hub: DecadeHub
}

interface HubExample {
	value: number
	words: string
	href: string
}

/**
 * Pick a small set of useful integers inside [start, end]:
 * start, mid-ish points, and end — then spell them in Russian (content language
 * of the historical number base).
 */
function buildHubExamples(hub: DecadeHub, locale: Locale): HubExample[] {
	const span = hub.end - hub.start
	const candidates = [
		hub.start,
		hub.start + Math.min(1, span),
		hub.start + Math.floor(span * 0.25),
		hub.start + Math.floor(span * 0.5),
		hub.start + Math.floor(span * 0.75),
		hub.end,
	]
	const unique = [...new Set(candidates)].filter(
		(n) => n >= hub.start && n <= hub.end,
	)

	return unique.map((value) => ({
		value,
		words: numberToWordsRu(value),
		href: localePath(locale, `/chislo-propisyu/${value}`),
	}))
}

export function DecadeHubContent({ locale, hub }: DecadeHubContentProps) {
	const { previous, next } = getAdjacentDecadeHubs(hub.start, hub.end)
	const examples = buildHubExamples(hub, locale)
	const converterHref = localePath(locale, '/chislo-propisyu')
	const isRu = locale === 'ru'

	return (
		<div className="space-y-10">
			<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<p className="mb-4 text-slate-700">
					{isRu ? (
						<>
							Страница диапазона <strong>{hub.slug}</strong> — часть
							исторической «Базы чисел». Ниже — несколько чисел из этого
							интервала с правильным написанием прописью и ссылками на их
							страницы, плюс переход к соседним диапазонам.
						</>
					) : (
						<>
							Range page <strong>{hub.slug}</strong> is part of the historical
							Russian number base. Below are sample integers from this interval
							with Russian spellings and links, plus neighbouring ranges.
						</>
					)}
				</p>
				<p className="text-sm text-slate-600">
					{isRu ? (
						<>
							Полный конвертер:{' '}
							<Link
								href={converterHref}
								className="font-medium text-blue-700 hover:underline"
							>
								число прописью
							</Link>
							.
						</>
					) : (
						<>
							Full converter:{' '}
							<Link
								href={converterHref}
								className="font-medium text-blue-700 hover:underline"
							>
								number to words
							</Link>
							.
						</>
					)}
				</p>
			</section>

			<nav
				className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
				aria-label={isRu ? 'Соседние диапазоны' : 'Adjacent ranges'}
			>
				{previous ? (
					<Link
						href={localePath(locale, previous.pathname)}
						className="text-sm font-medium text-blue-700 hover:underline"
					>
						← {previous.slug}
					</Link>
				) : (
					<span className="text-sm text-slate-400">
						{isRu ? 'Начало базы' : 'Start of base'}
					</span>
				)}
				{next ? (
					<Link
						href={localePath(locale, next.pathname)}
						className="text-sm font-medium text-blue-700 hover:underline"
					>
						{next.slug} →
					</Link>
				) : (
					<span className="text-sm text-slate-400">
						{isRu ? 'Конец базы' : 'End of base'}
					</span>
				)}
			</nav>

			<section
				className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
				lang="ru"
			>
				<h2 className="mb-3 text-lg font-semibold text-slate-900">
					{isRu
						? 'Примеры написания чисел в диапазоне'
						: 'Sample spellings in this range'}
				</h2>
				<p className="mb-4 text-sm text-slate-600">
					{isRu
						? 'Серверно сформированные примеры (не полный перечень). Каждая строка ведёт на страницу числа.'
						: 'Server-rendered samples (not a full list). Each row links to that number’s page.'}
				</p>
				<ul className="divide-y divide-slate-100">
					{examples.map((example) => (
						<li
							key={example.value}
							className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between"
						>
							<Link
								href={example.href}
								className="font-medium text-blue-700 hover:underline"
							>
								{example.value.toLocaleString('ru-RU')}
							</Link>
							<span className="text-slate-800">{example.words}</span>
						</li>
					))}
				</ul>
			</section>

			<NumberBaseNav locale={locale} activeSlug={hub.slug} />
		</div>
	)
}
