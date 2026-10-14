/**
 * Decade hub body: purpose, adjacent navigation, sample entry points.
 * Does not emit 10_000 per-number links. Full chunk tables are out of scope.
 */

import Link from 'next/link'
import {
	getAdjacentDecadeHubs,
	type DecadeHub,
} from '@/lib/propisyu/decades'
import { NumberBaseNav } from '@/components/propisyu/number-base-nav'
import { localePath } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'

interface DecadeHubContentProps {
	locale: Locale
	hub: DecadeHub
}

/**
 * Build up to 10 evenly spaced sample money URLs inside the decade.
 * These are discovery links only — not a full enumeration.
 */
function sampleMoneySlugs(hub: DecadeHub): string[] {
	const samples: string[] = []
	const span = hub.end - hub.start
	const steps = 9
	for (let i = 0; i <= steps; i++) {
		const value = hub.start + Math.floor((span * i) / steps)
		samples.push(`${value}-00`)
	}
	return [...new Set(samples)]
}

export function DecadeHubContent({ locale, hub }: DecadeHubContentProps) {
	const { previous, next } = getAdjacentDecadeHubs(hub.start, hub.end)
	const samples = sampleMoneySlugs(hub)
	const converterHref = localePath(locale, '/chislo-propisyu')
	const isRu = locale === 'ru'

	return (
		<div className="space-y-10">
			<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<p className="mb-4 text-slate-700">
					{isRu ? (
						<>
							Страница диапазона <strong>{hub.slug}</strong> — часть
							исторической «Базы чисел». Здесь собрана навигация по соседним
							диапазонам и примеры сумм прописью внутри этого интервала.
						</>
					) : (
						<>
							Range page <strong>{hub.slug}</strong> is part of the historical
							number base. Use neighbouring ranges and sample amounts in words
							inside this interval.
						</>
					)}
				</p>
				<p className="text-sm text-slate-600">
					{isRu ? (
						<>
							Любую сумму в диапазоне можно открыть как{' '}
							<code className="rounded bg-slate-100 px-1">
								/chislo-propisyu/N-00
							</code>{' '}
							или через{' '}
							<Link
								href={converterHref}
								className="font-medium text-blue-700 hover:underline"
							>
								основной конвертер
							</Link>
							.
						</>
					) : (
						<>
							Any amount in the range can be opened as{' '}
							<code className="rounded bg-slate-100 px-1">
								/chislo-propisyu/N-00
							</code>{' '}
							or via the{' '}
							<Link
								href={converterHref}
								className="font-medium text-blue-700 hover:underline"
							>
								main converter
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

			<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold text-slate-900">
					{isRu ? 'Примеры сумм в диапазоне' : 'Sample amounts in this range'}
				</h2>
				<p className="mb-4 text-sm text-slate-600">
					{isRu
						? 'Неполный список (до 10 точек) для перехода к денежным страницам без генерации тысяч ссылок.'
						: 'A short list (up to 10 points) linking to money pages without generating thousands of URLs.'}
				</p>
				<ul className="flex flex-wrap gap-2">
					{samples.map((slug) => (
						<li key={slug}>
							<Link
								href={localePath(locale, `/chislo-propisyu/${slug}`)}
								className="inline-block rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-800 hover:border-blue-400 hover:text-blue-700"
							>
								{slug}
							</Link>
						</li>
					))}
				</ul>
			</section>

			<NumberBaseNav locale={locale} activeSlug={hub.slug} />
		</div>
	)
}
